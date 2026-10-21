/**
 * Only our own pages may call our APIs: blocks other sites from spending the OpenAI budget or
 * filling the gallery's Drive. A missing or opaque ("null") origin counts as foreign.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  return Boolean(origin && host && URL.canParse(origin) && new URL(origin).host === host);
}
