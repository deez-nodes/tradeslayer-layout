import { useState } from "react";
import { Checkbox, Section, Pill, Divider, STRATEGY_COLORS as C } from "./StrategyCardCommon";

export default function LiquidityTrackerCard() {
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
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #bc8cff 0%, #8957e5 50%, #553098 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 0 20px #bc8cff30" }}>
            🌊
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono', monospace" }}>
              LIQUIDITY TRACKER PRO
            </h1>
            <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>ES / MES INTRADAY · MBO BUNDLE · ORDER BOOK DYNAMICS</div>
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "10px", color: "#484f58", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontWeight: 700 }}>★ HIGH-CONVICTION SIGNALS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Pill text="Bid liquidity surges + ask thins = bullish imbalance → long" color={C.long} />
            <Pill text="Large-order imbalance ≥ 10x diverges from total = 'smart money' bias" color={C.cyan} />
            <Pill text="Liquidity pulls ahead of price = path of least resistance revealed" color={C.purple} />
            <Pill text="Book flip: bid/ask dominance reverses sharply = momentum shift" color={C.orange} />
            <Pill text="Sustained imbalance at VWAP/key level = institutional defense" color={C.info} />
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
            <Section title="LT Pro Configuration" color={C.info} icon="⚙" defaultOpen={true}>
              <Divider label="Core Settings" />
              <Checkbox label="Data requirement: CME MBO via Rithmic or BookmapData ONLY" sublabel="LT Pro order-size filter does NOT work with CQG, dxFeed, Eurex, or non-CME data" accent={C.info} />
              <Checkbox label="Market depth (half-life): 10-20 levels for ES intraday" sublabel="Exponential weighting: closer levels count more. 10 = tight focus, 20 = broader view" accent={C.info} />
              <Checkbox label="Smooth: light smoothing (2-3) for cleaner lines, 0 for raw response" accent={C.info} />
              <Checkbox label="Display: lines for bid (blue) and ask (red) liquidity, plus imbalance" accent={C.info} />

              <Divider label="Order Size Filter (Key Feature)" />
              <Checkbox label="Unfiltered view: shows ALL resting liquidity — total market depth" accent={C.info} />
              <Checkbox label="Min size ≥ 5: filters out small retail orders, shows 'informed' liquidity" sublabel="Imbalance between large orders often diverges from total — that divergence IS the signal" accent={C.cyan} />
              <Checkbox label="Min size ≥ 10: aggressive filter — shows only institutional-scale resting orders" accent={C.cyan} />
              <Checkbox label="Run BOTH views side-by-side: unfiltered + filtered ≥ 5 for maximum context" sublabel="When total imbalance is flat but large-order imbalance is 10x skewed → smart money positioning" accent={C.cyan} />

              <Divider label="Companion Layers" />
              <Checkbox label="Heatmap: visual confirmation of where LT Pro detects liquidity concentration" accent={C.purple} />
              <Checkbox label="Liquidity Marker: flags sudden adds/pulls — complements LT Pro's continuous view" accent={C.purple} />
              <Checkbox label="CVD: aggressive order bias to pair with LT Pro's passive order view" accent={C.purple} />
              <Checkbox label="S&I Tracker: iceberg/stop events that explain sudden LT Pro shifts" accent={C.purple} />
            </Section>
          </>
        )}

        {/* ══════ READ ══════ */}
        {activeTab === "read" && (
          <>
            <Section title="Reading LT Pro Lines" color={C.info} icon="◎" defaultOpen={true}>
              <Checkbox label="Bid line (blue): total exponentially-weighted resting buy liquidity across all levels" accent={C.info} />
              <Checkbox label="Ask line (red): total exponentially-weighted resting sell liquidity across all levels" accent={C.info} />
              <Checkbox label="Imbalance: bid minus ask — positive = more buy liquidity, negative = more sell" accent={C.info} />
              <Checkbox label="Rising bid line: buyers are ADDING resting orders → building demand" accent={C.long} />
              <Checkbox label="Rising ask line: sellers are ADDING resting orders → building supply" accent={C.short} />
              <Checkbox label="Falling bid line: buyers PULLING orders → demand evaporating" accent={C.short} />
              <Checkbox label="Falling ask line: sellers PULLING orders → supply evaporating" accent={C.long} />
            </Section>

            <Section title="Key Patterns" color={C.purple} icon="◆" defaultOpen={true}>
              <Divider label="Liquidity Imbalance" />
              <Checkbox label="Bid >> Ask: heavy passive demand → price likely to bounce or hold support" accent={C.long} />
              <Checkbox label="Ask >> Bid: heavy passive supply → price likely to reject or hold resistance" accent={C.short} />
              <Checkbox label="Best signal: imbalance at structural level (VWAP, PDH/PDL, round number)" accent={C.info} />

              <Divider label="Large-Order Divergence" />
              <Checkbox label="Total imbalance flat BUT filtered (≥5) imbalance strongly skewed" sublabel="Retail is balanced but institutions are loading one side → follow the big orders" accent={C.cyan} />
              <Checkbox label="Ratio check: if large-order imbalance > 10x vs total → high conviction directional bias" accent={C.cyan} />

              <Divider label="Liquidity Pull / Add Dynamics" />
              <Checkbox label="Ask liquidity pulls BEFORE price rise → sellers getting out of the way = bullish" accent={C.long} />
              <Checkbox label="Bid liquidity pulls BEFORE price drop → buyers getting out of the way = bearish" accent={C.short} />
              <Checkbox label="Liquidity ADDS opposing price direction → passive defense building = potential reversal" accent={C.warn} />

              <Divider label="Book Flip" />
              <Checkbox label="Bid and ask dominance reverses sharply within seconds → momentum regime change" accent={C.orange} />
              <Checkbox label="Price lag: the flip often precedes the price move by 5-15 seconds" accent={C.orange} />
              <Checkbox label="Most reliable when it occurs at a key structural level with CVD confirmation" accent={C.orange} />
            </Section>
          </>
        )}

        {/* ══════ LONG ══════ */}
        {activeTab === "long" && (
          <>
            <Section title="Long Entry — Conditions" color={C.long} icon="▲" defaultOpen={true}>
              <Divider label="Context" />
              <Checkbox label="Price at or near structural support (VWAP, PDL, balance low, volume node)" accent={C.long} />
              <Checkbox label="Session: RTH open > 15 min, not within 5 min of major news" accent={C.long} />
              <Checkbox label="Broader bias not aggressively bearish" accent={C.long} />

              <Divider label="LT Pro Signal" />
              <Checkbox label="Bid liquidity rising while ask liquidity flat or falling → demand building" accent={C.long} />
              <Checkbox label="Large-order filter (≥5): bid-side imbalance > 3x ask → institutional demand" accent={C.long} />
              <Checkbox label="Ask-side liquidity PULLING ahead of current price → supply vacuum above" accent={C.long} />
              <Checkbox label="Book flip: bid takes over from ask dominance at support level" accent={C.long} />

              <Divider label="Confirmation" />
              <Checkbox label="CVD turning positive — aggressors align with passive bid buildup" accent={C.long} />
              <Checkbox label="Heatmap: visible bid wall building at support, ask side thinning above" accent={C.long} />
              <Checkbox label="S&I: iceberg detection on bid side corroborates LT Pro bid buildup" accent={C.long} />
            </Section>

            <Section title="Long Entry — Trigger & Exit" color={C.long} icon="⚡" defaultOpen={true}>
              <Checkbox label="ENTRY: buy on first uptick after LT Pro confirms bid dominance at support" sublabel="Limit 1-2 ticks above support, or market on clear momentum shift" accent={C.long} />
              <Checkbox label="T1: take 50% at +4-6 ticks — first resistance or where ask builds up" accent={C.long} />
              <Checkbox label="T2: take 25% at +8-12 ticks — next key LT Pro ask concentration" accent={C.long} />
              <Checkbox label="Runner: trail 25% with 4-tick trailing stop" accent={C.long} />
              <Checkbox label="EXIT SIGNAL: ask liquidity suddenly surges above → new supply cap forming" accent={C.warn} />
              <Checkbox label="EXIT SIGNAL: bid liquidity collapses → your support is evaporating" accent={C.warn} />
              <Checkbox label="Time stop: no +2 tick move within 90 sec → scratch" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ SHORT ══════ */}
        {activeTab === "short" && (
          <>
            <Section title="Short Entry — Conditions" color={C.short} icon="▼" defaultOpen={true}>
              <Divider label="Context" />
              <Checkbox label="Price at or near structural resistance (VWAP, PDH, balance high, round number)" accent={C.short} />
              <Checkbox label="Session: RTH open > 15 min, not within 5 min of major news" accent={C.short} />
              <Checkbox label="Broader bias not aggressively bullish" accent={C.short} />

              <Divider label="LT Pro Signal" />
              <Checkbox label="Ask liquidity rising while bid liquidity flat or falling → supply building" accent={C.short} />
              <Checkbox label="Large-order filter (≥5): ask-side imbalance > 3x bid → institutional supply" accent={C.short} />
              <Checkbox label="Bid-side liquidity PULLING below current price → demand vacuum below" accent={C.short} />
              <Checkbox label="Book flip: ask takes over from bid dominance at resistance level" accent={C.short} />

              <Divider label="Confirmation" />
              <Checkbox label="CVD turning negative — aggressors align with passive ask buildup" accent={C.short} />
              <Checkbox label="Heatmap: visible ask wall at resistance, bid side thinning below" accent={C.short} />
              <Checkbox label="S&I: iceberg detection on ask side corroborates LT Pro ask buildup" accent={C.short} />
            </Section>

            <Section title="Short Entry — Trigger & Exit" color={C.short} icon="⚡" defaultOpen={true}>
              <Checkbox label="ENTRY: sell on first downtick after LT Pro confirms ask dominance at resistance" sublabel="Limit 1-2 ticks below resistance, or market on clear momentum shift" accent={C.short} />
              <Checkbox label="T1: cover 50% at −4-6 ticks — first support or where bid builds up" accent={C.short} />
              <Checkbox label="T2: cover 25% at −8-12 ticks — next key LT Pro bid concentration" accent={C.short} />
              <Checkbox label="Runner: trail 25% with 4-tick trailing stop" accent={C.short} />
              <Checkbox label="EXIT SIGNAL: bid liquidity suddenly surges below → new demand floor forming" accent={C.warn} />
              <Checkbox label="EXIT SIGNAL: ask liquidity collapses → your resistance is evaporating" accent={C.warn} />
              <Checkbox label="Time stop: no −2 tick move within 90 sec → scratch" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ RISK ══════ */}
        {activeTab === "risk" && (
          <>
            <Section title="Stop Placement" color={C.warn} icon="⛊" defaultOpen={true}>
              <Checkbox label="Initial stop: 2-3 ticks beyond the LT Pro liquidity concentration zone" sublabel="If bid wall is your thesis, stop goes just below where bids are stacked" accent={C.warn} />
              <Checkbox label="Hard stop MAX: 6 ticks (1.5 pts ES / $75 per MES)" accent={C.short} />
              <Checkbox label="Dynamic stop: if LT Pro shows liquidity PULLING from your side → tighten or exit" sublabel="LT Pro gives real-time stop adjustment signals — the book tells you when to leave" accent={C.warn} />
              <Checkbox label="After T1: move stop to breakeven" accent={C.long} />
            </Section>

            <Section title="Warnings & Invalidators" color={C.short} icon="⚠" defaultOpen={true}>
              <Divider label="Immediate Invalidation" />
              <Checkbox label="Liquidity on YOUR side collapses rapidly → passive defense abandoned, exit" accent={C.short} />
              <Checkbox label="Large-order filter divergence reverses → institutional bias has shifted" accent={C.short} />
              <Checkbox label="Price slices through your LT Pro wall on heavy volume → broken level, flip bias" accent={C.short} />
              <Checkbox label="Both sides pulling simultaneously → liquidity vacuum, stand aside (wide spread incoming)" accent={C.short} />

              <Divider label="LT Pro Specific Caveats" />
              <Checkbox label="LT Pro is PASSIVE orders only — doesn't show aggressive flow (need CVD for that)" sublabel="Always pair LT Pro with CVD: passive buildup + aggressive confirmation = highest conviction" accent={C.warn} />
              <Checkbox label="Flickering best price causes small noise — use smoothing ≥ 2 to filter" accent={C.warn} />
              <Checkbox label="Spoofs show up as liquidity adds then pulls — cross-reference with Liquidity Marker" accent={C.warn} />
              <Checkbox label="LT Pro order size filter only works on CME via Rithmic or BookmapData" accent={C.warn} />

              <Divider label="Regime Filters" />
              <Checkbox label="Within ±2 min of scheduled news → passive liquidity gets pulled en masse" accent={C.warn} />
              <Checkbox label="First 5 min RTH: book is rebuilding, LT Pro readings are noisy" accent={C.warn} />
              <Checkbox label="VIX > 35: passive orders get pulled faster, LT Pro signals are transient" accent={C.warn} />
              <Checkbox label="Low volume sessions: thin book means small orders create outsized LT Pro signals" accent={C.warn} />
            </Section>
          </>
        )}

        <div style={{ marginTop: "20px", padding: "12px 16px", background: "#0d1117", border: "1px solid #21262d", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "#484f58" }}>LIQUIDITY TRACKER PRO · MBO BUNDLE · RITHMIC/BOOKMAP DATA</div>
          <div style={{ fontSize: "10px", color: "#30363d" }}>TradeSlayer Pro · Strategy Reference Card</div>
        </div>
      </div>
    </div>
  );
}
