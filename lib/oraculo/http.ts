import "server-only";
import { z, type ZodType } from "zod";
import { LIMITS } from "@/lib/oraculo/config/limites";
import { InvalidMessageError } from "@/lib/oraculo/conversacion/orquestador";
import { AiUnavailableError } from "@/lib/oraculo/ia/modelo";
import { PassError } from "@/lib/oraculo/pase/pase";
import { MessageSchema } from "@/lib/oraculo/tipos";

/* ------------------------------------------------------------------ */
/*  Shared plumbing for the Oráculo route handlers: input checks and   */
/*  one error → status mapping. Logs carry an error code only, never   */
/*  a message, a history or a token.                                   */
/* ------------------------------------------------------------------ */

const MAX_BODY_BYTES = 150_000;

export const TokenSchema = z.string().min(1).max(4_000);
export const HistorySchema = z.array(MessageSchema).max(LIMITS.maxHistoryMessages);

class BadRequestError extends Error {}
class ForbiddenError extends Error {}

/** Only our own pages may call the API (blocks other sites from spending our OpenAI budget). */
function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || !URL.canParse(origin) || new URL(origin).host !== host) throw new ForbiddenError();
}

async function readBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) throw new BadRequestError();
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) throw new BadRequestError();

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new BadRequestError();
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) throw new BadRequestError();
  return parsed.data;
}

const NO_STORE = { "Cache-Control": "no-store" };

function errorResponse(error: unknown) {
  const [status, code] =
    error instanceof ForbiddenError
      ? [403, "origen_no_permitido"]
      : error instanceof BadRequestError
        ? [400, "solicitud_invalida"]
        : error instanceof InvalidMessageError
          ? [400, "mensaje_invalido"]
          : error instanceof PassError
            ? [401, "sesion_invalida"]
            : error instanceof AiUnavailableError
              ? [error.kind === "timeout" ? 504 : 503, "ia_no_disponible"]
              : [500, "error_interno"];
  console.error(`[oraculo] ${code}`, error instanceof AiUnavailableError ? error.kind : "");
  return Response.json({ error: code }, { status, headers: NO_STORE });
}

/** Wraps a POST handler: same-origin check, body validation, JSON reply, error mapping. */
export function postHandler<T>(schema: ZodType<T>, run: (body: T) => Promise<unknown> | unknown) {
  return async (request: Request) => {
    try {
      assertSameOrigin(request);
      const result = await run(await readBody(request, schema));
      return Response.json(result, { headers: NO_STORE });
    } catch (error) {
      return errorResponse(error);
    }
  };
}
