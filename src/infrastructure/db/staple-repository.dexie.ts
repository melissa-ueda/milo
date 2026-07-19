import type { StapleRepository } from "@/src/application/ports/staple-repository";
import type { PantryStaple } from "@/src/domain/entities/pantry-staple";
import type { ConsumptionRhythm } from "@/src/domain/values/consumption-rhythm";
import type { StapleId } from "@/src/domain/values/staple-id";
import { getDb } from "./dexie";
import { stapleFromRow, stapleToRow } from "./records";

export function createStapleRepository(): StapleRepository {
  const db = getDb();
  return {
    async getAll(): Promise<PantryStaple[]> {
      return (await db.staples.toArray()).map(stapleFromRow);
    },
    async getById(id: StapleId): Promise<PantryStaple | undefined> {
      const row = await db.staples.get(id);
      return row ? stapleFromRow(row) : undefined;
    },
    async findByMatchKey(matchKey: string): Promise<PantryStaple | undefined> {
      const row = await db.staples.where("matchKey").equals(matchKey).first();
      return row ? stapleFromRow(row) : undefined;
    },
    async upsert(staple: PantryStaple): Promise<void> {
      await db.staples.put(stapleToRow(staple));
    },
    async updateRhythm(id: StapleId, rhythm: ConsumptionRhythm): Promise<void> {
      await db.staples.update(id, {
        avgDays: rhythm.avgDays,
        lastPurchase: rhythm.lastPurchase,
        purchaseCount: rhythm.purchaseCount,
      });
    },
    async setSelected(id: StapleId, selected: boolean): Promise<void> {
      await db.staples.update(id, { selected });
    },
    async remove(id: StapleId): Promise<void> {
      await db.staples.delete(id);
    },
  };
}
