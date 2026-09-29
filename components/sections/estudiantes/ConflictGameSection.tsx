"use client";

import { animate, AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, Drama, Eye, Lightbulb, Play, RotateCcw, Timer } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, EASE, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { FEELINGS, GAME, type Feeling, type GameOption } from "@/lib/content/estudiantes";
import type { SectionProps } from "@/types/presentation";

type Stage = "inicio" | number | "giro" | "final";

const LETTERS = ["A", "B", "C", "D"] as const;
const SCENES = GAME.scenes;
const EMPTY_CHOICES: readonly (number | null)[] = SCENES.map(() => null);
const RED = "#FF6B6B";

const formatNumber = (n: number) => n.toLocaleString("es-CO");

const swap = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: transition(DURATION.base) },
  exit: { opacity: 0, y: -10, filter: "blur(6px)", transition: transition(DURATION.fast, 0, EASE.inOutQuint) },
};

/**
 * "El algoritmo del conflicto": five scenes, each from a different role. No option is "the right one": each has a cost, shown only after choosing, as
 * people reached (the algorithm) and how it lands on Valentina. Keeping a copy in scene 1 comes
 * back after scene 4. Nothing is stored or sent: it all lives in this component's state.
 */
export function ConflictGameSection({ id, index, label }: SectionProps) {
  const [stage, setStage] = useState<Stage>("inicio");
  const [choices, setChoices] = useState(EMPTY_CHOICES);
  const [twistChoice, setTwistChoice] = useState<number | null>(null);
  const started = useRef(false);

  const first = choices[0];
  const keptCopy = first !== null && "keepsCopy" in SCENES[0].options[first];

  // Decisions in the order they happened; the twist sits between scenes 4 and 5
  const picked: GameOption[] = [];
  choices.forEach((c, i) => {
    if (c !== null) picked.push(SCENES[i].options[c]);
    if (i === GAME.twist.afterScene && twistChoice !== null) picked.push(GAME.twist.options[twistChoice]);
  });

  let reach: number = GAME.startReach;
  let peak = reach;
  for (const option of picked) {
    reach = Math.max(0, reach + option.reach);
    peak = Math.max(peak, reach);
  }

  // On a phone the scene is taller than the screen: bring its top back into view on every change
  useEffect(() => {
    if (!started.current) {
      started.current = true;
      return;
    }
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [id, stage]);

  const afterScene = (scene: number): Stage => {
    if (scene === GAME.twist.afterScene && keptCopy) return "giro";
    return scene + 1 < SCENES.length ? scene + 1 : "final";
  };

  const restart = () => {
    setChoices(EMPTY_CHOICES);
    setTwistChoice(null);
    setStage(0);
  };

  const current = typeof stage === "number" ? stage : stage === "giro" ? GAME.twist.afterScene : null;

  return (
    <Section id={id} label={label} className="grain flex items-center overflow-hidden bg-navy-dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgb(36_157_74/0.12)_0%,transparent_55%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 md:px-16 lg:py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow index={index}>{label}</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.03em]">
              {GAME.title}
            </h2>
          </div>
          {stage !== "inicio" && (
            <div className="flex items-end gap-6">
              <ReachCounter value={reach} />
              <Progress current={current} />
            </div>
          )}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={stage} {...swap} className="mt-6 md:mt-8">
            {stage === "inicio" ? (
              <StartStep onStart={() => setStage(0)} />
            ) : typeof stage === "number" ? (
              <SceneStep
                number={stage + 1}
                chosen={choices[stage]}
                onChoose={(option) => setChoices((prev) => prev.map((c, i) => (i === stage ? option : c)))}
                onNext={() => setStage(afterScene(stage))}
                last={stage === SCENES.length - 1}
              />
            ) : stage === "giro" ? (
              <TwistStep chosen={twistChoice} onChoose={setTwistChoice} onNext={() => setStage(GAME.twist.afterScene + 1)} />
            ) : (
              <FinalStep
                reach={reach}
                peak={peak}
                feelings={picked.map((o) => o.feeling)}
                keptCopy={keptCopy && twistChoice !== null}
                onRestart={restart}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}

/**
 * The algorithm made visible: how many people are seeing the photo. It counts up from 0 when the
 * game starts, then up or down with every decision.
 */
function ReachCounter({ value }: { value: number }) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const first = from.current === 0;
    const controls = animate(from.current, value, {
      duration: first ? 2.2 : DURATION.slow,
      delay: first ? 0.5 : 0,
      ease: EASE.outExpo,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    from.current = value;
    return () => controls.stop();
  }, [value]);

  const hot = value > 1000;

  return (
    <div
      className={cn(
        "rounded-xl border-2 px-4 py-2 text-right transition-colors duration-500",
        hot ? "border-[#FF6B6B]/70 bg-[#FF6B6B]/10" : "border-white/25 bg-white/[0.06]",
      )}
    >
      <p className="flex items-center justify-end gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white md:text-sm">
        <Eye aria-hidden="true" className={cn("size-4", hot ? "text-[#FF6B6B]" : "text-yellow")} strokeWidth={2.25} />
        {GAME.reachLabel}
      </p>
      <motion.p
        key={value}
        aria-live="polite"
        initial={{ scale: 1.25 }}
        animate={{ scale: 1, transition: transition(DURATION.base) }}
        className="mt-1 origin-right font-display text-3xl font-extrabold leading-none tabular-nums md:text-4xl"
        style={{ color: hot ? RED : undefined }}
      >
        {formatNumber(shown)}
      </motion.p>
    </div>
  );
}

/** "Escena 2 de 5", one segment per scene. */
function Progress({ current }: { current: number | null }) {
  const at = current ?? SCENES.length;
  return (
    <div className="w-40 sm:w-48">
      <p className="hud-label text-right">{at < SCENES.length ? `Escena ${at + 1} de ${SCENES.length}` : "Final"}</p>
      <ol className="mt-2 flex gap-1.5" aria-hidden="true">
        {SCENES.map((scene, i) => (
          <li
            key={scene.title}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-500",
              i < at ? "bg-green-bright" : i === at ? "bg-white/60" : "bg-white/12",
            )}
          />
        ))}
      </ol>
    </div>
  );
}

/** Nothing but a start button: the presenter explains the activity first. */
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
      <p className="mt-6 text-base text-gray-muted md:text-lg">{GAME.startNote}</p>
    </div>
  );
}

