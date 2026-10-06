"use client";

import type { ComponentProps, ComponentType } from "react";
import { Mail, Phone } from "lucide-react";
import type { ContactLinks } from "@/components/journey/sections";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui";

type IconType = ComponentType<ComponentProps<"svg">>;

export function InstagramIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ThreadsIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.7 11.1c-.1-.05-.2-.1-.3-.14-.18-3.25-1.95-5.1-4.93-5.12h-.04c-1.78 0-3.26.76-4.17 2.14l1.64 1.12c.68-1.03 1.75-1.25 2.53-1.25h.03c.98 0 1.72.29 2.2.85.35.41.58.97.7 1.68a12.6 12.6 0 0 0-2.83-.14c-2.84.17-4.67 1.82-4.55 4.11.06 1.16.64 2.16 1.63 2.82.84.55 1.92.82 3.04.76 1.48-.08 2.64-.65 3.45-1.68.62-.79 1.01-1.8 1.18-3.08.7.43 1.23 1 1.51 1.68.49 1.16.52 3.07-1.04 4.62-1.36 1.36-3 1.95-5.48 1.97-2.75-.02-4.83-.9-6.18-2.62-1.27-1.6-1.92-3.93-1.95-6.9.03-2.97.68-5.3 1.95-6.9C6.4 3.25 8.48 2.37 11.23 2.35c2.77.02 4.89.9 6.29 2.64.69.85 1.2 1.92 1.54 3.17l1.92-.51c-.41-1.53-1.06-2.86-1.95-3.95C17.24 1.5 14.66.4 11.24.38h-.01C7.82.4 5.27 1.5 3.56 3.66 2.04 5.58 1.26 8.25 1.23 11.6v.02c.03 3.35.81 6.02 2.33 7.94 1.71 2.16 4.26 3.27 7.67 3.29h.01c3.03-.02 5.17-.81 6.93-2.58 2.31-2.3 2.24-5.19 1.48-6.97-.54-1.27-1.58-2.31-2.95-2.98Zm-5.23 4.92c-1.24.07-2.53-.49-2.6-1.69-.05-.89.63-1.88 2.68-2 .23-.01.46-.02.69-.02.74 0 1.44.07 2.07.21-.24 2.95-1.62 3.43-2.84 3.5Z" />
    </svg>
  );
}

export type Social = { key: string; label: string; handle: string; href: string; Icon: IconType; color: string };

const handleFromUrl = (url: string) => {
  try {
    const seg = new URL(url).pathname.split("/").filter(Boolean).pop() ?? "";
    return seg.startsWith("@") ? seg : `@${seg}`;
  } catch {
    return url;
  }
};

/** Every configured contact channel, in display order. Unset ones are skipped. */
export function socialsFrom(links: ContactLinks): Social[] {
  const out: (Social | false)[] = [
    !!links.github && { key: "github", label: "GitHub", handle: handleFromUrl(links.github), href: links.github, Icon: GithubIcon, color: "var(--violet)" },
    !!links.linkedin && { key: "linkedin", label: "LinkedIn", handle: handleFromUrl(links.linkedin), href: links.linkedin, Icon: LinkedinIcon, color: "var(--cyan)" },
    !!links.x && { key: "x", label: "X", handle: handleFromUrl(links.x), href: links.x, Icon: XIcon, color: "var(--cream)" },
    !!links.instagram && { key: "instagram", label: "Instagram", handle: handleFromUrl(links.instagram), href: links.instagram, Icon: InstagramIcon, color: "var(--ember)" },
    !!links.threads && { key: "threads", label: "Threads", handle: handleFromUrl(links.threads), href: links.threads, Icon: ThreadsIcon, color: "var(--peach)" },
  ];
  return out.filter((s): s is Social => !!s);
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Row of round icon links. */
export function SocialIcons({
  links,
  className = "",
  size = "h-10 w-10",
  include,
}: {
  links: ContactLinks;
  className?: string;
  size?: string;
  include?: string[];
}) {
  const list = socialsFrom(links).filter((s) => !include || include.includes(s.key));
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {list.map(({ key, label, href, Icon, color }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          title={label}
          className={`group flex ${size} items-center justify-center rounded-full border border-line bg-surface/50 text-muted backdrop-blur transition hover:-translate-y-0.5 hover:text-cream`}
          style={{ ["--c" as string]: color }}
        >
          <Icon className="h-4 w-4 transition group-hover:text-[var(--c)]" />
        </a>
      ))}
      {links.email && !include && (
        <a
          href={`mailto:${links.email}`}
          aria-label="Email"
          title={links.email}
          className={`group flex ${size} items-center justify-center rounded-full border border-line bg-surface/50 text-muted backdrop-blur transition hover:-translate-y-0.5 hover:text-mint`}
        >
          <Mail className="h-4 w-4" />
        </a>
      )}
      {links.phone && !include && (
        <a
          href={telHref(links.phone)}
          aria-label="Phone"
          title={links.phone}
          className={`group flex ${size} items-center justify-center rounded-full border border-line bg-surface/50 text-muted backdrop-blur transition hover:-translate-y-0.5 hover:text-mint`}
        >
          <Phone className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
