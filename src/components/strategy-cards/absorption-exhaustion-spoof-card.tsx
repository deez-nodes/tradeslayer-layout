import { useState } from "react";
import { Checkbox, Section, Pill, Divider, STRATEGY_COLORS as C } from "./StrategyCardCommon";

export default function AbsorptionExhaustionSpoofCard() {
  const [activeTab, setActiveTab] = useState("detect");
  const tabs = [
    { id: "detect", label: "DETECT", icon: "◎" },
    { id: "absorb", label: "ABSORB", icon: "🛡" },
    { id: "exhaust", label: "EXHAUST", icon: "💨" },
    { id: "spoof", label: "SPOOF", icon: "👻" },
    { id: "risk", label: "RISK", icon: "⛊" },
  ];

  return (
    <div style={{ background: "#010409", minHeight: "100vh", color: "#c9d1d9", fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace", padding: "0" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(180deg, #0d1117 0%, #010409 100%)", borderBottom: "1px solid #21262d", padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #39d2c0 0%, #1a8a7e 50%, #0d4945 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 0 20px #39d2c030" }}>
            ⚖
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono', monospace" }}>
              ABSORPTION / EXHAUSTION / SPOOF
            </h1>
            <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>ES / MES INTRADAY · ORDER FLOW MICROSTRUCTURE</div>
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "10px", color: "#484f58", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontWeight: 700 }}>★ HIGH-CONVICTION SIGNALS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Pill text="Absorption + CVD divergence = reversal imminent" color={C.cyan} />
            <Pill text="Exhaustion: large prints → no follow-through = fade" color={C.warn} />
            <Pill text="Spoof pull + momentum flip = real direction revealed" color={C.purple} />
            <Pill text="Absorption at key level + liquidity thinning ahead = low-risk entry" color={C.long} />
            <Pill text="Stacked spoofs → accumulation underneath = classic trap" color={C.orange} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid #21262d", background: "#0d1117", padding: "0 12px", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: "none", border: "none", padding: "10px 16px", cursor: "pointer", fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            color: activeTab === tab.id ? (tab.id === "absorb" ? C.cyan : tab.id === "exhaust" ? C.warn : tab.id === "spoof" ? C.purple : tab.id === "risk" ? C.short : C.info) : "#484f58",
            borderBottom: activeTab === tab.id ? `2px solid ${tab.id === "absorb" ? C.cyan : tab.id === "exhaust" ? C.warn : tab.id === "spoof" ? C.purple : tab.id === "risk" ? C.short : C.info}` : "2px solid transparent",
            letterSpacing: "0.5px", whiteSpace: "nowrap", transition: "all 0.15s",
          }}>
            <span style={{ marginRight: "6px" }}>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 14px", maxWidth: "720px", margin: "0 auto" }}>

        {/* ══════ DETECT ══════ */}
        {activeTab === "detect" && (
          <>
            <Section title="Setup & Detection Tools" color={C.info} icon="⚙" defaultOpen={true}>
              <Divider label="Primary Indicators" />
              <Checkbox label="Heatmap: core layer — shows where passive liquidity sits and how it reacts" accent={C.info} />
              <Checkbox label="Volume Dots: filter ≥ 25 lot on ES — shows aggressive print size and location" accent={C.info} />
              <Checkbox label="CVD (Cumulative Volume Delta): net aggressor direction reveals hidden bias" accent={C.info} />
              <Checkbox label="Absorption Indicator (Global+): auto-detects passive limit order absorption events" accent={C.info} />

              <Divider label="MBO Bundle Layers" />
              <Checkbox label="S&I Tracker: iceberg detection confirms hidden absorption participants" accent={C.cyan} />
              <Checkbox label="Liquidity Tracker Pro: order-level additions/pulls reveal spoof vs genuine" accent={C.cyan} />
              <Checkbox label="Liquidity Marker: flags significant liquidity changes within 5-sec windows" accent={C.cyan} />
              <Checkbox label="Tradermap Pro: bot filter MEDIUM — isolate human order flow from HFT noise" accent={C.cyan} />

              <Divider label="Visual Config" />
              <Checkbox label="Heatmap smoothing: 'None' when comparing to Liquidity Marker detections" accent={C.info} />
              <Checkbox label="Volume Dots clustering: TIME mode for absorption, PRICE mode for exhaustion" accent={C.info} />
              <Checkbox label="Order book imbalance: ON — snapshot of bid/ask weight at each price" accent={C.info} />
            </Section>

            <Section title="Three Phenomena — Quick ID" color={C.purple} icon="◆">
              <Checkbox label="ABSORPTION: large volume transacts at a price, price doesn't move → passive wall" sublabel="Heatmap: liquidity keeps reappearing. Volume Dots: heavy prints at same level." accent={C.cyan} />
              <Checkbox label="EXHAUSTION: large aggressive prints appear, but price fails to extend → momentum dying" sublabel="Volume Dots: big prints, no follow-through. CVD: flattens or diverges." accent={C.warn} />
              <Checkbox label="SPOOF: large orders appear in book, then vanish before being hit → fake intent" sublabel="Heatmap: bright band appears and pulls. LT Pro: shows add → cancel sequence." accent={C.purple} />
            </Section>
          </>
        )}

        {/* ══════ ABSORB ══════ */}
        {activeTab === "absorb" && (
          <>
            <Section title="Identifying Absorption" color={C.cyan} icon="🛡" defaultOpen={true}>
              <Checkbox label="Price tests a level with heavy aggressive volume — level holds ± 2 ticks" sublabel="Key: the passive side is absorbing all the aggression without breaking" accent={C.cyan} />
              <Checkbox label="Heatmap shows liquidity replenishing at the same price after each wave" accent={C.cyan} />
              <Checkbox label="Volume Dots: multiple large prints cluster at a single price (not pushing through)" accent={C.cyan} />
              <Checkbox label="CVD divergence: net aggressors selling heavily, but price won't drop (or vice versa)" accent={C.cyan} />
              <Checkbox label="Absorption Indicator: green (buy absorption) or red (sell absorption) flags on chart" accent={C.cyan} />
              <Checkbox label="S&I Tracker: iceberg detections correlate with absorption events" sublabel="Native icebergs + Absorption Indicator often fire together — strong confluence" accent={C.cyan} />
            </Section>

            <Section title="Trading Absorption — Long Setup" color={C.long} icon="▲" defaultOpen={true}>
              <Divider label="Conditions" />
              <Checkbox label="Buying absorption detected at structural support (VWAP, PDL, balance low)" accent={C.long} />
              <Checkbox label="Sellers hitting bid aggressively but price holds — 3+ waves minimum" accent={C.long} />
              <Checkbox label="CVD turning positive while price stabilizes at absorption zone" accent={C.long} />
              <Checkbox label="Heatmap: ask-side liquidity thins above → path of least resistance up" accent={C.long} />

              <Divider label="Entry" />
              <Checkbox label="Buy on first uptick after absorption confirms — momentum shift off the wall" accent={C.long} />
              <Checkbox label="Scale: T1 at +4-6 ticks (50%), T2 at +8-12 ticks (25%), trail runner" accent={C.long} />
              <Checkbox label="Stop: 2 ticks below absorption zone — if the wall breaks, thesis is dead" accent={C.long} />
            </Section>

            <Section title="Trading Absorption — Short Setup" color={C.short} icon="▼">
              <Divider label="Conditions" />
              <Checkbox label="Selling absorption detected at structural resistance (VWAP, PDH, balance high)" accent={C.short} />
              <Checkbox label="Buyers lifting offer aggressively but price caps — 3+ waves minimum" accent={C.short} />
              <Checkbox label="CVD turning negative while price stalls at absorption zone" accent={C.short} />
              <Checkbox label="Heatmap: bid-side liquidity thins below → path of least resistance down" accent={C.short} />

              <Divider label="Entry" />
              <Checkbox label="Sell on first downtick after absorption confirms" accent={C.short} />
              <Checkbox label="Scale: T1 at −4-6 ticks (50%), T2 at −8-12 ticks (25%), trail runner" accent={C.short} />
              <Checkbox label="Stop: 2 ticks above absorption zone" accent={C.short} />
            </Section>
          </>
        )}

        {/* ══════ EXHAUST ══════ */}
        {activeTab === "exhaust" && (
          <>
            <Section title="Identifying Exhaustion" color={C.warn} icon="💨" defaultOpen={true}>
              <Checkbox label="Large aggressive prints fire — but price barely moves or reverses immediately" sublabel="The aggressor is 'spending ammunition' with no reward — momentum is dying" accent={C.warn} />
              <Checkbox label="Volume Dots: big green dots at highs → no new high = buy exhaustion" accent={C.warn} />
              <Checkbox label="Volume Dots: big red dots at lows → no new low = sell exhaustion" accent={C.warn} />
              <Checkbox label="CVD makes new extreme while price doesn't → classic divergence signal" accent={C.warn} />
              <Checkbox label="Spread widens on the aggressor side (ask thins on buying push = no new sellers agree)" accent={C.warn} />
              <Checkbox label="Follow-through test: no new prints in aggressor direction within 15-30 sec" accent={C.warn} />
            </Section>

            <Section title="Trading Exhaustion — Reversal" color={C.long} icon="↩" defaultOpen={true}>
              <Divider label="Conditions" />
              <Checkbox label="Exhaustion occurs at structural level (S/R, VWAP, PDH/PDL, volume node)" accent={C.long} />
              <Checkbox label="3-step confirmation: price stalls → CVD diverges → liquidity rebuilds opposing side" accent={C.long} />
              <Checkbox label="No new aggressive prints in trend direction for 30+ sec after last big print" accent={C.long} />

              <Divider label="Entry" />
              <Checkbox label="Enter on the FIRST sign of opposing momentum after exhaustion confirms" sublabel="Don't front-run — wait for the stall, then the flip" accent={C.long} />
              <Checkbox label="T1: +4-6 ticks (50%), T2: prior level before exhaustion push (25%), trail" accent={C.long} />
              <Checkbox label="Stop: 2-3 ticks beyond the exhaustion extreme" accent={C.long} />

              <Divider label="Warnings" />
              <Checkbox label="First stall is often just a pause, not a reversal — wait for CVD flip confirmation" accent={C.warn} />
              <Checkbox label="If new large prints resume in trend direction → exhaustion thesis failed, scratch" accent={C.warn} />
              <Checkbox label="Exhaustion in a strong trend can just mean consolidation, not reversal" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ SPOOF ══════ */}
        {activeTab === "spoof" && (
          <>
            <Section title="Identifying Spoofs" color={C.purple} icon="👻" defaultOpen={true}>
              <Checkbox label="Large order appears in book → vanishes before it can be hit" sublabel="Heatmap: bright band flashes at a price then disappears within seconds" accent={C.purple} />
              <Checkbox label="LT Pro: shows large add event immediately followed by cancellation" accent={C.purple} />
              <Checkbox label="Liquidity Marker: significant increase then decrease at same price, same 5-sec window" accent={C.purple} />
              <Checkbox label="No corresponding T&S prints — the order was never executed, only displayed" accent={C.purple} />
              <Checkbox label="Repeated pattern: same size appears and pulls 3+ times at different prices" accent={C.purple} />
              <Checkbox label="Spoof often appears on the OPPOSITE side of the intended move" sublabel="Fake sell wall to scare longs → real accumulation happening on the bid underneath" accent={C.purple} />
            </Section>

            <Section title="Spoof Patterns" color={C.orange} icon="🎭" defaultOpen={true}>
              <Divider label="Spoof Test" />
              <Checkbox label="Large offer appears → price dips → offer pulls → price reclaims" sublabel="The spoofer tested if the market would run from the fake wall" accent={C.orange} />
              <Checkbox label="If price DOESN'T run: spoofer knows the bid is strong → often triggers a rally" accent={C.long} />

              <Divider label="Layered Spoof" />
              <Checkbox label="Multiple fake orders stacked at consecutive price levels above/below" accent={C.orange} />
              <Checkbox label="Creates illusion of massive supply/demand — but it's all fake" accent={C.orange} />
              <Checkbox label="When layers pull: price snaps in opposite direction violently" accent={C.orange} />

              <Divider label="Spoof + Accumulation" />
              <Checkbox label="Fake sell wall holds price down → real buying accumulates on bid at lower price" accent={C.cyan} />
              <Checkbox label="Once accumulation complete: spoof pulls, price explodes upward" accent={C.long} />
              <Checkbox label="Confirm: LT Pro shows consistent bid-side additions while ask-side orders keep cancelling" accent={C.cyan} />
            </Section>

            <Section title="Trading Spoofs" color={C.long} icon="⚡">
              <Checkbox label="NEVER trade the spoof direction — trade the REAL direction underneath" accent={C.long} />
              <Checkbox label="Wait for the pull: once spoof orders cancel, enter in opposite direction" sublabel="The spoofer reveals their hand when they pull the fake orders" accent={C.long} />
              <Checkbox label="Confirm with CVD: real accumulation shows up as net buying despite visible sell walls" accent={C.long} />
              <Checkbox label="Stop: tight, 3-4 ticks — if the move doesn't come quickly after pull, thesis is wrong" accent={C.warn} />
              <Checkbox label="Target: back through the spoof zone and beyond — the trapped flow fuels momentum" accent={C.long} />
            </Section>
          </>
        )}

        {/* ══════ RISK ══════ */}
        {activeTab === "risk" && (
          <>
            <Section title="Stop Placement by Setup Type" color={C.warn} icon="⛊" defaultOpen={true}>
              <Checkbox label="Absorption reversal: 2 ticks beyond absorption zone — wall must hold" accent={C.warn} />
              <Checkbox label="Exhaustion fade: 2-3 ticks beyond the exhaustion extreme — tight invalidation" accent={C.warn} />
              <Checkbox label="Spoof fade: 3-4 ticks — slightly wider, spoofs can reappear briefly" accent={C.warn} />
              <Checkbox label="All setups: hard MAX 8 ticks (2 pts ES / $100 per MES)" accent={C.short} />
              <Checkbox label="After T1: always move to breakeven" accent={C.long} />
            </Section>

            <Section title="Common Traps & Invalidators" color={C.short} icon="⚠" defaultOpen={true}>
              <Divider label="Absorption Traps" />
              <Checkbox label="Absorption that BREAKS: wall holds 3 waves then collapses on 4th → continuation, not reversal" accent={C.short} />
              <Checkbox label="Partial absorption: level holds but leaks 2-3 ticks each wave → slow bleed, not defense" accent={C.short} />
              <Checkbox label="Absorption against news flow: macro data can overwhelm any passive wall" accent={C.short} />

              <Divider label="Exhaustion Traps" />
              <Checkbox label="False exhaustion in strong trend: first stall → brief pause → continuation" sublabel="Requires 30+ sec of no follow-through AND CVD divergence to be genuine" accent={C.short} />
              <Checkbox label="Exhaustion into iceberg: price stalls because of hidden order, not because aggressors quit" accent={C.warn} />

              <Divider label="Spoof Traps" />
              <Checkbox label="Genuine large order misidentified as spoof → gets filled, creates real level" accent={C.short} />
              <Checkbox label="Multi-layer spoof that actually HOLDS → rare but devastating if you faded it" accent={C.short} />
              <Checkbox label="Always cross-reference: spoof thesis needs LT Pro cancel + no T&S prints + CVD divergence" accent={C.warn} />

              <Divider label="Regime Filters" />
              <Checkbox label="Within ±2 min of scheduled news → all three signals unreliable" accent={C.warn} />
              <Checkbox label="First 5 min RTH: opening rotation creates false absorption/exhaustion reads" accent={C.warn} />
              <Checkbox label="VIX > 35: spoofs are rampant, absorption walls break more often" accent={C.warn} />
              <Checkbox label="Low volume (< 50% avg): spoofs have outsized impact, absorption signals weak" accent={C.warn} />
            </Section>
          </>
        )}

        {/* FOOTER */}
        <div style={{ marginTop: "20px", padding: "12px 16px", background: "#0d1117", border: "1px solid #21262d", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "#484f58" }}>HEATMAP · VOLUME DOTS · CVD · LT PRO · ABSORPTION INDICATOR</div>
          <div style={{ fontSize: "10px", color: "#30363d" }}>TradeSlayer Pro · Strategy Reference Card</div>
        </div>
      </div>
    </div>
  );
}
