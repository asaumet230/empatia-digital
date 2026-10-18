"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Rocket } from "lucide-react";
import Image from "next/image";
import { DURATION, EASE, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import type { FeedPost } from "@/lib/content/estudiantes";
import { formatNumber, GAME } from "./shared";

/** A post in the made-up feed. The whole card is the button that boosts it. */
interface PostCardProps {
  post: FeedPost;
  state: "open" | "chosen" | "dimmed";
  /** The post with the most likes in its round: the one the algorithm "wants". */
  trending: boolean;
  onBoost: () => void;
}

export function PostCard({ post, state, trending, onBoost }: PostCardProps) {
  return (
    <button
      type="button"
      disabled={state !== "open"}
      aria-pressed={state === "chosen"}
      onClick={onBoost}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border-2 bg-navy text-left transition-[border-color,opacity,transform,box-shadow] duration-300",
        state === "open" && "cursor-pointer border-white/15 hover:-translate-y-1 hover:border-yellow hover:shadow-[0_20px_40px_-20px_rgb(255_242_0/0.5)]",
        state === "chosen" && "border-yellow shadow-[0_0_40px_rgb(255_242_0/0.35)]",
        state === "dimmed" && "border-white/5 opacity-35",
      )}
    >
      <span className="flex items-center gap-2.5 px-4 pt-3.5 pb-2.5">
        <span className="grid size-9 place-items-center rounded-full bg-white/10 text-lg">{post.avatar}</span>
        <span className="text-sm font-bold text-gray-light">{post.user}</span>
      </span>

      <span className="relative grid aspect-[4/3] place-items-center bg-linear-to-br from-[#1d3a52] via-[#142738] to-[#2a1f3d]">
        {post.image ? (
          <Image src={post.image} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
        ) : (
          <span aria-hidden="true" className="text-6xl leading-none md:text-7xl">
            {post.art}
          </span>
        )}
        {trending && (
          <span className="absolute top-3 right-3 rounded-full bg-[#FF6B6B] px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-white shadow-lg">
            🔥 {GAME.trending}
          </span>
        )}
        <AnimatePresence>
          {state === "chosen" && (
            <motion.span
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: transition(DURATION.base, 0, EASE.outExpo) }}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-4xl font-extrabold text-yellow drop-shadow-[0_4px_12px_rgb(0_0_0/0.8)] md:text-5xl"
            >
              +{formatNumber(post.likes)} ❤️
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      <span className="flex flex-1 flex-col px-4 pt-3 pb-4">
        <span className="flex-1 text-base font-semibold leading-snug text-white md:text-lg">{post.caption}</span>
        <span className="mt-3 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-base font-bold text-white md:text-lg">
            <Heart aria-hidden="true" className="size-4 fill-[#FF6B6B] text-[#FF6B6B]" strokeWidth={2} />
            {formatNumber(post.likes)}
            <span className="text-xs font-normal text-gray-muted">{GAME.estimate}</span>
          </span>
          {state === "open" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow px-3 py-1 text-sm font-bold text-navy-dark transition-transform group-hover:scale-105">
              <Rocket aria-hidden="true" className="size-4" strokeWidth={2.25} />
              {GAME.boost}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
