import Link from "next/link";

import { PostCard } from "@/components/blog/post-card";
import type { BlogCategory, BlogPost } from "@/lib/blog-api";

/**
 * Build a listing URL.
 *
 * Page 1 is written as *no* page parameter so /blog and /blog?page=1 are not
 * two URLs for one page — which matters for search engines and for the "is this
 * tab active" comparison below. Category always comes first, so a link reads
 * ?category=memory&page=2 rather than the reverse.
 */
export function blogHref({ category = "", page = 1 }: { category?: string; page?: number }): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

const PILL =
  "rounded-full border px-5 py-2.75 font-mono text-[0.68rem] tracking-[0.1em] uppercase transition-colors duration-250";

/**
 * The listing: category tabs, the article grid, and paging.
 *
 * Every control is a link, and the page is rendered on the server from the URL.
 * That makes a filtered page shareable and indexable, and it is why there is no
 * "load more" — a button that accumulates rows leaves the URL saying one thing
 * while the page shows another, and there is no way back to the same view.
 */
export function BlogBoard({
  posts,
  categories,
  category,
  page,
  total,
  totalPages,
  failed,
}: {
  posts: BlogPost[];
  categories: BlogCategory[];
  /** Active category slug, or "" for all posts. */
  category: string;
  page: number;
  total: number;
  totalPages: number;
  failed: boolean;
}) {
  const activeCategory = categories.find((item) => item.slug === category);

  return (
    <section className="bg-paper text-light-fg">
      <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(56px,9vh,100px)] sm:px-7">
        {categories.length > 0 && (
          <nav
            data-reveal
            aria-label="Filter articles by category"
            className="flex flex-wrap gap-2.5"
          >
            <Link
              href={blogHref({})}
              aria-current={category ? undefined : "page"}
              className={`${PILL} ${
                category
                  ? "border-black/[0.22] text-light-muted hover:border-light-fg hover:text-light-fg"
                  : "border-light-fg bg-light-fg text-white"
              }`}
            >
              All posts
            </Link>

            {categories.map((item) => {
              const active = item.slug === category;
              return (
                <Link
                  key={item.id}
                  // Changing category always returns to page 1 — page 3 of
                  // "all posts" is rarely a page of "memory".
                  href={blogHref({ category: item.slug })}
                  aria-current={active ? "page" : undefined}
                  className={`${PILL} ${
                    active
                      ? "border-light-fg bg-light-fg text-white"
                      : "border-black/[0.22] text-light-muted hover:border-light-fg hover:text-light-fg"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        )}

        <div
          data-reveal
          className="mt-[clamp(32px,5vh,56px)] flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.12] pb-4"
        >
          <p className="font-mono text-[0.66rem] tracking-[0.18em] text-brand uppercase">
            {activeCategory ? activeCategory.name : "Latest articles"}
          </p>
          <p className="font-mono text-[0.66rem] tracking-[0.12em] text-light-muted-2 uppercase">
            {total} {total === 1 ? "article" : "articles"}
          </p>
        </div>

        {failed ? (
          <p className="py-16 text-center text-[0.95rem] text-light-fg-2">
            We couldn&apos;t load the articles just now. Please refresh in a moment.
          </p>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center">
            {/* `category` is checked, not `activeCategory`: a category whose
                posts are all drafts has no tab and is not in the list, but the
                URL still resolves — and "no articles published yet" would be a
                lie while other posts exist. */}
            <p className="text-[0.95rem] text-light-fg-2">
              {category
                ? `Nothing published under ${activeCategory?.name ?? "this category"} yet.`
                : "No articles published yet. The first field notes are being written."}
            </p>
            {category && (
              <Link
                href={blogHref({})}
                className="mt-5 inline-block font-mono text-[0.68rem] tracking-[0.12em] text-brand uppercase underline underline-offset-4"
              >
                View all posts →
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-[clamp(28px,4vh,44px)] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-[clamp(36px,6vh,64px)] flex flex-wrap items-center justify-center gap-2.5"
          >
            {/* Rendered as a span when there is nowhere to go: a disabled
                anchor is still focusable and still navigable by keyboard. */}
            {page > 1 ? (
              <Link
                href={blogHref({ category, page: page - 1 })}
                rel="prev"
                className={`${PILL} border-black/20 text-light-fg hover:bg-light-fg hover:text-white`}
              >
                ← Prev
              </Link>
            ) : (
              <span className={`${PILL} border-black/10 text-light-faint`}>← Prev</span>
            )}

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => {
              const active = number === page;
              return active ? (
                <span
                  key={number}
                  aria-current="page"
                  className={`${PILL} border-light-fg bg-light-fg text-white`}
                >
                  {number}
                </span>
              ) : (
                <Link
                  key={number}
                  href={blogHref({ category, page: number })}
                  className={`${PILL} border-black/[0.22] text-light-muted hover:border-light-fg hover:text-light-fg`}
                >
                  {number}
                </Link>
              );
            })}

            {page < totalPages ? (
              <Link
                href={blogHref({ category, page: page + 1 })}
                rel="next"
                className={`${PILL} border-black/20 text-light-fg hover:bg-light-fg hover:text-white`}
              >
                Next →
              </Link>
            ) : (
              <span className={`${PILL} border-black/10 text-light-faint`}>Next →</span>
            )}
          </nav>
        )}

        {posts.length > 0 && (
          <p className="mt-4 text-center font-mono text-[0.68rem] tracking-[0.12em] text-light-faint uppercase">
            Page {page} of {Math.max(1, totalPages)} · showing {posts.length} of {total}
          </p>
        )}
      </div>
    </section>
  );
}
