# Milo

A mobile-first AI household grocery intelligence PWA. Receipt images are read with Gemini using a user-provided API key; household data and purchase history are stored locally in IndexedDB. Everything runs client-side — there is no server.

## Run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — static export (`output: "export"`) to `out/`
- `pnpm test` — run the unit tests (Vitest)
- `pnpm lint` — Prettier + ESLint (enforces the architecture boundaries)

## How the intelligence works

1. Gemini extracts products from a receipt and the user reviews them.
2. The confirmed receipt is stored locally and updates each product's learned consumption rhythm.
3. Gemini predicts consumption intervals, likely run-out dates, and next-shop selections when a key is configured.
4. A deterministic local predictor remains available as a fallback when Gemini is unavailable.

The API key is kept in browser IndexedDB and used directly from the device for both receipt reading and prediction.

## Architecture

The app follows a pragmatic clean architecture (dependencies point inward only). Layer boundaries are enforced by an ESLint `no-restricted-imports` rule.

```
src/
  domain/          Pure business rules — taxonomy (machine codes), entities,
                   value objects, and the forecast math. No React/Dexie/AI SDK.
  application/     Use-cases + ports (repository / AIProvider / clock / …).
                   Orchestrates the domain behind interfaces; no I/O details.
  infrastructure/  Adapters: Dexie repositories, the Gemini provider, the
                   browser image compressor, the system clock. The only place
                   Dexie and the AI SDK are imported.
  presentation/    React views, a small external store, view-models, and the
                   only place display labels / currency / dates live.
  composition-root.ts   Wires adapters → use-cases → store (browser only).
```

Key properties:

- **Machine codes, not display strings.** Enums (cadence, category, product type) persist as stable codes; English labels live only in `presentation/labels`.
- **Renders never write the database.** `recomputeForecasts` is read-only; persisting learned stats is an explicit `learnFromHistory` step after mutations.
- **Hybrid forecasting.** The AI path is used when configured and complete; otherwise the deterministic local predictor takes over.
- **One AI vocabulary source.** The Gemini schemas and prompts derive their allow-lists from the domain code lists.

Tests live next to the code they cover (`*.test.ts`) and focus on the pure domain and the use-cases (via in-memory fakes), including the save → delete round-trip and the AI/local fallback.
