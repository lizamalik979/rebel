"use client";

import { useId, useState } from "react";

import { SITE } from "@/lib/content";
import { leadMailto, submitLead } from "@/lib/lead-api";

const FIELD =
  "min-w-0 rounded-[10px] border border-black/[0.12] bg-paper px-4 py-2.5 text-[0.88rem] text-light-fg outline-brand placeholder:text-light-faint";
const LABEL =
  "font-mono text-[0.6rem] tracking-[0.14em] text-light-muted-2 uppercase";

/**
 * Lead capture for the solution pages.
 *
 * Submitting records a Lead in the CMS. `subjectPrefix` identifies which
 * solution page the enquiry came from, so the dashboard can tell them apart.
 * If the CMS cannot be reached the form stays filled in and offers the lab's
 * address as a link, rather than redirecting into a mail client.
 */
export function CollaborationForm({
  interests,
  subjectPrefix,
}: {
  interests: string[];
  subjectPrefix: string;
}) {
  const ids = useId();
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Prefilled mail to the lab, offered only after a failed submit. */
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    const submittedName = value("name");

    setSending(true);
    setError(null);

    const result = await submitLead({
      name: submittedName,
      email: value("email"),
      phoneNo: value("phone"),
      leadSource: `Solutions: ${subjectPrefix}`,
      formData: {
        Organization: value("org") || "N/A",
        "Interested in": value("interest"),
        "The decision": value("decision"),
      },
    });

    setSending(false);

    if (result.ok) {
      setName(submittedName);
      setSent(true);
      return;
    }

    setError(result.message);
    setMailtoHref(
      leadMailto(SITE.email, `${subjectPrefix} (${value("org") || submittedName})`, [
        `Name: ${submittedName}`,
        `Email: ${value("email")}`,
        `Phone: ${value("phone")}`,
        `Organization: ${value("org") || "N/A"}`,
        `Interested in: ${value("interest")}`,
        "",
        "The decision:",
        value("decision"),
      ])
    );
  };

  if (sent) {
    return (
      <div
        data-reveal="fade-left"
        data-reveal-delay="1"
        className="rounded-[22px] border border-black/[0.14] bg-paper p-[clamp(22px,2.4vw,30px)] shadow-[0_24px_60px_-40px_rgb(0_0_0/0.35)]"
      >
        <div className="flex flex-col items-start gap-4 px-1 py-5">
          <p className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 bg-brand"
            />
            Signal received
          </p>
          <h3 className="text-2xl font-semibold tracking-[-0.015em]">
            Thanks{name && `, ${name}`}. We&apos;re on it.
          </h3>
          <p className="text-[0.92rem] leading-relaxed text-light-fg-2">
            Your mail client should have opened with the request ready to send.
            If it didn&apos;t, write to us directly at{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-mono underline underline-offset-2 hover:text-brand"
            >
              {SITE.email}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="cursor-pointer rounded-[10px] border border-black/20 px-4.5 py-2.5 font-mono text-[0.68rem] tracking-[0.1em] text-light-fg-2 transition-colors hover:border-brand hover:text-brand"
          >
            send another →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-reveal="fade-left"
      data-reveal-delay="1"
      className="rounded-[22px] border border-black/[0.14] bg-paper p-[clamp(22px,2.4vw,30px)] shadow-[0_24px_60px_-40px_rgb(0_0_0/0.35)]"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
          <span aria-hidden="true" className="inline-block size-1.5 bg-brand" />
          Start a collaboration
        </p>
        <p className="font-mono text-[0.58rem] tracking-[0.14em] text-light-faint">
          Reply &lt; 48h
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
          <label htmlFor={`${ids}-name`} className="flex flex-col gap-1.5">
            <span className={LABEL}>Name *</span>
            <input
              id={`${ids}-name`}
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Ada Lovelace"
              className={FIELD}
            />
          </label>
          <label htmlFor={`${ids}-email`} className="flex flex-col gap-1.5">
            <span className={LABEL}>Work Email *</span>
            <input
              id={`${ids}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="ada@company.com"
              className={FIELD}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
          <label htmlFor={`${ids}-phone`} className="flex flex-col gap-1.5">
            <span className={LABEL}>Phone *</span>
            <input
              id={`${ids}-phone`}
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+91 98765 43210"
              className={FIELD}
            />
          </label>
          <label htmlFor={`${ids}-org`} className="flex flex-col gap-1.5">
            <span className={LABEL}>Organization</span>
            <input
              id={`${ids}-org`}
              name="org"
              type="text"
              autoComplete="organization"
              placeholder="Company / institute"
              className={FIELD}
            />
          </label>
        </div>

        {/* Full row: in a third column the offering names were truncated to
            "Enterprise Int…" and the phone/organization placeholders clipped. */}
        <label htmlFor={`${ids}-interest`} className="flex flex-col gap-1.5">
          <span className={LABEL}>Interested In</span>
          <select
            id={`${ids}-interest`}
            name="interest"
            defaultValue={interests[0]}
            className={FIELD}
          >
            {interests.map((interest) => (
              <option key={interest}>{interest}</option>
            ))}
          </select>
        </label>

        <label htmlFor={`${ids}-decision`} className="flex flex-col gap-1.5">
          <span className={LABEL}>The Decision *</span>
          <textarea
            id={`${ids}-decision`}
            name="decision"
            required
            rows={3}
            placeholder="Describe the decision, workflow, or question you're working on..."
            className={`${FIELD} resize-y`}
          />
        </label>

        <div className="mt-1 flex flex-col gap-3">
          {error && (
            <p role="alert" className="text-[0.82rem] leading-snug text-brand">
              {error}{" "}
              {mailtoHref && (
                <a
                  href={mailtoHref}
                  className="underline underline-offset-2 hover:text-light-fg"
                >
                  Send it as an email instead
                </a>
              )}
            </p>
          )}
          <button
            type="submit"
            disabled={sending}
            className="group flex cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-light-fg px-5.5 py-3 text-[0.92rem] font-semibold text-white transition-colors duration-300 hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-light-fg"
          >
            {sending ? "Sending…" : "Request collaboration"}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </button>
          <p className="text-center font-mono text-[0.6rem] tracking-[0.06em] text-light-faint">
            No login. No newsletter. A human reads every submission.
          </p>
        </div>
      </form>
    </div>
  );
}
