// A meeting's recording: the frontmatter fields that point at it, and the small
// helpers the page needs to show it.
//
//   recording: https://media.alternef.org/k3f9x2/2026-09-08-dev.opus
//   recording_cuts: [[120, 185], [610, 640]]
//
// `recording` is published only when it is an https URL. A local path, another
// scheme or anything that does not parse is ignored, so a journal that still
// carries `~/Downloads/call.opus` never renders a dead or private link.
//
// `recording_cuts` lists passages silenced in the published audio for privacy,
// as [start, end] pairs in seconds. The page says so near the player and on the
// timeline. The cuts must match what the audio really has silenced.

/** [start, end] in seconds. */
export type Cut = [number, number];

export interface Recording {
  url: string;
  cuts: Cut[];
}

/** The URL if it is a plain https link, else null. */
export function parseRecordingUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const raw = value.trim();
  if (!/^https:\/\//i.test(raw)) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:' || !u.hostname || u.username || u.password) return null;
    return u.href;
  } catch {
    return null;
  }
}

/**
 * `[[120, 185], [610, 640]]` -> valid cuts, sorted by start. A pair is kept only
 * when both ends are finite, non-negative numbers and start < end; anything else
 * is dropped, so one typo never hides the other cuts.
 */
export function parseCuts(value: unknown): Cut[] {
  let list: unknown = value;
  if (typeof value === 'string') {
    try {
      list = JSON.parse(value);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(list)) return [];
  const cuts: Cut[] = [];
  for (const pair of list) {
    if (!Array.isArray(pair) || pair.length !== 2) continue;
    const [a, b] = pair;
    if (typeof a !== 'number' || typeof b !== 'number') continue;
    if (!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || a >= b) continue;
    cuts.push([a, b]);
  }
  return cuts.sort((x, y) => x[0] - y[0]);
}

/** 125 -> "02:05", 3725 -> "62:05". Minutes are not wrapped at 60, like the minute chips. */
export function fmtMmSs(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/** "removed for privacy, 02:00 to 03:05" / "retiré pour confidentialité, de 02:00 à 03:05". */
export function cutLabel([start, end]: Cut, lang: 'en' | 'fr'): string {
  return lang === 'fr'
    ? `retiré pour confidentialité, de ${fmtMmSs(start)} à ${fmtMmSs(end)}`
    : `removed for privacy, ${fmtMmSs(start)} to ${fmtMmSs(end)}`;
}

/** The recording of the version on screen, else the other version's. */
export function pickRecording(shown: Recording | null, other: Recording | null | undefined): Recording | null {
  return shown ?? other ?? null;
}
