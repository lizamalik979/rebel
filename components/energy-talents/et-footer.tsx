import Link from "next/link";

import { EtWordmark } from "@/components/energy-talents/et-logo";
import { ET, ET_FOOTER_GROUPS } from "@/lib/energy-talents";

const SOCIALS = [
  { label: "LinkedIn", glyph: "in", href: "#" },
  { label: "X", glyph: "𝕏", href: "#" },
  { label: "YouTube", glyph: "▶", href: "#" },
];

export function EtFooter() {
  return (
    <footer className="border-t border-[var(--et-line)] bg-[var(--et-cream-2)] pt-16 pb-8">
      <div className="mx-auto max-w-[1216px] px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.1fr]">
          <div>
            <Link href="/" aria-label={`${ET.name} home`}>
              <EtWordmark width={40} height={30} />
            </Link>

            <p className="mt-5 max-w-[320px] text-[14px] leading-relaxed text-[var(--et-body)]">
              {ET.blurb}
            </p>

            <div className="mt-6">
              <p className="text-[14px] font-bold">Global HQ</p>
              <address className="mt-1.5 text-[14px] not-italic text-[var(--et-body)]">
                {ET.hqLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="block">
                  <a href={`tel:${ET.emergencyTel}`}>{ET.emergencyPhone}</a> ·{" "}
                  <a href={`mailto:${ET.crewEmail}`}>{ET.crewEmail}</a>
                </span>
              </address>
            </div>

            <ul className="mt-6 flex gap-3">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--et-line)] bg-white text-[12px] font-bold transition-colors hover:border-orange-400"
                  >
                    <span aria-hidden="true">{social.glyph}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {ET_FOOTER_GROUPS.map((group) => (
            <nav key={group.label} aria-label={group.label}>
              <h2 className="mb-4 text-[12px] font-bold tracking-[.14em] text-stone-400 uppercase">
                {group.label}
              </h2>
              <ul className="space-y-3 text-[14px] text-[var(--et-body)]">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} prefetch={false}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[var(--et-line)] pt-6 text-[13px] text-[var(--et-body)] sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {ET.legalName}. All rights reserved.
          </span>
          <span className="flex gap-6">
            <Link href="/privacy" prefetch={false}>
              Privacy
            </Link>
            <Link href="/terms" prefetch={false}>
              Terms
            </Link>
            <Link href="/cookies" prefetch={false}>
              Cookies
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
