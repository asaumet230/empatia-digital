import type { ComponentType } from "react";

/** Props every presentation section ("web slide") receives. */
export interface SectionProps {
  id: string;
  /** Zero-based position in the presentation. */
  index: number;
  label: string;
}

export interface SectionConfig {
  /** Used as the DOM id and URL hash. */
  id: string;
  /** Short name shown in the progress navigation. */
  label: string;
  component: ComponentType<SectionProps>;
}

export type IntroPhase =
  | "void"
  | "spark"
  | "boot"
  | "connect"
  | "analyze"
  | "activate"
  | "converge"
  | "brand"
  | "ready";
