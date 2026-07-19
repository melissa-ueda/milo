import type { Deps } from "../deps";
import type { AIProvider, AIPrediction } from "../ports/ai-provider";
import type { Clock } from "../ports/clock";
import type { IdGenerator } from "../ports/id-generator";
import type { ImageCompressor } from "../ports/image-compressor";
import type { ReceiptRepository } from "../ports/receipt-repository";
import type { SettingsRepository } from "../ports/settings-repository";
import type { StapleRepository } from "../ports/staple-repository";
import type { PantryStaple } from "@/src/domain/entities/pantry-staple";
import type { Receipt, ReceiptLine } from "@/src/domain/entities/receipt";
import {
  defaultSettings,
  type AppSettings,
} from "@/src/domain/entities/settings";
import type { ConsumptionRhythm } from "@/src/domain/values/consumption-rhythm";
import type { StapleId } from "@/src/domain/values/staple-id";

/** In-memory ports for fast, deterministic use-case tests. */

export function fakeStapleRepo(): StapleRepository & {
  rows: Map<string, PantryStaple>;
} {
  const rows = new Map<string, PantryStaple>();
  return {
    rows,
    async getAll() {
      return [...rows.values()];
    },
    async getById(id) {
      return rows.get(id);
    },
    async findByMatchKey(matchKey) {
      return [...rows.values()].find((s) => s.matchKey === matchKey);
    },
    async upsert(staple) {
      rows.set(staple.id, staple);
    },
    async updateRhythm(id: StapleId, rhythm: ConsumptionRhythm) {
      const s = rows.get(id);
      if (s) rows.set(id, { ...s, rhythm });
    },
    async setSelected(id, selected) {
      const s = rows.get(id);
      if (s) rows.set(id, { ...s, selected });
    },
    async remove(id) {
      rows.delete(id);
    },
  };
}

export function fakeReceiptRepo(): ReceiptRepository & {
  receipts: Map<string, Receipt>;
  lines: ReceiptLine[];
} {
  const receipts = new Map<string, Receipt>();
  let lines: ReceiptLine[] = [];
  return {
    receipts,
    get lines() {
      return lines;
    },
    async add(receipt, newLines) {
      receipts.set(receipt.id, receipt);
      lines = [...lines, ...newLines];
    },
    async getAll() {
      return [...receipts.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
    },
    async getLines(receiptId) {
      return lines.filter((l) => l.receiptId === receiptId);
    },
    async getAllLines() {
      return [...lines];
    },
    async delete(receiptId) {
      const removed = lines.filter((l) => l.receiptId === receiptId);
      lines = lines.filter((l) => l.receiptId !== receiptId);
      receipts.delete(receiptId);
      return removed;
    },
  };
}

export function fakeSettingsRepo(
  initial?: Partial<AppSettings>,
): SettingsRepository {
  let settings: AppSettings = { ...defaultSettings, ...initial };
  return {
    async get() {
      return settings;
    },
    async save(patch) {
      settings = {
        household: patch.household
          ? { ...settings.household, ...patch.household }
          : settings.household,
        geminiApiKey: patch.geminiApiKey ?? settings.geminiApiKey,
        onboarded: patch.onboarded ?? settings.onboarded,
      };
      return settings;
    },
  };
}

export type ScriptableAI = AIProvider & {
  configured: boolean;
  predictions: AIPrediction[] | null;
  predictCalls: number;
};

/** AI stub: toggle `configured`, and script `predictions` (null → throw). */
export function fakeAI(): ScriptableAI {
  const ai: ScriptableAI = {
    configured: false,
    predictions: null,
    predictCalls: 0,
    isConfigured() {
      return ai.configured;
    },
    async parseReceipt() {
      throw new Error("not used in these tests");
    },
    async predict() {
      ai.predictCalls += 1;
      if (!ai.predictions) throw new Error("AI failure");
      return ai.predictions;
    },
  };
  return ai;
}

export function fakeImages(): ImageCompressor {
  return {
    async compress(file) {
      return file;
    },
  };
}

export function fixedClock(iso: string): Clock {
  return { now: () => new Date(iso) };
}

export function seqIds(prefix = "id"): IdGenerator {
  let n = 0;
  return { newId: () => `${prefix}-${++n}` };
}

export function makeDeps(overrides: Partial<Deps> = {}): Deps {
  return {
    staples: fakeStapleRepo(),
    receipts: fakeReceiptRepo(),
    settings: fakeSettingsRepo(),
    ai: fakeAI(),
    images: fakeImages(),
    clock: fixedClock("2026-07-19T12:00:00.000Z"),
    ids: seqIds(),
    ...overrides,
  };
}
