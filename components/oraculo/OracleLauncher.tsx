"use client";

import Image from "next/image";
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
      className="group fixed bottom-3 left-3 z-50 inline-flex items-center gap-2 rounded-full border border-green-bright/50 bg-navy-deep/85 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)] backdrop-blur-md transition-colors hover:border-green-bright game-hides sm:bottom-5 sm:left-5 print:hidden [html[data-intro=booting]_&]:hidden"
    >
      <Image
        src="/assets/logos/oraculo.png"
        alt=""
        width={32}
        height={32}
        className="size-8 group-hover:animate-owl-turn group-focus-visible:animate-owl-turn"
      />
      {/* Both labels share one grid cell, so the button keeps its width when they swap */}
      <span className="hidden sm:grid">
        <span className="transition duration-300 [grid-area:1/1] group-hover:-translate-y-1 group-hover:opacity-0 group-focus-visible:-translate-y-1 group-focus-visible:opacity-0">
          {ORACLE_TEXT.launcher.label}
        </span>
        <span
          aria-hidden="true"
          className="translate-y-1 text-green-bright opacity-0 transition duration-300 [grid-area:1/1] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          {ORACLE_TEXT.launcher.hover}
        </span>
      </span>
      {/* Phones: the short name, swapped for the warm message on touch (the button grows with it) */}
      <span className="group-hover:hidden group-focus-visible:hidden sm:hidden">{ORACLE_TEXT.launcher.short}</span>
      <span aria-hidden="true" className="hidden text-green-bright group-hover:inline group-focus-visible:inline sm:hidden! sm:group-hover:hidden! sm:group-focus-visible:hidden!">
        {ORACLE_TEXT.launcher.hover}
      </span>
    </Link>
  );
}
