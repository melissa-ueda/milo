import type { PantryStaple } from "@/src/domain/entities/pantry-staple";
import type { StapleId } from "@/src/domain/values/staple-id";
import type { ConsumptionRhythm } from "@/src/domain/values/consumption-rhythm";

/** Persistence for the household's tracked staples. */
export type StapleRepository = {
  getAll(): Promise<PantryStaple[]>;
  getById(id: StapleId): Promise<PantryStaple | undefined>;
  /** Find a staple whose dedupe key matches (for merge-or-create decisions). */
  findByMatchKey(matchKey: string): Promise<PantryStaple | undefined>;
  upsert(staple: PantryStaple): Promise<void>;
  updateRhythm(id: StapleId, rhythm: ConsumptionRhythm): Promise<void>;
  setSelected(id: StapleId, selected: boolean): Promise<void>;
  remove(id: StapleId): Promise<void>;
};
