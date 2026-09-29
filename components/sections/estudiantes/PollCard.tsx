"use client";

import { motion } from "framer-motion";
import { Vote } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { POLL_HINT, type Poll } from "@/lib/content/estudiantes";

/** A class vote, projected: the question and its options, big enough to read from the back row. */
export function PollCard({ poll, className }: { poll: Poll; className?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn("rounded-2xl border border-yellow/30 bg-yellow/[0.04] p-5 md:p-7", className)}
    >
      <p className="flex items-center justify-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-yellow">
        <Vote aria-hidden="true" className="size-4" strokeWidth={1.75} />
        {POLL_HINT}
      </p>
      <p className="mt-3 font-display text-xl font-bold leading-tight tracking-[-0.02em] md:text-2xl">
        {poll.question}
      </p>
      {poll.options.length > 0 ? (
        <ul className="mt-5 grid gap-2.5">
          {poll.options.map(({ mark, text }) => (
            <li
              key={text}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-navy-dark/60 px-4 py-3 text-base font-semibold text-gray-light md:text-lg"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.07] font-mono text-sm text-white">
                {mark}
              </span>
              {text}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-gray-muted">Respuesta abierta</p>
      )}
    </motion.div>
  );
}
