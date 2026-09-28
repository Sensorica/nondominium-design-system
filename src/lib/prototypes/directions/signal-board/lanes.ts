// The three derived lanes of the Signal Board, in board order. Every signal
// carries its lane (`hands`, `avail`, `eyes`) from deriveSignals in the shared
// store; this file only names and colours them. Colours are the original
// D · Signal Board palette (custom properties declared on the direction root
// in App.svelte: --amber, --teal, --violet, --blue and their *bg tints), used
// as `var(--amber)` / `var(--amberbg)` and so on.
import type { Signal } from '$lib/prototypes/store/logic';

export type LaneId = Signal['lane'];

export interface Lane {
  id: LaneId;
  label: string;
  /** The lane's dot colour and signal-strength colour (original --amber/--teal/--violet). */
  tone: string;
  /** The card's solid tint background when it is not cold (original --amberbg/--tealbg/--violetbg). */
  bg: string;
}

export const LANES: readonly Lane[] = [
  { id: 'hands', label: 'Needs hands', tone: 'var(--amber)', bg: 'var(--amberbg)' },
  { id: 'avail', label: 'Available now', tone: 'var(--teal)', bg: 'var(--tealbg)' },
  { id: 'eyes', label: 'Needs eyes', tone: 'var(--violet)', bg: 'var(--violetbg)' }
];

/** The fourth column, activity rather than signals. */
export const HAPPENED_TONE = 'var(--blue)';
export const HAPPENED_BG = 'var(--bluebg)';

/** How recent a trace must be to count as "just happened", in minutes (the
 *  handoff's threshold: about two weeks). */
export const RECENT_MINUTES = 20000;
export const RECENT_MAX = 8;

/** Opacity per freshness, as in D.jsx: cards for the board, rows for the drawer. */
export const CARD_FADE = { fresh: 1, warm: 0.9, fading: 0.7, cold: 0.5 } as const;
export const ROW_FADE = { fresh: 1, warm: 0.9, fading: 0.6, cold: 0.4 } as const;
