/** A user-facing AI error with a coarse kind, mapped from raw SDK errors. */
export class AiError extends Error {
  readonly kind: "quota" | "auth" | "unknown";
  constructor(message: string, kind: AiError["kind"]) {
    super(message);
    this.name = "AiError";
    this.kind = kind;
  }
}

export function mapAiError(error: unknown): AiError {
  const raw = error instanceof Error ? error.message : "The AI request failed.";
  const lower = raw.toLowerCase();

  if (
    lower.includes("quota") ||
    lower.includes("rate limit") ||
    lower.includes("429")
  ) {
    return new AiError(
      "Gemini quota exceeded. Please check your billing or quota at ai.google.dev.",
      "quota",
    );
  }
  if (
    lower.includes("api key") ||
    lower.includes("permission") ||
    lower.includes("401")
  ) {
    return new AiError(
      "Your Gemini API key was rejected. Please check it in Household settings.",
      "auth",
    );
  }
  return new AiError(raw, "unknown");
}
