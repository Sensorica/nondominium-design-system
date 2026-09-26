# Prototype directions: the contract for direction builders

Six UI directions from the v0.1 prototype handoff (`docs/prototypes/HANDOFF.md`) live here, one folder each. Everything they share already exists and is registered. A builder owns exactly one direction and touches nothing else.

## What you own, and what you must not touch

You own:

- `src/lib/prototypes/directions/{slug}/`: your direction. Replace the stub `App.svelte`; add any components, stores or data you need beside it.
- `src/routes/prototypes/(direction)/{slug}/+page.svelte`: your route file. It mounts `App.svelte` and nothing else; change it only if you must.

You must not touch:

- `src/lib/replica/`: it is a byte-level copy of the app and a check fails if it drifts.
- Anything outside your folder and your route file: the shared store, `plain.ts`, the UI kit, `directions.ts`, `paths.ts`, `surface-keys.ts`, the screen map, the layouts, other directions. If the shared layer is missing something, say so in your report instead of patching it.

| Id | Slug | Folder | Store | Views (`?view=`) |
|---|---|---|---|---|
| A | `mycelium` | `directions/mycelium/` | shared | `field` (default), `signals`, `traces`, `you` |
| B | `field-notes` | `directions/field-notes/` | shared | `trail` (default), `rules`, `requests`, `linked` |
| C | `instrument` | `directions/instrument/` | shared | `bench` (default) |
| D | `signal-board` | `directions/signal-board/` | shared | `board` (default), `drawer` (+ `ndo`) |
| E | `holarchy` | `directions/holarchy/` | shared | `ndo` (default, + `group`, `ndo`; bare opens the CNC machine, as the handoff does), `group` (+ `group`), `lobby` |
| F | `flow-graph` | `directions/flow-graph/` | own | `network` (default), `conductor-a`, `conductor-b` |

## How a direction mounts

`src/routes/prototypes/(direction)/+layout.svelte` wraps every direction. It is full-bleed like `/app`: no design-system chrome, but the exit chip, the `m` screen map and the `c` comments stay. It:

- brings the shared store up in the browser (`proto.load(url.searchParams)`), honouring `?fresh=1` and `?example=1`, then drops those flags from the URL;
- renders your `App.svelte` only after that (A to E) or after mount (F), so you never see server placeholder state and can use `window`, `localStorage` and timers freely;
- shows a thin banner above you when your status is `'archived'` or `'target'`.

