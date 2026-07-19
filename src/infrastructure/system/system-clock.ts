import type { Clock } from "@/src/application/ports/clock";

export const systemClock: Clock = {
  now: () => new Date(),
};
