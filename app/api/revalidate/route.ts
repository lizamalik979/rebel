import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Cache-invalidation webhook called by the CMS after a publish.
 *
 * The careers pages fetch with `force-cache` and a 5-minute revalidate window,
 * so without this an editor's change would not appear on the live site for up
 * to five minutes. This drops the affected entries immediately; the TTL stays
 * as the backstop for a missed call.
 *
 * Tag names are the CMS's — `career-list`, `career-<slug>`, `careers-page` —
 * and must stay in step with careerTags() in the CMS and the tags passed to
 * fetch() in lib/careers-api.ts. A rename on one side silently stops
 * invalidating, which looks like "publishing is broken".
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  // Refuse rather than accept-everything when unconfigured: an open endpoint
  // lets anyone force cache churn on the site.
  if (!secret) {
    console.error("[revalidate] REVALIDATE_SECRET is not set; rejecting");
    return NextResponse.json(
      { success: false, message: "Revalidation is not configured." },
      { status: 500 }
    );
  }

  const provided = (req.headers.get("x-revalidate-secret") ?? "").trim();
  if (provided !== secret.trim()) {
    return NextResponse.json({ success: false, message: "Invalid secret." }, { status: 401 });
  }

  let tags: unknown;
  try {
    ({ tags } = await req.json());
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  if (!Array.isArray(tags) || tags.some((t) => typeof t !== "string")) {
    return NextResponse.json(
      { success: false, message: "`tags` must be an array of strings." },
      { status: 400 }
    );
  }

  // `{ expire: 0 }` rather than the recommended "max": the docs single out
  // webhooks from external systems that need immediate expiration, which is
  // exactly this. "max" is stale-while-revalidate, so an editor who just hit
  // Publish would still be served the old copy on their next visit.
  for (const tag of tags as string[]) revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ success: true, revalidated: tags, now: Date.now() });
}
