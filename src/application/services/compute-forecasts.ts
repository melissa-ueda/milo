import type { Deps } from "../deps";
import type { PredictionInput } from "../ports/ai-provider";
import {
  forecastLocally,
  sortForecasts,
  type StapleHistory,
} from "@/src/domain/forecast/local-predictor";
import type {
  RhythmUpdate,
  RunOutForecast,
} from "@/src/domain/forecast/run-out-forecast";
import { shoppingWindowFor } from "@/src/domain/forecast/shopping-window";
import { isValidDate, toDateOnly } from "@/src/domain/values/iso-date";
import { matchKeyFor } from "@/src/domain/values/staple-id";

export type ForecastResult = {
  forecasts: RunOutForecast[];
  rhythmUpdates: RhythmUpdate[];
};

/**
 * The single hybrid forecasting routine shared by the read-only
 * `recomputeForecasts` and the persisting `learnFromHistory`. It computes but
 * never writes — the caller decides whether to persist `rhythmUpdates`.
 *
 * Strategy: compute deterministic local forecasts always; if the AI is
 * configured and every staple round-trips with a valid run-out date, use the AI
 * result; otherwise fall back to local.
 */
export async function computeForecasts(deps: Deps): Promise<ForecastResult> {
  const { household } = await deps.settings.get();
  const staples = await deps.staples.getAll();
  const receipts = await deps.receipts.getAll();
  const lines = await deps.receipts.getAllLines();
  const now = deps.clock.now();

  const dateByReceipt = new Map(
    receipts.map((r) => [r.id, toDateOnly(r.date)]),
  );
  const datesByKey = new Map<string, Set<string>>();
  for (const line of lines) {
    const date = dateByReceipt.get(line.receiptId);
    if (!date) continue;
    const key = matchKeyFor(line.name);
    if (!datesByKey.has(key)) datesByKey.set(key, new Set());
    datesByKey.get(key)!.add(date);
  }

  const datesFor = (matchKey: string): string[] =>
    Array.from(datesByKey.get(matchKey) ?? []);

  const histories: StapleHistory[] = staples.map((staple) => ({
    staple,
    purchaseDates: datesFor(staple.matchKey),
  }));
  const local = forecastLocally(histories, household);

  if (deps.ai.isConfigured() && staples.length > 0) {
    const { nextShopAfter } = shoppingWindowFor(household, now);
    const inputs: PredictionInput[] = staples.map((s) => ({
      name: s.name,
      type: s.type,
      category: s.category,
      purchaseDates: datesFor(s.matchKey),
      lastPurchase: s.rhythm.lastPurchase,
      purchaseCount: s.rhythm.purchaseCount,
    }));

    try {
      const predictions = await deps.ai.predict(household, inputs, {
        today: now.toISOString(),
        nextShop: nextShopAfter.toISOString(),
      });
      const byKey = new Map(predictions.map((p) => [matchKeyFor(p.name), p]));
      const matched = staples.map((s) => ({
        staple: s,
        prediction: byKey.get(s.matchKey),
      }));

      const complete = matched.every(
        ({ prediction }) =>
          prediction && isValidDate(prediction.predictedRunOutDate),
      );
      if (complete) {
        const forecasts: RunOutForecast[] = [];
        const rhythmUpdates: RhythmUpdate[] = [];
        for (const { staple, prediction } of matched) {
          const p = prediction!;
          forecasts.push({
            stapleId: staple.id,
            name: staple.name,
            type: staple.type,
            category: staple.category,
            averageConsumptionDays: p.averageConsumptionDays,
            lastPurchase: staple.rhythm.lastPurchase,
            predictedRunOutDate: new Date(p.predictedRunOutDate).toISOString(),
            confidence: p.confidence,
            selected: p.selected,
            learning: false,
          });
          rhythmUpdates.push({
            stapleId: staple.id,
            avgDays: p.averageConsumptionDays,
          });
        }
        return { forecasts: sortForecasts(forecasts), rhythmUpdates };
      }
    } catch {
      // Any AI failure or incomplete set → deterministic local fallback.
    }
  }

  return local;
}
