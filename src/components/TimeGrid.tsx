'use client';

import { useEffect, useMemo, useState } from 'react';
import type { City } from '@/data/cities';
import {
  clampMod,
  dayPartForLocalMinutes,
  formatOffset,
  formatTimeInZone,
  getMinutesOfDayInZone,
  getTimeZoneOffsetMinutes,
} from '@/lib/time';
import { cx } from '@/lib/cx';

function minutesToHHMM(m: number) {
  const mm = clampMod(m, 1440);
  const h = Math.floor(mm / 60);
  const min = mm % 60;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

function minutesToLabel(m: number, hour12: boolean) {
  const mm = clampMod(m, 1440);
  const h24 = Math.floor(mm / 60);
  const min = mm % 60;
  if (!hour12) return `${String(h24).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  const suffix = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(min).padStart(2, '0')} ${suffix}`;
}

function dayDeltaSuffix(dayDelta: number) {
  if (dayDelta === 0) return '';
  if (dayDelta === 1) return ' (+1d)';
  if (dayDelta === -1) return ' (-1d)';
  return dayDelta > 0 ? ` (+${dayDelta}d)` : ` (${dayDelta}d)`;
}

export function TimeGrid({
  cities,
  initialSelectedHour,
  showLegend = true,
}: {
  cities: City[];
  initialSelectedHour?: number;
  showLegend?: boolean;
}) {
  const [now, setNow] = useState(() => new Date());
  const [selectedHour, setSelectedHour] = useState<number>(() => initialSelectedHour ?? 12);
  const [hour12, setHour12] = useState(false);

  // Keep the "current time" indicators fresh.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  // Update selection to "now" on first render (if not provided).
  useEffect(() => {
    if (typeof initialSelectedHour === 'number') return;
    const base = cities[0];
    if (!base) return;
    const baseMins = getMinutesOfDayInZone(now, base.timeZone);
    setSelectedHour(Math.floor(baseMins / 60));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const base = cities[0];

  const model = useMemo(() => {
    if (!base) return null;

    const baseOffset = getTimeZoneOffsetMinutes(base.timeZone, now);

    const rows = cities.map((city) => {
      const offset = getTimeZoneOffsetMinutes(city.timeZone, now);
      const diff = offset - baseOffset;

      const cells = Array.from({ length: 24 }, (_, h) => {
        const baseMinutes = h * 60;
        const raw = baseMinutes + diff;
        const dayDelta = Math.floor(raw / 1440);
        const localMinutes = clampMod(raw, 1440);
        const part = dayPartForLocalMinutes(localMinutes + 30); // mid of the hour

        return {
          h,
          localMinutes,
          label: minutesToHHMM(localMinutes),
          part,
          dayDelta,
        };
      });

      return {
        city,
        offsetLabel: formatOffset(offset),
        currentTimeLabel: formatTimeInZone(now, city.timeZone, { hour12 }),
        diffMinutes: diff,
        cells,
      };
    });

    const baseNowMinutes = getMinutesOfDayInZone(now, base.timeZone);

    return {
      base,
      baseOffsetLabel: formatOffset(baseOffset),
      baseNowMinutes,
      baseNowLabel: formatTimeInZone(now, base.timeZone, { hour12 }),
      rows,
    };
  }, [base, cities, now, hour12]);

  const selectedSummary = useMemo(() => {
    if (!model) return null;

    const baseMinutes = selectedHour * 60;

    const items = model.rows.map((r) => {
      const raw = baseMinutes + r.diffMinutes;
      const dayDelta = Math.floor(raw / 1440);
      const localMinutes = clampMod(raw, 1440);
      const label = minutesToLabel(localMinutes, hour12);

      return {
        slug: r.city.slug,
        name: r.city.name,
        label: `${label}${dayDeltaSuffix(dayDelta)}`,
      };
    });

    const baseLabel = minutesToLabel(baseMinutes, hour12);

    return {
      baseLabel,
      baseCity: model.base.name,
      items,
    };
  }, [hour12, model, now, selectedHour]);

  if (!model) {
    return null;
  }

  const nowHour = Math.floor(model.baseNowMinutes / 60);

  return (
    <section className="w-full">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Overlap grid</h2>
          <p className="text-sm text-white/60">
            Base time zone: <span className="text-white/80">{model.base.name}</span> ({model.baseOffsetLabel}) ·
            Now: <span className="text-white/80">{model.baseNowLabel}</span>
          </p>
          {selectedSummary && (
            <p className="mt-2 text-sm text-white/70">
              Selected:{' '}
              <span className="font-semibold text-white">{selectedSummary.baseLabel}</span> in {selectedSummary.baseCity}
              <span className="text-white/50"> → </span>
              {selectedSummary.items.map((it, idx) => (
                <span key={it.slug} className="text-white/80">
                  {it.name}: <span className="font-medium text-white">{it.label}</span>
                  {idx < selectedSummary.items.length - 1 ? <span className="text-white/50"> · </span> : null}
                </span>
              ))}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedHour(nowHour)}
            className="rounded-lg bg-card px-3 py-2 text-sm text-white/80 ring-1 ring-white/10 hover:text-white"
            title="Jump selection to the current hour"
          >
            Jump to now
          </button>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-card px-3 py-2 text-sm text-white/80 ring-1 ring-white/10">
            <input
              type="checkbox"
              checked={hour12}
              onChange={(e) => setHour12(e.target.checked)}
              className="accent-accent"
            />
            12h
          </label>
        </div>
      </div>

      {showLegend && (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-white/70">
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 ring-1 ring-white/10">
            <span aria-hidden>🟩</span> Work (09:00–17:00)
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 ring-1 ring-white/10">
            <span aria-hidden>🟨</span> Shoulder (07:00–09:00, 17:00–21:00)
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 ring-1 ring-white/10">
            <span aria-hidden>⬛</span> Sleep (21:00–07:00)
          </span>
        </div>
      )}

      <div className="w-full overflow-x-auto rounded-2xl bg-card p-4 shadow-lg ring-1 ring-white/10">
        {/* Hour axis */}
        <div className="mb-3 grid min-w-[900px] grid-cols-[220px_repeat(24,minmax(0,1fr))] items-center gap-1">
          <div className="text-xs text-white/50">{model.base.name} time</div>
          {Array.from({ length: 24 }, (_, h) => (
            <button
              key={h}
              type="button"
              onClick={() => setSelectedHour(h)}
              className={cx(
                'h-9 rounded-md text-center text-[11px] font-medium',
                'ring-1 ring-white/10 hover:ring-white/30',
                h === selectedHour && 'shadow-glow ring-white/50',
                h === nowHour && 'bg-white/5'
              )}
              title={h === nowHour ? 'Current hour in base city' : undefined}
            >
              {String(h).padStart(2, '0')}
            </button>
          ))}
        </div>

        {/* City rows */}
        <div className="flex flex-col gap-3">
          {model.rows.map((r) => (
            <div
              key={r.city.slug}
              className="grid min-w-[900px] grid-cols-[220px_repeat(24,minmax(0,1fr))] items-center gap-1"
            >
              <div className="pr-2">
                <div className="text-sm font-semibold text-white">{r.city.name}</div>
                <div className="text-xs text-white/50">
                  {r.offsetLabel} · now {r.currentTimeLabel}
                </div>
              </div>

              {r.cells.map((c) => {
                const baseSelected = c.h === selectedHour;

                return (
                  <button
                    key={c.h}
                    type="button"
                    onClick={() => setSelectedHour(c.h)}
                    className={cx(
                      'group relative flex h-9 items-center justify-center rounded-md text-[11px] font-medium',
                      'transition-transform hover:scale-[1.06] hover:z-10',
                      c.part === 'work' && 'bg-work text-white',
                      c.part === 'shoulder' && 'bg-shoulder text-black',
                      c.part === 'sleep' && 'bg-sleep text-slate-300',
                      baseSelected && 'shadow-glow ring-2 ring-white/70'
                    )}
                    title={`${r.city.name}: ${c.label}${dayDeltaSuffix(c.dayDelta)} (${c.part})`}
                  >
                    <span className="hidden sm:inline">{c.label}</span>
                    <span className="sm:hidden" aria-hidden>
                      {c.label.slice(0, 2)}
                    </span>

                    {/* Tooltip */}
                    <span className="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-3 py-1 text-xs text-white group-hover:block">
                      {c.label}
                      {dayDeltaSuffix(c.dayDelta)} · {c.part}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
