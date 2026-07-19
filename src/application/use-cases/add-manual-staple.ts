import type { Deps } from "../deps";
import { learnFromHistory } from "./learn-from-history";
import type { PantryStaple } from "@/src/domain/entities/pantry-staple";
import type { RunOutForecast } from "@/src/domain/forecast/run-out-forecast";
import { productTypeForName } from "@/src/domain/taxonomy/product-type";
import { newRhythm } from "@/src/domain/values/consumption-rhythm";
import { asStapleId, matchKeyFor } from "@/src/domain/values/staple-id";

/**
 * Add a staple by name (onboarding / upload modal / pantry). If one already
 * matches, count it as another purchase; otherwise create it (type guessed from
 * the name). Re-learns and returns fresh forecasts.
 */
export function addManualStaple(deps: Deps) {
  return async (name: string): Promise<RunOutForecast[]> => {
    const trimmed = name.trim();
    if (!trimmed) return learnFromHistory(deps)();

    const now = deps.clock.now().toISOString();
    const key = matchKeyFor(trimmed);
    const existing = await deps.staples.findByMatchKey(key);

    if (existing) {
      await deps.staples.upsert({
        ...existing,
        selected: true,
        rhythm: {
          ...existing.rhythm,
          lastPurchase: now,
          purchaseCount: existing.rhythm.purchaseCount + 1,
        },
      });
    } else {
      const staple: PantryStaple = {
        id: asStapleId(deps.ids.newId()),
        name: trimmed,
        matchKey: key,
        type: productTypeForName(trimmed),
        category: "other",
        rhythm: newRhythm(now),
        selected: true,
      };
      await deps.staples.upsert(staple);
    }

    return learnFromHistory(deps)();
  };
}
