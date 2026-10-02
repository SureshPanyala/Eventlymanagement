import type { MetadataRoute } from "next";
import { listPublishedEvents } from "../lib/events";
import { absoluteUrl } from "../lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await listPublishedEvents({}, 1000).catch(() => []);
  return [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/events") },
    ...events.map((e) => ({ url: absoluteUrl(`/events/${e.id}`) })),
  ];
}
