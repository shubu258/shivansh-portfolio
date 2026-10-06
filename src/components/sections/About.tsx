"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { GraduationCap, MapPin, Rocket } from "lucide-react";
import { profile } from "@/data/portfolio";
import { Eyebrow, Heading, Item, Reveal, Serif } from "@/components/ui";
import { LiveClock, Terminal, spot, type TermLine } from "@/components/live";
import type { SectionProps } from "@/components/journey/sections";

const whoami: TermLine[] = [
  { text: "whoami", tone: "cmd" },
  { text: "shivansh — full-stack blockchain developer" },
  { text: "cat stack.txt", tone: "cmd" },
  { text: "solidity · rust/anchor · cairo · next.js · node · postgres" },
  { text: "chains --status", tone: "cmd" },
  { text: "✓ ethereum  ✓ solana  ✓ polygon  ✓ starknet  ✓ bnb", tone: "ok" },
  { text: "echo $MOTTO", tone: "cmd" },
  { text: '"ship fast. ship safe."', tone: "warn" },
];

const card = "spotlight rounded-3xl border border-line bg-surface/60 backdrop-blur-sm";

export default function About({ active }: SectionProps) {
  return (
    <Reveal active={active}>
      <Item>
        <Eyebrow index="02">About</Eyebrow>
      </Item>
      <Item>
        <Heading>
          From contract <Serif>to interface.</Serif>
        </Heading>
      </Item>

      <div className="mt-10 grid gap-4 lg:grid-cols-12">
        {/* avatar */}
        <Item className="lg:col-span-4 lg:row-span-2">
          <div onPointerMove={spot} className={`${card} flex h-full flex-col overflow-hidden`} style={{ "--glow": "rgb(34 211 255 / 0.14)" } as CSSProperties}>
            <div className="relative min-h-56 flex-1 bg-[#243d36]">
              <Image src="/images/avatar.jpg" alt="Shivansh's avatar" fill sizes="(max-width: 1024px) 90vw, 24rem" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
            </div>
            <div className="relative p-5">
              <div className="flex flex-wrap items-baseline gap-x-2 text-lg font-semibold text-cream">
                {profile.name}
                <span className="rounded-full bg-ember/15 px-2 py-0.5 font-mono text-[11px] font-normal text-ember-soft">aka Filet</span>
              </div>
              <a href={profile.github} target="_blank" rel="noreferrer" className="font-mono text-sm text-cyan hover:text-cream">
                @shubu258
              </a>
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-bg/50 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ember/15 text-ember-soft">
                  <Rocket className="h-4 w-4" />
                </span>
                <div className="text-sm">
                  <div className="text-faint">Currently building</div>
                  <div className="font-medium text-cream">WorkChain on Solana @ Exaflair</div>
                </div>
              </div>
            </div>
          </div>
        </Item>

        {/* bio */}
        <Item className="lg:col-span-5">
          <div onPointerMove={spot} className={`${card} h-full p-6`}>
            {profile.bio.map((p) => (
              <p key={p.slice(0, 20)} className="leading-relaxed text-muted [&+&]:mt-4">
                {p}
              </p>
            ))}
          </div>
        </Item>

        {/* live clock */}
        <Item className="lg:col-span-3">
          <ClockCard active={active} />
        </Item>

        {/* terminal */}
        <Item className="lg:col-span-5">
          <Terminal title="~/shivansh — zsh" lines={whoami} active={active} className="h-full" />
        </Item>

        {/* education */}
        <Item className="lg:col-span-3">
          <div onPointerMove={spot} className={`${card} h-full p-6`} style={{ "--glow": "rgb(255 194 51 / 0.14)" } as CSSProperties}>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-peach/15 text-peach">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div className="mt-4 font-medium text-cream">{profile.education.degree}</div>
            <div className="mt-1 text-sm text-muted">{profile.education.school}</div>
            <div className="mt-3 inline-block rounded-full border border-line px-3 py-1 font-mono text-xs text-peach">
              {profile.education.years}
            </div>
          </div>
        </Item>
      </div>
    </Reveal>
  );
}

function ClockCard({ active }: { active: boolean }) {
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => {
    const read = () =>
      setHour(Number(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false })));
    const first = window.setTimeout(read, 0);
    const id = window.setInterval(read, 60_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [active]);
  const awake = hour === null || (hour >= 8 && hour < 24);

  return (
    <div
      onPointerMove={spot}
      className={`${card} relative h-full overflow-hidden p-6`}
      style={{ "--glow": "rgb(61 245 176 / 0.14)" } as CSSProperties}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-mint/20 blur-2xl" aria-hidden />
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
        <MapPin className="h-3.5 w-3.5 text-mint" /> Greater Noida · IST
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-tight text-cream">
        <LiveClock timeZone="Asia/Kolkata" />
      </div>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-mint/10 px-3 py-1 text-xs text-mint">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint/70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
        </span>
        {awake ? "Probably shipping code" : "Probably asleep — reply by morning"}
      </div>
    </div>
  );
}
