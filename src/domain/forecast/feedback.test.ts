import { describe, expect, it } from "vitest";
import type { ConsumptionRhythm } from "../values/consumption-rhythm";
import { applyFeedback } from "./feedback";

const NOW = new Date("2026-07-19T00:00:00Z");

describe("applyFeedback", () => {
  it("still_have lengthens the interval by ~15% (min +1)", () => {
    const rhythm: ConsumptionRhythm = {
      avgDays: 10,
      lastPurchase: "2026-07-10",
      purchaseCount: 3,
    };
    expect(applyFeedback(rhythm, "still_have", NOW).avgDays).toBe(12);
  });

  it("still_have on a small interval still moves by at least 1 day", () => {
    const rhythm: ConsumptionRhythm = {
      avgDays: 4,
      lastPurchase: "2026-07-10",
      purchaseCount: 3,
    };
    expect(applyFeedback(rhythm, "still_have", NOW).avgDays).toBe(5);
  });

  it("ran_out folds the elapsed interval into the mean and counts it", () => {
    // last purchase 9 days ago, avg 7, count 3 → (7*3 + 9) / 4 = 7.5 → 8
    const rhythm: ConsumptionRhythm = {
      avgDays: 7,
      lastPurchase: "2026-07-10",
      purchaseCount: 3,
    };
    const next = applyFeedback(rhythm, "ran_out", NOW);
    expect(next.avgDays).toBe(8);
    expect(next.purchaseCount).toBe(4);
  });

  it("ignore resets the learned rhythm", () => {
    const rhythm: ConsumptionRhythm = {
      avgDays: 7,
      lastPurchase: "2026-07-10",
      purchaseCount: 3,
    };
    const next = applyFeedback(rhythm, "ignore", NOW);
    expect(next.avgDays).toBeNull();
    expect(next.purchaseCount).toBe(0);
  });
});
