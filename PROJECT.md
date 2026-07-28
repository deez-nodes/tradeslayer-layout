# Project: TradeSlayer Pro — Test Suite & Performance Optimization

## Architecture
- Frontend Application: React 19 + TypeScript + Vite web app located at `artifacts/web`.
- Core Modules:
  - Domain Logic: `artifacts/web/src/lib/tilt.ts`, `artifacts/web/src/lib/storage.ts`.
  - React Contexts: `artifacts/web/src/context/SessionContext.tsx`, `artifacts/web/src/context/OrderContext.tsx` (or similar extensions).
  - UI Components & Day-Trading Workflows: Session lifecycle, simulated order placement/filling, tilt warning triggers, journal calculations.
- Test Stack: Vitest, React Testing Library (`@testing-library/react`), `@testing-library/user-event`, jsdom or happy-dom, `@vitest/coverage-v8`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Unit & Domain Logic Test Suite | Setup Vitest/RTL testing framework; 100% passing unit tests for `lib/tilt.ts` & `lib/storage.ts` | None | PLANNED |
| 2 | Context & Workflow Integration Test Suite | Comprehensive unit/integration tests for `SessionContext`, `OrderContext`, session lifecycle, orders, guardrails, journal calculations | M1 | PLANNED |
| 3 | Quality Assurance & Performance Optimization | 0 TS errors (`typecheck`), >=80% line coverage in `lib/` and `context/`, clean `dist/` build output, bundle size optimization | M2 | PLANNED |
| 4 | Final Verification & Forensic Audit | End-to-end verification of all R1-R3 requirements, 100% passing test suite, clean Forensic Audit gate | M3 | PLANNED |

## Interface Contracts & Requirements
- **R1. Unit & Logic Tests**:
  - `lib/tilt.ts`: Test tilt level computation, risk metrics, score adjustments, threshold triggers, edge cases.
  - `lib/storage.ts`: Test persistence/retrieval, serialization, fallback defaults, quota/error handling.
  - `SessionContext`: Test starting session, updating metrics, ending session, state persistence, reset actions.
  - `OrderContext`: Test order placement, execution/fill simulation, order cancellation, position tracking, PnL calculations.
- **R2. Integration & Component Workflow Verification**:
  - Workflow 1: Session Lifecycle (start session -> record trades -> end session -> journal entry generated).
  - Workflow 2: Order Execution (place market/limit order -> simulated fill -> position update -> PnL update).
  - Workflow 3: Guardrails & Tilt Warning Triggers (drawdown limit exceeded / consecutive loss threshold -> tilt warning modal/alert triggered).
  - Workflow 4: Journal Calculations (trade aggregation, win rate, profit factor, drawdown metrics).
- **R3. Quality Assurance & Performance Optimization**:
  - Test runner: `pnpm run test` (or test command in package.json/artifacts/web). Must pass 100%.
  - Line Coverage: >= 80% line coverage for files under `src/lib/` and `src/context/`.
  - Typecheck: `pnpm run typecheck` completes with 0 errors.
  - Production Build: `pnpm run build` creates valid, clean bundle output in `artifacts/web/dist/`.
  - Performance Optimization: Optimize bundle sizes (manual code splitting, dynamic imports, vendor chunking as needed), ensure fast render cycles.

## Code Layout
```
artifacts/web/
├── src/
│   ├── lib/
│   │   ├── tilt.ts
│   │   ├── storage.ts
│   │   └── ...
│   ├── context/
│   │   ├── SessionContext.tsx
│   │   ├── OrderContext.tsx
│   │   └── ...
│   ├── components/
│   │   └── ...
│   ├── __tests__/ or *.test.ts / *.test.tsx
│   └── test/
│       ├── setup.ts
│       └── ...
├── package.json
├── vite.config.ts
└── tsconfig.json
```
