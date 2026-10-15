/**
 * Content for the careers page. Same convention as lib/solutions.ts — the
 * components render whatever they are handed, so copy edits never require
 * touching layout.
 *
 * Imported from the Claude Design project "Rebel Labz Careers (standalone)".
 */

/** Discipline a role belongs to. Doubles as the filter set on the board. */
export const DISCIPLINES = [
  "Research",
  "Engineering",
  "Applied AI",
  "Ops",
] as const;

export type Discipline = (typeof DISCIPLINES)[number];

export type Role = {
  /** URL segment for /careers/[slug]. Must be unique. */
  slug: string;
  discipline: Discipline;
  title: string;
  /** Location and contract shape, e.g. "Remote · Full-time". */
  meta: string;
  posted: string;
  comp: string;
  featured?: boolean;
  /* ── Job description ────────────────────────────────────────────────────
   * Authored copy, not imported from the design project — that had no JD
   * content. Edit freely; the detail page renders whatever is here.
   */
  summary: string;
  /**
   * Full job description as HTML, authored in the CMS rich-text editor. When
   * present it is the whole body of the role page; the two lists below are the
   * fallback for roles created before this field existed.
   */
  description?: string | null;
  responsibilities?: string[];
  requirements?: string[];
  /**
   * "What we offer", authored per role in the CMS. Empty or absent hides the
   * section rather than printing an empty heading.
   */
  perks?: Perk[];
};

/** Look up a role by its URL segment. */
export const roleBySlug = (slug: string) =>
  ROLES.find((role) => role.slug === slug);

export type Perk = {
  title: string;
  desc: string;
};

export type CandidateFaq = {
  question: string;
  answer: string;
};

/** "All Roles" is the default chip; the rest mirror DISCIPLINES. */
export const ROLE_FILTERS = ["All Roles", ...DISCIPLINES] as const;

export type RoleFilter = (typeof ROLE_FILTERS)[number];

/** Roles revealed per page on the board, and per "load more" press. */
export const ROLES_PER_PAGE = 6;

