"use client";

import { ArrowLeft, LifeBuoy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { HelpDialog } from "@/components/oraculo/HelpDialog";
import { ThemeButton } from "@/components/oraculo/ThemeButton";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";

/**
 * Top bar of every Oráculo screen. The help lines are always one tap away.
 * Going back to EmpatIA loses nothing: the session stays in this tab until it is closed.
 */
export function OracleHeader({ children }: { children?: ReactNode }) {
  const [help, setHelp] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-o-line bg-o-bar print:hidden">
      <div className="mx-auto flex h-16 max-w-3xl items-center gap-1.5 px-3 sm:gap-2 sm:px-6">
        {/* The arrow and the name are one link back to EmpatIA's home */}
        <Link
          href="/"
          aria-label={ORACLE_TEXT.back}
          className="group -ml-1 mr-auto flex min-w-0 items-center gap-1.5 rounded-2xl py-1 pl-0.5 pr-2 hover:bg-o-raised sm:-ml-2 sm:gap-2 sm:pr-3"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-full text-o-muted transition-transform group-hover:-translate-x-0.5 group-hover:text-o-text sm:size-8">
            <ArrowLeft aria-hidden="true" className="size-5" />
          </span>
          <Image src="/assets/logos/oraculo.png" alt="" width={36} height={36} className="size-8 shrink-0 sm:size-9" />
          <span className="min-w-0 leading-tight">
            <span className="block font-display text-base font-bold tracking-[-0.02em] text-o-owl sm:text-lg">
              {ORACLE_TEXT.name}
            </span>
            <Brand />
          </span>
        </Link>
        {children}
        <button
          type="button"
          onClick={() => setHelp(true)}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-o-strong bg-o-surface px-2.5 text-sm font-semibold shadow-sm hover:bg-o-raised sm:gap-2 sm:px-4"
        >
          <LifeBuoy aria-hidden="true" className="size-4 text-o-help" />
          <span className="hidden sm:inline">{ORACLE_TEXT.chat.help}</span>
          <span className="sm:hidden">Ayuda</span>
        </button>
        <ThemeButton />
      </div>
      <HelpDialog open={help} onClose={() => setHelp(false)} />
    </header>
  );
}

/** "EmpatIA Digital" with the IA in the brand green, as on the rest of the site. */
function Brand() {
  const [before, after] = ORACLE_TEXT.brand.split("IA");
  return (
    <span className="block whitespace-nowrap text-xs font-semibold text-o-muted">
      {before}
      <span className="text-o-accent">IA</span>
      {after}
    </span>
  );
}
