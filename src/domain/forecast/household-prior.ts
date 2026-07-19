import type { Household } from "../entities/household";
import type { Category } from "../taxonomy/category";

/** Base consumption interval (days) for a standard 2-adult, 1-pet household. */
const CATEGORY_BASELINES: Record<Category, number> = {
  bread: 4,
  dairy: 5,
  fruit: 6,
  vegetable: 6,
  meat: 6,
  fish: 6,
  beverage: 7,
  snack: 8,
  pantry: 20,
  cleaning: 30,
  personal_care: 25,
  household: 25,
  baby: 7,
  pet: 10,
  other: 12,
};

/**
 * A household-aware prior consumption interval (in days) for a category, before
 * any observed purchase history. Scales the category baseline by household size,
 * pets (pet category only), cooking frequency (food categories), and cadence.
 * Pure — a faithful port of the original deterministic predictor's prior.
 */
export function priorInterval(
  category: Category,
  household: Household,
): number {
  const base = CATEGORY_BASELINES[category] || 10;

  const householdSize =
    (household.adults || 2) + (household.children || 0) * 0.5;
  const sizeFactor = Math.max(0.5, householdSize / 2);

  let petFactor = 1.0;
  if (category === "pet") {
    petFactor = Math.max(0.5, (household.pets || 1) / 1);
  }

  let cookingFactor = 1.0;
  if (["vegetable", "meat", "fish", "pantry", "dairy"].includes(category)) {
    if (household.cooking === "most_days") {
      cookingFactor = 1.3;
    } else if (household.cooking === "rarely") {
      cookingFactor = 0.6;
    }
  }

  let cadenceFactor = 1.0;
  if (household.cadence === "seven_days") {
    cadenceFactor = 0.9;
  } else if (household.cadence === "ten_days") {
    cadenceFactor = 1.0;
  } else if (household.cadence === "fourteen_days") {
    cadenceFactor = 1.25;
  }

  let scale = sizeFactor * cookingFactor * cadenceFactor;
  if (category === "pet") {
    scale = petFactor * cadenceFactor;
  }

  scale = Math.max(0.2, Math.min(5.0, scale));
  const interval = base / scale;
  return Math.max(1, Math.round(interval));
}
