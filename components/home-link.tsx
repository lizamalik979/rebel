"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Link to the home page that, when already on it, scrolls back to the top.
 *
 * A plain <Link href="/"> on "/" is a no-op as far as the visitor can tell:
 * the router sees the same URL and leaves the scroll where it is. Used for the
 * header and footer logos, where "take me home" should always do something.
 */
export function HomeLink({
  children,
  onClick,
  ...rest
}: Omit<React.ComponentProps<typeof Link>, "href">) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      onClick={(event) => {
        onClick?.(event);
        // Leave modified clicks (new tab, new window) to the browser.
        if (
          pathname !== "/" ||
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.button !== 0
        ) {
          return;
        }
        event.preventDefault();
        // Drop any #section left in the URL by in-page anchors, so a reload
        // does not jump back down.
        if (window.location.hash) {
          window.history.replaceState(null, "", "/");
        }
        // An explicit behavior overrides the CSS reduce-motion rule, so the
        // preference is checked here instead.
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
