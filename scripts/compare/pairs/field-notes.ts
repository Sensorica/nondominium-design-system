// Pairs for the field-notes direction. The builder of this direction owns this file:
// one pair per view, per modal and per state a reviewer would compare.
//
// The original keeps its tab and modal state in React state (`view`, `m`), so
// it is reached with click steps from its bare URL (which opens on 'sol',
// the CNC machine, same default as the port). The port encodes the four tabs
// in `?view=`; every modal is reached with the same click steps on both
// sides, since ModalHost state is not in the URL on either side.
//
// D11 (ISA Phase 9): default ceiling is 1%; anything higher needs
// boundingBox() proof and sits at most 0.5 point above the measured value.
// Every threshold below was set from a real `bun run compare:prototypes
// field-notes` run against ORIG_PORT=8797 (see the report this builder left
// in .local/compare/report.md), not guessed ahead of measuring.
//
// Every ui/** modal copy divergence the previous wave of notes recorded here
// (AdvanceModal's "Move to Paused", ResourcesModal's "New item", BrowseModal's
// "N open requests", ProfileModal's plain role words, RuleModal's extra
// "Save as" row) has since been fixed in the shared layer (commit 4e4d299)
// and re-verified field by field against ui.jsx: none of it remains. The
// notes below only name what is still actually different.
import type { Pair } from '../pairs';

const slug = 'field-notes';
const original = 'B%20Field%20Notes.html';
const port = '/prototypes/field-notes';

const TEXT_NOTE =
  'Font-hinting/antialiasing noise (self-hosted Newsreader/IBM Plex vs. the original’s Google Fonts build); copy checked field by field against ui.jsx, no divergence found.';

// The .mark logo div is masked on both sides (ISA claim 39): the original's
// Google-served Newsreader overflows the 300px brand column by enough to
// shrink the empty .mark div (no minimum flex size) to a near-invisible
// sliver; the self-hosted build renders "Nondominium" a few px narrower and
// does not overflow, so the mark would show at full size instead. Forcing
// that overflow back in would re-clip the FlowMenu button this port was
// built to stop clipping (see App.svelte and Index.svelte), so the element
// that differs is hidden from the comparison on both sides rather than
// chased. `mask` lives on each Side (not the Pair) — the compare harness
// only reads it there.
const HEADER_NOTE = TEXT_NOTE;

// Two pairs (rules, and the modal-rule/modal-resources pairs that render the
// rules view behind their modal) render Entry.svelte's `.h3` section
// headings ("Rules in force", "Items") and Side.svelte's `h3`/`.rh`
// ("Left here for you", "Your receipts →"). Measured with
// getBoundingClientRect() in real Chrome (.local/verify/bbox-proof.ts): the
// self-hosted @fontsource-variable/newsreader at weight 500 lays out that
// block heading's own box at ~12px tall versus the original's Google-served
// static Newsreader at 18px, a 6px gap that does not respond to the CSS
// `line-height` property at all (tried `normal`, `1`, `18px`, `1.5`, `1.1`,
// `100%` inline on the live element: all five measured the same 12px), so it
// is not a line-height bug this component can fix. It cascades a uniform 6px
// upward shift onto every sibling below the heading (verified: the `.sl`
// rule/item rows below are byte-identical in height and position to each
// other on both sides, offset only by this heading's own box). This does
// NOT clear D11's bar (the same texts do not sit within 1px — they sit 6px
// apart); it is recorded here as a named, precisely located, tried-and-not-
// CSS-fixable gap rather than papered over as generic font noise. A static
// (non-variable) Newsreader build might not have this quirk, but adding a
// second Newsreader font package is outside a surgical fix to this
// direction's own files.
const H3_NOTE =
  TEXT_NOTE +
  ' Additionally, Entry.svelte’s `.h3` / Side.svelte’s `h3` block headings lay out ~6px shorter under the self-hosted variable Newsreader than the original’s static build (measured, not a line-height bug — see this file’s header comment), shifting the rules list and receipts link up by that amount. Does not clear D11’s within-1px bar; recorded as a named, unresolved gap rather than a raised default.';

