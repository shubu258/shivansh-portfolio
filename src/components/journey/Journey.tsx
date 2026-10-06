"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { SECTIONS, SPACING, type ContactLinks, type SectionId, type SectionProps } from "./sections";
import { ResumeButton } from "@/components/ui";
import { SocialIcons } from "@/components/socials";
import { profile } from "@/data/portfolio";
import Home from "@/components/sections/Home";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Security from "@/components/sections/Security";
import Contact from "@/components/sections/Contact";

const VIEWS: Record<SectionId, ComponentType<SectionProps>> = {
  home: Home,
  about: About,
  experience: Experience,
  skills: Skills,
  projects: Projects,
  security: Security,
  contact: Contact,
};

const LAST = SECTIONS.length - 1;
const EASE = [0.65, 0, 0.35, 1] as const;

const roomLeft = (col: number) => `${col * SPACING.x}vw`;
const roomTop = (row: number) => `${row * SPACING.y}dvh`;

function canScroll(el: HTMLElement | null | undefined, dir: number) {
  if (!el) return false;
  return dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 2 : el.scrollTop > 2;
}

export default function Journey({ links }: { links: ContactLinks }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0); // where we're heading (drives nav)
  const [arrived, setArrived] = useState<number | null>(0); // room whose content is revealed
  const [traveling, setTraveling] = useState(false);
  const [moved, setMoved] = useState(false);

  const indexRef = useRef(0);
  const travelingRef = useRef(false);
  const scrollers = useRef<(HTMLDivElement | null)[]>([]);
  const timers = useRef<number[]>([]);

  // Camera: position in room cells + zoom.
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const zoom = useMotionValue(1);
  const transform = useMotionTemplate`translate(50vw, 50dvh) scale(${zoom}) translate(calc(${cx} * -${SPACING.x}vw - 50vw), calc(${cy} * -${SPACING.y}dvh - 50dvh))`;
  const mapOpacity = useTransform(zoom, [0.55, 0.97], [1, 0]);

  const goTo = useCallback(
    (target: number) => {
      const next = Math.max(0, Math.min(LAST, target));
      const from = indexRef.current;
      if (next === from || travelingRef.current) return;

      const [fx, fy] = SECTIONS[from].cell;
      const [tx, ty] = SECTIONS[next].cell;
      const dist = Math.hypot(tx - fx, ty - fy);
      const duration = reduce ? 0 : Math.min(1.1 + dist * 0.18, 2);
      const depth = Math.max(0.38, 0.62 - (dist - 1) * 0.06);

      indexRef.current = next;
      travelingRef.current = true;
      setIndex(next);
      setArrived(null);
      setTraveling(true);
      setMoved(true);
      history.replaceState(null, "", `#${SECTIONS[next].id}`);

      // Enter the new room at the edge we're walking in from.
      const sc = scrollers.current[next];
      if (sc) sc.scrollTop = next > from ? 0 : sc.scrollHeight;

      timers.current.forEach(clearTimeout);
      if (duration === 0) {
        cx.set(tx);
        cy.set(ty);
        zoom.set(1);
      } else {
        animate(zoom, [1, depth, depth, 1], { duration, times: [0, 0.28, 0.72, 1], ease: "easeInOut" });
        animate(cx, tx, { duration: duration * 0.62, delay: duration * 0.18, ease: EASE });
        animate(cy, ty, { duration: duration * 0.62, delay: duration * 0.18, ease: EASE });
      }
      timers.current = [
        window.setTimeout(() => setArrived(next), duration * 780),
        window.setTimeout(() => {
          travelingRef.current = false;
          setTraveling(false);
        }, duration * 1000 + 60),
      ];
    },
    [cx, cy, zoom, reduce],
  );

  const goId = useCallback((id: SectionId) => goTo(SECTIONS.findIndex((s) => s.id === id)), [goTo]);

  // Deep links (#projects) land directly in the room.
  useEffect(() => {
    const i = SECTIONS.findIndex((s) => `#${s.id}` === window.location.hash);
    if (i > 0) {
      indexRef.current = i;
      cx.set(SECTIONS[i].cell[0]);
      cy.set(SECTIONS[i].cell[1]);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with URL once on mount
      setIndex(i);
      setArrived(i);
      setMoved(true);
    }
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, [cx, cy]);

  // In-page hash changes (#projects links, back/forward) walk to that room.
  useEffect(() => {
    const onHash = () => {
      const i = SECTIONS.findIndex((s) => `#${s.id}` === window.location.hash);
      if (i >= 0) goTo(i);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [goTo]);

  // Wheel / trackpad: one step per gesture, and rooms with long content scroll first.
  useEffect(() => {
    let lastWheel = 0;
    let gestureUsed = false;
    let acc = 0;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom
      const now = performance.now();
      if (now - lastWheel > 220) {
        gestureUsed = false;
        acc = 0;
      }
      lastWheel = now;

      const vertical = Math.abs(e.deltaY) >= Math.abs(e.deltaX);
      const delta = vertical ? e.deltaY : e.deltaX;
      if (delta === 0) return;
      const dir = delta > 0 ? 1 : -1;
      const sc = scrollers.current[indexRef.current];

      if (vertical && canScroll(sc, dir)) {
        gestureUsed = true; // reaching the end of a room needs a fresh gesture to leave it
        if (sc && !sc.contains(e.target as Node)) {
          e.preventDefault();
          sc.scrollBy({ top: e.deltaY });
        }
        return;
      }

      e.preventDefault();
      if (gestureUsed || travelingRef.current) return;
      acc += delta;
      if (Math.abs(acc) > 40) {
        gestureUsed = true;
        acc = 0;
        goTo(indexRef.current + dir);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goTo]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      const nextKeys = ["ArrowDown", "ArrowRight", "PageDown", " "];
      const prevKeys = ["ArrowUp", "ArrowLeft", "PageUp"];
      if (e.key === " " && t.closest("button, a")) return;

      let dir = 0;
      if (nextKeys.includes(e.key)) dir = e.shiftKey && e.key === " " ? -1 : 1;
      else if (prevKeys.includes(e.key)) dir = -1;
      else if (e.key === "Home") return (e.preventDefault(), goTo(0));
      else if (e.key === "End") return (e.preventDefault(), goTo(LAST));
      else if (/^[1-7]$/.test(e.key)) return goTo(Number(e.key) - 1);
      if (!dir) return;

      e.preventDefault();
      const sc = scrollers.current[indexRef.current];
      const isVertical = e.key !== "ArrowLeft" && e.key !== "ArrowRight";
      if (isVertical && canScroll(sc, dir)) {
        sc!.scrollBy({ top: dir * sc!.clientHeight * 0.7, behavior: "smooth" });
      } else {
        goTo(indexRef.current + dir);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  // Touch swipes
  useEffect(() => {
    let sx = 0;
    let sy = 0;
    let atTop = true;
    let atBottom = true;

    const onStart = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      const sc = scrollers.current[indexRef.current];
      atTop = !canScroll(sc, -1);
      atBottom = !canScroll(sc, 1);
    };
    const onEnd = (e: TouchEvent) => {
      const dx = sx - e.changedTouches[0].clientX;
      const dy = sy - e.changedTouches[0].clientY;
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 70) {
        if (dy > 0 && atBottom) goTo(indexRef.current + 1);
        if (dy < 0 && atTop) goTo(indexRef.current - 1);
      } else if (Math.abs(dx) > 80) {
        goTo(indexRef.current + (dx > 0 ? 1 : -1));
      }
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [goTo]);

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-bg"
      // The camera does all the moving. Hash jumps and focus can scroll this container
      // natively, which would offset the world twice — pin it back to the origin.
      onScroll={(e) => {
        e.currentTarget.scrollTop = 0;
        e.currentTarget.scrollLeft = 0;
      }}
    >
      <Ambient cx={cx} cy={cy} />

      {/* The world: every room lives on one big map; the camera travels between them. */}
      <motion.div className="absolute left-0 top-0 origin-top-left will-change-transform" style={{ transform }}>
        <div className="dot-grid absolute" style={{ left: "-100vw", top: "-100dvh", width: "700vw", height: "700dvh" }} />

        {SECTIONS.slice(1).map((s, i) => (
          <Trail key={s.id} from={SECTIONS[i].cell} to={s.cell} opacity={mapOpacity} lit={i < index} />
        ))}

        {SECTIONS.map((s, i) => {
          const View = VIEWS[s.id];
          const isHere = i === index;
          return (
            <section
              key={s.id}
              id={s.id}
              aria-label={s.label}
              inert={!isHere}
              className="absolute"
              style={{ left: roomLeft(s.cell[0]), top: roomTop(s.cell[1]), width: "100vw", height: "100dvh" }}
            >
              {/* Room outline + name, visible only while the camera is zoomed out */}
              <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: mapOpacity }} aria-hidden>
                <div
                  className="absolute inset-3 rounded-[48px] border-2"
                  style={{
                    borderColor: isHere ? s.color : "var(--line-strong)",
                    background: `radial-gradient(circle at 50% 45%, color-mix(in srgb, ${s.color} 14%, transparent), transparent 60%)`,
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3vh]">
                  <span
                    className="flex h-[26vh] w-[26vh] items-center justify-center rounded-[6vh] border-2"
                    style={{
                      color: s.color,
                      borderColor: `color-mix(in srgb, ${s.color} 45%, transparent)`,
                      background: `color-mix(in srgb, ${s.color} 12%, transparent)`,
                      boxShadow: `0 0 12vh -2vh color-mix(in srgb, ${s.color} 55%, transparent)`,
                    }}
                  >
                    <s.icon className="h-[12vh] w-[12vh]" strokeWidth={1.6} />
                  </span>
                  <span className="font-mono text-[4vh] uppercase tracking-[0.35em] text-cream/70">
                    <span style={{ color: s.color }}>{String(i + 1).padStart(2, "0")}</span> · {s.label}
                  </span>
                </div>
              </motion.div>

              <div
                ref={(el) => {
                  scrollers.current[i] = el;
                }}
                className="room-scroll relative h-full overflow-y-auto [mask-image:linear-gradient(transparent,black_88px,black_calc(100%-110px),transparent)]"
              >
                <div className="mx-auto flex min-h-full max-w-6xl flex-col justify-center px-5 pb-32 pt-24 sm:px-10">
                  <View active={arrived === i} go={goId} links={links} />
                </div>
              </div>
            </section>
          );
        })}
      </motion.div>

      <TopBar index={index} go={goTo} links={links} />
      <Walker index={index} traveling={traveling} go={goTo} reduce={!!reduce} />

      <AnimatePresence>
        {!moved && (
          <motion.div
            className="pointer-events-none fixed bottom-28 right-6 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-faint md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.6 } }}
            exit={{ opacity: 0 }}
          >
            Scroll to walk
            <motion.span
              className="flex h-8 w-5 justify-center rounded-full border border-line-strong pt-1.5"
              aria-hidden
            >
              <motion.span
                className="h-1.5 w-1 rounded-full bg-peach"
                animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grain pointer-events-none fixed inset-0" aria-hidden />
    </div>
  );
}

/** Dashed footpath between two rooms, drawn in the gap between them. */
function Trail({
  from,
  to,
  opacity,
  lit,
}: {
  from: readonly [number, number];
  to: readonly [number, number];
  opacity: MotionValue<number>;
  lit: boolean;
}) {
  const horizontal = from[1] === to[1];
  const style = horizontal
    ? {
        left: `calc(${Math.min(from[0], to[0]) * SPACING.x}vw + 100vw)`,
        top: `calc(${from[1] * SPACING.y}dvh + 50dvh)`,
        width: `${SPACING.x - 100}vw`,
        height: 0,
      }
    : {
        left: `calc(${from[0] * SPACING.x}vw + 50vw)`,
        top: `calc(${Math.min(from[1], to[1]) * SPACING.y}dvh + 100dvh)`,
        width: 0,
        height: `${SPACING.y - 100}dvh`,
      };

  return (
    <motion.div className="absolute" style={{ ...style, opacity }} aria-hidden>
      <div
        className={`absolute ${horizontal ? "inset-x-0 top-0 border-t-[6px]" : "inset-y-0 left-0 border-l-[6px]"} border-dashed ${
          lit ? "border-ember/80" : "border-cream/25"
        }`}
      />
      <span className="absolute left-0 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-peach shadow-[0_0_30px_var(--peach)]" />
    </motion.div>
  );
}

/** Soft colour fields that drift slower than the camera, for depth. */
function Ambient({ cx, cy }: { cx: MotionValue<number>; cy: MotionValue<number> }) {
  const x = useTransform(cx, [0, 3], ["0%", "-12%"]);
  const y = useTransform(cy, [0, 3], ["0%", "-12%"]);
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const sx = useSpring(mx, { stiffness: 120, damping: 25 });
  const sy = useSpring(my, { stiffness: 120, damping: 25 });
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${sx}px ${sy}px, rgb(34 211 255 / 0.07), transparent 70%)`;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <>
      <motion.div className="pointer-events-none absolute -inset-[20%]" style={{ x, y }} aria-hidden>
        <div className="absolute right-[10%] top-[5%] h-[60vh] w-[60vh] rounded-full bg-ember/[0.22] blur-[120px]" />
        <div className="absolute bottom-[0%] left-[5%] h-[70vh] w-[70vh] rounded-full bg-violet/[0.24] blur-[120px]" />
        <div className="absolute bottom-[25%] right-[35%] h-[40vh] w-[40vh] rounded-full bg-cyan/[0.14] blur-[100px]" />
      </motion.div>
      <motion.div className="pointer-events-none fixed inset-0 z-10" style={{ background: spotlight }} aria-hidden />
    </>
  );
}

function TopBar({ index, go, links }: { index: number; go: (i: number) => void; links: ContactLinks }) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
      <button onClick={() => go(0)} className="flex items-center gap-3 rounded-full" aria-label="Go to start">
        <span className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-ember/70 bg-[#243d36]">
          <Image src="/images/avatar-face.jpg" alt="" fill sizes="48px" className="object-cover" />
        </span>
        <span className="hidden text-sm font-medium text-cream sm:block">
          {profile.name}
          <span className="block font-mono text-[10px] font-normal uppercase tracking-widest text-faint">
            aka <span className="text-ember-soft">Filet</span>
          </span>
        </span>
      </button>

      <nav
        className="hidden items-center rounded-full border border-line bg-bg-2/70 p-1 backdrop-blur-md lg:flex"
        aria-label="Sections"
      >
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i)}
            aria-current={i === index ? "page" : undefined}
            className={`relative rounded-full px-3.5 py-1.5 text-[13px] transition ${
              i === index ? "text-bg" : "text-muted hover:text-cream"
            }`}
          >
            {i === index && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full bg-cream"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{s.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <SocialIcons links={links} include={["github", "linkedin", "x"]} size="h-9 w-9" className="hidden sm:flex lg:hidden xl:flex" />
        <SocialIcons links={links} include={["instagram", "threads"]} size="h-9 w-9" className="hidden 2xl:flex" />
        <ResumeButton compact align="right" />
      </div>
    </header>
  );
}

/** The traveller: your avatar walks a path of waypoints as you move between rooms. */
function Walker({
  index,
  traveling,
  go,
  reduce,
}: {
  index: number;
  traveling: boolean;
  go: (i: number) => void;
  reduce: boolean;
}) {
  const pct = (index / LAST) * 100;
  const travel = { duration: reduce ? 0 : 1.3, ease: EASE };

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-5">
      <div className="w-full max-w-xl rounded-full border border-line bg-bg-2/75 px-6 pb-3 pt-4 backdrop-blur-md sm:px-8">
        <div className="relative h-6">
          {/* path */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-line-strong" />
          <motion.div
            className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-ember/40 to-ember"
            animate={{ width: `${pct}%` }}
            transition={travel}
          />
          {/* waypoints */}
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              aria-label={`Go to ${s.label}`}
              className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2 p-2"
              style={{ left: `${(i / LAST) * 100}%` }}
            >
              <span
                className={`block h-2.5 w-2.5 rounded-full border-2 transition ${
                  i <= index ? "border-ember bg-ember" : "border-line-strong bg-bg group-hover:border-peach"
                }`}
              />
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-6 -translate-x-1/2 whitespace-nowrap rounded-md bg-cream px-2 py-1 text-[11px] font-medium text-bg opacity-0 transition group-hover:opacity-100">
                {s.label}
              </span>
            </button>
          ))}
          {/* the traveller */}
          <motion.div
            className="pointer-events-none absolute top-1/2 -translate-x-1/2"
            animate={{ left: `${pct}%` }}
            transition={travel}
            style={{ marginTop: -42 }}
          >
            <motion.div
              animate={traveling ? { y: [0, -7, 0], rotate: [-6, 6, -6] } : { y: 0, rotate: 0 }}
              transition={traveling ? { duration: 0.32, repeat: Infinity } : { duration: 0.3 }}
              className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-ember bg-[#243d36] shadow-[0_6px_24px_-4px_var(--ember)]"
            >
              <Image src="/images/avatar-face.jpg" alt="" fill sizes="48px" className="object-cover" />
            </motion.div>
          </motion.div>
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          <span className="flex items-center gap-1.5">
            <Current index={index} /> {String(index + 1).padStart(2, "0")} / {String(SECTIONS.length).padStart(2, "0")}
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              className="text-cream"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {SECTIONS[index].label}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Current({ index }: { index: number }) {
  const { icon: Icon, color } = SECTIONS[index];
  return <Icon className="h-3 w-3" style={{ color }} aria-hidden />;
}
