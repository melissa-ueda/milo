import type { PurchaseRecord } from "@/src/application/use-cases/get-history";
import { emojiForType } from "@/src/domain/taxonomy/emoji";
import { sumMoney, timesMoney } from "@/src/domain/values/money";
import { formatMoney, formatShortDate } from "../labels/format";

// Note: a receipt line's `price` is already the total for that line (per the
// extraction prompt), so the receipt total sums line prices directly. The
// per-line "subtotal" shown in the detail modal multiplies by quantity — a
// faithful reproduction of the original UI's display.

export type PurchaseLineView = {
  name: string;
  emoji: string;
  qty: number;
  price: string;
  lineTotal: string;
};

export type PurchaseView = {
  id: string;
  store: string;
  date: string;
  itemCount: string;
  total: string;
  items: PurchaseLineView[];
};

/** Format a receipt record for the history list and purchase-detail modal. */
export function purchaseView({ receipt, lines }: PurchaseRecord): PurchaseView {
  return {
    id: receipt.id,
    store: receipt.store,
    date: formatShortDate(receipt.date),
    itemCount: `${lines.length} item${lines.length !== 1 ? "s" : ""}`,
    total: formatMoney(sumMoney(lines.map((l) => l.price))),
    items: lines.map((l) => ({
      name: l.name,
      emoji: emojiForType(l.type),
      qty: l.quantity,
      price: formatMoney(l.price),
      lineTotal: formatMoney(timesMoney(l.price, l.quantity)),
    })),
  };
}
