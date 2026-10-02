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

/**
 * Event times are stored as the venue's wall-clock time pinned to UTC and there is no
 * per-event timezone column, so startDate is emitted as local date-time with NO offset
 * (exactly what the page shows) rather than claiming a "Z" instant that would be wrong
 * for any venue outside UTC.
 */
export function wallClockIso(d: Date | string): string {
  return new Date(d).toISOString().slice(0, 16);
}

/** Event markup, only for published events created by real organizers (not seeded samples). */
export function eventSchema(event: EventRow): Record<string, unknown> | null {
  if (event.is_sample || event.status !== "published") return null;
  const url = absoluteUrl(`/events/${event.id}`);
  const seatsLeft = Math.max(0, event.capacity - event.seats_taken);
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
    offers: {
      "@type": "Offer",
      url,
      price: (event.price_cents / 100).toFixed(2).replace(/\.00$/, ""),
      priceCurrency: "USD",
      availability: seatsLeft === 0 ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
  };
}
