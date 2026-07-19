import type { Deps } from "../deps";
import { computeForecasts } from "../services/compute-forecasts";
import type { RunOutForecast } from "@/src/domain/forecast/run-out-forecast";

/**
 * The render path: compute forecasts for display, writing NOTHING. Used on
 * initial load, tab switches, and when the API key changes.
 */
export function recomputeForecasts(deps: Deps) {
  return async (): Promise<RunOutForecast[]> => {
    const { forecasts } = await computeForecasts(deps);
    return forecasts;
  };
}
