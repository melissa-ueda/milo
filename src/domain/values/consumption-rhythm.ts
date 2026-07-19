import type { IsoDateTime } from "./iso-date";

/**
 * The learned usage pattern of a `PantryStaple`: how often it's consumed, when
 * it was last bought, and how many purchases we've seen. `avgDays` is `null`
 * until there's enough history to estimate a rate ("still learning").
 */
export type ConsumptionRhythm = {
  readonly avgDays: number | null;
  readonly lastPurchase: IsoDateTime;
  readonly purchaseCount: number;
};

export function newRhythm(lastPurchase: IsoDateTime): ConsumptionRhythm {
  return { avgDays: null, lastPurchase, purchaseCount: 1 };
}

export function isLearning(rhythm: ConsumptionRhythm): boolean {
  return (
    rhythm.avgDays === null || rhythm.avgDays <= 0 || rhythm.purchaseCount < 2
  );
}
