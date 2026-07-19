import { describe, expect, it } from "vitest";
import { defaultHousehold } from "../entities/household";
import type { PantryStaple } from "../entities/pantry-staple";
import { asStapleId } from "../values/staple-id";
import { forecastLocally, type StapleHistory } from "./local-predictor";

function staple(overrides: Partial<PantryStaple> = {}): PantryStaple {
  return {
    id: asStapleId("s1"),
    name: "Whole milk",
    matchKey: "whole milk",
    type: "milk",
    category: "dairy",
    rhythm: { avgDays: null, lastPurchase: "2026-07-10", purchaseCount: 3 },
    selected: false,
    ...overrides,
  };
}

describe("forecastLocally", () => {
  it("marks a staple with < 2 purchase dates as learning and nulls its average", () => {
    const histories: StapleHistory[] = [
      { staple: staple(), purchaseDates: ["2026-07-10"] },
    ];
    const { forecasts, rhythmUpdates } = forecastLocally(
      histories,
      defaultHousehold,
    );

    expect(forecasts).toHaveLength(1);
    expect(forecasts[0].learning).toBe(true);
    expect(forecasts[0].predictedRunOutDate).toBe("");
    expect(forecasts[0].confidence).toBe(30);
    expect(rhythmUpdates[0]).toEqual({
      stapleId: asStapleId("s1"),
      avgDays: null,
    });
  });

  it("blends observed intervals with the prior and derives a run-out date", () => {
    // 4 purchases exactly 7 days apart → observed avg 7, high consistency.
    const dates = ["2026-06-28", "2026-07-05", "2026-07-12", "2026-07-19"];
    const histories: StapleHistory[] = [
      {
        staple: staple({
          rhythm: {
            avgDays: null,
            lastPurchase: "2026-07-19",
            purchaseCount: 4,
          },
        }),
        purchaseDates: dates,
      },
    ];
    const { forecasts, rhythmUpdates } = forecastLocally(
      histories,
      defaultHousehold,
    );

    const f = forecasts[0];
    expect(f.learning).toBe(false);
    // 3 intervals of 7 → w = 3/5 = 0.6; prior for dairy (default household) is
    // deterministic; blended avg stays in a sensible band and is a whole number.
    expect(f.averageConsumptionDays).toBeGreaterThanOrEqual(5);
    expect(f.averageConsumptionDays).toBeLessThanOrEqual(9);
    // Perfectly consistent intervals (cv <= 0.15) get a confidence bump.
    expect(f.confidence).toBeGreaterThanOrEqual(70);
    expect(rhythmUpdates[0].avgDays).toBe(f.averageConsumptionDays);
    // Run-out is lastPurchase + avg days.
    const expected = new Date("2026-07-19");
    expected.setDate(expected.getDate() + f.averageConsumptionDays);
    expect(f.predictedRunOutDate).toBe(expected.toISOString());
  });

  it("preserves the staple's selected flag", () => {
    const dates = ["2026-07-05", "2026-07-12"];
    const histories: StapleHistory[] = [
      {
        staple: staple({
          selected: true,
          rhythm: {
            avgDays: null,
            lastPurchase: "2026-07-12",
            purchaseCount: 2,
          },
        }),
        purchaseDates: dates,
      },
    ];
    const { forecasts } = forecastLocally(histories, defaultHousehold);
    expect(forecasts[0].selected).toBe(true);
  });
});
