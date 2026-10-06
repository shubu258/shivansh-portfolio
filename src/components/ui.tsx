"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { Blocks, ChevronDown, Eye, Layers } from "lucide-react";

const stagger: Variants = {
  hide: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const rise: Variants = {
  hide: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Staggers its <Item> children in when the room becomes active. */
export function Reveal({
  active,
  className,
  children,
}: {
  active: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hide"
      animate={active ? "show" : "hide"}
    >
      {children}
    </motion.div>
  );
}

export function Item({ className, children, ...rest }: ComponentProps<typeof motion.div>) {
  return (
    <motion.div className={className} variants={rise} {...rest}>
      {children}
    </motion.div>
  );
}

export function Eyebrow({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-muted">
      <span className="text-ember-soft">{index}</span>
      <span className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </div>
  );
}

export function Heading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-cream sm:text-5xl lg:text-6xl">
      {children}
    </h2>
  );
}

export function Serif({ children }: { children: ReactNode }) {
  return <span className="font-serif font-normal italic text-peach">{children}</span>;
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-bg/40 px-2.5 py-1 font-mono text-[11px] text-muted">
      {children}
    </span>
  );
}

export function GithubIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function XIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
    </svg>
  );
}

export function LinkedinIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export const RESUMES = [
  {
    type: "fullstack",
    title: "Full-Stack Blockchain Developer",
    file: "shivansh-fullstack-blockchain-developer.pdf",
    Icon: Layers,
    color: "var(--cyan)",
  },
  {
    type: "blockchain",
    title: "Blockchain Developer",
    file: "shivansh-blockchain-developer.pdf",
    Icon: Blocks,
    color: "var(--ember)",
  },
] as const;

/** Resume download button: opens a menu to pick which resume to download (served by /api/resume). */
export function ResumeButton({
  compact = false,
  align = "left",
  label,
}: {
  compact?: boolean;
  align?: "left" | "right";
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`group inline-flex items-center gap-2 rounded-full bg-ember font-medium text-cream shadow-[0_10px_30px_-10px_var(--ember)] transition hover:bg-ember-soft ${
          compact ? "px-4 py-2 text-sm" : "px-6 py-3"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 transition group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" />
        </svg>
        {label ?? (compact ? "Resume" : "Download Resume")}
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className={`absolute top-full z-40 mt-2 w-[19rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-line-strong bg-bg-2/95 p-2 shadow-2xl backdrop-blur-xl ${
              align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"
            }`}
          >
            <div className="px-3 pb-2 pt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Choose a resume</div>
            {RESUMES.map(({ type, title, file, Icon, color }) => (
              <div key={type} className="group/item flex items-center gap-1 rounded-xl transition hover:bg-surface">
                <a
                  role="menuitem"
                  href={`/api/resume?type=${type}`}
                  download={file}
                  onClick={() => setOpen(false)}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-2.5 text-left"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ color, background: `color-mix(in srgb, ${color} 15%, transparent)` }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-cream">{title}</span>
                    <span className="block truncate font-mono text-[10px] text-faint">{file}</span>
                  </span>
                </a>
                <a
                  href={`/api/resume?type=${type}&view`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Preview ${title} resume`}
                  title="Preview"
                  className="mr-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-faint transition hover:bg-bg/60 hover:text-cream"
                >
                  <Eye className="h-4 w-4" />
                </a>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
