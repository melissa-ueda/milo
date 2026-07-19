import type { Deps } from "../deps";
import { computeForecasts } from "../services/compute-forecasts";
import type { RunOutForecast } from "@/src/domain/forecast/run-out-forecast";

/**
 * The explicit "commit" step: recompute forecasts AND persist each staple's
 * learned average consumption. Called after data mutations (save/delete/
 * feedback/manual-add) — never on a render. Returns the fresh forecasts so the
 * caller can display them without a second compute (and second AI call).
 */
export function learnFromHistory(deps: Deps) {
  return async (): Promise<RunOutForecast[]> => {
    const { forecasts, rhythmUpdates } = await computeForecasts(deps);

    await Promise.all(
      rhythmUpdates.map(async ({ stapleId, avgDays }) => {
        const staple = await deps.staples.getById(stapleId);
        if (!staple || staple.rhythm.avgDays === avgDays) return;
        await deps.staples.updateRhythm(stapleId, {
          ...staple.rhythm,
          avgDays,
        });
      }),
    );

    return forecasts;
  };
}
