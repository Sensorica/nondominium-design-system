// Shared geometry and colour roles for E Holarchy.
//
// The handoff (E.jsx) drew with its own palette (HO_COL, HO_IC). Here each
// role maps to a design-system token instead; the roles are the same.

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

export const RING_COLOR: Record<Ring | 'sig', string> = {
  id: 'rgb(var(--ndo-brand-ink))',
  rules: 'rgb(var(--ndo-teal-700))',
  inst: 'rgb(var(--ndo-blue-600))',
  slots: 'rgb(var(--ndo-violet-700))',
  sig: 'rgb(var(--ndo-amber-600))'
};

/** Operational state of an item to its dot colour. */
export const ITEM_COLOR: Record<OperationalState, string> = {
  InUse: 'rgb(var(--ndo-blue-600))',
  Available: 'rgb(var(--ndo-teal-700))',
  InMaintenance: 'rgb(var(--ndo-amber-600))',
  InStorage: 'rgb(var(--ndo-gray-500))',
  Reserved: 'rgb(var(--ndo-violet-700))',
  InTransit: 'rgb(var(--ndo-amber-600))',
  PendingValidation: 'rgb(var(--ndo-red-600))'
};

export const itemColor = (s: string): string =>
  ITEM_COLOR[s as OperationalState] ?? 'rgb(var(--ndo-gray-500))';

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
