"use client";

import { useId, useState } from "react";

import { leadMailto, submitLead } from "@/lib/lead-api";

import { SITE } from "@/lib/content";
import { CONTACT, TIMELINES, TOPICS, type Topic } from "@/lib/contact";

const FIELD =
  "min-w-0 rounded-[10px] border border-black/[0.12] bg-paper px-4 py-3.5 text-[0.9rem] text-light-fg outline-brand placeholder:text-light-faint";
const LABEL =
  "font-mono text-[0.6rem] tracking-[0.14em] text-light-muted-2 uppercase";

/**
 * Lead capture for the contact page.
 *
 * Submitting records a Lead in the CMS, tagged with the chosen topic so the
 * dashboard can tell a press enquiry from a project without opening the row.
 */
export function ContactForm() {
  const ids = useId();
  const [topic, setTopic] = useState<Topic>(TOPICS[0]);
  const [sent, setSent] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Prefilled mail to the lab, offered only after a failed submit. */
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);

  /**
   * Record the enquiry as a lead in the CMS.
   *
   * A failure leaves the filled-in form exactly as it is and offers the lab's
   * address as a link, rather than redirecting to a mail client — the visitor
   * decides whether to switch apps, and retrying costs them nothing.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    const submittedName = value("name");
    const detail = {
      Topic: topic,
      Organization: value("org") || "N/A",
      Timeline: value("timeline"),
      "The problem": value("msg"),
    };

    setSending(true);
    setError(null);

    const result = await submitLead({
      name: submittedName,
      email: value("email"),
      phoneNo: value("phone"),
      // The topic is in the source so the dashboard can tell a press enquiry
      // from a project without opening the row.
      leadSource: `Contact: ${topic}`,
      formData: detail,
    });

    setSending(false);

    if (result.ok) {
      setFirstName(submittedName.split(" ")[0]);
      setSent(true);
      return;
    }

    setError(result.message);
    setMailtoHref(
      leadMailto(SITE.email, `${topic} (${value("org") || submittedName})`, [
        `Topic: ${topic}`,
        `Name: ${submittedName}`,
        `Email: ${value("email")}`,
        `Phone: ${value("phone")}`,
        `Organization: ${value("org") || "N/A"}`,
        `Timeline: ${value("timeline")}`,
        "",
        "The problem:",
        value("msg"),
      ])
    );
  };

  if (sent) {
    return (
      <div
        data-reveal="fade-right"
        className="rounded-[22px] border border-black/[0.14] bg-paper p-[clamp(26px,3vw,40px)] shadow-[0_24px_60px_-40px_rgb(0_0_0/0.35)]"
      >
        <div className="flex flex-col items-start gap-4.5 px-1 py-6">
          <p className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 bg-brand"
            />
            Signal received
          </p>
          <h3 className="text-[1.6rem] font-semibold tracking-[-0.015em]">
            Thanks{firstName && `, ${firstName}`}. We&apos;re on it.
          </h3>
          <p className="max-w-[46ch] text-[0.95rem] leading-[1.65] text-light-fg-2">
            Your note is in the lab queue under{" "}
            <span className="font-mono text-light-fg">{topic}</span>. A human
            will reply within 48 hours from{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-mono text-light-fg underline underline-offset-2 hover:text-brand"
            >
              {SITE.email}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="cursor-pointer rounded-[10px] border border-black/20 px-5 py-2.75 font-mono text-[0.68rem] tracking-[0.1em] text-light-fg-2 transition-colors hover:border-brand hover:text-brand"
          >
            Send another →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-reveal="fade-right"
      className="rounded-[22px] border border-black/[0.14] bg-paper p-[clamp(26px,3vw,40px)] shadow-[0_24px_60px_-40px_rgb(0_0_0/0.35)]"
    >
      <div className="mb-6.5 flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
          <span aria-hidden="true" className="inline-block size-1.5 bg-brand" />
          {CONTACT.form.eyebrow}
        </p>
        <p className="font-mono text-[0.58rem] tracking-[0.14em] text-light-faint uppercase">
          {CONTACT.form.note}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5.5">
        <fieldset className="flex flex-col gap-2.5">
          <legend className={`${LABEL} mb-2.5`}>
            I&apos;m reaching out about *
          </legend>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((option) => {
              const active = option === topic;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTopic(option)}
                  className={`cursor-pointer rounded-full border px-3.75 py-2.25 font-mono text-[0.66rem] tracking-[0.08em] uppercase transition-[background-color,color,border-color] duration-250 ${
                    active
                      ? "border-light-fg bg-light-fg text-white"
                      : "border-black/[0.22] bg-transparent text-light-muted hover:border-light-fg hover:text-light-fg"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
          <label htmlFor={`${ids}-name`} className="flex flex-col gap-2.25">
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
          <label htmlFor={`${ids}-email`} className="flex flex-col gap-2.25">
            <span className={LABEL}>Work email *</span>
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

        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
          <label htmlFor={`${ids}-phone`} className="flex flex-col gap-2.25">
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
          <label htmlFor={`${ids}-org`} className="flex flex-col gap-2.25">
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

        {/* Own row, as on the solution-page form: in a third column the
            options were cut off mid-word. */}
        <label htmlFor={`${ids}-timeline`} className="flex flex-col gap-2.25">
          <span className={LABEL}>Timeline</span>
          <select
            id={`${ids}-timeline`}
            name="timeline"
            defaultValue={TIMELINES[0]}
            className={FIELD}
          >
            {TIMELINES.map((timeline) => (
              <option key={timeline}>{timeline}</option>
            ))}
          </select>
        </label>

        <label htmlFor={`${ids}-msg`} className="flex flex-col gap-2.25">
          <span className={LABEL}>The problem *</span>
          <textarea
            id={`${ids}-msg`}
            name="msg"
            required
            rows={4}
            placeholder="What decision, workflow, or question are you trying to solve? What have you already tried?"
            className={`${FIELD} resize-y`}
          />
        </label>

        <div className="mt-1 flex flex-col gap-3.5">
          {/* Surfaced above the button so it is read before a retry. Nothing
              typed is cleared, so retrying is a single click. */}
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
            className="group flex cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-light-fg px-5.5 py-4 text-[0.94rem] font-semibold text-white transition-[background-color,box-shadow] duration-300 hover:bg-brand hover:shadow-[0_14px_34px_-14px_rgb(255_51_51/0.65)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-light-fg disabled:hover:shadow-none"
          >
            {sending ? "Sending…" : "Send to the lab"}
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
