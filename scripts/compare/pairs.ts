// The (direction, view) pairs `scripts/compare-prototypes.ts` compares. Each
// direction owns one file under `pairs/`; this module only collects them.
//
// A pair names how to reach the same screen on both sides. The original is a
// path under `docs/prototypes/original/prototypes/` plus the clicks that get
// there (the originals keep their views in React state, not in the URL). The
// port is a design-system path, usually a `?view=` URL from `paths.ts`, plus
// any clicks for state that is not a view (an open modal, a hovered card).

import flowGraph from './pairs/flow-graph';
import fieldNotes from './pairs/field-notes';
import holarchy from './pairs/holarchy';
import instrument from './pairs/instrument';
import mycelium from './pairs/mycelium';
import signalBoard from './pairs/signal-board';
import shared from './pairs/shared';
import ds from './pairs/ds';

export type Step =
  | { click: string }
  | { dblclick: string }
  | { hover: string }
  | { fill: [selector: string, value: string] }
  | { press: string }
  | { wheel: number }
  | { wait: number }
  | { eval: string };

export interface Side {
  /** Original: a file under `docs/prototypes/original/prototypes/`, URL-encoded,
   *  with any query string. Port: a path on the design-system server. */
  path: string;
  /** Playwright selectors (`text=…`, CSS, `role=…`) run in order after load. */
  steps?: readonly Step[];
  /** localStorage entries set before the page's own scripts run. */
  storage?: Record<string, string>;
  /** Extra selectors hidden before the frame, for regions that are named
   *  in `note` as legitimately different. */
  mask?: readonly string[];
  /** Milliseconds to wait after load before the steps. Default 800. */
  settle?: number;
}

export interface Pair {
  slug: string;
  /** Unique within the slug; the view id is the usual choice. */
  name: string;
  original: Side;
  port: Side;
  /** Maximum mismatch ratio (0 to 1). Default 0.01. */
  threshold?: number;
  /** Required when `threshold` or a `mask` departs from the default: the named
   *  cause of the remaining difference (ISA Phase 9, claim 39). */
  note?: string;
}

export const PAIRS: readonly Pair[] = [
  ...mycelium,
  ...fieldNotes,
  ...instrument,
  ...signalBoard,
  ...holarchy,
  ...flowGraph,
  ...shared,
  ...ds
];
