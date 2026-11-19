"use client";

import { useRef, useState, type UIEvent } from "react";

/**
 * A row of cards that scrolls sideways on phones (a grid from `sm` up). Tracks which card is in
 * front and moves to another one by scrolling only the row, never the page.
 */
export function useCarousel<T extends HTMLElement>() {
  const track = useRef<T>(null);
  const [current, setCurrent] = useState(0);

  const goTo = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    const padding = parseFloat(getComputedStyle(el).paddingLeft);
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft - padding, behavior: "smooth" });
  };

  const onScroll = (e: UIEvent<T>) => {
    const el = e.currentTarget;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    // One step = a card plus the gap between cards
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    setCurrent(Math.round(el.scrollLeft / (card.offsetWidth + gap)));
  };

  return { track, current, goTo, onScroll };
}
