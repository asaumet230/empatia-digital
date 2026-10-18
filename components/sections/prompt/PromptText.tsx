import { cn } from "@/lib/cn";

/**
 * A heading is a line in capitals, alone ("OBJETIVO") or before a colon ("ROL: Eres…").
 * At least three letters, so "1." or "A" never count.
 */
const HEADING = /^([A-ZÁÉÍÓÚÑÜ][A-ZÁÉÍÓÚÑÜ ]{2,})(?::\s*(.*))?$/;

interface Block {
  label: string | null;
  lines: string[];
}

/** Splits a prompt into blocks, each under the heading that opens it (the first may have none). */
function toBlocks(text: string): Block[] {
  const blocks: Block[] = [{ label: null, lines: [] }];
  for (const line of text.split("\n")) {
    const match = HEADING.exec(line.trim());
    if (match) {
      blocks.push({ label: match[1].trim(), lines: match[2] ? [match[2]] : [] });
    } else {
      blocks[blocks.length - 1].lines.push(line);
    }
  }
  return blocks
    .map((b) => ({ ...b, lines: trimBlank(b.lines) }))
    .filter((b) => b.label !== null || b.lines.length > 0);
}

const trimBlank = (lines: string[]) => {
  let start = 0;
  let end = lines.length;
  while (start < end && !lines[start].trim()) start++;
  while (end > start && !lines[end - 1].trim()) end--;
  return lines.slice(start, end);
};

/**
 * The prompt as readable text, with each part (ROL, CONTEXTO, OBJETIVO…) labeled in green, as in
 * "Arma tu prompt". Only the display changes: what is copied is the plain text.
 */
export function PromptText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {toBlocks(text).map((block, i) => (
        <div key={i}>
          {block.label && (
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-green-bright">{block.label}</p>
          )}
          {block.lines.length > 0 && (
            <p className={cn("whitespace-pre-wrap", block.label && "mt-1")}>{block.lines.join("\n")}</p>
          )}
        </div>
      ))}
    </div>
  );
}
