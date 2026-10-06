"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  BrainCircuit,
  Check,
  FileDown,
  Layers,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { categories, projects, type Category, type Project } from "@/data/portfolio";
import { Eyebrow, GithubIcon, Heading, Item, Reveal, Serif, Tag } from "@/components/ui";
import type { SectionProps } from "@/components/journey/sections";

const theme: Record<Category, { color: string; Icon: LucideIcon }> = {
  Blockchain: { color: "var(--ember)", Icon: Blocks },
  AI: { color: "var(--violet)", Icon: BrainCircuit },
  "Full-Stack": { color: "var(--cyan)", Icon: Layers },
};

const tint = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, transparent)`;
const host = (url: string) => new URL(url).host;

export default function Projects({ active }: SectionProps) {
  const [current, setCurrent] = useState(0);
  const [explored, setExplored] = useState(false);
  const project = projects[current];

  const select = (i: number) => {
    setExplored(true);
    setCurrent(i);
  };

  return (
    <Reveal active={active}>
      <Item>
        <Eyebrow index="05">Projects</Eyebrow>
      </Item>
      <Item>
        <Heading>
          Things I&apos;ve <Serif>built.</Serif>
        </Heading>
      </Item>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-10">
        {/* category + project picker */}
        <Item className="space-y-3">
          {categories.map((cat) => {
            const t = theme[cat.name];
            const list = projects.filter((p) => p.category === cat.name);
            const open = project.category === cat.name;
            return (
              <div
                key={cat.name}
                className="overflow-hidden rounded-3xl border bg-surface/60 backdrop-blur-sm transition-colors"
                style={{
                  borderColor: open ? tint(t.color, 50) : "var(--line)",
                  background: open ? `linear-gradient(135deg, ${tint(t.color, 12)}, var(--surface) 60%)` : undefined,
                }}
              >
                <button
                  onClick={() => select(projects.indexOf(list[0]))}
                  aria-expanded={open}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                    style={{ color: t.color, background: tint(t.color, open ? 22 : 10) }}
                  >
                    <t.Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-cream">{cat.name}</span>
                    <span className="block truncate text-sm text-muted">{cat.blurb}</span>
                  </span>
                  <span className="font-mono text-xs" style={{ color: open ? t.color : "var(--faint)" }}>
                    {String(list.length).padStart(2, "0")}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="px-2 pb-2"
                    >
                      {list.map((p, k) => {
                        const idx = projects.indexOf(p);
                        const on = idx === current;
                        return (
                          <li key={p.name}>
                            <button
                              onClick={() => select(idx)}
                              aria-current={on}
                              className="group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-bg/40"
                            >
                              {on && (
                                <motion.span
                                  layoutId="project-pick"
                                  className="absolute inset-0 overflow-hidden rounded-2xl border"
                                  style={{
                                    borderColor: tint(t.color, 55),
                                    background: `linear-gradient(90deg, ${tint(t.color, 18)}, color-mix(in srgb, var(--bg) 60%, transparent) 70%)`,
                                    boxShadow: `0 0 24px -8px ${tint(t.color, 60)}`,
                                  }}
                                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                >
                                  {/* accent bar */}
                                  <span className="absolute inset-y-2 left-0 w-1 rounded-r-full" style={{ background: t.color }} />
                                </motion.span>
                              )}
                              {/* nudge: siblings pulse until the visitor picks a project */}
                              {!on && !explored && active && (
                                <motion.span
                                  className="pointer-events-none absolute inset-0 rounded-2xl border"
                                  style={{ borderColor: tint(t.color, 45) }}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ duration: 1.6, delay: 1.2 + k * 0.25, repeat: 2, repeatDelay: 1.2 }}
                                />
                              )}
                              <span className="relative min-w-0 flex-1">
                                <span
                                  className={`block text-sm font-medium transition-colors ${on ? "" : "text-muted group-hover:text-cream"}`}
                                  style={on ? { color: t.color } : undefined}
                                >
                                  {p.name}
                                </span>
                                <span className="block truncate text-xs text-faint">{p.tagline}</span>
                              </span>
                              {on ? (
                                <span className="relative font-mono text-[10px] text-cream/70">
                                  {k + 1}/{list.length}
                                </span>
                              ) : (
                                <ArrowRight
                                  className="relative h-3.5 w-3.5 -translate-x-1 text-cream opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                                  aria-hidden
                                />
                              )}
                              <span className="relative">
                                {p.live ? (
                                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-mint">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" /> live
                                  </span>
                                ) : (
                                  <Lock className="h-3.5 w-3.5 text-faint" aria-label="Private" />
                                )}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Item>

        {/* showcase */}
        <Item>
          <AnimatePresence mode="wait">
            <Showcase
              key={project.name}
              project={project}
              index={current}
              onStep={(d) => select((current + d + projects.length) % projects.length)}
            />
          </AnimatePresence>
        </Item>
      </div>
    </Reveal>
  );
}

function Showcase({ project: p, index, onStep }: { project: Project; index: number; onStep: (d: number) => void }) {
  const { color, Icon } = theme[p.category];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-3xl border bg-surface/70 shadow-2xl backdrop-blur"
      style={{ borderColor: tint(color, 35), boxShadow: `0 40px 80px -40px ${tint(color, 55)}` }}
    >
      {/* browser chrome */}
      <div className="flex items-center gap-3 border-b border-line bg-bg/60 px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ember" />
          <span className="h-2.5 w-2.5 rounded-full bg-peach" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 font-mono text-[11px] text-muted">
          <Lock className="h-3 w-3 shrink-0 text-mint" />
          <span className="truncate">{p.live ? host(p.live) : p.linkInResume ? "private build · link in resume" : "private client project"}</span>
        </span>
        <span className="font-mono text-[11px] text-faint">
          {String(index + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}
        </span>
      </div>

      {/* poster */}
      <div
        className="relative flex h-44 items-end overflow-hidden px-6 pb-5 sm:h-48"
        style={{ background: `radial-gradient(120% 140% at 85% 0%, ${tint(color, 40)}, transparent 55%), var(--bg-2)` }}
      >
        <div className="dot-grid absolute inset-0 opacity-60" aria-hidden />
        <motion.div
          className="absolute -right-6 -top-6 flex h-40 w-40 items-center justify-center rounded-[2.5rem] border-2 sm:right-6 sm:top-6 sm:h-32 sm:w-32"
          style={{ color, borderColor: tint(color, 45), background: tint(color, 12) }}
          animate={{ rotate: [0, 6, -4, 0], y: [0, -6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <Icon className="h-14 w-14" strokeWidth={1.5} />
        </motion.div>
        <div className="relative">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color, background: tint(color, 15) }}
          >
            <Icon className="h-3 w-3" /> {p.category}
          </span>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-cream sm:text-4xl">{p.name}</h3>
          <p className="mt-1 font-serif text-lg italic text-cream/80">{p.tagline}</p>
        </div>
      </div>

      {/* details */}
      <div className="p-6">
        <p className="leading-relaxed text-muted">{p.description}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-3">
          {p.highlights.map((h, i) => (
            <motion.li
              key={h}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="flex gap-2 rounded-2xl border border-line bg-bg/50 p-3 text-xs leading-relaxed text-cream/85"
            >
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color }} />
              {h}
            </motion.li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-bg transition hover:brightness-110"
              style={{ background: color }}
            >
              Visit live site <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
          {p.linkInResume && (
            <a
              href="/api/resume?type=blockchain"
              download="shivansh-blockchain-developer.pdf"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-bg transition hover:brightness-110"
              style={{ background: color }}
            >
              Link in resume <FileDown className="h-4 w-4" />
            </a>
          )}
          {p.repo && (
            <a
              href={p.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm text-cream transition hover:border-cream"
            >
              <GithubIcon className="h-4 w-4" /> Code
            </a>
          )}
          {!p.live && !p.linkInResume && <span className="text-sm text-faint">Private client project — demo on request.</span>}

          <span className="ml-auto flex gap-2">
            <button
              onClick={() => onStep(-1)}
              aria-label="Previous project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition hover:border-line-strong hover:text-cream"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onStep(1)}
              aria-label="Next project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition hover:border-line-strong hover:text-cream"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </span>
        </div>
      </div>
    </motion.article>
  );
}
