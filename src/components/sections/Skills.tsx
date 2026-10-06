"use client";

import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Blocks, BrainCircuit, Layers, Server, type LucideIcon } from "lucide-react";
import { skills, type SkillGroup } from "@/data/portfolio";
import { Eyebrow, Heading, Item, Reveal, Serif } from "@/components/ui";
import type { SectionProps } from "@/components/journey/sections";

const theme: Record<SkillGroup["group"], { color: string; Icon: LucideIcon }> = {
  Blockchain: { color: "var(--ember)", Icon: Blocks },
  "Full-Stack": { color: "var(--cyan)", Icon: Layers },
  Backend: { color: "var(--peach)", Icon: Server },
  AI: { color: "var(--violet)", Icon: BrainCircuit },
};

const CYCLE = 7; // seconds per group while auto-playing

/** Round-robin through a group's sub-sections so the orbit shows a mix. */
function highlights(g: SkillGroup, max = 10) {
  const out: string[] = [];
  for (let i = 0; out.length < max; i++) {
    const row = g.sections.map((s) => s.items[i]).filter(Boolean);
    if (!row.length) break;
    out.push(...row);
  }
  return out.slice(0, max);
}

const tint = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, transparent)`;

export default function Skills({ active }: SectionProps) {
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);
  const group = skills[current];
  const { color } = theme[group.group];

  const pick = (i: number) => {
    setAuto(false);
    setCurrent(i);
  };

  return (
    <Reveal active={active}>
      <Item>
        <Eyebrow index="04">Toolkit</Eyebrow>
      </Item>
      <Item>
        <Heading>
          The <Serif>tools</Serif> I reach for.
        </Heading>
      </Item>

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,27rem)] lg:gap-14">
        {/* group selector */}
        <Item className="space-y-3" role="tablist" aria-label="Skill groups">
          {skills.map((g, i) => {
            const t = theme[g.group];
            const on = i === current;
            const count = g.sections.reduce((n, s) => n + s.items.length, 0);
            return (
              <div
                key={g.group}
                className="overflow-hidden rounded-3xl border bg-surface/60 backdrop-blur-sm transition-colors"
                style={{
                  borderColor: on ? tint(t.color, 50) : "var(--line)",
                  background: on ? `linear-gradient(135deg, ${tint(t.color, 12)}, var(--surface) 60%)` : undefined,
                }}
              >
                <button
                  role="tab"
                  aria-selected={on}
                  onClick={() => pick(i)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition"
                    style={{ color: t.color, background: tint(t.color, on ? 22 : 10) }}
                  >
                    <t.Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-cream">{g.group}</span>
                    <span className="block truncate text-sm text-muted">{g.blurb}</span>
                  </span>
                  <span className="font-mono text-xs" style={{ color: on ? t.color : "var(--faint)" }}>
                    {String(count).padStart(2, "0")}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="space-y-3 px-4 pb-4">
                        {g.sections.map((s) => (
                          <div key={s.title} className="flex flex-wrap items-center gap-1.5">
                            <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: t.color }}>
                              {s.title}
                            </span>
                            {s.items.map((it, k) => (
                              <motion.span
                                key={it}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 + k * 0.03 }}
                                className="rounded-lg border border-line bg-bg/60 px-2.5 py-1 text-xs text-cream/90"
                              >
                                {it}
                              </motion.span>
                            ))}
                          </div>
                        ))}
                      </div>
                      {/* auto-play timer */}
                      <div className="h-0.5 bg-line">
                        {auto && active && (
                          <motion.div
                            key={current}
                            className="h-full"
                            style={{ background: t.color }}
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: CYCLE, ease: "linear" }}
                            onAnimationComplete={() => setCurrent((c) => (c + 1) % skills.length)}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Item>

        {/* orbit */}
        <Item>
          <Orbit group={group} color={color} />
        </Item>
      </div>
    </Reveal>
  );
}

function Orbit({ group, color }: { group: SkillGroup; color: string }) {
  const { Icon } = theme[group.group];
  const items = highlights(group);
  const inner = items.slice(0, 4);
  const outer = items.slice(4);

  return (
    <div className="relative mx-auto aspect-square w-[80%] max-w-[27rem] sm:w-full">
      {/* glow */}
      <motion.div
        className="absolute inset-[15%] rounded-full blur-3xl"
        animate={{ background: tint(color, 35) }}
        transition={{ duration: 0.6 }}
        aria-hidden
      />
      {/* rings */}
      {[
        { inset: "4%", dur: 60 },
        { inset: "24%", dur: 40 },
      ].map((r) => (
        <motion.div
          key={r.inset}
          className="absolute rounded-full border border-dashed"
          style={{ inset: r.inset }}
          animate={{ borderColor: tint(color, 35), rotate: 360 }}
          transition={{ borderColor: { duration: 0.6 }, rotate: { duration: r.dur, repeat: Infinity, ease: "linear" } }}
          aria-hidden
        />
      ))}

      {/* core */}
      <div className="absolute inset-[38%] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={group.group}
            className="flex h-full w-full flex-col items-center justify-center rounded-full border-2 bg-bg/80 backdrop-blur"
            style={{ borderColor: color, color, boxShadow: `0 0 60px -6px ${tint(color, 70)}` }}
            initial={{ scale: 0.6, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.6, opacity: 0, rotate: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Icon className="h-8 w-8" />
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cream">{group.group}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <Ring items={inner} radius={26} duration={40} reverse color={color} groupKey={group.group} />
      <Ring items={outer} radius={46} duration={60} color={color} groupKey={group.group} />
    </div>
  );
}

/** Chips spaced evenly on a circle that slowly rotates; chips counter-rotate to stay upright. */
function Ring({
  items,
  radius,
  duration,
  reverse = false,
  color,
  groupKey,
}: {
  items: string[];
  radius: number; // % of the orbit box
  duration: number;
  reverse?: boolean;
  color: string;
  groupKey: string;
}) {
  const spin = reverse ? -360 : 360;
  return (
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: spin }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <AnimatePresence>
        {items.map((it, i) => {
          const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
          const style: CSSProperties = {
            left: `${50 + Math.cos(a) * radius}%`,
            top: `${50 + Math.sin(a) * radius}%`,
          };
          return (
            <motion.div
              key={`${groupKey}-${it}`}
              className="absolute"
              style={{ ...style, x: "-50%", y: "-50%" }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.2 } }}
              transition={{ delay: 0.15 + i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div animate={{ rotate: -spin }} transition={{ duration, repeat: Infinity, ease: "linear" }}>
                <span
                  className="block whitespace-nowrap rounded-full border bg-surface/90 px-3 py-1.5 text-xs font-medium text-cream shadow-lg backdrop-blur"
                  style={{ borderColor: tint(color, 45), boxShadow: `0 6px 20px -8px ${tint(color, 60)}` }}
                >
                  {it}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
