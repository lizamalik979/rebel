/**
 * The About page, fetched from the CMS.
 *
 * Same shape as the CMS's about-content.ts, so nothing here reshapes anything.
 * The shipped copy in lib/about.ts stays as the fallback and is load-bearing:
 * an unreachable CMS, or one still serving an older document, must leave the
 * page rendering rather than blank it.
 *
 * The page's dark/light rhythm is not part of this data — each component owns
 * its tone, so the rhythm holds however much copy a section carries.
 */
import {
  ABOUT,
  ABOUT_FAQS,
  BADGES,
  IMPACT_STATS,
  PARTNER_OFFERS,
  STORY_CARDS,
  TEAM,
  VALUES,
  type AboutFaq,
  type Badge,
  type PartnerOffer,
  type StoryCard,
  type TeamMember,
  type Value,
} from "@/lib/about";

const CMS_URL = (process.env.CMS_API_URL ?? "http://localhost:3000").replace(/\/$/, "");
const REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 8000;

/**
 * A call to action. `href` is optional because two of these open the
 * collaborate modal rather than navigating — only the careers panel links out.
 */
type Cta = { label: string; href?: string };

export type AboutContent = {
  hero: { badge: string; title: string; lede: string; primaryCta: Cta; secondaryCta: Cta };
  story: { eyebrow: string; heading: string; lede: string; cards: StoryCard[] };
  values: { eyebrow: string; heading: string; items: Value[] };
  stats: { value: string; label: string }[];
  team: { eyebrow: string; heading: string; members: TeamMember[] };
  standards: { eyebrow: string; heading: string; body: string; items: Badge[] };
  partners: {
    eyebrow: string;
    heading: string;
    aside: string;
    offers: PartnerOffer[];
    cohort: { eyebrow: string; body: string; cta: Cta };
  };
  faq: { eyebrow: string; heading: string; items: AboutFaq[] };
  dualCta: {
    partners: { eyebrow: string; heading: string; body: string; cta: Cta };
    careers: { eyebrow: string; heading: string; body: string; cta: Cta };
  };
};

/** The copy the site ships with, assembled from lib/about.ts. */
const FALLBACK: AboutContent = {
  hero: {
    badge: ABOUT.hero.badge,
    title: ABOUT.hero.title,
    lede: ABOUT.hero.lede,
    primaryCta: ABOUT.hero.primaryCta,
    secondaryCta: ABOUT.hero.secondaryCta,
  },
  story: { ...ABOUT.story, cards: [...STORY_CARDS] },
  values: { ...ABOUT.values, items: [...VALUES] },
  stats: [...IMPACT_STATS],
  team: { ...ABOUT.team, members: [...TEAM] },
  standards: { ...ABOUT.standards, items: [...BADGES] },
  partners: { ...ABOUT.partners, offers: [...PARTNER_OFFERS] },
  faq: { ...ABOUT.faq, items: [...ABOUT_FAQS] },
  dualCta: ABOUT.dualCta,
};

/**
 * A stored document is only usable if it carries every section the page
 * renders. The CMS and the site deploy independently, so a payload from the
 * previous shape would otherwise crash on a missing array.
 */
function isAboutContent(value: unknown): value is AboutContent {
  const c = value as AboutContent | undefined;
  return Boolean(
    c &&
      typeof c.hero?.title === "string" &&
      Array.isArray(c.story?.cards) &&
      Array.isArray(c.values?.items) &&
      Array.isArray(c.stats) &&
      Array.isArray(c.team?.members) &&
      Array.isArray(c.standards?.items) &&
      Array.isArray(c.partners?.offers) &&
      Array.isArray(c.faq?.items) &&
      typeof c.dualCta?.partners?.heading === "string"
  );
}

/** The page's SEO fields, authored alongside the content. */
export type AboutMeta = { metaTitle: string | null; metaDescription: string | null };

/**
 * Content plus the SEO fields.
 *
 * Kept together because they come from the same request — fetching them
 * separately would double the round trips for one document.
 */
export async function getAboutPage(): Promise<{ content: AboutContent; meta: AboutMeta }> {
  const empty: AboutMeta = { metaTitle: null, metaDescription: null };
  try {
    const res = await fetch(`${CMS_URL}/api/about`, {
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS, tags: ["about-page"] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return { content: FALLBACK, meta: empty };

    const data = (await res.json()) as {
      aboutPage?: { content?: unknown; metaTitle?: string | null; metaDescription?: string | null } | null;
    };
    const page = data?.aboutPage;
    const content = isAboutContent(page?.content) ? page.content : FALLBACK;

    return {
      content,
      meta: {
        metaTitle: page?.metaTitle ?? null,
        metaDescription: page?.metaDescription ?? null,
      },
    };
  } catch (error) {
    console.error(
      `[about] CMS request failed at ${CMS_URL}:`,
      error instanceof Error ? error.message : error
    );
    return { content: FALLBACK, meta: empty };
  }
}

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const res = await fetch(`${CMS_URL}/api/about`, {
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS, tags: ["about-page"] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return FALLBACK;

    const data = (await res.json()) as { aboutPage?: { content?: unknown } | null };
    const content = data?.aboutPage?.content;
    if (isAboutContent(content)) return content;

    if (content) {
      console.error("[about] CMS returned an unrecognised shape; using shipped copy");
    }
    return FALLBACK;
  } catch (error) {
    console.error(
      `[about] CMS request failed at ${CMS_URL}:`,
      error instanceof Error ? error.message : error
    );
    return FALLBACK;
  }
}
