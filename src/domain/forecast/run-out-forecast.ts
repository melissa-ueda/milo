import type { Category } from "../taxonomy/category";
import type { ProductType } from "../taxonomy/product-type";
import type { IsoDateTime } from "../values/iso-date";
import type { StapleId } from "../values/staple-id";

/**
 * A prediction of when a staple runs out and whether it belongs on the next
 * shopping list. Ephemeral — computed from history on demand, never persisted.
 * `predictedRunOutDate === ""` means the staple is still learning (too little
 * history to forecast).
 */
export type RunOutForecast = {
  readonly stapleId: StapleId;
  readonly name: string;
  readonly type: ProductType;
  readonly category: Category;
  readonly averageConsumptionDays: number;
  readonly lastPurchase: IsoDateTime;
  readonly predictedRunOutDate: IsoDateTime | "";
  readonly confidence: number;
  readonly selected: boolean;
  readonly learning: boolean;
};

/** A learned-average write the caller may choose to persist (never on render). */
export type RhythmUpdate = {
  readonly stapleId: StapleId;
  readonly avgDays: number | null;
};
