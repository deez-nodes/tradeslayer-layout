import { useState } from "react";
import { Checkbox, Section, Pill, Divider, STRATEGY_COLORS as C } from "./StrategyCardCommon";

export default function LiquidityRegimeCard() {
  const [activeTab, setActiveTab] = useState("identify");
  const tabs = [
    { id: "identify", label: "IDENTIFY", icon: "🔍" },
    { id: "high", label: "HIGH LIQ", icon: "🌊" },
    { id: "low", label: "LOW LIQ", icon: "🏜" },
    { id: "adapt", label: "ADAPT", icon: "⚡" },
    { id: "risk", label: "RISK", icon: "⛊" },
  ];

  return (
    <div style={{ background: "#010409", minHeight: "100vh", color: "#c9d1d9", fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace", padding: "0" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(180deg, #0d1117 0%, #010409 100%)", borderBottom: "1px solid #21262d", padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #f0883e 0%, #c45d15 50%, #7a3510 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 0 20px #f0883e30" }}>
            💧
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono', monospace" }}>
              LIQUIDITY REGIME STRATEGY
            </h1>
            <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>ES / MES INTRADAY · SHORT vs LONG-TERM LIQUIDITY · VOLUME PROFILE</div>
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "10px", color: "#484f58", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontWeight: 700 }}>★ HIGH-CONVICTION SIGNALS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Pill text="High liq: scalp off volume nodes, tight stops, high frequency" color={C.long} />
            <Pill text="Low liq: wider stops, limit orders only, swing for bigger targets" color={C.warn} />
            <Pill text="Long-term liq at key level = institutional anchor → high conviction S/R" color={C.cyan} />
            <Pill text="Short-term liq flash = fakeout bait → don't chase" color={C.purple} />
            <Pill text="Volume profile shape (P/B/D) reveals regime before price confirms" color={C.info} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid #21262d", background: "#0d1117", padding: "0 12px", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: "none", border: "none", padding: "10px 16px", cursor: "pointer", fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            color: activeTab === tab.id ? (tab.id === "high" ? C.long : tab.id === "low" ? C.warn : tab.id === "adapt" ? C.purple : tab.id === "risk" ? C.short : C.info) : "#484f58",
            borderBottom: activeTab === tab.id ? `2px solid ${tab.id === "high" ? C.long : tab.id === "low" ? C.warn : tab.id === "adapt" ? C.purple : tab.id === "risk" ? C.short : C.info}` : "2px solid transparent",
            letterSpacing: "0.5px", whiteSpace: "nowrap", transition: "all 0.15s",
          }}>
            <span style={{ marginRight: "6px" }}>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 14px", maxWidth: "720px", margin: "0 auto" }}>

        {/* ══════ IDENTIFY ══════ */}
        {activeTab === "identify" && (
          <>
            <Section title="Long-Term vs Short-Term Liquidity" color={C.info} icon="🔍" defaultOpen={true}>
              <Divider label="Long-Term Liquidity" />
              <Checkbox label="Large resting orders that persist in the book for minutes to hours" sublabel="Define structural levels — these are the anchors institutions defend" accent={C.cyan} />
              <Checkbox label="Visible as: dense heatmap bands that don't fade, high-volume nodes on profile" accent={C.cyan} />
              <Checkbox label="Key levels: PDH/PDL, VWAP, weekly VPOC, prior session balance edges" accent={C.cyan} />
              <Checkbox label="LT Pro filtered (≥5 lot): long-term liquidity dominates the large-order view" accent={C.cyan} />
              <Checkbox label="Behavior: holds through multiple tests, absorbs aggressive flow, defines value" accent={C.cyan} />

              <Divider label="Short-Term Liquidity" />
              <Checkbox label="Orders that flash briefly — appear and disappear within seconds to minutes" sublabel="Can distort the auction temporarily, often triggers fakeouts and stop hunts" accent={C.purple} />
              <Checkbox label="Visible as: flickering heatmap bands, Liquidity Marker add/pull events" accent={C.purple} />
              <Checkbox label="Often HFT or algo-generated: momentum-chasing orders, spoofs, quote stuffing" accent={C.purple} />
              <Checkbox label="Tradermap Pro bot filter: reveals short-term liquidity that's algorithmic" accent={C.purple} />
              <Checkbox label="Behavior: creates temporary support/resistance that breaks easily under pressure" accent={C.purple} />
            </Section>

            <Section title="Volume Profile Shapes — Regime Detection" color={C.info} icon="📊" defaultOpen={true}>
              <Checkbox label="D-SHAPE (bell curve): balanced market, value accepted → range/mean-reversion regime" sublabel="High liq environment: scalp from edges, fade extremes back to VPOC" accent={C.info} />
              <Checkbox label="P-SHAPE: volume concentrated at top, thin at bottom → buying trend / short covering" sublabel="Price accepted value higher: buy dips into volume nodes, trail runners" accent={C.long} />
              <Checkbox label="B-SHAPE: volume concentrated at bottom, thin at top → selling trend / long liquidation" sublabel="Price accepted value lower: sell rallies into volume nodes, trail runners" accent={C.short} />
              <Checkbox label="DOUBLE DISTRIBUTION: two volume clusters with thin bridge → breakout pending" sublabel="Low liq bridge zone: volatile transition area, trade the break with direction" accent={C.warn} />
              <Checkbox label="LOW-VOLUME NODE (LVN): price passed quickly → future fast-move zone" accent={C.warn} />
              <Checkbox label="HIGH-VOLUME NODE (HVN): heavy participation → magnet/anchor level for mean reversion" accent={C.info} />
            </Section>

            <Section title="Measuring Current Liquidity Regime" color={C.cyan} icon="📏">
              <Checkbox label="Spread check: ES spread = 1 tick = high liq. Spread > 1 tick = degrading liquidity" accent={C.info} />
              <Checkbox label="Volume check: current 30m bar vs 20d avg — > 100% = high liq, < 50% = low liq" accent={C.info} />
              <Checkbox label="Heatmap depth: dense bands on both sides = high liq. Sparse/thin = low liq" accent={C.info} />
              <Checkbox label="LT Pro bid/ask lines: fat lines = deep book = high liq. Thin lines = shallow" accent={C.info} />
              <Checkbox label="Time of day: 9:45-11:30 ET & 14:00-15:30 ET = peak liq. 12:00-13:30 = low liq" accent={C.warn} />
              <Checkbox label="VIX context: < 15 = stable/high liq. 15-25 = normal. > 25 = degrading. > 35 = crisis" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ HIGH LIQ ══════ */}
        {activeTab === "high" && (
          <>
            <Section title="High Liquidity — Strategy Adjustments" color={C.long} icon="🌊" defaultOpen={true}>
              <Divider label="What Works" />
              <Checkbox label="Scalping: tight spreads enable high-frequency entries with minimal cost" accent={C.long} />
              <Checkbox label="Mean reversion: fade extremes back to VPOC / HVN — price gravitates to value" accent={C.long} />
              <Checkbox label="Order flow reads are CLEANER: heatmap signals more reliable, less noise" accent={C.long} />
              <Checkbox label="Absorption / iceberg setups: passive walls hold better in deep books" accent={C.long} />
              <Checkbox label="Tight stops work: 4-6 tick stops are viable, slippage minimal" accent={C.long} />

              <Divider label="Entry Playbook" />
              <Checkbox label="LONG: buy at HVN support + bid-side absorption + CVD positive → tight stop, scalp target" accent={C.long} />
              <Checkbox label="SHORT: sell at HVN resistance + ask-side absorption + CVD negative → tight stop, scalp target" accent={C.short} />
              <Checkbox label="RANGE: fade the extremes of the D-shaped profile back to VPOC" accent={C.info} />
              <Checkbox label="TREND: buy pullbacks to HVN in P-shape, sell rallies to HVN in B-shape" accent={C.info} />

              <Divider label="Targets & Exits" />
              <Checkbox label="Scalp T1: +4-6 ticks (VPOC, nearest HVN, or first structural level)" accent={C.long} />
              <Checkbox label="Position: scale out at each volume node — they act as speed bumps" accent={C.long} />
              <Checkbox label="Exit signal: spread widens beyond 1 tick = liquidity degrading, reduce size" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ LOW LIQ ══════ */}
        {activeTab === "low" && (
          <>
            <Section title="Low Liquidity — Strategy Adjustments" color={C.warn} icon="🏜" defaultOpen={true}>
              <Divider label="Characteristics" />
              <Checkbox label="Wider spreads: ES spread > 1 tick → higher per-trade cost" accent={C.warn} />
              <Checkbox label="Slippage risk: market orders fill worse, stops get blown through" accent={C.warn} />
              <Checkbox label="Volatility spikes: small orders move price disproportionately" accent={C.warn} />
              <Checkbox label="False signals: heatmap spoofs have outsized impact, order flow is noisier" accent={C.warn} />
              <Checkbox label="Gaps in book: LVNs become fast-move zones, price can jump multiple ticks" accent={C.warn} />

              <Divider label="Adaptation Rules" />
              <Checkbox label="Reduce position size: cut to 50% of normal sizing in low liq" accent={C.short} />
              <Checkbox label="LIMIT ORDERS ONLY: never market order in thin conditions — slippage will eat you" accent={C.short} />
              <Checkbox label="Widen stops: add 2-4 extra ticks — thin book means more noise before signal" accent={C.warn} />
              <Checkbox label="Bigger targets: low liq = bigger moves when they happen → swing for +8-16 ticks" accent={C.long} />
              <Checkbox label="Avoid scalping: spread + slippage makes high-frequency unprofitable" accent={C.short} />
              <Checkbox label="Break up large orders: if trading multiple contracts, scale in/out incrementally" sublabel="1000 shares as 10×100 spaced out — blend with normal flow, reduce impact" accent={C.warn} />

              <Divider label="Entry Playbook" />
              <Checkbox label="LONG: only at MAJOR structural support (VWAP, PDL, weekly HVN) with limit order" accent={C.long} />
              <Checkbox label="SHORT: only at MAJOR structural resistance with limit order" accent={C.short} />
              <Checkbox label="Confirmation required: long-term liquidity must be present (LT Pro large-order filter)" sublabel="Short-term liquidity alone is not enough in thin conditions — it will evaporate" accent={C.cyan} />
              <Checkbox label="Avoid: LVN zones in thin conditions — they become gap zones with no stops working" accent={C.short} />
            </Section>
          </>
        )}

        {/* ══════ ADAPT ══════ */}
        {activeTab === "adapt" && (
          <>
            <Section title="Regime Transition Detection" color={C.purple} icon="⚡" defaultOpen={true}>
              <Checkbox label="Monitor spread continuously: widening from 1→2 ticks = transition from high→low liq" accent={C.purple} />
              <Checkbox label="Volume pace: 30m bar volume dropping below 75% of 20d avg = liquidity fading" accent={C.purple} />
              <Checkbox label="LT Pro bid/ask lines narrowing = book thinning = regime shift incoming" accent={C.purple} />
              <Checkbox label="Time-based transitions: expect shift at ~11:30 ET (lunch low liq) and ~14:00 ET (return)" accent={C.purple} />
              <Checkbox label="News-driven: liquidity pulls 2-5 min before scheduled events, returns 2-5 min after" accent={C.purple} />
            </Section>

            <Section title="Switching Strategy by Regime" color={C.orange} icon="🔄" defaultOpen={true}>
              <Divider label="High → Low Transition" />
              <Checkbox label="Stop scalping immediately when spread widens or volume drops" accent={C.warn} />
              <Checkbox label="Flatten runners or tighten stops — thin book can reverse fast" accent={C.warn} />
              <Checkbox label="Switch to: limit orders only, wider stops, bigger targets, fewer trades" accent={C.warn} />
              <Checkbox label="Reduce size by 50% until regime stabilizes" accent={C.warn} />

              <Divider label="Low → High Transition" />
              <Checkbox label="Wait for spread to return to 1 tick and volume to normalize before resuming scalping" accent={C.long} />
              <Checkbox label="Tighten stops back to standard (4-6 ticks)" accent={C.long} />
              <Checkbox label="Resume full position sizing once 2+ consecutive 30m bars show normal volume" accent={C.long} />
              <Checkbox label="Reactivate absorption/iceberg setups — these work best in deep books" accent={C.long} />

              <Divider label="Intraday Rhythm" />
              <Checkbox label="9:30-9:45: opening rotation — chaotic, mixed liq → reduced size, wide stops" accent={C.info} />
              <Checkbox label="9:45-11:30: peak liquidity → full size, scalp + swing, tight stops" accent={C.long} />
              <Checkbox label="11:30-13:30: lunch lull → reduce size 50%, wider stops, limit orders only" accent={C.warn} />
              <Checkbox label="13:30-14:00: transition → watch for volume return before re-engaging" accent={C.info} />
              <Checkbox label="14:00-15:30: afternoon push → full size resumes, momentum setups work best" accent={C.long} />
              <Checkbox label="15:30-16:00: MOC imbalance / close → short-term liq spikes, beware reversals" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ RISK ══════ */}
        {activeTab === "risk" && (
          <>
            <Section title="Position Sizing by Regime" color={C.warn} icon="⛊" defaultOpen={true}>
              <Checkbox label="High liq: full position (your normal 1-2% risk per trade)" accent={C.long} />
              <Checkbox label="Medium liq (spread ≤ 1 tick, volume 50-100% avg): 75% position" accent={C.warn} />
              <Checkbox label="Low liq (spread > 1 tick, volume < 50% avg): 50% position MAX" accent={C.short} />
              <Checkbox label="Crisis liq (VIX > 35, spread > 2 ticks): 25% position or flat" accent={C.short} />
              <Checkbox label="Rule: risk $ per trade stays constant — widen stop = cut size proportionally" sublabel="$75 risk budget: 6 tick stop = 1 MES. 12 tick stop = still $75, so can't add size" accent={C.warn} />
            </Section>

            <Section title="Stop Adjustments by Regime" color={C.short} icon="📐" defaultOpen={true}>
              <Checkbox label="High liq stops: 4-6 ticks (standard) — tight invalidation works in deep book" accent={C.long} />
              <Checkbox label="Low liq stops: 6-10 ticks — wider to account for noise and slippage" accent={C.warn} />
              <Checkbox label="Always use limit stop-orders in low liq — market stops get terrible fills" accent={C.short} />
              <Checkbox label="LVN zones: if your stop sits in an LVN, widen beyond it — price will skip through" accent={C.short} />
              <Checkbox label="After T1 in any regime: move stop to breakeven" accent={C.long} />
            </Section>

            <Section title="Warnings & No-Trade Conditions" color={C.short} icon="⚠" defaultOpen={true}>
              <Divider label="Hard No-Trade" />
              <Checkbox label="ES spread > 2 ticks persistently → market is broken, stand aside" accent={C.short} />
              <Checkbox label="Volume < 25% of 20d avg → holiday/half-day session, no reliable signals" accent={C.short} />
              <Checkbox label="Within ±2 min of FOMC/CPI/NFP → all liquidity pulls, regime undefined" accent={C.short} />
              <Checkbox label="VIX > 40 with expanding spread → crisis conditions, preservation mode" accent={C.short} />

              <Divider label="Trap Awareness" />
              <Checkbox label="Short-term liquidity flash at key level → don't trust it without long-term confirmation" sublabel="If heatmap band appears and fades in < 30 sec, it's not real support/resistance" accent={C.warn} />
              <Checkbox label="Breakout in low liq = unreliable → wait for volume to confirm the move" accent={C.warn} />
              <Checkbox label="Mean reversion in low liq = dangerous → price can stay irrational longer" accent={C.warn} />
              <Checkbox label="Regime mismatch: using high-liq strategy in low-liq environment = #1 cause of overtrading" accent={C.short} />
            </Section>
          </>
        )}

        <div style={{ marginTop: "20px", padding: "12px 16px", background: "#0d1117", border: "1px solid #21262d", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "#484f58" }}>VOLUME PROFILE · HEATMAP · LT PRO · AUCTION THEORY</div>
          <div style={{ fontSize: "10px", color: "#30363d" }}>TradeSlayer Pro · Strategy Reference Card</div>
        </div>
      </div>
    </div>
  );
}
