import { useState } from "react";
import { Checkbox, Section, Pill, Divider, STRATEGY_COLORS as C } from "./StrategyCardCommon";

export default function CVDStrategyCard() {
  const [activeTab, setActiveTab] = useState("setup");
  const tabs = [
    { id: "setup", label: "SETUP", icon: "⚙" },
    { id: "read", label: "READ", icon: "◉" },
    { id: "diverge", label: "DIVERGE", icon: "↗" },
    { id: "confirm", label: "CONFIRM", icon: "✦" },
    { id: "risk", label: "RISK", icon: "⛊" },
  ];

  return (
    <div style={{ background: "#010409", minHeight: "100vh", color: "#c9d1d9", fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace", padding: "0" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(180deg, #0d1117 0%, #010409 100%)", borderBottom: "1px solid #21262d", padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #3fb950 0%, #238636 50%, #196c2e 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 0 20px #3fb95030" }}>
            📈
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono', monospace" }}>
              CUMULATIVE VOLUME DELTA
            </h1>
            <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>ES / MES INTRADAY · NET AGGRESSIVE FLOW · DIVERGENCE ENGINE</div>
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "10px", color: "#484f58", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontWeight: 700 }}>★ HIGH-CONVICTION SIGNALS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Pill text="Price new high + CVD lower high = bearish divergence → reversal" color={C.short} />
            <Pill text="Price new low + CVD higher low = bullish divergence → reversal" color={C.long} />
            <Pill text="CVD trending with price = confirmation → ride the trend" color={C.cyan} />
            <Pill text="CVD flat while price moves = passive absorption → level will hold" color={C.purple} />
            <Pill text="CVD spike + no price follow-through = trapped aggressors" color={C.warn} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid #21262d", background: "#0d1117", padding: "0 12px", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: "none", border: "none", padding: "10px 16px", cursor: "pointer", fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            color: activeTab === tab.id ? (tab.id === "diverge" ? C.orange : tab.id === "confirm" ? C.cyan : tab.id === "risk" ? C.warn : C.info) : "#484f58",
            borderBottom: activeTab === tab.id ? `2px solid ${tab.id === "diverge" ? C.orange : tab.id === "confirm" ? C.cyan : tab.id === "risk" ? C.warn : C.info}` : "2px solid transparent",
            letterSpacing: "0.5px", whiteSpace: "nowrap", transition: "all 0.15s",
          }}>
            <span style={{ marginRight: "6px" }}>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 14px", maxWidth: "720px", margin: "0 auto" }}>

        {/* ══════ SETUP ══════ */}
        {activeTab === "setup" && (
          <>
            <Section title="CVD Configuration" color={C.info} icon="⚙" defaultOpen={true}>
              <Divider label="Core Settings" />
              <Checkbox label="Bookmap CVD sub-chart: plots cumulative (ask volume − bid volume) over time" sublabel="Rising CVD = net buying aggression. Falling CVD = net selling aggression." accent={C.info} />
              <Checkbox label="Accumulation mode: SUM for session-long trend bias" accent={C.info} />
              <Checkbox label="Accumulation mode: EXPONENTIAL (1-5 min half-life) for short-term momentum" sublabel="Exponential decays old data — better for scalping. SUM better for swing bias." accent={C.info} />
              <Checkbox label="Reset: session reset at RTH open for clean intraday reads" accent={C.info} />
              <Checkbox label="Display: line chart, positive = green zone, negative = red zone" accent={C.info} />

              <Divider label="Multi-CVD Setup" />
              <Checkbox label="Standard CVD: all trades — broadest view of aggressive flow" accent={C.info} />
              <Checkbox label="S&I Iceberg CVD: buy iceberg vs sell iceberg cumulative delta" sublabel="Divergence between standard CVD and iceberg CVD = hidden vs visible flow conflict" accent={C.cyan} />
              <Checkbox label="Large-Lot CVD: only trades ≥ 25 lot — institutional aggressive bias" accent={C.cyan} />
              <Checkbox label="Stop CVD: cumulative stop triggers by direction — shows trapped flow bias" accent={C.cyan} />
              <Checkbox label="Run ALL four side-by-side when possible — their interplay is the real signal" accent={C.cyan} />

              <Divider label="Companion Layers" />
              <Checkbox label="Price chart overlay: CVD sub-chart directly below price for divergence spotting" accent={C.purple} />
              <Checkbox label="Heatmap: passive liquidity context — CVD shows aggression, heatmap shows defense" accent={C.purple} />
              <Checkbox label="LT Pro: passive order book bias — CVD + LT Pro = complete aggressor + passive picture" accent={C.purple} />
              <Checkbox label="Volume Profile: CVD at HVN/LVN tells you if volume was buyer or seller driven" accent={C.purple} />
            </Section>
          </>
        )}

        {/* ══════ READ ══════ */}
        {activeTab === "read" && (
          <>
            <Section title="Reading CVD — Basics" color={C.info} icon="◎" defaultOpen={true}>
              <Checkbox label="CVD = running sum of (volume at ask − volume at bid) over time" sublabel="Each trade classified: traded at ask = aggressive buy, traded at bid = aggressive sell" accent={C.info} />
              <Checkbox label="Rising CVD: more aggressive buying than selling → net demand" accent={C.long} />
              <Checkbox label="Falling CVD: more aggressive selling than buying → net supply" accent={C.short} />
              <Checkbox label="Flat CVD: balanced aggression — neither side dominating" accent={C.neutral} />
              <Checkbox label="CVD SLOPE matters more than absolute level — acceleration/deceleration is the signal" accent={C.info} />
              <Checkbox label="CVD does NOT show passive orders — only aggressive (market) orders" sublabel="A large passive buyer won't appear on CVD until aggressors sell into them" accent={C.warn} />
            </Section>

            <Section title="CVD States & Meaning" color={C.purple} icon="◆" defaultOpen={true}>
              <Divider label="Trending CVD" />
              <Checkbox label="CVD trending up with price trending up = healthy bullish trend (confirmation)" accent={C.long} />
              <Checkbox label="CVD trending down with price trending down = healthy bearish trend (confirmation)" accent={C.short} />
              <Checkbox label="Steepening CVD slope = momentum INCREASING — trend accelerating" accent={C.long} />
              <Checkbox label="Flattening CVD slope = momentum FADING — trend decelerating (early warning)" accent={C.warn} />

              <Divider label="Divergent CVD" />
              <Checkbox label="Price making new highs, CVD making lower highs = BEARISH DIVERGENCE" sublabel="Buyers getting weaker on each push → trend exhaustion imminent" accent={C.short} />
              <Checkbox label="Price making new lows, CVD making higher lows = BULLISH DIVERGENCE" sublabel="Sellers getting weaker on each push → reversal setup forming" accent={C.long} />
              <Checkbox label="Multiple-swing divergence = stronger signal than single-swing" accent={C.info} />
              <Checkbox label="Divergence AT key level (VWAP, PDH/PDL, HVN) = highest conviction" accent={C.info} />

              <Divider label="Flat/Absorbed CVD" />
              <Checkbox label="Price moves but CVD stays flat = passive orders absorbing all aggression" sublabel="Classic absorption signal — the passive side is winning the fight" accent={C.cyan} />
              <Checkbox label="CVD flat at support while price tests = buyers absorbing without aggressing → bullish" accent={C.long} />
              <Checkbox label="CVD flat at resistance while price tests = sellers absorbing without aggressing → bearish" accent={C.short} />

              <Divider label="Spike CVD" />
              <Checkbox label="Sudden CVD spike with no proportional price move = aggressive flow absorbed by passive" accent={C.warn} />
              <Checkbox label="CVD spike often coincides with stop run — trapped flow creates the spike" accent={C.warn} />
              <Checkbox label="Post-spike: if CVD fails to sustain direction → the spike was exhaustion" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ DIVERGE ══════ */}
        {activeTab === "diverge" && (
          <>
            <Section title="Trading CVD Divergence — Bullish" color={C.long} icon="▲" defaultOpen={true}>
              <Divider label="Conditions" />
              <Checkbox label="Price prints 2+ lower lows while CVD prints higher lows = bullish divergence" accent={C.long} />
              <Checkbox label="Divergence occurs at structural support (VWAP, PDL, HVN, balance low)" accent={C.long} />
              <Checkbox label="Broader context not aggressively bearish (no limit-down, no panic)" accent={C.long} />

              <Divider label="Confirmation Layers" />
              <Checkbox label="Iceberg or absorption detected at the divergence low = passive defense" accent={C.long} />
              <Checkbox label="Heatmap: bid-side liquidity building at the divergence low" accent={C.long} />
              <Checkbox label="Large-lot CVD also diverging positively = institutional agreement" accent={C.long} />
              <Checkbox label="LT Pro: bid liquidity growing while price makes new low = smart passive buying" accent={C.long} />

              <Divider label="Entry" />
              <Checkbox label="ENTRY: buy on first uptick after CVD prints higher low and price stabilizes" sublabel="Limit 1-2 ticks above the last low. Or market on clear momentum shift." accent={C.long} />
              <Checkbox label="T1: +4-6 ticks (50%) — prior swing high or VWAP" accent={C.long} />
              <Checkbox label="T2: +8-12 ticks (25%) — next structural level" accent={C.long} />
              <Checkbox label="Stop: 2 ticks below the divergence low" accent={C.long} />
            </Section>

            <Section title="Trading CVD Divergence — Bearish" color={C.short} icon="▼" defaultOpen={true}>
              <Divider label="Conditions" />
              <Checkbox label="Price prints 2+ higher highs while CVD prints lower highs = bearish divergence" accent={C.short} />
              <Checkbox label="Divergence occurs at structural resistance (VWAP, PDH, HVN, balance high)" accent={C.short} />
              <Checkbox label="Broader context not aggressively bullish (no melt-up, no squeeze)" accent={C.short} />

              <Divider label="Confirmation Layers" />
              <Checkbox label="Iceberg or absorption detected at the divergence high = passive supply" accent={C.short} />
              <Checkbox label="Heatmap: ask-side liquidity building at the divergence high" accent={C.short} />
              <Checkbox label="Large-lot CVD also diverging negatively = institutional selling" accent={C.short} />
              <Checkbox label="LT Pro: ask liquidity growing while price makes new high = smart passive selling" accent={C.short} />

              <Divider label="Entry" />
              <Checkbox label="ENTRY: sell on first downtick after CVD prints lower high and price stalls" sublabel="Limit 1-2 ticks below the last high. Or market on clear momentum shift." accent={C.short} />
              <Checkbox label="T1: −4-6 ticks (50%) — prior swing low or VWAP" accent={C.short} />
              <Checkbox label="T2: −8-12 ticks (25%) — next structural level" accent={C.short} />
              <Checkbox label="Stop: 2 ticks above the divergence high" accent={C.short} />
            </Section>
          </>
        )}

        {/* ══════ CONFIRM ══════ */}
        {activeTab === "confirm" && (
          <>
            <Section title="CVD as Confirmation Layer" color={C.cyan} icon="✦" defaultOpen={true}>
              <Divider label="Confirming Other Setups" />
              <Checkbox label="Iceberg setup + CVD trending in iceberg direction = highest conviction iceberg trade" accent={C.cyan} />
              <Checkbox label="Stop run fade + CVD diverging from run direction = trapped flow confirmed" accent={C.cyan} />
              <Checkbox label="Absorption at S/R + CVD flat or diverging = passive defense is real" accent={C.cyan} />
              <Checkbox label="Breakout + CVD accelerating in breakout direction = genuine momentum" accent={C.cyan} />
              <Checkbox label="Breakout + CVD flat or diverging = false breakout → fade it" accent={C.warn} />

              <Divider label="CVD + LT Pro Combination" />
              <Checkbox label="CVD positive (aggressive buying) + LT Pro bid building (passive buying) = STRONGEST bull" sublabel="Both aggressive and passive sides agree → maximum conviction long" accent={C.long} />
              <Checkbox label="CVD negative + LT Pro ask building = STRONGEST bear signal" accent={C.short} />
              <Checkbox label="CVD positive BUT LT Pro ask building = conflict → passive sellers absorbing buys" sublabel="This is the absorption divergence — passive side often wins" accent={C.warn} />
              <Checkbox label="CVD negative BUT LT Pro bid building = conflict → passive buyers absorbing sells" accent={C.warn} />

              <Divider label="Multi-CVD Cross-Reference" />
              <Checkbox label="Standard CVD + Large-Lot CVD agree = broad + institutional consensus → high conviction" accent={C.long} />
              <Checkbox label="Standard CVD positive but Large-Lot CVD negative = retail buying, institutions selling" sublabel="Follow the large lots — institutions have better information" accent={C.warn} />
              <Checkbox label="Standard CVD + Iceberg CVD agree = visible + hidden flow consensus" accent={C.long} />
              <Checkbox label="Standard CVD vs Iceberg CVD diverge = hidden accumulation/distribution → follow icebergs" accent={C.cyan} />
            </Section>

            <Section title="CVD Trend-Following Entry" color={C.long} icon="→">
              <Checkbox label="CVD in strong uptrend + price pulls back to VWAP/HVN = buy the dip" sublabel="CVD confirms buyers are in control — pullback is opportunity, not reversal" accent={C.long} />
              <Checkbox label="CVD in strong downtrend + price rallies to VWAP/HVN = sell the rip" accent={C.short} />
              <Checkbox label="CVD must not diverge on the pullback — slope should remain favorable" accent={C.warn} />
              <Checkbox label="Entry: limit order at pullback level, stop 2 ticks beyond, targets at prior extreme + extension" accent={C.info} />
            </Section>
          </>
        )}

        {/* ══════ RISK ══════ */}
        {activeTab === "risk" && (
          <>
            <Section title="Stop Placement" color={C.warn} icon="⛊" defaultOpen={true}>
              <Checkbox label="Divergence trade: 2 ticks beyond the divergence swing extreme" accent={C.warn} />
              <Checkbox label="Confirmation trade: follow the primary setup's stop rules (iceberg, S/R, etc.)" accent={C.warn} />
              <Checkbox label="Trend-follow pullback: 2 ticks beyond the pullback low/high" accent={C.warn} />
              <Checkbox label="Hard MAX: 6 ticks (1.5 pts ES / $75 per MES)" accent={C.short} />
              <Checkbox label="After T1: move stop to breakeven" accent={C.long} />
              <Checkbox label="If CVD reverses sharply against you (slope flips) → tighten or exit immediately" accent={C.short} />
            </Section>

            <Section title="Warnings & Invalidators" color={C.short} icon="⚠" defaultOpen={true}>
              <Divider label="Divergence Traps" />
              <Checkbox label="Single-swing divergence = weak — require 2+ swings for reliable signal" accent={C.short} />
              <Checkbox label="Divergence in strong trend = often just a pause, not a reversal" sublabel="Strong trends can show divergence for extended periods before actually reversing" accent={C.short} />
              <Checkbox label="CVD divergence without structural level = floating signal, lower conviction" accent={C.warn} />
              <Checkbox label="Divergence that resolves (CVD catches up to price) = thesis invalidated, scratch" accent={C.short} />

              <Divider label="CVD Limitations" />
              <Checkbox label="CVD only measures AGGRESSIVE flow — passive orders are invisible" sublabel="A massive passive iceberg won't appear on CVD until aggressors trade into it" accent={C.warn} />
              <Checkbox label="CVD classification depends on bid/ask matching — can misclassify in fast markets" accent={C.warn} />
              <Checkbox label="CVD cumulative nature: late-session CVD is sum of ALL day — early divergence may be noise" accent={C.warn} />
              <Checkbox label="CVD resets: if using session reset, be aware of artificial zero-crossing at open" accent={C.warn} />

              <Divider label="Regime Filters" />
              <Checkbox label="Within ±2 min of scheduled news → CVD spikes are reactive, not predictive" accent={C.warn} />
              <Checkbox label="First 5 min RTH: CVD gyrates wildly during opening rotation — wait for settling" accent={C.warn} />
              <Checkbox label="Low volume (< 50% avg): CVD is easily skewed by single large trades" accent={C.warn} />
              <Checkbox label="VIX > 35: CVD divergences resolve less reliably — aggressive flow is chaotic" accent={C.warn} />
              <Checkbox label="Lunch hour drift: CVD goes flat, divergences during 12-13:30 ET are low conviction" accent={C.warn} />
            </Section>
          </>
        )}

        <div style={{ marginTop: "20px", padding: "12px 16px", background: "#0d1117", border: "1px solid #21262d", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "#484f58" }}>CVD · LARGE-LOT CVD · ICEBERG CVD · STOP CVD · LT PRO</div>
          <div style={{ fontSize: "10px", color: "#30363d" }}>TradeSlayer Pro · Strategy Reference Card</div>
        </div>
      </div>
    </div>
  );
}
