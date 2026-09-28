// Pairs for the shared prototype layer (modals, flow menu, toasts, onboarding,
// avatars): the pieces every direction imports from `$lib/prototypes/ui`.
// Verified across two contrasting directions, per ISA Phase 9: A Mycelium
// (dark, hand-set palette) and C Instrument (light, design-system tokens).
// Field Notes (B) does mount <FlowMenu /> now (Index.svelte's `.brand` row,
// label="Flows"), but this file still only covers A and C: two contrasting
// palettes (dark hand-set vs. light design-system tokens) already exercise
// every modal in the shared kit once each, and B's own field-notes.ts pairs
// cover the same modals again from its own header. Adding a third copy here
// would triple the run time for no new coverage.
//
// Every modal opens through the FlowMenu, exactly as in ui.jsx: click "Menu",
// then the item. Both directions default to the CNC machine ('sol') selected,
// so the NDO-scoped section of the menu is present on first load in both.
//
// Named cause behind every raised threshold below (ISA Phase 9, claim 39).
// Both originals link Google Fonts at runtime; this sandbox does have
// outbound network (a direct request to fonts.googleapis.com succeeds, and
// the compare harness's own Chrome gets real 200s for the CSS and every
// woff2 file), so the original renders its actual Google-served build of the
// family while the port renders the self-hosted @fontsource build of the
// same family (ISA Phase 9 D9): two different binaries for the same face,
// not a missing font. Layout, colour and position are unaffected (verified
// directly: after fixing the shared kit's inherited line-height, below, the
// menu's items land at the same y-coordinate on both sides); what remains is
// glyph-level anti-aliasing noise, spread evenly across every character of
// every text-bearing pair. Every pair here now measures 0.2-0.65% (`bun run
// compare:prototypes shared`); the 4-11% range a prior pass reported here
// was the shared kit's own line-height bug (fixed), not this font-pipeline
// difference.
const FONT_RENDERING_NOTE =
  'Text renders through two different binaries of the same font family here (the original\'s actual Google-served build vs. the port\'s self-hosted @fontsource build, ISA Phase 9 D9), so anti-aliasing differs per glyph across the whole pair even though layout, colour and copy match on inspection.';

import type { Pair } from '../pairs';

const slug = 'shared';
const MENU = 'button:has-text("Menu")';

const myceliumOriginal = 'A%20Mycelium.html';
const myceliumPort = '/prototypes/mycelium';
const instrumentOriginal = 'C%20Instrument.html';
const instrumentPort = '/prototypes/instrument';

const viaMenu = (item: string) => [{ click: MENU }, { click: item }] as const;

/** A modal/menu pair, thresholded and annotated with the font-rendering cause
 *  above; `extra` names anything ALSO different for that specific pair. */
function modalPair(
  name: string,
  threshold: number,
  original: Pair['original'],
  port: Pair['port'],
  extra?: string
): Pair {
  return {
    slug,
    name,
    original,
    port,
    threshold,
    note: extra ? `${extra} Also: ${FONT_RENDERING_NOTE}` : FONT_RENDERING_NOTE
  };
}

