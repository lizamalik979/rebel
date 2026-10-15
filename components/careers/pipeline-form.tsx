"use client";

import { useId, useState } from "react";

import { CAREERS } from "@/lib/careers";
import { SITE } from "@/lib/content";
import {
  CV_ACCEPT,
  submitApplication,
  uploadCv,
  validateCv,
  type UploadedCv,
} from "@/lib/application-api";

const FIELD =
  "min-w-0 rounded-[10px] border border-black/[0.12] bg-paper px-4 py-3.5 text-[0.88rem] text-light-fg outline-brand placeholder:text-light-faint";
const LABEL =
  "font-mono text-[0.6rem] tracking-[0.14em] text-light-muted-2 uppercase";

/**
 * Candidate pipeline signup.
 *
 * Records an application in the CMS with no role attached — the candidate is
 * naming a discipline, not answering a posting. It lands in the same Careers →
 * Applications list as the role forms, so nobody has to look in two places for
 * people who sent a CV, and it never inflates any single role's count.
 *
 * The CV uploads as soon as it is chosen; see components/careers/apply-form.
 */
export function PipelineForm() {
  const ids = useId();
  const [sent, setSent] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [cvName, setCvName] = useState("");
  const [cv, setCv] = useState<UploadedCv | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Upload as soon as a file is chosen, so submitting is instant. */
  const handleCvChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setCvName("");
      setCv(null);
      return;
    }

    const localError = validateCv(file);
    if (localError) {
      setCvName("");
      setCv(null);
      setError(localError);
      // Clear the input so choosing the same file again still fires onChange.
      event.target.value = "";
      return;
    }

    setError(null);
    setCvName(file.name);
    setUploading(true);

    const result = await uploadCv(file);
    setUploading(false);

    if (!result.ok) {
      setCvName("");
      setCv(null);
      setError(result.message);
      event.target.value = "";
      return;
    }
    setCv(result.cv);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    const submittedName = value("name");

    setSending(true);
    setError(null);

    const result = await submitApplication({
      name: submittedName,
      email: value("email"),
      phoneNo: value("phone"),
      // No roleSlug: this is the pipeline, so the discipline is the only thing
      // saying what the candidate does.
      discipline: value("discipline"),
      cv,
    });

    setSending(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setFirstName(submittedName.split(" ")[0]);
    setSent(true);
  };

  if (sent) {
    return (
      <div
        data-reveal="fade-left"
        data-reveal-delay="1"
        className="rounded-[22px] border border-black/[0.12] bg-paper p-[clamp(26px,3vw,38px)]"
      >
        <div className="flex flex-col items-start gap-4 px-1 py-5">
          <p className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 bg-brand"
            />
            Added to the pipeline
          </p>
          <h3 className="text-2xl font-semibold tracking-[-0.015em]">
            Thanks{firstName && `, ${firstName}`}, you&apos;re in.
          </h3>
          <p className="text-[0.92rem] leading-relaxed text-light-fg-2">
            You&apos;re in the pipeline{cvName && `, CV attached (${cvName})`}. A
            human reviews every profile. If something changes in the meantime,
            write to us at{" "}
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
            edit details →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-reveal="fade-left"
      data-reveal-delay="1"
      className="rounded-[22px] border border-black/[0.12] bg-paper p-[clamp(26px,3vw,38px)]"
    >
      <p className="mb-7 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
        Join The Workforce Pipeline
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5.5">
        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
          <label htmlFor={`${ids}-name`} className="flex flex-col gap-2.25">
            <span className={LABEL}>Full Name *</span>
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
            <span className={LABEL}>Email *</span>
            <input
              id={`${ids}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="ada@email.com"
              className={FIELD}
            />
          </label>
        </div>

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

        <label htmlFor={`${ids}-discipline`} className="flex flex-col gap-2.25">
          <span className={LABEL}>Discipline</span>
          <select
            id={`${ids}-discipline`}
            name="discipline"
            defaultValue={CAREERS.pipeline.disciplines[0]}
            className={FIELD}
          >
            {CAREERS.pipeline.disciplines.map((discipline) => (
              <option key={discipline}>{discipline}</option>
            ))}
          </select>
        </label>

        <label
          htmlFor={`${ids}-cv`}
          className="flex cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-dashed border-black/20 bg-paper px-4.5 py-4 transition-colors hover:border-brand"
        >
          <span className="min-w-0 truncate text-[0.84rem] text-light-muted">
            {uploading
              ? `Uploading ${cvName}…`
              : cvName || "Upload CV / portfolio (PDF, max 10MB)"}
          </span>
          <span className="flex-none font-mono text-[0.6rem] tracking-[0.1em] text-brand uppercase">
            {uploading ? "Working" : cv ? "Attached ✓" : cvName ? "Change" : "Choose file"}
          </span>
          <input
            id={`${ids}-cv`}
            name="cv"
            type="file"
            accept={CV_ACCEPT}
            onChange={handleCvChange}
            className="hidden"
          />
        </label>

        <div className="mt-1 flex flex-col gap-3.5">
          {error && (
            <p role="alert" className="text-[0.82rem] leading-snug text-brand">
              {error}
            </p>
          )}
          <button
            type="submit"
            // Blocked while the CV is still uploading, or the profile would be
            // saved without the file the candidate chose.
            disabled={sending || uploading}
            className="group flex cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-brand px-5.5 py-4 text-[0.92rem] font-semibold text-white transition-colors duration-300 hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand"
          >
            [ {uploading ? "Uploading CV…" : sending ? "Sending…" : "Join The Pipeline"}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
            ]
          </button>
          <p className="text-center font-mono text-[0.6rem] tracking-[0.06em] text-light-faint">
            No spam. Unsubscribe anytime. A human reviews every profile.
          </p>
        </div>
      </form>
    </div>
  );
}
