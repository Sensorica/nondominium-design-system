// Pairs for the holarchy direction. The builder of this direction owns this file:
// one pair per view, per ring-focus state, per zoom step and per modal a
// reviewer would compare.
//
// The original keeps its position in React state ({group, ndo}, sel, focus),
// reached with click/wheel steps from its bare URL (which opens inside the
// CNC machine, same as the port's bare `/prototypes/holarchy`). The port
// encodes the same three levels in `?view=`/`group=`/`ndo=`; ring focus and
// selection are reached with the same click steps on both sides, since
// neither side puts them in the URL.
//
// FONT_WAIT: a longer settle than the harness default, so both sides are
// past any reflow from the self-hosted Manrope/Fira Code loading, even
// though the harness already waits on `document.fonts.ready` (same
// precaution as the mycelium pairs).
//
// A prior pass here carried every pair at a 2% ceiling, blamed on
// font-hinting and a shared logo-crop mismatch. That mostly wasn't the real
// story: HoloCard.svelte's "Recent activity" rows wrapped the avatar and the
// bold name in a `.who { display: flex; gap: 6px; align-items: flex-start }`
// the original doesn't have (there it's one plain <span> with a literal
// space after the avatar). boundingBox() showed the exact signature of that
// bug: everything after the avatar shifted right by 3.4px (a 6px gap versus
// a ~2.6px space) and the avatar itself shifted up by ~2.5px (flex-start
// versus the original's inline, roughly-centred flow). Removing the flex
// styling (below) made every row match exactly. With that fixed, every pair
// here measures 0.3-0.8%, well inside the 1% default, except three lobby
// modals whose content lives in the shared `src/lib/prototypes/ui/**` kit
// (CreateNdoModal, GroupModal, JoinModal), not in this direction: those keep
// their threshold, noted as shared-modal residuals pending that sweep.
import type { Pair } from '../pairs';

const slug = 'holarchy';
const original = 'E%20Holarchy.html';
const port = '/prototypes/holarchy';
const FONT_WAIT = 1000;

const SHARED_MODAL_NOTE = 'shared modal, pending shared spacing sweep';

