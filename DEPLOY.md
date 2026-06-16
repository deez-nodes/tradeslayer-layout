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

### TradeSlayer Pro — Mobile (`@workspace/mobile`)

- **Kind**: mobile (Expo)
- **Title**: TradeSlayer Pro
- **Version**: 1.0.0
- **Listening port**: 18115
- **Mounted paths**: `/`
- **Base path**: `/`
- **Integrated skill**: Expo (v1.0.0)
- **Dev command**: `pnpm --filter @workspace/mobile run dev`
- **Production build**: `pnpm --filter @workspace/mobile run build`
- **Production run**: `pnpm --filter @workspace/mobile run serve`
- **Preview reachability check**: `/status`
- **Environment**: `PORT=18115`, `BASE_PATH=/`

> Note: this artifact originally used an Expo-domain router for hosted preview.
> Locally, run the Expo dev server directly (see `artifacts/mobile/package.json`
> `dev` script).

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
