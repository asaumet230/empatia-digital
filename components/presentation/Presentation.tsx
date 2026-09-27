"use client";

import { MotionConfig, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo } from "react";
import { Intro } from "@/components/presentation/Intro";
import { ProgressNavigation } from "@/components/presentation/ProgressNavigation";
import { scrollToSection, useActiveSection } from "@/hooks/useActiveSection";
import { useIntroTimeline } from "@/hooks/useIntroTimeline";
import { INTRO_SECTION, SECTIONS } from "@/lib/sections";

const NAV_ITEMS = [INTRO_SECTION, ...SECTIONS.map(({ id, label }) => ({ id, label }))];

const NEXT_KEYS = new Set(["ArrowDown", "PageDown", " "]);
const PREV_KEYS = new Set(["ArrowUp", "PageUp"]);

/** Root of the experience: owns the intro state, keyboard control and progress. */
export function Presentation() {
  const reducedMotion = useReducedMotion() ?? false;
  const { phase, skip } = useIntroTimeline(reducedMotion);
  const ready = phase === "ready";

  const ids = useMemo(() => NAV_ITEMS.map((s) => s.id), []);
  const active = useActiveSection(ids);

  // Always start at the top; hold the scroll while the system boots.
  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.intro = ready ? "done" : "booting";
  }, [ready]);

  const goTo = useCallback(
    (index: number) => {
      const target = ids[Math.max(0, Math.min(index, ids.length - 1))];
      scrollToSection(target, reducedMotion);
    },
    [ids, reducedMotion],
  );

  // Slide-by-slide keyboard control (works with presentation clickers: PageUp/PageDown).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const el = e.target as HTMLElement;
      if (el.closest("button, a, input, textarea, select, [contenteditable]") && e.key === " ") return;

      if (!ready) {
        if (e.key === "Escape") skip();
        return;
      }
      if (NEXT_KEYS.has(e.key)) {
        e.preventDefault();
        goTo(active + 1);
      } else if (PREV_KEYS.has(e.key)) {
        e.preventDefault();
        goTo(active - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo, ready, skip]);

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <Intro
          id={INTRO_SECTION.id}
          phase={phase}
          reducedMotion={reducedMotion}
          onSkip={skip}
          onStart={() => goTo(1)}
        />
        {SECTIONS.map(({ id, label, component: SectionComponent }, i) => (
          <SectionComponent key={id} id={id} index={i + 1} label={label} />
        ))}
      </main>

      <ProgressNavigation
        items={NAV_ITEMS}
        active={active}
        visible={ready}
        onNavigate={(id) => scrollToSection(id, reducedMotion)}
      />
    </MotionConfig>
  );
}
