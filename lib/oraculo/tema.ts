/* ------------------------------------------------------------------ */
/*  Light, dark or automatic (follow the device) for the Oráculo.      */
/*  The choice lives on <html data-oraculo-tema> (globals.css reads    */
/*  it) and in localStorage: it is only a display preference, never   */
/*  anything from the conversation.                                    */
/* ------------------------------------------------------------------ */

export const THEMES = ["auto", "claro", "oscuro"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_KEY = "oraculo:tema";

/** Runs before the page paints (inline in the Oráculo layout), so a saved theme never flashes. */
export const THEME_SCRIPT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="claro"||t==="oscuro")document.documentElement.dataset.oraculoTema=t}catch(e){}`;

const listeners = new Set<() => void>();

/** For useSyncExternalStore: every theme button on the page follows a change. */
export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function readTheme(): Theme {
  const current = document.documentElement.dataset.oraculoTema;
  return current === "claro" || current === "oscuro" ? current : "auto";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "auto") delete root.dataset.oraculoTema;
  else root.dataset.oraculoTema = theme;
  listeners.forEach((listener) => listener());
  try {
    if (theme === "auto") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Private mode or blocked storage: the choice still applies to this visit
  }
}
