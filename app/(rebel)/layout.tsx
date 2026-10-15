import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

import { RevealObserver } from "@/components/reveal-observer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteHeader } from "@/lib/header-menu-api";
import { jsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/json-ld";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "An intelligence lab researching, engineering, and democratizing intelligence. We build adaptive systems that bridge human cognition, machine memory, and collective wisdom.";

export const metadata: Metadata = {
  title: {
    default: "Rebel Labz: Architecting the evolution of intelligence",
    template: "%s · Rebel Labz",
  },
  description,
  keywords: [
    "intelligence lab",
    "adaptive intelligence",
    "memory intelligence",
    "decision intelligence",
    "applied AI research",
  ],
  openGraph: {
    type: "website",
    siteName: "Rebel Labz",
    title: "Rebel Labz: Architecting the evolution of intelligence",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Rebel Labz: Architecting the evolution of intelligence",
    description,
  },
};

/**
 * Chrome for the Rebel Labz site.
 *
 * The header's navigation is fetched here rather than inside SiteHeader: the
 * header is a client component (scroll spy, dropdowns, mobile sheet), and the
 * fetch is cached and tag-revalidated, so doing it once in the layout keeps the
 * nav in the server-rendered HTML instead of arriving after hydration.
 */
export default async function RebelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const header = await getSiteHeader();

  return (
    <div
      className={`theme-rebel ${jetbrainsMono.variable} flex flex-1 flex-col bg-ink text-dark-fg`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      {/* Site-wide identity: ties the domain, logo, contact details and
          LinkedIn profile to one entity instead of leaving it to be inferred. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([organizationJsonLd(), websiteJsonLd()]),
        }}
      />

      <SiteHeader nav={header.nav} cta={header.cta} />

      <main id="main" className="flex-1">
        {children}
      </main>

      <SiteFooter />
      <RevealObserver />
    </div>
  );
}