export const ROLES: Role[] = [
  {
    slug: "applied-research-scientist-memory-systems",
    discipline: "Research",
    title: "Applied Research Scientist, Memory Systems",
    meta: "Remote · Contract",
    posted: "2 days ago",
    comp: "$140–190k /yr",
    featured: true,
    summary:
      "Own the research thesis behind the memory core: the layer that holds short-term context and long-term memory as one continuous system rather than two disconnected ones. You will decide what the lab believes about retention, retrieval, and forgetting, and prove it on real partner data.",
    responsibilities: [
      "Design and run experiments on retention, retrieval, and decay across partner deployments",
      "Turn findings into architecture the engineering team can ship, not just papers",
      "Define the benchmarks we publish, including the ones that make us look bad",
      "Sit directly with design partners to see where memory actually breaks",
    ],
    requirements: [
      "Research depth in retrieval, representation learning, or long-context systems",
      "A track record of work that shipped, not only work that published",
      "Comfort being wrong in public and correcting quickly",
      "Willingness to work against a written constitution you can also amend",
    ],
  },
  {
    slug: "senior-systems-engineer-reasoning-engines",
    discipline: "Engineering",
    title: "Senior Systems Engineer, Reasoning Engines",
    meta: "Remote · Full-time",
    posted: "3 days ago",
    comp: "$130–175k /yr",
    featured: true,
    summary:
      "Build the reasoning layer that updates with context instead of freezing at training time, and keep the cost-performance tradeoff honest while the problem shifts underneath it.",
    responsibilities: [
      "Own the reasoning-engine architecture end to end, from interface to inference budget",
      "Instrument every decision path so it stays logged, replayable, and auditable",
      "Hold the line on frugal compute: measured, not asserted",
      "Take pilots from first working version to production inside a partner perimeter",
    ],
    requirements: [
      "Deep systems engineering: distributed services, latency budgets, real observability",
      "Experience running inference workloads under real cost constraints",
      "A bias toward removing complexity rather than adding abstraction",
      "Comfort owning a system without a layer of process between you and it",
    ],
  },
  {
    slug: "agent-mesh-engineer",
    discipline: "Applied AI",
    title: "Agent Mesh Engineer",
    meta: "Hybrid · NYC · Contract",
    posted: "4 days ago",
    comp: "$120–160k /yr",
    summary:
      "Build the reusable agent mesh that gets deployed once and shared across business units, with scoped permissions, replayable audit trails, and a second use case that ships in a fraction of the time the first did.",
    responsibilities: [
      "Design agent topologies that survive contact with real enterprise systems",
      "Implement scoped permissions and replayable audit trails as first-class features",
      "Make the second and third deployment dramatically cheaper than the first",
      "Work directly with partner engineering teams during rollout",
    ],
    requirements: [
      "Production experience with multi-agent or tool-using systems",
      "Strong integration instincts: queues, webhooks, legacy APIs, awkward data",
      "Care for failure modes, retries, and what happens when an agent is wrong",
      "Able to work hybrid from NYC",
    ],
  },
  {
    slug: "deployment-client-ops-lead",
    discipline: "Ops",
    title: "Deployment & Client Ops Lead",
    meta: "Remote · Full-time",
    posted: "5 days ago",
    comp: "$95–130k /yr",
    summary:
      "Run every pilot from scope to production, hands-on. You are the person who makes a four-to-six week pilot actually land, and who tells us early when it will not.",
    responsibilities: [
      "Own pilot delivery end to end: scope, timeline, and the outcome it is measured against",
      "Keep partners informed with real status, not managed status",
      "Turn every deployment into a repeatable playbook for the next one",
      "Escalate problems while they are still small",
    ],
    requirements: [
      "Delivery experience on technical projects with enterprise clients",
      "Comfort saying no to scope that would not survive the timeline",
      "Enough technical depth to argue with engineers productively",
      "A preference for outcomes over activity reporting",
    ],
  },
  {
    slug: "collective-intelligence-researcher",
    discipline: "Research",
    title: "Collective Intelligence Researcher",
    meta: "Remote · 6-mo residency",
    posted: "1 week ago",
    comp: "$110–150k /yr",
    summary:
      "A six-month residency on the open question behind the whole lab: how knowledge compounds across organizations instead of dying inside one of them.",
    responsibilities: [
      "Investigate how curated cross-organization knowledge outperforms aggregation",
      "Publish openly: frameworks, benchmarks, and negative results alike",
      "Prototype with public-research and citizen-science partners",
      "Leave behind something the lab keeps using after the residency ends",
    ],
    requirements: [
      "Background in collective intelligence, network science, or a neighbouring field",
      "A public body of work we can read",
      "Genuine interest in open frameworks over proprietary moats",
      "Available for a six-month full-time residency",
    ],
  },
  {
    slug: "frugal-compute-engineer",
    discipline: "Engineering",
    title: "Frugal Compute Engineer",
    meta: "Remote · Full-time",
    posted: "1 week ago",
    comp: "$125–165k /yr",
    summary:
      "Make intelligence affordable. This role exists because the lab measures itself on how well a system adapts, not how much compute it burns, and someone has to hold that number.",
    responsibilities: [
      "Profile and cut compute overhead across the memory core and reasoning engines",
      "Publish the frugal-compute benchmark, including where we fall short",
      "Keep systems small enough to run on modest hardware inside a partner perimeter",
      "Push back on architecture that buys capability at an unjustifiable cost",
    ],
    requirements: [
      "Performance engineering depth: profiling, quantization, kernel-level curiosity",
      "Experience trading model quality against cost with real numbers",
      "Scepticism toward benchmarks, including your own",
      "Willingness to publish results that are inconvenient",
    ],
  },
  {
    slug: "evaluation-drift-analyst",
    discipline: "Applied AI",
    title: "Evaluation & Drift Analyst",
    meta: "Remote · Full-time",
    posted: "1 week ago",
    comp: "$100–135k /yr",
    summary:
      "Own the question of whether a deployed system is still right. You build the evaluation harnesses and drift detection that turn “it worked at launch” into something we can keep proving.",
    responsibilities: [
      "Build evaluation harnesses for systems already running in production",
      "Detect and characterise drift before a partner notices it",
      "Close the loop: feed outcomes back so the next recommendation is better",
      "Make evaluation legible to partners' own risk teams",
    ],
    requirements: [
      "Experience evaluating ML or LLM systems beyond offline benchmarks",
      "Strong applied statistics and a healthy distrust of a single metric",
      "Ability to explain a subtle failure to a non-technical stakeholder",
      "Interest in the boring, decisive part of the work",
    ],
  },
  {
    slug: "candidate-desk-coordinator",
    discipline: "Ops",
    title: "Candidate Desk Coordinator",
    meta: "Remote · Full-time",
    posted: "2 weeks ago",
    comp: "$70–90k /yr",
    summary:
      "Run the candidate desk. We promise every applicant a reply within one business day at every stage. You are the reason that promise holds.",
    responsibilities: [
      "Reply to every candidate within one business day, at every stage",
      "Match pipeline registrations to roles as they open, across disciplines",
      "Coordinate trial projects: short, paid, from the real backlog",
      "Keep the hiring process as transparent as the constitution claims it is",
    ],
    requirements: [
      "Recruiting coordination or people-ops experience",
      "Genuinely good written communication, because candidates read every word",
      "Organised enough that nobody falls through a gap",
      "Care about candidate experience even when the answer is no",
    ],
  },
];

