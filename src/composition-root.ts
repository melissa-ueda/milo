import { createUseCases } from "./application/use-cases";
import { createGeminiProvider } from "./infrastructure/ai/gemini-provider";
import { createReceiptRepository } from "./infrastructure/db/receipt-repository.dexie";
import { createSettingsRepository } from "./infrastructure/db/settings-repository.dexie";
import { createStapleRepository } from "./infrastructure/db/staple-repository.dexie";
import { browserImageCompressor } from "./infrastructure/image/browser-image-compressor";
import { systemClock } from "./infrastructure/system/system-clock";
import { uuidGenerator } from "./infrastructure/system/uuid-generator";
import {
  createMiloStore,
  type MiloStore,
} from "./presentation/store/milo-store";

/**
 * The single place adapters are wired to use-cases and the store. Must run in
 * the browser only (it touches IndexedDB + the AI SDK) — call it from a mount
 * effect, never at module load or during static export.
 *
 * The Gemini key lives in a mutable holder so the AI adapter's synchronous
 * `isConfigured()` always sees the latest value when settings change.
 */
export function bootstrap(): MiloStore {
  const keyHolder = { value: "" };
  const ai = createGeminiProvider({ getApiKey: () => keyHolder.value });

  const useCases = createUseCases({
    staples: createStapleRepository(),
    receipts: createReceiptRepository(),
    settings: createSettingsRepository(),
    ai,
    images: browserImageCompressor,
    clock: systemClock,
    ids: uuidGenerator,
  });

  return createMiloStore(useCases, (key) => {
    keyHolder.value = key;
  });
}
