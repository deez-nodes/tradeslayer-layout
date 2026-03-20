# TradeSlayer Pro — Layout Structure
## Target: Galaxy S23 Ultra (412 × 915 dp / 1440 × 3088 px)
## Platform: Replit Web App (PWA-ready)

---

## Device Constraints

```
Galaxy S23 Ultra
  Viewport:        412 × 915 CSS px (logical)
  Physical:        1440 × 3088 px
  DPR:             3.5
  Safe area top:   ~48px (status bar + notch)
  Safe area bottom: ~34px (gesture nav)
  Usable height:   ~833px (915 - 48 - 34)
  Bottom nav:      56px fixed
  Scrollable area: ~777px
```

---

## Global Shell

```
┌─────────────────────────────────┐ ← 0px (status bar safe area)
│        STATUS BAR (48px)        │
├─────────────────────────────────┤
│                                 │
│                                 │
│       SCROLLABLE CONTENT        │
│       (fills remaining)         │
│                                 │
│                                 │
├─────────────────────────────────┤
│  ◉ Dashboard  ◉ Session  ◉ Cards  ◉ Journal │ ← Bottom Nav (56px)
├─────────────────────────────────┤
│      GESTURE NAV (34px)         │
└─────────────────────────────────┘
```

### Bottom Navigation Tabs (4 primary views)

| Tab | Icon | Label | Purpose |
|-----|------|-------|---------|
| 1 | pulse/activity | Dashboard | HUD — Layers 0-2 persistent |
| 2 | shield | Session | Guardrails, tilt, P&L |
| 3 | layers | Cards | Strategy card browser (existing) |
| 4 | book | Journal | Trade log + review |

---

## Tab 1: Dashboard (HUD)

The persistent heads-up display. Shows Layers 0–2 from the composition priority: Regime, Context, Signal.

```
┌─────────────────────────────────┐
│ TRADESLAYER              ⚙️ 🔔  │ ← App bar (48px)
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │  REGIME BADGE               │ │ ← 64px tall
│ │  🟢 TRENDING  ADX 31  H .62│ │    Regime + Hurst (Layer 0)
│ └─────────────────────────────┘ │
│                                 │
│ ┌──────────┐ ┌──────────┐      │ ← Context row (Layer 1)
│ │  VWAP    │ │  IV/RV   │      │    80px per card
│ │ 5,214.50 │ │  0.87    │      │
│ │ ▲ Above  │ │ Compress │      │
│ └──────────┘ └──────────┘      │
│ ┌──────────┐ ┌──────────┐      │
│ │  POC     │ │  ATR     │      │
│ │ 5,208.25 │ │  12.5    │      │
│ │  Prev    │ │  Normal  │      │
│ └──────────┘ └──────────┘      │
│                                 │
│ ┌─────────────────────────────┐ │ ← Signal strip (Layer 2)
│ │ CVD ▲+2.4K │ MACD ● bull  │ │    48px, horizontal scroll
│ │ CCI  72    │ Z  -0.3      │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ ← Session snapshot (always visible)
│ │ SESSION    $+380   4 trades │ │    56px
│ │ ████████████░░░  Goal: $400 │ │    Progress bar to daily goal
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ ← Tilt meter (compact)
│ │ TILT ■■■■□□□□□□  18/100 🟢 │ │    40px
│ └─────────────────────────────┘ │
│                                 │
│ ── ALERTS ──────────────────── │ ← Alert feed (scrollable)
│ ⚠ H&S forming on 15m           │
│ 🔵 Pearson corr SPY: 0.91     │
│ 🟡 TRIN 1.4 — breadth weak    │
│                                 │
└─────────────────────────────────┘
```

### Dashboard Component Sizing

| Component | Height | Layout |
|-----------|--------|--------|
| App bar | 48px | Fixed top |
| Regime badge | 64px | Full width |
| Context grid | 168px | 2×2 grid, 16px gap |
| Signal strip | 48px | Horizontal scroll row |
| Session snapshot | 56px | Full width |
| Tilt meter | 40px | Full width |
| Alert feed | Remaining | Scrollable list |

---

## Tab 2: Session Control

The behavioral enforcement layer. Houses all guardrails, commission calc, reentry countdown.