export const PERKS: Perk[] = [
  {
    title: "Fair, transparent equity",
    desc: "Every hire gets equity banded by level and published internally. No negotiation games.",
  },
  {
    title: "Remote-first, always",
    desc: "Work from anywhere; we hire the person, not the timezone.",
  },
  {
    title: "Direct access to research",
    desc: "No layers between you and the problem. Talk to the founders, week one.",
  },
  {
    title: "A real learning budget",
    desc: "Conference, course, or compute: your call, funded every quarter.",
  },
  {
    title: "Measured on outcomes",
    desc: "No hours logged, no busywork theater, just what shipped.",
  },
  {
    title: "Long-term, not headcount",
    desc: "We hire for years, not sprints: pipeline and continuity, not churn.",
  },
];

export const CANDIDATE_FAQS: CandidateFaq[] = [
  {
    question: "Do I need to apply for every role separately?",
    answer:
      "No. Register once with your background and we'll match you to every relevant role as it opens, across every discipline.",
  },
  {
    question: "Is this fully remote?",
    answer:
      "Most roles are remote-first; a few hybrid or on-site roles are marked directly in the listing.",
  },
  {
    question: "How is equity decided?",
    answer:
      "Banded by level and published internally: the same offer for everyone at that level, no back-room negotiating.",
  },
  {
    question: "What does the trial project look like?",
    answer:
      "A short, paid, real problem from our actual backlog, typically one to two weeks, on your own schedule.",
  },
  {
    question: "How quickly will I hear back?",
    answer:
      "Our candidate desk replies within one business day, at every stage of the process.",
  },
];

export const CAREERS = {
  hero: {
    title: "The work behind adaptive",
    /** Rendered in brand red, immediately after `title`. */
    titleAccent: "intelligence",
    lede: "Research, engineering, and applied roles building systems that adapt: remote-first, open by design, measured on outcomes, never on hours logged.",
    cta: { label: "Browse open roles", href: "#roles" },
  },
  roles: {
    eyebrow: "Open Roles",
    heading: "Find your next problem to work on",
    aside:
      "Live openings across every discipline. Apply once and the desk matches you to what fits.",
  },
  perks: {
    eyebrow: "Why Build Here",
    heading: "More than a job. A lab you help write",
    aside:
      "The friction most labs tolerate, we removed on purpose, so the work is what's left.",
  },
  faq: {
    eyebrow: "Before You Apply",
    heading: "Questions candidates actually ask",
    aside: "Anything else? The candidate desk replies within one business day.",
  },
  pipeline: {
    eyebrow: "Join The Pipeline",
    heading: "Not seeing the right problem yet",
    bullets: [
      "One profile, matched to every relevant opening as it posts.",
      "First-access alerts before roles go public.",
      "A dedicated contact who already knows your background.",
    ],
    /** Options for the "Discipline" select on the pipeline form. */
    disciplines: [...DISCIPLINES, "Something else"],
  },
} as const;
