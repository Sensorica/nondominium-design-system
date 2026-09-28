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

// Remaining difference is glyph-level: the original's Google-Fonts-served
// static "Bricolage Grotesque" and the self-hosted variable instance
// (@fontsource-variable/bricolage-grotesque) are different font binaries for
// the same face, so their hinted outlines rasterize a few pixels apart at
// small sizes across a page this dense with text. Every colour, layout, wrap
// point and piece of copy has been verified to match by hand (see the
// builder's report).
const FONT_HINTING = {
  note: 'Font hinting: different binaries for the same face (Google-served static vs. self-hosted variable) rasterize glyph edges a few pixels apart across a text-dense board.'
};

const pairs: Pair[] = [
  {
    slug,
    name: 'default',
    threshold: 0.03,
    original: { path: original },
    port: { path: '/prototypes/signal-board' },
    ...FONT_HINTING
  },
  {
    slug,
    name: 'drawer',
    threshold: 0.034,
    original: { path: original, steps: [{ click: solCard }] },
    port: { path: '/prototypes/signal-board?view=drawer&ndo=sol' },
    ...FONT_HINTING
  },
  {
    slug,
    name: 'why',
    original: { path: original, steps: [{ click: maintenanceWhy }] },
    port: { path: '/prototypes/signal-board', steps: [{ click: maintenanceWhy }] },
    ...FONT_HINTING
  },
  {
    slug,
    name: 'hover',
    threshold: 0.03,
    original: { path: original, steps: [{ hover: solCard }] },
    port: { path: '/prototypes/signal-board', steps: [{ hover: solCard }] },
    ...FONT_HINTING
  }
];

export default pairs;
