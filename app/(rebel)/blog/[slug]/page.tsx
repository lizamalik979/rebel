import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleRail } from "@/components/blog/article-rail";
import { PostCard } from "@/components/blog/post-card";
import { ShareButtons } from "@/components/blog/share-buttons";
import { OpenLab } from "@/components/open-lab";
import { breadcrumbJsonLd, faqPageJsonLd, jsonLd } from "@/lib/json-ld";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import {
  getPostBySlug,
  getRelatedPosts,
  initials,
  postDate,
  withHeadingIds,
  type BlogPostDetail,
} from "@/lib/blog-api";

type Props = { params: Promise<{ slug: string }> };

/**
 * Tags are an ACF-style extra rather than a first-class field, so they are read
 * defensively: an array of strings, or a comma-separated string, or nothing.
 */
function tagsOf(post: BlogPostDetail): string[] {
  const raw = post.additionalFields?.tags;
  if (Array.isArray(raw)) return raw.filter((tag): tag is string => typeof tag === "string");
  if (typeof raw === "string") return raw.split(",").map((tag) => tag.trim()).filter(Boolean);
  return [];
}

/** A short role line under the author's name, when one was authored. */
function authorRole(post: BlogPostDetail): string | null {
  const raw = post.additionalFields?.authorRole;
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

function authorBio(post: BlogPostDetail): string | null {
  const raw = post.additionalFields?.authorBio;
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  const description = post.excerpt ?? undefined;
  const url = `/blog/${post.slug}`;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    twitter: TWITTER_DEFAULTS,
    openGraph: {
      ...OG_DEFAULTS,
      type: "article",
      url,
      title: post.title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author.username] : undefined,
      // The featured image wins over the site default when there is one.
      // `OG_DEFAULTS` is typed as possibly-undefined openGraph metadata, so the
      // spread above is what carries the default images through — this only
      // overrides them.
      ...(post.featuredImage ? { images: [{ url: post.featuredImage }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // A draft, a deleted post and a typo all land here: the CMS answers 404 for
  // each, and none of them should render a page.
  if (!post) notFound();

  const category = post.categories[0];
  const related = await getRelatedPosts(category?.slug, post.slug, 3);

  // Ids are injected into the body and handed to the rail from the same pass,
  // so the anchors and the contents list cannot drift apart.
  const { html, headings } = withHeadingIds(post.content);
  const tags = tagsOf(post);
  const url = `${SITE_URL}/blog/${post.slug}`;

  // Editor-authored JSON-LD is emitted as-is; the Article block below is only
  // built when they did not supply their own, so a post never ships two.
  const authored = Array.isArray(post.schema)
    ? post.schema.filter(Boolean)
    : post.schema
      ? [post.schema]
      : [];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.featuredImage ?? undefined,
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    author: post.author ? { "@type": "Person", name: post.author.username } : undefined,
    publisher: { "@type": "Organization", name: "Rebel Labz" },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: category?.name,
  };

  const schemas = [
    ...(authored.length > 0 ? authored : [articleSchema]),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    ...(post.faqItems.length > 0
      ? [faqPageJsonLd(post.faqItems)]
      : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // Authored in the CMS by trusted staff — the same trust boundary as the
        // article body below.
        dangerouslySetInnerHTML={{ __html: jsonLd(schemas) }}
      />

      <article className="bg-ink text-dark-fg">
        {/* Hero ------------------------------------------------------------ */}
        <header className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-(--spacing-shell) px-6 pt-[clamp(88px,12vh,130px)] pb-[clamp(28px,4vh,44px)] sm:px-7">
            <nav aria-label="Breadcrumb" className="mb-10">
              <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.62rem] tracking-[0.14em] text-dark-muted uppercase">
                <li>
                  <Link href="/" className="transition-colors hover:text-dark-fg">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/blog" className="transition-colors hover:text-dark-fg">
                    Blog
                  </Link>
                </li>
                {category && (
                  <>
                    <li aria-hidden="true">/</li>
                    <li>
                      <Link
                        href={`/blog?category=${category.slug}`}
                        className="text-dark-fg-2 transition-colors hover:text-dark-fg"
                      >
                        {category.name}
                      </Link>
                    </li>
                  </>
                )}
              </ol>
            </nav>

            <p className="mb-6 flex flex-wrap items-center gap-2.5 font-mono text-[0.66rem] tracking-[0.16em] uppercase">
              {category && <span className="text-brand">{category.name}</span>}
              {category && <span className="text-dark-muted">·</span>}
              <span className="text-dark-fg-2">{post.readTimeMinutes} min read</span>
            </p>

            <h1 className="max-w-[20ch] text-[clamp(2.2rem,5.2vw,4rem)] leading-[1.06] font-semibold tracking-[-0.025em] text-balance">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-7 max-w-[62ch] text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.65] text-dark-fg-3">
                {post.excerpt}
              </p>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/[0.08] pt-7">
              <div className="flex items-center gap-3.5">
                <span
                  aria-hidden="true"
                  className="grid size-12 place-items-center rounded-[10px] bg-brand font-mono text-[0.78rem] text-white"
                >
                  {initials(post.author?.username ?? "Rebel Labz")}
                </span>
                <span className="leading-tight">
                  <span className="block text-[0.98rem] font-semibold text-dark-fg">
                    {post.author?.username ?? "Rebel Labz"}
                  </span>
                  <span className="block font-mono text-[0.68rem] tracking-[0.06em] text-dark-muted">
                    {[authorRole(post), postDate(post)].filter(Boolean).join(" · ")}
                  </span>
                </span>
              </div>

              <ShareButtons url={url} title={post.title} />
            </div>
          </div>
        </header>

        {/* Body + rail ----------------------------------------------------- */}
        <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(36px,6vh,64px)] sm:px-7">
          {post.featuredImage && (
            <div className="relative mb-[clamp(36px,5vh,60px)] aspect-16/7 overflow-hidden rounded-[18px]">
              <Image
                src={post.featuredImage}
                alt=""
                fill
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <div
                id="article-body"
                className="article-body"
                // The body is rich text written by CMS editors — trusted staff,
                // the same boundary as every other authored page on this site.
                dangerouslySetInnerHTML={{ __html: html }}
              />

              {tags.length > 0 && (
                <ul className="mt-12 flex flex-wrap gap-2.5">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-[10px] border border-white/[0.12] px-4 py-2.5 font-mono text-[0.7rem] tracking-[0.04em] text-dark-fg-3"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              )}

              {post.faqItems.length > 0 && (
                <section className="mt-14 border-t border-white/[0.08] pt-10">
                  <h2 className="mb-7 font-mono text-[0.66rem] tracking-[0.2em] text-brand uppercase">
                    Frequently asked
                  </h2>
                  <dl className="flex flex-col gap-7">
                    {post.faqItems.map((item) => (
                      <div key={item.question}>
                        <dt className="mb-2 text-[1.05rem] font-semibold text-dark-fg">
                          {item.question}
                        </dt>
                        <dd className="max-w-[68ch] text-[0.96rem] leading-[1.7] text-dark-fg-3">
                          {item.answer}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              <section className="mt-14 rounded-[18px] border border-white/[0.08] bg-ink-600 p-[clamp(24px,3vw,36px)]">
                {/* Author on the left, the link on the right, both vertically
                    centred. On a narrow screen the row wraps and the link falls
                    beneath the name rather than being squeezed against it. */}
                <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6">
                  <div className="flex min-w-0 items-center gap-5">
                    <span
                      aria-hidden="true"
                      className="grid size-14 flex-none place-items-center rounded-[12px] bg-brand font-mono text-[0.9rem] text-white"
                    >
                      {initials(post.author?.username ?? "Rebel Labz")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[1.15rem] font-semibold text-dark-fg">
                        {post.author?.username ?? "Rebel Labz"}
                      </p>
                      {authorRole(post) && (
                        <p className="mt-1 font-mono text-[0.66rem] tracking-[0.16em] text-brand uppercase">
                          {authorRole(post)}
                        </p>
                      )}
                      {authorBio(post) && (
                        <p className="mt-3 max-w-[62ch] text-[0.96rem] leading-[1.7] text-dark-fg-3">
                          {authorBio(post)}
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/blog"
                    className="inline-flex flex-none items-center gap-2 font-mono text-[0.68rem] tracking-[0.14em] text-dark-fg uppercase transition-colors hover:text-brand"
                  >
                    View all articles →
                  </Link>
                </div>
              </section>
            </div>

            {/* Sticky on desktop only: on a phone it would sit above the
                article and push the first paragraph off the screen. */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <ArticleRail headings={headings} />
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-paper text-light-fg">
          <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(56px,9vh,100px)] sm:px-7">
            <p className="mb-10 font-mono text-[0.66rem] tracking-[0.18em] text-brand uppercase">
              Related articles
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dark again after the light related strip. */}
      <OpenLab tone="dark" />
    </>
  );
}
