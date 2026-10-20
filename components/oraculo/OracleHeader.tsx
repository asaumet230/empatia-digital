"use client";

import { ArrowLeft, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { HelpDialog } from "@/components/oraculo/HelpDialog";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";

/**
 * Top bar of every Oráculo screen. The help lines are always one tap away.
 * Going back to EmpatIA loses nothing: the session stays in this tab until it is closed.
 */
export function OracleHeader({ children }: { children?: ReactNode }) {
  const [help, setHelp] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-o-line bg-o-bg print:hidden">
      <div className="mx-auto flex h-16 max-w-3xl items-center gap-2 px-4 sm:px-6">
        <Link
          href="/"
          aria-label={ORACLE_TEXT.back}
          className="grid size-10 shrink-0 place-items-center rounded-full text-o-muted hover:bg-o-raised hover:text-o-text"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
        <p className="mr-auto leading-tight">
          <span className="block font-display text-lg font-bold tracking-[-0.02em]">{ORACLE_TEXT.name}</span>
          <span className="block text-xs text-o-muted">{ORACLE_TEXT.brand}</span>
        </p>
        {children}
        <button
          type="button"
          onClick={() => setHelp(true)}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-o-line px-3 text-sm font-semibold hover:bg-o-raised sm:px-4"
        >
          <LifeBuoy aria-hidden="true" className="size-4 text-o-help" />
          <span className="hidden sm:inline">{ORACLE_TEXT.chat.help}</span>
          <span className="sm:hidden">Ayuda</span>
        </button>
      </div>
      <HelpDialog open={help} onClose={() => setHelp(false)} />
    </header>
  );
}
