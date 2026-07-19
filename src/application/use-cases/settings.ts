import type { Deps } from "../deps";
import type { Household } from "@/src/domain/entities/household";
import type { AppSettings } from "@/src/domain/entities/settings";

export function getSettings(deps: Deps) {
  return (): Promise<AppSettings> => deps.settings.get();
}

export function saveHousehold(deps: Deps) {
  return (household: Household): Promise<AppSettings> =>
    deps.settings.save({ household });
}

export function saveApiKey(deps: Deps) {
  return (geminiApiKey: string): Promise<AppSettings> =>
    deps.settings.save({ geminiApiKey });
}

/** Persist the household + mark onboarding complete in one write. */
export function completeOnboarding(deps: Deps) {
  return (household: Household): Promise<AppSettings> =>
    deps.settings.save({ household, onboarded: true });
}
