"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-green-bright px-5 py-3 font-bold text-navy-dark hover:brightness-105 print:hidden"
    >
      <Printer aria-hidden="true" className="size-4" />
      {label}
    </button>
  );
}
