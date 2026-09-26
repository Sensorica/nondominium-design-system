// Pure geometry for the Mycelium field (A.jsx `fieldPositions` and the
// viewBox rule in `MyField`), kept apart from the components so it is easy to
// read and to test.
import type { Ndo, Trace } from '../../store/logic';

export type Placed = Ndo & { x: number; y: number };

/** Seeded NDOs keep their hand-placed positions; any number of new ones go on
 *  a golden-angle spiral. Computed over every NDO, before any group filter, so
 *  a node does not move when the scope changes. */
export function fieldPositions(ndos: readonly Ndo[]): Placed[] {
  let k = 0;
  return ndos.map((n) => {
    if (n.x != null && n.y != null) return n as Placed;
    const a = k++ * 2.39996;
    const r = 60 + 48 * Math.sqrt(k);
    return { ...n, x: 430 + Math.cos(a) * r * 1.3, y: 400 + Math.sin(a) * r };
  });
}

/** The viewBox grows to fit every node shown, never smaller than the
 *  handoff's 836 × 764 canvas. */
export function fieldViewBox(nodes: readonly Placed[]): string {
  if (!nodes.length) return '0 0 836 764';
  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const x = Math.min(60, Math.min(...xs) - 90);
  const y = Math.min(80, Math.min(...ys) - 110);
  const w = Math.max(836, Math.max(...xs) + 110 - x);
  const h = Math.max(764, Math.max(...ys) + 110 - y);
  return `${x} ${y} ${w} ${h}`;
}

/** Node radius from heat. */
export const nodeRadius = (heat: number) => 8 + Math.min(26, heat * 7);

/** The curved trail between two nodes. */
export function trailPath(a: { x: number; y: number }, b: { x: number; y: number }): string {
  const mx = (a.x + b.x) / 2 + (a.y - b.y) * 0.18;
  const my = (a.y + b.y) / 2 + (b.x - a.x) * 0.18;
  return `M${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

/** The panel's activity bars: 14 buckets of two days, oldest first, so the
 *  row reads fading → fresh over 28 days. */
export function activityBars(traces: readonly Trace[]): number[] {
  return Array.from({ length: 14 }, (_, i) => traces.filter((t) => Math.floor(t.ago / 1440 / 2) === 13 - i).length);
}

/** The three field modes and the trail kinds each one shows. */
export const MODES = {
  Trails: ['use', 'hard', 'cite'],
  Custody: ['use'],
  Citations: ['cite', 'hard']
} as const;
export type Mode = keyof typeof MODES;
