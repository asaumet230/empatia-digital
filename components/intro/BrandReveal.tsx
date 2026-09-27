"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { DURATION, EASE, charReveal, staggerContainer, transition } from "@/lib/animations";
import { BRAND } from "@/lib/constants";

interface BrandRevealProps {
  ready: boolean;
  onStart: () => void;
}

const EMPAT = "Empat".split("");
const IA = "IA".split("");
const DIGITAL = "DIGITAL".split("");

/** "IA" arrives after the rest, then switches to its highlight color. */
const iaReveal: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(12px)", color: "#FFFFFF" },
  visible: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    color: "#FFF200",
    transition: {
      default: transition(DURATION.slow),
      color: { duration: 0.8, delay: 0.55, ease: EASE.outQuart },
    },
  },
};

const taglineReveal: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: transition(DURATION.slow, 0.9) },
};

/** Phase 3–4: title, tagline and call to action. */
export function BrandReveal({ ready, onStart }: BrandRevealProps) {
  return (
    <motion.div
      key="brand"
      className="relative flex flex-col items-center px-6 text-center"
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.05, 0.15)}
    >
      {/* Soft illumination behind the title */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[60vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(36_157_74/0.28),transparent)]"
        variants={{
          hidden: { opacity: 0, scale: 0.6 },
          visible: { opacity: 1, scale: 1, transition: transition(DURATION.cinematic) },
        }}
      />

      <h2 className="sr-only">{BRAND.name}</h2>

      {/* EmpatIA */}
      <p
        aria-hidden="true"
        className="font-display text-[clamp(3.25rem,14vw,11.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-white"
      >
        {EMPAT.map((ch, i) => (
          <motion.span key={i} className="inline-block" variants={charReveal}>
            {ch}
          </motion.span>
        ))}
        <span className="relative inline-block">
          <IaFrame />
          {IA.map((ch, i) => (
            <motion.span key={i} className="relative inline-block text-glow-yellow" variants={iaReveal}>
              {ch}
            </motion.span>
          ))}
        </span>
      </p>

      {/* DIGITAL, flanked by connection lines */}
      <div aria-hidden="true" className="mt-3 flex items-center gap-4 sm:mt-5 sm:gap-6">
        <ConnectionLine side="left" />
        <p className="font-display text-[clamp(1rem,4vw,3.25rem)] font-light uppercase tracking-[0.55em] text-gray-light [margin-right:-0.55em]">
          {DIGITAL.map((ch, i) => (
            <motion.span key={i} className="inline-block" variants={charReveal}>
              {ch}
            </motion.span>
          ))}
        </p>
        <ConnectionLine side="right" />
      </div>

      {/* Tagline */}
      <motion.p
        variants={taglineReveal}
        className="mt-8 max-w-md text-base text-gray-text sm:mt-10 sm:text-lg md:text-xl"
      >
        {BRAND.tagline}
      </motion.p>

      {/* CTA */}
      <motion.div
        className="mt-12 flex flex-col items-center gap-5 sm:mt-16"
        initial={{ opacity: 0, y: 12 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={transition(DURATION.slow)}
      >
        <button
          type="button"
          onClick={onStart}
          disabled={!ready}
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-green-bright/40 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.24em] text-gray-light transition-colors duration-500 hover:border-green-bright hover:text-navy-dark focus-visible:border-green-bright disabled:pointer-events-none sm:text-[0.8125rem]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-bottom scale-y-0 bg-green-bright transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
          />
          <span className="relative">{BRAND.cta}</span>
          <ArrowDown aria-hidden="true" className="relative size-4 animate-nudge" strokeWidth={1.75} />
        </button>
        <span className="hud-label">o {BRAND.scrollHint.toLowerCase()}</span>
      </motion.div>
    </motion.div>
  );
}

/** Selection-style frame that draws around "IA", as if the system had detected it. */
function IaFrame() {
  const corner = "absolute size-2 border-green-bright";
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-[0.06em] -bottom-[0.02em] -top-[0.08em]"
      variants={{
        hidden: { opacity: 0, scale: 1.25 },
        visible: { opacity: 1, scale: 1, transition: transition(DURATION.base, 0.75) },
      }}
    >
      <span className="absolute inset-0 rounded-[0.08em] border border-green-bright/35 bg-green/[0.06]" />
      <span className={`${corner} -left-1 -top-1 border-l-2 border-t-2`} />
      <span className={`${corner} -right-1 -top-1 border-r-2 border-t-2`} />
      <span className={`${corner} -bottom-1 -left-1 border-b-2 border-l-2`} />
      <span className={`${corner} -bottom-1 -right-1 border-b-2 border-r-2`} />
    </motion.span>
  );
}

function ConnectionLine({ side }: { side: "left" | "right" }) {
  return (
    <span className="relative flex h-px w-10 items-center sm:w-20 md:w-28">
      <motion.span
        className={`absolute inset-0 from-transparent to-green-bright/70 ${side === "left" ? "origin-right bg-linear-to-r" : "origin-left bg-linear-to-l"}`}
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: transition(DURATION.cinematic, 0.5, EASE.outExpo) },
        }}
      />
      <motion.span
        className={`absolute size-1.5 rounded-full bg-green-bright ${side === "left" ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"}`}
        variants={{
          hidden: { scale: 0 },
          visible: { scale: 1, transition: transition(DURATION.base, 0.9) },
        }}
      />
    </span>
  );
}
