import type { Deps } from "../deps";
import { learnFromHistory } from "./learn-from-history";
import {
  applyFeedback,
  type FeedbackKind,
} from "@/src/domain/forecast/feedback";
import type { RunOutForecast } from "@/src/domain/forecast/run-out-forecast";
import type { StapleId } from "@/src/domain/values/staple-id";

/**
 * Apply a user correction ("still have" / "used up" / "don't need") to a
 * staple's rhythm, persist it, then re-learn and return fresh forecasts.
 */
export function recordFeedback(deps: Deps) {
  return async (
    stapleId: StapleId,
    kind: FeedbackKind,
  ): Promise<RunOutForecast[]> => {
    const staple = await deps.staples.getById(stapleId);
    if (staple) {
      const rhythm = applyFeedback(staple.rhythm, kind, deps.clock.now());
      await deps.staples.updateRhythm(stapleId, rhythm);
    }
    return learnFromHistory(deps)();
  };
}
