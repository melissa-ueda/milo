import type { Household } from "../entities/household";
import {
  cadenceDays,
  WEEKDAY_INDEX,
  type ShoppingDay,
} from "../taxonomy/cadence";
import { addDays, daysUntil } from "../values/iso-date";
import type { RunOutForecast } from "./run-out-forecast";

export type ShoppingWindow = {
  readonly nextShop: Date;
  readonly nextShopAfter: Date;
};

/**
 * The next expected shopping date and the one after it. If the household has a
 * usual weekday, use its next occurrence; otherwise assume roughly half a
 * cadence from now. Pure — `now` is supplied by the caller.
 */
export function shoppingWindow(
  now: Date,
  day: ShoppingDay,
  cadence: number,
): ShoppingWindow {
  const nextShop = new Date(now);
  nextShop.setHours(0, 0, 0, 0);

  if (day !== "no_usual_day") {
    const target = WEEKDAY_INDEX[day];
    let delta = target - now.getDay();
    if (delta <= 0) delta += 7;
    nextShop.setDate(now.getDate() + delta);
  } else {
    nextShop.setDate(now.getDate() + Math.max(1, Math.round(cadence / 2)));
  }

  const nextShopAfter = addDays(nextShop, cadence);
  return { nextShop, nextShopAfter };
}

export function shoppingWindowFor(
  household: Household,
  now: Date,
): ShoppingWindow {
  return shoppingWindow(now, household.day, cadenceDays(household.cadence));
}

export type NextShopLikelihood = {
  readonly likely: boolean;
  readonly confidence: number;
  readonly nextShop: Date;
};

/**
 * How likely the household is to shop at the next expected date, from how many
 * staples run out "soon". Pure port of the original `getNextShopLikelihood`.
 */
export function nextShopLikelihood(
  household: Household,
  forecasts: RunOutForecast[],
  now: Date,
): NextShopLikelihood {
  const { nextShop } = shoppingWindowFor(household, now);

  const soon = forecasts.filter((f) => {
    if (!f.predictedRunOutDate) return false;
    const until = daysUntil(f.predictedRunOutDate, now);
    return (
      until <= 3 ||
      new Date(f.predictedRunOutDate).getTime() <= nextShop.getTime()
    );
  });

  const confidence = soon.length > 0 ? Math.min(92, 60 + soon.length * 8) : 40;
  const likely =
    soon.length >= 2 || (household.day !== "no_usual_day" && soon.length >= 1);

  return { likely, confidence, nextShop };
}