```
┌─────────────────────────────────┐
│ SESSION CONTROL         Reset 🔄│ ← App bar
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │  SESSION P&L       $+380   │ │ ← P&L hero (80px)
│ │  Peak: $420  │ Trades: 4/10│ │    Color-coded background
│ │  ████████████████░░░░  95% │ │    glow: green/blue/yellow/red
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  TILT SCORE              🟢│ │ ← Tilt detector (120px)
│ │         18 / 100            │ │    Circular gauge
│ │     ╭───────────╮           │ │
│ │     │  ◉ green  │           │ │
│ │     ╰───────────╯           │ │
│ │  consec losses: 0           │ │
│ │  giving back: no            │ │
│ │  fast reentry: no           │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ ← Reentry countdown (72px)
│ │  REENTRY COUNTDOWN          │ │    Shows when active
│ │  ⏱ 1:42 remaining          │ │    Hidden when clear
│ │  ████████░░░░░░░░           │ │
│ │  Override (logged) →        │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ ← Commission check (96px)
│ │  COMMISSION CHECK           │ │
│ │  Lots: [2]  Instrument: MES │ │
│ │  RT cost: $8.00             │ │
│ │  Cost/Win: 4.8%  🟢 GOOD   │ │
│ │  Break-even WR: 52%        │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ ← Guardrail status (compact)
│ │ GUARDRAILS                  │ │
│ │ Daily goal    $400    ✅    │ │
│ │ Max loss     -$500    ✅    │ │
│ │ Max trades    10      4/10  │ │
│ │ Max lots      2       ✅    │ │
│ │ Walk-away     50%     ✅    │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Session States & Color Logic

| State | Condition | Background accent |
|-------|-----------|------------------|
| Active | P&L positive, below goal | Green glow (subtle) |
| At Goal | P&L ≥ daily goal | Blue glow — "consider stopping" |
| Giving Back | P&L < 50% of session peak | Yellow pulse |
| Max Loss | P&L ≤ -$500 | Red — hard stop overlay |
| Stopped | Session ended | Muted/disabled |

---

## Tab 3: Strategy Cards (Existing — Enhanced)

Matches the existing Replit implementation. Additions: card detail view with tier system.

```
┌─────────────────────────────────┐
│ Strategy Cards            ✏️ 📈│ ← Existing header
│ 10 trading playbooks            │
├─────────────────────────────────┤
│ 🔍 Search strategies...        │ ← Search bar
│                                 │
│ [All] [Trend] [Momentum] [MR]→ │ ← Category filter (h-scroll)
│                                 │
│ ┌─────────────────────────────┐ │ ← Card list (existing layout)
│ │ ● TREND FOLLOWING        🔖│ │
│ │ Trend Continuation          │ │
│ │ Scalp within confirmed...   │ │
│ │ [Intraday] [Swing]  🟢 Low │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ● MEAN REVERSION        🔖│ │
│ │ Liquidity Sweep Reversal    │ │
│ │ Enter after sweep + recl... │ │
│ │ [Scalp] [Intraday]  🔴 High│ │
│ └─────────────────────────────┘ │
│ ...                             │
└─────────────────────────────────┘
```

### Card Detail View (tap to expand — full screen slide-up)

```
┌─────────────────────────────────┐
│ ← Back     Trend Continuation   │ ← Detail header
├─────────────────────────────────┤
│ Regime: 🟢 Aligned (trending)  │ ← Regime compatibility
├─────────────────────────────────┤
│ TIER 1 — CONDITIONS             │ ← Collapsible section
│ ☑ EMAs stacked in direction     │
│ ☑ Higher TF aligned             │
│ ☐ Volume > [___] percentile     │    number input
│ ☑ Thesis conviction identified  │
│                                 │
│ Score: 3/4 conditions met  🟢  │
├─────────────────────────────────┤
│ TIER 2 — RED FLAGS              │
│ ⚠ No fundamental thesis    (×2) │
│ ○ Counter-trend on daily   (×1) │
│ ○ First 15 min of session  (×1) │
│ ○ Last trade was a loss    (×1) │
│                                 │
│ Weight: 0  🟢                   │
├─────────────────────────────────┤
│ TIER 3 — EXECUTION              │
│ ☐ Enter on pullback to EMA      │
│ ☐ Stop below structure           │
│ ☐ Scale: half at entry           │
│ ☐ First target prior swing       │
│ ☐ Trail runner above VWAP        │
├─────────────────────────────────┤
│ CROSS-CUTTING                   │
│ Tilt: 18 🟢 │ Reentry: clear   │
│ Commission: 4.8% 🟢             │
│ Trades: 4/10                    │
├─────────────────────────────────┤
│  [ LOG TRADE WITH THIS CARD ]   │ ← Primary CTA
└─────────────────────────────────┘
```

---

## Tab 4: Journal

Trade log and session review. Where override data accumulates for future analysis.

```
┌─────────────────────────────────┐
│ JOURNAL                  Filter │
├─────────────────────────────────┤
│ Today — Mar 19, 2026            │
│ ┌─────────────────────────────┐ │
│ │ #1  Trend Cont.  MES  +$85 │ │ ← Trade entry
│ │     10:14a  4 min  2 lots   │ │
│ │     Tilt: 8  Override: 0    │ │
│ │     TP hit ■                │ │    barrier label
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ #2  OB Scalp     MES  -$20 │ │
│ │     10:32a  1 min  1 lot    │ │
│ │     Tilt: 14  Override: 0   │ │
│ │     SL hit ■                │ │
│ └─────────────────────────────┘ │
│ ...                             │
│                                 │
│ ── SESSION SUMMARY ──          │
│ Trades: 4  │  Win rate: 75%    │
│ Net P&L: +$380                 │
│ Overrides: 1 (reentry)         │
│ Tilt peak: 22                  │
│ Commission total: $32          │
│ Green day profile: ✅ MATCH    │
│                                 │
│ ── WEEKLY HEAT MAP ──          │
│ M  T  W  T  F                  │
│ 🟩 🟩 🟨 ⬜ ⬜                  │
│                                 │
└─────────────────────────────────┘
```

---

## Overlay / Modal Screens

### Pre-Trade Checklist (triggered from card detail CTA)

```
┌─────────────────────────────────┐
│         PRE-TRADE CHECK         │
│                                 │
│  Card: Trend Continuation       │
│  Regime: 🟢 Aligned            │
│  Tilt: 18 🟢                   │
│  Reentry: Clear ✅              │
│  Commission: 4.8% 🟢           │
│  Trades remaining: 6           │
│  Guardrails: All clear ✅      │
│                                 │
│  Lots: [2]  Stop: [___]        │
│  Target: [___]                  │
│                                 │
│  [ CONFIRM ENTRY ]              │ ← green if all clear
│  [ CANCEL ]                     │
│                                 │
│  ⚠ 1 red flag active (wt: 1)  │ ← yellow bar if flags
└─────────────────────────────────┘
```

### Hard Stop Overlay (max loss breached)

```
┌─────────────────────────────────┐
│                                 │
│          🔴 SESSION OVER        │
│                                 │
│   Daily max loss reached        │
│   Net P&L: -$520               │
│   Trades: 8                     │
│   Tilt peak: 74                 │
│                                 │
│   Review your journal entry     │
│   before tomorrow.              │
│                                 │
│   [ VIEW JOURNAL ]              │
│   [ CLOSE ]                     │
│                                 │
└─────────────────────────────────┘
```

---

## Design System Tokens

### Color Palette (dark theme — matching existing screenshots)

```css
:root {
  /* Backgrounds */
  --bg-primary:      #0a0e1a;     /* deep navy-black */
  --bg-card:         #111827;     /* card surfaces */
  --bg-card-hover:   #1a2236;     /* card interaction */
  --bg-elevated:     #1e293b;     /* modals, overlays */

  /* Borders */
  --border-default:  #1e293b;
  --border-subtle:   #162032;
  --border-focus:    #00e5a0;     /* teal accent from screenshots */

  /* Accent — Primary (teal/mint from existing app) */
  --accent-primary:  #00e5a0;
  --accent-primary-dim: #00e5a033;

  /* Semantic — Status */
  --status-green:    #00e5a0;
  --status-yellow:   #f5a623;
  --status-red:      #ef4444;
  --status-blue:     #3b82f6;

  /* Category left-border colors (from screenshots) */
  --cat-trend:       #3b82f6;     /* blue */
  --cat-momentum:    #8b5cf6;     /* purple */
  --cat-mean-rev:    #f5a623;     /* orange */
  --cat-breakout:    #00e5a0;     /* teal */

  /* Text */
  --text-primary:    #f1f5f9;
  --text-secondary:  #94a3b8;
  --text-muted:      #64748b;

  /* Typography */
  --font-display:    'JetBrains Mono', monospace;  /* numbers, data */
  --font-body:       'DM Sans', sans-serif;         /* labels, text */
  --font-size-xs:    11px;
  --font-size-sm:    13px;
  --font-size-base:  15px;
  --font-size-lg:    18px;
  --font-size-xl:    24px;
  --font-size-hero:  32px;

  /* Spacing (4px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-elevated: 0 8px 24px rgba(0,0,0,0.5);
}
```

---

## Component Inventory

| Component | Used In | Data Source |
|-----------|---------|-------------|
| RegimeBadge | Dashboard | Layer 0 — ADX, Hurst |
| ContextTile (×4) | Dashboard | Layer 1 — VWAP, POC, ATR, IV/RV |
| SignalStrip | Dashboard | Layer 2 — CVD, MACD, CCI, Z-Score |
| SessionBar | Dashboard, Session | SessionGuardrails state |
| TiltMeter | Dashboard (compact), Session (full) | TiltDetector |
| AlertFeed | Dashboard | Pattern bools, TRIN, Pearson |
| ReentryCountdown | Session | ReentryCountdown timer |
| CommissionCalc | Session, Pre-Trade | CommissionCalculator |
| GuardrailStatus | Session | SessionGuardrails |
| StrategyCardList | Cards tab | Strategy card data |
| StrategyCardDetail | Cards tab (slide-up) | Card + tier checks |
| PreTradeChecklist | Modal overlay | Cross-cutting state |
| TradeLogEntry | Journal | Logged trade data |
| SessionSummary | Journal | End-of-session rollup |
| WeeklyHeatMap | Journal | Daily P&L history |
| HardStopOverlay | Global modal | Max loss trigger |
| BottomNav | Global shell | Tab routing |

---

## Navigation Flow

```
App Launch
  └→ Dashboard (default tab)
       ├→ Tap alert → slide-up detail
       └→ Tap session bar → switch to Session tab

Session Tab
  ├→ Commission calc → inline edit lots/instrument
  ├→ Reentry countdown → override button (logged)
  └→ Hard stop triggered → overlay modal

Cards Tab (existing)
  ├→ Filter/search → card list
  ├→ Tap card → slide-up CardDetail
  │    ├→ Check tiers → fill conditions
  │    └→ "Log Trade" → PreTradeChecklist modal
  │         └→ Confirm → creates Journal entry, updates Session
  └→ Bookmark → Saved view

Journal Tab
  ├→ Trade list → tap to expand detail
  ├→ Session summary (bottom of day)
  └→ Weekly heat map → tap day for day view
```

---

## Responsive Notes

The Galaxy S23 Ultra at 412dp is the primary target. For broader Replit deployment:

| Breakpoint | Behavior |
|-----------|----------|
| < 380px | Stack context tiles 1-column, reduce font sizes |
| 380–420px | **Primary target** — 2-column context grid |
| 420–768px | Same mobile layout, slightly wider cards |
| 768px+ | Not targeted (tablet/desktop would need redesign) |

Touch targets: minimum 44×44px per WCAG. All interactive elements padded accordingly.

---

## File Structure (Replit)

```
/src
  /components
    /dashboard
      RegimeBadge.jsx
      ContextTile.jsx
      SignalStrip.jsx
      AlertFeed.jsx
    /session
      SessionPnl.jsx
      TiltMeter.jsx
      ReentryCountdown.jsx
      CommissionCalc.jsx
      GuardrailStatus.jsx
      HardStopOverlay.jsx
    /cards
      StrategyCardList.jsx      (existing — enhance)
      StrategyCardDetail.jsx
      PreTradeChecklist.jsx
    /journal
      TradeLogEntry.jsx
      SessionSummary.jsx
      WeeklyHeatMap.jsx
    /shared
      BottomNav.jsx
      AppShell.jsx
      StatusDot.jsx
      ProgressBar.jsx
      PillBadge.jsx
  /hooks
    useTiltScore.js
    useSessionGuardrails.js
    useReentryTimer.js
    useCommissionCalc.js
    useRegimeDetection.js
  /data
    strategyCards.js             (seed cards from system data)
    performanceBaseline.js
  /styles
    tokens.css                   (design tokens above)
    global.css
  App.jsx
  index.html
```
