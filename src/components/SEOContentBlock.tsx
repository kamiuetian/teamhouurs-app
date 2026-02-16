import type { City } from '@/data/cities';
import type { MeetingSlot } from '@/lib/meeting';
import { doesObserveDST } from '@/lib/time';

export function SEOContentBlock({
  cityA,
  cityB,
  timeDiffSentence,
  overlapSummary,
  slots,
}: {
  cityA: City;
  cityB: City;
  timeDiffSentence: string;
  overlapSummary: string;
  slots: MeetingSlot[];
}) {
  const aDST = doesObserveDST(cityA.timeZone);
  const bDST = doesObserveDST(cityB.timeZone);

  const best = slots[0];

  return (
    <section
      id="seo-insights"
      className="mx-auto mt-12 max-w-5xl border-t border-white/10 pt-10"
    >
      <h2 className="text-2xl font-semibold text-accent">
        How to schedule a meeting between {cityA.name} and {cityB.name}
      </h2>

      <p className="mt-4 leading-relaxed text-white/70">
        When coordinating across borders, finding the <strong className="text-white">golden hour</strong> is essential
        for productivity. {timeDiffSentence} {overlapSummary}
      </p>

      {best && (
        <p className="mt-4 text-white/70">
          A safe default is{' '}
          <strong className="text-white">{best.aLocalLabel}</strong> in {cityA.name}, which corresponds to{' '}
          <strong className="text-white">{best.bLocalLabel}</strong> in {cityB.name}.
        </p>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-card p-5 ring-1 ring-white/10">
          <h3 className="text-base font-semibold text-white">Typical work overlap</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {slots.slice(0, 3).map((s) => (
              <li key={s.baseStartMinutes}>
                <span className="font-semibold text-white">{s.aLocalLabel}</span> in {cityA.name}{' '}
                <span className="text-white/40">→</span>{' '}
                <span className="font-semibold text-white">{s.bLocalLabel}</span> in {cityB.name}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-white/50">
            These options assume 09:00–17:00 local working hours for both teams.
          </p>
        </div>

        <div className="rounded-2xl bg-card p-5 ring-1 ring-white/10">
          <h3 className="text-base font-semibold text-white">Key considerations</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              <strong className="text-white">DST:</strong> {cityA.name} {aDST ? 'does' : 'does not'} observe daylight saving
              time; {cityB.name} {bDST ? 'does' : 'does not'}.
            </li>
            <li>
              <strong className="text-white">Shoulder hours:</strong> early mornings (07:00–09:00) and late afternoons
              (17:00–21:00) can unlock extra overlap.
            </li>
            <li>
              <strong className="text-white">Avoid burnout:</strong> repeated late-night meetings hurt teams. Use async
              updates when overlap is minimal.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-card p-6 ring-1 ring-white/10">
        <h3 className="text-lg font-semibold text-white">Frequently asked questions</h3>

        <div className="mt-4 space-y-4 text-sm text-white/70">
          <div>
            <div className="font-semibold text-white">What is the time difference?</div>
            <div>{timeDiffSentence}</div>
          </div>
          <div>
            <div className="font-semibold text-white">Is now a good time to call?</div>
            <div>
              Look at the grid above and choose a green-green overlap when possible. If you see green-yellow, it’s still
              workable. If one side is grey, consider async.
            </div>
          </div>
          <div>
            <div className="font-semibold text-white">Do daylight saving changes affect this page?</div>
            <div>
              Yes. We use official IANA time zones, so offsets update automatically when DST starts or ends.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
