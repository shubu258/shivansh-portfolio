"use client";

import Image from "next/image";
import { useEffect, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { marquee, profile, stats } from "@/data/portfolio";
import { Item, ResumeButton, Reveal } from "@/components/ui";
import { SocialIcons } from "@/components/socials";
import type { SectionProps } from "@/components/journey/sections";

const builds = [
  { word: "smart contracts", color: "text-peach" },
  { word: "full-stack dApps", color: "text-mint" },
  { word: "Solana programs", color: "text-violet" },
  { word: "AI-powered products", color: "text-ember-soft" },
];

export default function Home({ active, go, links }: SectionProps) {
  return (
    <div>
      <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <Reveal active={active}>
          <Item className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1.5 text-xs font-medium text-mint">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            Available for work · {profile.location}
          </Item>

          <Item>
            <p className="mt-5 text-lg text-muted">
              Hey, I&apos;m <span className="font-medium text-cream">{profile.name}</span> 👋
            </p>
          </Item>

          <Item>
            <h1 className="mt-2 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl xl:text-[4.9rem]">
              Full-Stack
              <br />
              <span className="text-gradient font-serif font-normal italic">Blockchain</span>
              <br />
              Developer<span className="text-ember">.</span>
            </h1>
          </Item>

          <Item>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-2 text-xl text-cream sm:text-2xl">
              I build <RotatingWord />
            </p>
          </Item>

          <Item>
            <p className="mt-4 max-w-xl leading-relaxed text-muted">{profile.intro}</p>
          </Item>

          <Item className="relative z-20 mt-8 flex flex-wrap items-center gap-3">
            <ResumeButton />
            <button
              onClick={() => go("projects")}
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 px-6 py-3 font-medium text-cream backdrop-blur transition hover:border-mint hover:text-mint"
            >
              Explore projects
              <span aria-hidden className="transition group-hover:translate-x-1">
                →
              </span>
            </button>
          </Item>

          <Item className="mt-6 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Find me on</span>
            <SocialIcons links={links} size="h-9 w-9" />
          </Item>

          <Item className="mt-7 flex max-w-xl flex-wrap gap-x-8 gap-y-4">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-8">
                {i > 0 && <span className="hidden h-8 w-px bg-line-strong sm:block" aria-hidden />}
                <div>
                  <div className="text-3xl font-semibold tracking-tight text-cream">{s.value}</div>
                  <div className="text-xs text-faint">{s.label}</div>
                </div>
              </div>
            ))}
          </Item>
        </Reveal>

        <Reveal active={active}>
          <Item>
            <Portrait />
          </Item>
        </Reveal>
      </div>

      <Reveal active={active}>
        <Item className="relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="marquee flex w-max gap-8 py-2 font-mono text-sm uppercase tracking-[0.18em] text-faint">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i} className="flex items-center gap-8">
                {m}
                <span className="text-ember" aria-hidden>
                  ✦
                </span>
              </span>
            ))}
          </div>
        </Item>
      </Reveal>
    </div>
  );
}

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % builds.length), 2400);
    return () => clearInterval(t);
  }, []);
  const b = builds[i];
  return (
    <span className="relative inline-flex overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={b.word}
          className={`font-serif italic ${b.color}`}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {b.word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Personal photo + avatar sticker, tilting gently toward the cursor. */
function Portrait() {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 150, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 18 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div className="relative mx-auto w-[min(21rem,78vw)] [perspective:1200px] lg:w-[min(23rem,42dvh)]" onPointerMove={onMove} onPointerLeave={reset}>
      {/* colour bloom */}
      <div className="absolute -inset-12 -z-10 rounded-full bg-gradient-to-tr from-ember/40 via-violet/30 to-peach/30 blur-3xl" aria-hidden />

      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative">
        <div className="ring-gradient relative aspect-[4/5] overflow-hidden rounded-[2.25rem] shadow-[0_40px_80px_-30px_rgb(255_61_110/0.45)]">
          <Image
            src="/images/shivansh.png"
            alt="Portrait of Shivansh Nigam"
            fill
            preload
            sizes="(max-width: 1024px) 78vw, 24rem"
            className="rounded-[2.1rem] object-cover object-[50%_18%]"
          />
          <div className="absolute inset-x-0 bottom-0 h-2/5 rounded-b-[2.1rem] bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-5 right-5 text-right" style={{ transform: "translateZ(30px)" }}>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/70">Currently</div>
            <div className="text-sm font-medium text-cream">Blockchain Dev @ Exaflair</div>
          </div>
        </div>

        {/* avatar sticker with spinning text ring */}
        <div className="absolute -bottom-10 -left-8 h-36 w-36 sm:-left-14 sm:h-40 sm:w-40" style={{ transform: "translateZ(60px)" }}>
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            aria-hidden
          >
            <defs>
              <path id="ring" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
            </defs>
            <text className="fill-cream font-mono text-[13px] uppercase tracking-[0.26em]">
              <textPath href="#ring">
                aka <tspan className="fill-ember-soft">Filet</tspan> ✦ Full Stack ✦ Blockchain Dev ✦
              </textPath>
            </text>
          </motion.svg>
          <div className="absolute inset-[19%] overflow-hidden rounded-full border-[3px] border-ember bg-[#243d36] shadow-[0_10px_40px_-6px_var(--ember)]">
            <Image src="/images/avatar-face.jpg" alt="Shivansh's avatar" fill sizes="128px" className="object-cover" />
          </div>
        </div>

        {/* floating chips */}
        <motion.div
          className="absolute -right-4 top-8 flex items-center gap-2 rounded-2xl border border-line bg-surface/90 px-3.5 py-2.5 shadow-xl backdrop-blur sm:-right-10"
          style={{ z: 80 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-peach/15 font-mono text-xs text-peach">{"</>"}</span>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-faint">On-chain</div>
            <div className="text-sm font-medium text-cream">Solidity · Rust</div>
          </div>
        </motion.div>
        <motion.div
          className="absolute -right-2 bottom-24 flex items-center gap-2 rounded-2xl border border-line bg-surface/90 px-3.5 py-2.5 shadow-xl backdrop-blur sm:-right-8"
          style={{ z: 50 }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint/15 text-xs text-mint">▲</span>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-faint">Off-chain</div>
            <div className="text-sm font-medium text-cream">Next.js · Node</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
