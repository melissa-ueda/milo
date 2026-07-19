import type { Money } from "@/src/domain/values/money";
import { toMajor } from "@/src/domain/values/money";

/** Presentation-only formatting: the single home for €, en-US dates, and copy. */

const CURRENCY_SYMBOL: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
};

export function formatMoney(value: Money): string {
  const symbol = CURRENCY_SYMBOL[value.currency] ?? "";
  return `${symbol}${toMajor(value).toFixed(2)}`;
}

/** e.g. "Jul 5" */
export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** e.g. "Monday" */
export function formatWeekday(iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

/** e.g. "Sunday, July 19" — used for the home greeting date. */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
