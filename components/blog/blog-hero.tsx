import Image from "next/image";
import Link from "next/link";

import { initials, postDate, type BlogPost } from "@/lib/blog-api";

/**
 * The dark opening of the blog: the section title, and the newest post given a
 * full-width panel.
 *
 * The panel shows whichever post is newest rather than an editor-chosen
 * "featured" one — the CMS has no featured flag for posts, and inventing one
 * would be a second thing to keep up to date. Its badge carries the category
 * only, for the same reason: "FEATURED" said nothing the position did not.
 */
export function BlogHero({ latest }: { latest: BlogPost | null }) {
  const category = latest?.categories[0];

  return (
    <section className="bg-ink text-dark-fg">
      <div className="mx-auto max-w-(--spacing-shell) px-6 pt-[clamp(96px,14vh,150px)] pb-[clamp(40px,6vh,72px)] sm:px-7">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div data-reveal>
            <p className="mb-6 font-mono text-[0.66rem] tracking-[0.22em] text-brand uppercase">
              Blog &amp; Intelligence
            </p>
            <h1 className="max-w-[16ch] text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.02] font-semibold tracking-[-0.025em] text-balance">
              Field notes from the intelligence lab
              <span className="text-brand">.</span>
            </h1>
          </div>

          <p
            data-reveal
            data-reveal-delay="1"
            className="max-w-[42ch] text-[0.98rem] leading-[1.7] text-dark-fg-3 lg:justify-self-end lg:text-right"
          >
            Research notes, build logs, and honest reads on adaptive systems,
            written by the people shipping them.
          </p>
        </div>

        {latest && (
          <article
            data-reveal="zoom-in"
            className="mt-[clamp(36px,5vh,60px)] grid grid-cols-1 overflow-hidden rounded-[22px] border border-white/[0.08] bg-ink-600 lg:grid-cols-[1.05fr_1fr]"
          >
            {/* Fixed aspect on mobile, full height beside the copy on desktop:
                the panel's height is set by the text, and the image fills it. */}
            <div className="relative aspect-16/10 lg:aspect-auto lg:min-h-[380px]">
              {latest.featuredImage ? (
                <Image
                  src={latest.featuredImage}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-white/[0.06] to-transparent" />
              )}

              {category && (
                <span className="absolute top-5 left-5 rounded-full bg-ink/85 px-4 py-2 font-mono text-[0.62rem] tracking-[0.16em] text-dark-fg uppercase backdrop-blur-sm">
                  {category.name}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-5 p-[clamp(26px,3.4vw,46px)]">
              <p className="flex flex-wrap items-center gap-2.5 font-mono text-[0.62rem] tracking-[0.16em] uppercase">
                {category && <span className="text-brand">{category.name}</span>}
                {category && <span className="text-dark-muted">·</span>}
                <span className="text-dark-fg-2">{latest.readTimeMinutes} min read</span>
              </p>

              <h2 className="text-[clamp(1.6rem,2.9vw,2.5rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance">
                <Link href={`/blog/${latest.slug}`} className="transition-colors hover:text-brand">
                  {latest.title}
                </Link>
              </h2>

              {latest.excerpt && (
                <p className="max-w-[52ch] text-[0.98rem] leading-[1.65] text-dark-fg-3">
                  {latest.excerpt}
                </p>
              )}

              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-11 place-items-center rounded-lg bg-brand font-mono text-[0.72rem] tracking-[0.06em] text-white"
                  >
                    {initials(latest.author?.username ?? "Rebel Labz")}
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[0.92rem] font-semibold text-dark-fg">
                      {latest.author?.username ?? "Rebel Labz"}
                    </span>
                    <span className="block font-mono text-[0.68rem] tracking-[0.06em] text-dark-muted">
                      {postDate(latest)}
                    </span>
                  </span>
                </div>

                <Link
                  href={`/blog/${latest.slug}`}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-white/[0.16] px-6 py-3.5 font-mono text-[0.68rem] tracking-[0.14em] text-dark-fg uppercase transition-colors duration-300 hover:border-brand hover:text-brand"
                >
                  [ Read
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                  ]
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
