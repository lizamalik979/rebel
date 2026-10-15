/**
 * Solution (pillar) pages, fetched from the CMS.
 *
 * The CMS stores each page's copy under the same section names the components
 * already render, so nothing here reshapes anything — see solution-content.ts
 * in the CMS for the authoritative shape.
 *
 * The page's dark/light rhythm is not part of this data: each section component
 * owns its own tone, so any page built from this template alternates correctly.
 */
import { DECISION_INTELLIGENCE, type Solution } from "@/lib/solutions";

const CMS_URL = (process.env.CMS_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Matches lib/careers-api.ts — publishes purge by tag, so this is a backstop. */
const REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 8000;

/** The CMS document for one solution page. */
type SolutionContent = {
  /** Which layout renders the page; falls back to the standard pillar. */
  layout?: string;
  hero: {
    pillar: string;
    title: string;
    tagline: string;
    image: string;
    alt: string;
    badge: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    stats: { value: string; label: string }[];
  };
  offerings: {
    eyebrow: string;
    heading: string;
    aside: string;
    items: Solution["offerings"];
  };
  comparison: {
    eyebrow: string;
    heading: string;
    aside: string;
    columns: { feature: string; traditional: string; rebel: string };
    rows: Solution["comparison"];
  };
  faq: {
    eyebrow: string;
    heading: string;
    aside: string;
    cta: { label: string; href: string };
    items: Solution["faqs"];
  };
  contact: {
    badge: string;
    title: string;
    titleAccent: string;
    lede: string;
    note: string;
    email: string;
  };
};

/** A solution page plus the section copy around it. */
export type SolutionPage = { solution: Solution; content: SolutionContent };

async function getJson<T>(path: string, tag: string): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_URL}${path}`, {
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS, tags: [tag] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (error) {
    // An unreachable CMS must not hang the render into a platform timeout.
    console.error(
      `[solutions] CMS request failed for ${path} at ${CMS_URL}:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/**
 * A stored document is only usable if it carries every section the page
 * renders — the CMS and the site deploy independently, so a payload from the
 * previous shape would otherwise crash on a missing array.
 */
function isSolutionContent(value: unknown): value is SolutionContent {
  const c = value as SolutionContent | undefined;
  return Boolean(
    c &&
      typeof c.hero?.title === "string" &&
      Array.isArray(c.hero?.stats) &&
      Array.isArray(c.offerings?.items) &&
      Array.isArray(c.comparison?.rows) &&
      Array.isArray(c.faq?.items) &&
      typeof c.contact?.lede === "string"
  );
}

/**
 * Flatten a CMS document into the `Solution` the components already take.
 *
 * `interests` is derived from the offering titles rather than authored, so the
 * enquiry form's dropdown cannot drift from what the page actually offers.
 */
function toSolution(slug: string, c: SolutionContent): Solution {
  return {
    slug,
    pillar: c.hero.pillar,
    title: c.hero.title,
    tagline: c.hero.tagline,
    hero: { image: c.hero.image, alt: c.hero.alt, badge: c.hero.badge },
    stats: c.hero.stats,
    offerings: c.offerings.items,
    comparison: c.comparison.rows,
    faqs: c.faq.items,
    interests: [...c.offerings.items.map((o) => o.title), "Something else"],
  };
}

/**
 * Every published solution slug, for generateStaticParams and the sitemap.
 *
 * The CMS keys these responses `services` / `servicePages` rather than a
 * uniform `data` — matched here rather than "fixed" in the CMS, because other
 * consumers already depend on those names.
 */
export async function getSolutionSlugs(): Promise<string[]> {
  const data = await getJson<{ success: boolean; services?: { slug: string; template?: string }[] }>(
    "/api/services/client/sitemap",
    "service-list"
  );
  // Unfiltered: both templates are served by /solutions/[slug], so every
  // published service page belongs in this list.
  return (data?.services ?? []).map((s) => s.slug).filter(Boolean);
}

/** One published solution page, or null when it is missing or unpublished. */
export async function getSolutionPage(slug: string): Promise<SolutionPage | null> {
  const data = await getJson<{ servicePages?: { content?: unknown } }>(
    `/api/services/client/${encodeURIComponent(slug)}`,
    `service-${slug}`
  );

  const content = data?.servicePages?.content;
  if (isSolutionContent(content)) {
    return { solution: toSolution(slug, content), content };
  }

  if (content) {
    console.error(`[solutions] "${slug}" has an unrecognised content shape; ignoring`);
  }
  return null;
}
