import { useState } from "react";
import { Checkbox, Section, Pill, Divider, STRATEGY_COLORS as C } from "./StrategyCardCommon";

export default function SessionVolumeProfileCard() {
  const [activeTab, setActiveTab] = useState("setup");
  const tabs = [
    { id: "setup", label: "SETUP", icon: "⚙" },
    { id: "read", label: "READ", icon: "◉" },
    { id: "trade", label: "TRADE", icon: "⚡" },
    { id: "shapes", label: "SHAPES", icon: "📊" },
    { id: "risk", label: "RISK", icon: "⛊" },
  ];

  return (
    <div style={{ background: "#010409", minHeight: "100vh", color: "#c9d1d9", fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace", padding: "0" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(180deg, #0d1117 0%, #010409 100%)", borderBottom: "1px solid #21262d", padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #bc8cff 0%, #8957e5 50%, #6e40c9 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 0 20px #bc8cff30" }}>
            📊
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono', monospace" }}>
              SESSION VOLUME PROFILE
            </h1>
            <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>ES / MES INTRADAY · VPOC · VALUE AREA · HVN/LVN · AUCTION THEORY</div>
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "10px", color: "#484f58", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontWeight: 700 }}>★ HIGH-CONVICTION SIGNALS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Pill text="VPOC = price magnet — mean reversion target & anchor level" color={C.purple} />
            <Pill text="VAH/VAL = value edges — fade back into value or trade the break" color={C.info} />
            <Pill text="LVN = fast-travel zone — price moves quickly through, poor for stops" color={C.warn} />
            <Pill text="HVN = acceptance zone — strong S/R, sticky, hard to break" color={C.cyan} />
            <Pill text="Profile shape (D/P/B) reveals regime before price confirms" color={C.long} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid #21262d", background: "#0d1117", padding: "0 12px", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: "none", border: "none", padding: "10px 16px", cursor: "pointer", fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            color: activeTab === tab.id ? (tab.id === "trade" ? C.long : tab.id === "shapes" ? C.purple : tab.id === "risk" ? C.warn : C.info) : "#484f58",
            borderBottom: activeTab === tab.id ? `2px solid ${tab.id === "trade" ? C.long : tab.id === "shapes" ? C.purple : tab.id === "risk" ? C.warn : C.info}` : "2px solid transparent",
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
            <Section title="Volume Profile Configuration" color={C.info} icon="⚙" defaultOpen={true}>
              <Divider label="Profile Types" />
              <Checkbox label="Session Profile: resets each RTH session — shows current day's value" accent={C.info} />
              <Checkbox label="Developing Profile: updates in real-time as session progresses" sublabel="Watch VPOC migration — if VPOC shifts direction, market is accepting new value" accent={C.info} />
              <Checkbox label="Composite Profile: multi-day aggregated — shows longer-term value zones" accent={C.info} />
              <Checkbox label="Prior Day Profile: yesterday's completed profile — key reference levels" accent={C.info} />
              <Checkbox label="Custom Period: 30m or 1h micro-profiles for recent auction zones" accent={C.info} />

              <Divider label="Key Levels to Display" />
              <Checkbox label="VPOC (Volume Point of Control): price with highest volume — fairest price" accent={C.purple} />
              <Checkbox label="VAH (Value Area High): upper edge of 70% value area — upper boundary" accent={C.info} />
              <Checkbox label="VAL (Value Area Low): lower edge of 70% value area — lower boundary" accent={C.info} />
              <Checkbox label="Prior Day VPOC / VAH / VAL: carry-forward lines for today's reference" accent={C.cyan} />
              <Checkbox label="HVN markers: locally high-volume prices (mini-VPOCs within the profile)" accent={C.info} />
              <Checkbox label="LVN markers: locally low-volume prices (fast-travel / gap zones)" accent={C.warn} />

              <Divider label="Companion Layers" />
              <Checkbox label="VWAP: often near VPOC — when they align, the level is doubly significant" accent={C.cyan} />
              <Checkbox label="Heatmap: real-time liquidity at profile levels confirms active defense" accent={C.cyan} />
              <Checkbox label="CVD: tells you if volume at a price level was buyer or seller driven" accent={C.cyan} />
              <Checkbox label="LT Pro: passive book imbalance at profile levels = institutional positioning" accent={C.cyan} />
            </Section>
          </>
        )}

        {/* ══════ READ ══════ */}
        {activeTab === "read" && (
          <>
            <Section title="Core Volume Profile Concepts" color={C.info} icon="◎" defaultOpen={true}>
              <Checkbox label="Volume profile shows HOW MUCH volume traded at each price — not when" sublabel="It reveals where the market agreed on value (high vol) and rejected prices (low vol)" accent={C.info} />
              <Checkbox label="VPOC: the single price with the most volume = the 'fairest' price of the session" accent={C.purple} />
              <Checkbox label="Value Area (70%): the range containing 70% of volume = the 'accepted value' zone" accent={C.info} />
              <Checkbox label="Above VA: price is premium — buyers need to prove they can sustain new value" accent={C.short} />
              <Checkbox label="Below VA: price is discount — sellers need to prove they can sustain new value" accent={C.long} />
              <Checkbox label="At VPOC: price at fair value — range-bound behavior likely, mean reversion dominant" accent={C.neutral} />
            </Section>

            <Section title="HVN vs LVN — Reading the Nodes" color={C.purple} icon="◆" defaultOpen={true}>
              <Divider label="High Volume Nodes (HVN)" />
              <Checkbox label="Price traded here heavily → both sides agreed this was fair → STICKY level" accent={C.info} />
              <Checkbox label="Acts as S/R: price gravitates toward HVN and tends to consolidate around it" accent={C.info} />
              <Checkbox label="Breaking through HVN requires significant aggressive volume (it's thick)" accent={C.info} />
              <Checkbox label="HVN from prior day = institutional reference point — expect reaction on first test" accent={C.cyan} />

              <Divider label="Low Volume Nodes (LVN)" />
              <Checkbox label="Price passed through quickly → rejection zone → price will move FAST through again" accent={C.warn} />
              <Checkbox label="LVN = poor S/R: don't place entries or stops at LVN — they won't hold reliably" accent={C.warn} />
              <Checkbox label="LVN between two HVNs = bridge zone: volatile transition area" accent={C.warn} />
              <Checkbox label="If price enters an LVN, expect acceleration until it reaches the next HVN" accent={C.warn} />
              <Checkbox label="Stops in LVN zones get blown through → always place stops beyond HVN clusters" accent={C.short} />

              <Divider label="VPOC Migration" />
              <Checkbox label="VPOC shifts UP during session: market accepting higher value → bullish bias" accent={C.long} />
              <Checkbox label="VPOC shifts DOWN during session: market accepting lower value → bearish bias" accent={C.short} />
              <Checkbox label="VPOC stationary: balanced market, value not changing → range conditions" accent={C.neutral} />
              <Checkbox label="Monitor developing VPOC every 30 min for directional bias updates" accent={C.info} />
            </Section>
          </>
        )}

        {/* ══════ TRADE ══════ */}
        {activeTab === "trade" && (
          <>
            <Section title="Mean Reversion — Fade to VPOC" color={C.long} icon="↩" defaultOpen={true}>
              <Divider label="Conditions" />
              <Checkbox label="Price extended to VAH or VAL — at the edge of accepted value" accent={C.long} />
              <Checkbox label="Profile is D-shaped (balanced) → range regime, mean reversion is primary strategy" accent={C.long} />
              <Checkbox label="CVD diverging from price at the value edge → exhaustion" accent={C.long} />
              <Checkbox label="Heatmap or LT Pro shows liquidity building at the edge (absorption developing)" accent={C.long} />

              <Divider label="Entry" />
              <Checkbox label="LONG at VAL: buy when price touches VAL with CVD divergence + absorption" sublabel="Target: VPOC. Stop: 2-3 ticks below VAL." accent={C.long} />
              <Checkbox label="SHORT at VAH: sell when price touches VAH with CVD divergence + absorption" sublabel="Target: VPOC. Stop: 2-3 ticks above VAH." accent={C.short} />
              <Checkbox label="T1: VPOC (50%). T2: opposite value edge (25%). Runner trail." accent={C.info} />
            </Section>

            <Section title="Breakout — Value Area Extension" color={C.purple} icon="→" defaultOpen={true}>
              <Divider label="Conditions" />
              <Checkbox label="Price breaks above VAH or below VAL with volume confirmation" accent={C.purple} />
              <Checkbox label="Profile is P-shaped (trending up) or B-shaped (trending down)" accent={C.purple} />
              <Checkbox label="CVD accelerating in break direction — aggressive flow confirming" accent={C.purple} />
              <Checkbox label="No HVN immediately ahead (no thick resistance in the break direction)" accent={C.purple} />

              <Divider label="Entry" />
              <Checkbox label="LONG: buy pullback to VAH (now support) after upside break" sublabel="VAH was resistance, now floor. Enter on retest with new bid liquidity." accent={C.long} />
              <Checkbox label="SHORT: sell rally to VAL (now resistance) after downside break" sublabel="VAL was support, now ceiling. Enter on retest with new ask liquidity." accent={C.short} />
              <Checkbox label="T1: next HVN or prior-day VPOC (+6-10 ticks). T2: next VA edge." accent={C.info} />
              <Checkbox label="Stop: 2 ticks back inside the old value area — if reclaimed, break was false" accent={C.warn} />
            </Section>

            <Section title="HVN Bounce / LVN Fast Travel" color={C.cyan} icon="◆">
              <Divider label="HVN Bounce" />
              <Checkbox label="Price pulls back to prior-day HVN or intraday HVN → expect reaction" accent={C.cyan} />
              <Checkbox label="Confirm with Bookmap: heatmap wall at HVN, CVD diverging, absorption detected" accent={C.cyan} />
              <Checkbox label="Entry: fade at HVN with tight stop (2 ticks beyond). Target: VPOC or next HVN." accent={C.cyan} />

              <Divider label="LVN Fast Travel" />
              <Checkbox label="When price enters LVN, expect quick move to next HVN — don't try to fade in LVN" accent={C.warn} />
              <Checkbox label="Trade: join the direction once price enters LVN, target the next HVN" accent={C.warn} />
              <Checkbox label="Do NOT place stops in LVN zones — they will be run through on the fast move" accent={C.short} />
            </Section>
          </>
        )}

        {/* ══════ SHAPES ══════ */}
        {activeTab === "shapes" && (
          <>
            <Section title="D-Shape — Balanced / Range" color={C.info} icon="🔔" defaultOpen={true}>
              <Checkbox label="Bell curve: volume concentrated in the middle, thin tails" accent={C.info} />
              <Checkbox label="Meaning: market found balance — value is accepted, range-bound likely" accent={C.info} />
              <Checkbox label="Strategy: MEAN REVERSION — fade VAH/VAL back to VPOC" accent={C.long} />
              <Checkbox label="Scalp off edges: tight stops, frequent entries, small targets to VPOC" accent={C.long} />
              <Checkbox label="Avoid: trend-following in D-shape — breakouts fail more often than not" accent={C.warn} />
              <Checkbox label="Shift: if D-shape starts developing a tail, bias is forming → watch for transition" accent={C.info} />
            </Section>

            <Section title="P-Shape — Buying Trend / Short Covering" color={C.long} icon="📈" defaultOpen={true}>
              <Checkbox label="Volume concentrated at the TOP of the range, thin at bottom" accent={C.long} />
              <Checkbox label="Meaning: price was rejected low, value accepted higher → bullish" accent={C.long} />
              <Checkbox label="Strategy: BUY DIPS into volume nodes — don't fade the trend" accent={C.long} />
              <Checkbox label="Best entries: pullback to nearest HVN below, VPOC, or VAL" accent={C.long} />
              <Checkbox label="Trail runners: P-shape trends tend to extend — give room" accent={C.long} />
              <Checkbox label="Warning: short covering can create P-shape without real demand — check CVD" accent={C.warn} />
            </Section>

            <Section title="B-Shape — Selling Trend / Long Liquidation" color={C.short} icon="📉" defaultOpen={true}>
              <Checkbox label="Volume concentrated at the BOTTOM of the range, thin at top" accent={C.short} />
              <Checkbox label="Meaning: price was rejected high, value accepted lower → bearish" accent={C.short} />
              <Checkbox label="Strategy: SELL RALLIES into volume nodes — don't buy the dip" accent={C.short} />
              <Checkbox label="Best entries: rally to nearest HVN above, VPOC, or VAH" accent={C.short} />
              <Checkbox label="Trail runners: B-shape trends tend to extend — give room" accent={C.short} />
              <Checkbox label="Warning: long liquidation can create B-shape without real supply — check CVD" accent={C.warn} />
            </Section>

            <Section title="Double Distribution — Breakout Pending" color={C.orange} icon="⏳">
              <Checkbox label="Two separate volume clusters with thin LVN bridge between them" accent={C.orange} />
              <Checkbox label="Meaning: market tried two value areas — hasn't decided which is 'true' value" accent={C.orange} />
              <Checkbox label="The LVN bridge is the breakout zone: volatile, fast moves" accent={C.orange} />
              <Checkbox label="Strategy: wait for price to commit to one distribution, then trade with it" accent={C.orange} />
              <Checkbox label="If price enters bridge from above and holds → moving to lower distribution (short)" accent={C.short} />
              <Checkbox label="If price enters bridge from below and holds → moving to upper distribution (long)" accent={C.long} />
              <Checkbox label="Avoid: trading inside the bridge — it's no-man's-land" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ RISK ══════ */}
        {activeTab === "risk" && (
          <>
            <Section title="Stop Placement by Profile Setup" color={C.warn} icon="⛊" defaultOpen={true}>
              <Checkbox label="Mean reversion (fade at VA edge): 2-3 ticks beyond VAH/VAL" accent={C.warn} />
              <Checkbox label="Breakout (VA extension): 2 ticks back inside old value area" accent={C.warn} />
              <Checkbox label="HVN bounce: 2 ticks beyond the HVN cluster" accent={C.warn} />
              <Checkbox label="NEVER place stops at LVN — they will be run through on fast travel" accent={C.short} />
              <Checkbox label="Hard MAX: 6 ticks (1.5 pts ES / $75 per MES)" accent={C.short} />
              <Checkbox label="After T1: move stop to breakeven" accent={C.long} />
            </Section>

            <Section title="Warnings & Invalidators" color={C.short} icon="⚠" defaultOpen={true}>
              <Divider label="Profile Traps" />
              <Checkbox label="Developing profile can shift shape: D→P or D→B as session progresses" sublabel="Don't commit to a shape too early — wait until 10:30 ET for profile to develop" accent={C.warn} />
              <Checkbox label="VPOC migration invalidates mean reversion: if VPOC shifts to VA edge, bias has formed" accent={C.short} />
              <Checkbox label="Prior-day VA loses relevance if current session has strong directional volume" accent={C.warn} />
              <Checkbox label="Thin profile (low-vol session): all levels are less reliable — reduce size" accent={C.warn} />

              <Divider label="Breakout Traps" />
              <Checkbox label="Break above VAH on low volume = likely false → mean reversion wins" accent={C.short} />
              <Checkbox label="Break into LVN that immediately reverses = stop hunt, not real break" accent={C.short} />
              <Checkbox label="Check: does CVD confirm the break? If not → fade it back into value" accent={C.warn} />

              <Divider label="Regime Filters" />
              <Checkbox label="Within ±2 min of scheduled news → profile levels get blown through" accent={C.warn} />
              <Checkbox label="First 30 min RTH: profile is too thin to trade — wait for development" accent={C.warn} />
              <Checkbox label="Low volume (< 50% avg): profile nodes are unreliable, LVNs are everywhere" accent={C.warn} />
              <Checkbox label="VIX > 35: value area expands dramatically, mean reversion targets are distant" accent={C.warn} />
            </Section>
          </>
        )}

        <div style={{ marginTop: "20px", padding: "12px 16px", background: "#0d1117", border: "1px solid #21262d", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "#484f58" }}>VOLUME PROFILE · VPOC · VAH/VAL · HVN/LVN · AUCTION THEORY</div>
          <div style={{ fontSize: "10px", color: "#30363d" }}>TradeSlayer Pro · Strategy Reference Card</div>
        </div>
      </div>
    </div>
  );
}
