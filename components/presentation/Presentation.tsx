"use client";

import { MotionConfig, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { EvaluationButton } from "@/components/presentation/EvaluationButton";
import { Intro } from "@/components/presentation/Intro";
import { SessionSwitcher } from "@/components/presentation/SessionSwitcher";
import { ProgressNavigation } from "@/components/presentation/ProgressNavigation";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { scrollToSection, useActiveSection } from "@/hooks/useActiveSection";
import { useIntroTimeline } from "@/hooks/useIntroTimeline";
import { EVALUATION_FORMS } from "@/lib/content/evaluacion";
import { INTRO_SECTION, TRACKS, type TrackId } from "@/lib/sections";

const NEXT_KEYS = new Set(["ArrowDown", "PageDown", " "]);
const PREV_KEYS = new Set(["ArrowUp", "PageUp"]);

/**
 * Root of the experience: owns the intro state, keyboard control and progress.
 * `track` picks the audience; it is a plain string so a Server Component page can pass it.
 */
export function Presentation({ track }: { track: TrackId }) {
  const reducedMotion = useReducedMotion() ?? false;
  const { phase, skip } = useIntroTimeline(reducedMotion);
  const ready = phase === "ready";

  const sections = TRACKS[track].sections;
  const navItems = useMemo(() => [INTRO_SECTION, ...sections.map(({ id, label }) => ({ id, label }))], [sections]);
  const ids = useMemo(() => navItems.map((s) => s.id), [navItems]);
  const active = useActiveSection(ids);

  // A slide in the address (`/estudiantes#paz-galeria`, e.g. coming back from /subir) opens right
  // there, without the intro. Otherwise start at the top and hold the scroll while the system boots.
  const openAt = useRef<string | null>(null);
  useEffect(() => {
    history.scrollRestoration = "manual";
    const target = decodeURIComponent(window.location.hash.slice(1));
    if (target !== INTRO_SECTION.id && ids.includes(target)) {
      openAt.current = target;
      skip();
    } else {
      window.scrollTo(0, 0);
    }
  }, [ids, skip]);

  useEffect(() => {
    document.documentElement.dataset.intro = ready ? "done" : "booting";
  }, [ready]);

  // After the effect above has unlocked the scroll, jump to the slide from the address
  useEffect(() => {
    if (!ready || !openAt.current) return;
    document.getElementById(openAt.current)?.scrollIntoView({ behavior: "instant", block: "start" });
    openAt.current = null;
  }, [ready]);

  // Leaving the presentation (e.g. back to the home page) must never leave the page locked
  useEffect(() => () => void delete document.documentElement.dataset.intro, []);

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
        {sections.map(({ id, label, component: SectionComponent }, i) => (
          <SectionComponent key={id} id={id} index={i + 1} label={label} />
        ))}
      </main>
      <SiteFooter track={track} />
      <SessionSwitcher track={track} visible={ready} />
      {EVALUATION_FORMS[track] && <EvaluationButton forms={EVALUATION_FORMS[track]} visible={ready} />}

      <ProgressNavigation
        items={navItems}
        active={active}
        visible={ready}
        onNavigate={(id) => scrollToSection(id, reducedMotion)}
      />
    </MotionConfig>
  );
}
