import type { City } from '@/data/cities';
import {
  WORK_END,
  WORK_START,
  clampMod,
  dayPartForLocalMinutes,
  formatOffset,
  formatTimeInZone,
  getTimeZoneOffsetMinutes,
  isWithinWorkWindow,
} from '@/lib/time';

export type ParsedPair = {
  aSlug: string;
  bSlug: string;
};

export function parsePairSlug(pair: string): ParsedPair | null {
  const cleaned = pair.trim().toLowerCase();
  const parts = cleaned.split('-to-');
  if (parts.length !== 2) return null;
  const [aSlug, bSlug] = parts;
  if (!aSlug || !bSlug) return null;
  return { aSlug, bSlug };
}

export function offsetDiffMinutes(a: City, b: City, date: Date) {
  const ao = getTimeZoneOffsetMinutes(a.timeZone, date);
  const bo = getTimeZoneOffsetMinutes(b.timeZone, date);
  // Positive means City A is ahead of City B
  return ao - bo;
}

export function formatOffsetDiff(a: City, b: City, date: Date): {
  text: string;
  minutes: number;
} {
  const diff = offsetDiffMinutes(a, b, date);
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const hm = m === 0 ? `${h} hour${h === 1 ? '' : 's'}` : `${h}h ${m}m`;
  if (diff === 0) return { text: `${a.name} and ${b.name} are in the same time zone right now.`, minutes: 0 };
  if (diff > 0) return { text: `${a.name} is ${hm} ahead of ${b.name}.`, minutes: diff };
  return { text: `${a.name} is ${hm} behind ${b.name}.`, minutes: diff };
}

export type OverlapSegment = { start: number; end: number };

function circularSegments(start: number, end: number): OverlapSegment[] {
  // Normalize to [0, 1440)
  const s = clampMod(start, 1440);
  const e = clampMod(end, 1440);
  if (s === e) {
    // Full day (should never happen for work windows)
    return [{ start: 0, end: 1440 }];
  }
  if (s < e) return [{ start: s, end: e }];
  return [
    { start: s, end: 1440 },
    { start: 0, end: e },
  ];
}

function intersect(a: OverlapSegment, b: OverlapSegment): OverlapSegment | null {
  const start = Math.max(a.start, b.start);
  const end = Math.min(a.end, b.end);
  if (end <= start) return null;
  return { start, end };
}

export function computeWorkOverlapInBase(
  base: City,
  other: City,
  date: Date
): {
  baseOffset: string;
  otherOffset: string;
  segments: OverlapSegment[];
} {
  const baseOffsetMin = getTimeZoneOffsetMinutes(base.timeZone, date);
  const otherOffsetMin = getTimeZoneOffsetMinutes(other.timeZone, date);

  const baseOffset = formatOffset(baseOffsetMin);
  const otherOffset = formatOffset(otherOffsetMin);

  // Other city work window expressed in base-city minutes of day.
  const delta = otherOffsetMin - baseOffsetMin; // otherLocal = baseLocal + delta
  const otherStartBase = WORK_START - delta;
  const otherEndBase = WORK_END - delta;

  const baseWork: OverlapSegment = { start: WORK_START, end: WORK_END };
  const otherSegs = circularSegments(otherStartBase, otherEndBase);

  const overlaps: OverlapSegment[] = [];
  for (const s of otherSegs) {
    const o = intersect(baseWork, s);
    if (o) overlaps.push(o);
  }

  overlaps.sort((x, y) => x.start - y.start);

  return { baseOffset, otherOffset, segments: overlaps };
}

export type MeetingSlot = {
  baseStartMinutes: number;
  baseStartLabel: string;
  aLocalLabel: string;
  bLocalLabel: string;
  aPart: 'work' | 'shoulder' | 'sleep';
  bPart: 'work' | 'shoulder' | 'sleep';
  score: number;
};

