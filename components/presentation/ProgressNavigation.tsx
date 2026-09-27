"use client";

import { AnimatePresence, motion } from "framer-motion";
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
 * Desktop: vertical index on the right edge. Mobile: top progress hairline + compact counter.
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
            <p className="fixed right-4 top-3 z-50 font-mono text-[0.6875rem] tracking-[0.2em] text-gray-muted">
              <span className="text-gray-light">{pad(active)}</span> / {pad(total - 1)}
            </p>
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
                    className="group flex items-center gap-3 py-1.5 pl-3"
                  >
                    <span
                      className={cn(
                        "hud-label whitespace-nowrap transition-all duration-500",
                        isActive
                          ? "translate-x-0 text-gray-text opacity-100"
                          : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                      )}
                    >
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[0.6875rem] tabular-nums tracking-[0.15em] transition-colors duration-500",
                        isActive ? "text-white" : "text-gray-muted group-hover:text-gray-text",
                      )}
                    >
                      {pad(i)}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-px origin-right transition-all duration-500 ease-[var(--ease-out-expo)]",
                        isActive ? "w-8 bg-green-bright" : "w-3 bg-gray-muted/50 group-hover:w-5",
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
