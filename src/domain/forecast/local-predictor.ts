import type { Household } from "../entities/household";
import type { PantryStaple } from "../entities/pantry-staple";
import { addDays } from "../values/iso-date";
import { priorInterval } from "./household-prior";
import type { RhythmUpdate, RunOutForecast } from "./run-out-forecast";

/** A staple paired with the distinct dates it was purchased on. */
export type StapleHistory = {
  readonly staple: PantryStaple;
  /** Distinct purchase dates as `YYYY-MM-DD` (any order). */
  readonly purchaseDates: string[];
};

export type LocalForecast = {
  readonly forecasts: RunOutForecast[];
  readonly rhythmUpdates: RhythmUpdate[];
};

/**
 * Deterministic, household-aware forecaster. For each staple: blend the
 * observed purchase-interval average with the category prior (credibility
 * weighted by how much history exists), derive a run-out date and a
 * confidence from interval consistency. Staples with < 2 distinct purchase
 * dates are returned as "learning". Pure — writes nothing; `rhythmUpdates`
 * lists the learned averages a caller may later persist.
 */
export function forecastLocally(
  histories: StapleHistory[],
  household: Household,
): LocalForecast {
  const forecasts: RunOutForecast[] = [];
  const rhythmUpdates: RhythmUpdate[] = [];

  for (const { staple, purchaseDates } of histories) {
    const uniqueDates = Array.from(new Set(purchaseDates))
      .map((d) => new Date(d))
      .sort((a, b) => a.getTime() - b.getTime());

    if (uniqueDates.length < 2) {
      rhythmUpdates.push({ stapleId: staple.id, avgDays: null });
      forecasts.push({
        stapleId: staple.id,
        name: staple.name,
        type: staple.type,
        category: staple.category,
        averageConsumptionDays: 0,
        lastPurchase: staple.rhythm.lastPurchase,
        predictedRunOutDate: "",
        confidence: 30,
        selected: staple.selected,
        learning: true,
      });
      continue;
    }

    const intervals: number[] = [];
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const diffDays = Math.round(
        (uniqueDates[i + 1].getTime() - uniqueDates[i].getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (diffDays > 0) intervals.push(diffDays);
    }
    if (intervals.length === 0) continue;

    const avgObserved =
      intervals.reduce((sum, v) => sum + v, 0) / intervals.length;
    const prior = priorInterval(staple.category, household);
    const w = Math.min(0.9, intervals.length / 5);
    const roundedAvg = Math.round(w * avgObserved + (1 - w) * prior);

    rhythmUpdates.push({ stapleId: staple.id, avgDays: roundedAvg });

    const lastPurchaseDate = new Date(staple.rhythm.lastPurchase);
    const runOutDate = addDays(lastPurchaseDate, roundedAvg);

    const m = intervals.length;
    let confidence = 40;
    if (m === 2) confidence = 55;
    else if (m === 3) confidence = 70;
    else if (m === 4) confidence = 80;
    else if (m >= 5) confidence = 90;

    const variance =
      intervals.reduce((sum, v) => sum + (v - avgObserved) ** 2, 0) / m;
    const cv = Math.sqrt(variance) / avgObserved;
    if (cv <= 0.15) {
      confidence = Math.min(98, confidence + 8);
    } else if (cv > 0.4) {
      confidence = Math.max(
        10,
        confidence - Math.min(25, Math.round((cv - 0.4) * 50)),
      );
    }

    forecasts.push({
      stapleId: staple.id,
      name: staple.name,
      type: staple.type,
      category: staple.category,
      averageConsumptionDays: roundedAvg,
      lastPurchase: staple.rhythm.lastPurchase,
      predictedRunOutDate: runOutDate.toISOString(),
      confidence,
      selected: staple.selected,
      learning: false,
    });
  }

  return {
    forecasts: sortForecasts(forecasts),
    rhythmUpdates,
  };
}

/** Sort by predicted run-out ascending; learning items (no date) sort last. */
export function sortForecasts(forecasts: RunOutForecast[]): RunOutForecast[] {
  return [...forecasts].sort((a, b) => {
    const ta = a.predictedRunOutDate
      ? new Date(a.predictedRunOutDate).getTime()
      : Infinity;
    const tb = b.predictedRunOutDate
      ? new Date(b.predictedRunOutDate).getTime()
      : Infinity;
    return ta - tb;
  });
}
