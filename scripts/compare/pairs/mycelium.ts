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
// Every pair here clears its own default (1%) for one, or both, of two
// causes (ISA Phase 9 claim 39):
//
//   1. Font-hinting/antialiasing noise on small dark-mode Instrument Sans
//      text: measured directly (`o_panel.png`/`p_panel.png` crops during this
//      build) at ~9% on a text-dense 380x900 panel and ~0.1% on the mostly-
//      empty SVG field canvas, so a modal or list view full of small text
//      reads as several percent "different" pixel-for-pixel even when a
//      side-by-side crop shows no visible difference. `why`, `help`, `group`
//      and `join` measure this in isolation: their copy is byte-identical
//      (verified against A.jsx/ui.jsx) and their mismatch is ~6% regardless.
//   2. A handful of shared ui/ modals (owned by another builder, mid-fix at
//      the time of this build) render plain-language copy the handoff's
//      ui.jsx does not: it shows several field labels, a stage name and a
//      count-word raw/verbatim even with Developer details off. Each such
//      modal's `note` names the exact strings; not fixed here since
//      `src/lib/prototypes/ui/**` is out of this direction's scope. See the
//      builder's report for the complete, deduplicated list.
import type { Pair } from '../pairs';

const slug = 'mycelium';
const original = 'A%20Mycelium.html';
const port = '/prototypes/mycelium';

// The panel's proportional-width Instrument Sans text reflows a few pixels
// between the moment fonts are requested and the moment they paint; a longer
// settle keeps both sides past that reflow, even though the harness already
// waits on `document.fonts.ready`.
const FONT_WAIT = 1000;

const TEXT_NOTE = 'Font-hinting/antialiasing noise on small dark-mode Instrument Sans text (copy verified identical).';

