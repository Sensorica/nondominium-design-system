// "This comment is about that paragraph": the paragraph a comment was opened from,
// stored in the comment body so it survives on github.com and shows as a mark
// beside the paragraph for everyone.
//
// This is the small cousin of the reference implementation's screen anchors
// (requests-offers-design-system, anchor.ts). Those locate any element on any
// screen by geometry and DOM path, which an arbitrary prototype screen needs. A
// meeting journal does not: every paragraph already has a stable id from the
// parser (`discussion-3`), so the id is the whole address. Two lines are appended:
//
//   📍 on "Lead of the paragraph"
//   <!-- ds-about {"id":"discussion-3","q":"Lead of the paragraph"} -->

import type { Comment } from './comments-types';

export const ABOUT_MARKER = '📍 on';

const OPEN = '<!-- ds-about ';
const CLOSE = ' -->';

export interface About {
  /** The element id on the page, as the parser assigned it. */
  id: string;
  /** What the reader sees it called. */
  q: string;
}

export function encodeAbout(a: About): string {
  return `\n\n${ABOUT_MARKER} "${a.q.replace(/"/g, "'")}"\n${OPEN}${JSON.stringify(a)}${CLOSE}`;
}

export function decodeAbout(body: string): About | null {
  const i = body.indexOf(OPEN);
  if (i === -1) return null;
  const j = body.indexOf(CLOSE, i);
  if (j === -1) return null;
  try {
    const raw = JSON.parse(body.slice(i + OPEN.length, j)) as Partial<About>;
    return typeof raw.id === 'string' ? { id: raw.id, q: String(raw.q ?? '') } : null;
  } catch {
    return null;
  }
}

/** How many comments point at each element id. */
export function aboutCounts(list: Comment[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of list) {
    const a = decodeAbout(c.body);
    if (a) out[a.id] = (out[a.id] ?? 0) + 1;
  }
  return out;
}

/** Event a page listens for to show the element a comment is about. */
export const ABOUT_EVENT = 'ds-about';

export function showAbout(id: string): void {
  window.dispatchEvent(new CustomEvent(ABOUT_EVENT, { detail: id }));
}
