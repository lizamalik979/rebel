/**
 * Content for the About page. Same convention as lib/contact.ts — components
 * render whatever they are handed.
 *
 * Imported from the Claude Design project "About v2 (Rebel Labz).dc.html".
 */

export type StoryCard = {
  stage: string;
  title: string;
  body: string;
};

export type Value = {
  code: string;
  title: string;
  desc: string;
  metric: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  /**
   * Portrait under public/team/. Left unset until the source images are
   * available — the card falls back to an initials monogram, so adding the
   * file and setting this path is the only change needed.
   */
  image?: string;
};

export type Badge = {
  code: string;
  title: string;
  desc: string;
};

export type PartnerOffer = {
  code: string;
  title: string;
  body: string;
  note: string;
};

export type AboutFaq = {
  question: string;
  answer: string;
};

export const STORY_CARDS: StoryCard[] = [
  {
    stage: "Already Running",
    title: "The memory core",
    body: "Live in pilot with design partners across logistics, financial risk, and public research, and small enough to run on modest hardware.",
  },
  {
    stage: "In Build",
    title: "Adaptive reasoning",
    body: "Context-aware reasoning that keeps the cost-performance tradeoff honest as the problem shifts underneath it.",
  },
  {
    stage: "Next",
    title: "Collective networks",
    body: "Open frameworks so knowledge compounds across organizations instead of dying inside one of them.",
  },
];

export const VALUES: Value[] = [
  {
    code: "01 // TRANSPARENCY",
    title: "Radical Transparency",
    desc: "Every decision path is open, logged, and replayable. No black boxes, ever.",
    metric: "100% auditable decisions",
  },
  {
    code: "02 // VELOCITY",
    title: "Speed Without Compromise",
    desc: "Pilots ship in weeks, not quarters, without cutting the constitution short.",
    metric: "4–6 weeks to pilot",
  },
  {
    code: "03 // CRAFT",
    title: "Engineering Perfection",
    desc: "Frugal, elegant systems over computational excess: measured, not assumed.",
    metric: "Runs on modest hardware",
  },
  {
    code: "04 // DISRUPTION",
    title: "Bold Disruption",
    desc: "We ship the uncomfortable idea if it is the right one. Capability follows judgment.",
    metric: "6 design partners",
  },
];

export const IMPACT_STATS = [
  { value: "6", label: "Design Partners" },
  { value: "4 wks", label: "Idea To Live Pilot" },
  { value: "9", label: "People In The Lab" },
  { value: "100%", label: "Constitution, Public" },
] as const;

export const TEAM: TeamMember[] = [
  {
    name: "Sana Rahal",
    role: "Founder / Research",
    bio: "Sets the research thesis and keeps the constitution honest.",
  },
  {
    name: "Marcus Idoko",
    role: "Head of Engineering",
    bio: "Owns the memory core and reasoning-engine architecture.",
  },
  {
    name: "Elin Vosskuhler",
    role: "Head of Deployment",
    bio: "Runs every pilot from scope to production, hands-on.",
  },
  {
    name: "Tobias Nkemelu",
    role: "Head of Trust & Risk",
    bio: "Builds the audit trails clients bring to their own boards.",
  },
];

export const BADGES: Badge[] = [
  {
    code: "DATA_SOV",
    title: "Data Sovereignty",
    desc: "Memory cores deploy inside your perimeter, so your data never leaves.",
  },
  {
    code: "ZERO_TRUST",
    title: "Zero-Trust Access",
    desc: "Every agent action is scoped, logged, and independently auditable.",
  },
  {
    code: "OPEN_AUDIT",
    title: "Open Constitution Audit",
    desc: "Our own nine principles, checked against every shipped system.",
  },
  {
    code: "FRUGAL_BM",
    title: "Frugal Compute Benchmark",
    desc: "Compute overhead measured and published, not just claimed.",
  },
];

export const PARTNER_OFFERS: PartnerOffer[] = [
  {
    code: "01 // Paid Pilot First",
    title: "Prove it on your problem",
    body: "A four-week paid pilot on a real decision in your operation. If it does not hold up, you keep the findings and we part as friends.",
    note: "No annual contract to start",
  },
  {
    code: "02 // Founder Access",
    title: "The people who build it",
    body: "There is no account layer between you and the engineers. Being small is the advantage we can offer that a large firm structurally cannot.",
    note: "Nine people, all reachable",
  },
  {
    code: "03 // Nothing Locked In",
    title: "Your data, your perimeter",
    body: "Memory cores run inside your infrastructure and the decision logic stays legible. If you ever leave us, the system does not leave with us.",
    note: "Open constitution, public",
  },
];

