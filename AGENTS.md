# BetterHome — AI Real Estate Platform

## Tech Stack
- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom design system (slate/cyan/emerald/gold palette, glassmorphism)
- **Database**: Prisma + SQLite (`prisma/dev.db`)
- **Charts**: Recharts
- **Icons**: lucide-react
- **AI**: Server-side Gemini API with rule-based fallbacks (set `GEMINI_API_KEY` for full AI)

## Setup
- Run via `docker compose -f docker-compose.base44.yml up -d --build`
- The compose file installs deps, runs Prisma generate/migrate/seed, then starts `next dev`
- First boot takes ~60-90s for npm install + DB setup
- Health check: `GET /` on port 3000

## Architecture
- Single-user demo mode (auto-creates `demo@betterhome.app` user on first seed)
- Messages page: role-based discussion board (buyer/partner/family/agent), optionally linked to a property
- All API routes under `/src/app/api/` — server-side, no client-side secrets
- AI functions in `src/lib/ai.ts` — always check `isAIAvailable()`, fall back to rule-based
- Scoring engine in `src/lib/scoring.ts` — transparent, explainable, never a black box
- Financial calculations in `src/lib/calculations.ts` — all formulas documented

## Key Directories
- `src/app/` — pages (App Router)
- `src/components/` — shared UI components
- `src/lib/` — business logic (db, session, scoring, calculations, ai)
- `prisma/` — schema and seed data

## Development
- Live reload is enabled via `next dev`
- DB changes: `npx prisma db push` (auto-runs on container start)
- Seed: `npx tsx prisma/seed.ts` (auto-runs on container start)
- Theme: light/dark/system via `ThemeProvider` (localStorage `betterhome-theme`)
