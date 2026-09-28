// Pairs for the mycelium direction. The builder of this direction owns this file:
// one pair per view, per modal and per state a reviewer would compare.
//
// The original keeps every screen in React state (`view`, `sel`, `m`), so it
// is reached with click steps from its bare URL. The port encodes the four
// rail views in `?view=`; everything else (which NDO is selected, which
// modal is open) is reached with the same click steps, since neither side
// persists modal state in the URL.
//
// Every modal in ui.jsx's ModalHost is covered once: create, attach, note,
// advance, rule, resources, commit, commitments, profile, group, join,
// browse, receipts, help, why. The default NDO on both sides is 'sol' (the
// CNC machine), so a step that opens a per-NDO modal needs no prior click to
// select it.
//
// D11 (ISA Phase 9): default ceiling is 1%; anything higher needs
// boundingBox() proof and sits at most 0.5 point above the measured value.
// The previous wave of thresholds here (0.03 to 0.105, set before the shared
// ui/** modals were brought to ui.jsx's exact field names — commit 4e4d299)
// is stale: every one of those copy divergences (RuleModal's raw field
// names, ResourcesModal's "New resource" hint, NoteModal's "next agent",
// AttachModal's "NdoLinkType", CommitModal's "VfAction"/"Propose",
// CommitmentsModal's "+ Propose commitment", AdvanceModal's "Initiator:",
// ProfileModal's raw RoleType and zome-call section headers) has since been
// re-verified field by field against ui.jsx: none of it remains, and every
// pair now measures 0.3% to 1.0% (`bun run compare:prototypes mycelium`,
// ORIG_PORT=8797), all font-hinting/antialiasing noise on small dark-mode
// Instrument Sans text.
import type { Pair } from '../pairs';

const slug = 'mycelium';
const original = 'A%20Mycelium.html';
const port = '/prototypes/mycelium';

// The panel's proportional-width Instrument Sans text reflows a few pixels
// between the moment fonts are requested and the moment they paint; a longer
// settle keeps both sides past that reflow, even though the harness already
// waits on `document.fonts.ready`.
const FONT_WAIT = 1000;

const TEXT_NOTE =
  'Font-hinting/antialiasing noise on small dark-mode Instrument Sans text; copy checked field by field against A.jsx/ui.jsx, no divergence found.';

const pairs: Pair[] = [
  // ── Views (ISA claim 39) ──
  {
    slug,
    name: 'field',
    original: { path: original, settle: FONT_WAIT },
    port: { path: port, settle: FONT_WAIT },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'signals',
    original: { path: original, steps: [{ click: '.rail >> text=Signals' }], settle: FONT_WAIT },
    port: { path: `${port}?view=signals`, settle: FONT_WAIT },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'traces',
    original: { path: original, steps: [{ click: '.rail >> text=Traces' }], settle: FONT_WAIT },
    port: { path: `${port}?view=traces`, settle: FONT_WAIT },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'you',
    original: { path: original, steps: [{ click: '.rail >> text=You' }], settle: FONT_WAIT },
    port: { path: `${port}?view=you`, settle: FONT_WAIT },
    note: TEXT_NOTE
  },

  // ── Hover states ──
  {
    slug,
    name: 'rail-hover',
    original: { path: original, steps: [{ hover: '.rail >> text=Traces' }] },
    port: { path: port, steps: [{ hover: '.rail >> text=Traces' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'declare-hover',
    original: { path: original, steps: [{ hover: 'text=+ Declare NDO' }] },
    port: { path: port, steps: [{ hover: 'text=+ Declare NDO' }] },
    note: TEXT_NOTE
  },

  // ── Direction-specific modals (ui.jsx's ModalHost, one per `m.type`) ──
  {
    slug,
    name: 'modal-create',
    original: { path: original, steps: [{ click: 'text=+ Declare NDO' }] },
    port: { path: port, steps: [{ click: 'text=+ Declare NDO' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-advance',
    original: { path: original, steps: [{ click: 'button:has-text("Lifecycle")' }] },
    port: { path: port, steps: [{ click: 'button:has-text("Lifecycle")' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-resources',
    original: { path: original, steps: [{ click: 'button:has-text("Items & holders")' }] },
    port: { path: port, steps: [{ click: 'button:has-text("Items & holders")' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-rule',
    original: { path: original, steps: [{ click: 'button:has-text("+ Rule")' }] },
    port: { path: port, steps: [{ click: 'button:has-text("+ Rule")' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-commitments',
    original: { path: original, steps: [{ click: 'button:has-text("Requests")' }] },
    port: { path: port, steps: [{ click: 'button:has-text("Requests")' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-note',
    original: { path: original, steps: [{ click: 'button:has-text("Log work")' }] },
    port: { path: port, steps: [{ click: 'button:has-text("Log work")' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-attach',
    original: { path: original, steps: [{ click: 'text=+ link resource' }] },
    port: { path: port, steps: [{ click: 'text=+ link resource' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-group',
    original: { path: original, steps: [{ click: '.top >> text=+ Group' }] },
    port: { path: port, steps: [{ click: '.top >> text=+ Group' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-join',
    original: { path: original, steps: [{ click: '.top >> text=→ Join' }] },
    port: { path: port, steps: [{ click: '.top >> text=→ Join' }] },
    note: TEXT_NOTE
  },
  // The rest of ModalHost's types are, in the handoff, reachable only
  // through FlowMenu, which itself only renders on the field view (see the
  // inventory): open it, then its item.
  {
    slug,
    name: 'modal-commit',
    original: {
      path: original,
      steps: [{ click: 'text=Menu' }, { click: 'text=Ask to borrow or receive' }]
    },
    port: {
      path: port,
      steps: [{ click: 'text=Menu' }, { click: 'text=Ask to borrow or receive' }]
    },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-browse',
    original: { path: original, steps: [{ click: 'text=Menu' }, { click: 'text=Find resources' }] },
    port: { path: port, steps: [{ click: 'text=Menu' }, { click: 'text=Find resources' }] },
    threshold: 0.012,
    note:
      TEXT_NOTE +
      ' Additionally, a real (not stale) shared-layer difference: BrowseModal’s search input autofocuses on both sides (matching ui.jsx’s own `autoFocus`), but proto.css’s `.pu-input:focus` (src/lib/prototypes/ui/proto.css, out of this direction’s scope) draws a visible border-color + box-shadow focus ring, while ui.jsx’s inline `pInput` sets `outline:’none’` with no `:focus` rule at all — the original never shows a focus indicator on any autofocused field. Reported, not fixed here.'
  },
  {
    slug,
    name: 'modal-receipts',
    original: {
      path: original,
      steps: [{ click: 'text=Menu' }, { click: 'text=Your receipts' }]
    },
    port: { path: port, steps: [{ click: 'text=Menu' }, { click: 'text=Your receipts' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-profile',
    original: { path: original, steps: [{ click: 'text=Menu' }, { click: 'text=Your profile' }] },
    port: { path: port, steps: [{ click: 'text=Menu' }, { click: 'text=Your profile' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-help',
    original: { path: original, steps: [{ click: 'text=Menu' }, { click: 'text=How this works' }] },
    port: { path: port, steps: [{ click: 'text=Menu' }, { click: 'text=How this works' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-why',
    original: { path: original, steps: [{ click: 'text=why am I seeing this?' }] },
    port: { path: port, steps: [{ click: 'text=why am I seeing this?' }] },
    note: TEXT_NOTE
  }
];

export default pairs;
