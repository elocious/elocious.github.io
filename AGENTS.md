# NexaCart — Base44 Development Environment

## Overview
NexaCart is a premium multi-vendor e-commerce marketplace built with React + Vite + TypeScript, Tailwind CSS, Framer Motion, Recharts, and Lucide icons.

## Tech Stack
- **Frontend**: React 18 + Vite 5 + TypeScript
- **Styling**: Tailwind CSS 3 (dark/light/system themes via CSS variables)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router 6 (lazy-loaded routes for code splitting)
- **State**: React Context + localStorage persistence

## Running the App
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
The app runs on port 3000 with hot reload via Vite dev server.

## Architecture
- `src/types/` — TypeScript type definitions
- `src/data/mockData.ts` — All demo data (products, stores, orders, etc.)
- `src/lib/store.tsx` — Global state (auth, cart, wishlist, theme, notifications, toasts)
- `src/components/layout/` — Navbar, Footer, MobileNav, DashboardLayout, Breadcrumbs
- `src/components/ui/` — Reusable UI components (Button, Badge, Skeleton, Toast, etc.)
- `src/components/product/` — ProductCard
- `src/pages/` — All page components (lazy loaded)
  - `src/pages/auth/` — Login, Signup, ForgotPassword
  - `src/pages/seller/` — Seller dashboard pages
  - `src/pages/admin/` — Admin dashboard pages

## Key Features
- Dark/Light/System theme toggle
- Full cart/wishlist with localStorage persistence
- Multi-step checkout flow
- Seller dashboard with analytics
- Admin panel with user/seller/product management
- AI support chatbot (placeholder — needs VITE_AI_API_KEY for real AI)
- Responsive design with mobile bottom navigation

## Notes
- All data is mock/demo data stored in `src/data/mockData.ts`
- No backend — state persists in localStorage
- Admin access is protected by role-based UI (server-side auth would be needed for production)
- VITE_AI_API_KEY is optional — the AI assistant shows a fallback message without it
