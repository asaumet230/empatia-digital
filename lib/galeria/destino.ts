import "server-only";
import { z } from "zod";
import type { ImageKind } from "@/lib/galeria/imagen";

/** Where gallery images end up: one Drive folder per school. */
export interface GalleryStore {
  save(image: { school: string; kind: ImageKind; bytes: Uint8Array }): Promise<void>;
}

export class GalleryStoreError extends Error {
  constructor() {
    super("No se pudo guardar la imagen");
    this.name = "GalleryStoreError";
  }
}

/**
 * Saves through a Google Apps Script web app that runs as the Fundación's Google account, so the
 * files land in its own Drive. The shared secret keeps anyone else from posting to the script.
 */
class AppsScriptStore implements GalleryStore {
  constructor(
    private readonly url: string,
    private readonly secret: string,
  ) {}

  async save({ school, kind, bytes }: Parameters<GalleryStore["save"]>[0]) {
    const response = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: this.secret, school, kind, data: Buffer.from(bytes).toString("base64") }),
      // Google can be slow on the first call of the day, or while it creates a school's folder
      signal: AbortSignal.timeout(50_000),
    }).catch(() => null);
    const result = await response?.json().catch(() => null);
    if (!response?.ok || result?.ok !== true) throw new GalleryStoreError();
  }
}

/** End-to-end tests and local tries: accepts everything and keeps nothing. */
class SimulatedStore implements GalleryStore {
  async save() {}
}

const EnvSchema = z.object({
  GALERIA_SCRIPT_URL: z.url().startsWith("https://script.google.com/"),
  GALERIA_SECRET: z.string().min(32),
});

/** `null` until the Drive script is set up: the page then says uploads are not open yet. */
export function getGalleryStore(): GalleryStore | null {
  if (process.env.GALERIA_SIMULADA === "1" && !process.env.VERCEL) return new SimulatedStore();
  const env = EnvSchema.safeParse(process.env);
  return env.success ? new AppsScriptStore(env.data.GALERIA_SCRIPT_URL, env.data.GALERIA_SECRET) : null;
}
