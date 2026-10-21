import { SCHOOLS } from "@/lib/content/colegios";
import type { UploadErrorCode } from "@/lib/content/galeria";
import { getGalleryStore } from "@/lib/galeria/destino";
import { detectImage, MAX_IMAGE_BYTES } from "@/lib/galeria/imagen";
import { isSameOrigin } from "@/lib/mismo-origen";

// The Drive script can take a while on its first call or when it creates a school's folder
export const maxDuration = 60;

const SCHOOL_NAMES = new Map(SCHOOLS.map((s) => [s.dane, s.name]));
/** Room for the form fields around the image. */
const MAX_BODY_BYTES = MAX_IMAGE_BYTES + 50_000;

const fail = (error: UploadErrorCode, status: number) =>
  Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

/** One gallery image: checks who sends it, the school and that it really is an image, then saves it. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail("origen", 403);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return fail("tamano", 413);

  const form = await request.formData().catch(() => null);
  const school = SCHOOL_NAMES.get(String(form?.get("colegio") ?? ""));
  const file = form?.get("imagen");
  if (!school) return fail("colegio", 400);
  if (!(file instanceof File)) return fail("tipo", 400);
  if (file.size > MAX_IMAGE_BYTES) return fail("tamano", 413);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = detectImage(bytes);
  if (!kind) return fail("tipo", 415);

  const store = getGalleryStore();
  if (!store) return fail("no_configurada", 503);
  try {
    await store.save({ school, kind, bytes });
  } catch {
    console.error("[galeria] fallo_guardando");
    return fail("fallo", 502);
  }
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
