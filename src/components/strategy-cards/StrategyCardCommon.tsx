import { useState, type ReactNode } from "react";

const CHECK = "✓";
const UNCHECK = "○";

export const STRATEGY_COLORS = {
  long: "#3fb950",
  short: "#f85149",
  warn: "#d29922",
  info: "#58a6ff",
  neutral: "#8b949e",
  cyan: "#39d2c0",
  purple: "#bc8cff",
  orange: "#f0883e"
};

export interface CheckboxProps {
  label: string;
  sublabel?: string;
  accent?: string;
}

export function Checkbox({ label, sublabel, accent = "#8b949e" }: CheckboxProps) {
  const [checked, setChecked] = useState(false);
  return (
    <div
      onClick={() => setChecked(!checked)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "7px 12px",
        cursor: "pointer",
        borderRadius: "4px",
        background: checked ? `${accent}12` : "transparent",
        borderLeft: checked ? `3px solid ${accent}` : "3px solid transparent",
        transition: "all 0.2s ease",
        userSelect: "none"
      }}
    >
      <span
        style={{
          color: checked ? accent : "#555",
          fontSize: "16px",
          fontWeight: 700,
          lineHeight: "20px",
          flexShrink: 0,
          fontFamily: "monospace"
        }}
      >
        {checked ? CHECK : UNCHECK}
      </span>
      <div style={{ lineHeight: "20px" }}>
        <span
          style={{
            color: checked ? "#c9d1d9" : "#8b949e",
            fontSize: "13px",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            transition: "color 0.2s"
          }}
        >
          {label}
        </span>
        {sublabel && (
          <div
            style={{
              color: "#555",
              fontSize: "11px",
              fontFamily: "'JetBrains Mono', monospace",
              marginTop: "2px"
            }}
          >
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}

export interface SectionProps {
  title: string;
  color: string;
  icon: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Section({ title, color, icon, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        background: "#0d1117",
        border: `1px solid ${color}33`,
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "12px"
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 16px",
          cursor: "pointer",
          background: `linear-gradient(90deg, ${color}15 0%, transparent 100%)`,
          borderBottom: open ? `1px solid ${color}33` : "none",
          userSelect: "none"
        }}
      >
        <span style={{ fontSize: "16px" }}>{icon}</span>
        <span
          style={{
            color,
            fontSize: "13px",
            fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            flex: 1
          }}
        >
          {title}
        </span>
        <span
          style={{
            color: "#555",
            fontSize: "12px",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s"
          }}
        >
          ▼
        </span>
      </div>
      {open && <div style={{ padding: "12px 8px" }}>{children}</div>}
    </div>
  );
}

export interface PillProps {
  text: string;
  color: string;
}

export function Pill({ text, color }: PillProps) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "4px",
        background: `${color}20`,
        color,
        fontSize: "11px",
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        border: `1px solid ${color}40`,
        marginRight: "6px",
        marginBottom: "4px"
      }}
    >
      {text}
    </span>
  );
}

export interface DividerProps {
  label: string;
}

export function Divider({ label }: DividerProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "10px 8px 6px" }}>
      <div style={{ flex: 1, height: "1px", background: "#21262d" }} />
      <span
        style={{
          color: "#484f58",
          fontSize: "10px",
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "#21262d" }} />
    </div>
  );
}

export interface RefTagProps {
  card: string;
  color: string;
}

export function RefTag({ card, color }: RefTagProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        borderRadius: "3px",
        background: `${color}15`,
        color,
        fontSize: "10px",
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        border: `1px solid ${color}30`,
        marginLeft: "6px",
        verticalAlign: "middle"
      }}
    >
      ↗ {card}
    </span>
  );
}
