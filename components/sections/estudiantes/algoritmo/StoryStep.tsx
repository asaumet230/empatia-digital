"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GAME, harmLevel, PrimaryButton, swap } from "./shared";

/** The case told in pictures, one scene at a time, so the presenter can narrate it (← → also work). */
export function StoryStep({ harm, onNext }: { harm: number; onNext: () => void }) {
  const { story } = GAME;
  const [scene, setScene] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const last = story.scenes.length - 1;
  const current = story.scenes[scene];

  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight") setScene((s) => Math.min(s + 1, last));
      if (e.key === "ArrowLeft") setScene((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, last]);

  return (
    <div ref={ref} className="mx-auto max-w-6xl">
      <p className="text-center font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold tracking-[-0.03em] text-yellow">
        {story.title}
      </p>
      <div className="mt-6 grid items-center gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={scene}
            {...swap}
            className="overflow-hidden rounded-3xl border border-white/10 bg-black/40"
          >
            <Image
              src={current.image}
              alt={current.text}
              width={current.width}
              height={current.height}
              sizes="(min-width: 1024px) 60vw, 100vw"
              priority={scene === 0}
              className="mx-auto h-auto max-h-[62svh] w-auto"
            />
          </motion.div>
        </AnimatePresence>
        <div>
          <p className="font-mono text-sm font-bold tracking-[0.16em] text-green-bright">
            {scene + 1} / {story.scenes.length}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={scene} {...swap}>
              <p className="mt-3 text-xl font-medium leading-snug text-white md:text-2xl">{current.text}</p>
              {scene === last && (
                <p className="mt-5 rounded-2xl border border-yellow/40 bg-yellow/[0.05] p-4 text-lg font-semibold leading-snug text-yellow">
                  {story[harmLevel(harm)]}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setScene(scene - 1)}
              disabled={scene === 0}
              aria-label={story.prev}
              className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 font-semibold text-gray-light transition-colors hover:border-white/50 hover:text-white disabled:cursor-default disabled:opacity-30"
            >
              <ArrowLeft aria-hidden="true" className="size-5" />
              Anterior
            </button>
            {scene < last ? (
              <button
                type="button"
                onClick={() => setScene(scene + 1)}
                className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-xl bg-green-bright px-5 font-bold text-navy-dark shadow-[0_10px_30px_-12px_rgb(53_201_94/0.7)] transition-[filter] hover:brightness-110"
              >
                Siguiente
                <ArrowRight aria-hidden="true" className="size-5" />
              </button>
            ) : (
              <PrimaryButton onClick={onNext}>
                {story.next}
                <ArrowRight aria-hidden="true" className="size-5" strokeWidth={2} />
              </PrimaryButton>
            )}
            <span className="ml-1 hidden text-sm text-gray-text [@media(hover:hover)]:inline">o usa las flechas ← →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
