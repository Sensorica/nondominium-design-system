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
    note: TEXT_NOTE
    // The shared-layer focus-ring difference this pair used to carry at a
    // 1.2% ceiling (proto.css's `.pu-input:focus` drew a border-color +
    // box-shadow ring on BrowseModal's autofocused search input; ui.jsx's
    // pInput sets only `outline:'none'`, no `:focus` rule anywhere) is fixed
    // (src/lib/prototypes/ui/proto.css, ISA Phase 9 finding 6). Measured
    // 0.65% across two consecutive runs, back under the 1% default.
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
