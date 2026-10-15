/**
 * Roles, fetched from the CMS.
 *
 * The CMS's public careers endpoints return the `Role` shape this site already
 * renders — `discipline`, `meta`, `comp`, `posted` and the two bullet lists are
 * composed server-side there, so nothing here reshapes anything and no
 * component had to change.
 *
 * Static copy (perks, FAQs, hero) still lives in lib/careers.ts; only the open
 * roles are dynamic.
 */
import type { CandidateFaq, Perk, Role } from "@/lib/careers";
import { CANDIDATE_FAQS, CAREERS, PERKS } from "@/lib/careers";
import { CONTACT, CONTACT_FAQS, STEPS } from "@/lib/contact";
import { SITE } from "@/lib/content";

/**
 * Where the CMS lives. Falls back to the local dev CMS so `npm run dev` works
 * in a fresh checkout without an env file.
 */
const CMS_URL = (process.env.CMS_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * How long a cached CMS response is served before Next refetches.
 *
 * Deliberately long. Publishing in the CMS calls /api/revalidate, which expires
 * the matching tags immediately, so this window is the backstop for a missed
 * webhook — not the freshness mechanism. Keeping it short would mean visitors
 * repeatedly waking a remote database for content that changes a few times a
 * month.
 */
const REVALIDATE_SECONDS = 3600;

/*
 * Cache tags MUST match careerTags() in the CMS ("career-list",
 * "career-<slug>") and the "careers-page" tag it sends for page copy.
 * They are the contract the /api/revalidate webhook invalidates against — a
 * mismatch fails silently and looks like "publishing does nothing".
 */

/**
 * Hard ceiling on a single CMS request.
 *
 * Without this a CMS that accepts the connection but never answers hangs the
 * whole page render until the platform kills it — which is exactly how
 * /careers started returning a 504 "Task timed out after 300 seconds" in
 * production. Failing in seconds and rendering the empty state is always
 * better than not rendering at all.
 */
const REQUEST_TIMEOUT_MS = 8000;

type RolesResponse = {
  success: boolean;
  roles: Role[];
  filters: { categories: string[] };
  total: number;
  pagination?: { totalCount: number };
};

type RoleResponse = {
  success: boolean;
  role: Role;
};

/**
 * Roles are fetched at request/build time, and a CMS outage must not take the
 * careers page down with it — callers get an empty list and the page renders
 * its "no roles" state instead of a 500.
 */
async function getJson<T>(path: string, tag: string): Promise<T | null> {
  try {
    // `cache: "force-cache"` is required: this project does not enable
    // cacheComponents, and under that model Next 16 does NOT cache fetch by
    // default. Without it every visit would hit the CMS and the careers pages
    // would lose their static prerender.
    const res = await fetch(`${CMS_URL}${path}`, {
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS, tags: [tag] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`[careers] CMS ${res.status} for ${path} at ${CMS_URL}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    // Logged rather than swallowed silently: an unreachable CMS renders an
    // empty board, and without this the only symptom is "no roles" with no
    // indication that CMS_API_URL is wrong or the CMS is down.
    console.error(
      `[careers] CMS request failed for ${path} at ${CMS_URL}:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/* ── Contact page ───────────────────────────────────────────────────────── */

export type ContactStat = { value: string; label: string };
export type ContactRow = { label: string; value: string };
export type ContactStep = { ident: string; title: string; body: string };
export type ContactFaqItem = { question: string; answer: string };

/** Contact page copy. Mirrors ContactPageContent in the CMS. */
export type ContactContent = {
  hero: { badge: string; title: string; titleAccent: string; lede: string; stats: ContactStat[] };
  rail: {
    reach: {
      heading: string;
      email: string;
      phone: string;
      phoneHref: string;
      linkedin: string;
      linkedinHref: string;
    };
    join: { heading: string; href: string };
    eyebrow: string;
    stats: ContactStat[];
    location: { caption: string; title: string; body: string; rows: ContactRow[] };
  };
  steps: { eyebrow: string; heading: string; aside: string; items: ContactStep[] };
  faq: { eyebrow: string; heading: string; aside: string; items: ContactFaqItem[] };
};

/**
 * Same deploy-skew guard as the careers copy: a CMS still serving the previous
 * shape would otherwise crash the page on a missing array.
 */
function isContactContent(value: unknown): value is ContactContent {
  const c = value as ContactContent | undefined;
  return Boolean(
    c &&
      typeof c.hero?.title === "string" &&
      Array.isArray(c.hero?.stats) &&
      typeof c.rail?.reach?.email === "string" &&
      Array.isArray(c.rail?.stats) &&
      Array.isArray(c.rail?.location?.rows) &&
      Array.isArray(c.steps?.items) &&
      Array.isArray(c.faq?.items)
  );
}

/** Contact page copy from the CMS, falling back to the shipped text. */
export async function getContactContent(): Promise<ContactContent> {
  const data = await getJson<{ success: boolean; data: { content: unknown } | null }>(
    "/api/contact",
    "contact-page"
  );
  const content = data?.data?.content;
  if (isContactContent(content)) return content;

  if (content) {
    console.error("[contact] CMS returned an unrecognised page-content shape — using shipped copy");
  }
  return CONTACT_FALLBACK;
}

/** Section header trio shared by the roles, perks and FAQ blocks. */
type SectionHeader = { eyebrow: string; heading: string; aside: string };

/**
 * The careers page copy, everything on /careers that is not a role.
 * Mirrors CareersPageContent in the CMS.
 */
export type CareersContent = {
  hero: { title: string; titleAccent: string; lede: string; cta: { label: string; href: string } };
  roles: SectionHeader;
  perks: SectionHeader & { items: Perk[] };
  faq: SectionHeader & { items: CandidateFaq[] };
  pipeline: { eyebrow: string; heading: string; bullets: string[] };
};

/**
 * Copy shipped with the site, used when the CMS is unreachable.
 *
 * Assembled from the existing static content rather than duplicated, so the
 * page never renders headless — a CMS outage costs freshness, not the page.
 */
const FALLBACK_CONTENT: CareersContent = {
  hero: CAREERS.hero,
  roles: CAREERS.roles,
  perks: { ...CAREERS.perks, items: PERKS },
  faq: { ...CAREERS.faq, items: CANDIDATE_FAQS },
  pipeline: {
    eyebrow: CAREERS.pipeline.eyebrow,
    heading: CAREERS.pipeline.heading,
    bullets: [...CAREERS.pipeline.bullets],
  },
};

/**
 * True when a payload carries every section this page renders.
 *
 * The two repos deploy independently, so the frontend can briefly meet a CMS
 * still serving the previous content shape. Reaching into `perks.items.length`
 * on that payload throws and takes the whole page down, so anything that does
 * not match is treated as unusable and the shipped copy is rendered instead.
 */
function isCareersContent(value: unknown): value is CareersContent {
  const c = value as CareersContent | undefined;
  return Boolean(
    c &&
      typeof c.hero?.title === "string" &&
      typeof c.roles?.heading === "string" &&
      Array.isArray(c.perks?.items) &&
      Array.isArray(c.faq?.items) &&
      Array.isArray(c.pipeline?.bullets)
  );
}

/** Contact copy shipped with the site, used when the CMS is unreachable. */
const CONTACT_FALLBACK: ContactContent = {
  hero: {
    badge: CONTACT.hero.badge,
    title: CONTACT.hero.title,
    titleAccent: CONTACT.hero.titleAccent,
    lede: CONTACT.hero.lede,
    stats: [...CONTACT.hero.stats],
  },
  rail: {
    reach: {
      heading: "Reach the lab",
      email: SITE.email,
      phone: SITE.phone,
      phoneHref: SITE.phoneHref,
      linkedin: SITE.linkedin,
      linkedinHref: SITE.linkedinHref,
    },
    join: { heading: "Join the lab", href: "/careers" },
    eyebrow: CONTACT.rail.eyebrow,
    stats: [...CONTACT.rail.stats],
    location: {
      caption: CONTACT.rail.location.caption,
      title: CONTACT.rail.location.title,
      body: CONTACT.rail.location.body,
      rows: [...CONTACT.rail.location.rows],
    },
  },
  steps: { ...CONTACT.steps, items: [...STEPS] },
  faq: { ...CONTACT.faq, items: [...CONTACT_FAQS] },
};

/** Careers page copy from the CMS, falling back to the shipped text. */
export async function getCareersContent(): Promise<CareersContent> {
  const data = await getJson<{ success: boolean; data: { content: unknown } }>(
    "/api/careers-page",
    "careers-page"
  );
  const content = data?.data?.content;
  if (isCareersContent(content)) return content;

  if (content) {
    console.error("[careers] CMS returned an unrecognised page-content shape — using shipped copy");
  }
  return FALLBACK_CONTENT;
}

/** Every published role, newest first. */
export async function getRoles(): Promise<Role[]> {
  const data = await getJson<RolesResponse>("/api/careers/client", "career-list");
  return data?.roles ?? [];
}

/**
 * The first page of roles plus the total, which is what the board needs to
 * render its pagination before any client-side fetching happens.
 *
 * `limit` must match ROLES_PER_PAGE on the board, or the first page would
 * disagree with every page fetched after it.
 */
export async function getRolesPage({
  page = 1,
  discipline = "",
  limit = 6,
}: { page?: number; discipline?: string; limit?: number } = {}): Promise<{
  roles: Role[];
  total: number;
}> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (discipline) params.set("category", discipline);

  const data = await getJson<RolesResponse>(
    `/api/careers/client?${params}`,
    "career-list"
  );
  return {
    roles: data?.roles ?? [],
    total: data?.pagination?.totalCount ?? data?.total ?? 0,
  };
}

/** One role by slug, or null when it is unpublished or missing. */
export async function getRole(slug: string): Promise<Role | null> {
  const data = await getJson<RoleResponse>(
    `/api/careers/client/${encodeURIComponent(slug)}`,
    `career-${slug}`
  );
  return data?.role ?? null;
}

/**
 * Discipline tabs plus the total open-role count, for the static parts of the
 * careers page (filter chips and the hero's "N open roles").
 *
 * Reads the same cached URL as getDisciplines(), so it costs no extra request.
 * The role rows themselves are fetched in the browser by <RoleBoard>.
 */
export async function getRoleSummary(): Promise<{ disciplines: string[]; total: number }> {
  const data = await getJson<RolesResponse>("/api/careers/client", "career-list");
  return {
    disciplines: data?.filters?.categories ?? [],
    total: data?.pagination?.totalCount ?? data?.total ?? data?.roles?.length ?? 0,
  };
}

/**
 * Discipline tabs, in the order configured in the CMS.
 *
 * Falls back to the static DISCIPLINES union if the CMS is unreachable, so the
 * board still renders its filter chips.
 */
export async function getDisciplines(): Promise<string[]> {
  const data = await getJson<RolesResponse>("/api/careers/client", "career-list");
  return data?.filters?.categories ?? [];
}
