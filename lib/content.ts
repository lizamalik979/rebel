/**
 * Every string on the homepage lives here so copy edits never require touching
 * layout. Emphasis inside body copy is marked with *asterisks* and rendered by
 * `<Emphasis>` — see components/emphasis.tsx.
 */

/**
 * Client contact details. Single source of truth — every mailto, tel, and
 * profile link on the site reads from here, so changing a detail is one edit.
 * `*Href` variants carry the machine-readable form (no spaces or dashes in the
 * tel: URI, absolute https for the profile).
 */
export const SITE = {
  name: "Rebel Labz",
  email: "amigo@rebel-labz.com",
  phone: "+91-8828267791",
  phoneHref: "tel:+918828267791",
  linkedin: "linkedin.com/in/amigo-sharma",
  linkedinHref: "https://www.linkedin.com/in/amigo-sharma",
  tagline:
    "An intelligence lab researching, engineering, and democratizing intelligence.",
} as const;

/* ── Navigation ──────────────────────────────────────────────────────────── */

/**
 * One entry inside a dropdown.
 *
 * `links` nests: an entry that has them is a group — its own label captions the
 * links underneath it rather than standing beside them. `href` is optional for
 * exactly that case, because a group heading often has no page of its own
 * ("Solutions" is a section of the site, not a route).
 */
export type NavLink = {
  label: string;
  href?: string;
  /** Optional second line, shown in the dropdown only. */
  detail?: string;
  links?: NavLink[];
};

export type NavGroup = {
  label: string;
  links: NavLink[];
};

/**
 * Top-level navigation. An item either drops down (`links`) or is a plain
 * link. `spy` marks a same-page anchor the header highlights while its section
 * is on screen.
 */
export type NavItem = {
  label: string;
  href: string;
  links?: NavLink[];
  spy?: string;
};

/**
 * CMS pages that actually exist. Every one of them lives under /solutions —
 * that route serves both templates, and there is no /services/[slug] to link
 * to. The remaining pillars are homepage cards (see PILLARS) until their pages
 * ship.
 */
export const SOLUTION_LINKS: NavLink[] = [
  { label: "Agentic Automation", href: "/solutions/agentic-automation" },
  { label: "Decision Intelligence", href: "/solutions/decision-intelligence" },
  { label: "Applied Research", href: "/solutions/applied-research" },
];

/**
 * The navigation the site falls back to when the CMS header menu is empty or
 * unreachable — see lib/header-menu-api.ts. Editors assemble the real one under
 * Header Menu, and it can nest deeper than this.
 *
 * "Solutions" is a group, not a link: it opens the pillars underneath it and
 * has no page of its own, which is why its href is "#". Contact is deliberately
 * absent — HEADER_CTA already points at /contact, so a nav entry would be a
 * second link to the same page.
 */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Solutions", href: "#", links: SOLUTION_LINKS },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
];

export const HEADER_CTA = {
  label: "Collaborate with us",
  href: "/contact",
} as const;

/* ── Hero ────────────────────────────────────────────────────────────────── */

export const HERO = {
  eyebrow: "An Intelligence Lab",
  lede: "We believe intelligence is not merely artificial. It is adaptive, collective, and rooted in wisdom.",
  sub: SITE.tagline,
  cta: { label: "Trace the framework", href: "#principles" },
  note: "Intelligence is bigger than AI",
} as const;

/* ── Philosophy · Intelligence platforms ─────────────────────────────────── */

export type PlatformVisual = "memory" | "adaptive" | "collective";

/** Rendered as static cards — add `href` back when /platforms/* pages exist. */
export type Platform = {
  num: string;
  code: string;
  visual: PlatformVisual;
  title: string;
  body: string;
};

