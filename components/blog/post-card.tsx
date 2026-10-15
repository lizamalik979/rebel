import Image from "next/image";
import Link from "next/link";

import { initials, postDate, type BlogPost } from "@/lib/blog-api";

/** One article in the grid. */
export function PostCard({ post }: { post: BlogPost }) {
  const category = post.categories[0];

  return (
    <article
      data-reveal="fade-up"
      className="group flex flex-col overflow-hidden rounded-[18px] border border-black/[0.08] bg-white transition-[transform,box-shadow] duration-300 ease-(--ease-out-soft) hover:-translate-y-1 hover:shadow-[0_28px_60px_-40px_rgb(0_0_0/0.45)]"
    >
      <div className="relative aspect-16/9 overflow-hidden bg-black/[0.06]">
        {post.featuredImage && (
          <Image
            src={post.featuredImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-(--ease-out-soft) group-hover:scale-[1.03]"
          />
        )}
        {category && (
          <span className="absolute top-4 left-4 rounded-full bg-ink/85 px-3.5 py-1.75 font-mono text-[0.58rem] tracking-[0.14em] text-white uppercase backdrop-blur-sm">
            {category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-[clamp(20px,2vw,28px)]">
        <p className="font-mono text-[0.62rem] tracking-[0.14em] text-light-muted-2 uppercase">
          {post.readTimeMinutes} min read
        </p>

        <h3 className="text-[1.18rem] leading-[1.25] font-semibold tracking-[-0.015em] text-balance">
          {/* The whole card is not a link: the category badge and author sit
              inside it, and nesting interactive elements in an anchor is what
              breaks keyboard navigation on card grids. */}
          <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-brand">
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p className="text-[0.92rem] leading-[1.6] text-light-fg-2">{post.excerpt}</p>
        )}

        <div className="mt-auto flex items-center gap-3 pt-4">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-lg bg-ink font-mono text-[0.62rem] text-white"
          >
            {initials(post.author?.username ?? "Rebel Labz")}
          </span>
          <span className="leading-tight">
            <span className="block text-[0.86rem] font-semibold text-light-fg">
              {post.author?.username ?? "Rebel Labz"}
            </span>
            <span className="block font-mono text-[0.66rem] tracking-[0.06em] text-light-muted-2">
              {postDate(post)}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