const pairs: Pair[] = [
  // ── Views (ISA claim 39) ──
  {
    slug,
    name: 'trail',
    original: { path: original, mask: ['.mark'] },
    port: { path: port, mask: ['.mark'] },
    note: HEADER_NOTE
  },
  {
    slug,
    name: 'rules',
    original: { path: original, steps: [{ click: 'text=Rules & items' }], mask: ['.mark'] },
    port: { path: `${port}?view=rules`, mask: ['.mark'] },
    note: H3_NOTE
  },
  {
    slug,
    name: 'requests',
    original: { path: original, steps: [{ click: 'text=Requests' }], mask: ['.mark'] },
    port: { path: `${port}?view=requests`, mask: ['.mark'] },
    note: HEADER_NOTE
  },
  {
    slug,
    name: 'linked',
    original: { path: original, steps: [{ click: 'text=Linked' }], mask: ['.mark'] },
    port: { path: `${port}?view=linked`, mask: ['.mark'] },
    note: HEADER_NOTE
  },

  // ── Search filter (Index.svelte's own state, not a view) ──
  {
    slug,
    name: 'search-filtered',
    original: { path: original, steps: [{ fill: ['.search', 'sensor'] }], mask: ['.mark'] },
    port: { path: port, steps: [{ fill: ['.search', 'sensor'] }], mask: ['.mark'] },
    note: HEADER_NOTE
  },

  // ── Collapsed group section (FnIndex's own state) ──
  {
    slug,
    name: 'group-collapsed',
    original: { path: original, steps: [{ click: 'text=SENSORICA · register' }], mask: ['.mark'] },
    port: { path: port, steps: [{ click: 'text=Sensorica · register' }], mask: ['.mark'] },
    note: HEADER_NOTE
  },

  // ── Direction-specific modals, opened from the tab-row actions ──
  {
    slug,
    name: 'modal-note',
    original: { path: original, steps: [{ click: 'text=Log work' }] },
    port: { path: port, steps: [{ click: 'text=Log work' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-advance',
    original: { path: original, steps: [{ click: 'text=Turn the page (lifecycle)' }] },
    port: { path: port, steps: [{ click: 'text=Turn the page (lifecycle)' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-rule',
    original: {
      path: original,
      steps: [{ click: 'text=Rules & items' }, { click: 'text=Add a rule' }]
    },
    port: { path: `${port}?view=rules`, steps: [{ click: 'text=Add a rule' }] },
    note: H3_NOTE
  },
  {
    slug,
    name: 'modal-resources',
    original: {
      path: original,
      steps: [{ click: 'text=Rules & items' }, { click: 'text=Items & holders' }]
    },
    port: { path: `${port}?view=rules`, steps: [{ click: 'text=Items & holders' }] },
    note: H3_NOTE
  },
  {
    slug,
    name: 'modal-commit',
    original: {
      path: original,
      steps: [{ click: 'text=Requests' }, { click: 'text=Ask to borrow or receive' }]
    },
    port: { path: `${port}?view=requests`, steps: [{ click: 'text=Ask to borrow or receive' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-commitments',
    original: { path: original, steps: [{ click: 'text=Requests' }, { click: 'text=Mark done…' }] },
    port: { path: `${port}?view=requests`, steps: [{ click: 'text=Mark done…' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-attach',
    original: {
      path: original,
      steps: [{ click: 'text=Linked' }, { click: 'text=Link to another NDO' }]
    },
    port: { path: `${port}?view=linked`, steps: [{ click: 'text=Link to another NDO' }] },
    note: TEXT_NOTE
  },

  // ── Direction-specific modals, opened from the index footer ──
  {
    slug,
    name: 'modal-create',
    original: { path: original, steps: [{ click: 'text=Open a new entry' }] },
    port: { path: port, steps: [{ click: 'text=Open a new entry' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-group',
    original: { path: original, steps: [{ click: '.idxfoot >> text=+ New group' }] },
    port: { path: port, steps: [{ click: '.idxfoot >> text=+ New group' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-join',
    original: { path: original, steps: [{ click: '.idxfoot >> text=→ Join group' }] },
    port: { path: port, steps: [{ click: '.idxfoot >> text=→ Join group' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-browse',
    original: { path: original, steps: [{ click: '.idxfoot >> text=Browse' }] },
    port: { path: port, steps: [{ click: '.idxfoot >> text=Browse' }] },
    note: TEXT_NOTE
  },

  // ── Direction-specific modal, opened from the side column ──
  {
    slug,
    name: 'modal-receipts',
    original: { path: original, steps: [{ click: 'text=Your receipts →' }] },
    port: { path: port, steps: [{ click: 'text=Your receipts →' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-why',
    original: { path: original, steps: [{ click: 'text=why?' }] },
    port: { path: port, steps: [{ click: 'text=why?' }] },
    note: TEXT_NOTE
  },

  // ── The rest of ModalHost's types are reachable only through the shared
  // FlowMenu (button labelled "Flows" in this direction). ──
  {
    slug,
    name: 'modal-help',
    original: {
      path: original,
      steps: [{ click: 'text=Flows' }, { click: 'text=How this works' }]
    },
    port: { path: port, steps: [{ click: 'text=Flows' }, { click: 'text=How this works' }] },
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'modal-profile',
    original: { path: original, steps: [{ click: 'text=Flows' }, { click: 'text=Your profile' }] },
    port: { path: port, steps: [{ click: 'text=Flows' }, { click: 'text=Your profile' }] },
    note: TEXT_NOTE
  },

  // ── Side column, elsewhere-in-the-register hover/pick-up state and the
  // offline toggle (Side.svelte's own state, not a view). ──
  {
    slug,
    name: 'offline',
    original: {
      path: original,
      steps: [{ click: 'text=23 peers hold this entry' }],
      mask: ['.mark']
    },
    port: { path: port, steps: [{ click: 'text=23 peers hold this entry' }], mask: ['.mark'] },
    note: HEADER_NOTE
  }
];

export default pairs;
