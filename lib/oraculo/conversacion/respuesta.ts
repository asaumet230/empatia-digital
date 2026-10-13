import { AiUnavailableError } from "@/lib/oraculo/ia/modelo";

/**
 * The UI shows plain text. The prompts already ask for it; this catches what slips through:
 * bold/italic marks, headings and runs of blank lines.
 */
export function cleanReply(text: string): string {
  const clean = text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[*•]\s+/gm, "- ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!clean) throw new AiUnavailableError("vacio");
  return clean;
}