export const PLATFORMS: Platform[] = [
  {
    num: "01",
    code: "MEM_KNW",
    visual: "memory",
    title: "Memory & Knowledge Preservation",
    body: "Short-term context and long-term memory held as one continuous system, not two disconnected layers. Every decision leaves a trace: retrievable, connected, never rebuilt from scratch. *What forgets, relearns. What remembers, evolves.*",
  },
  {
    num: "02",
    code: "ADPT_RSN",
    visual: "adaptive",
    title: "Adaptive Reasoning Engines",
    body: "Reasoning that updates with context, not frozen at the moment it was trained. Built to hold a cost-performance tradeoff, not chase capability at any price. *The right answer today is proof of nothing tomorrow.*",
  },
  {
    num: "03",
    code: "COL_NET",
    visual: "collective",
    title: "Collective Intelligence Networks",
    body: "Cross-pollinated across disciplines, cumulative across time, curated rather than just aggregated. Many minds, one memory, growing sharper with every contribution. *No single participating mind, however capable, out-thinks a network that remembers.*",
  },
];

/* ── Strategic frameworks · four pillars ─────────────────────────────────── */

export type Pillar = {
  badge: string;
  kicker: string;
  title: string;
  body: string;
  /**
   * Omitted while a pillar has no page — the card then renders static rather
   * than linking to a 404. Add the path back once the route ships.
   */
  href?: string;
  image: string;
  alt: string;
  featured?: boolean;
};

export const PILLARS: Pillar[] = [
  {
    badge: "Pillar 01",
    kicker: "[ Decision Intelligence ]",
    title: "Decision Intelligence",
    body: "Every dashboard should end in a decision. We build the systems that get there.",
    href: "/solutions/decision-intelligence",
    image: "/pillars/decision-intelligence.jpg",
    alt: "Analyst reviewing decision charts across a laptop and printed reports",
  },
  {
    badge: "Pillar 02",
    kicker: "[ Customer Intelligence ]",
    title: "Customer Intelligence",
    body: "A customer is not a segment. They're a pattern that keeps evolving, and we build systems that keep up.",
    image: "/pillars/customer-intelligence.jpg",
    alt: "A network of customer profile icons radiating from an open hand",
  },
  {
    badge: "Pillar 03",
    kicker: "[ Trust & Risk Intelligence ]",
    title: "Trust & Risk Intelligence",
    body: "Trust is a designed outcome, not a compliance afterthought.",
    image: "/pillars/trust-risk-intelligence.jpg",
    alt: "A red dart resting beside a torn paper label reading Target",
  },
  {
    badge: "Pillar 04",
    kicker: "[ Memory Intelligence™ ]",
    title: "Memory Intelligence™",
    body: "Intelligence without memory cannot evolve. This is where we differ from everyone else on this page.",
    image: "/pillars/memory-intelligence.jpg",
    alt: "A robotic hand cradling a glowing neural memory lattice",
    featured: true,
  },
];

/* ── Foundational principles · the constitution ──────────────────────────── */

export type Principle = {
  ident: string;
  tag: string;
  name: string;
  sub: string;
  /** Index into the waveform signature generator. See components/signature.tsx */
  wave: number;
  copy: string;
};

