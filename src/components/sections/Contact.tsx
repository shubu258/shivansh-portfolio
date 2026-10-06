"use client";

import Image from "next/image";
import { useState, type CSSProperties, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Mail, Phone, Send } from "lucide-react";
import { profile } from "@/data/portfolio";
import { Item, ResumeButton, Reveal } from "@/components/ui";
import { socialsFrom, telHref } from "@/components/socials";
import { LiveClock, spot } from "@/components/live";
import type { SectionProps } from "@/components/journey/sections";

export default function Contact({ active, links, go }: SectionProps) {
  const cards = [
    ...socialsFrom(links),
    ...(links.phone
      ? [{ key: "phone", label: "Phone", handle: links.phone, href: telHref(links.phone), Icon: Phone, color: "var(--mint)" }]
      : []),
  ];

  return (
    <Reveal active={active} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
      <div>
        <Item className="flex items-center gap-4">
          <span className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-ember bg-[#243d36] shadow-[0_0_40px_-5px_var(--ember)]">
            <Image src="/images/avatar-face.jpg" alt="" fill sizes="96px" className="object-cover" />
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1.5 font-mono text-xs text-mint">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
            <LiveClock timeZone="Asia/Kolkata" seconds={false} /> in Greater Noida
          </span>
        </Item>
        <Item className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-muted">
          <span className="text-ember-soft">07</span> — Contact
        </Item>
        <Item>
          <h2 className="mt-3 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
            Let&apos;s build something <span className="text-gradient font-serif font-normal italic">on-chain.</span>
          </h2>
        </Item>
        <Item>
          <p className="mt-5 max-w-md leading-relaxed text-muted">
            Smart contracts, a dApp or a full-stack product from scratch — my inbox is open and I usually reply within a day.
          </p>
        </Item>
        <Item className="mt-6 flex flex-wrap gap-2">
          {links.email && (
            <a
              href={`mailto:${links.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-2 text-sm text-cream transition hover:border-cyan/50 hover:text-cyan"
            >
              <Mail className="h-4 w-4 text-cyan" /> {links.email}
            </a>
          )}
          {links.phone && (
            <a
              href={telHref(links.phone)}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-2 text-sm text-cream transition hover:border-mint/50 hover:text-mint"
            >
              <Phone className="h-4 w-4 text-mint" /> {links.phone}
            </a>
          )}
        </Item>
        <Item className="relative z-20 mt-6 flex flex-wrap items-center gap-3">
          <ResumeButton />
          <button onClick={() => go("home")} className="rounded-full px-4 py-3 text-sm text-faint transition hover:text-cream">
            ↺ Walk back to start
          </button>
        </Item>
      </div>

      <div className="space-y-4">
        {links.email && (
          <Item>
            <Composer email={links.email} />
          </Item>
        )}
        <Item className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cards.map(({ key, label, handle, href, Icon, color }) => (
            <a
              key={key}
              href={href}
              target={key === "phone" ? undefined : "_blank"}
              rel="noreferrer"
              onPointerMove={spot}
              style={{ "--glow": `color-mix(in srgb, ${color} 18%, transparent)` } as CSSProperties}
              className="spotlight group flex items-center gap-3 rounded-2xl border border-line bg-surface/60 p-3 transition hover:-translate-y-1 hover:border-line-strong"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ color, background: `color-mix(in srgb, ${color} 14%, transparent)` }}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-cream">{label}</span>
                <span className="block truncate text-[11px] text-faint">{handle}</span>
              </span>
            </a>
          ))}
        </Item>
        <Item className="pt-2 text-center text-xs text-faint lg:text-left">
          © {new Date().getFullYear()} {profile.name} · aka Filet · Built with Next.js
        </Item>
      </div>
    </Reveal>
  );
}

/** Writes the message here, then hands it to the visitor's mail app. */
function Composer({ email }: { email: string }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Hello from ${name || "your portfolio"}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the address is still visible */
    }
  };

  const field =
    "w-full rounded-xl border border-line bg-bg/60 px-4 py-3 text-sm text-cream placeholder:text-faint outline-none transition focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20";

  return (
    <form
      onSubmit={submit}
      onPointerMove={spot}
      style={{ "--glow": "rgb(34 211 255 / 0.12)" } as CSSProperties}
      className="spotlight rounded-3xl border border-line bg-surface/70 p-5 backdrop-blur sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-cream">Send a message</div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted transition hover:border-cyan/50 hover:text-cyan"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={String(copied)} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
              {copied ? <Check className="h-3 w-3 text-mint" /> : <Copy className="h-3 w-3" />}
            </motion.span>
          </AnimatePresence>
          {copied ? "Copied!" : email}
        </button>
      </div>
      <div className="mt-4 space-y-3">
        <label className="sr-only" htmlFor="c-name">
          Your name
        </label>
        <input id="c-name" className={field} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        <label className="sr-only" htmlFor="c-msg">
          Message
        </label>
        <textarea
          id="c-msg"
          className={`${field} min-h-28 resize-none`}
          placeholder="Tell me about your project…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] text-faint">{message.length > 0 ? `${message.length} chars` : "Opens your mail app"}</span>
        <button
          type="submit"
          disabled={!message.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan to-violet px-5 py-2.5 text-sm font-medium text-bg transition enabled:hover:brightness-110 disabled:opacity-40"
        >
          Send <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  );
}
