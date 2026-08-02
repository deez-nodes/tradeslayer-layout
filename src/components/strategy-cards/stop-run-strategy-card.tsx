import { useState } from "react";
import { Checkbox, Section, Pill, Divider, STRATEGY_COLORS as C } from "./StrategyCardCommon";

export default function StopRunStrategyCard() {
  const [activeTab, setActiveTab] = useState("setup");
  const tabs = [
    { id: "setup", label: "SETUP", icon: "⚙" },
    { id: "read", label: "READ", icon: "◉" },
    { id: "fade", label: "FADE", icon: "↩" },
    { id: "join", label: "JOIN", icon: "→" },
    { id: "risk", label: "RISK", icon: "⛊" },
  ];

  return (
    <div style={{ background: "#010409", minHeight: "100vh", color: "#c9d1d9", fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace", padding: "0" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(180deg, #0d1117 0%, #010409 100%)", borderBottom: "1px solid #21262d", padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #f85149 0%, #da3633 50%, #8b1a10 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 0 20px #f8514930" }}>
            💥
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono', monospace" }}>
              STOP RUN STRATEGY
            </h1>
            <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>
              ES / MES INTRADAY · BOOKMAP S&I TRACKER · MBO DATA
            </div>
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "10px", color: "#484f58", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontWeight: 700 }}>
            ★ HIGH-CONVICTION SIGNALS
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Pill text="Stop run INTO iceberg = reversal (fade the run)" color={C.cyan} />
            <Pill text="Stop & Hold: run triggers, price holds → continuation" color={C.purple} />
            <Pill text="Dumb & Dumber: stops sweep both sides → trade the survivor" color={C.orange} />
            <Pill text="Run + CVD divergence = trapped flow, high R:R fade" color={C.long} />
            <Pill text="Run without follow-through volume = exhaustion reversal" color={C.warn} />
          </div>
        </div>
      </div>

      {/* TAB NAV */}
      <div style={{ display: "flex", borderBottom: "1px solid #21262d", background: "#0d1117", padding: "0 12px", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none", border: "none", padding: "10px 16px", cursor: "pointer",
              fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              color: activeTab === tab.id
                ? tab.id === "fade" ? C.long : tab.id === "join" ? C.purple : tab.id === "risk" ? C.warn : C.info
                : "#484f58",
              borderBottom: activeTab === tab.id
                ? `2px solid ${tab.id === "fade" ? C.long : tab.id === "join" ? C.purple : tab.id === "risk" ? C.warn : C.info}`
                : "2px solid transparent",
              letterSpacing: "0.5px", whiteSpace: "nowrap", transition: "all 0.15s",
            }}
          >
            <span style={{ marginRight: "6px" }}>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "16px 14px", maxWidth: "720px", margin: "0 auto" }}>

        {/* ══════ SETUP ══════ */}
        {activeTab === "setup" && (
          <>
            <Section title="Stop Tracker Configuration" color={C.info} icon="⚙" defaultOpen={true}>
              <Divider label="S&I On-Chart — Stops" />
              <Checkbox label="Enable S&I Tracker → 'Show stops' checkbox ON" accent={C.info} />
              <Checkbox label="Rithmic: uncheck 'Aggregate quotes', enable 'Plugin mode'" accent={C.info} />
              <Checkbox label="Auto size threshold: ON — recalculates per-minute vs SD" sublabel="Stop chains combine multiple triggered stops in same direction — threshold filters noise" accent={C.info} />
              <Checkbox label="ES stop filter: ≥ 30 contracts per chain (lower than iceberg — stops are faster events)" accent={C.info} />
              <Checkbox label="MES stop filter: ≥ 120 contracts (scale ~4x from ES)" accent={C.info} />
              <Checkbox label="Color config: red for sell stops, green for buy stops — matches directional bias" accent={C.info} />

              <Divider label="Sub-Chart Config" />
              <Checkbox label="Stop CVD: SUM mode for cumulative bias, SUM_SAME_SIDE for run isolation" sublabel="SUM_SAME_SIDE resets on direction flip — cleanly isolates each run" accent={C.info} />
              <Checkbox label="Symmetric y-axis: ON — centers zero line for balanced visual" accent={C.info} />
              <Checkbox label="Alert threshold: set to match on-chart for 1:1 parity" accent={C.info} />
              <Checkbox label="Display: vertical bars for discrete stop events, line for cumulative" accent={C.info} />

              <Divider label="Companion Layers" />
              <Checkbox label="S&I Icebergs: ON — stop run INTO iceberg = highest conviction setup" accent={C.cyan} />
              <Checkbox label="Heatmap: active — locate liquidity clusters where stops likely rest" accent={C.cyan} />
              <Checkbox label="CVD (Cumulative Volume Delta): confirm net aggressive bias post-run" accent={C.cyan} />
              <Checkbox label="Volume Dots ≥ 25 lot: spot large aggressive prints during/after the run" accent={C.cyan} />
              <Checkbox label="Liquidity Tracker Pro: watch bid/ask liquidity shift post-run" accent={C.cyan} />
            </Section>
          </>
        )}

        {/* ══════ READ ══════ */}
        {activeTab === "read" && (
          <>
            <Section title="What Is a Stop Run" color={C.info} icon="◎" defaultOpen={true}>
              <Checkbox label="Stop orders sit OFF-book — invisible until triggered, then become market orders" sublabel="S&I Tracker detects them post-execution via MBO order lifecycle tracking" accent={C.info} />
              <Checkbox label="A stop run = chain of consecutive stops in the same direction sweeping through levels" accent={C.info} />
              <Checkbox label="Sub-chart spike shows magnitude: e.g., −33 = 33 sell stops triggered in that run" accent={C.info} />
              <Checkbox label="Stops sweep the book: aggressive sell market order takes best bid from 1693.4 → 1692" accent={C.info} />
            </Section>

            <Section title="Stop Run Variants" color={C.purple} icon="⚡" defaultOpen={true}>
              <Divider label="Stop & Hold" />
              <Checkbox label="Stop run triggers → price HOLDS the new level → continuation signal" sublabel="Stops fueled the move, but new participants step in to defend = momentum is real" accent={C.long} />
              <Checkbox label="Confirm: CVD continues in run direction, no reversal candle within 30 sec" accent={C.long} />

              <Divider label="Stop & Reverse" />
              <Checkbox label="Stop run triggers → price REVERSES immediately → trapped flow signal" sublabel="Run exhausted available supply/demand — no follow-through = fade opportunity" accent={C.short} />
              <Checkbox label="Confirm: iceberg appears at run terminus, CVD diverges, volume dries up" accent={C.short} />

              <Divider label="Dumb & Dumber" />
              <Checkbox label="Sell stops triggered → buy stops triggered shortly after (or vice versa)" sublabel="Both sides get swept — massive trapped flow creates explosive directional move" accent={C.orange} />
              <Checkbox label="Trade: wait for BOTH runs to complete, then join the surviving direction" accent={C.orange} />

              <Divider label="Stop Into Ice" />
              <Checkbox label="Stop run sweeps into an iceberg cluster → iceberg absorbs the run flow" sublabel="Highest conviction reversal — trapped stops + institutional defense = snap-back" accent={C.cyan} />
              <Checkbox label="Confirm: iceberg reloads 2+ times during/after the stop run" accent={C.cyan} />
            </Section>

            <Section title="Reading the Sub-Chart" color={C.info} icon="📊">
              <Checkbox label="Spike direction: positive = buy stops (upward sweep), negative = sell stops (downward)" accent={C.info} />
              <Checkbox label="Spike magnitude: > 50 contracts on ES = significant run, > 200 = monster" accent={C.info} />
              <Checkbox label="Cluster of spikes same direction = extended stop cascade (multi-wave run)" accent={C.info} />
              <Checkbox label="Flat line after spike = no continuation — potential reversal zone" accent={C.warn} />
              <Checkbox label="Opposite spike follows quickly = Dumb & Dumber pattern" accent={C.orange} />
            </Section>
          </>
        )}

        {/* ══════ FADE ══════ */}
        {activeTab === "fade" && (
          <>
            <Section title="Fade the Run — Conditions" color={C.long} icon="↩" defaultOpen={true}>
              <Divider label="Context" />
              <Checkbox label="Stop run occurs at structural level (PDH/PDL, VWAP, prior balance edge, round number)" accent={C.long} />
              <Checkbox label="Run direction is COUNTER to broader session bias (counter-trend run)" accent={C.long} />
              <Checkbox label="Session context: RTH open > 15 min, not within 5 min of major news" accent={C.long} />

              <Divider label="Stop Run Signal" />
              <Checkbox label="Sub-chart shows significant stop run spike (> 30 contracts ES, > 120 MES)" accent={C.long} />
              <Checkbox label="Price penetrates key level by 2-4 ticks then stalls — the sweep is complete" accent={C.long} />
              <Checkbox label="No follow-through volume: aggressive orders dry up within 15-30 seconds" accent={C.long} />

              <Divider label="Confirmation" />
              <Checkbox label="Iceberg cluster appears at or near the run terminus (Stop Into Ice)" accent={C.long} />
              <Checkbox label="CVD divergence: run pushed price down but net delta turns positive (or vice versa)" accent={C.long} />
              <Checkbox label="Heatmap: liquidity rebuilds on the side price just swept through" accent={C.long} />
              <Checkbox label="Volume Dots: large prints appear in reversal direction within 60 sec of run" accent={C.long} />
            </Section>

            <Section title="Fade — Trigger & Execution" color={C.long} icon="⚡" defaultOpen={true}>
              <Checkbox label="ENTRY: fade the run on first reversal candle after run exhaustion confirms" sublabel="Buy after sell-stop run, sell after buy-stop run — enter 1-2 ticks beyond run apex" accent={C.long} />
              <Checkbox label="ALT ENTRY: wait for retest of the run level — if it holds, enter on second touch" accent={C.long} />
              <Checkbox label="Position: full size if iceberg confirmed at run terminus, half size without" accent={C.long} />
            </Section>

            <Section title="Fade — Scale & Trail" color={C.long} icon="◧">
              <Divider label="Scale-Out" />
              <Checkbox label="T1: take 50% at reclaim of pre-run level (+4-6 ticks)" accent={C.long} />
              <Checkbox label="T2: take 25% at +8-12 ticks — next structural level or volume node" accent={C.long} />
              <Checkbox label="Runner: trail 25% with 4-tick trailing stop" accent={C.long} />

              <Divider label="Exit Signals" />
              <Checkbox label="Price fails to reclaim pre-run level within 90 sec → scratch" accent={C.warn} />
              <Checkbox label="New stop run triggers in same direction → the move is real, exit" accent={C.warn} />
              <Checkbox label="Opposing iceberg appears ahead of your target → take profit" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ JOIN ══════ */}
        {activeTab === "join" && (
          <>
            <Section title="Join the Run — Conditions (Stop & Hold)" color={C.purple} icon="→" defaultOpen={true}>
              <Divider label="Context" />
              <Checkbox label="Stop run occurs in DIRECTION of broader session trend" accent={C.purple} />
              <Checkbox label="Run breaks through a contested zone — stops clear out weak-hand opposition" accent={C.purple} />
              <Checkbox label="Price is not extended (not 3+ ATR from VWAP)" accent={C.purple} />

              <Divider label="Stop Run Signal" />
              <Checkbox label="Sub-chart shows strong stop spike: > 50 contracts ES in one burst" accent={C.purple} />
              <Checkbox label="Price clears key level and HOLDS above/below it for 30+ seconds" accent={C.purple} />
              <Checkbox label="No immediate reversal candle — price consolidates at new level" accent={C.purple} />

              <Divider label="Confirmation" />
              <Checkbox label="CVD continues trending in run direction post-sweep" accent={C.purple} />
              <Checkbox label="Heatmap: liquidity on the opposite side (where price came from) thins out" accent={C.purple} />
              <Checkbox label="New aggressive prints appear in run direction (Volume Dots confirm)" accent={C.purple} />
              <Checkbox label="No opposing iceberg cluster within 4 ticks of breakout level" accent={C.purple} />
            </Section>

            <Section title="Join — Trigger & Execution" color={C.purple} icon="⚡" defaultOpen={true}>
              <Checkbox label="ENTRY: join on the first pullback to the broken level after the run" sublabel="The level that was resistance is now support (or vice versa) — enter on retest" accent={C.purple} />
              <Checkbox label="ALT ENTRY: enter on consolidation breakout above/below the run zone" accent={C.purple} />
              <Checkbox label="AGGRESSIVE: enter during the run if > 50 stop contracts and CVD confirms" sublabel="Higher risk — requires immediate follow-through or scratch" accent={C.purple} />
            </Section>

            <Section title="Join — Scale & Trail" color={C.purple} icon="◧">
              <Divider label="Scale-Out" />
              <Checkbox label="T1: take 50% at next structural target (+6-10 ticks from run level)" accent={C.purple} />
              <Checkbox label="T2: take 25% at next major liquidity wall or iceberg cluster" accent={C.purple} />
              <Checkbox label="Runner: trail 25% with 6-tick trailing stop — continuation trades deserve room" accent={C.purple} />

              <Divider label="Exit Signals" />
              <Checkbox label="Price reclaims pre-run level (broken support/resistance fails to hold) → exit all" accent={C.warn} />
              <Checkbox label="Opposing stop run triggers → momentum may be shifting" accent={C.warn} />
              <Checkbox label="CVD flattens or diverges from price → exhaustion, tighten stop" accent={C.warn} />
              <Checkbox label="Time stop: no new high/low within 2 min of entry → scratch" accent={C.warn} />
            </Section>
          </>
        )}

        {/* ══════ RISK ══════ */}
        {activeTab === "risk" && (
          <>
            <Section title="Stop Placement" color={C.warn} icon="⛊" defaultOpen={true}>
              <Divider label="Fade Trades" />
              <Checkbox label="Initial stop: 2-3 ticks beyond the stop run apex (the furthest point of the sweep)" sublabel="If the run pushes further, your thesis is wrong — the fade is invalidated" accent={C.warn} />
              <Checkbox label="Hard stop MAX: 8 ticks (2 pts ES) — runs can spike, need slightly wider than iceberg plays" accent={C.short} />
              <Checkbox label="After T1: move stop to breakeven" accent={C.long} />

              <Divider label="Continuation Trades" />
              <Checkbox label="Initial stop: 2 ticks back through the broken level (the old S/R)" accent={C.warn} />
              <Checkbox label="Hard stop MAX: 6 ticks (1.5 pts ES) — tighter than fade, level must hold" accent={C.short} />
              <Checkbox label="After T1: trail stop below/above last consolidation low/high" accent={C.long} />
            </Section>

            <Section title="Warnings & Invalidators" color={C.short} icon="⚠" defaultOpen={true}>
              <Divider label="Immediate Invalidation" />
              <Checkbox label="Second stop run in SAME direction within 60 sec = this is real momentum, do NOT fade" accent={C.short} />
              <Checkbox label="Stop run on heavy volume (> 2x avg 30s volume) with no iceberg absorption = don't fade" accent={C.short} />
              <Checkbox label="Run occurs during news release → chaotic, unreliable signal" accent={C.short} />
              <Checkbox label="No CVD divergence after run → no trapped flow to fuel reversal" accent={C.short} />

              <Divider label="Regime Filters — No Trade" />
              <Checkbox label="Within ±2 min of scheduled news (FOMC, CPI, NFP, GDP)" accent={C.warn} />
              <Checkbox label="First 5 min of RTH open: stop runs during rotation are noisy" accent={C.warn} />
              <Checkbox label="Low-volume drift: < 50% of 20d avg volume — stops trigger erratically" accent={C.warn} />
              <Checkbox label="Wide spread chop: ES spread > 1 tick persistently" accent={C.warn} />
              <Checkbox label="Extreme VIX (> 35): stop cascades are massive and unpredictable" accent={C.warn} />

              <Divider label="Trap Awareness" />
              <Checkbox label="Stop run at obvious round number with no structural context → likely engineered" sublabel="Institutions hunt stops at obvious levels — the run itself is the trap" accent={C.short} />
              <Checkbox label="'Failed level from prior day' + stop run = high conviction next-day trade" sublabel="Pulcini setup: prior-session iceberg/stop zones carry into next session" accent={C.info} />
              <Checkbox label="Dumb & Dumber aftermath: wait for BOTH sweeps to complete before committing" accent={C.orange} />
              <Checkbox label="Run size mismatch: sub-chart shows small spike but price moved big → algo driven, unreliable" accent={C.short} />
            </Section>
          </>
        )}

        {/* FOOTER */}
        <div style={{ marginTop: "20px", padding: "12px 16px", background: "#0d1117", border: "1px solid #21262d", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "#484f58" }}>BOOKMAP S&I TRACKER · MBO BUNDLE · RITHMIC/BOOKMAP DATA</div>
          <div style={{ fontSize: "10px", color: "#30363d" }}>TradeSlayer Pro · Strategy Reference Card</div>
        </div>
      </div>
    </div>
  );
}
