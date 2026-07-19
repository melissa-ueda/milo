import type { ProductType } from "../taxonomy/product-type";
import type { StapleId } from "../values/staple-id";

/**
 * The list you take to the supermarket: product types and quantities. Predicted
 * entries derive from selected staples' forecasts; manual entries are ad-hoc
 * one-offs the user typed in (and are not persisted).
 */
export type ShoppingListEntry = {
  readonly stapleId?: StapleId;
  name: string;
  type: ProductType;
  quantity: number;
  source: "predicted" | "manual";
};

export type ShoppingList = ShoppingListEntry[];

export function manualEntry(
  name: string,
  type: ProductType,
  quantity = 1,
): ShoppingListEntry {
  return { name, type, quantity, source: "manual" };
}

/** Predicted entries first (in given order), then manual additions. */
export function mergeShoppingList(
  predicted: ShoppingListEntry[],
  manual: ShoppingListEntry[],
): ShoppingList {
  return [...predicted, ...manual];
}
