'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TOP_CITIES } from '@/data/cities';

export function PairPicker({ defaultA = 'london', defaultB = 'new-york' }: { defaultA?: string; defaultB?: string }) {
  const router = useRouter();
  const [a, setA] = useState(defaultA);
  const [b, setB] = useState(defaultB);

  const aCity = useMemo(() => TOP_CITIES.find((c) => c.slug === a), [a]);
  const bCity = useMemo(() => TOP_CITIES.find((c) => c.slug === b), [b]);

  const disabled = !aCity || !bCity || aCity.slug === bCity.slug;

  function go() {
    if (disabled) return;
    router.push(`/meeting/${aCity!.slug}-to-${bCity!.slug}`);
  }

  return (
    <div className="rounded-2xl bg-card p-6 ring-1 ring-white/10">
      <h2 className="text-lg font-semibold text-white">Create a city-pair link</h2>
      <p className="mt-2 text-sm text-white/70">Pick two cities to open a dedicated meeting-time page.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-white/70">
          City A
          <select
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white ring-1 ring-white/10"
          >
            {TOP_CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.country})
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-white/70">
          City B
          <select
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white ring-1 ring-white/10"
          >
            {TOP_CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.country})
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={go}
        disabled={disabled}
        className="mt-4 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-40"
      >
        Open page
      </button>

      <p className="mt-3 text-xs text-white/50">
        URL format: <code className="text-white/70">/meeting/london-to-new-york</code>
      </p>
    </div>
  );
}
