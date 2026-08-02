import { useState } from "react";
import { Checkbox, Section, Pill, Divider, STRATEGY_COLORS as C } from "./StrategyCardCommon";

export default function VolumeBubblesStrategyCard() {
  const [activeTab, setActiveTab] = useState("setup");
  const tabs = [
    { id: "setup", label: "SETUP", icon: "⚙" },
    { id: "read", label: "READ", icon: "◉" },
    { id: "long", label: "LONG", icon: "▲" },
    { id: "short", label: "SHORT", icon: "▼" },
    { id: "risk", label: "RISK", icon: "⛊" },
  ];

  return (
    <div style={{ background: "#010409", minHeight: "100vh", color: "#c9d1d9", fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace", padding: "0" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(180deg, #0d1117 0%, #010409 100%)", borderBottom: "1px solid #21262d", padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #39d2c0 0%, #2ea89a 50%, #1a6b62 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 0 20px #39d2c030" }}>
            🫧
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono', monospace" }}>
              VOLUME BUBBLES
            </h1>
            <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>ES / MES INTRADAY · REAL-TIME VOLUME-AT-PRICE · VISUAL FOOTPRINT</div>
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "10px", color: "#484f58", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontWeight: 700 }}>★ HIGH-CONVICTION SIGNALS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Pill text="Large bubble at S/R = volume commitment → level is defended" color={C.cyan} />
            <Pill text="Bubble cluster shifting color = delta flip → momentum changing" color={C.orange} />
            <Pill text="Big bubble + no price move = absorption — passive wall is winning" color={C.purple} />
            <Pill text="Tiny bubbles in trend = low participation → hollow move, reversal risk" color={C.warn} />
            <Pill text="Bubble gap (no volume between prices) = LVN fast-travel zone" color={C.info} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid #21262d", background: "#0d1117", padding: "0 12px", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: "none", border: "none", padding: "10px 16px", cursor: "pointer", fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            color: activeTab === tab.id ? (tab.id === "long" ? C.long : tab.id === "short" ? C.short : tab.id === "risk" ? C.warn : C.info) : "#484f58",
            borderBottom: activeTab === tab.id ? `2px solid ${tab.id === "long" ? C.long : tab.id === "short" ? C.short : tab.id === "risk" ? C.warn : C.info}` : "2px solid transparent",
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
            <Section title="Volume Bubbles Configuration" color={C.info} icon="⚙" defaultOpen={true}>
              <Divider label="Core Settings" />
              <Checkbox label="Bookmap Volume Bubbles: circle overlays on price ladder showing volume at each tick" sublabel="Size = total volume. Color = delta (green = net buy, red = net sell). Position = price level." accent={C.info} />
              <Checkbox label="Aggregation period: 1-5 min candles — each candle shows a column of bubbles" sublabel="1 min = granular micro-reads. 5 min = cleaner patterns, less noise." accent={C.info} />
              <Checkbox label="Size threshold: filter out tiny bubbles (< 50 contracts ES) to reduce visual clutter" accent={C.info} />
              <Checkbox label="Color mode: DELTA — green when ask vol > bid vol, red when bid vol > ask vol" accent={C.info} />
              <Checkbox label="Transparency: enable opacity scaling — bigger bubbles more opaque, small ones translucent" accent={C.info} />

              <Divider label="Display Options" />
              <Checkbox label="Bubble outline mode: shows size via circle diameter, delta via fill color" accent={C.info} />
              <Checkbox label="Numbers on bubbles: ON for exact volume count on significant bubbles" accent={C.info} />
              <Checkbox label="Overlay on heatmap: bubbles sit atop heatmap — see traded volume vs resting liquidity" sublabel="Heatmap = where orders SIT. Bubbles = where orders TRADE. Powerful combination." accent={C.info} />

              <Divider label="Companion Layers" />
              <Checkbox label="Heatmap: resting liquidity vs bubble traded volume = absorption detection" accent={C.cyan} />
              <Checkbox label="Volume Profile: bubbles are the real-time building blocks of the profile" accent={C.cyan} />
              <Checkbox label="CVD: aggregate of all bubble deltas — confirms overall bias" accent={C.cyan} />
              <Checkbox label="Volume Dots: large individual trades within the aggregated bubble" accent={C.cyan} />
            </Section>
          </>
        )}

        {/* ══════ READ ══════ */}
        {activeTab === "read" && (
          <>
            <Section title="Reading Volume Bubbles" color={C.info} icon="◎" defaultOpen={true}>
              <Checkbox label="BUBBLE SIZE: total volume traded at that price in that time period" sublabel="Large bubble = many contracts exchanged = significant price level. Small = light interest." accent={C.info} />
              <Checkbox label="BUBBLE COLOR (delta): green = more aggressive buys, red = more aggressive sells" accent={C.info} />
              <Checkbox label="BUBBLE POSITION: y-axis = price, x-axis = time — creates real-time footprint map" accent={C.info} />
              <Checkbox label="Adjacent bubbles same size/color = volume consistency → trend supported by participation" accent={C.long} />
              <Checkbox label="Bubble size shrinking in trend = participation fading → trend weakening" accent={C.warn} />
              <Checkbox label="No bubbles (gap) between price levels = LVN / fast-travel zone" accent={C.warn} />
            </Section>

            <Section title="Bubble Patterns" color={C.purple} icon="◆" defaultOpen={true}>
              <Divider label="Absorption Bubbles" />
              <Checkbox label="Large RED bubble at support + price holds = sell volume absorbed by passive buyers" sublabel="Big volume traded at bid (aggressive selling) but price didn't break → bullish" accent={C.long} />
              <Checkbox label="Large GREEN bubble at resistance + price holds = buy volume absorbed by passive sellers" accent={C.short} />
              <Checkbox label="Successive absorption bubbles at same price = institutional wall defending" accent={C.cyan} />

              <Divider label="Exhaustion Bubbles" />
              <Checkbox label="Large GREEN bubble at a high → next bubble smaller or red = buy exhaustion" sublabel="Biggest buyer already fired their shot — subsequent weakness confirms top" accent={C.warn} />
              <Checkbox label="Large RED bubble at a low → next bubble smaller or green = sell exhaustion" accent={C.warn} />
              <Checkbox label="Exhaustion: the bubble BEFORE the reversal is the largest in the sequence" accent={C.warn} />

              <Divider label="Momentum Bubbles" />
              <Checkbox label="Ascending green bubbles of consistent or growing size = healthy buying momentum" accent={C.long} />
              <Checkbox label="Descending red bubbles of consistent or growing size = healthy selling momentum" accent={C.short} />
              <Checkbox label="Bubbles getting BIGGER in trend direction = momentum accelerating → ride it" accent={C.long} />
              <Checkbox label="Bubbles getting SMALLER in trend direction = momentum fading → tighten or exit" accent={C.warn} />

              <Divider label="Delta Flip" />
              <Checkbox label="Bubble sequence shifts from green → red at highs = demand-to-supply transition" accent={C.short} />
              <Checkbox label="Bubble sequence shifts from red → green at lows = supply-to-demand transition" accent={C.long} />
              <Checkbox label="Delta flip at key level (VWAP, PDH/PDL, HVN) = highest conviction reversal signal" accent={C.orange} />
              <Checkbox label="The flip bubble itself is often the largest in the group — the turning point" accent={C.orange} />
            </Section>

            <Section title="Bubbles + Heatmap Integration" color={C.cyan} icon="🔗">
              <Checkbox label="Large bubble ON bright heatmap = volume traded INTO resting liquidity = absorption" accent={C.cyan} />
              <Checkbox label="Large bubble where heatmap is dim = volume traded in thin area = momentum/breakout" accent={C.cyan} />
              <Checkbox label="Heatmap band with NO bubble = liquidity sitting there but never tested = untested S/R" accent={C.info} />
              <Checkbox label="Bubble with NO heatmap = aggressive trade with no passive defense = momentum print" accent={C.info} />
              <Checkbox label="Both large bubble AND bright heatmap at same price = heavily contested zone" sublabel="This is where the battle happens — the winner determines next direction" accent={C.purple} />
            </Section>
          </>
        )}

        {/* ══════ LONG ══════ */}
        {activeTab === "long" && (
          <>
            <Section title="Long Entry — Conditions" color={C.long} icon="▲" defaultOpen={true}>
              <Divider label="Context" />
              <Checkbox label="Price at or near structural support (VWAP, PDL, HVN, balance low)" accent={C.long} />
              <Checkbox label="Session: RTH open > 15 min, not within 5 min of major news" accent={C.long} />
              <Checkbox label="Profile shape: not B-shaped (avoid buying in selling trend)" accent={C.long} />

              <Divider label="Bubble Signal" />
              <Checkbox label="Large RED bubble(s) at support with price holding = sell volume being absorbed" accent={C.long} />
              <Checkbox label="Delta flip: red bubbles transition to green at support level" accent={C.long} />
              <Checkbox label="Bubble size growing on green side, shrinking on red = demand overtaking supply" accent={C.long} />
              <Checkbox label="Bubble gap above: no significant bubbles overhead = path clear for upside" accent={C.long} />

              <Divider label="Confirmation" />
              <Checkbox label="Heatmap bright at support where absorption bubbles appear = passive defense confirmed" accent={C.long} />
              <Checkbox label="CVD turning positive — aggregate flow aligning with bubble delta flip" accent={C.long} />
              <Checkbox label="Volume Dots: large buy prints co-located with green bubbles" accent={C.long} />
              <Checkbox label="Next bubbles above are small or nonexistent = low resistance ahead" accent={C.long} />
            </Section>

            <Section title="Long Entry — Trigger & Exit" color={C.long} icon="⚡" defaultOpen={true}>
              <Checkbox label="ENTRY: buy on first uptick after delta flip confirms green at support" sublabel="Limit 1-2 ticks above the absorption bubble price" accent={C.long} />
              <Checkbox label="ALT: buy when green bubbles start stacking upward from support (momentum entry)" accent={C.long} />
              <Checkbox label="T1: +4-6 ticks (50%) — first level with large prior bubbles (contested zone)" accent={C.long} />
              <Checkbox label="T2: +8-12 ticks (25%) — next HVN or structural level" accent={C.long} />
              <Checkbox label="Runner: trail 25% with 4-tick trailing stop" accent={C.long} />
              <Checkbox label="EXIT: large red bubble appears above → new selling entering" accent={C.warn} />
              <Checkbox label="EXIT: bubble sizes shrinking on upward push → momentum fading" accent={C.warn} />
              <Checkbox label="Time stop: no +2 tick move within 90 sec → scratch" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ SHORT ══════ */}
        {activeTab === "short" && (
          <>
            <Section title="Short Entry — Conditions" color={C.short} icon="▼" defaultOpen={true}>
              <Divider label="Context" />
              <Checkbox label="Price at or near structural resistance (VWAP, PDH, HVN, balance high)" accent={C.short} />
              <Checkbox label="Session: RTH open > 15 min, not within 5 min of major news" accent={C.short} />
              <Checkbox label="Profile shape: not P-shaped (avoid selling in buying trend)" accent={C.short} />

              <Divider label="Bubble Signal" />
              <Checkbox label="Large GREEN bubble(s) at resistance with price capping = buy volume being absorbed" accent={C.short} />
              <Checkbox label="Delta flip: green bubbles transition to red at resistance level" accent={C.short} />
              <Checkbox label="Bubble size growing on red side, shrinking on green = supply overtaking demand" accent={C.short} />
              <Checkbox label="Bubble gap below: no significant bubbles underneath = path clear for downside" accent={C.short} />

              <Divider label="Confirmation" />
              <Checkbox label="Heatmap bright at resistance where absorption bubbles appear = passive supply confirmed" accent={C.short} />
              <Checkbox label="CVD turning negative — aggregate flow aligning with bubble delta flip" accent={C.short} />
              <Checkbox label="Volume Dots: large sell prints co-located with red bubbles" accent={C.short} />
              <Checkbox label="Next bubbles below are small or nonexistent = low support ahead" accent={C.short} />
            </Section>

            <Section title="Short Entry — Trigger & Exit" color={C.short} icon="⚡" defaultOpen={true}>
              <Checkbox label="ENTRY: sell on first downtick after delta flip confirms red at resistance" sublabel="Limit 1-2 ticks below the absorption bubble price" accent={C.short} />
              <Checkbox label="ALT: sell when red bubbles start stacking downward from resistance (momentum entry)" accent={C.short} />
              <Checkbox label="T1: −4-6 ticks (50%) — first level with large prior bubbles (contested zone)" accent={C.short} />
              <Checkbox label="T2: −8-12 ticks (25%) — next HVN or structural level" accent={C.short} />
              <Checkbox label="Runner: trail 25% with 4-tick trailing stop" accent={C.short} />
              <Checkbox label="EXIT: large green bubble appears below → new buying entering" accent={C.warn} />
              <Checkbox label="EXIT: bubble sizes shrinking on downward push → momentum fading" accent={C.warn} />
              <Checkbox label="Time stop: no −2 tick move within 90 sec → scratch" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ RISK ══════ */}
        {activeTab === "risk" && (
          <>
            <Section title="Stop Placement" color={C.warn} icon="⛊" defaultOpen={true}>
              <Checkbox label="Absorption bubble trade: 2 ticks beyond the absorption bubble zone" accent={C.warn} />
              <Checkbox label="Delta flip trade: 2 ticks beyond the price where the flip occurred" accent={C.warn} />
              <Checkbox label="Momentum trade: 2 ticks beyond last significant same-direction bubble" accent={C.warn} />
              <Checkbox label="Hard MAX: 6 ticks (1.5 pts ES / $75 per MES)" accent={C.short} />
              <Checkbox label="After T1: move stop to breakeven" accent={C.long} />
              <Checkbox label="Dynamic: if bubbles in your direction shrink to < 25% of entry bubble → tighten" accent={C.warn} />
            </Section>

            <Section title="Warnings & Invalidators" color={C.short} icon="⚠" defaultOpen={true}>
              <Divider label="Signal Quality" />
              <Checkbox label="Small bubbles across the board = low-volume session → all signals are weaker" accent={C.short} />
              <Checkbox label="Single large bubble without follow-up = one-off event, not pattern → wait for more" accent={C.short} />
              <Checkbox label="Delta color mismatch between bubble and CVD = conflicting signals → stand aside" accent={C.warn} />
              <Checkbox label="Bubbles evenly split green/red at a level = contested zone → no clear bias, reduce size" accent={C.warn} />

              <Divider label="Visual Traps" />
              <Checkbox label="Very large bubble from news spike = reactive, not deliberate → don't trade the bubble" accent={C.short} />
              <Checkbox label="Bubble cluster during opening rotation (first 5 min) = noisy, don't trust" accent={C.short} />
              <Checkbox label="Aggregation period matters: 1-min bubbles may show patterns that 5-min smooths out" sublabel="Always cross-reference with CVD and heatmap — don't rely on bubbles alone" accent={C.warn} />

              <Divider label="Regime Filters" />
              <Checkbox label="Within ±2 min of scheduled news → bubbles spike but are meaningless for direction" accent={C.warn} />
              <Checkbox label="First 5 min RTH: bubble patterns unreliable during opening rotation" accent={C.warn} />
              <Checkbox label="Low volume (< 50% avg): bubbles are sparse, patterns don't form reliably" accent={C.warn} />
              <Checkbox label="VIX > 35: bubble deltas whipsaw — absorption patterns break more often" accent={C.warn} />
              <Checkbox label="Lunch hour (12-13:30 ET): bubble sizes collapse, signals are low conviction" accent={C.warn} />
            </Section>
          </>
        )}

        <div style={{ marginTop: "20px", padding: "12px 16px", background: "#0d1117", border: "1px solid #21262d", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "#484f58" }}>VOLUME BUBBLES · HEATMAP · CVD · VOLUME PROFILE · FOOTPRINT</div>
          <div style={{ fontSize: "10px", color: "#30363d" }}>TradeSlayer Pro · Strategy Reference Card</div>
        </div>
      </div>
    </div>
  );
}