const pairs: Pair[] = [
  // ── Views (ISA claim 39): the three levels, and the states a reviewer
  // would open first. ──
  {
    slug,
    name: 'ndo',
    original: { path: original, settle: FONT_WAIT },
    port: { path: port, settle: FONT_WAIT }
  },
  {
    slug,
    name: 'group',
    original: { path: original, steps: [{ click: 'text=Sensorica' }], settle: FONT_WAIT },
    port: { path: `${port}?view=group&group=sen`, settle: FONT_WAIT }
  },
  {
    slug,
    name: 'group-selected',
    original: {
      path: original,
      steps: [{ click: 'text=Sensorica' }, { click: 'text=Urban Canopy' }],
      settle: FONT_WAIT
    },
    port: { path: `${port}?view=group&group=sen`, steps: [{ click: 'text=Urban Canopy' }] }
  },
  {
    slug,
    name: 'lobby',
    original: { path: original, steps: [{ click: 'text=Lobby' }], settle: FONT_WAIT },
    port: { path: `${port}?view=lobby`, settle: FONT_WAIT }
  },

  // ── Ring focus (click once dims the other three rings and expands the
  // card's detail row; the same click on the card row or the SVG ring). ──
  {
    slug,
    name: 'focus-id',
    original: { path: original, steps: [{ click: 'text=What it is' }] },
    port: { path: port, steps: [{ click: 'text=What it is' }] }
  },
  {
    slug,
    name: 'focus-rules',
    original: { path: original, steps: [{ click: 'text=rules go with it' }] },
    port: { path: port, steps: [{ click: 'text=rules go with it' }] }
  },
  {
    slug,
    name: 'focus-inst',
    original: { path: original, steps: [{ click: 'text=1 item' }] },
    port: { path: port, steps: [{ click: 'text=1 item' }] }
  },
  {
    slug,
    name: 'focus-slots',
    original: { path: original, steps: [{ click: 'text=linked resource' }] },
    port: { path: port, steps: [{ click: 'text=linked resource' }] }
  },

  // ── Scroll down zooms out one level per gesture (E.jsx's `up()`; the
  // port debounces a trackpad's burst of wheel events into one climb, which
  // a single synthetic wheel event here does not exercise either way). ──
  {
    slug,
    name: 'zoom-out-to-group',
    original: { path: original, steps: [{ hover: 'svg.stage' }, { wheel: 100 }] },
    port: { path: port, steps: [{ hover: 'svg.stage' }, { wheel: 100 }] }
  },
  {
    slug,
    name: 'zoom-out-to-lobby',
    original: {
      path: original,
      steps: [{ click: 'text=Sensorica' }, { hover: 'svg.stage' }, { wheel: 100 }]
    },
    port: {
      path: `${port}?view=group&group=sen`,
      steps: [{ hover: 'svg.stage' }, { wheel: 100 }]
    }
  },

  // ── Hover (lobby group disc, group-level NDO disc): the handoff has no
  // hover affordance here at all; the port's subtle stroke-darken on hover
  // is a harmless addition (never in a default-state screenshot). Covered
  // once each to confirm nothing else shifts under the pointer. ──
  {
    slug,
    name: 'lobby-hover',
    // The port also darkens the hovered disc's stroke; the handoff has no
    // hover affordance here at all (an intentional, harmless addition).
    original: { path: original, steps: [{ click: 'text=Lobby' }, { hover: 'text=Sensorica' }] },
    port: { path: `${port}?view=lobby`, steps: [{ hover: 'text=Sensorica' }] }
  },

  // ── Direction-specific modals (ui.jsx's ModalHost; one pair per distinct
  // visual pattern the shared kit renders. attach/note/commit/commitments/
  // receipts/browse/profile/help share the same PModal/PField/PChoice/list
  // chrome already exercised below and are covered by function only, in
  // docs/prototypes/inventory/holarchy.md). ──
  {
    slug,
    name: 'modal-create',
    // Content is `src/lib/prototypes/ui/CreateNdoModal.svelte` (shared kit,
    // not owned by this direction): the field/pill spacing sweep in
    // progress there is what's left of this pair's residual.
    original: {
      path: original,
      steps: [{ click: 'text=Lobby' }, { click: 'text=+ Add resource' }]
    },
    port: { path: `${port}?view=lobby`, steps: [{ click: 'text=+ Add resource' }] },
    threshold: 0.016,
    note: SHARED_MODAL_NOTE
  },
  {
    slug,
    name: 'modal-group',
    // Content is the shared kit's group-create modal (ModalHost's `'group'`
    // branch), not owned by this direction.
    original: {
      path: original,
      steps: [{ click: 'text=Lobby' }, { click: 'text=+ New group' }]
    },
    port: { path: `${port}?view=lobby`, steps: [{ click: 'text=+ New group' }] },
    threshold: 0.016,
    note: SHARED_MODAL_NOTE
  },
  {
    slug,
    name: 'modal-join',
    // Content is `src/lib/prototypes/ui/JoinModal.svelte` (shared kit, not
    // owned by this direction).
    original: {
      path: original,
      steps: [{ click: 'text=Lobby' }, { click: 'text=Join group' }]
    },
    port: { path: `${port}?view=lobby`, steps: [{ click: 'text=Join group' }] },
    threshold: 0.016,
    note: SHARED_MODAL_NOTE
  },
  {
    slug,
    name: 'modal-advance',
    original: { path: original, steps: [{ click: 'text=Lifecycle' }] },
    port: { path: port, steps: [{ click: 'text=Lifecycle' }] }
  },
  {
    slug,
    name: 'modal-resources',
    // The original's own CTA is a <span>, not a <button>; ".cta" scopes past
    // the legend's unrelated "items" label.
    //
    // Shared-layer content mismatch, reported not fixed (not owned by this
    // direction, and under the 1% default regardless): ui.jsx's
    // ResourcesModal hint is the literal "create_economic_resource · starts
    // PendingValidation with you as custodian", unconditional; the shared
    // ResourcesModal.svelte instead shows a plain-language paraphrase ("It
    // starts waiting for approval, with you holding it."). See
    // docs/prototypes/inventory/holarchy.md.
    original: { path: original, steps: [{ click: '.cta >> text=Items' }] },
    port: { path: port, steps: [{ click: '.cta >> text=Items' }] }
  },
  {
    slug,
    name: 'modal-rule',
    // Shared-layer content mismatch, reported not fixed (not owned by this
    // direction, and under the 1% default regardless): ui.jsx's RuleModal
    // always shows its raw technical field labels ("RuleData",
    // "accessibility", "required_role") and a raw enum preview line,
    // ungated by Developer details; the shared RuleModal.svelte instead
    // renders plain-language labels ("Save as", "Kind of rule", "Who can
    // access") and a plain-language preview. This pair only proves the
    // direction reaches the modal with the right NDO. See
    // docs/prototypes/inventory/holarchy.md.
    original: { path: original, steps: [{ click: 'text=+ Rule' }] },
    port: { path: port, steps: [{ click: 'text=+ Rule' }] }
  },
  {
    slug,
    name: 'modal-commitments',
    original: { path: original, steps: [{ click: '.cta >> text=Requests' }] },
    port: { path: port, steps: [{ click: '.cta >> text=Requests' }] }
  },
  {
    slug,
    name: 'modal-why',
    // The original's "?" is a <span>, not a <button>; ".sgr" scopes to the
    // needs-attention row.
    original: { path: original, steps: [{ click: '.sgr >> text=?' }] },
    port: { path: port, steps: [{ click: '.sgr >> text=?' }] }
  }
];

export default pairs;
