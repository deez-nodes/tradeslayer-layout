import { useState } from "react";
import { Checkbox, Section, Pill, Divider, STRATEGY_COLORS as C } from "./StrategyCardCommon";

export default function SupportResistanceStrategyCard() {
  const [activeTab, setActiveTab] = useState("identify");
  const tabs = [
    { id: "identify", label: "IDENTIFY", icon: "🔍" },
    { id: "confirm", label: "CONFIRM", icon: "✦" },
    { id: "long", label: "LONG", icon: "▲" },
    { id: "short", label: "SHORT", icon: "▼" },
    { id: "risk", label: "RISK", icon: "⛊" },
  ];

  return (
    <div style={{ background: "#010409", minHeight: "100vh", color: "#c9d1d9", fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace", padding: "0" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(180deg, #0d1117 0%, #010409 100%)", borderBottom: "1px solid #21262d", padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #58a6ff 0%, #1f6feb 50%, #388bfd 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 0 20px #58a6ff30" }}>
            🧱
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono', monospace" }}>
              SUPPORT / RESISTANCE
            </h1>
            <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>ES / MES INTRADAY · BOOKMAP CONFIRMATION & INVALIDATION</div>
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "10px", color: "#484f58", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontWeight: 700 }}>★ HIGH-CONVICTION SIGNALS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Pill text="Heatmap wall + iceberg + absorption at same price = fortress S/R" color={C.cyan} />
            <Pill text="Level holds 3+ tests with CVD divergence = institutional defense" color={C.long} />
            <Pill text="Wall breaks on heavy volume + stop cascade = invalidation → flip bias" color={C.short} />
            <Pill text="Liquidity pulls from level before test = trap S/R, don't trust" color={C.purple} />
            <Pill text="Prior-day S/R + fresh iceberg = highest conviction next-day level" color={C.info} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid #21262d", background: "#0d1117", padding: "0 12px", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: "none", border: "none", padding: "10px 16px", cursor: "pointer", fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            color: activeTab === tab.id ? (tab.id === "long" ? C.long : tab.id === "short" ? C.short : tab.id === "risk" ? C.warn : tab.id === "confirm" ? C.cyan : C.info) : "#484f58",
            borderBottom: activeTab === tab.id ? `2px solid ${tab.id === "long" ? C.long : tab.id === "short" ? C.short : tab.id === "risk" ? C.warn : tab.id === "confirm" ? C.cyan : C.info}` : "2px solid transparent",
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
            <Section title="Sources of S/R — Bookmap Layers" color={C.info} icon="🔍" defaultOpen={true}>
              <Divider label="Heatmap-Derived Levels" />
              <Checkbox label="Persistent heatmap bands: dense liquidity that stays on-screen for 5+ minutes = real S/R" sublabel="Bright, continuous bands → passive institutional orders resting at that price" accent={C.info} />
              <Checkbox label="Recurring heatmap walls: same price lights up across multiple sessions = structural anchor" accent={C.info} />
              <Checkbox label="Heatmap 'cliff': liquidity abruptly drops off at a price → edge of value zone" accent={C.info} />
              <Checkbox label="Layered heatmap: multiple bright bands within 4-6 ticks = dense S/R zone (not a single line)" accent={C.info} />

              <Divider label="Order Flow-Derived Levels" />
              <Checkbox label="Iceberg cluster zone: 2+ iceberg detections within 4 ticks = hidden institutional S/R" accent={C.cyan} />
              <Checkbox label="Absorption zone: Absorption Indicator fires at a price → passive wall defending that level" accent={C.cyan} />
              <Checkbox label="Stop cascade terminus: where a stop run exhausted and reversed = new reactive S/R" accent={C.cyan} />
              <Checkbox label="Large lot prints cluster: Volume Dots concentrate at a price = fought-over level" accent={C.cyan} />

              <Divider label="Structural / External Levels" />
              <Checkbox label="PDH / PDL (prior day high/low): classic institutional reference points" accent={C.purple} />
              <Checkbox label="VWAP: session VWAP and developing VWAP — mean-reversion anchor" accent={C.purple} />
              <Checkbox label="Volume Profile HVN/LVN: HVN = sticky S/R, LVN = fast-move zone (not S/R)" accent={C.purple} />
              <Checkbox label="Round numbers (00/50): psychological levels — only valid with Bookmap confirmation" accent={C.purple} />
              <Checkbox label="Prior session balance edges: value area high/low from yesterday" accent={C.purple} />
              <Checkbox label="Overnight high/low: Globex extremes — often tested at RTH open" accent={C.purple} />
            </Section>

            <Section title="Ranking S/R Strength" color={C.purple} icon="📊">
              <Checkbox label="TIER 1 (Fortress): heatmap wall + iceberg + absorption + structural level = highest conviction" sublabel="Multiple Bookmap layers agree on the same price → trade it with full size" accent={C.long} />
              <Checkbox label="TIER 2 (Strong): any 2 of (heatmap wall, iceberg, absorption) + structural level" accent={C.info} />
              <Checkbox label="TIER 3 (Moderate): structural level with fresh heatmap liquidity — no iceberg/absorption yet" accent={C.warn} />
              <Checkbox label="TIER 4 (Weak): structural level alone, no Bookmap confirmation → half size or skip" accent={C.neutral} />
              <Checkbox label="Rule: never trade a level BELOW Tier 3 — require at least one Bookmap layer" accent={C.short} />
            </Section>
          </>
        )}

        {/* ══════ CONFIRM ══════ */}
        {activeTab === "confirm" && (
          <>
            <Section title="Confirmation — Level Is Holding" color={C.cyan} icon="✦" defaultOpen={true}>
              <Divider label="Real-Time Confirmation Checklist" />
              <Checkbox label="Heatmap liquidity REPLENISHES after each test — wall keeps reloading at the same price" sublabel="If liquidity diminishes on each test, the wall is weakening, not confirming" accent={C.cyan} />
              <Checkbox label="Absorption detected: aggressive orders hitting the level but price holds ± 2 ticks" accent={C.cyan} />
              <Checkbox label="Iceberg refill: S&I Tracker shows hidden orders reloading at the S/R price" accent={C.cyan} />
              <Checkbox label="CVD divergence at the level: net aggressors push against it, price doesn't budge" sublabel="Sellers hitting support aggressively but price won't drop = bullish confirmation" accent={C.cyan} />
              <Checkbox label="LT Pro: passive liquidity on the defending side GROWING at the level" accent={C.cyan} />
              <Checkbox label="Volume Dots: large prints cluster at S/R but are absorbed, not breaking through" accent={C.cyan} />
              <Checkbox label="Multiple tests: level holds 2+ tests across 5+ minutes = genuine structural S/R" accent={C.long} />

              <Divider label="Time-Based Confirmation" />
              <Checkbox label="Level holds through 2+ distinct test waves spaced > 2 min apart = strong" accent={C.long} />
              <Checkbox label="Level holds during high-volume period (9:45-11:30 ET) = more reliable than lunch test" accent={C.long} />
              <Checkbox label="Level from prior session that re-confirms on new session open = institutional memory" accent={C.long} />
            </Section>

            <Section title="Invalidation — Level Is Breaking" color={C.short} icon="💔" defaultOpen={true}>
              <Divider label="Real-Time Invalidation Signals" />
              <Checkbox label="Heatmap wall THINS on successive tests — each wave eats away at the liquidity" sublabel="Wall goes from bright to dim = defender is running out of ammo" accent={C.short} />
              <Checkbox label="Iceberg stops reloading: S&I Tracker shows no new hidden orders at the level" accent={C.short} />
              <Checkbox label="LT Pro: defending-side liquidity PULLS (bid pulling at support / ask pulling at resistance)" accent={C.short} />
              <Checkbox label="Absorption Indicator stops firing: passive wall depleted, aggressors will push through" accent={C.short} />
              <Checkbox label="Stop cascade initiates AT the level: stops sitting behind S/R begin triggering" accent={C.short} />
              <Checkbox label="Volume surge through level: 30-sec volume > 2x avg AND price prints 3+ ticks through" accent={C.short} />
              <Checkbox label="CVD accelerates through: net delta aligns with the break direction = real, not fake" accent={C.short} />

              <Divider label="False Break vs Real Break" />
              <Checkbox label="FALSE BREAK: price pokes 1-2 ticks through, no stop cascade, immediately reclaims" sublabel="Heatmap wall still visible, CVD doesn't confirm → level still valid, often better entry" accent={C.warn} />
              <Checkbox label="REAL BREAK: price clears by 3+ ticks, stop cascade triggers, heatmap wall disappears" accent={C.short} />
              <Checkbox label="Test: does price HOLD on the other side for 30+ sec? If yes → broken. If reclaimed → false" accent={C.warn} />
              <Checkbox label="Broken S/R FLIPS role: old support becomes resistance, old resistance becomes support" accent={C.info} />
              <Checkbox label="Best confirmation of flip: new iceberg or heatmap wall appears on the OTHER side of the level" accent={C.info} />
            </Section>
          </>
        )}

        {/* ══════ LONG ══════ */}
        {activeTab === "long" && (
          <>
            <Section title="Long — Support Bounce" color={C.long} icon="▲" defaultOpen={true}>
              <Divider label="Conditions" />
              <Checkbox label="Price tests confirmed support (Tier 1-2 level with Bookmap confirmation)" accent={C.long} />
              <Checkbox label="Heatmap wall holds or brightens on the current test" accent={C.long} />
              <Checkbox label="Absorption or iceberg detected on bid side at the support level" accent={C.long} />
              <Checkbox label="CVD flattens or turns positive at the test — selling pressure exhausting" accent={C.long} />
              <Checkbox label="LT Pro: bid liquidity stable/growing, ask liquidity flat or thinning above" accent={C.long} />

              <Divider label="Entry" />
              <Checkbox label="ENTRY: buy on first uptick after support confirms — limit 1-2 ticks above level" sublabel="Wait for the absorption + hold, then enter on the lift — not before" accent={C.long} />
              <Checkbox label="ALT: buy the retest of broken resistance (S/R flip) with iceberg on bid" accent={C.long} />

              <Divider label="Targets" />
              <Checkbox label="T1: +4-6 ticks — VWAP or first heatmap resistance cluster above" accent={C.long} />
              <Checkbox label="T2: +8-12 ticks — next structural S/R or HVN on volume profile" accent={C.long} />
              <Checkbox label="Runner: trail 25% with 4-tick trailing stop below last swing low" accent={C.long} />
            </Section>

            <Section title="Long — Resistance Break Continuation" color={C.long} icon="⚡">
              <Divider label="Conditions" />
              <Checkbox label="Resistance level INVALIDATED: heatmap wall gone, stops triggered through, CVD confirms" accent={C.long} />
              <Checkbox label="Price holds above broken resistance for 30+ sec — level has flipped to support" accent={C.long} />
              <Checkbox label="New bid-side liquidity appears on heatmap at the broken level (LT Pro confirms)" accent={C.long} />
              <Checkbox label="No ask-side iceberg cluster within 4 ticks above current price" accent={C.long} />

              <Divider label="Entry" />
              <Checkbox label="ENTRY: buy the pullback retest of broken resistance (now support)" accent={C.long} />
              <Checkbox label="T1: +6-10 ticks — next structural level above" accent={C.long} />
              <Checkbox label="T2: next heatmap wall / HVN above" accent={C.long} />
            </Section>
          </>
        )}

        {/* ══════ SHORT ══════ */}
        {activeTab === "short" && (
          <>
            <Section title="Short — Resistance Rejection" color={C.short} icon="▼" defaultOpen={true}>
              <Divider label="Conditions" />
              <Checkbox label="Price tests confirmed resistance (Tier 1-2 level with Bookmap confirmation)" accent={C.short} />
              <Checkbox label="Heatmap wall holds or brightens on the current test" accent={C.short} />
              <Checkbox label="Absorption or iceberg detected on ask side at the resistance level" accent={C.short} />
              <Checkbox label="CVD flattens or turns negative at the test — buying pressure exhausting" accent={C.short} />
              <Checkbox label="LT Pro: ask liquidity stable/growing, bid liquidity flat or thinning below" accent={C.short} />

              <Divider label="Entry" />
              <Checkbox label="ENTRY: sell on first downtick after resistance confirms — limit 1-2 ticks below level" sublabel="Wait for the absorption + hold, then enter on the fade — not before" accent={C.short} />
              <Checkbox label="ALT: sell the rally retest of broken support (S/R flip) with iceberg on ask" accent={C.short} />

              <Divider label="Targets" />
              <Checkbox label="T1: −4-6 ticks — VWAP or first heatmap support cluster below" accent={C.short} />
              <Checkbox label="T2: −8-12 ticks — next structural S/R or HVN on volume profile" accent={C.short} />
              <Checkbox label="Runner: trail 25% with 4-tick trailing stop above last swing high" accent={C.short} />
            </Section>

            <Section title="Short — Support Break Continuation" color={C.short} icon="⚡">
              <Divider label="Conditions" />
              <Checkbox label="Support level INVALIDATED: heatmap wall gone, stops triggered through, CVD confirms" accent={C.short} />
              <Checkbox label="Price holds below broken support for 30+ sec — level has flipped to resistance" accent={C.short} />
              <Checkbox label="New ask-side liquidity appears on heatmap at the broken level (LT Pro confirms)" accent={C.short} />
              <Checkbox label="No bid-side iceberg cluster within 4 ticks below current price" accent={C.short} />

              <Divider label="Entry" />
              <Checkbox label="ENTRY: sell the rally retest of broken support (now resistance)" accent={C.short} />
              <Checkbox label="T1: −6-10 ticks — next structural level below" accent={C.short} />
              <Checkbox label="T2: next heatmap wall / HVN below" accent={C.short} />
            </Section>
          </>
        )}

        {/* ══════ RISK ══════ */}
        {activeTab === "risk" && (
          <>
            <Section title="Stop Placement by S/R Trade Type" color={C.warn} icon="⛊" defaultOpen={true}>
              <Divider label="Bounce / Rejection Trades" />
              <Checkbox label="Initial stop: 2 ticks beyond the S/R zone (beyond the heatmap wall edge)" accent={C.warn} />
              <Checkbox label="Tier 1 level: can use tighter stop (4 ticks) — the wall is strong" accent={C.long} />
              <Checkbox label="Tier 2-3 level: use standard stop (6 ticks) — less certainty" accent={C.warn} />
              <Checkbox label="Hard MAX: 6 ticks (1.5 pts ES / $75 per MES)" accent={C.short} />

              <Divider label="Break Continuation Trades" />
              <Checkbox label="Initial stop: 2 ticks back through the broken level (the old S/R)" accent={C.warn} />
              <Checkbox label="Hard MAX: 6 ticks — if the level reclaims, the break was false" accent={C.short} />
              <Checkbox label="After T1: move stop to breakeven in all cases" accent={C.long} />

              <Divider label="Dynamic Stop Adjustment" />
              <Checkbox label="If heatmap wall THINS while you're in the trade → tighten stop 2 ticks" accent={C.warn} />
              <Checkbox label="If LT Pro defending-side liquidity pulls → consider immediate exit" accent={C.warn} />
              <Checkbox label="If opposing iceberg appears within 4 ticks of your position → take profit" accent={C.warn} />
            </Section>

            <Section title="Warnings & Invalidators" color={C.short} icon="⚠" defaultOpen={true}>
              <Divider label="Level Quality Warnings" />
              <Checkbox label="S/R at round number with NO Bookmap confirmation → it's psychological, not structural" accent={C.short} />
              <Checkbox label="Level only visible on one Bookmap layer → low conviction, reduce size" accent={C.short} />
              <Checkbox label="Level held in low-volume session but untested in high-volume → unproven" accent={C.warn} />
              <Checkbox label="Multiple failed tests (4+) → level is weakening even if it hasn't broken yet" accent={C.warn} />

              <Divider label="Break Quality Warnings" />
              <Checkbox label="Break on low volume with no stop cascade → likely false break, don't chase" accent={C.short} />
              <Checkbox label="Break during news → unreliable invalidation signal, may reverse" accent={C.short} />
              <Checkbox label="Break where price immediately slams into new S/R on the other side → no room" accent={C.warn} />

              <Divider label="Regime Filters" />
              <Checkbox label="Within ±2 min of scheduled news → S/R levels get blown through erratically" accent={C.warn} />
              <Checkbox label="First 5 min RTH: S/R from overnight/prior day gets tested chaotically" accent={C.warn} />
              <Checkbox label="VIX > 35: S/R breaks more frequently and false breaks are common" accent={C.warn} />
              <Checkbox label="Low volume (< 50% avg): S/R appears to hold but thin book means fragile defense" accent={C.warn} />
            </Section>
          </>
        )}

        <div style={{ marginTop: "20px", padding: "12px 16px", background: "#0d1117", border: "1px solid #21262d", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "#484f58" }}>HEATMAP · S&I TRACKER · LT PRO · ABSORPTION INDICATOR · CVD</div>
          <div style={{ fontSize: "10px", color: "#30363d" }}>TradeSlayer Pro · Strategy Reference Card</div>
        </div>
      </div>
    </div>
  );
}
