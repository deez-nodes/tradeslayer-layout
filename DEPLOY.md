# Deployment

This document captures how each application in the monorepo is meant to be run
and deployed. It records the dev/build/run commands, ports, and healthcheck
paths for each deployable artifact.

## Deployment target

- **Deployment model**: autoscale (the service scales based on traffic; instances
  are spun up/down on demand).
- **Router type**: application router. Each service is mounted at its configured
  path prefix(es) and routed accordingly.
- **Post-build step**: prune the pnpm store (`pnpm store prune`) with `CI=true`
  to keep deployment images small.
- **Post-merge hook**: `scripts/post-merge.sh` (timeout 20s).
- **Node.js**: 24.

## Applications

### API Server (`@workspace/api-server`)

- **Kind**: API service
- **Title**: API Server
- **Version**: 1.0.0
- **Listening port**: 8080
- **Mounted paths**: `/api`
- **Dev command**: `pnpm --filter @workspace/api-server run dev`
- **Production build**: `pnpm --filter @workspace/api-server run build`
- **Production run**: `node artifacts/api-server/dist/index.cjs`
  - Environment: `PORT=8080`
- **Healthcheck (startup)**: `GET /api/healthz`

### TradeSlayer Pro — Web (`@workspace/mobile`)

The app is built with Expo (Expo Router + React Native) and ships to the **web**
via `react-native-web` (one codebase, `Platform.OS === 'web'` branches + a
responsive shell). Native iOS/Android remain buildable via `build:native`.

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

### Component Preview Server (`@workspace/mockup-sandbox`)

- **Kind**: design / component preview
- **Title**: Component Preview Server
- **Version**: 1.0.0
- **Listening port**: 8081
- **Mounted paths**: `/__mockup`
- **Base path**: `/__mockup`
- **Dev command**: `pnpm --filter @workspace/mockup-sandbox run dev`
- **Environment**: `PORT=8081`, `BASE_PATH=/__mockup`

> No production build/run command is defined for this artifact; it is a
> development-time preview server.
