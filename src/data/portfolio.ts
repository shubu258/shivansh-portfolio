export const profile = {
  name: "Shivansh Nigam",
  firstName: "Shivansh",
  role: "Full-Stack Blockchain Developer",
  location: "Greater Noida, Delhi NCR",
  github: "https://github.com/shubu258",
  x: "https://x.com/shivanshnigam0",
  intro:
    "I build end-to-end Web3 products — smart contracts on EVM and Solana, the APIs behind them and the polished Next.js apps people actually use.",
  bio: [
    "I'm a full-stack blockchain developer. I take products from idea to mainnet: contract architecture in Solidity, Rust/Anchor and Cairo, backends in Node and Postgres, and fast, clean frontends in Next.js.",
    "Security is built into how I work, not bolted on. I test with fuzzing, invariants and mainnet forks, and I've reported 25+ vulnerabilities across audits and contests — so the things I ship hold up.",
  ],
  education: {
    degree: "B.Tech — Information Technology",
    school: "Galgotias College of Engineering & Technology",
    years: "2022 – 2026",
  },
};

export const stats = [
  { value: "8", label: "Products shipped" },
  { value: "6", label: "Live in production" },
  { value: "5", label: "Chains shipped on" },
  { value: "30%+", label: "Gas optimized" },
];

export const marquee = [
  "Solidity",
  "Rust · Anchor",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Foundry",
  "Solana",
  "Ethereum",
  "PostgreSQL",
  "Supabase",
  "Cairo",
  "Polygon",
  "LLM Agents",
  "Tailwind CSS",
];

export const experience = [
  {
    company: "Exaflair",
    role: "Blockchain Developer",
    period: "Dec 2025 — Present",
    points: [
      "Own end-to-end smart contract development for WorkChain on Solana — from architecture to testing and deployment.",
      "Built with Rust + Anchor: unit tests, PDA debugging and optimized escrow logic.",
      "Hardened edge cases: double-claim prevention, authority validation and safe fund transfers.",
      "Translate business requirements into scalable, real-world on-chain logic with the team.",
    ],
    tags: ["Solana", "Rust", "Anchor", "Escrow"],
  },
  {
    company: "RecurXPay",
    role: "Security Researcher",
    period: "Sep 2025 — Oct 2025",
    points: [
      "Secured ERC-20, vesting, presale and wallet contracts.",
      "Optimized contracts for a 30%+ reduction in gas.",
      "Deep protocol testing with fuzzing, invariants and mainnet forking.",
      "Manual audits backed by Slither, Echidna and custom checklists.",
    ],
    tags: ["EVM", "Foundry", "Slither", "Echidna"],
  },
];

export const audits = [
  {
    title: "Private Audit — EVM",
    findings: 20,
    detail: "Private security review of EVM smart contracts.",
    href: "https://drive.google.com/file/d/122BFeFYzojGSN87atMspWMPrDA8aKrfk/view?usp=sharing",
  },
  {
    title: "Private Audit — Solana dApp",
    findings: 21,
    detail: "Security review of a Solana program and its dApp surface.",
    href: "https://drive.google.com/file/d/1qCuSDYZPbx7iGOxNJpXo33J6gBBEcKXy/view?usp=sharing",
  },
  {
    title: "CodeHawks First Flight #39 — Hawk High",
    findings: 3,
    detail: "2 High (broken invariant, incorrect math in graduateAndUpgrade) · 1 Low.",
    href: "https://github.com/shubu258/CodeHawks---First-flight",
  },
];

export type SkillGroup = {
  group: "Blockchain" | "Full-Stack" | "Backend" | "AI";
  blurb: string;
  sections: { title: string; items: string[] }[];
};

export const skills: SkillGroup[] = [
  {
    group: "Blockchain",
    blurb: "Smart contracts and protocols across EVM, Solana and StarkNet.",
    sections: [
      { title: "Languages", items: ["Solidity", "Rust", "Cairo"] },
      { title: "Frameworks", items: ["Foundry", "Hardhat", "Anchor", "OpenZeppelin", "Scarb"] },
      { title: "Chains & protocols", items: ["Ethereum", "Solana", "Polygon", "StarkNet", "BNB Chain", "Chainlink", "Uniswap", "Aave"] },
      { title: "Security & testing", items: ["Fuzzing", "Invariants", "Mainnet forking", "Slither", "Echidna"] },
    ],
  },
  {
    group: "Full-Stack",
    blurb: "dApps and products people enjoy using.",
    sections: [
      { title: "Languages", items: ["TypeScript", "JavaScript"] },
      { title: "Frontend", items: ["Next.js", "React", "Tailwind CSS", "Motion"] },
      { title: "Web3 client", items: ["Ethers.js", "Web3.js", "ConnectKit", "ENS"] },
      { title: "Shipping", items: ["Vercel", "GitHub Actions"] },
    ],
  },
  {
    group: "Backend",
    blurb: "APIs, relayers and data layers behind the product.",
    sections: [
      { title: "Runtime & APIs", items: ["Node.js", "Express", "REST", "Relayers"] },
      { title: "Data", items: ["PostgreSQL", "Supabase", "MongoDB", "The Graph"] },
      { title: "Also", items: ["Python", "Java", "Render", "Tenderly"] },
    ],
  },
  {
    group: "AI",
    blurb: "LLM-powered features inside real products.",
    sections: [
      { title: "Building with", items: ["LLM APIs", "AI agents", "Prompt engineering"] },
      { title: "Shipped in", items: ["ChainHound", "AgentRail", "The Wire Desk"] },
    ],
  },
];

