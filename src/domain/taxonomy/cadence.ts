/**
 * Household rhythm vocabularies. All values are stable machine CODES; display
 * labels live in `src/presentation/labels`. Business logic (the forecaster)
 * switches on these codes, never on English text.
 */

export const CADENCE_CODES = [
  "seven_days",
  "ten_days",
  "fourteen_days",
  "variable",
] as const;
export type Cadence = (typeof CADENCE_CODES)[number];

export const SHOPPING_DAY_CODES = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "no_usual_day",
] as const;
export type ShoppingDay = (typeof SHOPPING_DAY_CODES)[number];

export const COOKING_TIME_CODES = [
  "most_days",
  "a_few_days",
  "rarely",
] as const;
export type CookingTime = (typeof COOKING_TIME_CODES)[number];

export const FOOD_PREFERENCE_CODES = [
  "no_preference",
  "vegetarian",
  "vegan",
  "gluten_free",
  "family_friendly",
] as const;
export type FoodPreference = (typeof FOOD_PREFERENCE_CODES)[number];

/** Weekday code → JS `Date.getDay()` index (Sunday = 0). */
export const WEEKDAY_INDEX: Record<
  Exclude<ShoppingDay, "no_usual_day">,
  number
> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

/** Typical days between shopping trips for a cadence code. */
export function cadenceDays(cadence: Cadence): number {
  switch (cadence) {
    case "seven_days":
      return 7;
    case "ten_days":
      return 10;
    case "fourteen_days":
      return 14;
    case "variable":
    default:
      return 7;
  }
}
