// Shared geometry and colour roles for E Holarchy.
//
// ISA Phase 9, D8: A to E carry their original palettes, scoped to the
// direction root. The handoff (E.jsx) drew with its own literal palette
// (HO_COL, HO_IC); these are the same hex values, not design-system tokens.

import type { OperationalState } from '$lib/prototypes/store/logic';

/** n points evenly spaced on a circle of radius r, starting at angle `off`. */
export function ringPts(n: number, r: number, off = -Math.PI / 2): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const a = off + (i * 2 * Math.PI) / Math.max(1, n);
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
}

/** The four rings of an NDO, plus the attention colour. */
export type Ring = 'id' | 'rules' | 'inst' | 'slots';

/** E.jsx's HO_COL, verbatim. */
export const RING_COLOR: Record<Ring | 'sig', string> = {
  id: '#0F1A2A',
  rules: '#22B3A6',
  inst: '#3F6FDB',
  slots: '#7C55E6',
  sig: '#E5A52A'
};

/** E.jsx's HO_IC, verbatim: operational state to its dot colour. */
export const ITEM_COLOR: Record<OperationalState, string> = {
  InUse: '#3F6FDB',
  Available: '#22B3A6',
  InMaintenance: '#E5A52A',
  InStorage: '#8592A3',
  Reserved: '#7C55E6',
  InTransit: '#E5A52A',
  PendingValidation: '#D8452F'
};

export const itemColor = (s: string): string => ITEM_COLOR[s as OperationalState] ?? '#8592A3';

/** Stages drawn with a dashed outline: nothing is happening on them. */
export const QUIET_STAGES: readonly string[] = [
  'Ideation',
  'Hibernating',
  'Deprecated',
  'EndOfLife'
];

export const clip = (s: string, max: number): string =>
  s.length > max ? s.slice(0, max - 1) + '…' : s;

/** Enter or Space activates an SVG element acting as a button. */
export function activate(fn: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };
}
