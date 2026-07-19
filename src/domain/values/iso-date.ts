/**
 * Pure date helpers. The domain never reads the clock itself — callers pass
 * `now` in (via the `Clock` port at the edges). Dates are ISO 8601 strings;
 * `IsoDate` is the date-only (`YYYY-MM-DD`) form.
 */
export type IsoDateTime = string;
export type IsoDate = string;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Strip any time component: `"2026-07-19T10:00Z"` → `"2026-07-19"`. */
export function toDateOnly(iso: IsoDateTime): IsoDate {
  return iso.split("T")[0];
}

export function parseDate(iso: string): Date {
  return new Date(iso);
}

export function isValidDate(iso: string): boolean {
  return !Number.isNaN(new Date(iso).getTime());
}

/** Whole days from `a` to `b` (b − a), using local midnight of each date. */
export function daysBetween(a: IsoDateTime, b: IsoDateTime): number {
  const start = new Date(toDateOnly(a)).getTime();
  const end = new Date(toDateOnly(b)).getTime();
  return Math.round((end - start) / MS_PER_DAY);
}

/** Whole days elapsed from `date` up to `now` (floor). */
export function daysSince(date: IsoDateTime, now: Date): number {
  return Math.floor((now.getTime() - new Date(date).getTime()) / MS_PER_DAY);
}

/** Whole days remaining from `now` until `date` (ceil). */
export function daysUntil(date: IsoDateTime, now: Date): number {
  return Math.ceil((new Date(date).getTime() - now.getTime()) / MS_PER_DAY);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}
