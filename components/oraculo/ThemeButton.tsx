"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useId, useRef, useState, useSyncExternalStore } from "react";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/lib/cn";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";
import { applyTheme, readTheme, subscribeTheme, THEMES, type Theme } from "@/lib/oraculo/tema";

const ICONS = { auto: Monitor, claro: Sun, oscuro: Moon } as const;
/** Each option has its colour, so it reads at a glance: the owl's teal, the sun, the moon. */
const COLORS = { auto: "text-o-owl", claro: "text-o-help", oscuro: "text-o-moon" } as const;

/** On the server there is no saved choice yet: it renders as automatic and updates in the browser. */
const serverTheme = (): Theme => "auto";

/** The theme menu: the button shows the current choice; the three options open under it. */
export function ThemeButton() {
  const t = ORACLE_TEXT.theme;
  const theme = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  useDismiss(ref, open, () => setOpen(false));

  const Icon = ICONS[theme];
  const label = `${t.label}: ${t.names[theme]}`;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={label}
        aria-expanded={open}
        aria-controls={menuId}
        title={label}
        className={cn(
          "grid size-10 place-items-center rounded-full! border border-o-strong bg-o-surface text-o-muted shadow-sm transition-colors hover:bg-o-raised hover:text-o-text",
          open && "bg-o-raised text-o-text",
        )}
      >
        <Icon aria-hidden="true" className={cn("size-4", COLORS[theme])} />
      </button>

      {open && (
        <div
          id={menuId}
          role="group"
          aria-label={t.label}
          className="absolute right-0 top-full z-30 mt-2 w-44 rounded-2xl border border-o-line bg-o-surface p-1.5 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.45)]"
        >
          {THEMES.map((option) => {
            const OptionIcon = ICONS[option];
            const current = option === theme;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={current}
                onClick={() => {
                  applyTheme(option);
                  setOpen(false);
                }}
                title={t.options[option]}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl! px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-o-raised",
                  current ? "text-o-text" : "text-o-muted",
                )}
              >
                <OptionIcon aria-hidden="true" className={cn("size-4", COLORS[option])} />
                <span className="flex-1">{t.options[option]}</span>
                {current && <Check aria-hidden="true" className="size-4 text-o-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