const pairs: Pair[] = [
  // ── Flow menu itself, opened, in both palettes ──
  // The dropdown's keyboard-shortcut tip once read the cross-platform "Ctrl+K
  // (⌘K on a Mac)" against ui.jsx's Mac-only "Tip: press ⌘K to open this
  // menu"; FlowMenu.svelte's tip is now that exact string, verbatim, so
  // these two pairs carry no `extra` note any more.
  modalPair(
    'menu-mycelium',
    0.01,
    { path: myceliumOriginal, steps: [{ click: MENU }] },
    { path: myceliumPort, steps: [{ click: MENU }] }
  ),
  modalPair(
    'menu-instrument',
    0.01,
    { path: instrumentOriginal, steps: [{ click: MENU }] },
    { path: instrumentPort, steps: [{ click: MENU }] }
  ),

  // ── Modals reached from mycelium ──
  modalPair(
    'help',
    0.01,
    { path: myceliumOriginal, steps: viaMenu('text=How this works') },
    { path: myceliumPort, steps: viaMenu('text=How this works') }
  ),
  modalPair(
    'profile',
    0.01,
    { path: myceliumOriginal, steps: viaMenu('text=Your profile') },
    { path: myceliumPort, steps: viaMenu('text=Your profile') }
  ),
  modalPair(
    'group',
    0.01,
    { path: myceliumOriginal, steps: viaMenu('text=+ Create a group') },
    { path: myceliumPort, steps: viaMenu('text=+ Create a group') }
  ),
  modalPair(
    'join',
    0.01,
    { path: myceliumOriginal, steps: viaMenu('text=→ Join a group with a link') },
    { path: myceliumPort, steps: viaMenu('text=→ Join a group with a link') }
  ),
  modalPair(
    'create',
    0.01,
    { path: myceliumOriginal, steps: viaMenu('text=+ Add a shared resource') },
    { path: myceliumPort, steps: viaMenu('text=+ Add a shared resource') }
  ),
  modalPair(
    'browse',
    0.01,
    { path: myceliumOriginal, steps: viaMenu('text=Find resources') },
    { path: myceliumPort, steps: viaMenu('text=Find resources') }
  ),
  modalPair(
    'receipts',
    0.01,
    { path: myceliumOriginal, steps: viaMenu('text=/^Your receipts ·/') },
    { path: myceliumPort, steps: viaMenu('text=/^Your receipts ·/') }
  ),
  modalPair(
    'advance',
    0.01,
    { path: myceliumOriginal, steps: viaMenu('text=Change its stage') },
    { path: myceliumPort, steps: viaMenu('text=Change its stage') }
  ),
  modalPair(
    'rule',
    0.01,
    { path: myceliumOriginal, steps: viaMenu('text=Add a rule') },
    { path: myceliumPort, steps: viaMenu('text=Add a rule') }
  ),
  modalPair(
    'why',
    0.01,
    {
      path: myceliumOriginal,
      steps: [{ click: 'text=/Signals/' }, { click: 'text=why am I seeing this?' }]
    },
    {
      path: myceliumPort,
      steps: [{ click: 'text=/Signals/' }, { click: 'text=why am I seeing this?' }]
    }
  ),

  // ── Modals reached from instrument ──
  modalPair(
    'resources',
    0.01,
    { path: instrumentOriginal, steps: viaMenu('text=Items and who holds them') },
    { path: instrumentPort, steps: viaMenu('text=Items and who holds them') }
  ),
  modalPair(
    'commit',
    0.01,
    { path: instrumentOriginal, steps: viaMenu('text=Ask to borrow or receive') },
    { path: instrumentPort, steps: viaMenu('text=Ask to borrow or receive') }
  ),
  modalPair(
    'commitments',
    0.01,
    { path: instrumentOriginal, steps: viaMenu('text=Requests on this resource') },
    { path: instrumentPort, steps: viaMenu('text=Requests on this resource') }
  ),
  modalPair(
    'commitments-all',
    0.01,
    { path: instrumentOriginal, steps: viaMenu('text=/^Requests ·/') },
    { path: instrumentPort, steps: viaMenu('text=/^Requests ·/') }
  ),
  modalPair(
    'attach',
    0.01,
    { path: instrumentOriginal, steps: viaMenu('text=Link to another resource') },
    { path: instrumentPort, steps: viaMenu('text=Link to another resource') }
  ),
  modalPair(
    'note',
    0.01,
    { path: instrumentOriginal, steps: viaMenu('text=Log work') },
    { path: instrumentPort, steps: viaMenu('text=Log work') }
  ),

  // ── Onboarding, first step (?fresh=1: no profile, no groups) ──
  modalPair(
    'onboarding-profile',
    0.01,
    { path: instrumentOriginal + '?fresh=1' },
    { path: instrumentPort + '?fresh=1' }
  ),

  // ── Toasts: the write lifecycle, caught mid-flight ──
  // Both sides run the same setTimeout schedule (signed at 0, gossip at 700ms,
  // validated at 2600ms) under the same seeded Math.random, so a 900ms wait
  // after submitting lands solidly inside the wide (700-2600ms) gossip window
  // on both sides.
  modalPair(
    'toast-gossip',
    0.01,
    {
      path: instrumentOriginal,
      steps: [
        ...viaMenu('text=Log work'),
        { fill: ['textarea', 'Recorded for the comparison harness.'] },
        { click: 'text=Sign & log' },
        { wait: 900 }
      ]
    },
    {
      path: instrumentPort,
      steps: [
        ...viaMenu('text=Log work'),
        { fill: ['textarea', 'Recorded for the comparison harness.'] },
        { click: 'text=Sign & log' },
        { wait: 900 }
      ]
    }
  )
];

export default pairs;
