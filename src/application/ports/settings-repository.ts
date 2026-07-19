import type { AppSettings } from "@/src/domain/entities/settings";

/** Persistence for the app settings singleton (household, key, onboarded). */
export type SettingsRepository = {
  get(): Promise<AppSettings>;
  save(patch: Partial<AppSettings>): Promise<AppSettings>;
};
