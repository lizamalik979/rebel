import Link from "next/link";

import { RequestedPath } from "@/components/requested-path";
import { SITE } from "@/lib/content";

/** Where someone who hit a dead end most likely meant to go. */
const DESTINATIONS = [
  { label: "Solutions", href: "/solutions/agentic-automation", note: "What the lab builds" },
  { label: "Blog", href: "/blog", note: "Field notes and build logs" },
  { label: "Careers", href: "/careers", note: "Open roles" },
  { label: "Contact", href: "/contact", note: "Start a conversation" },
] as const;

/**
 * The 404 body, shared by the root not-found and the one inside the site's
 * route group so both read identically.
 *
 * It offers routes rather than only an apology: a visitor who mistyped a URL,
 * or followed a link to a role that has since been filled, needs somewhere to
 * go next — and this page is the one place on the site with no navigation of
 * its own beyond the header.
 */
export function NotFoundView() {
  return (
    <section className="relative bg-ink text-dark-fg">
      {/* Same dot field the legal pages use, so a 404 still looks like the
          site rather than a bare error screen. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_35%,#000_30%,transparent_72%)]"
      />

      <div className="relative mx-auto flex min-h-[72svh] max-w-(--spacing-shell) flex-col justify-center px-6 py-[clamp(72px,12vh,140px)] sm:px-7">
        <p className="mb-7 inline-flex items-center gap-2.5 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
          <span aria-hidden="true" className="inline-block size-[7px] bg-brand" />
          404 // Route not found
        </p>

        <h1 className="max-w-[16ch] text-[clamp(2.4rem,6.4vw,5rem)] leading-[1.02] font-semibold tracking-[-0.025em] text-balance">
          This page isn&apos;t in the lab
          <span className="text-brand">.</span>
        </h1>

        <p className="mt-7 max-w-[52ch] text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.65] text-dark-fg-3">
          Not everything we&apos;re building has been published, and some of it
          has been retired. Whatever you were after, one of these will get you
          closer.
        </p>

        {/* The terminal from the Open Lab section, reused to say what was
            actually requested. Seeing the mistyped path is more useful than
            being told, generically, that something is missing. */}
        <div className="mt-10 max-w-[620px] rounded-[14px] border border-white/10 bg-ink-600 p-4 pl-5">
          <p className="flex flex-wrap items-baseline gap-3 font-mono text-[0.86rem]">
            <span className="flex-none text-dark-muted-2">rebel@labz:~$</span>
            <RequestedPath />
          </p>
          <p className="mt-2.5 border-t border-white/[0.08] pt-2.5 font-mono text-[0.72rem] text-dark-muted">
            no such route, status 404
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATIONS.map((destination) => (
            <li key={destination.href} className="bg-ink">
              <Link
                href={destination.href}
                className="group flex h-full flex-col gap-1.5 p-5 transition-colors duration-300 hover:bg-ink-600"
              >
                <span className="flex items-center justify-between gap-3 text-[1rem] font-semibold text-dark-fg">
                  {destination.label}
                  <span
                    aria-hidden="true"
                    className="text-brand transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
                <span className="font-mono text-[0.66rem] tracking-[0.06em] text-dark-muted">
                  {destination.note}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-11 flex flex-wrap items-center gap-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full bg-brand px-6 py-3.5 text-[0.88rem] font-semibold text-white transition-colors duration-300 hover:bg-brand-hover"
          >
            Back to the lab
          </Link>
          <span className="font-mono text-[0.72rem] text-dark-muted">
            or write to{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="underline underline-offset-4 transition-colors hover:text-brand"
            >
              {SITE.email}
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
