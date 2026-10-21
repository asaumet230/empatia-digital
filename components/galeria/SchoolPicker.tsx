"use client";

import { Check, School as SchoolIcon, Search } from "lucide-react";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/lib/cn";
import { SCHOOLS, type School } from "@/lib/content/colegios";
import { UPLOAD_TEXT } from "@/lib/content/galeria";

const t = UPLOAD_TEXT.school;

/** Lowercase and without accents, so "jose marti" finds "IED José Martí". */
const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const INDEX = SCHOOLS.map((school) => ({ school, key: fold(school.name) }));

/** Every word typed must appear somewhere in the name, in any order. */
function search(query: string): readonly School[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  return INDEX.filter(({ key }) => words.every((w) => key.includes(w))).map(({ school }) => school);
}

/**
 * Text box with suggestions (an ARIA combobox). The school can only come from the list, so every
 * image lands in the right folder: free text would create "Jose marti" next to "IED José Martí".
 */
export function SchoolPicker({ value, onChange }: { value: School | null; onChange: (school: School | null) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const matches = useMemo(() => search(query), [query]);

  useDismiss(ref, open, () => setOpen(false));

  const choose = (school: School) => {
    onChange(school);
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (matches.length ? (i + step + matches.length) % matches.length : 0));
    } else if (e.key === "Enter" && open && matches[active]) {
      e.preventDefault();
      choose(matches[active]);
    }
  };

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-green-bright/50 bg-green-bright/[0.08] p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green-bright text-navy-dark">
          <Check aria-hidden="true" className="size-5" strokeWidth={2.5} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-green-bright">{t.label}</span>
          <span className="block font-display text-lg font-bold leading-tight">{value.name}</span>
        </span>
        <button
          type="button"
          onClick={() => {
            onChange(null);
            requestAnimationFrame(() => input.current?.focus());
          }}
          className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold transition-colors hover:border-green-bright hover:text-green-bright"
        >
          {t.change}
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <label htmlFor={`${id}-input`} className="flex items-center gap-2 font-display text-lg font-bold">
        <SchoolIcon aria-hidden="true" className="size-5 text-green-bright" />
        {t.label}
      </label>
      <div className="relative mt-3">
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-text" />
        <input
          ref={input}
          id={`${id}-input`}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && matches[active] ? `${id}-${matches[active].dane}` : undefined}
          autoComplete="off"
          value={query}
          placeholder={t.placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full rounded-2xl border border-white/15 bg-navy py-4 pl-12 pr-4 text-base text-white placeholder:text-gray-text focus:border-green-bright focus:outline-none"
        />
      </div>

      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={t.label}
          className="absolute inset-x-0 z-20 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-white/15 bg-navy-deep p-1.5 shadow-2xl"
        >
          {matches.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-text">{t.empty}</li>
          ) : (
            matches.map((school, i) => (
              <li
                key={school.dane}
                id={`${id}-${school.dane}`}
                role="option"
                aria-selected={i === active}
                // mousedown, not click: the input must not lose focus before the choice is made
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(school);
                }}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "cursor-pointer rounded-xl px-4 py-2.5 text-base",
                  i === active ? "bg-green-bright/15 text-white" : "text-gray-light",
                )}
              >
                {school.name}
              </li>
            ))
          )}
        </ul>
      )}
      <p className="mt-2 text-xs text-gray-text">{t.source}</p>
    </div>
  );
}
