import { PairPicker } from '@/components/PairPicker';
import { TOP_CITIES } from '@/data/cities';

export const metadata = {
  title: 'Meeting planner between cities',
  description:
    'Create dedicated city-pair pages to find the best meeting times across time zones. Includes overlap grid and recommended slots.',
};

export default function MeetingIndexPage() {
  const popularPairs: Array<[string, string]> = [
    ['london', 'new-york'],
    ['san-francisco', 'london'],
    ['new-york', 'tokyo'],
    ['dubai', 'london'],
    ['singapore', 'sydney'],
    ['karachi', 'london'],
  ];

  const label = (slug: string) => TOP_CITIES.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <div className="mt-10">
      <div className="rounded-2xl bg-card p-6 ring-1 ring-white/10">
        <h1 className="text-3xl font-semibold text-white">City-to-city meeting planner</h1>
        <p className="mt-3 max-w-3xl text-white/70">
          TeamHouurs generates dedicated pages for city pairs so managers can quickly see the time difference, working-hour
          overlap, and recommended meeting slots.
        </p>
      </div>

      <div className="mt-6">
        <PairPicker />
      </div>

      <section className="mx-auto mt-10 max-w-5xl">
        <h2 className="text-lg font-semibold text-white">Popular city pairs</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {popularPairs.map(([a, b]) => (
            <a
              key={`${a}-${b}`}
              className="rounded-xl bg-card px-4 py-3 text-sm text-white/80 ring-1 ring-white/10 hover:text-white"
              href={`/meeting/${a}-to-${b}`}
            >
              {label(a)} → {label(b)}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-5xl text-sm text-white/70">
        <h2 className="text-lg font-semibold text-white">How to use these pages</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Open a city pair page (e.g., London → New York).</li>
          <li>Check the green overlap for the healthiest meeting hours.</li>
          <li>Use the recommended slots table for quick scheduling.</li>
          <li>Share the link with your team so everyone sees the same reference.</li>
        </ol>
      </section>
    </div>
  );
}