export type Category = "Blockchain" | "AI" | "Full-Stack";

export const categories: { name: Category; blurb: string }[] = [
  { name: "Blockchain", blurb: "Protocols and on-chain products on Solana and EVM." },
  { name: "AI", blurb: "AI agents and automation wired into real products." },
  { name: "Full-Stack", blurb: "End-to-end web platforms, from database to UI." },
];

export type Project = {
  name: string;
  tagline: string;
  description: string;
  category: Category;
  highlights: string[];
  tags: string[];
  live?: string;
  repo?: string;
  /** Live link is shared in the resume instead of publicly. */
  linkInResume?: boolean;
};

export const projects: Project[] = [
  {
    name: "WorkChain",
    tagline: "Trustless freelance escrow on Solana",
    description:
      "Milestone-based work and payments on Solana. Clients lock funds in a program-owned escrow, approve delivered work, and payments release to freelancers automatically.",
    category: "Blockchain",
    highlights: [
      "Escrow logic built with Rust + Anchor and PDAs",
      "Double-claim prevention and authority validation",
      "Safe fund transfers, covered by unit tests",
    ],
    tags: ["Solana", "Rust", "Anchor", "Escrow"],
    linkInResume: true,
  },
  {
    name: "Relyn",
    tagline: "Token airdrops without code",
    description:
      "A platform for protocols to launch professional token airdrops without writing a line of code, through a guided six-step campaign flow.",
    category: "Blockchain",
    highlights: [
      "Guided six-step airdrop campaign builder",
      "Treasury distribution managed end-to-end",
      "No-code experience for protocol teams",
    ],
    tags: ["Token airdrops", "Smart contracts", "No-code"],
    live: "https://relyn.blocsuite.xyz/",
  },
  {
    name: "GoMarket",
    tagline: "Digital fan card for clubs",
    description:
      "A fan loyalty card for football clubs. Supporters earn points, climb tiers and unlock member benefits.",
    category: "Blockchain",
    highlights: ["Points and tier progression", "Member benefits and rewards", "Mobile-first fan experience"],
    tags: ["Loyalty", "Web3", "Fan engagement"],
    live: "https://gomarket-fan-vd8x5.ondigitalocean.app/",
  },
  {
    name: "ChainHound",
    tagline: "AI blockchain investigation engine",
    description:
      "AI-powered fund tracing. Paste a wallet and ChainHound maps its transaction network, naming every related address through ENS so fund flows read at a glance.",
    category: "AI",
    highlights: [
      "AI-assisted wallet investigation and fund tracing",
      "ENS naming across the whole wallet network",
      "Node API with a Next.js frontend",
    ],
    tags: ["AI", "TypeScript", "Next.js", "ENS"],
    live: "https://chain-hound-nu.vercel.app",
    repo: "https://github.com/shubu258/Chain-Hound-",
  },
  {
    name: "AgentRail",
    tagline: "Authorization rails for AI agents",
    description:
      "Instruction-level authorization for AI agents. An agent's permissions are published as an ENS name and enforced on-chain, so it cannot do what it wasn't authorized to do.",
    category: "AI",
    highlights: [
      "Agent permissions published as an ENS name",
      "Enforced on-chain, not by convention",
      "Paste an agent's name to see exactly what it may do",
    ],
    tags: ["AI agents", "ENS", "On-chain auth"],
    live: "https://agentrail-delta.vercel.app/",
  },
  {
    name: "The Wire Desk",
    tagline: "Write it once. Wire it everywhere.",
    description:
      "AI social media automation. Hand it a topic and it drafts three angles, schedules them and publishes across every connected platform.",
    category: "AI",
    highlights: [
      "One prompt → three AI-written angles",
      "Scheduled auto-publishing with optional AI refresh",
      "LinkedIn, X and Instagram/Facebook in one send",
    ],
    tags: ["AI", "Automation", "Social APIs", "Next.js"],
    live: "https://the-wire-desk1.vercel.app/",
  },
  {
    name: "Aurelia",
    tagline: "Fine jewellery e-commerce",
    description:
      "An e-commerce platform for handmade fine jewellery. Shoppers explore every piece in 3D or design their own ring.",
    category: "Full-Stack",
    highlights: ["Interactive 3D product views", "Custom ring designer", "Full storefront: catalogue, cart and checkout"],
    tags: ["E-commerce", "3D", "TypeScript", "Next.js"],
    live: "https://ecommerce-website-beta-lake.vercel.app/",
  },
  {
    name: "Karisava CRM",
    tagline: "Medical-tourism referral CRM",
    description:
      "A CRM that tracks every patient referral from first contact to active care, keeping patient details, medical reports, pipeline status and team assignments in one place.",
    category: "Full-Stack",
    highlights: [
      "Express + TypeScript REST API",
      "Separate sales and admin Next.js apps",
      "Supabase Postgres, Auth and Storage",
    ],
    tags: ["TypeScript", "Express", "Next.js", "Supabase"],
  },
];
