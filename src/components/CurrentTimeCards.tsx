'use client';

import { useEffect, useMemo, useState } from 'react';
import type { City } from '@/data/cities';
import { dayPartForLocalMinutes, formatTimeInZone, getMinutesOfDayInZone } from '@/lib/time';

function partLabel(part: 'work' | 'shoulder' | 'sleep') {
  if (part === 'work') return { text: 'Working hours', cls: 'bg-work text-white' };
  if (part === 'shoulder') return { text: 'Shoulder hours', cls: 'bg-shoulder text-black' };
  return { text: 'Outside work', cls: 'bg-sleep text-slate-200' };
}

export function CurrentTimeCards({ cityA, cityB }: { cityA: City; cityB: City }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const data = useMemo(() => {
    const aM = getMinutesOfDayInZone(now, cityA.timeZone);
    const bM = getMinutesOfDayInZone(now, cityB.timeZone);
    const aPart = dayPartForLocalMinutes(aM);
    const bPart = dayPartForLocalMinutes(bM);

    return {
      aTime: formatTimeInZone(now, cityA.timeZone, { hour12: false }),
      bTime: formatTimeInZone(now, cityB.timeZone, { hour12: false }),
      aPart,
      bPart,
    };
  }, [cityA.timeZone, cityB.timeZone, now, cityA.name, cityB.name]);

  const aBadge = partLabel(data.aPart);
  const bBadge = partLabel(data.bPart);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-white/60">Current time in {cityA.name}</div>
            <div className="mt-2 text-2xl font-semibold text-white tabular-nums">{data.aTime}</div>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${aBadge.cls}`}>{aBadge.text}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-white/60">Current time in {cityB.name}</div>
            <div className="mt-2 text-2xl font-semibold text-white tabular-nums">{data.bTime}</div>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${bBadge.cls}`}>{bBadge.text}</span>
        </div>
      </div>
    </div>
  );
}
