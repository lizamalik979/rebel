import { Emphasis } from "@/components/emphasis";
import { PlatformVisual } from "@/components/platform-visual";
import { PLATFORMS } from "@/lib/content";

export function Philosophy() {
  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-heading"
      className="bg-paper text-light-fg"
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(80px,12vh,140px)] sm:px-7">
        <div
          data-reveal
          className="mb-[clamp(52px,8vh,104px)] grid items-end gap-[clamp(28px,5vw,72px)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]"
        >
          <div>
            <p className="mb-4.5 text-[0.72rem] tracking-[0.24em] text-light-muted-2 uppercase">
              Our Philosophy
            </p>
            <h2
              id="philosophy-heading"
              className="max-w-[16ch] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.03] font-semibold tracking-[-0.02em]"
            >
              We don&apos;t ship software. We build{" "}
              <em className="italic">adaptive intelligence</em>.
            </h2>
          </div>
          <p className="max-w-[46ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-light-fg-2">
            Living systems that bridge{" "}
            <em className="italic">human cognition</em>,{" "}
            <em className="italic">machine memory</em>, and{" "}
            <em className="italic">collective wisdom</em>: small, efficient,
            and affordable, so intelligence is measured by how well an
            organization <em className="italic">adapts</em>, never by how much
            it computes.
          </p>
        </div>

        <div data-reveal id="platforms" className="scroll-mt-28">
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3 border-b border-black/10 pb-4">
            <h3 className="font-mono text-[0.7rem] tracking-[0.16em] text-light-fg uppercase">
              Intelligence Platforms
            </h3>
            <p className="font-mono text-[0.66rem] text-light-muted-2">
              ecosystem frameworks · not products
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORMS.map((platform, index) => (
              <li
                key={platform.code}
                data-reveal="zoom-in-up"
                data-reveal-delay={index + 1}
                className="min-w-0"
              >
                {/* Static card — the per-platform pages don't exist yet, so
                    there is nothing to link to and no hover affordance. */}
                <div className="flex h-full min-h-[300px] flex-col overflow-hidden rounded-[22px] border border-black/10 bg-paper">
                  <div className="h-[170px] flex-none overflow-hidden border-b border-black/5">
                    <PlatformVisual variant={platform.visual} />
                  </div>

                  <div className="flex flex-1 flex-col p-8">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[0.95rem] text-light-muted-2">
                        {platform.num}
                      </span>
                      <span className="font-mono text-[0.6rem] tracking-[0.14em] text-light-faint">
                        {platform.code}
                      </span>
                    </div>

                    <h4 className="mt-5.5 mb-3 text-2xl leading-tight font-semibold">
                      {platform.title}
                    </h4>

                    <p className="text-[0.95rem] leading-relaxed text-light-muted">
                      <Emphasis text={platform.body} />
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
