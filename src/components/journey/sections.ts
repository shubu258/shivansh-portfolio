import {
  BriefcaseBusiness,
  FolderGit2,
  House,
  Send,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";

export const SECTIONS = [
  { id: "home", label: "Home", icon: House, color: "var(--ember)", cell: [0, 0] },
  { id: "about", label: "About", icon: UserRound, color: "var(--cyan)", cell: [1, 0] },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness, color: "var(--peach)", cell: [1, 1] },
  { id: "skills", label: "Toolkit", icon: Wrench, color: "var(--mint)", cell: [2, 1] },
  { id: "projects", label: "Projects", icon: FolderGit2, color: "var(--violet)", cell: [2, 2] },
  { id: "security", label: "Security", icon: ShieldCheck, color: "var(--mint)", cell: [3, 2] },
  { id: "contact", label: "Contact", icon: Send, color: "var(--ember)", cell: [3, 3] },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export type ContactLinks = {
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  x?: string;
  instagram?: string;
  threads?: string;
};

export type SectionProps = {
  active: boolean;
  go: (id: SectionId) => void;
  links: ContactLinks;
};

/** Distance between room origins, in viewport widths / heights. */
export const SPACING = { x: 120, y: 125 };
