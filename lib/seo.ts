import type { Metadata } from "next";

import { SITE } from "@/lib/content";

/**
 * Shared Open Graph / Twitter defaults.
 *
 * Next merges metadata *shallowly*: a page that exports its own `openGraph`
 * replaces the parent's object wholesale rather than merging into it. So a
 * default set on the root layout does not cascade, and every page has to
 * spread these in explicitly — otherwise its share preview has no card image.
 *
 * Spread these first so a page can still override a field afterwards; the
 * solution page supplies its own hero image that way.
 *
 * The image itself is app/opengraph-image.png (1200×630). Deliberately not
 * `as const` — Next's OpenGraph types require mutable arrays.
 */
const OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${SITE.name}: ${SITE.tagline}`,
};

export const OG_DEFAULTS: Metadata["openGraph"] = {
  type: "website",
  siteName: SITE.name,
  locale: "en_US",
  images: [OG_IMAGE],
};

export const TWITTER_DEFAULTS: Metadata["twitter"] = {
  card: "summary_large_image",
  images: [OG_IMAGE.url],
};
