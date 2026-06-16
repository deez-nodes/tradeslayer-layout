import { X, Minus, Plus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { INSTRUMENT_SYMBOLS } from '@/constants/instruments';
import { cn } from '@/lib/cn';

function StepperRow({
  label,
  value,
  display,
  onChange,
  step,
  min,
  max,
}: {
  label: string;
  value: number;
  display: string;
  onChange: (next: number) => void;
  step: number;
  min: number;
  max: number;
}) {
  const clamp = (n: number) => Math.min(Math.max(n, min), max);
  const btn =
    'flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-canvas text-fg transition-colors hover:bg-panel-hi disabled:opacity-40 disabled:hover:bg-canvas';
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-sm font-medium text-fg">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" className={btn} disabled={value <= min} onClick={() => onChange(clamp(value - step))} aria-label={`Decrease ${label}`}>
          <Minus size={16} />
        </button>
        <span className="min-w-[72px] text-center font-mono text-base font-bold">{display}</span>
        <button type="button" className={btn} disabled={value >= max} onClick={() => onChange(clamp(value + step))} aria-label={`Increase ${label}`}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export function Settings() {
  const { session, updateConfig } = useSession();
  const navigate = useNavigate();
  const close = () => (window.history.length > 1 ? navigate(-1) : navigate('/'));

  return (
    <div className="min-h-screen overflow-y-auto bg-canvas">
      <div className="mx-auto w-full max-w-2xl px-6 py-6">
        <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
          <h1 className="text-sm font-bold uppercase tracking-[0.1em] text-fg">Settings</h1>
          <button type="button" onClick={close} aria-label="Close settings" className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-mute transition-colors hover:bg-panel-hi hover:text-fg">
            <X size={20} />
          </button>
        </div>

        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-fg-mute">Guardrails</p>
        <div className="rounded-xl border border-line bg-panel px-4 [&>*+*]:border-t [&>*+*]:border-line">
          <StepperRow label="Daily Goal" value={session.dailyGoal} display={`$${session.dailyGoal}`} step={50} min={0} max={10000} onChange={(dailyGoal) => updateConfig({ dailyGoal })} />
          <StepperRow label="Max Loss" value={session.maxLoss} display={`-$${Math.abs(session.maxLoss)}`} step={50} min={-10000} max={0} onChange={(maxLoss) => updateConfig({ maxLoss })} />
          <StepperRow label="Max Trades" value={session.maxTrades} display={`${session.maxTrades}`} step={1} min={1} max={100} onChange={(maxTrades) => updateConfig({ maxTrades })} />
          <StepperRow label="Max Lots" value={session.maxLots} display={`${session.maxLots}`} step={1} min={1} max={50} onChange={(maxLots) => updateConfig({ maxLots, lots: Math.min(session.lots, maxLots) })} />
        </div>

        <p className="mb-2 mt-6 text-[10px] font-bold uppercase tracking-[0.1em] text-fg-mute">Default Instrument</p>
        <div className="flex flex-wrap gap-2">
          {INSTRUMENT_SYMBOLS.map((sym) => {
            const active = session.instrument === sym;
            return (
              <button
                key={sym}
                type="button"
                onClick={() => updateConfig({ instrument: sym })}
                aria-pressed={active}
                className={cn(
                  'rounded-full border px-4 py-2 font-mono text-[13px] font-medium transition-colors',
                  active ? 'border-accent bg-accent/15 text-accent' : 'border-line bg-panel text-fg-mute hover:bg-panel-hi',
                )}
              >
                {sym}
              </button>
            );
          })}
        </div>

        <p className="mb-2 mt-6 text-[10px] font-bold uppercase tracking-[0.1em] text-fg-mute">Default Lots</p>
        <div className="rounded-xl border border-line bg-panel px-4">
          <StepperRow label="Lots per trade" value={session.lots} display={`${session.lots}`} step={1} min={1} max={session.maxLots} onChange={(lots) => updateConfig({ lots })} />
        </div>

        <div className="mt-6 flex items-center gap-1.5">
          <CheckCircle size={13} className="text-up" />
          <span className="text-xs text-fg-mute">Changes save automatically to this device.</span>
        </div>
      </div>
    </div>
  );
}
