// Follow-up marks: which meeting actions are done and which open questions are
// settled, shared by everyone who reads the resume. The same trick as review
// marks in the reference implementation: a machine-readable comment, one per
// reader, replaced in place when they change something, hidden from the comment
// list.
//
//   Follow-up: 3 actions done, 1 question settled
//   <!-- ds-follow {"actions-3":{"v":true,"at":"2026-10-13T14:02:00Z"}, ...} -->
//
// Each reader's mark holds only the items they touched. The shared state of an item
// is the latest entry across all readers, so one reader can untick what another
// ticked by mistake, and the page shows who did it last.
//
// Ported from requests-offers-design-system (src/lib/comments/follow.ts). Two
// adaptations: this kit's Comment has no `isBody` (its thread query never returns
// the discussion description as a comment), and `fmtStamp` lives here because this
// kit has no review marks to hold it.

import type { Comment } from './comments-types';

const OPEN = '<!-- ds-follow ';
const CLOSE = ' -->';

export interface FollowEntry {
  /** true = done (action) or settled (question); false = reopened. */
  v: boolean;
  /** ISO time of the change. */
  at: string;
}

export type FollowMark = Record<string, FollowEntry>;

export interface FollowState extends FollowEntry {
  by: string;
}

export function isFollowMark(body: string): boolean {
  return body.includes(OPEN);
}

export function decodeFollow(body: string): FollowMark | null {
  const i = body.indexOf(OPEN);
  if (i === -1) return null;
  const j = body.indexOf(CLOSE, i);
  if (j === -1) return null;
  try {
    const raw = JSON.parse(body.slice(i + OPEN.length, j)) as Record<string, Partial<FollowEntry>>;
    const out: FollowMark = {};
    for (const [id, e] of Object.entries(raw)) {
      if (typeof e?.v === 'boolean' && typeof e.at === 'string') out[id] = { v: e.v, at: e.at };
    }
    return out;
  } catch {
    return null;
  }
}

/** Body for a reader's mark. `isAction` tells actions from questions in the readable line. */
export function encodeFollow(m: FollowMark, isAction: (id: string) => boolean): string {
  const on = Object.entries(m).filter(([, e]) => e.v);
  const done = on.filter(([id]) => isAction(id)).length;
  const settled = on.length - done;
  const parts = [
    done ? `${done} action${done === 1 ? '' : 's'} done` : '',
    settled ? `${settled} question${settled === 1 ? '' : 's'} settled` : '',
  ].filter(Boolean);
  return `Follow-up: ${parts.join(', ') || 'nothing marked'}\n\n${OPEN}${JSON.stringify(m)}${CLOSE}`;
}

/** Each reader's mark comment, by login. */
export function followMarks(list: Comment[]): Map<string, { commentId: string; mark: FollowMark }> {
  const out = new Map<string, { commentId: string; mark: FollowMark }>();
  for (const c of list) {
    const m = decodeFollow(c.body);
    if (m) out.set(c.author.login, { commentId: c.id, mark: m });
  }
  return out;
}

/** A mark's stamp for people: local date and minute. */
export function fmtStamp(at: string): string {
  const t = Date.parse(at);
  if (!t) return at;
  return new Date(t).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

/** The shared state: for each item, the latest entry across all readers. */
export function followState(list: Comment[]): Record<string, FollowState> {
  const out: Record<string, FollowState> = {};
  for (const [by, { mark }] of followMarks(list)) {
    for (const [id, e] of Object.entries(mark)) {
      const cur = out[id];
      if (!cur || Date.parse(e.at) > Date.parse(cur.at)) out[id] = { ...e, by };
    }
  }
  return out;
}
