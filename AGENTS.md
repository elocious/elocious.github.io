# E-Commerce Automation Platform

## Stack
- **Frontend**: React 18 + Vite 5 (port 5173, mapped to host 3000), recharts for charts, lucide-react for icons, react-router-dom for routing
- **Backend**: Node.js 22 + Express 4 (port 4000), pg (node-postgres) for database access
- **Database**: PostgreSQL 16

## Architecture
Single-origin: Vite dev server proxies `/api/*` to the backend service. Only port 3000 is public.
- Frontend calls `/api/...` — Vite proxy forwards to `http://backend:4000`
- No CORS configuration needed (same origin from browser's perspective)

## Dev commands
```
docker compose -f docker-compose.base44.yml up -d --build
docker compose -f docker-compose.base44.yml logs -f backend
docker compose -f docker-compose.base44.yml logs -f frontend
```

## Database
- Schema is auto-initialized via `backend/src/scripts/init.sql` mounted into postgres `/docker-entrypoint-initdb.d/`
- Seed data includes 8 products, 5 customers, 6 orders
- **Note**: init.sql only runs on first volume creation. To re-seed, destroy the pgdata volume.

## Automation features
- **Order creation**: automatically decrements product stock in a DB transaction; rejects if insufficient stock
- **Order status**: manual status changes via dropdown; cancelling an order restocks items
- **Auto-advance**: one click advances all pending→processing, processing→shipped, shipped→delivered
- **Low-stock alerts**: dashboard surfaces products at or below their threshold; badges shown in product table

## Key files
- `backend/src/index.js` — Express server entry
- `backend/src/db.js` — PostgreSQL connection pool
- `backend/src/routes/` — products, orders, customers, dashboard
- `frontend/src/pages/` — Dashboard, Products, Orders, Customers
- `frontend/src/api/client.js` — API client

## No external secrets needed
All infrastructure (PostgreSQL) runs locally in compose with generated credentials. No third-party API keys required.
