import type { SettingsRepository } from "@/src/application/ports/settings-repository";
import { defaultHousehold } from "@/src/domain/entities/household";
import {
  defaultSettings,
  type AppSettings,
} from "@/src/domain/entities/settings";
import { getDb } from "./dexie";
import type { SettingsRow } from "./records";

const ROW_ID = "app" as const;

function fromRow(row: SettingsRow | undefined): AppSettings {
  if (!row) return defaultSettings;
  return {
    household: { ...defaultHousehold, ...row.household },
    geminiApiKey: row.geminiApiKey ?? "",
    onboarded: row.onboarded ?? false,
  };
}

export function createSettingsRepository(): SettingsRepository {
  const db = getDb();
  return {
    async get(): Promise<AppSettings> {
      return fromRow(await db.settings.get(ROW_ID));
    },
    async save(patch: Partial<AppSettings>): Promise<AppSettings> {
      const current = fromRow(await db.settings.get(ROW_ID));
      const next: AppSettings = {
        household: patch.household
          ? { ...current.household, ...patch.household }
          : current.household,
        geminiApiKey: patch.geminiApiKey ?? current.geminiApiKey,
        onboarded: patch.onboarded ?? current.onboarded,
      };
      await db.settings.put({ id: ROW_ID, ...next });
      return next;
    },
  };
}
