# Deployment

This document captures how the app is run and deployed — the dev/build/run
commands, ports, and healthcheck path.

## Deployment target

- **Deployment model**: autoscale (the service scales based on traffic; instances
  are spun up/down on demand).
- **Router type**: application router, mounted at `/`.
- **Post-build step**: prune the pnpm store (`pnpm store prune`) with `CI=true`
  to keep deployment images small.
- **Node.js**: 24.

## TradeSlayer Pro — Web (`@workspace/mobile`)

The app is built with Expo (Expo Router + React Native) and ships to the **web**
via `react-native-web` (one codebase, `Platform.OS === 'web'` branches + a
responsive shell). It is **local-first** — no backend service; data persists
on-device via AsyncStorage. Native iOS/Android remain buildable via `build:native`.

- **Kind**: web (Expo / react-native-web, single-page app)
- **Title**: TradeSlayer Pro
- **Version**: 1.0.0
- **Listening port**: 18115
- **Mounted paths**: `/`
- **Base path**: `/`
- **Web dev command**: `pnpm --filter @workspace/mobile run web` (Expo web dev server)
- **Production build**: `pnpm --filter @workspace/mobile run build`
  - Runs `expo export --platform web --output-dir dist` (static SPA bundle).
- **Production run**: `pnpm --filter @workspace/mobile run serve`
  - Serves `dist/` via `server/serve.js` with SPA fallback for client routing.
  - Environment: `PORT=18115`, `BASE_PATH=/`
- **Healthcheck / preview reachability**: `GET /status` (also `/health`) → `200 {"status":"ok"}`

> Responsive shell: a centered, phone-faithful column on narrow viewports; a
> left sidebar + multi-column dashboard at ≥900px wide.
>
> Native (Expo Go) path is preserved: `pnpm --filter @workspace/mobile run dev`
> for the Metro dev server and `run build:native` for the static Expo Go bundle
> (`scripts/build.js` → `static-build/`).
