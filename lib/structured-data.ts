import type { EventRow } from "@/lib/events";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export function siteIdentitySchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${absoluteUrl("/")}#organization`, name: SITE_NAME, url: absoluteUrl("/") },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        name: SITE_NAME,
        url: absoluteUrl("/"),
        publisher: { "@id": `${absoluteUrl("/")}#organization` },
      },
    ],
  };
}

export function eventBreadcrumbSchema(event: Pick<EventRow, "id" | "title">): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Events", item: absoluteUrl("/events") },
      { "@type": "ListItem", position: 3, name: event.title, item: absoluteUrl(`/events/${event.id}`) },
    ],
  };
}

/** All Evently events take place in Los Angeles. */
const EVENT_TIME_ZONE = "America/Los_Angeles";

function offsetMinutesAt(instantMs: number): number {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: EVENT_TIME_ZONE, timeZoneName: "longOffset" })
    .formatToParts(new Date(instantMs))
    .find((p) => p.type === "timeZoneName")?.value;
  const m = name?.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return 0;
  return (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
}

/**
 * Event times are stored as the venue's wall-clock time pinned to UTC (what the page
 * shows), so the UTC fields are Los Angeles local time. Emit that wall-clock time with
 * the Los Angeles offset in effect on that date (-07:00 in summer, -08:00 in winter).
 */
export function wallClockIso(d: Date | string): string {
  const wallMs = new Date(d).getTime();
  const offset = offsetMinutesAt(wallMs - offsetMinutesAt(wallMs) * 60_000);
  const abs = Math.abs(offset);
  const sign = offset < 0 ? "-" : "+";
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${new Date(wallMs).toISOString().slice(0, 19)}${sign}${hh}:${mm}`;
}

/** Event markup, only for published events created by real organizers (not seeded samples). */
export function eventSchema(event: EventRow): Record<string, unknown> | null {
  if (event.is_sample || event.status !== "published") return null;
  const url = absoluteUrl(`/events/${event.id}`);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    url,
    startDate: wallClockIso(event.starts_at),
    location: { "@type": "Place", name: event.location, address: event.location },
    ...(event.banner_url ? { image: [absoluteUrl(event.banner_url)] } : {}),
    ...(event.description ? { description: event.description } : {}),
    organizer: { "@type": "Person", name: event.organizer_name },
  };
}
