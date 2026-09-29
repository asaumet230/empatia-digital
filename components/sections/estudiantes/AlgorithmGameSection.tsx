"use client";

import { animate, AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, Heart, Play, Rocket, RotateCcw, Timer } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, EASE, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { ALGORITHM_GAME, type FeedPost } from "@/lib/content/estudiantes";
import type { SectionProps } from "@/types/presentation";

type Stage = "inicio" | number | "resultado" | "valentina" | "leccion";

const GAME = ALGORITHM_GAME;
const ROUNDS = GAME.rounds;
const EMPTY: readonly (number | null)[] = ROUNDS.map(() => null);
/** How long a round's outcome stays on screen before the next round starts by itself. */
const AUTO_NEXT_MS = 2500;

const formatNumber = (n: number) => n.toLocaleString("es-CO");

const swap = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: transition(DURATION.base) },
  exit: { opacity: 0, y: -10, filter: "blur(6px)", transition: transition(DURATION.fast, 0, EASE.inOutQuint) },
};

/**
 * "Tú eres el algoritmo": the class plays the feed of a made-up app. Each round they boost one
 * post, against a clock that gets shorter; mocking Valentina always pays the most «me gusta».
 * The cost stays hidden until the end, when her messages appear. If time runs out, the algorithm
 * picks by itself — the post with the most likes. Nothing is stored or sent.
 */
