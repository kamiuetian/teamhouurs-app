import type { City } from '@/data/cities';
import type { MeetingSlot, OverlapSegment } from '@/lib/meeting';

function partBadge(part: 'work' | 'shoulder' | 'sleep') {
  if (part === 'work') return <span className="rounded-full bg-work px-2 py-0.5 text-xs font-semibold text-white">Work</span>;
  if (part === 'shoulder') return <span className="rounded-full bg-shoulder px-2 py-0.5 text-xs font-semibold text-black">Shoulder</span>;
  return <span className="rounded-full bg-sleep px-2 py-0.5 text-xs font-semibold text-slate-200">Sleep</span>;
}

function minutesToHHMM(m: number) {
  const mm = ((m % 1440) + 1440) % 1440;
  const h = Math.floor(mm / 60);
  const min = mm % 60;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

export function MeetingRecommendations({
  cityA,
  cityB,
  slots,
  overlapSummary,
  overlapSegments,
}: {
  cityA: City;
  cityB: City;
  slots: MeetingSlot[];
  overlapSummary: string;
  overlapSegments: OverlapSegment[];
}) {
  return (
    <section className="mt-10 rounded-2xl bg-card p-6 ring-1 ring-white/10">
      <h2 className="text-xl font-semibold text-white">Recommended meeting times</h2>
      <p className="mt-2 text-sm text-white/70">{overlapSummary}</p>

      {overlapSegments.length > 0 && (
        <p className="mt-2 text-xs text-white/50">
          Overlap segments in {cityA.name} time:{' '}
          {overlapSegments.map((s, idx) => (
            <span key={`${s.start}-${s.end}`}>
              {minutesToHHMM(s.start)}–{minutesToHHMM(s.end)}
              {idx < overlapSegments.length - 1 ? <span className="px-2">·</span> : null}
            </span>
          ))}
        </p>
      )}

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] table-auto border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-xs text-white/60">
              <th className="px-3 py-2">Start ({cityA.name})</th>
              <th className="px-3 py-2">{cityA.name} status</th>
              <th className="px-3 py-2">Start ({cityB.name})</th>
              <th className="px-3 py-2">{cityB.name} status</th>
              <th className="px-3 py-2">Why this works</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s.baseStartMinutes} className="rounded-xl bg-white/5 text-sm">
                <td className="px-3 py-3 font-semibold text-white">{s.aLocalLabel}</td>
                <td className="px-3 py-3">{partBadge(s.aPart)}</td>
                <td className="px-3 py-3 font-semibold text-white">{s.bLocalLabel}</td>
                <td className="px-3 py-3">{partBadge(s.bPart)}</td>
                <td className="px-3 py-3 text-white/70">
                  {s.score >= 6
                    ? 'Both teams are fully within working hours.'
                    : s.score >= 4
                      ? 'Strong overlap (work/shoulder).'
                      : 'Use if needed—one side may be outside 9–5.'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-white/50">
        Assumes a standard workday of 09:00–17:00 in each city. You can customize this logic later (e.g., flexible hours, team preferences, meeting length).
      </p>
    </section>
  );
}
