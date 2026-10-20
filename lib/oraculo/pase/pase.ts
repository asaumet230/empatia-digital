import "server-only";
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { ProfileSchema, SafetyKeySchema, type Message, type Profile } from "@/lib/oraculo/tipos";

/* ------------------------------------------------------------------ */
/*  The session "pass": the whole session state, signed by the        */
/*  server and kept by the browser. Nothing is stored on our side.     */
/*  The browser can read it but cannot change it: any edit breaks      */
/*  the signature. It also pins the conversation history by hash, so   */
/*  nobody can slip fake Oráculo replies into the context.             */
/* ------------------------------------------------------------------ */

const PassSchema = z.object({
  v: z.literal(1),
  /** Random id, only to tell sessions apart. It identifies nobody. */
  sid: z.uuid(),
  profile: ProfileSchema,
  startedAt: z.number().int().positive(),
  userMessages: z.number().int().nonnegative(),
  /** Set when the risk layer stops the conversation. Once set, it never goes back to null. */
  lock: SafetyKeySchema.nullable(),
  historyHash: z.string(),
});
export type Pass = z.infer<typeof PassSchema>;

export class PassError extends Error {
  constructor(reason: "malformado" | "firma" | "historial") {
    super(`Pase inválido: ${reason}`);
    this.name = "PassError";
  }
}

export const hashHistory = (history: readonly Message[]) =>
  createHash("sha256").update(JSON.stringify(history.map(({ role, text }) => [role, text]))).digest("base64url");

export function newPass(profile: Profile, now: number): Pass {
  return {
    v: 1,
    sid: randomUUID(),
    profile,
    startedAt: now,
    userMessages: 0,
    lock: null,
    historyHash: hashHistory([]),
  };
}

const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function encodePass(pass: Pass, secret: string): string {
  const payload = Buffer.from(JSON.stringify(pass)).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function decodePass(token: string, secret: string): Pass {
  const [payload, signature, ...rest] = token.split(".");
  if (!payload || !signature || rest.length > 0) throw new PassError("malformado");

  const expected = Buffer.from(sign(payload, secret));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) throw new PassError("firma");

  let data: unknown;
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    throw new PassError("malformado");
  }
  const parsed = PassSchema.safeParse(data);
  if (!parsed.success) throw new PassError("malformado");
  return parsed.data;
}

/** The history the browser sent must be exactly the one this pass was issued for. */
export function assertHistory(pass: Pass, history: readonly Message[]) {
  if (hashHistory(history) !== pass.historyHash) throw new PassError("historial");
}
