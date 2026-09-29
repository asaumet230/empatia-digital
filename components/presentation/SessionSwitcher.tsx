"use client";

import { AnimatePresence, motion } from "framer-motion";
import { House, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { DURATION, EASE, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { TRACKS, type TrackId } from "@/lib/sections";

interface SessionSwitcherProps {
  /** Current audience; omitted on the home page, where "Inicio" is the current page. */
  track?: TrackId;
  visible?: boolean;
}

/**
 * Session switch, top-left. Folded into a small round button so it never covers a slide;
 * it unfolds on hover or keyboard focus (and on tap, closing again on a tap outside).
 * In a presentation it appears after the intro, like the progress navigation.
 */
export function SessionSwitcher({ track, visible = true }: SessionSwitcherProps) {
  const home = track === undefined;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Touch: close when tapping anywhere else
  useEffect(() => {
    if (!open) return;
    const onDown = (e: globalThis.PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onMouse = (value: boolean) => (e: PointerEvent) => e.pointerType === "mouse" && setOpen(value);

  const links = [
    { href: "/", label: "Inicio", current: home, icon: true },
    ...(Object.keys(TRACKS) as TrackId[]).map((id) => ({
      href: `/${id}`,
      label: TRACKS[id].title,
      current: id === track,
      icon: false,
    })),
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          ref={ref}
          aria-label="Cambiar de sesión"
          onPointerEnter={onMouse(true)}
          onPointerLeave={onMouse(false)}
          onFocus={(e) => e.target.matches(":focus-visible") && setOpen(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          className="fixed left-3 top-3 z-50 flex items-center rounded-full border border-white/10 bg-navy-deep/85 p-1 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)] backdrop-blur-md sm:left-5 sm:top-5"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={transition(DURATION.slow, 0.2)}
        >
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú de sesiones" : "Abrir menú de sesiones"}
            onClick={() => setOpen((v) => !v)}
            className="grid size-8 shrink-0 place-items-center rounded-full text-gray-light transition-colors hover:bg-white/10 hover:text-white"
          >
            {open ? (
              <X aria-hidden="true" className="size-4" strokeWidth={2} />
            ) : (
              <Menu aria-hidden="true" className="size-4" strokeWidth={2} />
            )}
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                className="flex items-center gap-1 overflow-hidden whitespace-nowrap"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={transition(DURATION.base, 0, EASE.outQuart)}
              >
                <span aria-hidden="true" className="mx-1 h-4 w-px shrink-0 bg-white/15" />
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors sm:text-sm",
                      link.current
                        ? "bg-green-bright text-navy-dark"
                        : "text-gray-text hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {link.icon && <House aria-hidden="true" className="size-4" strokeWidth={1.75} />}
                    {link.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
