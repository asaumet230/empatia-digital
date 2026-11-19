"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";

/** Copies text to the clipboard; `copied` stays true for a moment so the button can confirm it. */
export function useCopy(text: string, confirmMs = 2200) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    if (!(await copyText(text))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), confirmMs);
  };

  return { copied, copy };
}
