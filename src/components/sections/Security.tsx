"use client";

import type { CSSProperties } from "react";
import { Bug, FlaskConical, GitFork, ScanSearch } from "lucide-react";
import { audits } from "@/data/portfolio";
import { Eyebrow, Heading, Item, Reveal, Serif } from "@/components/ui";
import { CountUp, Terminal, spot, type TermLine } from "@/components/live";
import type { SectionProps } from "@/components/journey/sections";

const methods = [
  { title: "Manual review", body: "Line-by-line against checklists and known exploit patterns.", Icon: ScanSearch, cls: "text-cyan bg-cyan/12" },
  { title: "Fuzz & invariants", body: "Foundry and Echidna campaigns hunting broken guarantees.", Icon: FlaskConical, cls: "text-violet bg-violet/15" },
  { title: "Mainnet forking", body: "Replaying real state to test integrations and oracles.", Icon: GitFork, cls: "text-peach bg-peach/12" },
  { title: "Static analysis", body: "Slither, Mythril and Woke — then careful manual triage.", Icon: Bug, cls: "text-ember-soft bg-ember/12" },
];

const scan: TermLine[] = [
  { text: "slither . --checklist", tone: "cmd" },
  { text: "→ reentrancy guards ........ ok", tone: "ok" },
  { text: "→ access control ........... ok", tone: "ok" },
  { text: "→ oracle manipulation ...... review", tone: "warn" },
  { text: "→ unchecked transfer ....... HIGH", tone: "crit" },
  { text: "forge test --match-test invariant", tone: "cmd" },
  { text: "[PASS] invariant_solvency()", tone: "ok" },
  { text: "[PASS] invariant_noDoubleClaim()", tone: "ok" },
  { text: "report --summary", tone: "cmd" },
  { text: "41 findings across private audits · 2 High on CodeHawks", tone: "warn" },
];

const glows = ["rgb(255 46 126 / 0.16)", "rgb(163 116 255 / 0.18)", "rgb(61 245 176 / 0.14)"];
const nums = ["text-ember-soft", "text-violet", "text-mint"];

export default function Security({ active }: SectionProps) {
  return (
    <Reveal active={active}>
      <Item>
        <Eyebrow index="06">Security</Eyebrow>
      </Item>
      <Item>
        <Heading>
          Built to be <Serif>bulletproof.</Serif>
        </Heading>
      </Item>

      <div className="mt-10 grid gap-4 lg:grid-cols-12">
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
          {audits.map((a, i) => (
            <Item key={a.title}>
              <a
                href={a.href}
                target="_blank"
                rel="noreferrer"
                onPointerMove={spot}
                style={{ "--glow": glows[i] } as CSSProperties}
                className="spotlight group flex h-full flex-col rounded-3xl border border-line bg-surface/60 p-5 transition hover:-translate-y-1 hover:border-line-strong"
              >
                <div className={`text-5xl font-semibold tracking-tight ${nums[i]}`}>
                  <CountUp to={a.findings} active={active} />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">findings</div>
                <h3 className="mt-4 text-sm font-medium text-cream">{a.title}</h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted">{a.detail}</p>
                <span className="mt-4 text-xs text-cyan transition group-hover:text-cream">
                  View report <span aria-hidden>↗</span>
                </span>
              </a>
            </Item>
          ))}

          <Item className="grid gap-3 sm:col-span-3 sm:grid-cols-2">
            {methods.map(({ title, body, Icon, cls }) => (
              <div key={title} onPointerMove={spot} className="spotlight flex gap-3 rounded-2xl border border-line bg-surface/50 p-4">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cls}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-medium text-cream">{title}</div>
                  <p className="mt-0.5 text-xs leading-relaxed text-faint">{body}</p>
                </div>
              </div>
            ))}
          </Item>
        </div>

        <Item className="lg:col-span-5">
          <Terminal title="audit-session — live" lines={scan} active={active} speed={22} className="h-full" />
        </Item>
      </div>
    </Reveal>
  );
}
