/** Content for the Energy Talents site. */

export const ET = {
  name: "Energy Talents",
  legalName: "Energy Talents Ltd",
  crewEmail: "crew@energytalents.com",
  dutyEmail: "duty@energytalents.com",
  emergencyPhone: "+971 4 000 0000",
  emergencyTel: "+97140000000",
  hqLines: ["Energy Plaza, Level 14 · Dubai, UAE"],
  blurb:
    "Supplying, deploying, and managing skilled technical manpower for global infrastructure, oil & gas, marine, and renewable energy projects.",
} as const;

export const ET_NAV = [
  { label: "Sectors", href: "/#sectors" },
  { label: "Solutions", href: "/#solutions" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/* ── Enquiry routing ─────────────────────────────────────────────────────
 * Choosing a project region names the desk that will pick the enquiry up.
 */

export type Hub = {
  region: string;
  /** Short code shown in the routing card's avatar. */
  code: string;
  desk: string;
  coordinators: string;
  /** City used in the confirmation message. */
  city: string;
};

export const HUBS: Hub[] = [
  {
    region: "Middle East & Africa",
    code: "DXB",
    desk: "Dubai desk",
    coordinators: "Middle East & Africa coordinators · GMT+4",
    city: "Dubai",
  },
  {
    region: "Europe & North Sea",
    code: "ABZ",
    desk: "Aberdeen desk",
    coordinators: "Europe & North Sea coordinators · GMT",
    city: "Aberdeen",
  },
  {
    region: "Asia-Pacific",
    code: "SIN",
    desk: "Singapore desk",
    coordinators: "Asia-Pacific coordinators · GMT+8",
    city: "Singapore",
  },
  {
    region: "The Americas",
    code: "HOU",
    desk: "Houston desk",
    coordinators: "Americas coordinators · GMT-6",
    city: "Houston",
  },
  {
    region: "Multiple / global",
    code: "GL",
    desk: "Global accounts team",
    coordinators: "Coordinated from Dubai across all four hubs",
    city: "Dubai",
  },
];

export const ET_ASSURANCES = [
  {
    title: "Answered in 4 working hours",
    body: "Crew requests get an indicative plan and rate band inside one business day.",
    icon: "clock" as const,
  },
  {
    title: "No fee to workers, confidential by default",
    body: "Contractors never pay for placement or visas. Details held under GDPR-aligned controls.",
    icon: "shield" as const,
  },
];

export const ET_FAQS = [
  {
    question: "How fast can you mobilize a crew?",
    answer:
      "For disciplines we hold pre-cleared standby pools, under 72 hours from instruction to on-site, with medicals, certifications and travel included. Scarce or highly specialised roles typically run two to four weeks. Tell us the window in the form and we'll confirm what's realistic in the first reply.",
  },
  {
    question: "Do contractors pay any fees?",
    answer:
      "Never. No placement fee, no visa charge, no deduction dressed up as an administrative cost. All recruitment and mobilization costs sit with us or the client, in line with the employer-pays principle.",
  },
  {
    question: "Which regions and contract types do you cover?",
    answer:
      "Four hubs covering 40+ countries, on rotational, staff, project and day-rate contracts. We can act as employer of record where you have no local entity, carrying payroll, tax and statutory risk under a single global agreement.",
  },
  {
    question: "What do you need from me to start?",
    answer:
      "For crew requests: region, discipline, headcount and target window is enough for an indicative crew plan and rate band. Scope of work and site HSE requirements help us be precise. For candidates: your discipline, current certifications and the rotation you're seeking.",
  },
  {
    question: "How are certifications verified?",
    answer:
      "Every certificate is checked at source with the issuing body, not taken from a scan, and tracked for expiry inside Talent Cloud. Anything approaching expiry triggers an automatic hold. We would rather stop a mobilization than send an uncertified worker to site.",
  },
  {
    question: "Is my project information confidential?",
    answer:
      "Yes. Enquiries are held under GDPR-aligned controls across all four hubs and shared only with the coordinators working your requirement. We're happy to work under your NDA before any detail is exchanged. Just say so in the message field.",
  },
];

export const ET_FOOTER_GROUPS = [
  {
    label: "Sectors",
    links: [
      { label: "Oil & Gas", href: "/#sectors" },
      { label: "Offshore & Marine", href: "/#sectors" },
      { label: "Renewables", href: "/#sectors" },
      { label: "Construction", href: "/#sectors" },
    ],
  },
  {
    label: "Capabilities",
    links: [
      { label: "Recruitment", href: "/#solutions" },
      { label: "Mobilization", href: "/#solutions" },
      { label: "Global Payroll", href: "/#solutions" },
      { label: "Verification", href: "/#solutions" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Leadership", href: "/about#team" },
      { label: "Resources", href: "/#stories" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Compliance",
    links: [
      { label: "ISO Certifications", href: "/about#values" },
      { label: "MLC 2006 Policy", href: "/about#values" },
      { label: "Modern Slavery Statement", href: "/about#values" },
      { label: "Data Protection", href: "/about#values" },
    ],
  },
];