export function AlgorithmGameSection({ id, index, label }: SectionProps) {
  const [stage, setStage] = useState<Stage>("inicio");
  const [picks, setPicks] = useState(EMPTY);
  const started = useRef(false);

  const chosen: FeedPost[] = picks.flatMap((p, i) => (p === null ? [] : [ROUNDS[i].posts[p]]));
  const likes = chosen.reduce((sum, post) => sum + post.likes, 0);
  const harm = chosen.reduce((sum, post) => sum + post.harm, 0);

  // On a phone the round is taller than the screen: bring its top back into view on every change
  useEffect(() => {
    if (!started.current) {
      started.current = true;
      return;
    }
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [id, stage]);

  const restart = () => {
    setPicks(EMPTY);
    setStage(0);
  };

  const playing = typeof stage === "number";

  return (
    <Section id={id} label={label} className="grain flex items-center overflow-hidden bg-navy-dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgb(255_107_107/0.12)_0%,transparent_50%),radial-gradient(ellipse_at_10%_90%,rgb(36_157_74/0.12)_0%,transparent_50%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 md:px-16 lg:py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow index={index}>{label}</Eyebrow>
            {/* Only on the start screen: after that, every step needs the room */}
            <h2
              className={cn(
                "font-display font-bold leading-[1.05] tracking-[-0.03em]",
                stage === "inicio" ? "mt-4 text-[clamp(1.5rem,3vw,2.5rem)]" : "sr-only",
              )}
            >
              🤖 {GAME.title}
            </h2>
          </div>
          {playing && (
            <div className="flex items-end gap-6">
              <LikesCard value={likes} />
              <RoundProgress current={stage} />
            </div>
          )}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={stage} {...swap} className="mt-6 md:mt-8">
            {stage === "inicio" ? (
              <StartStep onStart={() => setStage(0)} />
            ) : typeof stage === "number" ? (
              <RoundStep
                round={stage}
                picked={picks[stage]}
                likes={likes}
                onPick={(post) => setPicks((prev) => prev.map((p, i) => (i === stage ? post : p)))}
                onNext={() => setStage(stage + 1 < ROUNDS.length ? stage + 1 : "resultado")}
              />
            ) : stage === "resultado" ? (
              <ResultStep likes={likes} onNext={() => setStage("valentina")} />
            ) : stage === "valentina" ? (
              <ValentinaStep harm={harm} chosen={chosen} onNext={() => setStage("leccion")} />
            ) : (
              <LessonStep onRestart={restart} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}

function StartStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-[50svh] flex-col items-center justify-center text-center">
      <button
        type="button"
        onClick={onStart}
        className="inline-flex cursor-pointer items-center gap-4 rounded-full bg-green-bright px-10 py-5 font-display text-2xl font-bold text-navy-dark shadow-[0_0_40px_rgb(53_201_94/0.35)] transition-[filter,transform] hover:scale-[1.03] hover:brightness-110 md:text-3xl"
      >
        <Play aria-hidden="true" className="size-7 fill-current" strokeWidth={2} />
        {GAME.start}
      </button>
      <div className="mt-10 w-full max-w-3xl text-left">
        <p className="hud-label text-center">{GAME.howToTitle}</p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {GAME.howTo.map(({ mark, text }, i) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: transition(DURATION.base, 0.2 + i * 0.1) }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-navy/70 p-4"
            >
              <span aria-hidden="true" className="text-3xl leading-none">
                {mark}
              </span>
              <span className="text-base font-semibold leading-snug text-gray-light md:text-lg">{text}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** The score the class is chasing: animated «me gusta» and how close they are to the goal. */
function LikesCard({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const controls = animate(from.current, value, {
      duration: DURATION.slow,
      ease: EASE.outExpo,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    from.current = value;
    return () => controls.stop();
  }, [value]);

  const progress = Math.min(1, value / GAME.goal);

  return (
    <div className="min-w-60 rounded-xl border-2 border-white/20 bg-white/[0.06] px-4 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-bold uppercase tracking-[0.08em] text-white md:text-sm">
          <Heart aria-hidden="true" className="size-4 fill-[#FF6B6B] text-[#FF6B6B]" strokeWidth={2} />
          {GAME.likesLabel}
        </span>
        <motion.span
          key={value}
          aria-live="polite"
          initial={{ scale: 1.3 }}
          animate={{ scale: 1, transition: transition(DURATION.base) }}
          className="origin-right whitespace-nowrap font-display text-2xl font-extrabold tabular-nums"
        >
          {formatNumber(shown)}
        </motion.span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-yellow to-[#FF6B6B]"
          animate={{ width: `${progress * 100}%` }}
          transition={transition(DURATION.slow)}
        />
      </div>
      <p className="mt-1 text-right font-mono text-[0.625rem] uppercase tracking-[0.14em] text-gray-muted">
        {GAME.goalLabel} {formatNumber(GAME.goal)}
      </p>
    </div>
  );
}

function RoundProgress({ current }: { current: number }) {
  return (
    <div className="hidden w-36 sm:block">
      <p className="hud-label text-right">
        Ronda {current + 1} de {ROUNDS.length}
      </p>
      <ol className="mt-2 flex gap-1.5" aria-hidden="true">
        {ROUNDS.map((round, i) => (
          <li
            key={round.title}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-500",
              i < current ? "bg-green-bright" : i === current ? "bg-white/60" : "bg-white/12",
            )}
          />
        ))}
      </ol>
    </div>
  );
}

interface RoundStepProps {
  round: number;
  picked: number | null;
  /** Total so far, including this round's pick. */
  likes: number;
  onPick: (post: number) => void;
  onNext: () => void;
}

function RoundStep({ round, picked, likes, onPick, onNext }: RoundStepProps) {
  const { title, seconds, posts } = ROUNDS[round];
  const boss = "boss" in ROUNDS[round] ? ROUNDS[round].boss : undefined;
  const [auto, setAuto] = useState(false);
  const next = useRef(onNext);

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

      <ul className={cn("mt-6 grid gap-4 md:gap-5", posts.length === 2 ? "sm:grid-cols-2 lg:mx-auto lg:max-w-4xl" : "sm:grid-cols-3")}>
        {posts.map((p, i) => (
          <li key={p.id}>
            <PostCard
              post={p}
              state={picked === null ? "open" : picked === i ? "chosen" : "dimmed"}
              trending={p.likes === topLikes}
              onBoost={() => onPick(i)}
            />
          </li>
        ))}
      </ul>

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

/** A post in the made-up feed. The whole card is the button that boosts it. */
interface PostCardProps {
  post: FeedPost;
  state: "open" | "chosen" | "dimmed";
  /** The post with the most likes in its round: the one the algorithm "wants". */
  trending: boolean;
  onBoost: () => void;
}

function PostCard({ post, state, trending, onBoost }: PostCardProps) {
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

/** Rounds get shorter; when time runs out the algorithm decides by itself. */
function Countdown({ seconds, running, onTimeUp }: { seconds: number; running: boolean; onTimeUp: () => void }) {
  const [left, setLeft] = useState(seconds);
  const timeUp = useRef(onTimeUp);

  useEffect(() => {
    timeUp.current = onTimeUp;
  });

  useEffect(() => {
    if (!running || left === 0) return;
    const t = window.setTimeout(() => {
      setLeft(left - 1);
      if (left === 1) timeUp.current();
    }, 1000);
    return () => window.clearTimeout(t);
  }, [left, running]);

  const out = left === 0;
  return (
    <span
      aria-live={out ? "polite" : "off"}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 self-start rounded-full border-2 px-4 py-1.5 font-display text-2xl font-bold tabular-nums transition-colors duration-300 sm:self-auto",
        out && "border-[#FF6B6B] text-[#FF6B6B]",
        !out && !running && "border-white/15 text-gray-muted",
        !out && running && left > 5 && "border-white/30 text-white",
        !out && running && left <= 5 && "animate-pulse border-yellow text-yellow",
      )}
    >
      <Timer aria-hidden="true" className="size-6" strokeWidth={2.25} />
      {out ? GAME.timeUp : `${left} s`}
    </span>
  );
}

function ResultStep({ likes, onNext }: { likes: number; onNext: () => void }) {
  const won = likes >= GAME.goal;
  return (
    <div className="flex min-h-[50svh] flex-col items-center justify-center text-center">
      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, transition: transition(DURATION.base, 0.1) }}
        className="font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold tracking-[-0.03em]"
      >
        {won ? GAME.result.win : GAME.result.lose}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: transition(DURATION.slow, 0.4, EASE.outExpo) }}
        className="mt-4 font-display text-[clamp(4rem,12vw,9rem)] font-extrabold leading-none tabular-nums text-yellow text-glow-yellow"
      >
        {formatNumber(likes)}
      </motion.p>
      <p className="mt-2 flex items-center gap-2 text-xl font-semibold text-gray-light">
        <Heart aria-hidden="true" className="size-5 fill-[#FF6B6B] text-[#FF6B6B]" /> {GAME.likesLabel}
      </p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: transition(DURATION.base, 1.4) }}
        className="mt-10"
      >
        <PrimaryButton onClick={onNext}>
          {GAME.result.reveal}
          <ArrowRight aria-hidden="true" className="size-5" strokeWidth={2} />
        </PrimaryButton>
      </motion.div>
    </div>
  );
}

