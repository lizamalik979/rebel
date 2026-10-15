import Image from "next/image";
import Link from "next/link";

import { HomeLink } from "@/components/home-link";
import { SITE, type NavLink } from "@/lib/content";
import { getSiteFooter } from "@/lib/footer-menu-api";

/**
 * One footer entry and, if the CMS nested any, the entries beneath it.
 *
 * Rendered as a nested list rather than flattened: an editor who nested an item
 * meant it to sit under its parent, and flattening would present a child as a
 * sibling. Depth shows as indentation and a slightly quieter colour, so a deep
 * menu stays readable in a column.
 *
 * An entry with children but no href is a sub-heading — it renders as text, not
 * a dead link.
 */
function FooterLink({ link, depth = 0 }: { link: NavLink; depth?: number }) {
  const children = link.links ?? [];
  const size = depth === 0 ? "text-[0.85rem]" : "text-[0.8rem]";
  const tone = depth === 0 ? "text-[#b0b0b0]" : "text-[#8a8a8a]";

  return (
    <li>
      {link.href ? (
        <Link
          href={link.href}
          prefetch={false}
          className={`${size} ${tone} transition-colors duration-200 hover:text-white`}
        >
          {link.label}
        </Link>
      ) : (
        <span className={`${size} ${tone}`}>{link.label}</span>
      )}

      {children.length > 0 && (
        <ul className="mt-2 flex flex-col gap-2 border-l border-white/10 pl-3">
          {children.map((child) => (
            <FooterLink key={`${child.label}-${child.href ?? ""}`} link={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Server component: the columns and contact lines come from the CMS, with the
 * shipped copy as the fallback so an unreachable CMS cannot blank the footer.
 */
export async function SiteFooter() {
  const { tagline, contact, groups } = await getSiteFooter();

  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto grid max-w-(--spacing-shell) gap-[clamp(28px,4vw,64px)] px-6 pt-14 pb-10 sm:px-7 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <HomeLink aria-label={`${SITE.name} home`} className="self-start">
            <Image
              src="/brand/logo.svg"
              alt={SITE.name}
              width={748}
              height={173}
              loading="lazy"
              className="h-[30px] w-auto"
            />
          </HomeLink>
          <p className="max-w-[30ch] text-[0.85rem] leading-relaxed text-[#7a7a7a]">
            {tagline}
          </p>

          {/* A list rather than fixed email/phone/social fields: a second
              address or a third social account is a content change, not a
              schema change. A line with no href renders as plain text. */}
          <address className="mt-1 flex flex-col items-start gap-2 not-italic">
            {contact.map((line) =>
              line.href ? (
                <a
                  key={`${line.label}-${line.href}`}
                  href={line.href}
                  {...(line.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-[0.85rem] text-[#b0b0b0] transition-colors hover:text-brand"
                >
                  {line.label}
                </a>
              ) : (
                <span key={line.label} className="text-[0.85rem] text-[#b0b0b0]">
                  {line.label}
                </span>
              )
            )}
          </address>
        </div>

        {groups.map((group) => (
          <nav
            key={group.label}
            aria-label={group.label}
            className="flex flex-col gap-3"
          >
            <h2 className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-dark-faint-2 uppercase">
              {group.label}
            </h2>
            <ul className="flex flex-col gap-3">
              {group.links.map((link) => (
                <FooterLink key={`${link.label}-${link.href ?? ""}`} link={link} />
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-(--spacing-shell) flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4.5 font-mono text-[0.6rem] tracking-[0.15em] text-dark-faint-2 uppercase sm:px-7">
          <span>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </span>

          {/* Legal links live here rather than in a nav group: a privacy
              policy has to be reachable from every page to do its job. */}
          <nav aria-label="Legal" className="flex items-center gap-5">
            <Link
              href="/privacy"
              prefetch={false}
              className="transition-colors hover:text-brand"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              prefetch={false}
              className="transition-colors hover:text-brand"
            >
              Terms
            </Link>
          </nav>

          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block size-[5px] bg-brand"
            />
            Built in the open
          </span>
        </div>
      </div>
    </footer>
  );
}
