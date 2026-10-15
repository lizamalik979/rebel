"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { EtWordmark } from "@/components/energy-talents/et-logo";
import { ET_NAV } from "@/lib/energy-talents";

export function EtHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // The bar gains a shadow once the page leaves the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow ${
        scrolled ? "shadow-[0_8px_28px_-14px_rgb(30_27_22/0.22)]" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1216px] items-center justify-between gap-4 px-6">
        <Link href="/" aria-label={`${"Energy Talents"} home`}>
          <EtWordmark />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-9 text-[14.5px] font-medium text-[var(--et-ink)]/85 md:flex"
        >
          {ET_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                prefetch={false}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "border-b-2 border-orange-500 pb-0.5 font-bold text-orange-600"
                    : undefined
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="#form"
          className="et-btn-grad inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white"
        >
          <span className="hidden sm:inline">Request Technical Crew</span>
          <span className="sm:hidden">Request Crew</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </header>
  );
}
