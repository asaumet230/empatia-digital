"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";
import type { FeedPost } from "@/lib/content/estudiantes";
import type { SectionProps } from "@/types/presentation";
import { LessonStep } from "./algoritmo/LessonStep";
import { ResultStep } from "./algoritmo/ResultStep";
import { RoundStep } from "./algoritmo/RoundStep";
import { LikesCard, RoundProgress } from "./algoritmo/Scoreboard";
import { GAME, ROUNDS, swap } from "./algoritmo/shared";
import { StartStep } from "./algoritmo/StartStep";
import { StoryStep } from "./algoritmo/StoryStep";
import { ValentinaStep } from "./algoritmo/ValentinaStep";

type Stage = "inicio" | number | "resultado" | "valentina" | "historia" | "leccion";

const EMPTY: readonly (number | null)[] = ROUNDS.map(() => null);

/**
 * "Tú eres el algoritmo": the class plays the feed of a made-up app. Each round they boost one
 * post, against a clock that gets shorter; mocking Valentina always pays the most «me gusta».
 * The cost stays hidden until the end, when her messages appear. If time runs out, the algorithm
 * picks by itself — the post with the most likes. Nothing is stored or sent.
 * Each step lives in `./algoritmo/`; this component only holds the game state.
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

  // During the rounds the floating buttons (Oráculo, pretest) hide, so nothing covers the posts
  useEffect(() => {
    const root = document.documentElement;
    if (playing) root.dataset.game = "playing";
    else delete root.dataset.game;
    return () => {
      delete root.dataset.game;
    };
  }, [playing]);

  return (
    <Section id={id} label={label} className="grain flex items-center overflow-hidden bg-navy-dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgb(255_107_107/0.12)_0%,transparent_50%),radial-gradient(ellipse_at_10%_90%,rgb(36_157_74/0.12)_0%,transparent_50%)]"
      />

      <div className={cn("relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 md:px-16", playing ? "lg:py-5" : "lg:py-10")}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className={cn(stage === "inicio" && "w-full")}>
            <Eyebrow index={index}>{label}</Eyebrow>
            {/* Only on the start screen: after that, every step needs the room */}
            <h2
              className={cn(
                "font-display font-bold leading-[1.05] tracking-[-0.03em]",
                stage === "inicio" ? "mt-4 text-center text-[clamp(1.5rem,3vw,2.5rem)]" : "sr-only",
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
          <motion.div key={stage} {...swap} className={playing ? "mt-4" : "mt-6 md:mt-8"}>
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
              <ValentinaStep harm={harm} onNext={() => setStage("historia")} />
            ) : stage === "historia" ? (
              <StoryStep harm={harm} onNext={() => setStage("leccion")} />
            ) : (
              <LessonStep onRestart={restart} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
