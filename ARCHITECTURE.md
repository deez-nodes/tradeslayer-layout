# tradeslayer-layout

## Overview

**TradeSlayer Pro** is a mobile-first day-trading *discipline & journaling* app built with Expo Router / React Native. It runs on iOS/Android (Expo) and on the web via `react-native-web`. State is **local-first** — there is no backend; session, orders, and journal data are persisted on-device with AsyncStorage.

The repository is a pnpm workspace with a single package, `artifacts/mobile`. (The workspace layout is retained so additional packages — e.g. a future broker proxy — can be added later.)

## Stack

- **App framework**: Expo SDK 54, expo-router 6
- **UI runtime**: React 19, React Native 0.81, `react-native-web` (web target)
- **Language**: TypeScript 5.9 (strict)
- **Persistence**: `@react-native-async-storage/async-storage` (local-first)
- **Graphics/animation**: `react-native-svg`, `react-native-reanimated`, `react-native-gesture-handler`
- **Bundler**: Metro (native + web export)
- **Node.js version**: 24
- **Package manager**: pnpm

## Structure

```text
tradeslayer-layout/
├── artifacts/
│   └── mobile/                 # The app (@workspace/mobile)
│       ├── app/                # expo-router routes — (tabs)/ = Dashboard, Trade, Session, Journal, Cards
│       ├── components/         # Feature UI: dashboard/, trade/, session/, journal/, cards/, shared/
│       ├── context/            # SessionContext, OrderContext (app state + AsyncStorage hydration)
│       ├── constants/          # colors, instruments, layout, nav, typography, shadows
│       ├── data/               # strategyCards.ts (seed strategy cards)
│       ├── hooks/              # useResponsiveLayout, useHover
│       ├── lib/                # storage.ts (AsyncStorage helpers), tilt.ts (tilt computation)
│       ├── server/             # serve.js — serves the exported web build (dist/) with SPA fallback + /status
│       ├── scripts/            # build.js — native Expo Go build helper
│       ├── app.json            # Expo config (web output: single-page)
│       ├── metro.config.js     # Metro bundler config
│       └── tsconfig.json       # extends expo/tsconfig.base
├── attached_assets/            # Design spec (tradeslayer-layout-structure_*.md)
├── DEPLOY.md                   # Deployment instructions
├── pnpm-workspace.yaml         # workspace (artifacts/mobile) + catalog + platform overrides
├── tsconfig.base.json          # shared TS base
├── tsconfig.json               # root TS project references (empty — app self-typechecks)
└── package.json                # root scripts (typecheck, build)
```

## Root scripts

- `pnpm run typecheck` — typechecks every `artifacts/**` package (currently just the mobile app).
- `pnpm run build` — typechecks, then runs each package's `build` (mobile: `expo export --platform web`).

## App scripts (`artifacts/mobile`)

Run with `pnpm --filter @workspace/mobile run <script>`:

- `dev` — `expo start` (Metro dev server; open in Expo Go or a simulator)
- `web` — `expo start --web` (web dev server)
- `build` — `expo export --platform web --output-dir dist` (static web build)
- `serve` — `node server/serve.js` (serve the exported `dist/` with SPA fallback; `/status` health route)
- `build:native` — `node scripts/build.js` (native Expo Go build)
- `typecheck` — `tsc -p tsconfig.json --noEmit`

## State & persistence

Two React contexts hold all app state and persist to AsyncStorage via `lib/storage.ts`:

- **`SessionContext`** — the trading session: P&L, peak P&L, trades (the journal), tilt score (computed in `lib/tilt.ts` from consecutive losses / giving-back / fast-reentry), reentry countdown, guardrail config (daily goal, max loss, max trades, max lots), and regime context. Hydrates on launch, then persists on change.
- **`OrderContext`** — the order ticket and placed orders. On a fill it bridges an executed entry into the session journal (`addTrade`). With no broker configured (`EXPO_PUBLIC_DOMAIN` unset) it fills locally and flags the order `simulated`; if a broker proxy URL is set, it POSTs to `${EXPO_PUBLIC_DOMAIN}/api/orders` and surfaces the real outcome (no fabricated fills).

Dashboard market data (signals, alerts, context tiles, chart candles) is **simulated demo data**, clearly labeled in the UI.

## Deployment

See [DEPLOY.md](DEPLOY.md). The web build is `expo export --platform web` served by `server/serve.js`; native builds go through Expo.