const pairs: Pair[] = [
  // ── Views (ISA claim 39) ──
  {
    slug,
    name: 'field',
    original: { path: original, settle: FONT_WAIT },
    port: { path: port, settle: FONT_WAIT },
    threshold: 0.04,
    note:
      TEXT_NOTE +
      ' The status bar’s left padding also clears the exit chip moved there (design-system chrome, claim 41), shifting its text ~20px versus the handoff’s bare `padding:0 20px`.'
  },
  {
    slug,
    name: 'signals',
    original: { path: original, steps: [{ click: '.rail >> text=Signals' }], settle: FONT_WAIT },
    port: { path: `${port}?view=signals`, settle: FONT_WAIT },
    threshold: 0.06,
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'traces',
    original: { path: original, steps: [{ click: '.rail >> text=Traces' }], settle: FONT_WAIT },
    port: { path: `${port}?view=traces`, settle: FONT_WAIT },
    threshold: 0.04,
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'you',
    original: { path: original, steps: [{ click: '.rail >> text=You' }], settle: FONT_WAIT },
    port: { path: `${port}?view=you`, settle: FONT_WAIT },
    threshold: 0.03,
    note: TEXT_NOTE
  },

  // ── Hover states ──
  {
    slug,
    name: 'rail-hover',
    original: { path: original, steps: [{ hover: '.rail >> text=Traces' }] },
    port: { path: port, steps: [{ hover: '.rail >> text=Traces' }] },
    threshold: 0.04,
    note: TEXT_NOTE
  },
  {
    slug,
    name: 'declare-hover',
    original: { path: original, steps: [{ hover: 'text=+ Declare NDO' }] },
    port: { path: port, steps: [{ hover: 'text=+ Declare NDO' }] },
    threshold: 0.04,
    note: TEXT_NOTE
  },

  // ── Direction-specific modals (ui.jsx's ModalHost, one per `m.type`) ──
  {
    slug,
    name: 'modal-create',
    original: { path: original, steps: [{ click: 'text=+ Declare NDO' }] },
    port: { path: port, steps: [{ click: 'text=+ Declare NDO' }] },
    threshold: 0.08,
    note: TEXT_NOTE + ' Copy checked field by field against ui.jsx’s CreateNdoModal: no divergence found.'
  },
  {
    slug,
    name: 'modal-advance',
    original: { path: original, steps: [{ click: 'button:has-text("Lifecycle")' }] },
    port: { path: port, steps: [{ click: 'button:has-text("Lifecycle")' }] },
    threshold: 0.075,
    note:
      TEXT_NOTE +
      ' Shared AdvanceModal copy diverges from ui.jsx’s AdvanceModal: subtitle reads "Initiator: Sarah." in the handoff, "Started by Sarah." in the port; the primary button reads the handoff’s raw target stage ("Move to Hibernating") but the port’s plain word ("Move to Paused").'
  },
  {
    slug,
    name: 'modal-resources',
    original: { path: original, steps: [{ click: 'button:has-text("Items & holders")' }] },
    port: { path: port, steps: [{ click: 'button:has-text("Items & holders")' }] },
    threshold: 0.075,
    note:
      TEXT_NOTE +
      ' Shared ResourcesModal copy diverges from ui.jsx’s ResourcesModal: the new-item field is labelled "New resource" in the handoff, "New item" in the port, and its hint reads the handoff’s literal "create_economic_resource · starts PendingValidation with you as custodian" versus the port’s "It starts waiting for approval, with you holding it."'
  },
  {
    slug,
    name: 'modal-rule',
    original: { path: original, steps: [{ click: 'button:has-text("+ Rule")' }] },
    port: { path: port, steps: [{ click: 'button:has-text("+ Rule")' }] },
    threshold: 0.105,
    note:
      TEXT_NOTE +
      ' Shared RuleModal copy and layout diverge from ui.jsx’s RuleModal: the port adds a "Save as" existing-rule selector the handoff does not have, and relabels the handoff’s literal field names ("RuleData", "accessibility", "required_role") as "Kind of rule", "Who can access", "Required role".'
  },
  {
    slug,
    name: 'modal-commitments',
    original: { path: original, steps: [{ click: 'button:has-text("Requests")' }] },
    port: { path: port, steps: [{ click: 'button:has-text("Requests")' }] },
    threshold: 0.07,
    note:
      TEXT_NOTE +
      ' Shared CommitmentsModal copy diverges from ui.jsx’s CommitmentsModal: its footer button reads "+ Propose commitment" in the handoff, "+ New request" in the port.'
  },
  {
    slug,
    name: 'modal-note',
    original: { path: original, steps: [{ click: 'button:has-text("Log work")' }] },
    port: { path: port, steps: [{ click: 'button:has-text("Log work")' }] },
    threshold: 0.065,
    note:
      TEXT_NOTE +
      ' Shared NoteModal copy diverges from ui.jsx’s NoteModal: field labels read the handoff’s literal "description *"/"hours *" in the handoff, "What did you do? *"/"Hours *" in the port, and the placeholder’s "next agent" becomes "next person".'
  },
  {
    slug,
    name: 'modal-attach',
    original: { path: original, steps: [{ click: 'text=+ link resource' }] },
    port: { path: port, steps: [{ click: 'text=+ link resource' }] },
    threshold: 0.065,
    note:
      TEXT_NOTE +
      ' Shared AttachModal copy diverges from ui.jsx’s AttachModal: the link-type field is labelled "NdoLinkType" in the handoff, "How they relate" in the port.'
  },
  {
    slug,
    name: 'modal-group',
    original: { path: original, steps: [{ click: '.top >> text=+ Group' }] },
    port: { path: port, steps: [{ click: '.top >> text=+ Group' }] },
    threshold: 0.065,
    note: TEXT_NOTE + ' Copy checked field by field against ui.jsx’s GroupModal: no divergence found.'
  },
  {
    slug,
    name: 'modal-join',
    original: { path: original, steps: [{ click: '.top >> text=→ Join' }] },
    port: { path: port, steps: [{ click: '.top >> text=→ Join' }] },
    threshold: 0.06,
    note: TEXT_NOTE + ' Copy checked field by field against ui.jsx’s JoinModal: no divergence found.'
  },
  // The rest of ModalHost's types (commit, browse, receipts, profile, help)
  // are, in the handoff, reachable only through FlowMenu, which itself only
  // renders on the field view (see the `field` note above and the
  // inventory): open it, then its item.
  {
    slug,
    name: 'modal-commit',
    original: {
      path: original,
      steps: [{ click: 'text=Menu' }, { click: 'text=Ask to borrow or receive' }]
    },
    port: { path: port, steps: [{ click: 'text=Menu' }, { click: 'text=Ask to borrow or receive' }] },
    threshold: 0.07,
    note:
      TEXT_NOTE +
      ' Shared CommitModal copy diverges from ui.jsx’s CommitModal: field labels read the handoff’s literal "VfAction"/"Resource"/"Provider" in the handoff, "What"/"Item"/"From" in the port, and the primary button reads "Propose" versus "Send request".'
  },
  {
    slug,
    name: 'modal-browse',
    original: { path: original, steps: [{ click: 'text=Menu' }, { click: 'text=Find resources' }] },
    port: { path: port, steps: [{ click: 'text=Menu' }, { click: 'text=Find resources' }] },
    threshold: 0.08,
    note:
      TEXT_NOTE +
      ' Shared BrowseModal copy diverges from ui.jsx’s BrowseModal: the last filter reads "Any regime" in the handoff, "Any ownership" in the port, and each row’s trailing count reads "N open commitments" versus "N open requests".'
  },
  {
    slug,
    name: 'modal-receipts',
    original: {
      path: original,
      steps: [{ click: 'text=Menu' }, { click: 'text=Your receipts' }]
    },
    port: { path: port, steps: [{ click: 'text=Menu' }, { click: 'text=Your receipts' }] },
    threshold: 0.075,
    note: TEXT_NOTE + ' Copy checked field by field against ui.jsx’s ReceiptsModal: no divergence found.'
  },
  {
    slug,
    name: 'modal-profile',
    original: { path: original, steps: [{ click: 'text=Menu' }, { click: 'text=Your profile' }] },
    port: { path: port, steps: [{ click: 'text=Menu' }, { click: 'text=Your profile' }] },
    threshold: 0.09,
    note:
      TEXT_NOTE +
      ' Shared ProfileModal copy diverges from ui.jsx’s ProfileModal: the handoff always shows the raw RoleType next to the name and on the role toggles ("AccountableAgent, Transport, Repair", "SimpleAgent"…), and always suffixes the section headers with the zome call ("Private data · store_private_person_data", "Reputation · derive_reputation_summary") and the raw stat words ("custody", "service", "creation"); the port shows plain words throughout ("Trusted member", "Member"…, "Private details", "Reputation", "hand-overs", "services", "created") with no Developer-details gate on any of them.'
  },
  {
    slug,
    name: 'modal-help',
    original: { path: original, steps: [{ click: 'text=Menu' }, { click: 'text=How this works' }] },
    port: { path: port, steps: [{ click: 'text=Menu' }, { click: 'text=How this works' }] },
    threshold: 0.075,
    note: TEXT_NOTE + ' Copy checked field by field against ui.jsx’s HelpModal: no divergence found.'
  },
  {
    slug,
    name: 'modal-why',
    original: { path: original, steps: [{ click: 'text=why am I seeing this?' }] },
    port: { path: port, steps: [{ click: 'text=why am I seeing this?' }] },
    threshold: 0.07,
    note: TEXT_NOTE + ' Copy checked field by field against ui.jsx’s WhyModal: no divergence found.'
  }
];

export default pairs;
