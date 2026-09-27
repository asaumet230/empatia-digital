/** Minimal className joiner (avoids pulling in clsx/tailwind-merge). */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
