# tradeslayer-layout

## Overview

**TradeSlayer Pro** is a desktop-first **web** app — a day-trading *discipline &
journaling* terminal. It's a pure React + Vite single-page app (no React Native /
Expo). State is **local-first**: session, orders, and journal data persist in the
browser via `localStorage`. There is no backend.

The repository is a pnpm workspace with a single package, `artifacts/web`.

## Stack

- **Framework**: React 19 + Vite 7 (SPA)
- **Language**: TypeScript 5.9 (strict)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), theme tokens in `src/index.css`
- **Routing**: `react-router-dom` 7 (sidebar nav + overlay routes)
- **Charts**: `lightweight-charts` 5 (TradingView) — candlestick price charts
- **Icons**: `lucide-react`
- **Fonts**: self-hosted `@fontsource` (DM Sans + JetBrains Mono)
- **Persistence**: `localStorage`
- **Node.js**: 24 · **Package manager**: pnpm

## Structure

```text
tradeslayer-layout/
└── artifacts/
    └── web/                       # The app (@workspace/web)
        ├── src/
        │   ├── main.tsx           # BrowserRouter + mount
        │   ├── App.tsx            # routes + providers (Session/Order) + ErrorBoundary
        │   ├── index.css          # Tailwind @theme tokens (palette + fonts)
        │   ├── components/
        │   │   ├── Shell.tsx       # sidebar nav + top bar (live P&L HUD)
        │   │   ├── ui.tsx          # Panel, PillBadge, StatusDot, ProgressBar, Stat, IconButton
        │   │   ├── ErrorBoundary.tsx
        │   │   ├── chart/          # PriceChart, TradeChart, chartTheme (lightweight-charts)
        │   │   └── session/HardStopOverlay.tsx
        │   ├── screens/           # Dashboard, Trade, Session, Journal, Cards, Settings, Notifications
        │   ├── context/          # SessionContext, OrderContext
        │   ├── lib/              # tilt (scoring), storage (localStorage), cn
        │   ├── constants/        # colors, instruments, nav
        │   └── data/             # strategyCards
        ├── server/serve.js        # static SPA server for the built dist/
        ├── index.html · vite.config.ts · tsconfig.json · package.json
└── pnpm-workspace.yaml · DEPLOY.md · ARCHITECTURE.md
```

## Scripts (`artifacts/web`)

Run with `pnpm --filter @workspace/web run <script>`:

- `dev` — Vite dev server (HMR)
- `build` — `vite build` → static SPA in `dist/`
- `preview` — Vite's preview server for the build
- `serve` — `node server/serve.js` (zero-dep static server with SPA fallback; `/status` health)
- `typecheck` — `tsc --noEmit`

Root: `pnpm run typecheck` / `pnpm run build` run across `artifacts/**` (just the web app).

## State & persistence

Two React contexts hold all app state, persisted to `localStorage` via `lib/storage.ts`:

- **`SessionContext`** — the trading session: P&L, peak P&L, trades (the journal),
  tilt score (computed in `lib/tilt.ts` from consecutive losses / giving-back /
  fast-reentry), reentry countdown, guardrail config (daily goal, max loss, max
  trades, max lots), and regime context. Hydrates on load, then persists on change.
- **`OrderContext`** — the order ticket and placed orders. On a fill it bridges an
  executed entry into the journal (`addTrade`). With no broker configured
  (`VITE_BACKEND` unset) it fills locally and flags the order `simulated`; if a
  broker proxy URL is set it POSTs to `${VITE_BACKEND}/api/orders` and surfaces the
  real outcome (no fabricated fills).

## Charts

`lightweight-charts` v5 (`chart.addSeries(CandlestickSeries, …)`, `autoSize`,
`chart.remove()` cleanup). `PriceChart` is the dashboard hero; `TradeChart` is bound
to `OrderContext` and draws SL / TP / entry as price lines. Candle data is
deterministic **demo** OHLC seeded per symbol, labeled `SIMULATED`. Dashboard market
widgets (signals, alerts, context tiles) are likewise simulated and labeled.

## Deployment

See [DEPLOY.md](DEPLOY.md). Build with `vite build`; serve the static `dist/` with
`server/serve.js` (or any static host with SPA fallback).
