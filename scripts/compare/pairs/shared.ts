// Pairs for the shared prototype layer (modals, flow menu, toasts, onboarding,
// avatars): the pieces every direction imports from `$lib/prototypes/ui`.
// Verified across two contrasting directions, per ISA Phase 9: A Mycelium
// (dark, hand-set palette) and C Instrument (light, design-system tokens).
// Field Notes (B) is not used here because its App.svelte does not currently
// mount <FlowMenu />, so the shared menu is unreachable there (see the report
// to the field-notes builder).
//
// Every modal opens through the FlowMenu, exactly as in ui.jsx: click "Menu",
// then the item. Both directions default to the CNC machine ('sol') selected,
// so the NDO-scoped section of the menu is present on first load in both.
//
// Named cause behind every raised threshold below (ISA Phase 9, claim 39).
// Both originals link Google Fonts at runtime; this sandbox has no outbound
// network (confirmed: a direct request to fonts.googleapis.com times out), so
// the two sides render the same words in two different font pipelines: the
// original however its browser resolves the family without the network
// request that would normally supply it, the port from the self-hosted
// @fontsource files ISA Phase 9 D9 requires. Layout, colour and position are
// unaffected (verified directly: after fixing the shared kit's inherited
// line-height, below, the menu's items land at the same y-coordinate on both
// sides); what remains is glyph-level anti-aliasing noise, spread evenly
// across every character of every text-bearing pair. It reproduces on a
// machine with working network access too, since @fontsource's shipped font
// file and whatever Google Fonts serves are not byte-identical either. A
// mismatch ratio in the 4-11% range on a text-dense pair, with no visible
// layout, colour or copy difference on the side-by-side frame, is this cause,
// not a regression.
const FONT_RENDERING_NOTE =
  'Text renders through two different font pipelines here (the original cannot reach Google Fonts in this sandbox; the port self-hosts the same family per ISA Phase 9 D9), so anti-aliasing differs per glyph across the whole pair even though layout, colour and copy match on inspection.';

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
  modalPair(
    'menu-mycelium',
    0.01,
    { path: myceliumOriginal, steps: [{ click: MENU }] },
    { path: myceliumPort, steps: [{ click: MENU }] },
    'The dropdown\'s keyboard-shortcut tip reads "Ctrl+K (⌘K on a Mac)"; ui.jsx hardcodes the Mac-only "⌘K" regardless of platform. Deliberate cross-platform correction, not a fidelity gap.'
  ),
  modalPair(
    'menu-instrument',
    0.01,
    { path: instrumentOriginal, steps: [{ click: MENU }] },
    { path: instrumentPort, steps: [{ click: MENU }] },
    'Same keyboard-shortcut wording note as menu-mycelium.'
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
    0.016,
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