interface SceneStepProps {
  number: number;
  chosen: number | null;
  last: boolean;
  onChoose: (option: number) => void;
  onNext: () => void;
}

function SceneStep({ number, chosen, last, onChoose, onNext }: SceneStepProps) {
  const scene: (typeof SCENES)[number] = SCENES[number - 1];
  const insight = "insight" in scene ? scene.insight : undefined;

  return (
    <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]">
        <Image
          src={scene.image.src}
          alt={scene.image.alt}
          width={1536}
          height={1024}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-auto w-full"
        />
      </div>

      <div>
        <RoleBadge>{scene.role}</RoleBadge>
        <h3 className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.02em] md:text-3xl">
          {scene.title}
        </h3>
        <p className="mt-3 text-base leading-snug text-gray-text md:text-lg">{scene.situation}</p>
        <Choice
          question={scene.question}
          options={scene.options}
          chosen={chosen}
          onChoose={onChoose}
          insight={insight}
          next={last ? GAME.finish : GAME.next}
          onNext={onNext}
        />
      </div>
    </div>
  );
}

/** Only when a copy was kept in scene 1: a message that brings it back. */
function TwistStep({
  chosen,
  onChoose,
  onNext,
}: {
  chosen: number | null;
  onChoose: (option: number) => void;
  onNext: () => void;
}) {
  const { twist } = GAME;
  return (
    <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
      <div className="grid aspect-[3/2] place-items-center rounded-2xl border border-yellow/30 bg-navy p-6">
        <div className="w-full max-w-md">
          <p className="hud-label text-center text-yellow">⏳ {twist.title}</p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: transition(DURATION.base, 0.3, EASE.outExpo) }}
            className="mt-6 rounded-2xl rounded-tl-sm bg-white px-5 py-4 text-navy-dark shadow-lg"
          >
            <p className="text-sm font-bold text-green">{twist.message.from}</p>
            <p className="mt-1 text-xl font-semibold leading-snug md:text-2xl">{twist.message.text}</p>
          </motion.div>
        </div>
      </div>

      <div>
        <RoleBadge>{SCENES[0].role}</RoleBadge>
        <h3 className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.02em] md:text-3xl">
          {twist.title}
        </h3>
        <Choice
          question={twist.question}
          options={twist.options}
          chosen={chosen}
          onChoose={onChoose}
          next={GAME.next}
          onNext={onNext}
        />
      </div>
    </div>
  );
}

