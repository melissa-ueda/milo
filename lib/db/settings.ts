import type { AppSettings, Household } from "@/core/models/household";
import { db } from "./dexie";

export const defaultHousehold: Household = {
  name: "",
  adults: 2,
  children: 0,
  pets: 1,
  cadence: "Weekly",
  day: "Friday",
  cooking: "Most days",
  preferences: "Vegetarian-friendly",
};

const defaults: AppSettings = {
  id: "app",
  household: defaultHousehold,
  geminiApiKey: "",
  onboarded: false,
};

export async function getSettings(): Promise<AppSettings> {
  const saved = await db.settings.get("app");
  return saved
    ? {
        ...defaults,
        ...saved,
        household: { ...defaultHousehold, ...saved.household },
      }
    : defaults;
}

export async function saveSettings(
  patch: Partial<Omit<AppSettings, "id">>,
): Promise<void> {
  const current = await getSettings();
  await db.settings.put({
    ...current,
    ...patch,
    household: patch.household
      ? { ...current.household, ...patch.household }
      : current.household,
  });
}
