import { useState } from "react";
import { Checkbox, Section, Pill, Divider, RefTag, STRATEGY_COLORS as C } from "./StrategyCardCommon";

export default function ReversalStrategyCard() {
  const [activeTab, setActiveTab] = useState("context");
  const tabs = [
    { id: "context", label: "CONTEXT", icon: "🗺" },
    { id: "confluence", label: "CONFLUENCE", icon: "◈" },
    { id: "entry", label: "ENTRY", icon: "⚡" },
    { id: "manage", label: "MANAGE", icon: "◧" },
    { id: "log", label: "LOG", icon: "📋" },
  ];

  const [logForm, setLogForm] = useState({ direction: "long", htfLevel: "", confluenceCount: 0, notes: "", result: "" });

  return (
    <div style={{ background: "#010409", minHeight: "100vh", color: "#c9d1d9", fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace", padding: "0" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(180deg, #0d1117 0%, #010409 100%)", borderBottom: "1px solid #21262d", padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #f0883e 0%, #da3633 50%, #8b1a10 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 0 20px #f0883e30" }}>
            🔄
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono', monospace" }}>
              REVERSAL STRATEGY
            </h1>
            <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>COMPOSITE PLAY · HTF LEVEL + EXHAUSTION + CONFLUENCE STACK</div>
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "12px 14px", marginBottom: "10px" }}>
          <div style={{ fontSize: "10px", color: "#484f58", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontWeight: 700 }}>COMPOSES FROM</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Pill text="S/R Card → HTF Level" color={C.info} />
            <Pill text="Absorption/Exhaustion → Selling Exhaustion" color={C.cyan} />
            <Pill text="CVD Card → Divergence" color={C.long} />
            <Pill text="Iceberg Card → Hidden Absorption" color={C.purple} />
            <Pill text="Large Lots → Institutional Defense" color={C.orange} />
            <Pill text="Volume Profile → Drying Volume" color={C.neutral} />
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #f0883e33", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "10px", color: "#f0883e", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px", fontWeight: 700 }}>★ PLAY SEQUENCE</div>
          <div style={{ fontSize: "12px", color: "#8b949e", lineHeight: "1.6" }}>
            HTF level tap → exhaustion detected → CVD divergence precedes → iceberg absorbs at level → large lots defend → micro structure breaks → <span style={{ color: C.long }}>ENTRY on pullback to break point</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid #21262d", background: "#0d1117", padding: "0 12px", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: "none", border: "none", padding: "10px 16px", cursor: "pointer", fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            color: activeTab === tab.id ? (tab.id === "entry" ? C.long : tab.id === "manage" ? C.warn : tab.id === "log" ? C.purple : C.info) : "#484f58",
            borderBottom: activeTab === tab.id ? `2px solid ${tab.id === "entry" ? C.long : tab.id === "manage" ? C.warn : tab.id === "log" ? C.purple : C.info}` : "2px solid transparent",
            letterSpacing: "0.5px", whiteSpace: "nowrap", transition: "all 0.15s",
          }}>
            <span style={{ marginRight: "6px" }}>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 14px", maxWidth: "720px", margin: "0 auto" }}>

        {/* ══════ CONTEXT ══════ */}
        {activeTab === "context" && (
          <>
            <Section title="1. Higher Time Frame Level" color={C.info} icon="🗺" defaultOpen={true}>
              <Divider label="Required — The Anchor" />
              <Checkbox label="Identify HTF level: prior-day high/low, multi-day swing, weekly level" sublabel="This is non-negotiable. No HTF level = no reversal setup." accent={C.info} />
              <Checkbox label="Price has tapped or is within 2 ticks of the HTF level" accent={C.info} />
              <Checkbox label="Level has history: prior bounces, volume clusters, or heatmap memory at this price" accent={C.info} />
              <Checkbox label="Check: did we trap the other side first? (broke structure before reaching HTF)" sublabel="A structure break that knocks out weak hands before the level tap = higher probability reversal" accent={C.orange} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#f0883e10", border: "1px solid #f0883e25", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#f0883e" }}>↗ Full level identification workflow: </span>
                <RefTag card="S/R CARD" color={C.info} />
                <RefTag card="LT PRO CARD" color={C.cyan} />
              </div>
            </Section>

            <Section title="2. Structure & Trend Context" color={C.orange} icon="📐" defaultOpen={true}>
              <Divider label="Current Micro Structure" />
              <Checkbox label="Identify the current micro trend line — is price still within bearish/bullish structure?" accent={C.orange} />
              <Checkbox label="Note the last swing high/low that defines the micro structure" accent={C.orange} />
              <Checkbox label="Structure has NOT broken yet (that's the setup trigger, not the context)" sublabel="You want to see: still in downtrend structure at a HTF support, or still in uptrend at HTF resistance" accent={C.warn} />
              <Checkbox label="Higher time frame context: is this a range day (trapped both sides) or a trend day?" sublabel="Range days with double-trap are highest conviction for reversals" accent={C.info} />
            </Section>

            <Section title="3. Volume & Liquidity Context" color={C.neutral} icon="📊">
              <Divider label="Volume Profile Read" />
              <Checkbox label="Volume profile tapering / drying up at the extreme = finished auction edge" accent={C.neutral} />
              <Checkbox label="Low volume at current price compared to prior range = selling/buying exhaustion" accent={C.neutral} />
              <Checkbox label="Volume dots at extreme: small dots at the very tip = exhaustion confirmed" sublabel="You want to see very little trading at the extreme. Big dots at extreme = continuation likely." accent={C.neutral} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#8b949e10", border: "1px solid #8b949e25", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#8b949e" }}>↗ Full volume analysis: </span>
                <RefTag card="VOLUME PROFILE CARD" color={C.neutral} />
                <RefTag card="VOLUME BUBBLES CARD" color={C.neutral} />
              </div>

              <Divider label="Heatmap Liquidity" />
              <Checkbox label="Note liquidity distribution: is there high liquidity on the aggressive side (pressing price)?" accent={C.warn} />
              <Checkbox label="Check for liquidity on the opposite side of the reversal = your targets" accent={C.info} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#58a6ff10", border: "1px solid #58a6ff25", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#58a6ff" }}>↗ Heatmap reading: </span>
                <RefTag card="LT PRO CARD" color={C.cyan} />
                <RefTag card="LIQUIDITY REGIME CARD" color={C.info} />
              </div>
            </Section>
          </>
        )}

        {/* ══════ CONFLUENCE ══════ */}
        {activeTab === "confluence" && (
          <>
            <div style={{ padding: "10px 14px", margin: "0 0 12px", background: "#f0883e10", border: "1px solid #f0883e30", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#f0883e", lineHeight: "1.5" }}>
                These confluences <strong>precede</strong> the setup trigger. They build conviction BEFORE micro structure breaks. Each is implemented on its own atomic card — use this tab to track which fired.
              </div>
            </div>

            <Section title="CVD Divergence" color={C.long} icon="📈" defaultOpen={true}>
              <Checkbox label="Price making lower lows but CVD making higher lows = bullish divergence" sublabel="More buying than selling in the aggregate despite lower prices — sellers exhausting" accent={C.long} />
              <Checkbox label="OR: price making higher highs but CVD making lower highs = bearish divergence" accent={C.short} />
              <Checkbox label="CVD divergence confirms: selling pressure is beginning to exhaust" accent={C.long} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#3fb95010", border: "1px solid #3fb95025", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#3fb950" }}>↗ Full CVD divergence workflow: </span>
                <RefTag card="CVD CARD → DIVERGE TAB" color={C.long} />
              </div>
            </Section>

            <Section title="Iceberg Absorption" color={C.purple} icon="🧊" defaultOpen={true}>
              <Checkbox label="Significant iceberg detected at/near the HTF level" sublabel="More contracts traded than visible in the book = hidden orders absorbing aggression" accent={C.purple} />
              <Checkbox label="Iceberg is on the DEFENSIVE side (bid-side iceberg at support, ask-side at resistance)" accent={C.purple} />
              <Checkbox label="Iceberg refilling: hidden order reloads after being hit = persistent institutional defense" accent={C.purple} />
              <Checkbox label="Aggressive selling hitting the level, but iceberg absorbing it → price holds" accent={C.purple} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#bc8cff10", border: "1px solid #bc8cff25", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#bc8cff" }}>↗ Full iceberg detection: </span>
                <RefTag card="ICEBERG CARD → READ TAB" color={C.purple} />
              </div>
            </Section>

            <Section title="Large Lot Defense" color={C.orange} icon="🎯" defaultOpen={true}>
              <Checkbox label="Large lot tracker shows individual actor holding significant % of book liquidity at the level" sublabel="15-20%+ of total depth at a single price = institutional commitment" accent={C.orange} />
              <Checkbox label="Multiple large lots appearing at the level or slightly behind it" accent={C.orange} />
              <Checkbox label="Large lots holding (not pulling) = genuine intent to defend" accent={C.orange} />
              <Checkbox label="⚠ Watch for spoof: if large lot pulls → vacuum created → could accelerate against you" accent={C.warn} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#f0883e10", border: "1px solid #f0883e25", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#f0883e" }}>↗ Full large lot analysis: </span>
                <RefTag card="LARGE LOTS CARD → READ TAB" color={C.orange} />
                <RefTag card="ABSORPTION CARD → SPOOF TAB" color={C.warn} />
              </div>
            </Section>

            <Section title="Confluence Scorecard" color={C.cyan} icon="✦">
              <div style={{ padding: "10px 14px", background: "#0d1117", borderRadius: "6px", border: "1px solid #21262d" }}>
                <div style={{ fontSize: "10px", color: "#484f58", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Minimum: HTF Level + 2 confluences. Ideal: 4+</div>
                {[
                  { name: "HTF Level Tap", required: true },
                  { name: "Volume Exhaustion (Profile + Dots)", required: false },
                  { name: "CVD Divergence", required: false },
                  { name: "Iceberg Absorption", required: false },
                  { name: "Large Lot Defense", required: false },
                  { name: "Imbalance Skew (bid > ask or vice versa)", required: false },
                ].map((item, i) => (
                  <Checkbox key={i} label={`${item.name}${item.required ? " [REQUIRED]" : ""}`} accent={item.required ? C.short : C.cyan} />
                ))}
              </div>
            </Section>
          </>
        )}

        {/* ══════ ENTRY ══════ */}
        {activeTab === "entry" && (
          <>
            <Section title="Setup Trigger — Micro Structure Break" color={C.long} icon="⚡" defaultOpen={true}>
              <Divider label="The Confirmation You Wait For" />
              <Checkbox label="Micro structure breaks in reversal direction" sublabel="This is the trigger — NOT the confluences above. Confluences build conviction, this confirms." accent={C.long} />
              <Checkbox label="Initiated buying/selling volume breaks above/below the micro structure" accent={C.long} />
              <Checkbox label="Bid starts building higher (longs) / offer starts pulling (longs)" accent={C.long} />
              <Checkbox label="OR: offer starts building lower (shorts) / bid starts pulling (shorts)" accent={C.short} />
            </Section>

            <Section title="Entry Execution" color={C.long} icon="▲" defaultOpen={true}>
              <Divider label="Primary Entry — Pullback to Break Point" />
              <Checkbox label="After micro structure breaks, wait for pullback to the break zone" sublabel="This is the lowest-risk entry: broken support becomes resistance (or vice versa)" accent={C.long} />
              <Checkbox label="Set limit order at the zone where initiated buying/selling occurred" accent={C.long} />
              <Checkbox label="If move is very aggressive: pullback may only reach a flurry of activity at a higher area" sublabel="Consider layering orders across the zone rather than a single price" accent={C.warn} />
              <Checkbox label="If no pullback at all: market order to join the initiated flow (accept wider stop)" accent={C.warn} />

              <Divider label="Stop Placement" />
              <Checkbox label="Stop below the initiated buying cluster (longs) / above initiated selling (shorts)" sublabel="If the initiators are serious, price won't come back through their zone" accent={C.warn} />
              <Checkbox label="Very tight risk: the distance from pullback entry to below the initiation zone" accent={C.long} />
              <Checkbox label="Hard MAX: 6 ticks (1.5 pts ES / $75 per MES)" accent={C.short} />
            </Section>

            <Section title="Targets" color={C.info} icon="🎯" defaultOpen={true}>
              <Checkbox label="T1: front-run the nearest high liquidity on the heatmap by 1-2 ticks" sublabel="Don't try to get the exact tick — front-run and take partial" accent={C.info} />
              <Checkbox label="T1 sizing: take 50% off at this target to reduce risk" accent={C.long} />
              <Checkbox label="T2: opposite side of the prior range (if range day) or next structural level" accent={C.info} />
              <Checkbox label="Runner: trail with 4-tick stop if momentum continues" accent={C.info} />
              <Checkbox label="Watch for: them pulling liquidity from your target level = follow them, adjust target" accent={C.warn} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#58a6ff10", border: "1px solid #58a6ff25", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#58a6ff" }}>↗ Liquidity targeting: </span>
                <RefTag card="LT PRO CARD" color={C.cyan} />
              </div>
            </Section>
          </>
        )}

        {/* ══════ MANAGE ══════ */}
        {activeTab === "manage" && (
          <>
            <Section title="After Entry — Position Management" color={C.warn} icon="◧" defaultOpen={true}>
              <Divider label="Immediate Post-Entry" />
              <Checkbox label="Confirm: initiated volume continues in your direction after entry" accent={C.long} />
              <Checkbox label="Large lots still holding at the defense level (or new ones appearing higher/lower)" accent={C.long} />
              <Checkbox label="Offers pulling from above (longs) / bids pulling from below (shorts)" accent={C.long} />
              <Checkbox label="Time check: if no +2 tick move within 90 sec → consider scratching" accent={C.warn} />

              <Divider label="Scale & Trail" />
              <Checkbox label="T1 hit → move stop to breakeven" accent={C.long} />
              <Checkbox label="T1 hit → this is now a momentum strategy continuation candidate" accent={C.info} />
              <Checkbox label="After T1: monitor for momentum strategy add-on opportunity" accent={C.info} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#58a6ff10", border: "1px solid #58a6ff25", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#58a6ff" }}>↗ After T1, consider scaling with: </span>
                <RefTag card="MOMENTUM STRATEGY CARD" color={C.long} />
              </div>
            </Section>

            <Section title="Invalidation & Exit" color={C.short} icon="⚠" defaultOpen={true}>
              <Checkbox label="Micro structure re-breaks against you → exit immediately" accent={C.short} />
              <Checkbox label="CVD divergence resolves (catches back up with price direction) → thesis gone" accent={C.short} />
              <Checkbox label="Iceberg at your defense level stops refilling → defender pulled out" accent={C.short} />
              <Checkbox label="Large lots pull from the level → vacuum → get out" accent={C.short} />
              <Checkbox label="New aggressive large lots appear against your position → institutional counter" accent={C.short} />
              <Checkbox label="Volume spikes through your level on heavy trade → full invalidation, stop and reverse possible" accent={C.short} />
            </Section>

            <Section title="Regime Filters — No Trade" color={C.warn} icon="🚫">
              <Checkbox label="Within ±2 min of scheduled news (FOMC, CPI, NFP)" accent={C.warn} />
              <Checkbox label="First 5 min RTH: opening rotation, all signals unreliable" accent={C.warn} />
              <Checkbox label="Low volume (< 50% avg): exhaustion signals exaggerated, icebergs sparse" accent={C.warn} />
              <Checkbox label="VIX > 35: divergences resolve less reliably, stops get run" accent={C.warn} />
              <Checkbox label="No HTF level identified = no reversal trade. Period." accent={C.short} />
            </Section>
          </>
        )}

        {/* ══════ LOG ══════ */}
        {activeTab === "log" && (
          <>
            <Section title="Trade Log Entry" color={C.purple} icon="📋" defaultOpen={true}>
              <div style={{ padding: "12px", background: "#161b22", borderRadius: "6px", border: "1px solid #21262d" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "#484f58", marginBottom: "4px", textTransform: "uppercase" }}>Direction</div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {["long", "short"].map(d => (
                        <button key={d} onClick={() => setLogForm(f => ({ ...f, direction: d }))} style={{
                          padding: "6px 14px", borderRadius: "4px", border: `1px solid ${d === "long" ? C.long : C.short}${logForm.direction === d ? "" : "40"}`,
                          background: logForm.direction === d ? `${d === "long" ? C.long : C.short}20` : "transparent",
                          color: logForm.direction === d ? (d === "long" ? C.long : C.short) : "#484f58",
                          fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, cursor: "pointer"
                        }}>{d.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "#484f58", marginBottom: "4px", textTransform: "uppercase" }}>Result</div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {["T1", "T2", "runner", "scratch", "stop"].map(r => (
                        <button key={r} onClick={() => setLogForm(f => ({ ...f, result: r }))} style={{
                          padding: "4px 8px", borderRadius: "3px",
                          border: `1px solid ${r === "stop" ? C.short : r === "scratch" ? C.warn : C.long}${logForm.result === r ? "" : "40"}`,
                          background: logForm.result === r ? `${r === "stop" ? C.short : r === "scratch" ? C.warn : C.long}20` : "transparent",
                          color: logForm.result === r ? (r === "stop" ? C.short : r === "scratch" ? C.warn : C.long) : "#484f58",
                          fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, cursor: "pointer"
                        }}>{r.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: "10px", color: "#484f58", marginBottom: "6px", textTransform: "uppercase" }}>Confluences Present (check all that fired)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
                  {["HTF Level", "Vol Exhaustion", "CVD Diverge", "Iceberg", "Large Lot", "Imbalance", "Structure Break"].map(c => (
                    <Checkbox key={c} label={c} accent={C.cyan} />
                  ))}
                </div>

                <div style={{ fontSize: "10px", color: "#484f58", marginBottom: "6px", textTransform: "uppercase" }}>What worked / what to improve</div>
                <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: "4px", padding: "8px 10px", fontSize: "12px", color: "#8b949e", minHeight: "40px" }}>
                  (capture your notes in TradeSlayer journal)
                </div>
              </div>
            </Section>

            <Section title="Pattern Review Questions" color={C.info} icon="🔍">
              <Checkbox label="Did the reversal occur at a HTF level, or did I force a random level?" accent={C.info} />
              <Checkbox label="How many confluences fired before the structure break?" accent={C.info} />
              <Checkbox label="Did I wait for the structure break, or did I front-run it?" accent={C.warn} />
              <Checkbox label="Was my entry on the pullback, or did I chase?" accent={C.warn} />
              <Checkbox label="Did I take partial at T1, or did I get greedy?" accent={C.warn} />
              <Checkbox label="After T1, did I transition to the Momentum Strategy card for continuation?" accent={C.info} />
              <Checkbox label="Did any invalidation signal fire that I ignored?" accent={C.short} />
            </Section>
          </>
        )}

        {/* FOOTER */}
        <div style={{ marginTop: "20px", padding: "12px 16px", background: "#0d1117", border: "1px solid #21262d", borderRadius: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
            <div style={{ fontSize: "10px", color: "#484f58" }}>COMPOSITE: S/R + ABSORPTION + CVD + ICEBERG + LARGE LOTS + VOL PROFILE</div>
            <div style={{ fontSize: "10px", color: "#30363d" }}>TradeSlayer Pro · Composite Strategy Card</div>
          </div>
          <div style={{ fontSize: "10px", color: "#30363d", borderTop: "1px solid #21262d", paddingTop: "8px" }}>
            Chains to: MOMENTUM STRATEGY (after T1) · Source: Bookmap Education Part 4
          </div>
        </div>
      </div>
    </div>
  );
}
