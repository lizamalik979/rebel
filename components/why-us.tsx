import { DIFFERENTIATORS, ENGAGEMENT_TERMS } from "@/lib/content";

export function WhyUs() {
  return (
    <section
      id="why-us"
      aria-labelledby="why-us-heading"
      className="border-t border-black/[0.08] bg-paper text-light-fg"
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(80px,12vh,140px)] sm:px-7">
        {/* Heading and aside enter from opposite edges — the split header is
            the one place on this page where that reads as composed rather than
            busy. */}
        <div className="mb-[clamp(40px,6vh,64px)] flex flex-wrap items-end justify-between gap-6">
          <div data-reveal="fade-right">
            <p className="mb-4.5 inline-flex items-center gap-2.5 font-mono text-[0.7rem] tracking-[0.22em] text-brand uppercase">
              <span
                aria-hidden="true"
                className="inline-block size-[7px] bg-brand"
              />
              Why Choose Us
            </p>
            <h2
              id="why-us-heading"
              className="max-w-[16ch] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.03] font-semibold tracking-[-0.02em]"
            >
              Built different, <em className="italic">by design</em>.
            </h2>
          </div>
          <p
            data-reveal="fade-left"
            data-reveal-delay="1"
            className="max-w-[38ch] text-[0.95rem] leading-relaxed text-light-muted"
          >
            Not a vendor, a lab. Every engagement is measured against the same
            constitution our systems are.
          </p>
        </div>

        {/* Revealed as one unit, not per cell: the cells are the surface over a
            dark backing showing through 1px gaps, so fading them individually
            would flash that backing mid-animation. */}
        <ul
          data-reveal="zoom-in"
          className="grid gap-px overflow-hidden rounded-[22px] border border-black/[0.14] bg-black/[0.14] sm:grid-cols-2 xl:grid-cols-4"
        >
          {DIFFERENTIATORS.map((item) => (
            <li
              key={item.code}
              className="relative flex min-h-[280px] flex-col overflow-hidden bg-paper px-7 pt-8 pb-7.5"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-2.5 right-4 text-[4.6rem] leading-none font-bold tracking-[-0.05em] text-black/5"
              >
                {item.num}
              </span>

              <p className="inline-flex items-center gap-2 font-mono text-[0.64rem] tracking-[0.15em] text-brand">
                <span
                  aria-hidden="true"
                  className="inline-block size-1.5 bg-brand"
                />
                {`${item.num} // ${item.code}`}
              </p>
              <p className="mt-5.5 font-mono text-[0.6rem] tracking-[0.16em] text-light-faint uppercase">
                {item.kicker}
              </p>
              <h3 className="mt-2 max-w-[18ch] text-[1.2rem] leading-snug font-semibold tracking-[-0.01em]">
                {item.title}
              </h3>
              <p className="mt-3.5 text-[0.9rem] leading-relaxed text-light-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ul>

        <p
          data-reveal
          className="mt-5 flex flex-wrap items-center gap-x-5.5 gap-y-3 font-mono text-[0.62rem] tracking-[0.16em] text-light-muted-2 uppercase"
        >
          <span className="inline-flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 bg-brand"
            />
            {ENGAGEMENT_TERMS[0]}
          </span>
          <span aria-hidden="true" className="text-black/25">
            /
          </span>
          <span>{ENGAGEMENT_TERMS[1]}</span>
        </p>
      </div>
    </section>
  );
}
