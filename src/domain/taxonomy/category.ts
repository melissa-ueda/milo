/**
 * Coarse product groupings. Values are stable machine CODES — never display
 * labels. UI labels live in `src/presentation/labels`, prompt/schema allow-lists
 * derive from `CATEGORY_CODES`.
 */
export const CATEGORY_CODES = [
  "bread",
  "dairy",
  "fruit",
  "vegetable",
  "meat",
  "fish",
  "beverage",
  "snack",
  "pantry",
  "cleaning",
  "personal_care",
  "household",
  "baby",
  "pet",
  "other",
] as const;

export type Category = (typeof CATEGORY_CODES)[number];

export function isCategory(value: string): value is Category {
  return (CATEGORY_CODES as readonly string[]).includes(value);
}

export function asCategory(value: string): Category {
  return isCategory(value) ? value : "other";
}
