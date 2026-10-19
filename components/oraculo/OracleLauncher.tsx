"use client";

import { MessageCircleHeart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";

/**
 * Floating entry to the Oráculo on every page, bottom-left (the other corners are taken by the
 * session menu and the pretest button). Hidden while a presentation intro plays, and on the
 * Oráculo pages themselves; it steps aside while the algorithm game's rounds run.
 */
export function OracleLauncher() {
  const pathname = usePathname();
  if (pathname.startsWith("/oraculo")) return null;

  return (
    <Link
      href="/oraculo"
      className="fixed bottom-3 left-3 z-50 inline-flex items-center gap-2 rounded-full border border-green-bright/50 bg-navy-deep/85 py-2.5 pl-3 pr-4 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)] backdrop-blur-md transition-colors hover:border-green-bright game-hides sm:bottom-5 sm:left-5 print:hidden [html[data-intro=booting]_&]:hidden"
    >
      <MessageCircleHeart aria-hidden="true" className="size-5 text-green-bright" strokeWidth={2} />
      <span className="hidden sm:inline">{ORACLE_TEXT.launcher.label}</span>
      <span className="sm:hidden">{ORACLE_TEXT.launcher.short}</span>
    </Link>
  );
}
