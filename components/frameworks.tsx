"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { PILLARS, type Pillar } from "@/lib/content";

/** Below this width (and under reduced-motion) the rail scrolls natively. */
const PIN_BREAKPOINT = 1024;

export function Frameworks() {
  const stageRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!stage || !sticky || !track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let overflow = 0;
    let stickyHeight = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (overflow <= 0) return;
      const travel = stage.offsetHeight - stickyHeight;
      const ratio = clamp01(-stage.getBoundingClientRect().top / (travel || 1));
      track.style.transform = `translate3d(${(-ratio * overflow).toFixed(1)}px,0,0)`;
      setProgress(ratio);
    };

    const requestUpdate = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    const measure = () => {
      const canPin = window.innerWidth >= PIN_BREAKPOINT && !reduceMotion;
      if (!canPin) {
        overflow = 0;
        stage.style.height = "";
        track.style.transform = "";
        setProgress(0);
        return;
      }
      // Pin for exactly as long as the track has content left to reveal.
      overflow = Math.max(0, track.scrollWidth - track.clientWidth);
      stickyHeight = sticky.offsetHeight;
      stage.style.height = `${stickyHeight + overflow}px`;
      update();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    measure();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", requestUpdate);
      stage.style.height = "";
    };
  }, []);

  const activeIndex = Math.min(
    PILLARS.length,
    Math.floor(progress * (PILLARS.length - 0.001)) + 1,
  );

  return (
    <section
      ref={stageRef}
      id="frameworks"
      aria-labelledby="frameworks-heading"
      className="relative border-t border-white/10 bg-ink text-dark-fg"
    >
      <div
        ref={stickyRef}
        className="flex flex-col justify-center overflow-hidden py-[clamp(64px,10vh,120px)] lg:sticky lg:top-0 lg:h-svh lg:py-[clamp(20px,4vh,52px)]"
      >
        <div className="mx-auto w-full max-w-(--spacing-shell) px-6 sm:px-7">
          <div className="mb-[clamp(16px,2.6vh,32px)] max-w-[62ch]">
            <p className="mb-3 font-mono text-[0.72rem] tracking-[0.18em] text-brand uppercase">
              [ Frameworks // Strategic Engineering ]
            </p>
            <h2
              id="frameworks-heading"
              className="mb-2.5 text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.04] font-semibold tracking-[-0.02em]"
            >
              Strategic frameworks &amp; Solutions for businesses
              <span className="text-brand">.</span>
            </h2>
            <p className="text-[1.02rem] leading-relaxed text-dark-fg-3">
              Where the philosophy meets real enterprises: four intelligence
              pillars that prove what the Lab believes.
            </p>
          </div>

          <div className="mb-[clamp(12px,2vh,20px)] flex items-center gap-4">
            <span className="hidden font-mono text-[0.58rem] tracking-[0.16em] whitespace-nowrap text-dark-faint uppercase lg:inline">
              Keep scrolling
            </span>
            <span className="font-mono text-[0.58rem] tracking-[0.16em] whitespace-nowrap text-dark-faint uppercase lg:hidden">
              Swipe
            </span>
            <div
              className="relative h-0.5 flex-1 overflow-hidden bg-white/12"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={PILLARS.length}
              aria-valuenow={activeIndex}
              aria-label="Pillar progress"
            >
              <span
                className="absolute inset-y-0 left-0 w-1/4 origin-left bg-brand"
                style={{
                  transform: `translateX(${(progress * 300).toFixed(1)}%)`,
                }}
              />
            </div>
            <span className="font-mono text-[0.58rem] tracking-[0.16em] whitespace-nowrap text-dark-faint">
              {String(activeIndex).padStart(2, "0")} / 0{PILLARS.length}
            </span>
          </div>
        </div>

        <div className="rail-scroll w-full snap-x snap-mandatory overflow-x-auto lg:snap-none lg:overflow-hidden">
          <ul
            ref={trackRef}
            className="mx-auto flex max-w-(--spacing-shell) gap-6 px-6 py-1 will-change-transform sm:px-7"
          >
            {PILLARS.map((pillar, index) => (
              <li
                key={pillar.title}
                className="w-[min(78vw,320px)] flex-none snap-start lg:w-[clamp(300px,27vw,360px)]"
              >
                <PillarCard pillar={pillar}>
                  <div className="relative h-[clamp(112px,17vh,178px)] flex-none overflow-hidden">
                    <Image
                      src={pillar.image}
                      alt={pillar.alt}
                      width={760}
                      height={608}
                      sizes="(max-width: 1024px) 78vw, 360px"
                      loading={index < 2 ? "eager" : "lazy"}
                      className="size-full object-cover transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.07]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent to-62% opacity-55 transition-opacity duration-500 group-hover:opacity-15"
                    />
                    <span className="absolute top-3.5 left-3.5 rounded-full bg-black/60 px-3 py-[5px] font-mono text-[0.55rem] tracking-[0.16em] text-white uppercase backdrop-blur-[6px] transition-colors duration-400 group-hover:bg-brand">
                      {pillar.badge}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-6 py-[clamp(16px,2.4vh,24px)]">
                    <p className="mb-3 font-mono text-[0.56rem] tracking-[0.16em] text-brand uppercase">
                      {pillar.kicker}
                    </p>
                    <span
                      aria-hidden="true"
                      // Hidden at rest and drawn in on hover only: as a resting
                      // stub it read as a stray dash under the kicker.
                      className="mb-2.5 block h-0.5 w-0 bg-brand transition-[width] duration-500 ease-(--ease-out-soft) group-hover:w-16"
                    />
                    <h3 className="mb-2.5 text-[clamp(1.12rem,1.7vw,1.32rem)] leading-tight font-semibold tracking-[-0.015em] transition-colors duration-400 group-hover:text-brand">
                      {pillar.title}
                    </h3>
                    <p className="text-[0.88rem] leading-relaxed text-[#a8a8a8]">
                      {pillar.body}
                    </p>
                    {pillar.href && (
                      <span className="mt-auto inline-flex items-center gap-2 pt-[clamp(12px,2vh,20px)] font-mono text-[0.68rem] font-semibold tracking-[0.14em] text-[#ff3b3b] uppercase opacity-55 transition-opacity duration-400 group-hover:opacity-100">
                        View service
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-400 ease-(--ease-out-soft) group-hover:translate-x-1.5"
                        >
                          →
                        </span>
                      </span>
                    )}
                  </div>
                </PillarCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * A pillar links to its page when one exists, and is an inert card when it
 * doesn't — so an unbuilt pillar never becomes a 404. The hover affordances
 * (lift, brand border) are only applied in the linked case.
 */
function PillarCard({
  pillar,
  children,
}: {
  pillar: Pillar;
  children: React.ReactNode;
}) {
  const shell = `group relative flex h-full flex-col overflow-hidden rounded-[18px] border bg-ink-800 text-dark-fg ${
    pillar.featured ? "border-brand/35" : "border-white/[0.10]"
  }`;

  if (!pillar.href) return <div className={shell}>{children}</div>;

  return (
    <Link
      href={pillar.href}
      prefetch={false}
      className={`${shell} transition-[transform,box-shadow,border-color] duration-500 ease-(--ease-out-soft) hover:-translate-y-2 hover:border-brand/60 hover:shadow-[0_18px_32px_-18px_rgb(0_0_0/0.75),0_10px_22px_-16px_rgb(255_51_51/0.45)]`}
    >
      {children}
    </Link>
  );
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
