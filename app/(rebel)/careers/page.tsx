import type { Metadata } from "next";

import { CandidateFaq } from "@/components/careers/candidate-faq";
import { CareersHero } from "@/components/careers/careers-hero";
import { PipelineSection } from "@/components/careers/pipeline-section";
import { RoleBoard } from "@/components/careers/role-board";
import { WhyBuildHere } from "@/components/careers/why-build-here";
import { faqPageJsonLd, jsonLd } from "@/lib/json-ld";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/seo";
import { CAREERS } from "@/lib/careers";
import { getCareersContent, getRoleSummary } from "@/lib/careers-api";

const description = CAREERS.hero.lede;

export const metadata: Metadata = {
  title: "Careers",
  description,
  alternates: { canonical: "/careers" },
  twitter: TWITTER_DEFAULTS,
  openGraph: {
    ...OG_DEFAULTS,
    url: "/careers",
    title: "Careers · Rebel Labz",
    description,
  },
};

export default async function CareersPage() {
  // The page deliberately does NOT read searchParams. Doing so made it dynamic,
  // so every visit server-rendered the whole page and waited on the CMS before
  // the first byte. Now it is prerendered from cached CMS reads (revalidated by
  // the publish webhook) and opens instantly; <RoleBoard> reads the filter and
  // page from the URL itself and fetches the role rows in the browser.
  const [{ disciplines, total }, content] = await Promise.all([
    getRoleSummary(),
    getCareersContent(),
  ]);
  const filters = disciplines.length ? ["All Roles", ...disciplines] : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        // Content is authored in lib/careers.ts, not user input.
        // Built from the CMS copy so the structured data always matches the
        // questions actually rendered below.
        dangerouslySetInnerHTML={{ __html: jsonLd(faqPageJsonLd(content.faq.items)) }}
      />

      <CareersHero hero={content.hero} roleCount={total} />
      <RoleBoard header={content.roles} filters={filters} />
      <WhyBuildHere perks={content.perks} />
      <CandidateFaq faq={content.faq} />
      <PipelineSection pipeline={content.pipeline} />
    </>
  );
}
