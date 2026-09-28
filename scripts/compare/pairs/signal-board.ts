// Pairs for the signal-board direction. The builder of this direction owns this file:
// one pair per view, per modal and per state a reviewer would compare.
import type { Pair } from '../pairs';

const slug = 'signal-board';
const original = 'D%20Signal%20Board.html';

// The click target the original and the port share for the "CNC Machine ·
// Proxxon MF70" card (ndo id `sol`): its res line is unique on the board and
// bubbles to the card's own onclick in both apps.
const solCard = 'text=CNC Machine · Proxxon MF70';

// A specific board card's own dashed "why" footer, reached without opening
// the drawer first: D.jsx's why link lives on the card, not on the drawer.
const maintenanceWhy =
  'article:has-text("Scheduled maintenance · CEM-3000") >> text=Why am I seeing this?';

// App.svelte used to wrap "+ Add resource", "+ Group" and the FlowMenu
// button in a port-only `.adds` div with its own 8px gap; D Signal Board.html
// lays all three out as direct header children under the header's own 16px
// gap (the reviewer's reading: "+ Group" at x=751 vs the port's x=759, "Menu"
// at x=835 vs x=851). Fixed by making them header children again, with a
// `.first` class carrying the "+ Add resource" button's extra 12px
// marginLeft. scripts/verify/signal-board-bbox.ts now measures both buttons
// (and six more text runs across the header and the board) at 0px apart on
// both sides, re-run three times for stability.
//
// The remaining difference is glyph-level: the original's Google-Fonts-served
// static "Bricolage Grotesque" and the self-hosted variable instance
// (@fontsource-variable/bricolage-grotesque) are different font binaries for
// the same face, so their hinted outlines rasterize a few pixels apart at
// small sizes across a page this dense with text. `default`/`hover` measured
// 2.36% and `drawer` 2.80% across three consecutive runs (stable, not
// flaky); their ceilings sit exactly 0.5 point above that (ISA D11).
const FONT_HINTING = {
  note: 'Font hinting: different binaries for the same face (Google-served static vs. self-hosted variable) rasterize glyph edges a few pixels apart across a text-dense board. Every text run boundingBox()-measured (scripts/verify/signal-board-bbox.ts) lands at 0px apart on both sides, so the remainder is rasterization, not layout.'
};

const pairs: Pair[] = [
  {
    slug,
    name: 'default',
    threshold: 0.0286,
    original: { path: original },
    port: { path: '/prototypes/signal-board' },
    ...FONT_HINTING
  },
  {
    slug,
    name: 'drawer',
    threshold: 0.033,
    original: { path: original, steps: [{ click: solCard }] },
    port: { path: '/prototypes/signal-board?view=drawer&ndo=sol' },
    ...FONT_HINTING
  },
  {
    slug,
    name: 'why',
    original: { path: original, steps: [{ click: maintenanceWhy }] },
    port: { path: '/prototypes/signal-board', steps: [{ click: maintenanceWhy }] }
  },
  {
    slug,
    name: 'hover',
    threshold: 0.0286,
    original: { path: original, steps: [{ hover: solCard }] },
    port: { path: '/prototypes/signal-board', steps: [{ hover: solCard }] },
    ...FONT_HINTING
  }
];

export default pairs;
