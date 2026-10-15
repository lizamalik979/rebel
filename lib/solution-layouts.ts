/**
 * Layouts (templates) a solution page can be built from.
 *
 * Each section component is styled for one tone — hero, comparison and contact
 * are dark; offerings and FAQ are light — so a layout is not free to order them
 * however it likes. The page must alternate dark/light with no two adjacent
 * sections sharing a tone, which is what `isAlternating` enforces.
 *
 * Adding a layout: list its sections here and the assertion below will reject
 * it at import time if the rhythm breaks. That is deliberate — a broken rhythm
 * is invisible in code review but obvious on the page.
 */

export const SECTION_IDS = ["hero", "offerings", "comparison", "faq", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** The tone each section component is styled for. Not a choice — a fact. */
export const SECTION_TONE: Record<SectionId, "dark" | "light"> = {
  hero: "dark",
  offerings: "light",
  comparison: "dark",
  faq: "light",
  contact: "dark",
};

export type SolutionLayout = {
  id: string;
  name: string;
  description: string;
  sections: SectionId[];
};

/** True when no two adjacent sections share a tone. */
export function isAlternating(sections: SectionId[]): boolean {
  return sections.every(
    (id, i) => i === 0 || SECTION_TONE[id] !== SECTION_TONE[sections[i - 1]]
  );
}

export const SOLUTION_LAYOUTS: SolutionLayout[] = [
  {
    id: "standard",
    name: "Standard pillar",
    description:
      "The full page: hero, what-we-do cards, comparison table, FAQ and a closing enquiry panel.",
    sections: ["hero", "offerings", "comparison", "faq", "contact"],
  },
  {
    id: "essentials",
    name: "Essentials",
    description:
      "A short page for a newer pillar: hero, what-we-do cards, then straight to the enquiry panel.",
    sections: ["hero", "offerings", "contact"],
  },
  {
    id: "reference",
    name: "Reference",
    description:
      "Ends on the FAQ instead of an enquiry panel, for a pillar that explains rather than sells.",
    sections: ["hero", "offerings", "comparison", "faq"],
  },
];

// Fails the build rather than shipping a page with two dark sections touching.
for (const layout of SOLUTION_LAYOUTS) {
  if (!isAlternating(layout.sections)) {
    throw new Error(
      `Solution layout "${layout.id}" breaks the dark/light rhythm: ` +
        layout.sections.map((s) => `${s}(${SECTION_TONE[s]})`).join(" → ")
    );
  }
}

/** A layout by id, falling back to the standard page. */
export function layoutFor(id: string | undefined): SolutionLayout {
  return SOLUTION_LAYOUTS.find((l) => l.id === id) ?? SOLUTION_LAYOUTS[0];
}