/** The twist: her messages, one by one, depending on how much the boosted posts hurt her. */
function ValentinaStep({ harm, chosen, onNext }: { harm: number; chosen: readonly FeedPost[]; onNext: () => void }) {
  const { valentina } = GAME;
  const { story } = valentina;
  const levelId = harm >= valentina.high.min ? "high" : harm >= valentina.medium.min ? "medium" : "low";
  const level = valentina[levelId];
  const delay = (i: number) => 0.6 + i * 1.4;
  const storyDelay = delay(level.messages.length) + 0.4;
  const hurtful = chosen.filter((post) => post.harm > 0);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-center font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold tracking-[-0.03em]">
        {valentina.title}
      </p>
      <div className="mt-8 rounded-3xl border border-white/10 bg-navy/80 p-5 md:p-7">
        <p className="flex items-center gap-3 border-b border-white/10 pb-4 text-sm font-bold text-gray-light">
          <span className="grid size-10 place-items-center rounded-full bg-white/10 text-xl">🙁</span>
          @vale.m
        </p>
        <ul className="mt-5 grid gap-3">
          {level.messages.map((message, i) => (
            <motion.li
              key={message}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: transition(DURATION.base, delay(i), EASE.outExpo) }}
              className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-5 py-3 text-lg font-medium leading-snug text-navy-dark md:text-xl"
            >
              {message}
            </motion.li>
          ))}
        </ul>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: transition(DURATION.base, storyDelay) }}
        className="mt-6 rounded-3xl border border-yellow/40 bg-yellow/[0.05] p-5 md:p-7"
      >
        <p className="font-display text-xl font-bold text-yellow md:text-2xl">{story.title}</p>
        <p className="mt-3 text-lg leading-snug text-white md:text-xl">{story.intro}</p>
        <p className="mt-3 text-base font-semibold text-gray-light md:text-lg">
          {hurtful.length > 0 ? story.boosted : story.none}
        </p>
        {hurtful.length > 0 && (
          <ul className="mt-3 flex flex-wrap items-center gap-2">
            {hurtful.map((post, i) => (
              <li key={post.id} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="text-gray-muted">→</span>}
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white md:text-base">
                  {post.caption}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-lg leading-snug text-gray-light md:text-xl">{story[levelId]}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: transition(DURATION.base, storyDelay + 1.2) }}
        className="mt-8 flex justify-center"
      >
        <PrimaryButton onClick={onNext}>
          {valentina.next}
          <ArrowRight aria-hidden="true" className="size-5" strokeWidth={2} />
        </PrimaryButton>
      </motion.div>
    </div>
  );
}

function LessonStep({ onRestart }: { onRestart: () => void }) {
  const { lesson } = GAME;
  return (
    <div className="mx-auto max-w-5xl">
      <h3 className="font-display text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold leading-none tracking-[-0.03em]">
        {lesson.title}
      </h3>
      <ul className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
        {lesson.points.map(({ mark, text }, i) => (
          <motion.li
            key={text}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: transition(DURATION.base, 0.15 + i * 0.15) }}
            className="rounded-2xl border border-white/10 bg-navy/70 p-6"
          >
            <span aria-hidden="true" className="text-4xl leading-none">
              {mark}
            </span>
            <p className="mt-4 text-lg font-semibold leading-snug text-white">{text}</p>
          </motion.li>
        ))}
      </ul>
      <p className="mt-10 font-display text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-tight tracking-[-0.02em]">
        {lesson.question}
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex cursor-pointer items-center gap-3 self-start rounded-full border border-white/20 px-6 py-3.5 text-base font-semibold text-gray-light transition-colors hover:border-green-bright hover:text-white"
        >
          <RotateCcw aria-hidden="true" className="size-5" strokeWidth={2} />
          {lesson.restart}
        </button>
        <p className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-green-bright">
          {lesson.afterGame}
          <ArrowDown aria-hidden="true" className="size-4" strokeWidth={2} />
        </p>
      </div>
    </div>
  );
}

function PrimaryButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 cursor-pointer items-center gap-3 rounded-full bg-green-bright px-6 py-3.5 text-base font-bold text-navy-dark transition-[filter] hover:brightness-110"
    >
      {children}
    </button>
  );
}
