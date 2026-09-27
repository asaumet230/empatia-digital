"use client";

import { useEffect, useState } from "react";

/**
 * Returns the index of the section that currently owns the middle of the viewport.
 * One IntersectionObserver for all sections; no scroll listeners.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = ids.indexOf(entry.target.id);
            if (index !== -1) setActive(index);
          }
        }
      },
      // A thin band across the vertical center of the screen
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export function scrollToSection(id: string, reducedMotion = false) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
}
