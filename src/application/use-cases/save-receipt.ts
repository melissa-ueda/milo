import type { Deps } from "../deps";
import { learnFromHistory } from "./learn-from-history";
import type { PantryStaple } from "@/src/domain/entities/pantry-staple";
import type {
  Receipt,
  ReceiptLine,
  ReviewLine,
} from "@/src/domain/entities/receipt";
import type { RunOutForecast } from "@/src/domain/forecast/run-out-forecast";
import { newRhythm } from "@/src/domain/values/consumption-rhythm";
import { asStapleId, matchKeyFor } from "@/src/domain/values/staple-id";

export type SaveReceiptInput = {
  store: string;
  purchaseDate: string;
  image: Blob;
  lines: ReviewLine[];
};

/**
 * Persist a reviewed receipt: store the receipt + lines, upsert the matching
 * staples' purchase history (merge by matchKey, else create), then explicitly
 * learn (recompute + persist rhythms) and return the fresh forecasts.
 */
export function saveReceipt(deps: Deps) {
  return async (input: SaveReceiptInput): Promise<RunOutForecast[]> => {
    const receiptId = deps.ids.newId();
    const receipt: Receipt = {
      id: receiptId,
      date: input.purchaseDate,
      store: input.store,
      image: input.image,
    };
    const lines: ReceiptLine[] = input.lines.map((l) => ({
      id: deps.ids.newId(),
      receiptId,
      name: l.normalizedName,
      type: l.type,
      category: l.category,
      quantity: l.quantity,
      unit: l.unit,
      price: l.price,
    }));

    await deps.receipts.add(receipt, lines);

    // Sequential so repeated match keys within one receipt see prior upserts.
    for (const line of lines) {
      const key = matchKeyFor(line.name);
      const existing = await deps.staples.findByMatchKey(key);
      if (existing) {
        await deps.staples.upsert({
          ...existing,
          category: line.category,
          rhythm: {
            ...existing.rhythm,
            lastPurchase: input.purchaseDate,
            purchaseCount: existing.rhythm.purchaseCount + 1,
          },
        });
      } else {
        const staple: PantryStaple = {
          id: asStapleId(deps.ids.newId()),
          name: line.name,
          matchKey: key,
          type: line.type,
          category: line.category,
          rhythm: newRhythm(input.purchaseDate),
          selected: true,
        };
        await deps.staples.upsert(staple);
      }
    }

    return learnFromHistory(deps)();
  };
}
