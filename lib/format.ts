// Event times are stored as TIMESTAMPTZ and treated as the venue's wall-clock
// time in UTC, so every formatter pins timeZone "UTC" to render them as entered.
const TZ = "UTC";

export function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: TZ });
}

export function formatShortDate(d: Date | string): { month: string; day: string } {
  const date = new Date(d);
  return {
    month: date.toLocaleDateString("en-US", { month: "short", timeZone: TZ }).toUpperCase(),
    day: date.toLocaleDateString("en-US", { day: "numeric", timeZone: TZ }),
  };
}

export function formatTime(d: Date | string): string {
  return new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ });
}

export function formatPrice(cents: number): string {
  if (!cents) return "Free";
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: cents % 100 ? 2 : 0 });
}

/** "2026-10-14" and "09:00" parts for form inputs. */
export function toDateTimeParts(d: Date | string): { date: string; time: string } {
  const iso = new Date(d).toISOString();
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) };
}
