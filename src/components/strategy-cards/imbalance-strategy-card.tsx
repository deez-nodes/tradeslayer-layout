import { useState } from "react";
import { Checkbox, Section, Pill, Divider, STRATEGY_COLORS as C } from "./StrategyCardCommon";

export default function ImbalanceStrategyCard() {
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
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #d29922 0%, #b8860b 50%, #8b6914 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 0 20px #d2992230" }}>
            ⚖
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono', monospace" }}>
              IMBALANCE INDICATOR
            </h1>
            <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>ES / MES INTRADAY · BID/ASK VOLUME IMBALANCE · FOOTPRINT ANALYSIS</div>
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "10px", color: "#484f58", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontWeight: 700 }}>★ HIGH-CONVICTION SIGNALS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Pill text="Stacked buy imbalances = aggressive demand → trend continuation" color={C.long} />
            <Pill text="Imbalance at S/R + absorption = institutional entry zone" color={C.cyan} />
            <Pill text="Imbalance reversal: buy → sell flip at highs = momentum exhaustion" color={C.warn} />
            <Pill text="Diagonal imbalance stacking = price accepting new value range" color={C.purple} />
            <Pill text="Imbalance void (no triggers) in move = hollow trend, likely to reverse" color={C.orange} />
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
            <Section title="Imbalance Indicator Configuration" color={C.info} icon="⚙" defaultOpen={true}>
              <Divider label="Core Settings" />
              <Checkbox label="Bookmap Imbalance Indicator: detects bid/ask volume imbalance at each price level" sublabel="Compares volume traded at bid vs ask within a candle at each tick level" accent={C.info} />
              <Checkbox label="Imbalance ratio: default 300% (3:1) — ask volume ≥ 3x bid volume = buy imbalance" sublabel="Lower ratio (200%) = more signals, noisier. Higher (400%) = fewer, cleaner signals." accent={C.info} />
              <Checkbox label="Min volume filter: ≥ 10 contracts at the price level to trigger" sublabel="Prevents thin-print false positives — need meaningful volume for signal validity" accent={C.info} />
              <Checkbox label="Display: green highlights for buy imbalance, red for sell imbalance on price ladder" accent={C.info} />
              <Checkbox label="Stacking detection: consecutive imbalances at adjacent prices = trend signal" accent={C.info} />

              <Divider label="Footprint / Bid-Ask Volume Map" />
              <Checkbox label="Enable bid/ask volume breakdown per price level (footprint-style view)" accent={C.info} />
              <Checkbox label="Resolution: tick-by-tick for micro reads, 1-min for broader patterns" accent={C.info} />
              <Checkbox label="Delta column: net volume (ask vol − bid vol) at each price — quick imbalance scan" accent={C.info} />

              <Divider label="Companion Layers" />
              <Checkbox label="Volume Profile: confirms whether imbalances align with HVN/LVN zones" accent={C.cyan} />
              <Checkbox label="CVD: aggregate delta should align with imbalance direction for confirmation" accent={C.cyan} />
              <Checkbox label="Heatmap: shows if passive liquidity sits at imbalance levels (absorption potential)" accent={C.cyan} />
              <Checkbox label="Large Lots: big prints co-located with imbalance = institutional conviction" accent={C.cyan} />
            </Section>
          </>
        )}

        {/* ══════ READ ══════ */}
        {activeTab === "read" && (
          <>
            <Section title="What Imbalances Mean" color={C.info} icon="◎" defaultOpen={true}>
              <Checkbox label="BUY IMBALANCE: at a given price, ask volume >> bid volume (e.g. 3:1 or higher)" sublabel="Aggressive buyers overwhelming sellers at that tick → demand exceeds supply locally" accent={C.long} />
              <Checkbox label="SELL IMBALANCE: at a given price, bid volume >> ask volume (e.g. 3:1 or higher)" sublabel="Aggressive sellers overwhelming buyers at that tick → supply exceeds demand locally" accent={C.short} />
              <Checkbox label="Imbalance ≠ direction: a buy imbalance at a high can be exhaustion, not continuation" accent={C.warn} />
              <Checkbox label="CONTEXT IS EVERYTHING: where the imbalance occurs determines its meaning" accent={C.warn} />
            </Section>

            <Section title="Imbalance Patterns" color={C.purple} icon="◆" defaultOpen={true}>
              <Divider label="Stacked Imbalances" />
              <Checkbox label="3+ consecutive buy imbalances at ascending prices = aggressive demand campaign" sublabel="Buyers lifting offers at every tick level → strong upward momentum" accent={C.long} />
              <Checkbox label="3+ consecutive sell imbalances at descending prices = aggressive supply campaign" accent={C.short} />
              <Checkbox label="Diagonal stacking = most bullish/bearish pattern — market accepting new value" accent={C.info} />

              <Divider label="Imbalance at Key Levels" />
              <Checkbox label="Buy imbalance at support = demand stepping in to defend → bullish" accent={C.long} />
              <Checkbox label="Sell imbalance at resistance = supply stepping in to cap → bearish" accent={C.short} />
              <Checkbox label="Buy imbalance at resistance = breakout attempt → confirm with volume follow-through" accent={C.warn} />
              <Checkbox label="Sell imbalance at support = breakdown attempt → confirm with volume follow-through" accent={C.warn} />

              <Divider label="Imbalance Reversal" />
              <Checkbox label="Buy imbalances flipping to sell imbalances at highs = momentum reversing" sublabel="Buyers were aggressive, now sellers are stepping up → potential top" accent={C.warn} />
              <Checkbox label="Sell imbalances flipping to buy imbalances at lows = momentum reversing" accent={C.warn} />
              <Checkbox label="The flip itself is the signal — don't need to wait for price confirmation" accent={C.info} />

              <Divider label="Imbalance Void" />
              <Checkbox label="Price moves multiple ticks with NO imbalance triggers = hollow move" sublabel="No aggressive participation on either side → move is likely position squaring, not conviction" accent={C.orange} />
              <Checkbox label="Hollow rallies reverse. Hollow selloffs bounce. Require imbalance for real moves." accent={C.orange} />
              <Checkbox label="Exception: LVN fast-travel zone — price can move through thin areas without imbalance" accent={C.neutral} />
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
              <Checkbox label="Volume profile not B-shaped (selling trend) — don't buy into liquidation" accent={C.long} />

              <Divider label="Imbalance Signal" />
              <Checkbox label="Buy imbalance triggers at support level: aggressive demand defending the price" accent={C.long} />
              <Checkbox label="Stacked buy imbalances (2+ at consecutive ticks) at or just above support" accent={C.long} />
              <Checkbox label="Sell imbalance FADING: prior sell imbalances at this level now replaced by buy" accent={C.long} />
              <Checkbox label="Imbalance ratio > 4:1 at support = high conviction aggressive demand" accent={C.long} />

              <Divider label="Confirmation" />
              <Checkbox label="CVD turning positive — aggregate aggressive flow aligns with imbalance" accent={C.long} />
              <Checkbox label="Heatmap: bid-side liquidity visible at support (passive + aggressive align)" accent={C.long} />
              <Checkbox label="No sell imbalance triggers within 4 ticks above (no supply overhead)" accent={C.long} />
              <Checkbox label="Large lot buy prints co-located with buy imbalance = institutional + imbalance confluence" accent={C.long} />
            </Section>

            <Section title="Long Entry — Trigger & Exit" color={C.long} icon="⚡" defaultOpen={true}>
              <Checkbox label="ENTRY: buy on first uptick after buy imbalance confirms at support" sublabel="Limit 1-2 ticks above the imbalance level" accent={C.long} />
              <Checkbox label="ALT: buy on stacked imbalance breakout — enter as 3rd consecutive buy imbalance prints" accent={C.long} />
              <Checkbox label="T1: +4-6 ticks (50%) — first resistance or sell imbalance cluster above" accent={C.long} />
              <Checkbox label="T2: +8-12 ticks (25%) — next structural level or volume node" accent={C.long} />
              <Checkbox label="Runner: trail 25% with 4-tick trailing stop" accent={C.long} />
              <Checkbox label="EXIT: sell imbalance appears at or near your position → supply entering" accent={C.warn} />
              <Checkbox label="EXIT: imbalance void on current push → hollow rally, take profit" accent={C.warn} />
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
              <Checkbox label="Volume profile not P-shaped (buying trend) — don't sell into short squeeze" accent={C.short} />

              <Divider label="Imbalance Signal" />
              <Checkbox label="Sell imbalance triggers at resistance level: aggressive supply capping the price" accent={C.short} />
              <Checkbox label="Stacked sell imbalances (2+ at consecutive ticks) at or just below resistance" accent={C.short} />
              <Checkbox label="Buy imbalance FADING: prior buy imbalances at this level now replaced by sell" accent={C.short} />
              <Checkbox label="Imbalance ratio > 4:1 at resistance = high conviction aggressive supply" accent={C.short} />

              <Divider label="Confirmation" />
              <Checkbox label="CVD turning negative — aggregate aggressive flow aligns with imbalance" accent={C.short} />
              <Checkbox label="Heatmap: ask-side liquidity visible at resistance (passive + aggressive align)" accent={C.short} />
              <Checkbox label="No buy imbalance triggers within 4 ticks below (no demand underneath)" accent={C.short} />
              <Checkbox label="Large lot sell prints co-located with sell imbalance = institutional + imbalance confluence" accent={C.short} />
            </Section>

            <Section title="Short Entry — Trigger & Exit" color={C.short} icon="⚡" defaultOpen={true}>
              <Checkbox label="ENTRY: sell on first downtick after sell imbalance confirms at resistance" sublabel="Limit 1-2 ticks below the imbalance level" accent={C.short} />
              <Checkbox label="ALT: sell on stacked imbalance breakdown — enter as 3rd consecutive sell imbalance prints" accent={C.short} />
              <Checkbox label="T1: −4-6 ticks (50%) — first support or buy imbalance cluster below" accent={C.short} />
              <Checkbox label="T2: −8-12 ticks (25%) — next structural level or volume node" accent={C.short} />
              <Checkbox label="Runner: trail 25% with 4-tick trailing stop" accent={C.short} />
              <Checkbox label="EXIT: buy imbalance appears at or near your position → demand entering" accent={C.warn} />
              <Checkbox label="EXIT: imbalance void on current push → hollow selloff, cover" accent={C.warn} />
              <Checkbox label="Time stop: no −2 tick move within 90 sec → scratch" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ RISK ══════ */}
        {activeTab === "risk" && (
          <>
            <Section title="Stop Placement" color={C.warn} icon="⛊" defaultOpen={true}>
              <Checkbox label="S/R bounce: 2 ticks beyond the imbalance zone at S/R" accent={C.warn} />
              <Checkbox label="Stacked breakout: 2 ticks below the first imbalance in the stack" accent={C.warn} />
              <Checkbox label="Hard MAX: 6 ticks (1.5 pts ES / $75 per MES)" accent={C.short} />
              <Checkbox label="After T1: move stop to breakeven" accent={C.long} />
              <Checkbox label="If imbalance reverses at your level while in trade → exit immediately" sublabel="Buy imbalance flipping to sell while you're long = thesis destroyed" accent={C.short} />
            </Section>

            <Section title="Warnings & Invalidators" color={C.short} icon="⚠" defaultOpen={true}>
              <Divider label="Signal Quality" />
              <Checkbox label="Low-volume imbalance (< 10 contracts at price level) = noise, not signal" accent={C.short} />
              <Checkbox label="Single imbalance in isolation = weak — require 2+ or structural confluence" accent={C.short} />
              <Checkbox label="Imbalance during news = reactive volume, not deliberate positioning" accent={C.short} />
              <Checkbox label="Imbalance at LVN = expected (thin area naturally creates ratios) — low conviction" accent={C.warn} />

              <Divider label="Common Traps" />
              <Checkbox label="Buy imbalance at the TOP of a move = exhaustion, not continuation" sublabel="Aggressive buyers making their last push — next move is often down" accent={C.short} />
              <Checkbox label="Sell imbalance at the BOTTOM of a move = capitulation, not continuation" accent={C.short} />
              <Checkbox label="Stacked imbalances that form AFTER a big move = late, not early — chase risk" accent={C.warn} />
              <Checkbox label="Imbalance vs absorption conflict: imbalance says move, absorption says hold → absorption wins" accent={C.warn} />

              <Divider label="Regime Filters" />
              <Checkbox label="Within ±2 min of scheduled news → imbalances are chaotic and unreliable" accent={C.warn} />
              <Checkbox label="First 5 min RTH: opening rotation creates false imbalance patterns" accent={C.warn} />
              <Checkbox label="Low volume (< 50% avg): min volume filter may not trigger even on real moves" accent={C.warn} />
              <Checkbox label="VIX > 35: imbalance ratios are extreme but whipsaw frequently" accent={C.warn} />
            </Section>
          </>
        )}

        <div style={{ marginTop: "20px", padding: "12px 16px", background: "#0d1117", border: "1px solid #21262d", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "#484f58" }}>BID/ASK IMBALANCE · FOOTPRINT · VOLUME PROFILE · CVD</div>
          <div style={{ fontSize: "10px", color: "#30363d" }}>TradeSlayer Pro · Strategy Reference Card</div>
        </div>
      </div>
    </div>
  );
}
