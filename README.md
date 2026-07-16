# Milo

A demo-ready AI household consumption intelligence MVP. It uses local, believable household data so the experience works without external API keys.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Architecture direction

The UI is deliberately separated from the future product engines: receipt extraction, inventory understanding, consumption learning, depletion prediction, and recommendation generation. For production, move the sample data and event handlers into domain services backed by Supabase, with OpenAI Vision structured outputs behind an ingestion adapter.