export const PRINCIPLES: Principle[] = [
  {
    ident: "01 // MEM_CORE · STAGE 01–03",
    tag: "the foundation",
    name: "Contextual Memory",
    sub: "Nothing Forgotten",
    wave: 2,
    copy: "Data becomes information becomes memory: the *raw-to-held* foundation everything else stands on. What forgets, relearns the hard way. What remembers, evolves.",
  },
  {
    ident: "02 // KNW_SHR · STAGE 04",
    tag: "shared",
    name: "Collective Knowledge",
    sub: "Multiplied, Not Hoarded",
    wave: 3,
    copy: "Memory connects into structure. This is knowledge, and it only grows richer when it is *shared*. Given away, it multiplies. Kept to yourself, it quietly rots.",
  },
  {
    ident: "03 // LRN_CONT · STAGE 05",
    tag: "refined",
    name: "Continuous Learning",
    sub: "Feedback Loop and Always in Beta mode",
    wave: 4,
    copy: "Knowledge refined by feedback, one *correction* at a time, without end. There is no final version, only the next one.",
  },
  {
    ident: "04 // HAI_SYNC · STAGE 06–07",
    tag: "together",
    name: "Shared Cognition",
    sub: "Many Minds, one integrated loop",
    wave: 5,
    copy: "Reasoning becomes intelligence exactly where human judgment and machine capability *meet*. Neither one is finished without the other.",
  },
  {
    ident: "05 // ADP_LAST · STAGE 08",
    tag: "outlasts",
    name: "Reinforced Adaptation",
    sub: "Outlasts Optimization",
    wave: 8,
    copy: "Intelligence that learns through action and consequence, reinforced by *outcome*, not frozen at the moment it was trained. Tuned for today dies the moment today ends.",
  },
  {
    ident: "06 // SMP_ENG · STAGE 09",
    tag: "subtract",
    name: "Applied Simplicity",
    sub: "Subtract to Create",
    wave: 7,
    copy: "Adaptation extended far enough becomes creativity, but only what *earns its place* survives the cut. Complexity is easy. Removing it well is the actual craft.",
  },
  {
    ident: "07 // COL_GROW · STAGE 10",
    tag: "multiplied",
    name: "Cross-Pollinated Thinking",
    sub: "Many Minds, One Memory",
    wave: 9,
    copy: "Creativity multiplied across researchers, communities, citizens, and *machines*. No single mind, however capable, outthinks a network that remembers.",
  },
  {
    ident: "08 // WIS_DIV · STAGE 11",
    tag: "tempered",
    name: "Distilled Intelligence",
    sub: "Never From One Voice",
    wave: 6,
    copy: "Collective intelligence tempered by judgment and ethics becomes *wisdom*. The moment wisdom comes from only one source, it is already wrong.",
  },
  {
    ident: "09 // ACC_ALL · STAGE 12",
    tag: "for everyone",
    name: "Universal Access",
    sub: "Built to Reach Everyone",
    wave: 10,
    copy: "Wisdom, finally, in service of *people*, but only if it actually gets to them. Power held by the few, however wise, was never really intelligence.",
  },
];

/* ── Why choose us ───────────────────────────────────────────────────────── */

export type Differentiator = {
  num: string;
  code: string;
  kicker: string;
  title: string;
  body: string;
};

export const DIFFERENTIATORS: Differentiator[] = [
  {
    num: "01",
    code: "LEAN_SYS",
    kicker: "Frugal by Design",
    title: "Priced for Adoption, Not Lock-In",
    body: "Small, efficient, affordable, measured by how well it adapts, not how much compute it burns.",
  },
  {
    num: "02",
    code: "ADPT_VAL",
    kicker: "Living Systems",
    title: "Keeps Learning After Launch",
    body: "Adaptive systems, not frozen software. Maintainable without us, so value compounds.",
  },
  {
    num: "03",
    code: "OPN_CORE",
    kicker: "Radically Open",
    title: "No Black Boxes",
    body: "Open frameworks and shared knowledge. You own what we build, from day one.",
  },
  {
    num: "04",
    code: "WIS_ROOT",
    kicker: "Judgment First",
    title: "Wisdom Before Capability",
    body: "Engineering that asks what's worth doing before what can be done.",
  },
];

export const ENGAGEMENT_TERMS = [
  "Scope fixed before work starts",
  "Success measured against outcome, not hours logged",
] as const;

/* ── Footer ──────────────────────────────────────────────────────────────── */

export const FOOTER_GROUPS: NavGroup[] = [
  { label: "Solutions", links: SOLUTION_LINKS },
  {
    label: "Resources",
    links: [
      // Blog and Whitepapers return once /resources/* exists.
      { label: "FAQ", href: "/solutions/decision-intelligence#faq" },
    ],
  },
  {
    label: "Organization",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];
