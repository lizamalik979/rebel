import { Emphasis } from "@/components/emphasis";
import { Signature } from "@/components/signature";
import { PRINCIPLES } from "@/lib/content";

export function Principles() {
  return (
    <section
      id="principles"
      aria-labelledby="principles-heading"
      className="mx-auto max-w-(--spacing-shell) scroll-mt-24 border-t border-white/[0.12] px-6 py-[clamp(72px,11vh,130px)] sm:px-7"
    >
      <div
        data-reveal
        className="mb-[clamp(36px,5vh,60px)] flex flex-wrap items-end justify-between gap-5"
      >
        <div className="max-w-[460px]">
          <p className="mb-4.5 flex items-center gap-2.5 text-[0.72rem] tracking-[0.24em] text-dark-muted uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-[7px] bg-brand"
            />
            Foundational Principles
          </p>
          <h2
            id="principles-heading"
            className="text-[clamp(1.9rem,4.2vw,3.2rem)] leading-[1.04] font-[440] tracking-[-0.018em] text-balance italic"
          >
            Nine principles, one <em className="italic">constitution</em>.
          </h2>
        </div>
        <p className="max-w-[34ch] text-[0.95rem] leading-relaxed text-[#a8a8a8]">
          The constitution of Rebel Labz: the commitments every system we build
          is measured against. Each principle runs its own live signature.
        </p>
      </div>

      <ol
        data-reveal
        className="grid grid-cols-[repeat(auto-fill,minmax(min(288px,100%),1fr))] gap-3.5"
      >
        {PRINCIPLES.map((principle) => (
          <li
            key={principle.ident}
            className="flex min-h-[328px] min-w-0 flex-col rounded-[20px] border border-white/[0.12] bg-ink-700 p-6.5 transition-[transform,box-shadow,border-color] duration-350 ease-(--ease-out-soft) hover:-translate-y-1.5 hover:border-white/30 hover:shadow-[0_20px_46px_-26px_rgb(0_0_0/0.75)]"
          >
            <div className="min-h-[150px]">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[0.76rem] tracking-[0.06em]">
                  {principle.ident}
                </span>
                <span className="flex-none rounded border border-white/[0.12] px-2.5 py-[5px] font-mono text-[0.6rem] tracking-[0.14em] whitespace-nowrap text-dark-muted-2 uppercase">
                  {principle.tag}
                </span>
              </div>
              <h3 className="mt-3.5 text-[clamp(1.55rem,2.4vw,2rem)] leading-none font-semibold tracking-[-0.018em]">
                {principle.name}
              </h3>
              <p className="mt-2.5 font-mono text-[0.72rem] tracking-[0.04em] text-dark-muted-2">
                {principle.sub}
              </p>
            </div>

            <div className="relative my-4.5 flex h-[120px] flex-none items-center justify-center">
              <Signature stage={principle.wave} />
            </div>

            <div className="flex gap-3 border-t border-white/[0.14] pt-4">
              <span className="pt-1 font-mono text-[0.6rem] text-dark-muted-2">
                DEF
              </span>
              <p className="text-[0.98rem] leading-snug text-dark-fg-2">
                <Emphasis text={principle.copy} />
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
