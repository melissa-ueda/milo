import type { Category } from "../taxonomy/category";
import type { ProductType } from "../taxonomy/product-type";
import type { ConsumptionRhythm } from "../values/consumption-rhythm";
import type { StapleId } from "../values/staple-id";

/**
 * A grocery the household keeps and Milo tracks. Identity is the opaque `id`;
 * `matchKey` is the normalized name used only for dedupe decisions. `selected`
 * marks membership in the next shopping list.
 */
export type PantryStaple = {
  readonly id: StapleId;
  name: string;
  matchKey: string;
  type: ProductType;
  category: Category;
  rhythm: ConsumptionRhythm;
  selected: boolean;
};
