"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DURATION, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { Countdown } from "./Countdown";
import { PostCard } from "./PostCard";
import { AUTO_NEXT_MS, formatNumber, GAME, ROUNDS } from "./shared";

interface RoundStepProps {
  round: number;
  picked: number | null;
  /** Total so far, including this round's pick. */
  likes: number;
  onPick: (post: number) => void;
  onNext: () => void;
}

export function RoundStep({ round, picked, likes, onPick, onNext }: RoundStepProps) {
  const { title, seconds, posts } = ROUNDS[round];
  const boss = "boss" in ROUNDS[round] ? ROUNDS[round].boss : undefined;
  const [auto, setAuto] = useState(false);
  const next = useRef(onNext);
  // Phone: the posts are a swipeable carousel with arrows; from sm up, a grid
  const track = useRef<HTMLUListElement>(null);
  const [slide, setSlide] = useState(0);

  // Scrolls only the carousel, never the page
  const goTo = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: "smooth" });
  };

  const onScroll = () => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    // One step = a card plus the 1rem gap
    setSlide(Math.round(el.scrollLeft / (card.offsetWidth + 16)));
  };

  useEffect(() => {
    next.current = onNext;
  });

  // Once a post is boosted, the next round (or the result) comes by itself
  useEffect(() => {
    if (picked === null) return;
    const t = window.setTimeout(() => next.current(), AUTO_NEXT_MS);
    return () => window.clearTimeout(t);
  }, [picked]);

  // Time's up: the algorithm does what algorithms do — it shows what gets the most likes
  const pickByItself = () => {
    setAuto(true);
    const best = posts.reduce((top, post, i) => (post.likes > posts[top].likes ? i : top), 0);
    onPick(best);
  };

  const post = picked === null ? null : posts[picked];
  const missing = GAME.goal - likes;
  const topLikes = Math.max(...posts.map((p) => p.likes));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {boss ? (
          <div className="flex max-w-3xl items-start gap-4 rounded-2xl border-2 border-yellow/60 bg-yellow/10 p-4">
            <span className="text-4xl leading-none" aria-hidden="true">
              🤑
            </span>
            <span>
              <span className="block text-sm font-bold uppercase tracking-[0.08em] text-yellow">{boss.from}</span>
              <span className="mt-1 block text-lg font-semibold leading-snug text-white md:text-xl">{boss.text}</span>
            </span>
          </div>
        ) : (
          <div>
            <p className="font-display text-2xl font-bold leading-tight tracking-[-0.02em] md:text-3xl">{title}</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-base font-semibold text-yellow md:text-lg">
              {GAME.instruction}
            </p>
          </div>
        )}
        <Countdown seconds={seconds} running={picked === null} onTimeUp={pickByItself} />
      </div>

      <ul
        ref={track}
        onScroll={onScroll}
        className={cn(
          "-mx-6 mt-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0 md:gap-5 [&::-webkit-scrollbar]:hidden",
          posts.length === 2 ? "sm:grid-cols-2 lg:mx-auto lg:max-w-4xl" : "sm:grid-cols-3",
        )}
      >
        {posts.map((p, i) => (
          <li key={p.id} className="w-[85%] shrink-0 snap-start sm:w-auto">
            <PostCard
              post={p}
              state={picked === null ? "open" : picked === i ? "chosen" : "dimmed"}
              trending={p.likes === topLikes}
              onBoost={() => onPick(i)}
            />
          </li>
        ))}
      </ul>

      {/* Phone controls: arrows on the sides of the dots */}
      <div className="mt-4 flex items-center justify-between sm:hidden">
        <button
          type="button"
          aria-label="Publicación anterior"
          onClick={() => goTo(slide - 1)}
          disabled={slide === 0}
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/25 bg-white/[0.06] px-4 font-semibold text-white transition-colors disabled:opacity-30"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
          Anterior
        </button>
        <span className="flex items-center gap-2" aria-live="polite">
          {posts.map((p, i) => (
            <span
              key={p.id}
              aria-hidden="true"
              className={cn("h-1.5 rounded-full transition-all duration-300", i === slide ? "w-5 bg-yellow" : "w-1.5 bg-white/25")}
            />
          ))}
          <span className="sr-only">
            Publicación {slide + 1} de {posts.length}
          </span>
        </span>
        <button
          type="button"
          aria-label="Publicación siguiente"
          onClick={() => goTo(slide + 1)}
          disabled={slide === posts.length - 1}
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-yellow px-4 font-bold text-navy-dark transition-opacity disabled:opacity-30"
        >
          Siguiente
          <ArrowRight aria-hidden="true" className="size-5" />
        </button>
      </div>

      <AnimatePresence>
        {post && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: transition(DURATION.base, 0.5) }}
            className="mt-6"
          >
            <p className={cn("flex items-center gap-2 text-base font-semibold", auto ? "text-[#FF8A8A]" : "text-gray-text")}>
              {auto && <Timer aria-hidden="true" className="size-5" strokeWidth={2.25} />}
              {auto ? GAME.autoPick : `+${formatNumber(post.likes)} «me gusta». ${GAME.toGoal(missing)}`}
            </p>
            {/* Fills up while the next round loads by itself */}
            <div aria-hidden="true" className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full origin-left rounded-full bg-yellow"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1, transition: { duration: AUTO_NEXT_MS / 1000, ease: "linear" } }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