Size your root with `height: 100%` (the layout's `.stage` is a positioned flex child), never `100vh`, or the banner pushes you off screen.

Inside your root, A to E render the shared pieces themselves:

```svelte
<script lang="ts">
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { FlowMenu, ModalHost, Toasts, Onboarding, modals } from '$lib/prototypes/ui';
</script>

<div class="root" style="--proto-accent: rgb(var(--ndo-teal-700))">
  <FlowMenu ndo={selected} onOpen={(id) => (selected = id)} />
  <!-- your layout -->
  <ModalHost />
  <Toasts />
  <Onboarding onndo={(id) => (selected = id)} />
</div>
```

Mount `ModalHost` and `Toasts` inside the element that sets your `--proto-*` theme, so modals inherit it.

## Views, links and surface keys

A view is a query-param state of your route, so every view is a URL a reviewer can link to and comment on. The first view in `directions.ts` is the default and has no param.

| Need | Use |
|---|---|
| Your direction's URL | `paths.protoDirection('{slug}')` |
| A view, optionally pinned to a record | `paths.protoView('{slug}', view, { group?, ndo? })` |
| Start as a new person / reload the example | `paths.protoFresh('{slug}')`, `paths.protoExample('{slug}')` |
| Read the current view (reactive) | `currentView('{slug}')` from `$lib/prototypes/url.svelte` |
| Read `?group=` / `?ndo=` | `currentRecord()` |
| Go to a view | `goView('{slug}', view, record?, { replace? })` |

Never write a route segment or a query string yourself: every URL comes from `paths.ts`. Surface keys are already registered: `proto:{slug}` for the default view and `proto:{slug}:{view}` for the others, matched on `view` alone, so the record a view is pinned to does not split a comment thread. Selection that is not a view (which NDO is highlighted in A, which tab of B is open for which NDO) may also go in the URL through `goView` with `record`, and should if a reviewer would want to link to it.

## The shared store (A to E)

`import { proto } from '$lib/prototypes/store/store.svelte'`. A module-level singleton equivalent to the handoff's `useProto()`. All five shared-store directions persist under one localStorage key (`ndo-proto-shared-v1`), so an action taken in D shows up in A.

- `proto.s`: the state, read-only (`profile`, `roles`, `groups`, `invites`, `ndos`, `links`, `traces`, `hardLinks`, `validations`, `rules`, `instances`, `commitments`, `receipts`, `offline`). Shapes are in `store/logic.ts` (`ProtoState` and friends) and follow the handoff's "State management" section. Rules are `[type, summary, author]`, items are `[label, OperationalState, custodian]`, links are `[from, to, 'use' | 'cite' | 'hard']`.
- `proto.signals`: derived, never stored (`deriveSignals`). Each has `kind`, `lane` (`hands`, `eyes`, `avail`), `title`, `sub`, `strength`, `verb`, `why[]` and sometimes `progress`.
- `proto.toasts`, `proto.dropToast(id)`: the write lifecycle (render `<Toasts />` instead of reading these).
- `proto.me`: `{ id, name, roles, avatar }`. `proto.dev`: Developer details, reactive.
- `proto.q`: `ndo(id)`, `group(id)`, `tracesOf(id)`, `signalsOf(id)`, `hardLinksOf(id)`, `commitmentsOf(id)`, `openCommitments()`, `heatOf(id, decayDays?)`, `agent(id)` (display name), `reputation()`, `allowedStages(id)`.
- `proto.actions`: `pickUp(sig)`, `validate(ref, ndo)`, `logEvent(ndo, i, action, note?)`, `logWork(ndo, description, hours)`, `hardLink(from, to, type)`, `advance(ndo, to, successor?)`, `createNdo(form)`, `updateProfile(form)`, `createGroup({ name, desc })`, `joinGroup(code)`, `addRule(ndo, type, summary)` (always adds, as `create_governance_rule` does), `updateRule(ndo, i, type, summary)` (the rule's author only), `addInstance(ndo, label)`, `setOpState(ndo, i, state)`, `transferCustody(ndo, i, to)`, `propose({ ndo, action, provider, inst?, note? })`, `fulfil(commitmentId)`, `joinDemo()`, `toggleOffline()`, `reset()`, `startFresh()`.

Every write action returns `{ ok: true, value }` or `{ ok: false, error }`. The error is the backend's exact text; show it through `<ErrorNote error={...} />`, which maps it to friendly words. `createNdo` returns the new id as `value`; `createGroup` returns `{ id, invite }`; `joinGroup` returns `{ id }`. Each action's comment in `store/logic.ts` names the zome call it stands for (see `docs/prototypes/BACKEND.md`).

The store enforces two kinds of rule, and `bun run check:prototypes` proves both and names which is which:

- **The hApp's, at 3cbebf0:** the integrity zome's lifecycle table, initiator-only lifecycle, custodian-only custody transfer and operational state, a successor for Deprecated, rules only their author may change (`update_governance_rule` returns NotAuthor), no items at Ideation, and the Hard constraints of `crates/shared/src/constraints.rs` that apply to what the store accepts (no ownership-transfer rule on a Nondominium NDO).
- **Prototype rules the hApp does not enforce yet:** no self-validation (`create_validation_receipt` has no validator check) and one claim per commitment (`claim_commitment` leaves it as a Phase 2 TODO). They are the handoff's; keep them, but do not cite them as zome behaviour.

Pure helpers for your own rendering are exported from `store/logic.ts`: `fmtAgo`, `freshness`, `heat`, `allowedStages`, `STAGES`, `ENUM`, `LINK_TYPES`, `AGENTS`.

## Words: `plain.ts`

Every direction, F included, takes its words from `$lib/prototypes/plain`. Never write a local enum-to-word map. F's past-tense event phrases (`ACTION_PAST`) and rule sentences (`ruleSentence`) live there too.

- `plain(value)`: the everyday word for an enum value or a " · "-joined rule summary. Always shown.
- `word(value, dev)`: F's convention, the raw enum with Developer details on.
- `ENTRY_TYPE_WORD`, `LANE_WORD`, `ACTION_PHRASE`, `FIELD_WORD`: F's maps (entry types, lanes, action phrases, form labels).
- `friendly(error, { stripCallPrefix? })`: backend error to friendly text.
- `stageLabel(stage, dev)`, `peersLabel(peers, dev)`: toast wording.
- `developer`: the Developer details switch, a Svelte store. `$developer` in a component, `developer.toggle()`, `developer.get()`. Persisted under `ndo-dev`; it does not reload the page.

## The UI kit: `$lib/prototypes/ui`

Svelte ports of everything `ui.jsx` provides, styled on design-system tokens.

| Component | Props | Notes |
|---|---|---|
| `Avatar` | `id`, `name?`, `url?`, `size = 24`, `ring?`, `title?` | Store-agnostic. https URL, else initials on one of eight hues hashed from `id`. F uses this one. |
| `AgentAvatar` | `id`, `size?`, `ring?`, `url?` | A to E: name and picture from the store. |
| `AgentChip` | `id`, `size = 18` | Avatar plus name. |
| `Modal` | `title`, `sub?`, `onclose`, `width = 440`, children | The shell; Escape and backdrop close it. |
| `Field` | `label`, `hint?`, children | Label wrapping a control. |
| `Choice` | `options`, `value`, `onchange`, `format?` | Toggle buttons; plain words by default. |
| `ErrorNote` | `error` | Friendly error text, or nothing. |
| `Call` | `c` | The zome call, only with Developer details on. |
| `ModalActions` | `onclose`, `onok`, `label`, `disabled?` | Cancel plus primary. |
| `CreateNdoModal` | `onclose`, `after?(ndoId)` | |
| `AttachModal`, `NoteModal`, `AdvanceModal`, `RuleModal`, `ResourcesModal`, `CommitModal` | `ndo` (an `Ndo`), `onclose` | Hard link, log work, change stage, add rule, items and custody, ask to borrow. |
| `CommitmentsModal` | `ndo?`, `onclose` | Requests on one NDO, or across groups. |
| `ProfileModal`, `ReceiptsModal`, `HelpModal` | `onclose` | |
| `GroupModal`, `JoinModal` | `onclose`, `after?(groupId)` | Group shows its invite link after creating. |
| `BrowseModal` | `onclose`, `onOpen?(ndoId)` | |
| `WhyModal` | `sig`, `ndo`, `onclose` | "Why am I seeing this?" |
| `GroupScope` | `value` ('all' or a group id), `onchange`, `max = 3`, `allLabel?`, `chip?` snippet | First `max` groups as chips, the rest in a select. The `chip` snippet receives `{ id, label, on, select }`. |
| `Onboarding` | `onndo?`, `ongroup?` | Profile, then network, then first NDO; shows itself while there is no profile or no group. |
| `FlowMenu` | `ndo?`, `onOpen?`, `onGroup?`, `align?`, `label = 'Menu'` | Every flow, opened by its button or Ctrl/Cmd+K. Prototype section: start over, reload the example, Developer details. |
| `Toasts` | none | The write lifecycle. |
| `ModalHost` | none | Renders whichever modal is open. |

Open a modal from anywhere with `modals.open({ type, ... })`. A modal belongs to the route it was opened on: `ModalHost` renders it only there, and the direction layout closes it when you move to another direction or leave, so an `after` callback never runs in a direction that did not set it; the request types are in `ui/modals.svelte.ts` and mirror the handoff's `setM({ type })`: `create`, `attach`, `note`, `advance`, `rule`, `resources`, `commit`, `commitments`, `profile`, `receipts`, `help`, `group`, `join`, `browse`, `why`. Also exported: `avatarColor`, `initials`, `AVATAR_HUES`, `focusOnMount` (an attachment: `{@attach focusOnMount}`).

## Theming

The kit reads `--proto-*` custom properties; each defaults to a design-system token. Set them on your root element to theme the modals, menu, onboarding and toasts. The left column is what `ui.jsx` called the same thing.

| ui.jsx | Property | Default |
|---|---|---|
| `--pb` | `--proto-bg` | `rgb(var(--ndo-color-card-bg))` |
| `--pi` | `--proto-ink` | `var(--ndo-color-text-primary)` |
| `--pm` | `--proto-muted` | `var(--ndo-color-text-secondary)` |
| `--pl` | `--proto-line` | `var(--ndo-color-border)` |
| `--pa` | `--proto-accent` | `rgb(var(--ndo-blue-600))` |
| | `--proto-accent-hover` | `rgb(var(--ndo-blue-700))` |
| `--pac` | `--proto-accent-ink` | `rgb(255 255 255)` |
| `--pr` | `--proto-radius` | `var(--ndo-radius-xl)` (modals, menu, toasts) |
| `--prb` | `--proto-control-radius` | `var(--ndo-radius-md)` (buttons) |
| | `--proto-field-radius` | `var(--ndo-radius-md)` (inputs, cards) |
| | `--proto-font` | `var(--ndo-font-sans)` |
| `--pmono` | `--proto-mono` | `var(--ndo-font-mono)` |
| | `--proto-overlay` | `var(--ndo-color-overlay)` |
| | `--proto-shadow` | `var(--ndo-shadow-xl)` |
| | `--proto-danger` | `rgb(var(--ndo-red-600))` |
| | `--proto-hover` | `rgb(var(--ndo-gray-500) / 0.12)` |
| | `--proto-focus` | `var(--ndo-focus-ring)` |
| | `--proto-toast-bg`, `--proto-toast-ink` | `rgb(var(--ndo-gray-900))`, white |
| | `--proto-progress`, `--proto-queued` | teal-300, amber-600 |
| | `--proto-toasts-right`, `--proto-toasts-bottom` | `24px`, `88px` (clear of the comments button) |

The exit chip lives in the layout, outside your root. If your own UI sits in the bottom-left corner, move it by setting `--proto-exit-left` and `--proto-exit-bottom` on `document.documentElement` in an effect, and clear them in the effect's cleanup.

Style on tokens (`rgb(var(--ndo-*))`). Tokens only includes type: the handoff's per-direction webfonts are not loaded, and each registry entry's `typeNote` says what its direction lost. The handoff asked for A to E to be restyled onto the design system: keep each direction's layout, flow and interaction, not its palette. No hex literals; the eight avatar hues in `ui/avatar.ts` are the only exception. For badges and buttons, `@nondominium/ndo-ui` exports `NdoBadge` (`kind`, `value`, `mode`) and `NdoButton`. Glyphs, not icons: `+ → ← ⎘ ✓ ⚠ · ▾ ‹ ›`. No em dashes in copy.

## F: Flow Graph

F keeps its own backend: port `ndo-backend.js` from the handoff into `directions/flow-graph/` (TypeScript, same function names, inputs, enums and messages), persisting under its own key (the handoff used `ndo-backend-v1`). It does not use the shared store, and the layout does not load it for F. F still takes every word from `plain.ts` (`word`, `ENTRY_TYPE_WORD`, `LANE_WORD`, `ACTION_PHRASE`, `FIELD_WORD`, `friendly`) and draws people with the shared `Avatar`. F handles `?fresh=1` itself if it wants to (reset its backend); the layout leaves the flag in the URL for F. Its views are the perspectives: `network`, `conductor-a` (the backend's agent `a`), `conductor-b` (agent `b`).

## Checks before you hand back

```bash
bunx svelte-check --threshold error      # 0 errors
bun run check:prototypes                 # the store's rules still match the zome
bun run dev -- --port 5291               # then open /prototypes/{slug} and each ?view=
```

Run the Svelte MCP autofixer on every component you write.
