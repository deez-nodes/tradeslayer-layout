import type { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { Colors } from '@/constants/colors';

export type Tone = 'green' | 'yellow' | 'red' | 'blue' | 'muted';

export const toneColor: Record<Tone, string> = {
  green: Colors.statusGreen,
  yellow: Colors.statusYellow,
  red: Colors.statusRed,
  blue: Colors.statusBlue,
  muted: Colors.textMuted,
};

/** Standard card/panel surface. */
export function Panel({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className={cn('rounded-xl border border-line bg-panel', className)} style={style}>
      {children}
    </div>
  );
}

/** Small uppercase section label (the spec's "· LAYER N" eyebrow). */
export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('text-[10px] font-medium uppercase tracking-[0.1em] text-fg-mute', className)}>
      {children}
    </span>
  );
}

/** Rounded status pill. */
export function PillBadge({ label, tone = 'muted' }: { label: string; tone?: Tone }) {
  const color = toneColor[tone];
  return (
    <span
      className="rounded-full border px-2 py-[3px] text-[11px] font-medium tracking-wide"
      style={{ color, borderColor: `${color}66`, backgroundColor: `${color}18` }}
    >
      {label}
    </span>
  );
}

/** Small colored status dot. */
export function StatusDot({ tone, color, size = 8 }: { tone?: Tone; color?: string; size?: number }) {
  const c = color ?? (tone ? toneColor[tone] : Colors.textMuted);
  return (
    <span
      className="inline-block rounded-full"
      style={{ width: size, height: size, backgroundColor: c }}
    />
  );
}

/** Horizontal progress bar (0–1), CSS-animated width. */
export function ProgressBar({
  value,
  color = Colors.accentPrimary,
  className,
  height = 6,
}: {
  value: number;
  color?: string;
  className?: string;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-line', className)}
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

/** Labeled stat cell (used in summaries). */
export function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <span className="text-[10px] text-fg-mute">{label}</span>
      <span className="font-mono text-lg font-bold" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}

/** A 44px-square icon button for app bars. */
export function IconButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-lg text-fg-mute transition-colors hover:bg-panel-hi hover:text-fg',
        className,
      )}
    >
      {children}
    </button>
  );
}
