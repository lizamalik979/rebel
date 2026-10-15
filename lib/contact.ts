/**
 * Content for the contact / collaborate page. Same convention as
 * lib/careers.ts — components render whatever they are handed.
 *
 * Imported from the Claude Design project "Contact.dc.html".
 */

export type Stat = {
  value: string;
  label: string;
};

export type Step = {
  ident: string;
  title: string;
  body: string;
};

export type ContactFaq = {
  question: string;
  answer: string;
};

/** Chips on the form: what the sender is reaching out about. */
export const TOPICS = [
  "Start a project",
  "Research partnership",
  "Press",
  "Something else",
] as const;

export type Topic = (typeof TOPICS)[number];

export const TIMELINES = [
  "Exploring, no date yet",
  "Next quarter",
  "Within 30 days",
  "Urgent",
] as const;

export const STEPS: Step[] = [
  {
    ident: "Step 01 · <48h",
    title: "We read and reply",
    body: "A researcher (not a rep) reads your note and answers with a real opinion.",
  },
  {
    ident: "Step 02 · Week 1",
    title: "One working call",
    body: "Sixty minutes on the actual problem, with the people who'd build it.",
  },
  {
    ident: "Step 03 · Week 2",
    title: "Scoped proposal",
    body: "Outcome, timeline, and price on one page, measured against your metric.",
  },
  {
    ident: "Step 04 · Week 4–6",
    title: "Working pilot",
    body: "A real system in your environment, not a slide deck about one.",
  },
];

export const CONTACT_FAQS: ContactFaq[] = [
  {
    question: "Do we need an AI strategy before contacting you?",
    answer:
      "No. Most partners come with a business problem, not a technology plan. The strategy work is part of what we do together in the first two weeks.",
  },
  {
    question: "How small can a first engagement be?",
    answer:
      "One decision, one workflow. We deliberately keep first pilots small and frugal so the value is visible before anyone commits to scale.",
  },
  {
    question: "Will our data leave our environment?",
    answer:
      "No. Memory cores deploy inside your perimeter, and every agent action is scoped, logged, and replayable by your own team.",
  },
  {
    question: "Do you work with universities and non-profits?",
    answer:
      "Yes. Open research, citizen science, and public-interest work is part of the constitution. Rates and structure differ from commercial engagements.",
  },
  {
    question: "What if you are not the right lab for it?",
    answer:
      "We'll say so in the first reply and, where we can, point you to a team that fits better. A fast no is more useful than a slow maybe.",
  },
];

export const CONTACT = {
  hero: {
    badge: "Lab open · taking new problems",
    title: "Bring us a problem worth",
    /** Rendered in brand red, immediately after `title`. */
    titleAccent: "working on",
    lede: "The most important conversations shouldn't require a login. Tell us what you're trying to decide, build, or fix, and a human replies within 48 hours.",
    stats: [
      { value: "< 48h", label: "First reply" },
      { value: "No", label: "Login required" },
      { value: "Human", label: "Reads every note" },
    ] satisfies Stat[],
  },
  form: {
    eyebrow: "New collaboration",
    note: "Reply < 48h",
  },
  rail: {
    /**
     * Proof points beside the form.
     *
     * Every figure here must already be stated on /about or the solution page —
     * a one-year-old lab that claims volume or uptime on its contact page and
     * honesty on its about page contradicts itself in front of the prospect.
     * Track-record numbers ("systems shipped") and SLA-grade numbers ("audited
     * uptime") do not belong here until they are true and measured.
     */
    eyebrow: "What you get from us",
    stats: [
      { value: "6", label: "Design partners" },
      { value: "4–6 wks", label: "To a working pilot" },
      { value: "100%", label: "Decisions auditable" },
    ] satisfies Stat[],
    location: {
      caption: "Remote-first · No head office",
      title: "Where the lab works",
      body: "Remote-first out of India, working across timezones. We meet where your problem is.",
      rows: [
        { label: "Desk hours", value: "Mon–Fri · 09:00–18:00 IST" },
        { label: "First reply", value: "Within 48 hours", accent: true },
      ],
    },
  },
  steps: {
    eyebrow: "What happens next",
    heading: "From note to pilot in four steps",
    aside:
      "No procurement theater. Most collaborations reach a working pilot inside six weeks.",
  },
  faq: {
    eyebrow: "Before you reach out",
    heading: "Quick answers",
    aside:
      "Something not covered? Put it in the form. Odd questions are our favourite kind.",
  },
} as const;