function minutesToHHMM(m: number) {
  const mm = clampMod(m, 1440);
  const h = Math.floor(mm / 60);
  const min = mm % 60;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

function withDayDelta(baseMinutes: number, deltaMinutes: number) {
  const raw = baseMinutes + deltaMinutes;
  const dayDelta = Math.floor(raw / 1440);
  const local = clampMod(raw, 1440);
  return { local, dayDelta };
}

function dayDeltaSuffix(dayDelta: number) {
  if (dayDelta === 0) return '';
  if (dayDelta === 1) return ' (+1d)';
  if (dayDelta === -1) return ' (-1d)';
  return dayDelta > 0 ? ` (+${dayDelta}d)` : ` (${dayDelta}d)`;
}

function partScore(part: 'work' | 'shoulder' | 'sleep') {
  if (part === 'work') return 2;
  if (part === 'shoulder') return 1;
  return 0;
}

/**
 * Recommends meeting start times (default 60 min) in the base city (City A).
 * Uses a simple scoring function:
 * - Work hours score higher than shoulder hours, which score higher than sleep.
 */
export function recommendMeetingSlots(
  cityA: City,
  cityB: City,
  date: Date,
  opts?: { durationMinutes?: number; stepMinutes?: number; limit?: number }
): MeetingSlot[] {
  const duration = opts?.durationMinutes ?? 60;
  const step = opts?.stepMinutes ?? 30;
  const limit = opts?.limit ?? 3;

  const aOffset = getTimeZoneOffsetMinutes(cityA.timeZone, date);
  const bOffset = getTimeZoneOffsetMinutes(cityB.timeZone, date);
  const delta = bOffset - aOffset;

  const candidates: MeetingSlot[] = [];

  for (let baseStart = 0; baseStart <= 1440 - duration; baseStart += step) {
    // City A local time is the base time.
    const aMid = baseStart + Math.floor(duration / 2);

    const b = withDayDelta(baseStart, delta);
    const bMid = b.local + Math.floor(duration / 2);

    // Prevent meetings that wrap midnight in either locale (keeps the UI simple + avoids confusion).
    if (baseStart + duration > 1440) continue;
    if (b.local + duration > 1440) continue;

    const aPart = dayPartForLocalMinutes(aMid);
    const bPart = dayPartForLocalMinutes(bMid);

    // Bonus if the entire meeting fits inside work window.
    const aFullyWork = isWithinWorkWindow(baseStart, duration);
    const bFullyWork = isWithinWorkWindow(b.local, duration);

    const score =
      partScore(aPart) +
      partScore(bPart) +
      (aFullyWork ? 1 : 0) +
      (bFullyWork ? 1 : 0);

    candidates.push({
      baseStartMinutes: baseStart,
      baseStartLabel: minutesToHHMM(baseStart),
      aLocalLabel: `${minutesToHHMM(baseStart)}`,
      bLocalLabel: `${minutesToHHMM(b.local)}${dayDeltaSuffix(b.dayDelta)}`,
      aPart,
      bPart,
      score,
    });
  }

  // Sort by score desc, then by closeness to 13:00 (good default for work days)
  const ideal = 13 * 60;
  candidates.sort((x, y) => {
    if (y.score !== x.score) return y.score - x.score;
    return Math.abs(x.baseStartMinutes - ideal) - Math.abs(y.baseStartMinutes - ideal);
  });

  // Keep unique baseStartLabels only
  const out: MeetingSlot[] = [];
  const seen = new Set<number>();
  for (const c of candidates) {
    if (seen.has(c.baseStartMinutes)) continue;
    out.push(c);
    seen.add(c.baseStartMinutes);
    if (out.length >= limit) break;
  }

  return out;
}

export function formatOverlapSummary(
  cityA: City,
  cityB: City,
  date: Date
): { summary: string; segments: OverlapSegment[] } {
  const { segments } = computeWorkOverlapInBase(cityA, cityB, date);

  if (!segments.length) {
    return {
      summary:
        'There is no full overlap where both cities are within 9:00–17:00 at the same time. Use shoulder hours for one side, or split into async updates.',
      segments,
    };
  }

  const fmt = (m: number) => minutesToHHMM(m);
  const best = segments
    .slice()
    .sort((a, b) => (b.end - b.start) - (a.end - a.start))[0];

  return {
    summary: `Typical 9–5 overlap (in ${cityA.name} time): ${fmt(best.start)}–${fmt(best.end)}.`,
    segments,
  };
}

export function buildShareUrl(pair: string) {
  return `/meeting/${pair}`;
}

export function currentTimesSnapshot(cityA: City, cityB: City, date = new Date()) {
  return {
    aTime: formatTimeInZone(date, cityA.timeZone, { hour12: false }),
    bTime: formatTimeInZone(date, cityB.timeZone, { hour12: false }),
  };
}
