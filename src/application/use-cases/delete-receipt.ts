import type { Deps } from "../deps";
import { learnFromHistory } from "./learn-from-history";
import type { RunOutForecast } from "@/src/domain/forecast/run-out-forecast";
import { toDateOnly } from "@/src/domain/values/iso-date";
import { matchKeyFor } from "@/src/domain/values/staple-id";

/**
 * Delete a receipt and correctly REVERSE its contribution to staple history
 * (the old code left inflated stats). For each staple the deleted receipt
 * touched, recompute purchase facts from the remaining receipts: if none
 * remain, drop the staple; otherwise reset lastPurchase/purchaseCount. Then
 * re-learn and return fresh forecasts.
 */
export function deleteReceipt(deps: Deps) {
  return async (receiptId: string): Promise<RunOutForecast[]> => {
    const removed = await deps.receipts.delete(receiptId);
    const affectedKeys = new Set(removed.map((l) => matchKeyFor(l.name)));

    const remainingLines = await deps.receipts.getAllLines();
    const remainingReceipts = await deps.receipts.getAll();
    const dateByReceipt = new Map(
      remainingReceipts.map((r) => [r.id, toDateOnly(r.date)]),
    );

    const datesByKey = new Map<string, Set<string>>();
    for (const line of remainingLines) {
      const date = dateByReceipt.get(line.receiptId);
      if (!date) continue;
      const key = matchKeyFor(line.name);
      if (!datesByKey.has(key)) datesByKey.set(key, new Set());
      datesByKey.get(key)!.add(date);
    }

    for (const key of affectedKeys) {
      const staple = await deps.staples.findByMatchKey(key);
      if (!staple) continue;
      const dates = Array.from(datesByKey.get(key) ?? []).sort();
      if (dates.length === 0) {
        await deps.staples.remove(staple.id);
        continue;
      }
      await deps.staples.upsert({
        ...staple,
        rhythm: {
          ...staple.rhythm,
          lastPurchase: dates[dates.length - 1],
          purchaseCount: dates.length,
        },
      });
    }

    return learnFromHistory(deps)();
  };
}
