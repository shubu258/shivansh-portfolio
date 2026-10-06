"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { experience } from "@/data/portfolio";
import { Eyebrow, Heading, Item, Reveal, Serif, Tag } from "@/components/ui";
import { CountUp, spot } from "@/components/live";
import type { SectionProps } from "@/components/journey/sections";

const looks = [
  { accent: "text-cyan", dot: "bg-cyan", glow: "rgb(34 211 255 / 0.14)", Visual: EscrowFlow },
  { accent: "text-peach", dot: "bg-peach", glow: "rgb(255 194 51 / 0.14)", Visual: GasMeter },
];

export default function Experience({ active }: SectionProps) {
  return (
    <Reveal active={active}>
      <Item>
        <Eyebrow index="03">Experience</Eyebrow>
      </Item>
      <Item>
        <Heading>
          Where I&apos;ve <Serif>shipped.</Serif>
        </Heading>
      </Item>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {experience.map((job, i) => {
          const { accent, dot, glow, Visual } = looks[i % looks.length];
          return (
            <Item key={job.company}>
              <article
                onPointerMove={spot}
                style={{ "--glow": glow } as CSSProperties}
                className="spotlight flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface/60 transition hover:border-line-strong"
              >
                <Visual active={active} />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-semibold text-cream">{job.company}</h3>
                      <div className={accent}>{job.role}</div>
                    </div>
                    <span className="flex items-center gap-2 rounded-full border border-line bg-bg/50 px-3 py-1 font-mono text-xs text-muted">
                      <span className={`h-1.5 w-1.5 rounded-full ${dot} ${i === 0 ? "animate-pulse" : ""}`} />
                      {job.period}
                    </span>
                  </div>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {job.points.map((p) => (
                      <li key={p} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>
              </article>
            </Item>
          );
        })}
      </div>
    </Reveal>
  );
}

function Stage({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="relative border-b border-line bg-[#05051a]/70 px-6 pb-5 pt-4">
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
        <span>{label}</span>
        <span className="flex items-center gap-1.5 text-mint">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" /> live
        </span>
      </div>
      {children}
    </div>
  );
}

const escrowSteps = [
  { text: "Funds locked in escrow PDA", color: "text-cyan" },
  { text: "Milestone approved ✓", color: "text-peach" },
  { text: "Payment released to freelancer", color: "text-mint" },
];

/** Exaflair — Solana escrow: tokens travel client → PDA → freelancer. */
function EscrowFlow({ active }: { active: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % escrowSteps.length), 1700);
    return () => clearInterval(id);
  }, [active]);

  const nodes = ["Client", "Escrow PDA", "Freelancer"];
  return (
    <Stage label="WorkChain · Solana escrow">
      <div className="relative flex items-center justify-between">
        <div className="absolute inset-x-8 top-5 border-t-2 border-dashed border-line-strong" />
        {active && (
          <motion.span
            className="absolute top-5 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_16px_var(--cyan)]"
            animate={{ left: ["8%", "50%", "50%", "92%"] }}
            transition={{ duration: 5.1, times: [0, 0.3, 0.66, 1], repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {nodes.map((n, i) => (
          <div key={n} className="relative flex flex-col items-center gap-2">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl border font-mono text-xs transition ${
                (step === 0 && i <= 1) || (step === 1 && i === 1) || (step === 2 && i >= 1)
                  ? "border-cyan/60 bg-cyan/15 text-cyan"
                  : "border-line bg-surface text-faint"
              }`}
            >
              {["◎", "⛓", "◉"][i]}
            </span>
            <span className="text-[11px] text-muted">{n}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 h-5 overflow-hidden text-center font-mono text-xs">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className={escrowSteps[step].color}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
          >
            {escrowSteps[step].text}
          </motion.div>
        </AnimatePresence>
      </div>
    </Stage>
  );
}

/** RecurXPay — gas before/after and audit results. */
function GasMeter({ active }: { active: boolean }) {
  return (
    <Stage label="RecurXPay · optimization report">
      <div className="space-y-3">
        {[
          { label: "Before", pct: 100, cls: "bg-ember/70" },
          { label: "After", pct: 70, cls: "bg-gradient-to-r from-peach to-mint" },
        ].map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="w-12 font-mono text-[11px] text-faint">{b.label}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface">
              <motion.div
                className={`h-full rounded-full ${b.cls}`}
                initial={{ width: 0 }}
                animate={{ width: active ? `${b.pct}%` : 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="w-10 text-right font-mono text-[11px] text-muted">{b.pct}%</span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Metric label="gas saved" value={<CountUp to={30} suffix="%+" active={active} />} cls="text-mint" />
        <Metric label="systems secured" value={<CountUp to={4} active={active} />} cls="text-peach" />
        <Metric label="invariants" value="✓ held" cls="text-cyan" />
      </div>
    </Stage>
  );
}

function Metric({ label, value, cls }: { label: string; value: ReactNode; cls: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface/70 px-2 py-2">
      <div className={`font-mono text-sm font-semibold ${cls}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-faint">{label}</div>
    </div>
  );
}
