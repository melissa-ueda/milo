import { defaultHousehold, type Household } from "./household";

/**
 * App-wide settings (a persistence singleton). The Gemini API key lives here;
 * it's bound inside the AI adapter, never drilled through use-cases as a bare
 * string.
 */
export type AppSettings = {
  household: Household;
  geminiApiKey: string;
  onboarded: boolean;
};

export const defaultSettings: AppSettings = {
  household: defaultHousehold,
  geminiApiKey: "",
  onboarded: false,
};
