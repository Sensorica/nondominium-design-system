// Video timecodes: let a reviewer say "at 0:42" and have it mean that moment.
//
// Same storage as paragraph pointers (about.ts): the comment body. Two lines are
// appended:
//
//   ⏱ at [0:42](https://design.sensorica.co/meetings/2026-10-20-dev#t=42), on "They register interest"
//   <!-- ds-time {"t":42.3,"q":"They register interest"} -->
//
// The quote is the transcript line the comment was opened from, when it was.
//
// On github.com the readable line is a link that opens the page at the moment.
// In the drawer it becomes a button that seeks the video in place.
//
// A page opts in by marking its player with `data-comment-video`. The hash, not
// the query string, carries the time: views are keyed on `location.search`, and
// a timecode must not fork a page into a separate view.

export const TIME_MARKER = '⏱ at';

const OPEN = '<!-- ds-time ';
const CLOSE = ' -->';

/** The page's commentable video, if it has one. */
export function commentVideo(): HTMLVideoElement | null {
  if (typeof document === 'undefined') return null;
  return document.querySelector<HTMLVideoElement>('video[data-comment-video]');
}

/** 42.3 -> "0:42", 3725 -> "1:02:05". */
export function fmtTime(t: number): string {
  const s = Math.max(0, Math.floor(t));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

export function encodeTime(t: number, quote?: string): string {
  const href = `${location.origin}${location.pathname}#t=${Math.floor(t)}`;
  const payload = JSON.stringify({ t: Math.round(t * 10) / 10, q: quote });
  const on = quote ? `, on "${quote}"` : '';
  return `\n\n${TIME_MARKER} [${fmtTime(t)}](${href})${on}\n${OPEN}${payload}${CLOSE}`;
}

export function decodeTime(body: string): number | null {
  const i = body.indexOf(OPEN);
  if (i === -1) return null;
  const j = body.indexOf(CLOSE, i);
  if (j === -1) return null;
  try {
    const raw = JSON.parse(body.slice(i + OPEN.length, j)) as { t?: unknown };
    return typeof raw.t === 'number' && raw.t >= 0 ? raw.t : null;
  } catch {
    return null;
  }
}

/** "#t=42" -> 42. Null for any other hash. */
export function timeFromHash(hash: string): number | null {
  const m = /^#t=(\d+(?:\.\d+)?)$/.exec(hash);
  return m ? Number(m[1]) : null;
}

/** Event a page without a video listens for to show moment `t` its own way. */
export const SEEK_EVENT = 'ds-seek';

/** Jump the page's video to `t` and play from there; without a video, tell the page. */
export function seekTo(t: number): void {
  const v = commentVideo();
  if (!v) {
    window.dispatchEvent(new CustomEvent(SEEK_EVENT, { detail: t }));
    return;
  }
  v.currentTime = t;
  v.scrollIntoView({ behavior: 'smooth', block: 'center' });
  void v.play().catch(() => {});
}
