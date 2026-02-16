import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/site';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 64,
          background: 'linear-gradient(135deg, #0f172a 0%, #111827 55%, #0b1220 100%)',
          color: '#f8fafc',
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800, color: '#38bdf8' }}>{SITE_NAME}.app</div>
        <div style={{ fontSize: 32, marginTop: 14, maxWidth: 900 }}>
          Global time zone overlap grid for remote meetings
        </div>
        <div style={{ fontSize: 20, marginTop: 22, color: 'rgba(248,250,252,0.75)', maxWidth: 900 }}>
          Pick a city pair → see working-hour overlap → schedule confidently.
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            marginTop: 44,
          }}
        >
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(30,41,59,0.9)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: 18,
            }}
          >
            🟩 Work
          </div>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(30,41,59,0.9)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: 18,
            }}
          >
            🟨 Shoulder
          </div>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(30,41,59,0.9)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: 18,
            }}
          >
            ⬛ Sleep
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 40, left: 64, fontSize: 16, color: 'rgba(248,250,252,0.6)' }}>
          teamhouurs.app
        </div>
      </div>
    ),
    size
  );
}
