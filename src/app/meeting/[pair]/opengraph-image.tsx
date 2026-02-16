import { ImageResponse } from 'next/og';
import { CITY_BY_SLUG } from '@/data/cities';
import { parsePairSlug, formatOffsetDiff, recommendMeetingSlots } from '@/lib/meeting';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage({ params }: { params: { pair: string } }) {
  const parsed = parsePairSlug(params.pair);

  const now = new Date();

  const a = parsed ? CITY_BY_SLUG[parsed.aSlug] : undefined;
  const b = parsed ? CITY_BY_SLUG[parsed.bSlug] : undefined;

  const title = a && b ? `${a.name} ↔ ${b.name}` : 'TeamHouurs';
  const diff = a && b ? formatOffsetDiff(a, b, now).text : 'Time zone overlap grid';
  const best = a && b ? recommendMeetingSlots(a, b, now, { limit: 1 })[0] : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background: 'linear-gradient(135deg, #0f172a 0%, #111827 55%, #0b1220 100%)',
          color: '#f8fafc',
        }}
      >
        <div>
          <div style={{ fontSize: 24, color: 'rgba(248,250,252,0.7)' }}>TeamHouurs.app</div>
          <div style={{ fontSize: 58, fontWeight: 800, marginTop: 10, color: '#38bdf8' }}>{title}</div>
          <div style={{ fontSize: 26, marginTop: 18, maxWidth: 980 }}>{diff}</div>

          {best && a && b && (
            <div style={{ fontSize: 20, marginTop: 18, color: 'rgba(248,250,252,0.75)' }}>
              Suggested slot: <strong style={{ color: '#f8fafc' }}>{best.aLocalLabel}</strong> ({a.name}) →{' '}
              <strong style={{ color: '#f8fafc' }}>{best.bLocalLabel}</strong> ({b.name})
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(34,197,94,0.18)',
              border: '1px solid rgba(34,197,94,0.35)',
              fontSize: 18,
            }}
          >
            🟩 Work
          </div>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(234,179,8,0.18)',
              border: '1px solid rgba(234,179,8,0.35)',
              fontSize: 18,
            }}
          >
            🟨 Shoulder
          </div>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(148,163,184,0.12)',
              border: '1px solid rgba(148,163,184,0.25)',
              fontSize: 18,
            }}
          >
            ⬛ Sleep
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 16, color: 'rgba(248,250,252,0.6)' }}>teamhouurs.app</div>
        </div>
      </div>
    ),
    size
  );
}