interface ChoiceProps {
  question: string;
  options: readonly GameOption[];
  chosen: number | null;
  onChoose: (option: number) => void;
  insight?: string;
  next: string;
  onNext: () => void;
}

/** The options, locked after one is picked, then what that decision caused. */
function Choice({ question, options, chosen, onChoose, insight, next, onNext }: ChoiceProps) {
  const picked = chosen === null ? null : options[chosen];
  const [random, setRandom] = useState(false);

  const pickAtRandom = () => {
    setRandom(true);
    onChoose(Math.floor(Math.random() * options.length));
  };

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-lg font-semibold leading-snug text-white md:text-xl">{question}</p>
        <Countdown running={chosen === null} onTimeUp={pickAtRandom} />
      </div>
      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {options.map((option, i) => {
          const isChosen = i === chosen;
          return (
            <li key={option.text}>
              <button
                type="button"
                disabled={chosen !== null}
                aria-pressed={isChosen}
                onClick={() => onChoose(i)}
                className={cn(
                  "flex h-full w-full items-center gap-3 rounded-xl border-2 p-4 text-left text-base font-semibold leading-snug transition-[border-color,background-color,opacity,transform] duration-300 md:text-lg",
                  chosen === null &&
                    "cursor-pointer border-white/25 bg-white/[0.08] text-white hover:-translate-y-0.5 hover:border-green-bright hover:bg-green-bright/15",
                  chosen !== null && !isChosen && "border-white/5 bg-navy/40 text-gray-muted opacity-45",
                  isChosen && "border-white/70 bg-white/10 text-white",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full font-mono text-sm font-bold",
                    isChosen ? "bg-white text-navy-dark" : "bg-white/15 text-white",
                  )}
                >
                  {LETTERS[i]}
                </span>
                {option.text}
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {picked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: transition(DURATION.base, 0.1) }}
            className="mt-4 rounded-2xl border border-white/15 bg-navy/80 p-5"
            aria-live="polite"
          >
            {random && (
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#FF8A8A]">
                <Timer aria-hidden="true" className="size-4" strokeWidth={2.25} />
                {GAME.randomPick}
              </p>
            )}
            <p className="text-base leading-snug text-white md:text-lg">{picked.consequence}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <ReachChip delta={picked.reach} />
              <FeelingChip feeling={picked.feeling} />
            </div>
            {insight && (
              <p className="mt-4 flex gap-2.5 rounded-xl bg-yellow/[0.06] p-3 text-sm leading-snug text-gray-light md:text-base">
                <Lightbulb aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-yellow" strokeWidth={2} />
                {insight}
              </p>
            )}
            <div className="mt-4 flex justify-end">
              <PrimaryButton onClick={onNext}>
                {next}
                <ArrowRight aria-hidden="true" className="size-5" strokeWidth={2} />
              </PrimaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Time to decide. If it runs out, the game decides at random — not deciding is also a decision. */
function Countdown({ running, onTimeUp }: { running: boolean; onTimeUp: () => void }) {
  const [left, setLeft] = useState<number>(GAME.secondsPerDecision);
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
        "inline-flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-1.5 font-display text-xl font-bold tabular-nums transition-colors duration-300",
        out && "border-[#FF6B6B] text-[#FF6B6B]",
        !out && !running && "border-white/15 text-gray-muted",
        !out && running && left > 10 && "border-white/30 text-white",
        !out && running && left <= 10 && "border-yellow text-yellow",
      )}
    >
      <Timer aria-hidden="true" className="size-5" strokeWidth={2.25} />
      {out ? GAME.timeUp : `${left} s`}
    </span>
  );
}

function ReachChip({ delta }: { delta: number }) {
  const text =
    delta === 0 ? "Nadie más la ve" : `${delta > 0 ? "+" : "−"}${formatNumber(Math.abs(delta))} personas`;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold",
        delta > 0 && "border-[#FF6B6B]/50 bg-[#FF6B6B]/10 text-[#FF8A8A]",
        delta < 0 && "border-green-bright/50 bg-green-bright/10 text-green-bright",
        delta === 0 && "border-white/15 text-gray-text",
      )}
    >
      <Eye aria-hidden="true" className="size-4" strokeWidth={2} />
      {text}
    </span>
  );
}

