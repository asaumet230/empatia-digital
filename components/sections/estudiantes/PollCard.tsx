"use client";

import { motion } from "framer-motion";
import { Hand, MessageSquareText, Vote } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/cn";
import type { Poll } from "@/lib/content/estudiantes";

/** A class vote, projected: the question and its options, big enough to read from the back row. */
export function PollCard({ poll, className }: { poll: Poll; className?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "rounded-3xl border border-yellow/30 bg-linear-to-b from-yellow/[0.07] to-yellow/[0.02] p-5 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] md:p-7",
        className,
      )}
    >
      {/* How to vote: two clear options instead of one line of small caps */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow/15 px-3 py-1 text-xs font-semibold text-yellow">
          <Vote aria-hidden="true" className="size-3.5" strokeWidth={2} />
          Vota en Mentimeter
        </span>
        <span className="text-xs text-gray-text">o</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow/15 px-3 py-1 text-xs font-semibold text-yellow">
          <Hand aria-hidden="true" className="size-3.5" strokeWidth={2} />
          A mano alzada
        </span>
      </div>
      <p className="mt-4 font-display text-xl font-bold leading-tight tracking-[-0.02em] md:text-2xl">
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
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-sm text-gray-light">
          <MessageSquareText aria-hidden="true" className="size-4 text-gray-text" strokeWidth={2} />
          Respuesta abierta
        </p>
      )}
    </motion.div>
  );
}