export const ABOUT_FAQS: AboutFaq[] = [
  {
    question: "You're a new lab. Why should we trust you with this?",
    answer:
      "You shouldn't, not on reputation, anyway. We are early, and we say so. What we offer instead is a published constitution to hold us to, a short paid pilot before any commitment, and systems small enough that you can audit them yourself rather than take our word for it.",
  },
  {
    question: "Who do you work with?",
    answer:
      "Enterprises, financial institutions, health networks, and public research bodies: anyone with a real decision problem and the willingness to open their process to an audit trail. Right now we take on a small number of design partners at a time.",
  },
  {
    question: "What's your methodology?",
    answer:
      "Discover, Architect, Pilot, Deploy, Evolve: five stages, four to six weeks to a working pilot, then a continuous feedback loop in production.",
  },
  {
    question: "How global is the lab?",
    answer:
      "Remote-first by design: nine people working from wherever the problem is, with the core team in India and pilots running across timezones.",
  },
];

/**
 * Founding year, and the lab's age in words.
 *
 * The About page leans on being new, so the one string that states the age is
 * computed rather than typed — a hardcoded "Year One" silently becomes wrong
 * every January. Every other age reference on the page is deliberately worded
 * to never need updating ("early", "young on purpose"), so this is the only
 * thing that can drift.
 *
 * Resolved at build time: the About page is statically prerendered, so it
 * corrects itself on each deploy rather than at midnight. Only imported by
 * server components, so there is no hydration mismatch to worry about.
 */
export const FOUNDED_YEAR = 2025;

const ORDINALS = [
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];

const yearIndex = Math.max(1, new Date().getFullYear() - FOUNDED_YEAR + 1);
/** "Two" in 2026, "Three" in 2027 — falls back to the numeral past ten. */
const YEAR_WORD = ORDINALS[yearIndex - 1] ?? String(yearIndex);

export const ABOUT = {
  hero: {
    badge: `Founded ${FOUNDED_YEAR} · Year ${YEAR_WORD}`,
    title: "A new lab, built on an old idea",
    lede: "Rebel Labz is young on purpose. No legacy stack to defend, no decade of consulting habits to unlearn. Just a small team building adaptive intelligence the way we believe it should have been built from the start.",
    primaryCta: { label: "See where we are", href: "#story" },
    secondaryCta: { label: "Partner With Us", href: "#cta" },
    /** Corner captions on the orbital canvas. */
    canvas: {
      badge: "One Lab · Four Pillars",
      year: `Year ${YEAR_WORD.toLowerCase()} · in motion`,
      hint: "move cursor · orbits bend",
      click: "click · pulse",
    },
  },
  story: {
    eyebrow: "Where We Are",
    heading: "An honest map of where we are",
    lede: "Most labs open with a decade of logos. We would rather show you exactly where we are, what is already running, and what we are building next.",
  },
  values: {
    eyebrow: "What Drives Us",
    heading: "Four commitments, no exceptions",
  },
  team: {
    eyebrow: "The Founding Team",
    heading: "Small enough that you will know everyone",
  },
  standards: {
    eyebrow: "Operational Excellence",
    heading: "The standards we hold from day one",
    body: "We are new, so we wrote these down before our first deployment rather than after our first incident. Every system we ship is measured against them.",
  },
  partners: {
    eyebrow: "Design Partners",
    heading: "We would rather earn it than claim it",
    aside:
      "No logo wall yet. We are early and our partners are still under NDA. Here is what we offer instead.",
    cohort: {
      eyebrow: "Cohort Two · Now Open",
      body: "We take on a handful of design partners at a time, so the lab stays closer to the work than to the pipeline.",
      // Opens the collaborate modal rather than navigating — see
      // components/about/collaborate-modal.tsx. No href by design.
      cta: { label: "Apply as a design partner" },
    },
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Asked, answered",
  },
  dualCta: {
    partners: {
      eyebrow: "For Clients & Partners",
      heading: "Bring us a real problem",
      body: "We scope fast, ship a working pilot in weeks, and measure success against your outcome, not our hours.",
      // Opens the collaborate modal rather than navigating.
      cta: { label: "Partner With Us" },
    },
    careers: {
      eyebrow: "For Careers & Talent",
      heading: "Come build the constitution.",
      /** `{roles}` is replaced with the live opening count. */
      body: "Remote-first, open by design, measured on outcomes, with {roles} open roles across research, engineering, and ops.",
      cta: { label: "Join the Lab", href: "/careers" },
    },
  },
} as const;
