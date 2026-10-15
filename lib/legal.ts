/**
 * Privacy policy and terms content.
 *
 * ⚠ NOT LEGAL ADVICE. This is an accurate description of what the site
 * technically does, written to a standard structure — it still needs review by
 * a lawyer before launch, and the «PLACEHOLDER» values below must be replaced
 * with the real registered entity details. They are deliberately loud so they
 * cannot ship unnoticed.
 *
 * The technical claims here were verified against the built site:
 *   · no cookies are set on any route
 *   · no third-party requests (fonts are self-hosted by next/font)
 *   · no analytics, tag manager, or tracking pixel
 *   · every form composes a mailto: — nothing is posted to or stored by a server
 * If any of that changes, this file must change with it.
 */

import { SITE } from "@/lib/content";

/** Replace with the registered company details before launch. */
export const LEGAL_ENTITY = {
  name: "«REGISTERED ENTITY NAME»",
  address: "«REGISTERED ADDRESS»",
  jurisdiction: "«GOVERNING JURISDICTION, e.g. Maharashtra, India»",
} as const;

/**
 * Revision date. Set by hand, deliberately — a policy's date has to reflect
 * when the terms actually changed, not when the site was last rebuilt.
 */
export const LEGAL_UPDATED = "6 August 2026";

export type LegalSection = {
  heading: string;
  /** Rendered as paragraphs. */
  body?: string[];
  /** Rendered as a bulleted list under the body. */
  bullets?: string[];
};

export const PRIVACY: { intro: string; sections: LegalSection[] } = {
  intro:
    "This policy explains what happens to information you send us through this website. It is deliberately short, because the site itself collects very little.",
  sections: [
    {
      heading: "Who we are",
      body: [
        `${SITE.name} ("we", "the lab") operates this website. For the purposes of the UK/EU General Data Protection Regulation and India's Digital Personal Data Protection Act 2023, the data controller is ${LEGAL_ENTITY.name}, ${LEGAL_ENTITY.address}.`,
        `Questions about this policy, or any request about your data, go to ${SITE.email}.`,
      ],
    },
    {
      heading: "What this website collects automatically",
      body: [
        "Nothing. This site sets no cookies, runs no analytics, and embeds no tracking pixels or tag managers. Fonts are served from our own domain rather than a third-party font service, so no request about your visit is made to any outside company.",
        "Our hosting provider may keep standard server logs (including IP address) for security and reliability, as any web host does. We do not use those logs to build a profile of you.",
      ],
    },
    {
      heading: "What you choose to send us",
      body: [
        "The forms on this site do not post to a server. When you press send, your own email program opens with the details filled in, and nothing is transmitted until you send that email yourself. If you close it instead, we never receive anything.",
        "Depending on which form you use, that email may contain:",
      ],
      bullets: [
        "Your name and email address",
        "Your organisation, if you give one",
        "What you are working on, or why you are applying (whatever you type)",
        "For applications: the role you applied for, and the filename of a CV you selected",
      ],
    },
    {
      heading: "A note about CV uploads",
      body: [
        "The application form cannot attach your file. It records only the filename so you remember to attach it yourself before sending. Your CV therefore reaches us as an ordinary email attachment, sent by you, and is never uploaded to this website.",
      ],
    },
    {
      heading: "Why we use it, and on what basis",
      body: [
        "We use what you send only to reply to you and to take the conversation forward, whether a collaboration enquiry or an application for a role. We do not sell it, and we do not add you to a mailing list.",
        "Our lawful basis is your consent, given by choosing to send the email, and our legitimate interest in responding to enquiries about our work. For job applications it is the steps necessary to enter into a contract of employment at your request.",
      ],
    },
    {
      heading: "Who else sees it",
      body: [
        "Your email arrives in our email provider's inbox and is read by the people at the lab who need to act on it. We do not pass it to advertisers or data brokers.",
        "Our email and hosting providers process it as part of delivering those services. «CONFIRM PROVIDERS AND ADD THEM HERE, e.g. Vercel for hosting, Google Workspace for email.»",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        "Enquiries are kept for as long as the conversation is live and for a reasonable period afterwards. Applications are kept for «RETENTION PERIOD, e.g. 12 months» so we can match you to future openings, unless you ask us to delete them sooner.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "You can ask us for a copy of what we hold about you, ask us to correct it, ask us to delete it, or object to us holding it at all. Write to us and we will act on it. There is no form to fill in and no account to create.",
        `If you are in the UK or EU you also have the right to complain to your data protection authority. If you are in India you may raise a grievance with us first, and then with the Data Protection Board.`,
      ],
    },
    {
      heading: "Changes",
      body: [
        `We will update this page if what we do changes. The date at the top tells you when it last did.`,
      ],
    },
  ],
};

export const TERMS: { intro: string; sections: LegalSection[] } = {
  intro:
    "These terms cover your use of this website. They do not govern any engagement between us; that is set out separately in a signed agreement.",
  sections: [
    {
      heading: "Using this site",
      body: [
        `This website is published by ${LEGAL_ENTITY.name}. You may read it, share links to it, and contact us through it. You may not use it to break the law, to attempt to gain unauthorised access, or to scrape it at a volume that degrades it for others.`,
      ],
    },
    {
      heading: "Our content",
      body: [
        `The text, design, code, and visual work on this site belong to us unless stated otherwise. "${SITE.name}" and our marks are ours. You may quote us with attribution; you may not republish substantial parts as your own.`,
        "Where we publish open frameworks or research, the licence attached to that material governs it and takes precedence over this section.",
      ],
    },
    {
      heading: "What this site is not",
      body: [
        "Everything here is general information about our work. It is not professional, legal, financial, or technical advice, and you should not act on it without talking to us or to your own advisors about your specific situation.",
        "We describe capabilities, timelines, and outcomes as they have generally applied. They are not a promise or a guarantee of any particular result for you.",
      ],
    },
    {
      heading: "Roles and openings",
      body: [
        "Listings on our careers pages describe roles as they stand at the time of writing. Details including scope, location, and compensation may change, and a listing may be withdrawn. Nothing on those pages is an offer of employment, and no offer exists until it is made in writing and signed.",
      ],
    },
    {
      heading: "Links to other sites",
      body: [
        "Where we link somewhere else, we do not control that site and are not responsible for it. Following an external link is your own decision.",
      ],
    },
    {
      heading: "Availability and liability",
      body: [
        "We make no promise that this site will be available without interruption or free of error. To the fullest extent the law allows, we are not liable for loss arising from your use of it, and nothing here limits liability that cannot lawfully be limited, including for death or personal injury caused by negligence, or for fraud.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "We may update these terms. The version on this page at the time you use the site is the one that applies, and the date at the top tells you when it last changed.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        `These terms are governed by the laws of ${LEGAL_ENTITY.jurisdiction}, and its courts have exclusive jurisdiction over any dispute arising from them.`,
      ],
    },
    {
      heading: "Contact",
      body: [`Anything unclear, write to ${SITE.email}.`],
    },
  ],
};
