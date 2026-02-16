'use client';

import { useMemo, useState } from 'react';
import type { City } from '@/data/cities';
import { TOP_CITIES } from '@/data/cities';
import { cx } from '@/lib/cx';

export function CitySearch({
  selected,
  onAdd,
  onRemove,
  placeholder,
}: {
  selected: City[];
  onAdd: (city: City) => void;
  onRemove: (slug: string) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];

    const already = new Set(selected.map((c) => c.slug));

    const results = TOP_CITIES.filter((c) => {
      if (already.has(c.slug)) return false;
      const hay = `${c.name} ${c.country} ${c.slug}`.toLowerCase();
      return hay.includes(query);
    }).slice(0, 8);

    return results;
  }, [q, selected]);

  function addCity(city: City) {
    setError(null);
    onAdd(city);
    setQ('');
  }

  function onSubmit() {
    const query = q.trim().toLowerCase();
    if (!query) return;

    const already = new Set(selected.map((c) => c.slug));

    const exact = TOP_CITIES.find(
      (c) =>
        !already.has(c.slug) &&
        (c.slug === query || c.name.toLowerCase() === query)
    );

    if (exact) {
      addCity(exact);
      return;
    }

    if (suggestions[0]) {
      addCity(suggestions[0]);
      return;
    }

    setError('City not found in the built-in list (yet). Try a bigger hub like London, Tokyo, Karachi, Singapore…');
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {selected.map((c) => (
          <span
            key={c.slug}
            className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-sm text-white/90 ring-1 ring-white/10"
          >
            <span className="font-medium">{c.name}</span>
            <button
              type="button"
              onClick={() => onRemove(c.slug)}
              className="rounded-full px-1 text-white/60 hover:text-white"
              aria-label={`Remove ${c.name}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 rounded-xl bg-card p-2 ring-1 ring-white/10">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder={placeholder ?? 'Type a city (e.g., New York, London, Tokyo)…'}
            className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
            aria-label="City search"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-black hover:opacity-90"
          >
            Add
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl bg-card shadow-lg ring-1 ring-white/10">
            <ul className="divide-y divide-white/5">
              {suggestions.map((c) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => addCity(c)}
                    className={cx(
                      'flex w-full items-center justify-between px-4 py-3 text-left text-sm',
                      'hover:bg-white/5'
                    )}
                  >
                    <span>
                      <span className="font-medium text-white">{c.name}</span>
                      <span className="ml-2 text-white/50">{c.country}</span>
                    </span>
                    <span className="text-xs text-white/40">{c.timeZone}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}

      <p className="mt-3 text-xs text-white/50">
        Tip: pick 2 cities and share the dedicated page: <span className="text-white/70">/meeting/city-a-to-city-b</span>
      </p>
    </div>
  );
}
