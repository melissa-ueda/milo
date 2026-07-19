import type { Category } from "@/src/domain/taxonomy/category";
import type {
  Cadence,
  CookingTime,
  FoodPreference,
  ShoppingDay,
} from "@/src/domain/taxonomy/cadence";

/**
 * English display labels for machine codes. This is the ONLY place codes turn
 * into human text; persistence and business logic never see these strings.
 */

export type Option<T extends string> = { value: T; label: string };

export const CADENCE_OPTIONS: Option<Cadence>[] = [
  { value: "seven_days", label: "Weekly" },
  { value: "ten_days", label: "Every 10 days" },
  { value: "fourteen_days", label: "Every two weeks" },
  { value: "variable", label: "It varies" },
];

export const SHOPPING_DAY_OPTIONS: Option<ShoppingDay>[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
  { value: "no_usual_day", label: "No usual day" },
];

export const COOKING_OPTIONS: Option<CookingTime>[] = [
  { value: "most_days", label: "Most days" },
  { value: "a_few_days", label: "A few days a week" },
  { value: "rarely", label: "Rarely" },
];

export const PREFERENCE_OPTIONS: Option<FoodPreference>[] = [
  { value: "no_preference", label: "No preferences" },
  { value: "vegetarian", label: "Vegetarian-friendly" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten-free" },
  { value: "family_friendly", label: "Family-friendly" },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  bread: "Bread",
  dairy: "Dairy",
  fruit: "Fruit",
  vegetable: "Vegetable",
  meat: "Meat",
  fish: "Fish",
  beverage: "Beverage",
  snack: "Snack",
  pantry: "Pantry",
  cleaning: "Cleaning",
  personal_care: "Personal care",
  household: "Household",
  baby: "Baby",
  pet: "Pet",
  other: "Other",
};

function labelFrom<T extends string>(options: Option<T>[], value: T): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export const cadenceLabel = (v: Cadence) => labelFrom(CADENCE_OPTIONS, v);
export const shoppingDayLabel = (v: ShoppingDay) =>
  labelFrom(SHOPPING_DAY_OPTIONS, v);
export const cookingLabel = (v: CookingTime) => labelFrom(COOKING_OPTIONS, v);
export const preferenceLabel = (v: FoodPreference) =>
  labelFrom(PREFERENCE_OPTIONS, v);
export const categoryLabel = (v: Category) => CATEGORY_LABELS[v] ?? "Other";
