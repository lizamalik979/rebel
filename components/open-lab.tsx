"use client";

import { useId, useState } from "react";

import { SITE } from "@/lib/content";
import { leadMailto, submitLead } from "@/lib/lead-api";

/**
 * Closing CTA. The terminal prompt records the visitor's question as a lead in
 * the CMS, so the team sees it in the dashboard alongside every other form.
 *
 * The prompt asks who is asking and how to reach them as well as the question:
 * without that a question is unanswerable, and a lead the team cannot respond
 * to is not a lead. It stays a terminal rather than a form — this is the "no
 * login" section, and it should not read like one.
 *
 * `tone` exists so the section can sit on either surface: pages alternate
 * dark/light, and this is the last section on more than one of them, so which
 * one it needs depends on what precedes it.
 */
export function OpenLab({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const [question, setQuestion] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Prefilled mail to the lab, offered only after a failed submit. */
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);
  const ids = useId();
  const inputId = `${ids}-question`;
  const nameId = `${ids}-name`;
  const emailId = `${ids}-email`;
  const phoneId = `${ids}-phone`;

  const subject = question.trim() || "A question worth working on";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const address = email.trim();

    setSending(true);
    setError(null);

    const result = await submitLead({
      name: name.trim(),
      email: address,
      phoneNo: phone.trim(),
      leadSource: "Open Lab",
      formData: { Question: subject },
    });

    setSending(false);

    if (result.ok) {
      setSent(true);
      return;
    }

    setError(result.message);
    setMailtoHref(
      leadMailto(SITE.email, subject, [
        `Name: ${name.trim()}`,
        `Email: ${address}`,
        `Phone: ${phone.trim()}`,
        "",
        "Question:",
        subject,
      ])
    );
  };

  return (
    <section
      id="openlab"
      aria-labelledby="openlab-heading"
      className={`scroll-mt-24 ${dark ? "border-t border-white/10 bg-ink text-dark-fg" : "bg-paper text-light-fg"}`}
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 pt-[clamp(84px,13vh,150px)] pb-[clamp(40px,6vh,70px)] sm:px-7">
        <p
          data-reveal
          className={`mb-8 flex items-center gap-3 text-[0.74rem] tracking-[0.12em] ${dark ? "text-dark-fg-2" : "text-light-muted-2"}`}
        >
          <span
            className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 ${dark ? "border-white/[0.16]" : "border-black/[0.14]"}`}
          >
            <span
              aria-hidden="true"
              className="inline-block size-[7px] animate-(--animate-soft-pulse) rounded-full bg-brand"
            />
            Lab Status: Open
          </span>
        </p>

        <h2
          id="openlab-heading"
          data-reveal
          className="max-w-[18ch] text-[clamp(2.4rem,6.4vw,5rem)] leading-none font-semibold tracking-[-0.02em] text-balance"
        >
          The most important <em className="italic">conversations</em>{" "}
          shouldn&apos;t require a login.
        </h2>

        <p
          data-reveal
          className={`mt-8 max-w-[46ch] text-[clamp(1.05rem,1.8vw,1.35rem)] leading-snug ${dark ? "text-dark-fg-3" : "text-light-fg-2"}`}
        >
          Rebel Labz is a shared workshop, not a closed vault. We work with
          researchers, enterprises, and citizens to make intelligence{" "}
          <em className="italic">affordable</em>,{" "}
          <em className="italic">accessible</em>, and{" "}
          <em className="italic">worth having</em>.
        </p>

        <form
          data-reveal
          onSubmit={handleSubmit}
          className="mt-12 max-w-[620px]"
        >
          <div
            className={`flex flex-col gap-3 rounded-[14px] bg-ink-600 p-4 pl-5 ${dark ? "border border-white/10" : ""}`}
          >
            <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
              <label
                htmlFor={inputId}
                className="flex-none font-mono text-[0.86rem] text-dark-muted-2"
              >
                rebel@labz:~$
              </label>
              <input
                id={inputId}
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="state a question worth working on"
                className="min-w-0 flex-1 border-none bg-transparent font-mono text-[0.9rem] text-[#f5f5f5] caret-brand outline-none placeholder:text-dark-faint"
              />
            </div>

            {/* Contact details on their own lines so the prompt above keeps the
                full width it was designed with on narrow screens. */}
            <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.08] pt-3 sm:flex-nowrap">
              <label
                htmlFor={nameId}
                className="flex-none font-mono text-[0.86rem] text-dark-muted-2"
              >
                name:
              </label>
              <input
                id={nameId}
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="who's asking"
                autoComplete="name"
                className="min-w-0 flex-1 border-none bg-transparent font-mono text-[0.9rem] text-[#f5f5f5] caret-brand outline-none placeholder:text-dark-faint"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.08] pt-3 sm:flex-nowrap">
              <label
                htmlFor={emailId}
                className="flex-none font-mono text-[0.86rem] text-dark-muted-2"
              >
                reply-to:
              </label>
              <input
                id={emailId}
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@organisation.com"
                autoComplete="email"
                className="min-w-0 flex-1 border-none bg-transparent font-mono text-[0.9rem] text-[#f5f5f5] caret-brand outline-none placeholder:text-dark-faint"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.08] pt-3 sm:flex-nowrap">
              <label
                htmlFor={phoneId}
                className="flex-none font-mono text-[0.86rem] text-dark-muted-2"
              >
                phone:
              </label>
              <input
                id={phoneId}
                type="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                className="min-w-0 flex-1 border-none bg-transparent font-mono text-[0.9rem] text-[#f5f5f5] caret-brand outline-none placeholder:text-dark-faint"
              />
              <button
                type="submit"
                disabled={sending}
                className="flex-none cursor-pointer rounded-[9px] bg-brand px-4.5 py-2.5 font-mono text-[0.82rem] tracking-[0.02em] text-[#f5f5f5] transition-colors duration-300 hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand"
              >
                {sending ? "sending…" : "send →"}
              </button>
            </div>
          </div>

          {/* Both outcomes live under the terminal so the box itself never
              changes height as the state changes. */}
          {sent && (
            <p
              role="status"
              className={`mt-3.5 font-mono text-[0.72rem] ${dark ? "text-dark-fg-2" : "text-light-fg-2"}`}
            >
              [ received, thanks {name.trim().split(" ")[0]}, a human will reply
              to {email.trim()} ]
            </p>
          )}
          {error && (
            <p role="alert" className="mt-3.5 font-mono text-[0.72rem] text-brand">
              {error}{" "}
              {mailtoHref && (
                <a href={mailtoHref} className="underline underline-offset-2">
                  Send it as an email instead
                </a>
              )}
            </p>
          )}

          <div
            className={`mt-3.5 flex flex-wrap items-center justify-between gap-2.5 font-mono text-[0.68rem] ${dark ? "text-dark-muted" : "text-light-muted-2"}`}
          >
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block size-[7px] animate-(--animate-soft-pulse) rounded-full bg-brand"
              />
              [ Lab Node: Online / Open to Collaboration ]
            </span>
            <span>
              or write to{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="underline underline-offset-2 hover:text-brand"
              >
                {SITE.email}
              </a>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
