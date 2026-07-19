import { describe, expect, it } from "vitest";
import { defaultHousehold } from "../entities/household";
import { shoppingWindow, nextShopLikelihood } from "./shopping-window";
import type { RunOutForecast } from "./run-out-forecast";
import { asStapleId } from "../values/staple-id";

// 2026-07-19 is a Sunday.
const NOW = new Date("2026-07-19T12:00:00Z");

describe("shoppingWindow", () => {
  it("finds the next occurrence of the usual weekday", () => {
    const { nextShop, nextShopAfter } = shoppingWindow(NOW, "friday", 7);
    expect(nextShop.getDay()).toBe(5); // Friday
    expect(
      Math.round((nextShopAfter.getTime() - nextShop.getTime()) / 86400000),
    ).toBe(7);
  });

  it("uses half a cadence when there is no usual day", () => {
    const { nextShop } = shoppingWindow(NOW, "no_usual_day", 10);
    const delta = Math.round(
      (nextShop.getTime() - new Date("2026-07-19").getTime()) / 86400000,
    );
    expect(delta).toBe(5);
  });
});

function forecast(overrides: Partial<RunOutForecast>): RunOutForecast {
  return {
    stapleId: asStapleId("s"),
    name: "x",
    type: "milk",
    category: "dairy",
    averageConsumptionDays: 7,
    lastPurchase: "2026-07-12",
    predictedRunOutDate: "2026-07-20T00:00:00.000Z",
    confidence: 70,
    selected: true,
    learning: false,
    ...overrides,
  };
}

describe("nextShopLikelihood", () => {
  it("is likely when two staples run out soon", () => {
    const result = nextShopLikelihood(
      defaultHousehold,
      [forecast({}), forecast({ stapleId: asStapleId("s2") })],
      NOW,
    );
    expect(result.likely).toBe(true);
    expect(result.confidence).toBeGreaterThan(60);
  });

  it("ignores learning items with no run-out date", () => {
    const result = nextShopLikelihood(
      defaultHousehold,
      [forecast({ predictedRunOutDate: "", learning: true })],
      NOW,
    );
    // default household has a usual day (friday) → 1 soon item would make it
    // likely, but a learning item is not "soon".
    expect(result.likely).toBe(false);
  });
});
