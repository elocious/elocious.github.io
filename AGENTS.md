# BetterHome — AI Real Estate Evaluation & Vault Platform

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, motion/react, lucide-react, Vite
- **Backend**: Express on port 3001 (Gemini API proxy + fallback), Vite dev server on port 3000
- Both run concurrently via `npm run dev` (uses `concurrently`)

## Development
```sh
npm install
npm run dev
```
- App serves on `http://localhost:3000`
- API server on port 3001 (Vite proxies `/api/*` to it)

## Architecture Notes
- `src/lib/evaluation.ts` — multi-factor scoring engine (affordability, safety, schools, walkability, transit, appreciation, structural, sentiment). Pure math, shared between client and server.
- `src/lib/archetypes.ts` — architectural archetype metadata + AI prompt generator
- `src/lib/store.tsx` — React Context state with localStorage persistence; seed data loaded on first run
- `src/data/seedData.ts` — 5 sample properties matching scenario presets
- `server/index.ts` — Express API (`/api/evaluate`, `/api/compare`, `/api/advisor`) with in-memory caching and Gemini integration + rule-based fallbacks

## Environment
- `GEMINI_API_KEY` — Google Gemini API key (optional). Without it, the AI advisor and comparison use rule-based fallback responses. Set via the Base44 secrets dashboard.

## Docker
```sh
docker compose -f docker-compose.base44.yml up -d --build
```
Healthcheck probes `http://localhost:3000` via Node `fetch`.
