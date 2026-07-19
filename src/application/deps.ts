import type { AIProvider } from "./ports/ai-provider";
import type { Clock } from "./ports/clock";
import type { IdGenerator } from "./ports/id-generator";
import type { ImageCompressor } from "./ports/image-compressor";
import type { ReceiptRepository } from "./ports/receipt-repository";
import type { SettingsRepository } from "./ports/settings-repository";
import type { StapleRepository } from "./ports/staple-repository";

/** The ports every use-case is wired against (supplied by the composition root). */
export type Deps = {
  staples: StapleRepository;
  receipts: ReceiptRepository;
  settings: SettingsRepository;
  ai: AIProvider;
  images: ImageCompressor;
  clock: Clock;
  ids: IdGenerator;
};
