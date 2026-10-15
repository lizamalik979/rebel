/**
 * Content for the solution (pillar) detail pages. One entry per pillar; the
 * section components in components/service/ render whatever they are handed,
 * so adding a pillar means adding a record here plus a route that reads it.
 */

export type Offering = {
  badge: string;
  title: string;
  body: string;
  bullets: string[];
  image: string;
  alt: string;
};

export type ComparisonRow = {
  feature: string;
  traditional: string;
  rebel: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type Solution = {
  slug: string;
  pillar: string;
  title: string;
  tagline: string;
  /** Alt + caption for the hero visual. */
  hero: { image: string; alt: string; badge: string };
  stats: { value: string; label: string }[];
  offerings: Offering[];
  comparison: ComparisonRow[];
  faqs: Faq[];
  /** Options for the "Interested In" select on the contact form. */
  interests: string[];
};

export const DECISION_INTELLIGENCE: Solution = {
  slug: "decision-intelligence",
  pillar: "Pillar 01",
  title: "Decision Intelligence",
  tagline:
    "Every dashboard should end in a decision. We build the systems that get there.",
  hero: {
    image: "/solutions/di-decisions.jpg",
    alt: "An analyst turning charts and printed reports into a decision",
    badge: "Signal → Decision",
  },
  stats: [
    { value: "4", label: "Offerings" },
    { value: "4–6 wks", label: "To Pilot" },
    { value: "100%", label: "Auditable" },
  ],
  offerings: [
    {
      badge: "01 // Strategy",
      title: "Enterprise Intelligence Strategy",
      body: "Aligning data, AI, and people into one operating model, not a slide deck.",
      bullets: [
        "Operating-model design across data, AI, and teams",
        "Decision inventory and prioritization",
        "Frugal roadmap with measurable ROI gates",
      ],
      image: "/solutions/di-strategy.jpg",
      alt: "A red dart beside a torn paper label reading Target",
    },
    {
      badge: "02 // Analytics",
      title: "Cognitive Analytics & Decision Systems",
      body: "Analytics that explains *why*, and recommends *what's next*.",
      bullets: [
        "Causal drivers, not correlations",
        "Recommended next actions with confidence",
        "Outcome logging that improves each cycle",
      ],
      image: "/solutions/di-decisions.jpg",
      alt: "An analyst reviewing decision charts across a laptop and printed reports",
    },
    {
      badge: "03 // Foundations",
      title: "AI-Native Data Foundations",
      body: "Memory before models: governed, trusted, ready for scale.",
      bullets: [
        "Governed memory core inside your perimeter",
        "Lineage on every read and write",
        "Stack-agnostic: layers on what you run",
      ],
      image: "/solutions/di-foundations.jpg",
      alt: "Isometric illustration of governed data blocks on a network",
    },
    {
      badge: "04 // Platforms",
      title: "Enterprise AI Platforms & Agents",
      body: "Built once, reused everywhere, not reinvented per project.",
      bullets: [
        "Reusable agent mesh across business units",
        "Scoped permissions with replayable audit trails",
        "Second use case ships in a fraction of the time",
      ],
      image: "/solutions/di-platforms.jpg",
      alt: "A robotic hand cradling a glowing neural lattice",
    },
  ],
  comparison: [
    {
      feature: "Output",
      traditional: "Static dashboards that stop at the chart",
      rebel: "Actionable decision systems that recommend the next move",
    },
    {
      feature: "Delivery model",
      traditional: "Disconnected pilots, one team at a time",
      rebel: "One integrated operating model across the enterprise",
    },
    {
      feature: "Reusability",
      traditional: "Rebuilt from scratch every project",
      rebel: "Reusable AI agents, built once and shared",
    },
    {
      feature: "Time to value",
      traditional: "Slow implementation, quarters before impact",
      rebel: "Working pilot in 4–6 weeks, measured against your outcome",
    },
    {
      feature: "Long-term cost",
      traditional: "High technical debt and rising compute spend",
      rebel: "Enterprise-ready scale, frugal by design",
    },
  ],
  faqs: [
    {
      question:
        "How does Decision Intelligence differ from traditional Business Intelligence?",
      answer:
        "BI reports what happened; Decision Intelligence closes the loop. Our systems carry memory of prior decisions, explain why a pattern is occurring, recommend the next action, and record the outcome so the next recommendation is better than the last.",
    },
    {
      question:
        "How long does it take to deploy an Enterprise AI Platform with Rebel Labz?",
      answer:
        "A working pilot on a real decision runs 4–6 weeks from kickoff. Production hardening typically follows within a quarter, and because the platform is reusable, the second and third use cases deploy in a fraction of the time.",
    },
    {
      question:
        "How do you ensure data governance and memory management across models?",
      answer:
        "Memory before models. Every system deploys on a governed memory core inside your perimeter, with scoped agent permissions, full lineage on every read and write, and a replayable audit trail your risk team can inspect line by line.",
    },
    {
      question:
        "Can Rebel Labz integrate with our existing enterprise data stack?",
      answer:
        "Yes. We are deliberately stack-agnostic. We connect to your existing warehouse, lakehouse, and operational systems rather than replacing them, so the memory core layers on top of what you already run.",
    },
  ],
  interests: [
    "Enterprise Intelligence Strategy",
    "Cognitive Analytics & Decision Systems",
    "AI-Native Data Foundations",
    "Enterprise AI Platforms & Agents",
    "Something else",
  ],
};
