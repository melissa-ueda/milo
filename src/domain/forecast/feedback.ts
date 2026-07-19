import { daysSince } from "../values/iso-date";
import type { ConsumptionRhythm } from "../values/consumption-rhythm";

/** Kinds of correction a user can give on a forecast. */
export type FeedbackKind = "still_have" | "ran_out" | "ignore";

/**
 * Apply a user correction to a staple's learned rhythm. Pure — returns the new
 * rhythm; persistence and re-forecasting happen in the use-case.
 *
 * - `still_have`: forecast was too eager → lengthen the interval ~15%.
 * - `ran_out`: the elapsed time since last purchase is a real observed
 *   interval → fold it into the running mean and count it.
 * - `ignore`: forget what we learned (reset).
 */
export function applyFeedback(
  rhythm: ConsumptionRhythm,
  kind: FeedbackKind,
  now: Date,
): ConsumptionRhythm {
  switch (kind) {
    case "still_have": {
      const current = rhythm.avgDays || 7;
      const avgDays = Math.max(current + 1, Math.round(current * 1.15));
      return { ...rhythm, avgDays };
    }
    case "ran_out": {
      const elapsed = Math.max(1, daysSince(rhythm.lastPurchase, now));
      const current = rhythm.avgDays || elapsed;
      const avgDays = Math.round(
        (current * rhythm.purchaseCount + elapsed) / (rhythm.purchaseCount + 1),
      );
      return { ...rhythm, avgDays, purchaseCount: rhythm.purchaseCount + 1 };
    }
    case "ignore":
      return { ...rhythm, avgDays: null, purchaseCount: 0 };
  }
}
