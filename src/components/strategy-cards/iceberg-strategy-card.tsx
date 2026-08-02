import { useState } from "react";
import { Checkbox, Section, Pill, Divider, STRATEGY_COLORS as C } from "./StrategyCardCommon";
const COLORS = C;

export default function IcebergStrategyCard() {
  const [activeTab, setActiveTab] = useState("setup");

  const tabs = [
    { id: "setup", label: "SETUP", icon: "⚙" },
    { id: "read", label: "READ", icon: "◉" },
    { id: "long", label: "LONG", icon: "▲" },
    { id: "short", label: "SHORT", icon: "▼" },
    { id: "risk", label: "RISK", icon: "⛊" },
  ];

  return (
    <div
      style={{
        background: "#010409",
        minHeight: "100vh",
        color: "#c9d1d9",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
        padding: "0",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(180deg, #0d1117 0%, #010409 100%)",
          borderBottom: "1px solid #21262d",
          padding: "20px 20px 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background:
                "linear-gradient(135deg, #58a6ff 0%, #1f6feb 50%, #0d419d 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              boxShadow: "0 0 20px #58a6ff30",
            }}
          >
            🧊
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 800,
                color: "#e6edf3",
                letterSpacing: "-0.3px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              ICEBERG ORDER STRATEGY
            </h1>
            <div
              style={{
                fontSize: "11px",
                color: "#484f58",
                marginTop: "2px",
              }}
            >
              ES / MES INTRADAY · BOOKMAP S&I TRACKER
            </div>
          </div>
        </div>

        {/* QUICK REFERENCE SIGNALS */}
        <div
          style={{
            background: "#161b22",
            border: "1px solid #21262d",
            borderRadius: "8px",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "#484f58",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              marginBottom: "10px",
              fontWeight: 700,
            }}
          >
            ★ HIGH-CONVICTION SIGNALS
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            <Pill
              text="Iceberg absorbs 3+ waves → fade direction"
              color={COLORS.cyan}
            />
            <Pill
              text="Cluster at VWAP/PDH/PDL = institutional defense"
              color={COLORS.info}
            />
            <Pill
              text="Broken Ice = failed iceberg → strong continuation"
              color={COLORS.purple}
            />
            <Pill
              text="Iceberg + delta divergence = reversal imminent"
              color={COLORS.long}
            />
            <Pill
              text="Exhausted reload (iceberg stops refilling) = breakout"
              color={COLORS.warn}
            />
          </div>
        </div>
      </div>

      {/* TAB NAV */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #21262d",
          background: "#0d1117",
          padding: "0 12px",
          overflowX: "auto",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none",
              border: "none",
              padding: "10px 16px",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              color:
                activeTab === tab.id
                  ? tab.id === "long"
                    ? COLORS.long
                    : tab.id === "short"
                    ? COLORS.short
                    : tab.id === "risk"
                    ? COLORS.warn
                    : COLORS.info
                  : "#484f58",
              borderBottom:
                activeTab === tab.id
                  ? `2px solid ${
                      tab.id === "long"
                        ? COLORS.long
                        : tab.id === "short"
                        ? COLORS.short
                        : tab.id === "risk"
                        ? COLORS.warn
                        : COLORS.info
                    }`
                  : "2px solid transparent",
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            <span style={{ marginRight: "6px" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "16px 14px", maxWidth: "720px", margin: "0 auto" }}>
        {/* ═══════════════ SETUP TAB ═══════════════ */}
        {activeTab === "setup" && (
          <>
            <Section
              title="Indicator Configuration"
              color={COLORS.info}
              icon="⚙"
              defaultOpen={true}
            >
              <Divider label="Stops & Icebergs On-Chart" />
              <Checkbox
                label="Enable S&I Tracker add-on → MBO bundle required"
                accent={COLORS.info}
              />
              <Checkbox
                label="Rithmic: uncheck 'Aggregate quotes', enable 'Plugin mode'"
                accent={COLORS.info}
              />
              <Checkbox
                label="Auto size threshold: ON — recalculates per-minute vs SD"
                sublabel="Override manually if too much noise: bump individual threshold 25–50% above auto"
                accent={COLORS.info}
              />
              <Checkbox
                label="ES filter: ≥ 50 contracts per iceberg (default auto, raise in high-vol sessions)"
                accent={COLORS.info}
              />
              <Checkbox
                label="MES filter: ≥ 200 contracts (scale ~4x from ES due to 1/5 multiplier)"
                accent={COLORS.info}
              />
              <Checkbox
                label="Aggregation filter: set above half your individual threshold to collapse clusters"
                accent={COLORS.info}
              />
              <Checkbox
                label="Filtered icons: semi-transparent at 40% opacity — don't hide, just dim"
                accent={COLORS.info}
              />

              <Divider label="Sub-Chart Config" />
              <Checkbox
                label="Accumulation mode: SUM for trend bias, EXPONENTIAL (1min half-life) for momentum"
                accent={COLORS.info}
              />
              <Checkbox
                label="Iceberg CVD line: blue for buy icebergs, orange for sell icebergs"
                accent={COLORS.info}
              />
              <Checkbox
                label="Alert threshold: match on-chart threshold for 1:1 alert-to-visual parity"
                accent={COLORS.info}
              />

              <Divider label="Companion Layers" />
              <Checkbox
                label="Heatmap: active — watch for liquidity walls reappearing at same price"
                accent={COLORS.cyan}
              />
              <Checkbox
                label="Volume Dots / Large Lot Tracker: filter ≥ 25 lot on ES"
                accent={COLORS.cyan}
              />
              <Checkbox
                label="CVD (Cumulative Volume Delta): confirm net aggressive bias"
                accent={COLORS.cyan}
              />
              <Checkbox
                label="Strength Level Indicator: 5ms delay, corroborates hidden liquidity"
                accent={COLORS.cyan}
              />
              <Checkbox
                label="Tradermap Pro: bot filter sensitivity MEDIUM for ES/MES"
                accent={COLORS.cyan}
              />
            </Section>
          </>
        )}

        {/* ═══════════════ READ TAB ═══════════════ */}
        {activeTab === "read" && (
          <>
            <Section
              title="Genuine Accumulation vs Spoof"
              color={COLORS.info}
              icon="◎"
              defaultOpen={true}
            >
              <Checkbox
                label="GENUINE: iceberg absorbs 3+ aggressive waves, price holds ± 2 ticks"
                sublabel="Hidden liquidity keeps reloading at the same price — wall doesn't move"
                accent={COLORS.long}
              />
              <Checkbox
                label="GENUINE: iceberg size stays consistent or grows across reloads"
                accent={COLORS.long}
              />
              <Checkbox
                label="GENUINE: delta diverges from price — selling into it but price won't drop"
                accent={COLORS.long}
              />
              <Checkbox
                label="SPOOF: iceberg flashes then disappears before significant fills"
                sublabel="Size never actually transacts — it's pulled, not absorbed"
                accent={COLORS.short}
              />
              <Checkbox
                label="SPOOF: iceberg appears only during fast moves (momentum chasing, not defending)"
                accent={COLORS.short}
              />
              <Checkbox
                label="SPOOF: no corresponding print on T&S — order book ghost"
                accent={COLORS.short}
              />
            </Section>

            <Section
              title="Bid vs Ask Iceberg Intent"
              color={COLORS.purple}
              icon="⇅"
              defaultOpen={true}
            >
              <Checkbox
                label="BID-SIDE iceberg: hidden buy orders absorbing market sells"
                sublabel="Bullish intent — large buyer defending a floor"
                accent={COLORS.long}
              />
              <Checkbox
                label="ASK-SIDE iceberg: hidden sell orders absorbing market buys"
                sublabel="Bearish intent — large seller capping a ceiling"
                accent={COLORS.short}
              />
              <Checkbox
                label="BOTH SIDES at same level = contested zone → wait for one side to exhaust"
                accent={COLORS.warn}
              />
            </Section>

            <Section
              title="Clusters vs Isolated Fills"
              color={COLORS.cyan}
              icon="◆"
            >
              <Checkbox
                label="CLUSTER: 3+ iceberg detections within 2-4 ticks = institutional zone"
                sublabel="Higher conviction — treat as major S/R until broken"
                accent={COLORS.info}
              />
              <Checkbox
                label="ISOLATED: single iceberg fill with no follow-through = low conviction"
                sublabel="May be algo noise or partial fill — don't trade alone"
                accent={COLORS.neutral}
              />
              <Checkbox
                label="STACKED: icebergs at consecutive tick levels = aggressive campaign"
                accent={COLORS.info}
              />
            </Section>

            <Section
              title="Confirmation Signals"
              color={COLORS.info}
              icon="✦"
            >
              <Checkbox
                label="CVD divergence: net aggressor direction opposes price move at iceberg"
                accent={COLORS.info}
              />
              <Checkbox
                label="Large lot prints co-located with iceberg level (Volume Dots)"
                accent={COLORS.info}
              />
              <Checkbox
                label="Heatmap shows liquidity replenishing at exact iceberg price"
                accent={COLORS.info}
              />
              <Checkbox
                label="Sub-chart iceberg CVD trending in direction of iceberg defense"
                accent={COLORS.info}
              />
              <Checkbox
                label="Stop run INTO iceberg → trapped shorts/longs fuel reversal"
                accent={COLORS.info}
              />
            </Section>
          </>
        )}

        {/* ═══════════════ LONG TAB ═══════════════ */}
        {activeTab === "long" && (
          <>
            <Section
              title="Long Entry — Conditions"
              color={COLORS.long}
              icon="▲"
              defaultOpen={true}
            >
              <Divider label="Context" />
              <Checkbox
                label="Price at or near structural support (VWAP, PDL, prior balance low, round number)"
                accent={COLORS.long}
              />
              <Checkbox
                label="Session context: RTH open > 15 min, not within 5 min of major news"
                accent={COLORS.long}
              />
              <Checkbox
                label="Broader bias not aggressively bearish (no panic flush / limit-down)"
                accent={COLORS.long}
              />

              <Divider label="Iceberg Signal" />
              <Checkbox
                label="BID-side iceberg cluster detected: ≥ 2 icebergs within 4 ticks"
                accent={COLORS.long}
              />
              <Checkbox
                label="Iceberg absorbs ≥ 3 waves of aggressive selling — price holds"
                accent={COLORS.long}
              />
              <Checkbox
                label="Iceberg reloads at same price (repeated refills visible on heatmap)"
                accent={COLORS.long}
              />

              <Divider label="Confirmation" />
              <Checkbox
                label="CVD flattens or turns positive while price holds at iceberg level"
                accent={COLORS.long}
              />
              <Checkbox
                label="Sell-side momentum exhausts: smaller prints, wider spread on ask"
                accent={COLORS.long}
              />
              <Checkbox
                label="Heatmap: ask-side liquidity thins above iceberg (path of least resistance up)"
                accent={COLORS.long}
              />
            </Section>

            <Section
              title="Long Entry — Trigger"
              color={COLORS.long}
              icon="⚡"
              defaultOpen={true}
            >
              <Checkbox
                label="ENTRY: Buy on first uptick off iceberg level after absorption confirms"
                sublabel="Limit order 1-2 ticks above iceberg price, or market on clear momentum shift"
                accent={COLORS.long}
              />
              <Checkbox
                label="ALT ENTRY: buy the pullback retest of a 'broken ice' (failed sell iceberg above)"
                accent={COLORS.long}
              />
            </Section>

            <Section
              title="Long Exit — Scale & Trail"
              color={COLORS.long}
              icon="◧"
            >
              <Divider label="Scale-Out Rules" />
              <Checkbox
                label="T1: take 50% at +4–6 ticks (1–1.5 pts ES) — first resistance or VWAP"
                accent={COLORS.long}
              />
              <Checkbox
                label="T2: take 25% at +8–12 ticks — next iceberg cluster or volume node"
                accent={COLORS.long}
              />
              <Checkbox
                label="Runner: trail final 25% with 4-tick trailing stop below last swing low"
                accent={COLORS.long}
              />

              <Divider label="Exit Signals" />
              <Checkbox
                label="ASK-side iceberg appears above → new seller defending = exit remaining"
                accent={COLORS.warn}
              />
              <Checkbox
                label="CVD rolls over sharply while price stalls → exhaustion, flatten"
                accent={COLORS.warn}
              />
              <Checkbox
                label="Time stop: no +2 tick move within 90 sec of entry → scratch"
                accent={COLORS.warn}
              />
            </Section>
          </>
        )}

        {/* ═══════════════ SHORT TAB ═══════════════ */}
        {activeTab === "short" && (
          <>
            <Section
              title="Short Entry — Conditions"
              color={COLORS.short}
              icon="▼"
              defaultOpen={true}
            >
              <Divider label="Context" />
              <Checkbox
                label="Price at or near structural resistance (VWAP, PDH, prior balance high, round number)"
                accent={COLORS.short}
              />
              <Checkbox
                label="Session context: RTH open > 15 min, not within 5 min of major news"
                accent={COLORS.short}
              />
              <Checkbox
                label="Broader bias not aggressively bullish (no melt-up / short squeeze)"
                accent={COLORS.short}
              />

              <Divider label="Iceberg Signal" />
              <Checkbox
                label="ASK-side iceberg cluster detected: ≥ 2 icebergs within 4 ticks"
                accent={COLORS.short}
              />
              <Checkbox
                label="Iceberg absorbs ≥ 3 waves of aggressive buying — price caps"
                accent={COLORS.short}
              />
              <Checkbox
                label="Iceberg reloads at same price (hidden seller keeps refilling)"
                accent={COLORS.short}
              />

              <Divider label="Confirmation" />
              <Checkbox
                label="CVD flattens or turns negative while price stalls at iceberg level"
                accent={COLORS.short}
              />
              <Checkbox
                label="Buy-side momentum exhausts: smaller prints, wider spread on bid"
                accent={COLORS.short}
              />
              <Checkbox
                label="Heatmap: bid-side liquidity thins below iceberg (path of least resistance down)"
                accent={COLORS.short}
              />
            </Section>

            <Section
              title="Short Entry — Trigger"
              color={COLORS.short}
              icon="⚡"
              defaultOpen={true}
            >
              <Checkbox
                label="ENTRY: Sell on first downtick off iceberg level after absorption confirms"
                sublabel="Limit order 1-2 ticks below iceberg price, or market on clear momentum shift"
                accent={COLORS.short}
              />
              <Checkbox
                label="ALT ENTRY: sell the rally retest of a 'broken ice' (failed buy iceberg below)"
                accent={COLORS.short}
              />
            </Section>

            <Section
              title="Short Exit — Scale & Trail"
              color={COLORS.short}
              icon="◧"
            >
              <Divider label="Scale-Out Rules" />
              <Checkbox
                label="T1: cover 50% at −4–6 ticks (1–1.5 pts ES) — first support or VWAP"
                accent={COLORS.short}
              />
              <Checkbox
                label="T2: cover 25% at −8–12 ticks — next iceberg cluster or volume node"
                accent={COLORS.short}
              />
              <Checkbox
                label="Runner: trail final 25% with 4-tick trailing stop above last swing high"
                accent={COLORS.short}
              />

              <Divider label="Exit Signals" />
              <Checkbox
                label="BID-side iceberg appears below → new buyer defending = cover remaining"
                accent={COLORS.warn}
              />
              <Checkbox
                label="CVD surges positive while price holds → absorption, flatten"
                accent={COLORS.warn}
              />
              <Checkbox
                label="Time stop: no −2 tick move within 90 sec of entry → scratch"
                accent={COLORS.warn}
              />
            </Section>
          </>
        )}

        {/* ═══════════════ RISK TAB ═══════════════ */}
        {activeTab === "risk" && (
          <>
            <Section
              title="Stop Placement"
              color={COLORS.warn}
              icon="⛊"
              defaultOpen={true}
            >
              <Checkbox
                label="Initial stop: 2 ticks beyond the far edge of iceberg cluster"
                sublabel="If iceberg at 5200.00, stop at 5199.50 (long) — the wall must hold"
                accent={COLORS.warn}
              />
              <Checkbox
                label="Hard stop MAX: 6 ticks (1.5 pts ES / $75 per MES) — never wider"
                accent={COLORS.short}
              />
              <Checkbox
                label="If iceberg is thin (< 3 reloads), tighten to 4 ticks"
                accent={COLORS.warn}
              />
              <Checkbox
                label="After T1 hit: move stop to breakeven"
                accent={COLORS.long}
              />
              <Checkbox
                label="Context adj: widen 1-2 ticks during high-vol events (FOMC, NFP) if trading at all"
                accent={COLORS.warn}
              />
              <Checkbox
                label="'Broken Ice' stop: place stop 1 tick beyond the failed iceberg level"
                sublabel="The level already proved it couldn't hold — tight invalidation"
                accent={COLORS.warn}
              />
            </Section>

            <Section
              title="Warnings & Invalidators"
              color={COLORS.short}
              icon="⚠"
              defaultOpen={true}
            >
              <Divider label="Immediate Invalidation" />
              <Checkbox
                label="Iceberg stops reloading mid-absorption → defender pulled out, DO NOT ENTER"
                accent={COLORS.short}
              />
              <Checkbox
                label="Price slices through iceberg cluster on heavy volume → broken, flip bias"
                sublabel="This is the 'Broken Ice' setup — the failed iceberg becomes your signal"
                accent={COLORS.short}
              />
              <Checkbox
                label="Opposing iceberg appears within 4 ticks → contested zone, stand aside"
                accent={COLORS.short}
              />
              <Checkbox
                label="Large stop run triggers INTO your iceberg level → trapped flow may be deceptive"
                accent={COLORS.warn}
              />

              <Divider label="Regime Filters — No Trade" />
              <Checkbox
                label="Within ±2 min of scheduled news (FOMC, CPI, NFP, GDP)"
                accent={COLORS.warn}
              />
              <Checkbox
                label="Low-volume drift: < 50% of 20d avg volume for current 30m bar"
                accent={COLORS.warn}
              />
              <Checkbox
                label="Wide-spread chop: ES spread persistently > 1 tick"
                accent={COLORS.warn}
              />
              <Checkbox
                label="Pre-market / Globex-only session (unless confirmed with overnight context)"
                accent={COLORS.warn}
              />
              <Checkbox
                label="First 5 min of RTH open: iceberg detection unreliable during opening rotation"
                accent={COLORS.warn}
              />
              <Checkbox
                label="Extreme VIX regime (> 35): iceberg refill rates erratic, false positives spike"
                accent={COLORS.warn}
              />

              <Divider label="Trap Awareness" />
              <Checkbox
                label="Iceberg appears RIGHT at a round number with no prior structure → likely bait"
                accent={COLORS.short}
              />
              <Checkbox
                label="Single iceberg with zero cluster support → isolated noise, not institutional"
                accent={COLORS.short}
              />
              <Checkbox
                label="Iceberg contradicts all higher-TF bias → counter-trend trap probability high"
                accent={COLORS.short}
              />
            </Section>
          </>
        )}

        {/* FOOTER */}
        <div
          style={{
            marginTop: "20px",
            padding: "12px 16px",
            background: "#0d1117",
            border: "1px solid #21262d",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ fontSize: "10px", color: "#484f58" }}>
            BOOKMAP S&I TRACKER · MBO BUNDLE · RITHMIC/BOOKMAP DATA
          </div>
          <div style={{ fontSize: "10px", color: "#30363d" }}>
            TradeSlayer Pro · Strategy Reference Card
          </div>
        </div>
      </div>
    </div>
  );
}
