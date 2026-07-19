import { describe, expect, it } from "vitest";
import { createUseCases } from "./index";
import {
  fakeAI,
  fakeReceiptRepo,
  fakeSettingsRepo,
  fakeStapleRepo,
  fixedClock,
  makeDeps,
  seqIds,
  type ScriptableAI,
} from "./test-fakes";
import type { ReviewLine } from "@/src/domain/entities/receipt";
import { fromMajor } from "@/src/domain/values/money";

function milkLine(price = 1.5): ReviewLine {
  return {
    id: "r1",
    name: "VOLLMILCH",
    normalizedName: "Whole milk",
    type: "milk",
    category: "dairy",
    quantity: 1,
    unit: "L",
    price: fromMajor(price),
    confidence: 90,
  };
}

const IMAGE = new Blob(["x"], { type: "image/jpeg" });

describe("save → delete round-trip (rhythm reversal)", () => {
  it("restores staple stats to their pre-receipt state", async () => {
    const staples = fakeStapleRepo();
    const deps = makeDeps({
      staples,
      receipts: fakeReceiptRepo(),
      ids: seqIds(),
    });
    const uc = createUseCases(deps);

    await uc.saveReceipt({
      store: "A",
      purchaseDate: "2026-07-05",
      image: IMAGE,
      lines: [milkLine()],
    });
    await uc.saveReceipt({
      store: "A",
      purchaseDate: "2026-07-12",
      image: IMAGE,
      lines: [milkLine()],
    });

    const before = structuredClone([...staples.rows.values()]);
    const receipts = await deps.receipts.getAll();
    const third = receipts[0]; // newest

    // A third purchase then its deletion must cancel out.
    await uc.saveReceipt({
      store: "A",
      purchaseDate: "2026-07-19",
      image: IMAGE,
      lines: [milkLine()],
    });
    const receiptsAfterThird = await deps.receipts.getAll();
    const newest = receiptsAfterThird.find((r) => r.date === "2026-07-19")!;
    await uc.deleteReceipt(newest.id);

    const after = [...staples.rows.values()];
    expect(after).toHaveLength(1);
    expect(after[0].rhythm).toEqual(before[0].rhythm);
    expect(third).toBeDefined();
  });

  it("removes a staple entirely when its only receipt is deleted", async () => {
    const staples = fakeStapleRepo();
    const deps = makeDeps({
      staples,
      receipts: fakeReceiptRepo(),
      ids: seqIds(),
    });
    const uc = createUseCases(deps);

    await uc.saveReceipt({
      store: "A",
      purchaseDate: "2026-07-05",
      image: IMAGE,
      lines: [milkLine()],
    });
    expect(staples.rows.size).toBe(1);

    const [receipt] = await deps.receipts.getAll();
    await uc.deleteReceipt(receipt.id);
    expect(staples.rows.size).toBe(0);
  });
});

describe("recomputeForecasts is read-only", () => {
  it("never writes to the staple store", async () => {
    const staples = fakeStapleRepo();
    const deps = makeDeps({
      staples,
      receipts: fakeReceiptRepo(),
      ids: seqIds(),
    });
    const uc = createUseCases(deps);
    await uc.saveReceipt({
      store: "A",
      purchaseDate: "2026-07-05",
      image: IMAGE,
      lines: [milkLine()],
    });
    await uc.saveReceipt({
      store: "A",
      purchaseDate: "2026-07-12",
      image: IMAGE,
      lines: [milkLine()],
    });

    const snapshot = JSON.stringify([...staples.rows.values()]);
    const forecasts = await uc.recomputeForecasts();
    expect(forecasts.length).toBe(1);
    expect(JSON.stringify([...staples.rows.values()])).toBe(snapshot);
  });
});

describe("hybrid AI / local fallback", () => {
  async function seed(ai: ScriptableAI) {
    const staples = fakeStapleRepo();
    const deps = makeDeps({
      staples,
      receipts: fakeReceiptRepo(),
      ids: seqIds(),
      ai,
      settings: fakeSettingsRepo({ geminiApiKey: "k" }),
      clock: fixedClock("2026-07-19T12:00:00.000Z"),
    });
    const uc = createUseCases(deps);
    await uc.saveReceipt({
      store: "A",
      purchaseDate: "2026-07-05",
      image: IMAGE,
      lines: [milkLine()],
    });
    await uc.saveReceipt({
      store: "A",
      purchaseDate: "2026-07-12",
      image: IMAGE,
      lines: [milkLine()],
    });
    return uc;
  }

  it("uses AI results when every staple round-trips", async () => {
    const ai = fakeAI();
    ai.configured = true;
    ai.predictions = [
      {
        name: "Whole milk",
        averageConsumptionDays: 42,
        predictedRunOutDate: "2026-08-01",
        confidence: 88,
        selected: true,
      },
    ];
    const uc = await seed(ai);
    const forecasts = await uc.recomputeForecasts();
    expect(forecasts[0].averageConsumptionDays).toBe(42);
    expect(forecasts[0].confidence).toBe(88);
  });

  it("falls back to the local predictor when the AI throws", async () => {
    const ai = fakeAI();
    ai.configured = true;
    ai.predictions = null; // predict() throws
    const uc = await seed(ai);
    const forecasts = await uc.recomputeForecasts();
    // Local path: 2 weekly purchases → a sane, non-42 average.
    expect(forecasts[0].averageConsumptionDays).not.toBe(42);
    expect(forecasts[0].learning).toBe(false);
    expect(ai.predictCalls).toBeGreaterThan(0);
  });

  it("falls back when the AI omits a staple (incomplete set)", async () => {
    const ai = fakeAI();
    ai.configured = true;
    ai.predictions = []; // no match for the milk staple
    const uc = await seed(ai);
    const forecasts = await uc.recomputeForecasts();
    expect(forecasts[0].averageConsumptionDays).not.toBe(42);
  });
});
