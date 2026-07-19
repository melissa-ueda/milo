import type { UseCases } from "@/src/application/use-cases";
import type { SaveReceiptInput } from "@/src/application/use-cases/save-receipt";
import type { PurchaseRecord } from "@/src/application/use-cases/get-history";
import type { Household } from "@/src/domain/entities/household";
import {
  defaultSettings,
  type AppSettings,
} from "@/src/domain/entities/settings";
import type { ShoppingListEntry } from "@/src/domain/entities/shopping-list";
import type { FeedbackKind } from "@/src/domain/forecast/feedback";
import type { RunOutForecast } from "@/src/domain/forecast/run-out-forecast";
import { productTypeForName } from "@/src/domain/taxonomy/product-type";
import type { StapleId } from "@/src/domain/values/staple-id";

export type MiloState = {
  loaded: boolean;
  settings: AppSettings;
  forecasts: RunOutForecast[];
  history: PurchaseRecord[];
  /** Ad-hoc, non-persisted shopping-list additions. */
  manualEntries: ShoppingListEntry[];
};

export type MiloStore = ReturnType<typeof createMiloStore>;

/**
 * A tiny external store (usable with `useSyncExternalStore`) that owns all app
 * state and drives it exclusively through use-cases. `setLiveApiKey` lets the
 * AI adapter see key changes immediately (its `isConfigured()` is synchronous).
 */
export function createMiloStore(
  useCases: UseCases,
  setLiveApiKey: (key: string) => void,
) {
  let state: MiloState = {
    loaded: false,
    settings: defaultSettings,
    forecasts: [],
    history: [],
    manualEntries: [],
  };
  const listeners = new Set<() => void>();

  const notify = () => listeners.forEach((l) => l());
  const set = (patch: Partial<MiloState>) => {
    state = { ...state, ...patch };
    notify();
  };

  async function refreshHistory() {
    set({ history: await useCases.getHistory() });
  }

  return {
    subscribe(cb: () => void) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getState(): MiloState {
      return state;
    },

    /** Load persisted settings + initial forecasts/history. */
    async init() {
      const settings = await useCases.getSettings();
      setLiveApiKey(settings.geminiApiKey);
      set({ settings });
      const [forecasts, history] = await Promise.all([
        useCases.recomputeForecasts(),
        useCases.getHistory(),
      ]);
      set({ forecasts, history, loaded: true });
    },

    /** Query-only: compress + parse a receipt for review (no state change). */
    parseReceipt(file: File) {
      return useCases.parseReceipt(file);
    },

    async saveReceipt(input: SaveReceiptInput) {
      const forecasts = await useCases.saveReceipt(input);
      set({ forecasts });
      await refreshHistory();
    },

    async deleteReceipt(receiptId: string) {
      const forecasts = await useCases.deleteReceipt(receiptId);
      set({ forecasts });
      await refreshHistory();
    },

    async recordFeedback(stapleId: StapleId, kind: FeedbackKind) {
      set({ forecasts: await useCases.recordFeedback(stapleId, kind) });
    },

    async addManualStaple(name: string) {
      set({ forecasts: await useCases.addManualStaple(name) });
    },

    async toggle(stapleId: StapleId) {
      const current = state.forecasts.find((f) => f.stapleId === stapleId);
      if (!current) return;
      const selected = !current.selected;
      await useCases.toggleShoppingEntry(stapleId, selected);
      set({
        forecasts: state.forecasts.map((f) =>
          f.stapleId === stapleId ? { ...f, selected } : f,
        ),
      });
    },

    /** Add an ephemeral one-off item to the shopping list (not persisted). */
    addManualEntry(name: string) {
      const trimmed = name.trim();
      if (!trimmed) return;
      set({
        manualEntries: [
          ...state.manualEntries,
          {
            name: trimmed,
            type: productTypeForName(trimmed),
            quantity: 1,
            source: "manual",
          },
        ],
      });
    },

    async saveHousehold(household: Household) {
      const settings = await useCases.saveHousehold(household);
      set({ settings, forecasts: await useCases.recomputeForecasts() });
    },

    async saveApiKey(key: string) {
      const settings = await useCases.saveApiKey(key);
      setLiveApiKey(key);
      set({ settings });
    },

    async completeOnboarding(household: Household, firstItem?: string) {
      const settings = await useCases.completeOnboarding(household);
      set({ settings });
      if (firstItem) await useCases.addManualStaple(firstItem);
      const [forecasts, history] = await Promise.all([
        useCases.recomputeForecasts(),
        useCases.getHistory(),
      ]);
      set({ forecasts, history, loaded: true });
    },
  };
}
