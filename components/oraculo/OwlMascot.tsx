"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/*  The Oráculo owl, built from the real illustration in layers so    */
/*  its parts can move: the raised wing waves, the eyes blink and the  */
/*  motion lines pulse (animations in globals.css, `.owl-*`; still     */
/*  when the device asks for reduced motion). Coordinates are in the   */
/*  400 × 400 space of the image.                                      */
/* ------------------------------------------------------------------ */

const SRC = "/assets/logos/oraculo-saludo.webp";

const WING =
  "M350 190C362 190 368 205 367 230C365 262 345 292 318 312C300 324 282 326 272 322L262 300C268 280 290 250 310 225C322 208 335 192 350 190Z";
/** Head and body colour behind the wing, so no gap opens at the shoulder while it waves. */
const SHOULDER = "M258 322C258 290 288 248 318 210C326 198 331 186 335 176C338 212 322 258 284 318Z";
const LINES = ["M349 170L364 148", "M364 182L384 171", "M372 199L389 203"];
const EYES = [
  { cx: 113, cy: 146, rx: 19, ry: 27 },
  { cx: 247, cy: 156, rx: 19, ry: 26 },
];
/** The face around the eyes, painted under them so a blink shows face, not the old eye. */
const FACE = "#fdfcfd";

function Picture(props: { clipPath?: string; mask?: string }) {
  return <image href={SRC} width="400" height="400" {...props} />;
}

export function OwlMascot({ className }: { className?: string }) {
  // Ids must be unique when the owl appears more than once on a page
  const id = useId().replace(/:/g, "");
  const url = (name: string) => `url(#${id}-${name})`;
  const lines = LINES.map((d) => <path key={d} d={d} />);

  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={cn("owl-mascot", className)}>
      <defs>
        {/* The still picture, without the parts that move */}
        <mask id={`${id}-still`} maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
          <rect width="400" height="400" fill="#fff" />
          <path d={WING} fill="#000" />
          <g stroke="#000" strokeWidth="16" strokeLinecap="round">
            {lines}
          </g>
        </mask>
        <mask id={`${id}-lines`} maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
          <g stroke="#fff" strokeWidth="16" strokeLinecap="round">
            {lines}
          </g>
        </mask>
        <clipPath id={`${id}-wing`}>
          <path d={WING} />
        </clipPath>
        {EYES.map((eye, i) => (
          <clipPath key={i} id={`${id}-eye${i}`}>
            <ellipse {...eye} />
          </clipPath>
        ))}
      </defs>

      <path d={SHOULDER} fill="#0f9cae" />
      <Picture mask={url("still")} />

      {EYES.map((eye, i) => (
        <g key={i}>
          <ellipse {...eye} fill={FACE} />
          <g className="owl-eye" style={{ transformOrigin: `${eye.cx}px ${eye.cy}px` }}>
            <Picture clipPath={url(`eye${i}`)} />
          </g>
        </g>
      ))}

      <g className="owl-waves">
        <Picture mask={url("lines")} />
      </g>
      <g className="owl-wing">
        <Picture clipPath={url("wing")} />
      </g>
    </svg>
  );
}
