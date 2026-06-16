# Deployment

This document captures how the app is built, run, and deployed.

## Deployment target

- **Deployment model**: static site / autoscale (the SPA is static files; any
  static host or Node process can serve it).
- **Router type**: SPA — unknown non-asset routes must fall back to `index.html`
  so `react-router` client routing works on deep links.
- **Post-build step**: prune the pnpm store (`pnpm store prune`) with `CI=true`
  to keep deployment images small.
- **Node.js**: 24.

## TradeSlayer Pro — Web (`@workspace/web`)

A pure React + Vite single-page app (desktop-first, local-first). No backend.

- **Kind**: web (Vite SPA)
- **Title**: TradeSlayer Pro
- **Version**: 1.0.0
- **Listening port**: 18115
- **Mounted paths**: `/`
- **Base path**: `/`
- **Dev command**: `pnpm --filter @workspace/web run dev` (Vite dev server, HMR)
- **Production build**: `pnpm --filter @workspace/web run build`
  - Runs `vite build` → static SPA bundle in `artifacts/web/dist/`.
- **Production run**: `pnpm --filter @workspace/web run serve`
  - Serves `dist/` via `server/serve.js` (zero deps) with SPA fallback.
  - Environment: `PORT=18115`, `BASE_PATH=/`
- **Healthcheck / preview reachability**: `GET /status` (also `/health`) → `200 {"status":"ok"}`

> Any static host (Netlify/Vercel/S3+CloudFront/nginx) works — just configure the
> SPA history fallback to `index.html`. `vite preview` also serves the build for a
> quick local check.

## Configuration

- `VITE_BACKEND` (optional) — base URL of a broker proxy. When set, order submission
  POSTs to `${VITE_BACKEND}/api/orders` and surfaces the real fill/reject outcome.
  When unset (default), orders fill locally as transparent **simulated** entries.
