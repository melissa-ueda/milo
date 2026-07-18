# Milo

A mobile-first AI household grocery intelligence MVP. Receipt images are read with Gemini using a user-provided API key; household data and purchase history are stored locally in IndexedDB.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## How the intelligence works

1. Gemini extracts products from a receipt and the user reviews them.
2. The confirmed receipt is stored locally and updates product purchase history.
3. Gemini predicts consumption intervals, likely run-out dates, and next-shop selections when a key is configured.
4. A deterministic local predictor remains available as a fallback when Gemini is unavailable.

The API key is kept in browser local storage and used directly from the device for both receipt reading and prediction.
