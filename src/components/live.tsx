"use client";

import { useEffect, useState, type PointerEvent } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";

/** Pointer handler for `.spotlight` cards — feeds the cursor position to the CSS glow. */
export function spot(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/** Number that counts up from 0 every time its room becomes active. */
export function CountUp({
  to,
  active,
  duration = 1.6,
  suffix = "",
  decimals = 0,
}: {
  to: number;
  active: boolean;
  duration?: number;
  suffix?: string;
  decimals?: number;
}) {
  const v = useMotionValue(0);
  const [text, setText] = useState("0");
  useMotionValueEvent(v, "change", (n) => setText(n.toFixed(decimals)));
  useEffect(() => {
    if (!active) {
      v.set(0);
      return;
    }
    const c = animate(v, to, { duration, ease: [0.22, 1, 0.36, 1], delay: 0.3 });
    return () => c.stop();
  }, [active, to, duration, v]);
  return (
    <span className="tabular-nums">
      {text}
      {suffix}
    </span>
  );
}

/** Ticking clock in a given time zone (rendered client-side only). */
export function LiveClock({ timeZone, seconds = true }: { timeZone: string; seconds?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = window.setInterval(tick, 1000);
    const first = window.setTimeout(tick, 0);
    return () => {
      clearInterval(id);
      clearTimeout(first);
    };
  }, []);
  if (!now) return <span className="tabular-nums opacity-0">00:00:00</span>;
  return (
    <span className="tabular-nums">
      {now.toLocaleTimeString("en-IN", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: seconds ? "2-digit" : undefined,
        hour12: true,
      })}
    </span>
  );
}

export type TermLine = { text: string; tone?: "cmd" | "out" | "ok" | "warn" | "crit" | "dim" };

const toneClass: Record<NonNullable<TermLine["tone"]>, string> = {
  cmd: "text-cream",
  out: "text-muted",
  ok: "text-mint",
  warn: "text-peach",
  crit: "text-ember-soft",
  dim: "text-faint",
};

/** Mini terminal that types its lines out while the room is active. */
export function Terminal({
  title,
  lines,
  active,
  speed = 18,
  className = "",
}: {
  title: string;
  lines: TermLine[];
  active: boolean;
  speed?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(0); // characters revealed across all lines
  const total = lines.reduce((n, l) => n + l.text.length, 0);

  useEffect(() => {
    if (!active) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 2;
      setShown(Math.min(n, total));
      if (n >= total) clearInterval(id);
    }, speed);
    return () => {
      clearInterval(id);
      setShown(0);
    };
  }, [active, total, speed]);

  const starts = lines.map((_, i) => lines.slice(0, i).reduce((n, l) => n + l.text.length, 0));
  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-[#05051a]/90 shadow-2xl ${className}`}>
      <div className="flex items-center gap-2 border-b border-line bg-surface/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-ember" />
        <span className="h-2.5 w-2.5 rounded-full bg-peach" />
        <span className="h-2.5 w-2.5 rounded-full bg-mint" />
        <span className="ml-2 font-mono text-[11px] text-faint">{title}</span>
      </div>
      <div className="space-y-1 p-4 font-mono text-[12.5px] leading-relaxed">
        {lines.map((l, i) => {
          const budget = shown - starts[i];
          const visible = l.text.slice(0, Math.max(0, budget));
          const typing = budget > 0 && budget < l.text.length;
          if (!visible) return <div key={i} className="h-[1.3em]" />;
          return (
            <div key={i} className={toneClass[l.tone ?? "out"]}>
              {l.tone === "cmd" && <span className="text-cyan">❯ </span>}
              {visible}
              {typing && <span className="caret">▍</span>}
            </div>
          );
        })}
        {shown >= total && (
          <div className="text-cyan">
            ❯ <span className="caret text-cream">▍</span>
          </div>
        )}
      </div>
    </div>
  );
}
