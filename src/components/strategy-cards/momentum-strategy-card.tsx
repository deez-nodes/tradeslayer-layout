import { useState } from "react";
import { Checkbox, Section, Pill, Divider, RefTag, STRATEGY_COLORS as C } from "./StrategyCardCommon";

export default function MomentumStrategyCard() {
  const [activeTab, setActiveTab] = useState("context");
  const tabs = [
    { id: "context", label: "CONTEXT", icon: "🗺" },
    { id: "confirm", label: "CONFIRM", icon: "✦" },
    { id: "entry", label: "ENTRY", icon: "⚡" },
    { id: "manage", label: "MANAGE", icon: "◧" },
    { id: "log", label: "LOG", icon: "📋" },
  ];

  const [logForm, setLogForm] = useState({ direction: "long", entryType: "", result: "" });

  return (
    <div style={{ background: "#010409", minHeight: "100vh", color: "#c9d1d9", fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace", padding: "0" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(180deg, #0d1117 0%, #010409 100%)", borderBottom: "1px solid #21262d", padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #3fb950 0%, #238636 50%, #0a5c1c 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 0 20px #3fb95030" }}>
            🚀
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono', monospace" }}>
              MOMENTUM STRATEGY
            </h1>
            <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>COMPOSITE PLAY · BREAKOUT CONTINUATION + AGGRESSIVE INITIATED FLOW</div>
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "12px 14px", marginBottom: "10px" }}>
          <div style={{ fontSize: "10px", color: "#484f58", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontWeight: 700 }}>COMPOSES FROM</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Pill text="Volume Bubbles → Initiated Buy/Sell Prints" color={C.orange} />
            <Pill text="Imbalance Card → Bid/Ask Skew" color={C.warn} />
            <Pill text="CVD Card → Flow Confirmation" color={C.long} />
            <Pill text="LT Pro → Offer Pull / Bid Stack" color={C.cyan} />
            <Pill text="S/R Card → Time & Acceptance" color={C.info} />
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #3fb95033", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "10px", color: "#3fb950", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px", fontWeight: 700 }}>★ PLAY SEQUENCE</div>
          <div style={{ fontSize: "12px", color: "#8b949e", lineHeight: "1.6" }}>
            Structure breaks → time & acceptance above/below → large initiated prints sweep the book → offers pull / bids stack → <span style={{ color: C.long }}>ENTRY: market order to join OR scale into existing reversal position</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid #21262d", background: "#0d1117", padding: "0 12px", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: "none", border: "none", padding: "10px 16px", cursor: "pointer", fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            color: activeTab === tab.id ? (tab.id === "entry" ? C.long : tab.id === "manage" ? C.warn : tab.id === "log" ? C.purple : tab.id === "confirm" ? C.cyan : C.info) : "#484f58",
            borderBottom: activeTab === tab.id ? `2px solid ${tab.id === "entry" ? C.long : tab.id === "manage" ? C.warn : tab.id === "log" ? C.purple : tab.id === "confirm" ? C.cyan : C.info}` : "2px solid transparent",
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
            <Section title="When to Use This Play" color={C.info} icon="🗺" defaultOpen={true}>
              <div style={{ padding: "10px 14px", margin: "0 0 8px", background: "#58a6ff10", border: "1px solid #58a6ff30", borderRadius: "6px" }}>
                <div style={{ fontSize: "11px", color: "#58a6ff", lineHeight: "1.5" }}>
                  The Momentum Strategy is a <strong>continuation</strong> play. It fires AFTER structure has already broken. You are joining a move in progress, not catching a turn.
                </div>
              </div>
              <Checkbox label="Structure has already broken to the upside/downside" sublabel="This is prerequisite — if structure hasn't broken, you're looking at Reversal, not Momentum" accent={C.info} />
              <Checkbox label="Time & acceptance: price is holding above/below the prior structure" accent={C.info} />
              <Checkbox label="This is NOT the initial breakout entry — that was the Reversal card" accent={C.warn} />
            </Section>

            <Section title="Chaining from Reversal" color={C.orange} icon="🔗" defaultOpen={true}>
              <Checkbox label="Already in a Reversal position? → T1 was taken, stop is at breakeven" accent={C.long} />
              <Checkbox label="This is the scale-back-in point after taking partial profits" sublabel="Excellent R:R because your original position is now risk-free" accent={C.long} />
              <Checkbox label="OR: missed the Reversal entirely, now see aggressive initiated flow → fresh Momentum entry" accent={C.info} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#f0883e10", border: "1px solid #f0883e25", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#f0883e" }}>↗ Initial position: </span>
                <RefTag card="REVERSAL STRATEGY CARD" color={C.orange} />
              </div>
            </Section>

            <Section title="What You're Looking For" color={C.long} icon="👁">
              <Checkbox label="Aggressive lifting of the offer (longs) / hitting the bid (shorts)" accent={C.long} />
              <Checkbox label="Large green dots (longs) or red dots (shorts) sweeping through price levels" accent={C.long} />
              <Checkbox label="The book is being swept — not a trickle, a FLOOD of initiated volume" accent={C.long} />
              <Checkbox label="Offers pulling ahead of the move (longs) / bids pulling (shorts)" accent={C.long} />
              <Checkbox label="This is the move where you pack along with the algos" accent={C.info} />
            </Section>
          </>
        )}

        {/* ══════ CONFIRM ══════ */}
        {activeTab === "confirm" && (
          <>
            <Section title="Volume Split Confirmation" color={C.cyan} icon="◧" defaultOpen={true}>
              <Divider label="Aggressor Volume — Zoomed In" />
              <Checkbox label="Reset volume column data at the bottom of the range (fresh read)" sublabel="Double-click the column to reset, then watch the delta build from zero" accent={C.cyan} />
              <Checkbox label="Buy volume overwhelms sell volume in the split view" sublabel="e.g., 665 sell vs 1679 buy — clear directional dominance" accent={C.long} />
              <Checkbox label="At multiple price levels, the buy/sell ratio is consistently skewed" accent={C.long} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#39d2c010", border: "1px solid #39d2c025", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#39d2c0" }}>↗ Volume split technique: </span>
                <RefTag card="VOLUME PROFILE CARD" color={C.neutral} />
              </div>
            </Section>

            <Section title="Time & Sales Filter" color={C.info} icon="📜" defaultOpen={true}>
              <Checkbox label="Filter T&S to 10+ lot minimum — ignore 1-2 lot noise" accent={C.info} />
              <Checkbox label="T&S showing overwhelming buy (green) vs sell (red) entries" accent={C.long} />
              <Checkbox label="Large prints (10+ lots) are stacking on the aggressive buy/sell side" accent={C.long} />
              <Checkbox label="The pace is fast — they're jumping in quickly and moving price" accent={C.long} />
            </Section>

            <Section title="Imbalance + CVD Confirmation" color={C.warn} icon="⚖" defaultOpen={true}>
              <Checkbox label="Volume imbalance indicator showing significant skew (e.g., 14%+ more buying)" accent={C.long} />
              <Checkbox label="Book imbalance: bid building / ask thinning (longs) — visible in the depth columns" accent={C.long} />
              <Checkbox label="CVD bumping up aggressively in the direction of the move" accent={C.long} />
              <Checkbox label="Sub-chart volume bars confirm: more buying than selling at each print" accent={C.long} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#d2992210", border: "1px solid #d2992225", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#d29922" }}>↗ Full imbalance workflow: </span>
                <RefTag card="IMBALANCE CARD" color={C.warn} />
                <RefTag card="CVD CARD → CONFIRM TAB" color={C.long} />
              </div>
            </Section>

            <Section title="Liquidity Behavior" color={C.purple} icon="📖">
              <Checkbox label="Offers pulling from above (longs) — getting out of the way" sublabel="Check heatmap: liquidity fading at resistance levels ahead" accent={C.purple} />
              <Checkbox label="Offers being added at higher levels (longs) — they're retreating upward" accent={C.purple} />
              <Checkbox label="Bids building at the breakout level and behind the move" accent={C.long} />
              <Checkbox label="Book flip: what was resistance (ask wall) is now becoming support (bid wall)" accent={C.long} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#bc8cff10", border: "1px solid #bc8cff25", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#bc8cff" }}>↗ Liquidity reads: </span>
                <RefTag card="LT PRO CARD" color={C.cyan} />
                <RefTag card="ABSORPTION CARD" color={C.cyan} />
              </div>
            </Section>
          </>
        )}

        {/* ══════ ENTRY ══════ */}
        {activeTab === "entry" && (
          <>
            <Section title="Entry — Market Order Join" color={C.long} icon="⚡" defaultOpen={true}>
              <div style={{ padding: "10px 14px", margin: "0 0 8px", background: "#3fb95010", border: "1px solid #3fb95030", borderRadius: "6px" }}>
                <div style={{ fontSize: "11px", color: "#3fb950", lineHeight: "1.5" }}>
                  This play often requires a <strong>market order</strong>. You will NOT get a pullback when the book is being swept. Trying to bid for a fill will miss the move entirely.
                </div>
              </div>

              <Divider label="Primary Entry" />
              <Checkbox label="Market buy/sell order when you witness large initiated volume sweeping the book" sublabel="You are packing along with the algos — join the initiated flow" accent={C.long} />
              <Checkbox label="Acceptable fill: you'll pay up 1-2 ticks vs the print level. That's the cost of momentum." accent={C.warn} />

              <Divider label="Scale-In Entry (Existing Position)" />
              <Checkbox label="If already long/short from Reversal: add to position at momentum confirmation" accent={C.long} />
              <Checkbox label="Original stop is at breakeven → this add-on has its own independent stop" accent={C.long} />
              <Checkbox label="Position sizing: same size or smaller than original reversal entry" accent={C.warn} />
            </Section>

            <Section title="Stop Placement" color={C.warn} icon="⛊" defaultOpen={true}>
              <Checkbox label="Stop below the initiated buying cluster (longs) / above initiated selling (shorts)" sublabel="If they're serious, they're not coming back" accent={C.warn} />
              <Checkbox label="Hard MAX: 6 ticks (1.5 pts ES / $75 per MES)" accent={C.short} />
              <Checkbox label="Time & acceptance stop: if price re-enters the prior range → thesis is dead" accent={C.short} />
              <Checkbox label="After T1: move stop to breakeven on this tranche" accent={C.long} />
            </Section>

            <Section title="Targets" color={C.info} icon="🎯" defaultOpen={true}>
              <Checkbox label="T1: front-run nearest high liquidity on heatmap by 1-2 ticks" accent={C.info} />
              <Checkbox label="T1 sizing: take 50% off — you're in a continuation, not a reversal" accent={C.long} />
              <Checkbox label="T2: looking for trend continuation — next structural level or end-of-day range" accent={C.info} />
              <Checkbox label="If they pull liquidity from T1: follow them, adjust target higher/lower" accent={C.warn} />
              <Checkbox label="Runner: trail final portion with 4-tick stop — ride the trend" accent={C.long} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#58a6ff10", border: "1px solid #58a6ff25", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#58a6ff" }}>↗ Target identification: </span>
                <RefTag card="LT PRO CARD" color={C.cyan} />
                <RefTag card="S/R CARD" color={C.info} />
              </div>
            </Section>
          </>
        )}

        {/* ══════ MANAGE ══════ */}
        {activeTab === "manage" && (
          <>
            <Section title="Continuation Monitoring" color={C.long} icon="◧" defaultOpen={true}>
              <Divider label="Healthy Trend Signs" />
              <Checkbox label="Initiated volume continues sweeping in your direction" accent={C.long} />
              <Checkbox label="Each pullback is shallow and immediately bought/sold" accent={C.long} />
              <Checkbox label="CVD continuing to trend with price (no divergence)" accent={C.long} />
              <Checkbox label="Bids stepping up higher (longs) — supporting price on any dip" accent={C.long} />
              <Checkbox label="Large lot tracker: institutional presence continuing at higher levels" accent={C.long} />

              <Divider label="Another Momentum Add Opportunity" />
              <Checkbox label="No pullback at all → book flip confirms direction" accent={C.info} />
              <Checkbox label="Higher bids stacking, offers continuing to pull" accent={C.info} />
              <Checkbox label="This is where missing the pullback is OK — the trend is confirmed" accent={C.info} />
            </Section>

            <Section title="Invalidation & Exit" color={C.short} icon="⚠" defaultOpen={true}>
              <Checkbox label="Initiated volume dries up: prints get smaller, pace slows" accent={C.short} />
              <Checkbox label="CVD flattens or diverges while price pushes higher → exhaustion" accent={C.short} />
              <Checkbox label="Large opposing prints appear (big red in an uptrend) → new seller" accent={C.short} />
              <Checkbox label="Book flips against you: bids pull, offers stack → exit or tighten" accent={C.short} />
              <Checkbox label="Price re-enters the prior range → breakout failed" accent={C.short} />
              <Checkbox label="Time stop: no forward progress for 2+ minutes after entry → scratch" accent={C.warn} />
            </Section>

            <Section title="Regime Filters — No Trade" color={C.warn} icon="🚫">
              <Checkbox label="Within ±2 min of scheduled news" accent={C.warn} />
              <Checkbox label="Low volume sessions: momentum signals exaggerated in thin markets" accent={C.warn} />
              <Checkbox label="Already extended: if price has moved 10+ ticks without a pullback, momentum entry is late" accent={C.warn} />
              <Checkbox label="No visible initiated volume — if the sweep isn't obvious, it's not momentum" accent={C.short} />
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
                    <div style={{ fontSize: "10px", color: "#484f58", marginBottom: "4px", textTransform: "uppercase" }}>Entry Type</div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {["fresh", "scale-in"].map(e => (
                        <button key={e} onClick={() => setLogForm(f => ({ ...f, entryType: e }))} style={{
                          padding: "4px 10px", borderRadius: "3px",
                          border: `1px solid ${C.info}${logForm.entryType === e ? "" : "40"}`,
                          background: logForm.entryType === e ? `${C.info}20` : "transparent",
                          color: logForm.entryType === e ? C.info : "#484f58",
                          fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, cursor: "pointer"
                        }}>{e.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "#484f58", marginBottom: "4px", textTransform: "uppercase" }}>Result</div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
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

                <div style={{ fontSize: "10px", color: "#484f58", marginBottom: "6px", textTransform: "uppercase" }}>Confirmations Present</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
                  {["Vol Split Skew", "T&S Flood", "CVD Trending", "Imbalance 10%+", "Offer Pull", "Book Flip", "Large Lots"].map(c => (
                    <Checkbox key={c} label={c} accent={C.cyan} />
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Pattern Review Questions" color={C.info} icon="🔍">
              <Checkbox label="Was this a scale-in from Reversal, or a fresh entry?" accent={C.info} />
              <Checkbox label="Was the initiated volume truly overwhelming, or was I forcing it?" accent={C.warn} />
              <Checkbox label="Did I use a market order, or did I try to bid and miss?" accent={C.warn} />
              <Checkbox label="Was my stop below the initiated cluster, or was it arbitrary?" accent={C.warn} />
              <Checkbox label="Did I take partial at T1?" accent={C.warn} />
              <Checkbox label="Could I have chained into a Pullback Strategy for the next leg?" accent={C.info} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#58a6ff10", border: "1px solid #58a6ff25", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#58a6ff" }}>↗ Next leg continuation: </span>
                <RefTag card="PULLBACK STRATEGY CARD" color={C.info} />
              </div>
            </Section>
          </>
        )}

        {/* FOOTER */}
        <div style={{ marginTop: "20px", padding: "12px 16px", background: "#0d1117", border: "1px solid #21262d", borderRadius: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
            <div style={{ fontSize: "10px", color: "#484f58" }}>COMPOSITE: VOL BUBBLES + IMBALANCE + CVD + LT PRO + S/R</div>
            <div style={{ fontSize: "10px", color: "#30363d" }}>TradeSlayer Pro · Composite Strategy Card</div>
          </div>
          <div style={{ fontSize: "10px", color: "#30363d", borderTop: "1px solid #21262d", paddingTop: "8px" }}>
            Chains from: REVERSAL (after T1) · Chains to: PULLBACK (continuation) · Source: Bookmap Education Part 4
          </div>
        </div>
      </div>
    </div>
  );
}
