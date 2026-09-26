// The three derived lanes of the Signal Board, in board order. Every signal
// carries its lane (`hands`, `avail`, `eyes`) from deriveSignals in the shared
// store; this file only names and colours them. The colour is a design-system
// token triplet, used as `rgb(var(--lane))` and as a tint `rgb(var(--lane) / a)`.
import type { Signal } from '$lib/prototypes/store/logic';

export type LaneId = Signal['lane'];

export interface Lane {
  id: LaneId;
  label: string;
  /** Name of the token holding the RGB triplet. */
  tone: string;
}

export const LANES: readonly Lane[] = [
  { id: 'hands', label: 'Needs hands', tone: '--ndo-amber-600' },
  { id: 'avail', label: 'Available now', tone: '--ndo-teal-700' },
  { id: 'eyes', label: 'Needs eyes', tone: '--ndo-violet-700' }
];

/** The fourth column, activity rather than signals. */
export const HAPPENED_TONE = '--ndo-blue-600';

/** How recent a trace must be to count as "just happened", in minutes (the
 *  handoff's threshold: about two weeks). */
export const RECENT_MINUTES = 20000;
export const RECENT_MAX = 8;

/** Opacity per freshness, as in D.jsx: cards for the board, rows for the drawer. */
export const CARD_FADE = { fresh: 1, warm: 0.9, fading: 0.7, cold: 0.5 } as const;
export const ROW_FADE = { fresh: 1, warm: 0.9, fading: 0.6, cold: 0.4 } as const;
