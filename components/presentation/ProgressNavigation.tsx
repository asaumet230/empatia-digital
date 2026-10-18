"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { useDismiss } from "@/hooks/useDismiss";
import { DURATION, EASE, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";

interface NavItem {
  id: string;
  label: string;
}

interface ProgressNavigationProps {
  items: readonly NavItem[];
  active: number;
  visible: boolean;
  onNavigate: (id: string) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Discreet progress indicator.
 * Desktop: vertical index on the right edge, in a gutter the slides leave free (see `Section`);
 * a slide's name shows on hover only, so it never sits on the content. Mobile: top progress
 * hairline + a counter, beside the session menu button, that opens the list of slides.
 */
export function ProgressNavigation({ items, active, visible, onNavigate }: ProgressNavigationProps) {
  const total = items.length;
  const progress = total > 1 ? active / (total - 1) : 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Progreso de la presentación"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition(DURATION.slow, 0.2)}
        >
          {/* Mobile */}
          <div className="md:hidden">
            <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-0.5 bg-white/5">
              <motion.div
                className="h-full origin-left bg-green-bright"
                animate={{ scaleX: Math.max(progress, 0.02) }}
                transition={transition(DURATION.base, 0, EASE.outQuart)}
              />
            </div>
            <MobileIndex items={items} active={active} onNavigate={onNavigate} />
          </div>

          {/* Desktop */}
          <ol className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-1 md:flex lg:right-10">
            {items.map((item, i) => {
              const isActive = i === active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`${pad(i)} — ${item.label}`}
                    className="group relative flex items-center gap-3 py-1.5 pl-3"
                  >
                    <span
                      className={cn(
                        "hud-label pointer-events-none absolute right-full mr-1 translate-x-2 whitespace-nowrap rounded-full border border-white/10 bg-navy-deep/95 px-3 py-1.5 opacity-0 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)] backdrop-blur-md transition-all duration-300",
                        "group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                        isActive && "font-bold text-green-bright",
                      )}
                    >
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[0.6875rem] tabular-nums tracking-[0.15em] transition-colors duration-500",
                        isActive ? "font-bold text-green-bright" : "text-gray-muted group-hover:text-gray-text",
                      )}
                    >
                      {pad(i)}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "origin-right transition-all duration-500 ease-[var(--ease-out-expo)]",
                        isActive ? "h-0.5 w-8 bg-green-bright" : "h-px w-3 bg-gray-muted/50 group-hover:w-5",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ol>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

/** Phone: "03 / 14" button; tapping it lists every slide, and tapping one goes there. */
function MobileIndex({ items, active, onNavigate }: Omit<ProgressNavigationProps, "visible">) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const total = items.length;

  useDismiss(ref, open, () => setOpen(false));

  return (
    <div ref={ref} className="fixed left-16 top-3 z-50">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="indice-movil"
        aria-label={`Diapositiva ${pad(active)} de ${pad(total - 1)}. Ver todas las secciones`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-10 items-center gap-1.5 rounded-full border bg-navy-deep px-3.5 font-mono text-[0.6875rem] tracking-[0.2em] text-gray-muted shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)] transition-colors",
          open ? "border-green-bright/50" : "border-white/10",
        )}
      >
        <span className="font-bold text-green-bright">{pad(active)}</span> / {pad(total - 1)}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-3.5 text-gray-light transition-transform duration-300", open && "rotate-180")}
          strokeWidth={2}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ol
            id="indice-movil"
            className="absolute left-0 top-full mt-2 max-h-[60svh] w-64 overflow-y-auto rounded-2xl border border-white/10 bg-navy-deep p-1.5 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.85)]"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={transition(DURATION.fast)}
          >
            {items.map((item, i) => {
              const isActive = i === active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-current={isActive ? "step" : undefined}
                    onClick={() => {
                      setOpen(false);
                      onNavigate(item.id);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                      isActive ? "bg-green-bright/10 font-bold text-green-bright" : "text-gray-light active:bg-white/10",
                    )}
                  >
                    <span className="font-mono text-[0.6875rem] tabular-nums tracking-[0.15em]">{pad(i)}</span>
                    {item.label}
                  </button>
                </li>
              );
            })}
          </motion.ol>
        )}
      </AnimatePresence>
    </div>
  );
}
