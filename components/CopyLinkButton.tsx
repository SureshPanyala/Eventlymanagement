"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2 } from "lucide-react";

function fallbackCopy(text: string): boolean {
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(el);
  return ok;
}

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function handleCopy() {
    const url = window.location.origin + window.location.pathname;
    let ok = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        ok = true;
      } catch {
        ok = fallbackCopy(url);
      }
    } else {
      ok = fallbackCopy(url);
    }
    if (!ok) return;
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy link to this event"
      className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold transition hover:bg-surface2"
    >
      {copied ? <Check className="h-4 w-4 text-accent" /> : <Link2 className="h-4 w-4" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
    </button>
  );
}
