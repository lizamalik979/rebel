import type { Metadata } from "next";

import { BlogBoard } from "@/components/blog/blog-board";
import { BlogHero } from "@/components/blog/blog-hero";
import { OpenLab } from "@/components/open-lab";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/seo";
import { getBlogCategories, getPostsPage, POSTS_PER_PAGE } from "@/lib/blog-api";

const description =
  "Research notes, build logs, and honest reads on adaptive systems, written by the people shipping them.";

export const metadata: Metadata = {
  title: "Blog",
  description,
  alternates: { canonical: "/blog" },
  twitter: TWITTER_DEFAULTS,
  openGraph: {
    ...OG_DEFAULTS,
    url: "/blog",
    title: "Blog · Rebel Labz",
    description,
  },
};

type Props = {
  searchParams: Promise<{ page?: string; category?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  // Page and category are read HERE, from the URL, and the whole listing is
  // rendered on the server. That keeps /blog?category=memory&page=2 a real,
  // shareable, indexable page, and avoids useSearchParams — which on a
  // prerendered route needs a Suspense boundary whose fallback cannot itself
  // read the params.
  const { page: pageParam, category = "" } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  // Independent reads, so the page waits on the slowest rather than the sum.
  // The hero always shows the newest post overall, which is why it is fetched
  // separately from the (possibly filtered, possibly paged) board below.
  const [{ posts, total, totalPages, failed }, categories, newest] = await Promise.all([
    getPostsPage({ page, category }),
    getBlogCategories(),
    getPostsPage({ page: 1, limit: 1 }),
  ]);

  return (
    <>
      <BlogHero latest={newest.posts[0] ?? null} />
      <BlogBoard
        posts={posts}
        categories={categories}
        category={category}
        page={page}
        total={total}
        totalPages={totalPages || Math.ceil(total / POSTS_PER_PAGE)}
        failed={failed}
      />
      {/* Light board above, so this closes the page dark. */}
      <OpenLab tone="dark" />
    </>
  );
}
