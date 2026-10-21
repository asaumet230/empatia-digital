import { ChevronLeft } from "lucide-react";
import Link from "next/link";

/** "‹ Volver" to a fixed place, such as the slide a page was opened from. */
export function BackButton({ href, label = "Volver" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full border border-white/15 py-2 pl-2.5 pr-4 text-sm font-semibold text-gray-light transition-colors hover:border-green-bright hover:text-green-bright"
    >
      <ChevronLeft aria-hidden="true" className="size-5" />
      {label}
    </Link>
  );
}
