import type { Deps } from "../deps";
import { addManualStaple } from "./add-manual-staple";
import { deleteReceipt } from "./delete-receipt";
import { getHistory } from "./get-history";
import { learnFromHistory } from "./learn-from-history";
import { parseReceipt } from "./parse-receipt";
import { recomputeForecasts } from "./recompute-forecasts";
import { recordFeedback } from "./record-feedback";
import { saveReceipt } from "./save-receipt";
import {
  completeOnboarding,
  getSettings,
  saveApiKey,
  saveHousehold,
} from "./settings";
import { toggleShoppingEntry } from "./toggle-shopping-entry";

/** All use-cases, bound to the given ports. Built once by the composition root. */
export function createUseCases(deps: Deps) {
  return {
    parseReceipt: parseReceipt(deps),
    saveReceipt: saveReceipt(deps),
    deleteReceipt: deleteReceipt(deps),
    recomputeForecasts: recomputeForecasts(deps),
    learnFromHistory: learnFromHistory(deps),
    recordFeedback: recordFeedback(deps),
    addManualStaple: addManualStaple(deps),
    toggleShoppingEntry: toggleShoppingEntry(deps),
    getSettings: getSettings(deps),
    saveHousehold: saveHousehold(deps),
    saveApiKey: saveApiKey(deps),
    completeOnboarding: completeOnboarding(deps),
    getHistory: getHistory(deps),
  };
}

export type UseCases = ReturnType<typeof createUseCases>;
