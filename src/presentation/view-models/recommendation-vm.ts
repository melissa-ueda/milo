import type { RunOutForecast } from "@/src/domain/forecast/run-out-forecast";
import { emojiForType } from "@/src/domain/taxonomy/emoji";
import { daysSince, daysUntil } from "@/src/domain/values/iso-date";
import type { StapleId } from "@/src/domain/values/staple-id";
import { formatWeekday } from "../labels/format";

/** The display model for a recommendation / pantry / shopping-list item. */
export type RecommendationView = {
  stapleId?: StapleId;
  name: string;
  emoji: string;
  amount: string;
  remaining: string;
  due: string;
  confidence: number;
  cadence: string;
  status: "Soon" | "This week" | "Later";
  selected: boolean;
  percentRemaining: number;
  daysSinceLastPurchase: number;
};

/**
 * Map a forecast to its display item. Pure; all English copy and date
 * formatting live here (presentation), not in the domain/predictor.
 * A faithful port of the old `predictionToDisplayItem`.
 */
export function recommendationView(
  forecast: RunOutForecast,
  now: Date,
): RecommendationView {
  const learning = forecast.learning || !forecast.predictedRunOutDate;
  const until = learning ? 0 : daysUntil(forecast.predictedRunOutDate, now);
  const avg = forecast.averageConsumptionDays;

  let status: RecommendationView["status"] = "Later";
  if (!learning) {
    if (until <= 2) status = "Soon";
    else if (until <= 7) status = "This week";
  }

  const percentRemaining = learning
    ? 100
    : Math.max(0, Math.min(100, Math.round((Math.max(0, until) / avg) * 100)));

  return {
    stapleId: forecast.stapleId,
    name: forecast.name,
    emoji: emojiForType(forecast.type),
    amount: "1",
    remaining: learning
      ? "Newly added — learning your rhythm"
      : until <= 0
        ? "Likely empty"
        : `About ${Math.max(1, Math.round((1 - until / avg) * 100))}% used`,
    due: learning
      ? "Still learning"
      : until <= 0
        ? "Now"
        : formatWeekday(forecast.predictedRunOutDate),
    confidence: forecast.confidence,
    cadence: learning
      ? "Need another purchase to predict"
      : `Usually every ${avg} days`,
    status,
    selected: forecast.selected,
    percentRemaining,
    daysSinceLastPurchase: daysSince(forecast.lastPurchase, now),
  };
}
