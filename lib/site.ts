export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.RENDER_EXTERNAL_URL ?? "https://evently-4e2ce648.onrender.com";
export const SITE_NAME = "Evently";

/** Absolute URL for a root-relative path (or pass-through for an absolute one). */
export function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, SITE_URL).toString();
}