function FeelingChip({ feeling }: { feeling: Feeling }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-sm font-semibold text-gray-light">
      <span aria-hidden="true">{FEELINGS[feeling].emoji}</span>
      {FEELINGS[feeling].label}
    </span>
  );
}

function RoleBadge({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2.5 rounded-full bg-yellow px-4 py-2 text-base font-bold text-navy-dark shadow-[0_0_24px_rgb(255_242_0/0.25)] md:text-lg">
      <Drama aria-hidden="true" className="size-5" strokeWidth={2.25} />
      {children}
    </p>
  );
}

interface FinalStepProps {
  reach: number;
  peak: number;
  feelings: readonly Feeling[];
  keptCopy: boolean;
  onRestart: () => void;
}

/** How it ended: the reach, a (possible) reading of how Valentina felt, and the question to take away. */
function FinalStep({ reach, peak, feelings, keptCopy, onRestart }: FinalStepProps) {
  const { result } = GAME;
  const score = feelings.reduce((sum, f) => sum + (f === "acompana" ? 1 : f === "duele" ? -1 : 0), 0);
  const ratio = feelings.length ? (score + feelings.length) / (2 * feelings.length) : 0.5;
  const level = ratio < 0.4 ? 0 : ratio < 0.7 ? 1 : 2;

  return (
    <div className="mx-auto max-w-5xl">
      <h3 className="font-display text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold leading-none tracking-[-0.03em]">
        {result.title}
      </h3>

      <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6">
        <div className="rounded-2xl border border-white/10 bg-navy/70 p-6 md:p-7">
          <p
            className="font-display text-6xl font-extrabold leading-none tabular-nums md:text-7xl"
            style={{ color: reach > 1000 ? RED : undefined }}
          >
            {formatNumber(reach)}
          </p>
          <p className="mt-3 text-lg font-semibold text-gray-light">{result.now}</p>
          <p className="mt-2 text-sm text-gray-muted md:text-base">
            {result.peak} <span className="font-semibold text-gray-text">{formatNumber(peak)}</span>.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy/70 p-6 md:p-7">
          <p className="text-lg font-semibold text-gray-light">{result.valentina}</p>
          <div className="relative mt-6 h-3 rounded-full bg-linear-to-r from-[#FF6B6B] via-[#FFD23F] to-green-bright">
            <motion.span
              className="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-navy bg-white shadow"
              initial={{ left: "50%" }}
              animate={{ left: `${Math.round(ratio * 100)}%`, transition: transition(DURATION.cinematic, 0.3) }}
            />
          </div>
          <ul className="mt-3 flex justify-between text-sm">
            {result.scale.map((step, i) => (
              <li key={step} className={cn(i === level ? "font-bold text-white" : "text-gray-muted")}>
                {step}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-gray-muted">{result.note}</p>
        </div>
      </div>

      {keptCopy && <p className="mt-6 text-lg font-semibold text-yellow">{result.twist}</p>}

      <p className="mt-8 max-w-4xl font-display text-[clamp(1.25rem,2.6vw,2rem)] font-bold leading-tight tracking-[-0.02em]">
        {result.question}
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex cursor-pointer items-center gap-3 self-start rounded-full border border-white/20 px-6 py-3.5 text-base font-semibold text-gray-light transition-colors hover:border-green-bright hover:text-white"
        >
          <RotateCcw aria-hidden="true" className="size-5" strokeWidth={2} />
          {GAME.restart}
        </button>
        <p className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-green-bright">
          {GAME.afterGame}
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
