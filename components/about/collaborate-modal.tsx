"use client";

import { useEffect, useId, useRef, useState } from "react";

import { leadMailto, submitLead } from "@/lib/lead-api";

import { SITE } from "@/lib/content";

const FIELD =
  "min-w-0 rounded-[10px] border border-black/[0.12] bg-paper px-4 py-3.5 text-[0.88rem] text-light-fg outline-brand placeholder:text-light-faint";
const LABEL =
  "font-mono text-[0.6rem] tracking-[0.14em] text-light-muted-2 uppercase";

/**
 * A trigger button that collects details in a modal instead of navigating to
 * /contact — the About page asks for data in place.
 *
 * Built on the native <dialog>: focus trapping, Esc-to-close, an inert
 * background and the ::backdrop pseudo-element all come from the platform, so
 * there is no focus-management code to get wrong and no dependency to carry.
 *
 * `context` records which CTA was pressed so the resulting mail says what the
 * person was actually responding to. Same no-backend approach as every other
 * form here: submitting composes a mailto rather than posting to an endpoint
 * that would silently drop it.
 */
export function CollaborateModal({
  label,
  context,
  className,
}: {
  label: string;
  context: string;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const ids = useId();
  const [sent, setSent] = useState(false);
  const [firstName, setFirstName] = useState("");

  // showModal() makes the background inert but does not stop it scrolling.
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const openDialog = () => {
    setSent(false);
    setOpen(true);
    dialogRef.current?.showModal();
  };
  const closeDialog = () => dialogRef.current?.close();

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Prefilled mail to the lab, offered only after a failed submit. */
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);

  /**
   * Record the enquiry as a lead. A failure keeps the modal open with every
   * field intact and offers the lab's address as a link — never a redirect,
   * which would drop the visitor into a mail client they did not ask for.
   */
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
      // `context` distinguishes the two places this modal opens from — the
      // design-partner CTA and the closing panel.
      leadSource: `About: ${context}`,
      formData: {
        Organization: value("org") || "N/A",
        "What they're working on": value("note") || "N/A",
      },
    });

    setSending(false);

    if (result.ok) {
      setFirstName(submittedName.split(" ")[0]);
      setSent(true);
      return;
    }

    setError(result.message);
    setMailtoHref(
      leadMailto(SITE.email, `${context} (${value("org") || submittedName})`, [
        `Enquiry: ${context}`,
        "",
        `Name: ${submittedName}`,
        `Email: ${value("email")}`,
        `Phone: ${value("phone")}`,
        `Organization: ${value("org") || "N/A"}`,
        "",
        "What they're working on:",
        value("note") || "N/A",
      ])
    );
  };

  return (
    <>
      <button type="button" onClick={openDialog} className={className}>
        {label}
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${ids}-title`}
        onClose={() => setOpen(false)}
        // Clicking the backdrop closes: the dialog fills its own box, so a
        // click landing on the element itself came from outside the panel.
        onClick={(event) => {
          if (event.target === dialogRef.current) closeDialog();
        }}
        className="m-auto w-[min(92vw,520px)] rounded-[22px] border border-black/[0.14] bg-paper p-0 text-light-fg shadow-[0_40px_90px_-40px_rgb(0_0_0/0.6)] backdrop:bg-black/60 backdrop:backdrop-blur-[2px]"
      >
        <div className="p-[clamp(24px,3.5vw,36px)]">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2.5 inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
                <span
                  aria-hidden="true"
                  className="inline-block size-1.5 bg-brand"
                />
                {context}
              </p>
              <h2
                id={`${ids}-title`}
                className="text-[1.4rem] leading-tight font-semibold tracking-[-0.015em]"
              >
                {sent ? "Thanks, we're on it." : "Tell us where to start."}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Close"
              className="-mt-1 -mr-1 flex size-9 flex-none cursor-pointer items-center justify-center rounded-full border border-black/[0.14] text-light-muted transition-colors hover:border-brand hover:text-brand"
            >
              <span aria-hidden="true" className="text-base leading-none">
                ×
              </span>
            </button>
          </div>

          {sent ? (
            <div className="flex flex-col items-start gap-4">
              <p className="text-[0.92rem] leading-relaxed text-light-fg-2">
                Your mail client should have opened with the details ready to
                send{firstName && `, ${firstName}`}. If it didn&apos;t, write to
                us directly at{" "}
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
                onClick={closeDialog}
                className="cursor-pointer rounded-[10px] border border-black/20 px-4.5 py-2.5 font-mono text-[0.68rem] tracking-[0.1em] text-light-fg-2 transition-colors hover:border-brand hover:text-brand"
              >
                close →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
              <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
                <label
                  htmlFor={`${ids}-name`}
                  className="flex flex-col gap-2.25"
                >
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
                <label
                  htmlFor={`${ids}-email`}
                  className="flex flex-col gap-2.25"
                >
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label
                  htmlFor={`${ids}-phone`}
                  className="flex flex-col gap-2.25"
                >
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
                <label
                  htmlFor={`${ids}-org`}
                  className="flex flex-col gap-2.25"
                >
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

              <label htmlFor={`${ids}-note`} className="flex flex-col gap-2.25">
                <span className={LABEL}>What you&apos;re working on</span>
                <textarea
                  id={`${ids}-note`}
                  name="note"
                  rows={3}
                  placeholder="The decision, workflow, or question you'd want us on."
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
                  className="group flex cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-light-fg px-5.5 py-4 text-[0.92rem] font-semibold text-white transition-[background-color,box-shadow] duration-300 hover:bg-brand hover:shadow-[0_14px_34px_-14px_rgb(255_51_51/0.65)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-light-fg disabled:hover:shadow-none"
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
                  No login. A human replies within 48 hours.
                </p>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
