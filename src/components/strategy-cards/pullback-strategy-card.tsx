import { useState } from "react";
import { Checkbox, Section, Pill, Divider, RefTag, STRATEGY_COLORS as C } from "./StrategyCardCommon";

export default function PullbackStrategyCard() {
  const [activeTab, setActiveTab] = useState("context");
  const tabs = [
    { id: "context", label: "CONTEXT", icon: "🗺" },
    { id: "confluence", label: "CONFLUENCE", icon: "◈" },
    { id: "entry", label: "ENTRY", icon: "⚡" },
    { id: "manage", label: "MANAGE", icon: "◧" },
    { id: "log", label: "LOG", icon: "📋" },
  ];

  const [logForm, setLogForm] = useState({ direction: "short", stopType: "", result: "" });

  return (
    <div style={{ background: "#010409", minHeight: "100vh", color: "#c9d1d9", fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace", padding: "0" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(180deg, #0d1117 0%, #010409 100%)", borderBottom: "1px solid #21262d", padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #58a6ff 0%, #1f6feb 50%, #0d419d 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 0 20px #58a6ff30" }}>
            ↩
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.3px", fontFamily: "'JetBrains Mono', monospace" }}>
              PULLBACK STRATEGY
            </h1>
            <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>COMPOSITE PLAY · TREND CONTINUATION + LOW VOLUME NODE ENTRY</div>
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "8px", padding: "12px 14px", marginBottom: "10px" }}>
          <div style={{ fontSize: "10px", color: "#484f58", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", fontWeight: 700 }}>COMPOSES FROM</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Pill text="Volume Profile → Low Volume Node Target" color={C.neutral} />
            <Pill text="Volume Bubbles → Correct Delta Cluster" color={C.orange} />
            <Pill text="CVD Card → Pullback Exhaustion" color={C.long} />
            <Pill text="Iceberg Card → Hidden Flow Context" color={C.purple} />
            <Pill text="Imbalance Card → Directional Skew" color={C.warn} />
            <Pill text="Correlation Tracker → Cross-Market Confirm" color={C.cyan} />
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #58a6ff33", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ fontSize: "10px", color: "#58a6ff", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px", fontWeight: 700 }}>★ PLAY SEQUENCE</div>
          <div style={{ fontSize: "12px", color: "#8b949e", lineHeight: "1.6" }}>
            Trend established → structure breaks to new level → big volume cluster with correct delta → price pulls back on low volume → <span style={{ color: C.short }}>ENTRY: limit order at low volume node</span> → continuation to new lows/highs
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid #21262d", background: "#0d1117", padding: "0 12px", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: "none", border: "none", padding: "10px 16px", cursor: "pointer", fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            color: activeTab === tab.id ? (tab.id === "entry" ? C.long : tab.id === "manage" ? C.warn : tab.id === "log" ? C.purple : tab.id === "confluence" ? C.cyan : C.info) : "#484f58",
            borderBottom: activeTab === tab.id ? `2px solid ${tab.id === "entry" ? C.long : tab.id === "manage" ? C.warn : tab.id === "log" ? C.purple : tab.id === "confluence" ? C.cyan : C.info}` : "2px solid transparent",
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
            <Section title="Trending Environment Required" color={C.info} icon="🗺" defaultOpen={true}>
              <div style={{ padding: "10px 14px", margin: "0 0 8px", background: "#58a6ff10", border: "1px solid #58a6ff30", borderRadius: "6px" }}>
                <div style={{ fontSize: "11px", color: "#58a6ff", lineHeight: "1.5" }}>
                  The Pullback Strategy is a <strong>trend continuation</strong> play. It requires an established trend with structure already broken. This is NOT a reversal — you're joining the dominant direction on a temporary retracement.
                </div>
              </div>
              <Checkbox label="Structure has already broken in the trend direction" accent={C.info} />
              <Checkbox label="Price has swept to a new level (new low in downtrend / new high in uptrend)" accent={C.info} />
              <Checkbox label="The break was decisive: aggressors traded through the prior level, absorbing limits" accent={C.info} />
              <Checkbox label="This play is fractal — it repeats at every scale. Look for it again and again." accent={C.orange} />
            </Section>

            <Section title="The Volume Cluster — Your Anchor" color={C.orange} icon="🎯" defaultOpen={true}>
              <Checkbox label="Big new volume cluster formed at the new level after the break" accent={C.orange} />
              <Checkbox label="Cluster has correct delta: downtrend = mostly red dots, uptrend = mostly green dots" sublabel="This confirms the aggressive side is aligned with the trend direction" accent={C.orange} />
              <Checkbox label="Cluster is dense — lots of trading activity, not a thin sweep" accent={C.orange} />
              <Checkbox label="This cluster is where the trend established its new base" accent={C.info} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#f0883e10", border: "1px solid #f0883e25", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#f0883e" }}>↗ Volume cluster analysis: </span>
                <RefTag card="VOLUME BUBBLES CARD" color={C.orange} />
                <RefTag card="VOLUME PROFILE CARD" color={C.neutral} />
              </div>
            </Section>

            <Section title="The Pullback — What You're Waiting For" color={C.warn} icon="↩" defaultOpen={true}>
              <Checkbox label="Price pulls back toward the break point on LOW volume" sublabel="Key: the pullback itself should be low energy — exhaustion into the node" accent={C.warn} />
              <Checkbox label="Pullback terminates at or near the low volume node between the cluster and prior range" accent={C.warn} />
              <Checkbox label="Low volume node = the thin area on the profile where price moved quickly through" accent={C.info} />
              <Checkbox label="Exhaustion visible: small dots, drying volume, no aggressive continuation against trend" accent={C.warn} />
              <Checkbox label="The pullback is the market re-testing the break — if it holds, trend continues" accent={C.info} />
            </Section>
          </>
        )}

        {/* ══════ CONFLUENCE ══════ */}
        {activeTab === "confluence" && (
          <>
            <Section title="CVD Exhaustion on Pullback" color={C.long} icon="📈" defaultOpen={true}>
              <Checkbox label="CVD divergence during the pullback: price retraces but CVD shows exhaustion" sublabel="Typical: heavy divergence on pullback. Even slight divergence counts here." accent={C.long} />
              <Checkbox label="Ideal: CVD way below the pullback price action (downtrend) = buyers on pullback are weak" accent={C.long} />
              <Checkbox label="Even slight CVD divergence is meaningful — confirms pullback is running out of steam" accent={C.info} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#3fb95010", border: "1px solid #3fb95025", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#3fb950" }}>↗ CVD exhaustion reads: </span>
                <RefTag card="CVD CARD → DIVERGE TAB" color={C.long} />
              </div>
            </Section>

            <Section title="Iceberg Context" color={C.purple} icon="🧊" defaultOpen={true}>
              <Checkbox label="Read the context of ALL icebergs in the area, not just one large event" sublabel="Unlike Reversal where one big iceberg matters, Pullback reads the aggregate pattern" accent={C.purple} />
              <Checkbox label="Downtrend: more iceberg activity on the offer side vs bid side = hidden sellers positioned" sublabel="e.g., offer icebergs: 59, 56, 164 vs bid icebergs: 25, 2, 15, 22 — clear seller dominance" accent={C.short} />
              <Checkbox label="Uptrend: more iceberg activity on the bid side = hidden buyers positioned" accent={C.long} />
              <Checkbox label="⚠ Iceberg at higher level during pullback may be someone flipping out of a counter-trade" accent={C.warn} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#bc8cff10", border: "1px solid #bc8cff25", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#bc8cff" }}>↗ Iceberg aggregate reading: </span>
                <RefTag card="ICEBERG CARD → READ TAB" color={C.purple} />
              </div>
            </Section>

            <Section title="Imbalance & Large Lots" color={C.warn} icon="⚖">
              <Checkbox label="Volume imbalance: slight negative (downtrend) or positive (uptrend) = trend-aligned skew" accent={C.warn} />
              <Checkbox label="Book imbalance may show opposite (bids building on pullback) — that's normal, it's the pullback" accent={C.info} />
              <Checkbox label="Large lot tracker: sparse during pullback is OK — they already positioned at the cluster" accent={C.neutral} />
              <Checkbox label="If large lots DO appear at the pullback level on the trend side = extra conviction" accent={C.long} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#d2992210", border: "1px solid #d2992225", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#d29922" }}>↗ Imbalance reads: </span>
                <RefTag card="IMBALANCE CARD" color={C.warn} />
                <RefTag card="LARGE LOTS CARD" color={C.orange} />
              </div>
            </Section>

            <Section title="Correlation Tracker — Cross-Market Confirmation" color={C.cyan} icon="🔗" defaultOpen={true}>
              <div style={{ padding: "10px 14px", margin: "0 0 8px", background: "#39d2c010", border: "1px solid #39d2c030", borderRadius: "6px" }}>
                <div style={{ fontSize: "11px", color: "#39d2c0", lineHeight: "1.5" }}>
                  New confluence not covered by atomic cards. The correlation tracker overlays a correlated market (e.g., NQ on ES) to confirm the trend and pullback quality.
                </div>
              </div>

              <Divider label="ES ↔ NQ Correlation" />
              <Checkbox label="NQ typically shows the same move with more amplitude (more volatile, less liquidity)" accent={C.cyan} />
              <Checkbox label="NQ breaks down more significantly than ES = correlated confirmation" accent={C.cyan} />
              <Checkbox label="NQ already breaking down again from its pullback BEFORE ES = leading signal" sublabel="This is a powerful early confirmation — NQ leads, ES follows" accent={C.long} />
              <Checkbox label="NQ pullback is an ABCD pattern back to the break point = textbook retest" accent={C.cyan} />

              <Divider label="Other Correlations" />
              <Checkbox label="ES vs bonds: opposite correlation — bonds rallying while ES selling = flight to safety confirms" accent={C.info} />
              <Checkbox label="ES vs DXY (dollar index): strong dollar often pressures equities" accent={C.info} />
              <Checkbox label="Sector leaders (via DX feed): if the leading sector is already rolling over, ES follows" accent={C.info} />
              <Checkbox label="Gold vs AUD, Oil vs CAD — intermarket correlations shift, verify they're active" accent={C.warn} />

              <Divider label="Hedging / Pairs Play" />
              <Checkbox label="Don't have to be directional: can hedge ES long with NQ short (or vice versa)" accent={C.purple} />
              <Checkbox label="If NQ shows stronger setup: take the trade there instead (or in addition)" accent={C.purple} />
              <Checkbox label="Spread trades: buy one, sell the other — betting on the correlation normalizing" accent={C.purple} />
            </Section>
          </>
        )}

        {/* ══════ ENTRY ══════ */}
        {activeTab === "entry" && (
          <>
            <Section title="Entry — Limit Order at Low Volume Node" color={C.long} icon="⚡" defaultOpen={true}>
              <div style={{ padding: "10px 14px", margin: "0 0 8px", background: "#3fb95010", border: "1px solid #3fb95030", borderRadius: "6px" }}>
                <div style={{ fontSize: "11px", color: "#3fb950", lineHeight: "1.5" }}>
                  Unlike Momentum (market order), Pullback uses a <strong>limit order</strong> placed in advance. Set it immediately after you see the break and volume cluster form. The pullback comes to you.
                </div>
              </div>

              <Divider label="Limit Order Placement" />
              <Checkbox label="Set limit order immediately after you see the break and volume cluster" accent={C.long} />
              <Checkbox label="Place at the low volume node — where price moved quickly through on the break" accent={C.long} />
              <Checkbox label="Be aggressive: place 1 tick INTO the low volume node (closer to the cluster side)" sublabel="Pullbacks often don't fully retrace — if you're 1 tick too far, you miss it" accent={C.warn} />
              <Checkbox label="Consider layering: 2-3 orders across the LVN zone if it's wider than 2 ticks" accent={C.info} />
              <Checkbox label="Not many orders trade during the pullback (it's low volume) — fills can be tight" accent={C.warn} />

              <Divider label="Alternative: Scale Back In" />
              <Checkbox label="If already in a Momentum position: this is the add-back opportunity" accent={C.long} />
              <Checkbox label="Reversal → T1 → Momentum add → this Pullback = full position chain" accent={C.info} />
            </Section>

            <Section title="Stop Placement — Two Options" color={C.warn} icon="⛊" defaultOpen={true}>
              <Divider label="Aggressive Stop" />
              <Checkbox label="Just above the low volume node (longs below the LVN)" sublabel="Tighter: if price re-enters the range, the pullback failed" accent={C.warn} />
              <Checkbox label="This gives you the best R:R but less room for noise" accent={C.warn} />

              <Divider label="Conservative Stop" />
              <Checkbox label="Above the prior range / above the point of control of the prior balance" sublabel="More room — the pullback can overshoot the LVN without stopping you out" accent={C.info} />
              <Checkbox label="Use this if the LVN is very thin (1-2 ticks) and you need breathing room" accent={C.info} />

              <Divider label="Hard Limits" />
              <Checkbox label="Hard MAX: 6 ticks (1.5 pts ES / $75 per MES)" accent={C.short} />
              <Checkbox label="After T1: move stop to breakeven" accent={C.long} />
            </Section>

            <Section title="Targets" color={C.info} icon="🎯" defaultOpen={true}>
              <Checkbox label="T1: front-run the nearest high liquidity below (downtrend) / above (uptrend) by 1-2 ticks" accent={C.info} />
              <Checkbox label="T1 sizing: take partial — this is trend continuation, expect more" accent={C.long} />
              <Checkbox label="T2: next structural level, prior day low/high, or next volume cluster" accent={C.info} />
              <Checkbox label="Watch for: them pulling liquidity from your target = adjust, follow them" accent={C.warn} />
              <Checkbox label="This play is repeatable: after T1, look for ANOTHER pullback to the next LVN" accent={C.orange} />
              <div style={{ padding: "8px 12px", margin: "6px 0", background: "#f0883e10", border: "1px solid #f0883e25", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", color: "#f0883e" }}>↗ The pullback is fractal — chain them: </span>
                <RefTag card="PULLBACK STRATEGY (this card, again)" color={C.info} />
              </div>
            </Section>
          </>
        )}

        {/* ══════ MANAGE ══════ */}
        {activeTab === "manage" && (
          <>
            <Section title="Post-Entry — Trend Continuation" color={C.long} icon="◧" defaultOpen={true}>
              <Divider label="Immediate Confirmation" />
              <Checkbox label="Price rotates back in the trend direction immediately after filling your limit" accent={C.long} />
              <Checkbox label="Volume picks up in the trend direction as price leaves the LVN" accent={C.long} />
              <Checkbox label="CVD resumes trending (no more pullback divergence)" accent={C.long} />
              <Checkbox label="The pullback was the retest — trend resumes" accent={C.long} />

              <Divider label="Repeating the Pattern" />
              <Checkbox label="After T1: look for the NEXT break → cluster → pullback sequence" accent={C.info} />
              <Checkbox label="Trend days produce 3-5 pullback opportunities — this is your business, repeat it" accent={C.info} />
              <Checkbox label="Each repetition validates your read — confidence compounds" accent={C.long} />
            </Section>

            <Section title="Invalidation & Exit" color={C.short} icon="⚠" defaultOpen={true}>
              <Checkbox label="Pullback exceeds the LVN and re-enters the prior range = failed retest" accent={C.short} />
              <Checkbox label="Volume picks up AGAINST the trend during the pullback = not exhaustion, it's a reversal" accent={C.short} />
              <Checkbox label="CVD flips direction and holds (pullback divergence resolves in counter-trend direction)" accent={C.short} />
              <Checkbox label="Counter-trend icebergs or large lots appear at the pullback level = defense forming the wrong way" accent={C.short} />
              <Checkbox label="Correlated market (NQ) breaks above its pullback level = correlation confirming failure" accent={C.short} />
              <Checkbox label="Time stop: price sits in the LVN for 3+ minutes with no resolution → scratch, reassess" accent={C.warn} />
            </Section>

            <Section title="Regime Filters — No Trade" color={C.warn} icon="🚫">
              <Checkbox label="Within ±2 min of scheduled news" accent={C.warn} />
              <Checkbox label="No clear trend established — range/chop environment ≠ pullback environment" accent={C.short} />
              <Checkbox label="Volume cluster has wrong delta (green cluster in downtrend) = mixed signal, stand aside" accent={C.short} />
              <Checkbox label="LVN is too wide (> 6 ticks) — stop distance becomes unacceptable" accent={C.warn} />
              <Checkbox label="Pullback is on HEAVY volume = this isn't a pullback, it's a reversal forming" accent={C.short} />
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
                    <div style={{ fontSize: "10px", color: "#484f58", marginBottom: "4px", textTransform: "uppercase" }}>Trend Direction</div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {["short (sell PB)", "long (buy PB)"].map(d => (
                        <button key={d} onClick={() => setLogForm(f => ({ ...f, direction: d }))} style={{
                          padding: "6px 12px", borderRadius: "4px",
                          border: `1px solid ${d.startsWith("short") ? C.short : C.long}${logForm.direction === d ? "" : "40"}`,
                          background: logForm.direction === d ? `${d.startsWith("short") ? C.short : C.long}20` : "transparent",
                          color: logForm.direction === d ? (d.startsWith("short") ? C.short : C.long) : "#484f58",
                          fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, cursor: "pointer"
                        }}>{d.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "#484f58", marginBottom: "4px", textTransform: "uppercase" }}>Stop Type</div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {["aggressive", "conservative"].map(s => (
                        <button key={s} onClick={() => setLogForm(f => ({ ...f, stopType: s }))} style={{
                          padding: "4px 10px", borderRadius: "3px",
                          border: `1px solid ${s === "aggressive" ? C.short : C.info}${logForm.stopType === s ? "" : "40"}`,
                          background: logForm.stopType === s ? `${s === "aggressive" ? C.short : C.info}20` : "transparent",
                          color: logForm.stopType === s ? (s === "aggressive" ? C.short : C.info) : "#484f58",
                          fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, cursor: "pointer"
                        }}>{s.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "10px", color: "#484f58", marginBottom: "4px", textTransform: "uppercase" }}>Result</div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {["T1", "T2", "chained PB", "scratch", "stop", "no fill"].map(r => (
                      <button key={r} onClick={() => setLogForm(f => ({ ...f, result: r }))} style={{
                        padding: "4px 8px", borderRadius: "3px",
                        border: `1px solid ${r === "stop" ? C.short : r === "scratch" || r === "no fill" ? C.warn : C.long}${logForm.result === r ? "" : "40"}`,
                        background: logForm.result === r ? `${r === "stop" ? C.short : r === "scratch" || r === "no fill" ? C.warn : C.long}20` : "transparent",
                        color: logForm.result === r ? (r === "stop" ? C.short : r === "scratch" || r === "no fill" ? C.warn : C.long) : "#484f58",
                        fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, cursor: "pointer"
                      }}>{r.toUpperCase()}</button>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: "10px", color: "#484f58", marginBottom: "6px", textTransform: "uppercase" }}>Confluences Present</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
                  {["Vol Cluster OK", "Correct Delta", "CVD Exhaust", "Iceberg Context", "Large Lots", "Imbalance", "NQ Correlation"].map(c => (
                    <Checkbox key={c} label={c} accent={C.cyan} />
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Pattern Review Questions" color={C.info} icon="🔍">
              <Checkbox label="Was there a clear trend with broken structure, or was I forcing a pullback in chop?" accent={C.info} />
              <Checkbox label="Did the volume cluster have the correct delta?" accent={C.info} />
              <Checkbox label="Was my limit order at the LVN, or did I place it too far / too close?" accent={C.warn} />
              <Checkbox label="Did I get the aggressive or conservative stop right for this situation?" accent={C.warn} />
              <Checkbox label="Was the pullback on low volume (correct) or heavy volume (reversal signal I missed)?" accent={C.warn} />
              <Checkbox label="Did I check the correlation tracker for cross-market confirmation?" accent={C.info} />
              <Checkbox label="After T1, did I look for the next pullback opportunity?" accent={C.info} />
              <Checkbox label="How many pullbacks did I catch in this trend?" accent={C.long} />
            </Section>
          </>
        )}

        {/* FOOTER */}
        <div style={{ marginTop: "20px", padding: "12px 16px", background: "#0d1117", border: "1px solid #21262d", borderRadius: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
            <div style={{ fontSize: "10px", color: "#484f58" }}>COMPOSITE: VOL PROFILE + VOL BUBBLES + CVD + ICEBERG + IMBALANCE + CORRELATION</div>
            <div style={{ fontSize: "10px", color: "#30363d" }}>TradeSlayer Pro · Composite Strategy Card</div>
          </div>
          <div style={{ fontSize: "10px", color: "#30363d", borderTop: "1px solid #21262d", paddingTop: "8px" }}>
            Chains from: MOMENTUM (continuation) · Self-chains: PULLBACK → PULLBACK (fractal) · Source: Bookmap Education Part 4
          </div>
        </div>
      </div>
    </div>
  );
}
