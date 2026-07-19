import type { Deps } from "../deps";
import type { StapleId } from "@/src/domain/values/staple-id";

/**
 * Toggle whether a staple is on the next shopping list. Persists the flag only;
 * no re-learn (selection doesn't change consumption history).
 */
export function toggleShoppingEntry(deps: Deps) {
  return async (stapleId: StapleId, selected: boolean): Promise<void> => {
    await deps.staples.setSelected(stapleId, selected);
  };
}
