import type { IdGenerator } from "@/src/application/ports/id-generator";

export const uuidGenerator: IdGenerator = {
  newId: () => crypto.randomUUID(),
};
