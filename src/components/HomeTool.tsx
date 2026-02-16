'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { City } from '@/data/cities';
import { CITY_BY_SLUG } from '@/data/cities';
import { CitySearch } from '@/components/CitySearch';
import { TimeGrid } from '@/components/TimeGrid';

function uniqueBySlug(list: City[]) {
  const seen = new Set<string>();
  const out: City[] = [];
  for (const c of list) {
    if (seen.has(c.slug)) continue;
    seen.add(c.slug);
    out.push(c);
  }
  return out;
}

export function HomeTool({ initialCities }: { initialCities: City[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cities, setCities] = useState<City[]>(() => uniqueBySlug(initialCities));

  const pairUrl = useMemo(() => {
    if (cities.length !== 2) return null;
    return `/meeting/${cities[0].slug}-to-${cities[1].slug}`;
  }, [cities]);

  // Keep the URL in sync (shareable tool state)
  useEffect(() => {
    const slugs = cities.map((c) => c.slug).join(',');
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('cities', slugs);
    router.replace(`/?${sp.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);

  function addCity(city: City) {
    setCities((prev) => uniqueBySlug([...prev, city]));
  }

  function removeCity(slug: string) {
    setCities((prev) => prev.filter((c) => c.slug !== slug));
  }

  function reset() {
    const london = CITY_BY_SLUG['london'];
    const ny = CITY_BY_SLUG['new-york'];
    setCities(uniqueBySlug([london, ny].filter(Boolean) as City[]));
  }

  return (
    <div className="mt-8">
      <div className="rounded-2xl bg-card p-6 ring-1 ring-white/10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold text-white">Find the best meeting times across time zones</h1>
            <p className="mt-3 text-white/70">
              Add cities to generate a visual overlap grid. Click any hour to instantly see local times for everyone.
              Green is best, yellow is workable, and grey means someone is asleep.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {pairUrl && (
              <a
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
                href={pairUrl}
              >
                Open city-pair page
              </a>
            )}
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-card px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 hover:text-white"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-6">
          <CitySearch
            selected={cities}
            onAdd={addCity}
            onRemove={removeCity}
            placeholder="Type a city (e.g., Karachi, London, Tokyo)…"
          />
        </div>
      </div>

      <div className="mt-6">
        <TimeGrid cities={cities.length ? cities : initialCities} />
      </div>

      <section className="mx-auto mt-12 max-w-5xl text-sm text-white/70">
        <h2 className="text-lg font-semibold text-white">How TeamHouurs helps remote teams</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-card p-5 ring-1 ring-white/10">
            <div className="text-base font-semibold text-white">Visual overlap</div>
            <p className="mt-2">See working hours across cities at a glance. No more mental math.</p>
          </div>
          <div className="rounded-2xl bg-card p-5 ring-1 ring-white/10">
            <div className="text-base font-semibold text-white">Shareable links</div>
            <p className="mt-2">Use dedicated city-pair pages like /meeting/london-to-new-york for quick planning.</p>
          </div>
          <div className="rounded-2xl bg-card p-5 ring-1 ring-white/10">
            <div className="text-base font-semibold text-white">DST-safe</div>
            <p className="mt-2">Offsets are computed from IANA time zones, so daylight saving changes are handled automatically.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
