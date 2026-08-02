import { useState } from "react";
import { Checkbox, Section, Pill, Divider, STRATEGY_COLORS as C } from "./StrategyCardCommon";

export default function LargeLotsStrategyCard() {
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
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #f0883e 0%, #d2691e 50%, #8b4513 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 0 20px #f0883e30" }}>
            🎯
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono', monospace" }}>
              LARGE LOTS INDICATOR
            </h1>
            <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>ES / MES INTRADAY · VOLUME DOTS · AGGRESSIVE PRINT TRACKING</div>
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "10px", color: "#484f58", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontWeight: 700 }}>★ HIGH-CONVICTION SIGNALS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Pill text="Large lots cluster at S/R + absorption = institutional commitment" color={C.cyan} />
            <Pill text="Large buy prints with no new high = buy exhaustion → fade" color={C.warn} />
            <Pill text="Large lots AFTER stop run = real money entering, high R:R" color={C.purple} />
            <Pill text="Consecutive large lots same direction = momentum confirmation" color={C.long} />
            <Pill text="Large lots vs price divergence = trapped flow signal" color={C.orange} />
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
            <Section title="Volume Dots / Large Lot Tracker Config" color={C.info} icon="⚙" defaultOpen={true}>
              <Divider label="On-Chart — Volume Dots" />
              <Checkbox label="Enable Volume Dots add-on: shows circles at the price where large trades print" sublabel="Dot size scales with trade size — bigger dot = bigger print" accent={C.info} />
              <Checkbox label="ES threshold: ≥ 25 contracts per print (filters out retail noise)" accent={C.info} />
              <Checkbox label="MES threshold: ≥ 100 contracts (scale ~4x from ES)" accent={C.info} />
              <Checkbox label="Significant threshold: ≥ 50 contracts ES / ≥ 200 MES for 'monster' prints" accent={C.info} />
              <Checkbox label="Color: green dots = aggressive buy (traded at ask), red dots = aggressive sell (traded at bid)" accent={C.info} />
              <Checkbox label="Clustering mode: PRICE for S/R analysis, TIME for momentum/exhaustion reads" sublabel="PRICE: groups dots at same price level. TIME: spreads across timeline for sequence analysis" accent={C.info} />
              <Checkbox label="Opacity: filter small prints to 40% opacity — keep them visible but dimmed" accent={C.info} />

              <Divider label="Sub-Chart Config" />
              <Checkbox label="Large Lot Tracker sub-chart: shows cumulative large-lot volume bias" accent={C.info} />
              <Checkbox label="SUM mode: running total of large buy vs sell prints — directional bias" accent={C.info} />
              <Checkbox label="Alert threshold: match on-chart min size for 1:1 parity" accent={C.info} />

              <Divider label="Companion Layers" />
              <Checkbox label="Heatmap: confirms whether large prints are hitting into passive liquidity walls" accent={C.cyan} />
              <Checkbox label="CVD: compare large-lot bias vs overall CVD — divergence = institutional vs retail split" accent={C.cyan} />
              <Checkbox label="S&I Tracker: large lots co-located with iceberg = hidden institutional defense" accent={C.cyan} />
              <Checkbox label="LT Pro: large aggressive prints near LT Pro imbalance zones = conviction" accent={C.cyan} />
            </Section>
          </>
        )}

        {/* ══════ READ ══════ */}
        {activeTab === "read" && (
          <>
            <Section title="What Large Lots Tell You" color={C.info} icon="◎" defaultOpen={true}>
              <Checkbox label="Large lots are AGGRESSIVE orders: they cross the spread to execute immediately" sublabel="A 50-lot buy at the ask = someone paying up for immediate entry = conviction" accent={C.info} />
              <Checkbox label="They are NOT the same as resting orders — these prints appear on T&S, not in the book" accent={C.info} />
              <Checkbox label="Single large lot = one participant taking a position or adding to one" accent={C.info} />
              <Checkbox label="Cluster of large lots = multiple participants or repeated entries = institutional activity" accent={C.info} />
              <Checkbox label="Large lot AT a key level = the participant chose that price deliberately" accent={C.info} />
              <Checkbox label="Large lot in open space = momentum trade or stop-market execution" accent={C.info} />
            </Section>

            <Section title="Large Lot Patterns" color={C.purple} icon="◆" defaultOpen={true}>
              <Divider label="Absorption Prints" />
              <Checkbox label="Large sell prints cluster at a price, but price holds → passive buy wall is absorbing" sublabel="Red dots stacking at support with no breakdown = bullish absorption signal" accent={C.long} />
              <Checkbox label="Large buy prints cluster at a price, but price caps → passive sell wall is absorbing" accent={C.short} />
              <Checkbox label="Confirmation: iceberg detected at the same price as the large-lot cluster" accent={C.cyan} />

              <Divider label="Exhaustion Prints" />
              <Checkbox label="Large buy prints at highs → no new high follows within 30 sec = buy exhaustion" sublabel="The biggest buyer already fired — if price can't extend, momentum is dead" accent={C.warn} />
              <Checkbox label="Large sell prints at lows → no new low follows within 30 sec = sell exhaustion" accent={C.warn} />
              <Checkbox label="Exhaustion + CVD divergence → strongest reversal signal" accent={C.warn} />

              <Divider label="Momentum Prints" />
              <Checkbox label="Consecutive large lots in same direction, each at new price = momentum confirmation" accent={C.long} />
              <Checkbox label="Large lots driving through LVN (low volume node) = fast continuation move" accent={C.long} />
              <Checkbox label="Increasing print size in trend direction = accumulating conviction, not exhausting" accent={C.long} />

              <Divider label="Reversal Prints" />
              <Checkbox label="Large lot fires in OPPOSITE direction after stop run = real money fading the move" accent={C.orange} />
              <Checkbox label="Large buy print at bottom of sell cascade = institutional bottom-picking" accent={C.orange} />
              <Checkbox label="Context matters: reversal print at structural level >> reversal print in open space" accent={C.orange} />
            </Section>

            <Section title="Sub-Chart: Large Lot CVD" color={C.info} icon="📊">
              <Checkbox label="Rising large-lot CVD: more big buys than big sells = institutional bid bias" accent={C.long} />
              <Checkbox label="Falling large-lot CVD: more big sells than big buys = institutional offer bias" accent={C.short} />
              <Checkbox label="Large-lot CVD diverges from price: institutions positioning against the move" accent={C.warn} />
              <Checkbox label="Large-lot CVD diverges from regular CVD: 'smart money' disagrees with aggregate flow" sublabel="This is the highest-value read — when big players go opposite to the crowd" accent={C.cyan} />
              <Checkbox label="Flat large-lot CVD during trend: no institutional participation → trend is retail-driven, fragile" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ LONG ══════ */}
        {activeTab === "long" && (
          <>
            <Section title="Long Entry — Conditions" color={C.long} icon="▲" defaultOpen={true}>
              <Divider label="Context" />
              <Checkbox label="Price at or near structural support (VWAP, PDL, HVN, prior balance low)" accent={C.long} />
              <Checkbox label="Session: RTH open > 15 min, not within 5 min of major news" accent={C.long} />
              <Checkbox label="Broader bias not aggressively bearish" accent={C.long} />

              <Divider label="Large Lot Signal" />
              <Checkbox label="Large buy prints (green dots) cluster at support — 2+ prints within 4 ticks" accent={C.long} />
              <Checkbox label="OR: large sell prints absorbed at support (red dots cluster, price holds = absorption)" accent={C.long} />
              <Checkbox label="Large-lot sub-chart CVD turning positive at the support level" accent={C.long} />
              <Checkbox label="Print size increasing on successive buy prints = growing conviction" accent={C.long} />

              <Divider label="Confirmation" />
              <Checkbox label="Regular CVD aligns with large-lot direction (both turning positive)" accent={C.long} />
              <Checkbox label="Heatmap: ask-side liquidity thinning above → path of least resistance up" accent={C.long} />
              <Checkbox label="Iceberg or absorption detected at same level as large buy prints" accent={C.long} />
              <Checkbox label="No large sell prints appearing above within 4 ticks (no seller stepping in)" accent={C.long} />
            </Section>

            <Section title="Long Entry — Trigger & Exit" color={C.long} icon="⚡" defaultOpen={true}>
              <Checkbox label="ENTRY: buy on first uptick after large buy lot confirms at support" sublabel="Limit 1-2 ticks above the last large buy print price" accent={C.long} />
              <Checkbox label="ALT: buy on momentum shift after sell exhaustion prints (large red dots, no new low)" accent={C.long} />
              <Checkbox label="T1: +4-6 ticks (50%) — VWAP or first resistance level" accent={C.long} />
              <Checkbox label="T2: +8-12 ticks (25%) — next S/R or where large ask prints cluster" accent={C.long} />
              <Checkbox label="Runner: trail 25% with 4-tick trailing stop" accent={C.long} />
              <Checkbox label="EXIT: large sell prints appear above your entry → new seller, take profit" accent={C.warn} />
              <Checkbox label="EXIT: large-lot CVD rolls over → institutional buying has stopped" accent={C.warn} />
              <Checkbox label="Time stop: no +2 tick move within 90 sec → scratch" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ SHORT ══════ */}
        {activeTab === "short" && (
          <>
            <Section title="Short Entry — Conditions" color={C.short} icon="▼" defaultOpen={true}>
              <Divider label="Context" />
              <Checkbox label="Price at or near structural resistance (VWAP, PDH, HVN, prior balance high)" accent={C.short} />
              <Checkbox label="Session: RTH open > 15 min, not within 5 min of major news" accent={C.short} />
              <Checkbox label="Broader bias not aggressively bullish" accent={C.short} />

              <Divider label="Large Lot Signal" />
              <Checkbox label="Large sell prints (red dots) cluster at resistance — 2+ prints within 4 ticks" accent={C.short} />
              <Checkbox label="OR: large buy prints absorbed at resistance (green dots cluster, price caps = absorption)" accent={C.short} />
              <Checkbox label="Large-lot sub-chart CVD turning negative at the resistance level" accent={C.short} />
              <Checkbox label="Print size increasing on successive sell prints = growing conviction" accent={C.short} />

              <Divider label="Confirmation" />
              <Checkbox label="Regular CVD aligns with large-lot direction (both turning negative)" accent={C.short} />
              <Checkbox label="Heatmap: bid-side liquidity thinning below → path of least resistance down" accent={C.short} />
              <Checkbox label="Iceberg or absorption detected at same level as large sell prints" accent={C.short} />
              <Checkbox label="No large buy prints appearing below within 4 ticks (no buyer stepping in)" accent={C.short} />
            </Section>

            <Section title="Short Entry — Trigger & Exit" color={C.short} icon="⚡" defaultOpen={true}>
              <Checkbox label="ENTRY: sell on first downtick after large sell lot confirms at resistance" sublabel="Limit 1-2 ticks below the last large sell print price" accent={C.short} />
              <Checkbox label="ALT: sell on momentum shift after buy exhaustion prints (large green dots, no new high)" accent={C.short} />
              <Checkbox label="T1: −4-6 ticks (50%) — VWAP or first support level" accent={C.short} />
              <Checkbox label="T2: −8-12 ticks (25%) — next S/R or where large bid prints cluster" accent={C.short} />
              <Checkbox label="Runner: trail 25% with 4-tick trailing stop" accent={C.short} />
              <Checkbox label="EXIT: large buy prints appear below your entry → new buyer, cover" accent={C.warn} />
              <Checkbox label="EXIT: large-lot CVD surges positive → institutional selling has stopped" accent={C.warn} />
              <Checkbox label="Time stop: no −2 tick move within 90 sec → scratch" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ RISK ══════ */}
        {activeTab === "risk" && (
          <>
            <Section title="Stop Placement" color={C.warn} icon="⛊" defaultOpen={true}>
              <Checkbox label="Initial stop: 2 ticks beyond the large-lot cluster price" sublabel="If the institutional print zone breaks, your thesis is wrong" accent={C.warn} />
              <Checkbox label="Absorption setup: 2 ticks beyond the absorption zone (tighter — wall must hold)" accent={C.warn} />
              <Checkbox label="Exhaustion fade: 2-3 ticks beyond the exhaustion extreme" accent={C.warn} />
              <Checkbox label="Hard MAX: 6 ticks (1.5 pts ES / $75 per MES)" accent={C.short} />
              <Checkbox label="After T1: move stop to breakeven" accent={C.long} />
            </Section>

            <Section title="Warnings & Invalidators" color={C.short} icon="⚠" defaultOpen={true}>
              <Divider label="Signal Quality" />
              <Checkbox label="Single large lot in isolation = noise — require 2+ prints or cluster for conviction" accent={C.short} />
              <Checkbox label="Large lot with no structural context (random price level) = low conviction" accent={C.short} />
              <Checkbox label="Large lot during news event = reactive, not planned — lower reliability" accent={C.short} />
              <Checkbox label="Large lot that doesn't move price at ALL = it was absorbed, not momentum" sublabel="Context dependent: absorption at S/R is bullish, absorption mid-move is neutral" accent={C.warn} />

              <Divider label="Traps" />
              <Checkbox label="Large buy prints at highs in downtrend = short covering, not new longs → don't go long" accent={C.short} />
              <Checkbox label="Large sell prints at lows in uptrend = profit taking, not new shorts → don't go short" accent={C.short} />
              <Checkbox label="Distinguish: is the large lot INITIATING or LIQUIDATING a position?" sublabel="Check context: initiation = at S/R, fresh move. Liquidation = after extended run." accent={C.warn} />
              <Checkbox label="HFT spoofing via large aggressive prints: rare but exists — confirm with iceberg/LT Pro" accent={C.warn} />

              <Divider label="Regime Filters" />
              <Checkbox label="Within ±2 min of scheduled news → large lots are reactive, not predictive" accent={C.warn} />
              <Checkbox label="First 5 min RTH: large lots during opening rotation are often inventory management" accent={C.warn} />
              <Checkbox label="Low volume (< 50% avg): large lots have outsized impact, signals exaggerated" accent={C.warn} />
              <Checkbox label="VIX > 35: large lots more frequent but less reliable — everyone is trading big in panic" accent={C.warn} />
            </Section>
          </>
        )}

        <div style={{ marginTop: "20px", padding: "12px 16px", background: "#0d1117", border: "1px solid #21262d", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "#484f58" }}>VOLUME DOTS · LARGE LOT TRACKER · T&S PRINTS · CVD</div>
          <div style={{ fontSize: "10px", color: "#30363d" }}>TradeSlayer Pro · Strategy Reference Card</div>
        </div>
      </div>
    </div>
  );
}
