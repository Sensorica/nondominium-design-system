# Flow Graph (F) — control inventory

Every interactive control in `docs/prototypes/original/prototypes/F Flow Graph.dc.html`, what it does in the original, its counterpart in the port (`src/lib/prototypes/directions/flow-graph/`), and how it was verified. "Verified" means one of: a compare pair in `scripts/compare/pairs/flow-graph.ts` (pixel fidelity), a check in `scripts/verify/flow-graph.mjs` (a headless Chrome run against the live port, 28/28 passing, zero console errors), or code inspection against the original's own `<script type="text/x-dc">` block.

F runs on its own mock of the real zome calls (`backend.ts`, ported from the original's `ndo-backend.js`), not the shared A–E store, and its word map is its own (`words.ts`), not the shared `$lib/prototypes/plain`.

## Header

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Perspective tabs (Whole network / conductor a / conductor b) | Switches the view; "writing as" only shows for the whole network | `setPersp` → `goView`, `?view=conductor-a\|conductor-b` | Compare pairs `conductor-a`, `conductor-b`; functional check "perspective tab switches to a conductor view" |
| "writing as" buttons (network view only) | Picks whose chain a new entry is written to | `savePrefs({ writer })` | Compare pair `writing-as-marco`; functional check exercises both writers throughout |
| Developer details toggle | Swaps every plain-word label for the raw enum/field/zome-call name | `developer.toggle()` (`$lib/prototypes/plain`, shared store — F only reads it) | Compare pair `dev-on`; functional check "dev toggle flips its own label" |
| Reset | Reseeds the mock back to the current scenario | `B.reset()` | Compare pair `reset`; functional check "Reset reseeds the equipment example" |
| "+ New entry" | Opens the root-action menu | `menu = !menu` | Compare pair `menu-open` |
| Menu → "Create person" / "Create group" / "Create a shared resource" | Three root zome calls, no entry selected | `actionsFor(ctx, null, writer)`; `chooseAction(id, true)` | Compare pair `form-create-person`; functional check exercises all three, including each one's empty-name error |

## Canvas

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Card click | Selects that source-chain entry in the panel | `Card`'s `onclick` → `selectCard` | Compare pairs `card-ndo`, `card-resource`, `card-commitment`, `card-rule-*` |
| Background click (pointer down/up without drag) | Clears the selection | `Canvas`'s `onbackground` → `clearSel` | Code inspection: same guard as the original's `onPointerUp` (`g.moved` check) |
| Drag to pan | Pans the view | `down`/`move`/`up` in `Canvas.svelte`, same pointer-capture pattern | Code inspection; not independently screenshotted (a drag mid-gesture isn't a stable frame) |
| Wheel (plain) | Pans | Non-passive `wheel` listener, `preventDefault` | Code inspection |
| Wheel + Ctrl/Cmd | Zooms toward the cursor | Same listener, `zoomAt` | Code inspection; zoom itself covered by the zoom buttons below |
| Lane header click ("Jump to this lane") | Pans that lane's column into view | `jump(i)` | Functional check "Lane header jump runs without error" (the pan itself is a moving target, not a stable compare frame) |
| Zoom out / in / Fit | Adjusts `view.k` | `zoomC`, `fit` | Compare pairs `zoom-fit`, `zoom-in` |
| Links legend: "Agents" toggle | Shows/hides agent-touch edges | `ontoggleagents` → `savePrefs({ showAgents })` | Compare pair `legend-agents-on` |
| Links legend: "Structure" toggle | Shows/hides structural edges | `ontogglestruct` → `savePrefs({ showStruct })` | Compare pair `legend-struct-off` |
| "Loading" placeholder | Shown before the first render | Not reproduced: the port's backend is synchronous, so there is no connecting phase to show | Named gap, not a control — nothing to click |

## Side rail (panel hidden)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| "‹" / vertical label | Reopens the panel | `App.svelte`'s `.rail` buttons, `sideClosed = false` | Compare pair `panel-collapsed` (the hidden state); reopening is the same click target verified by reachability of every other pair once the panel is back |
| "›" Hide panel | Collapses the panel to the 44px rail | `Panel`'s `onhide` | Compare pair `panel-collapsed` |

## Side panel — Guide (nothing selected)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Scenario buttons (equipment / science / art) | Reseeds the mock DHT to that user story | `onscenario` → `switchScenario` → `B.reset(id)` | Functional check: scenario switch reseeds the network, then every subsequent check runs against the reseeded state |
| "Try" numbered steps | Read-only, phase-by-phase walkthrough text | Static list from `SCENARIOS[id].tries` | Code inspection: text is the handoff's own scenario data, ported verbatim in `backend.ts` |
| Reputation summary block (`hasRep`) | Shown when the mock exposes `derive_reputation_summary`-shaped data | Not reproduced: the port's `backend.ts` never populates a `rep` array for any of the three scenarios (checked against every `SCENARIOS[*].seed`) | Named gap: nothing in this port's data ever makes `hasRep` true, so there is no state to reach or compare |

## Side panel — selected entry

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| "✕" Clear selection | Clears `sel`, back to the Guide | `Panel`'s `.close` → `onclear` | Functional check (used between almost every other check to return to the Guide); note below on its corner overlap with "Hide panel" |
| Badges (lifecycle / regime / nature / rule / opstate) | Read-only classification chips | `Badge.svelte`, ported from the bound `_ds_bundle.js`'s actual `Badge.jsx`, not the newer `registry/ndo-badge.svelte` | Compare pairs `card-rule-access`, `card-rule-limit`, `card-rule-transfer`, `card-ndo`, `card-resource` |
| "Created by X" / "X has it" / "Hidden from X" pills | Read-only, per-conductor holding state | `.pill` in `Panel.svelte` | Compare pair `card-resource` |
| Warning note (⚠, e.g. "Only Sarah, who created it, can change its stage.") | Read-only, `sel.notes` | `{#each insp.notes}` | Compare pair `form-change-stage` |
| Dev-only "Entry" grid, clickable hash fields | Each field that is a hash to another entry navigates there | `.fields__v--link` button, `onpick(to)` | Code inspection: same `fmt()`/`link` logic ported into `insp.fields`; exercised implicitly by every `dev-on` pair |
| "Connected to" / "Linked entries" list | Navigates to the referenced or referencing entry | `.link` button, `onpick(k.to)` | Functional check; the list itself appears in every `card-*` compare pair |
| "History" / "Update chain" rows | Read-only, one row per lifecycle/state change | `.hist` grid | Compare pair `form-change-stage` |
| Action buttons (per entry type, see the table below) | Opens that action's form | `.action` → `onaction(id)` → `chooseAction` | See "Actions by entry type" |
| Form fields (text / number / select) | Typed inputs, a select's option label plain-worded via `human()` unless it already carries its own label (a person's name, a hash) | `Panel.svelte`'s field loop, `optionLabel()` | Compare pair `form-change-stage`; functional check exercises every select in every action below |
| Form "Cancel" | Discards the in-progress form | `oncancel` | Functional check (used between action tests) |
| Form "Call" (submit) | Runs the zome call(s); shows the friendly error on failure | `onsubmit` → `submit()` → `friendlyErr()` | Functional check: 12 of the 12 reachable error messages below, plus every action's success path |

### Actions by entry type

| Entry type | Action | Zome call(s) (`docs/prototypes/BACKEND.md`) | Verified |
|---|---|---|---|
| (none selected) | Create person | `zome_person::create_person` | Functional check, incl. the empty-name error |
| (none selected) | Create group | `zome_group::create_group` | Functional check, incl. the empty-name error |
| (none selected) | Create a shared resource | `zome_resource::create_ndo → zome_group::create_ndo_anchor` | Functional check |
| Person | Assign role to X | `zome_person::assign_person_role` | Functional check, incl. the already-assigned error |
| GroupProfile | Join group | `zome_group::join_group` | Functional check, incl. the already-a-member error |
| NondominiumIdentity | Change stage | `zome_resource::update_lifecycle_stage` | Compare pair `form-change-stage`; functional check for the NotAuthor and missing-successor errors |
| NondominiumIdentity | Add a kind of item | `zome_resource::create_resource_specification` | Functional check, incl. the Layer-1-at-Ideation error |
| NondominiumIdentity | Add governance rule | `zome_resource::create_governance_rule` (all 4 `RuleData` variants) | Functional check exercises `TransferCondition`; the other three variants (`AccessRequirement`, `UsageLimit`, `MaintenanceSchedule`) verified by code inspection of `ruleFields`/`ruleData`, all four ported field-for-field from the original's own `ruleFields`/`ruleData` |
| NondominiumIdentity | List in a group | `zome_group::create_ndo_anchor` | Functional check |
| ResourceSpecification | Add an item | `zome_resource::create_economic_resource` | Code inspection (seeded by every scenario's own `seed()`, which is this same call) |
| ResourceSpecification | Add governance rule | Same as above, scoped to the spec | Code inspection |
| EconomicResource | Approve this item | `zome_gouvernance::create_validation_receipt` | Functional check, incl. self-validation and already-validated errors |
| EconomicResource | Change status | `zome_resource::update_operational_state` | Functional check, incl. the custodian-only error |
| EconomicResource | Transfer custody | `transfer_custody → log_economic_event → issue_participation_receipts` | Functional check, incl. the custodian-only error |
| EconomicResource | Make a promise | `zome_gouvernance::propose_commitment` | Functional check |
| EconomicResource | Record what happened | `zome_gouvernance::log_economic_event` | Functional check |
| Commitment (no claim yet) | Approve this promise | `zome_gouvernance::create_validation_receipt` | Code inspection: identical handler to the EconomicResource validation action, exercised there |
| Commitment (no claim yet) | Keep this promise | `[transfer_custody →] log_economic_event → claim_commitment → issue_participation_receipts` | Code inspection: this action list itself (`B.claimsOf(e.hash).length ? [] : [...]`) is what makes "This promise has already been kept" unreachable through the UI — see below |
| EconomicEvent | Confirm what happened | `zome_gouvernance::create_validation_receipt` | Code inspection: identical validation handler, exercised on the Commitment and EconomicResource paths |

## Footer (Activity dock)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Conductor toggle ("● Sarah :8888 · online") | Toggles that conductor's simulated network connection | `Dock.svelte`'s `.cond` → `ctx.B.setOnline(a, !on)` | Functional check "Conductor toggle flips online/offline" |
| "Show/Hide activity" | Opens/closes the call log | `ontoggle` → `savePrefs({ dock })` | Compare pair `dock-open`; functional check |
| Activity rows | Read-only, one per zome call, dev/non-dev phrasing | `Dock.svelte`'s `.row`, `callPhrase()` | Compare pair `dock-open` |
| "No calls yet." placeholder | Shown when the log is empty | `{#if !rows.length}` | Not independently reached in this pass (the fresh/blank scenario's own dock was not screenshotted before its first call); code inspection confirms the exact original copy |

## Scenario list and the fresh-start capability (ISA criterion 3)

The scenario picker (`VISIBLE_SCENARIOS` in `Panel.svelte`) lists exactly the original's three: equipment, science, art — same order, same titles. `blank` (the "Start from nothing: a new person" scenario, ISA claim 34) is not a fourth button; it is reached only through `?fresh=1`, exactly as the constraint asks. Verified: `scripts/verify/flow-graph.mjs` navigates to `flow-graph?fresh=1` and confirms the panel shows "Start from nothing: a new person" with zero console errors, and separately confirms the visible scenario list still has exactly three entries.

The one gap: F's `views` array in `src/lib/prototypes/directions.ts` (network / conductor-a / conductor-b) has no fourth entry for the fresh-start screen, so `$lib/screen-map.svelte.ts` — which builds its keys only from `d.views` — never lists a "fresh" key for F, and the `m` screen map cannot jump to it directly today. This is not fixed here: `directions.ts` is shared across all six directions and owned outside this task (only F's `typeNote` field there is this direction's to edit), and no other file this direction owns can add a screen-map entry. Reaching it still works (the link, `paths.protoFresh('flow-graph')`, is wired on the directions index page for every direction, F included), it just is not also keyed into the map's search.

## Fixes made to reach this state

Six behavioural bugs were found and corrected in this direction's own files while chasing pixel fidelity and building the checks above, beyond the previous builder's `.h` padding and Badge-component work (see `ISA.md` Phase 9).

- **Canvas card layout (`Card.svelte`).** The original's node `<div>` (line 505 of the source) sets no `display` at all — a plain block box, each row keeping its own line-height-based height, with `overflow:hidden` silently clipping anything past the fixed 116px. The port had `display:flex;flex-direction:column`, which instead flex-shrinks every row proportionally once content exceeds the box. That one property difference was the whole ~2% baseline mismatch on all 21 pairs before this pass: measured via `getBoundingClientRect` on the "equipment" badge row, 14.9375px in the flex column against the original's 17.85px in block flow (both frames scaled ×0.85 by the canvas zoom; unscaled, that is 21px, the `.badges` row's own explicit height, landing exactly once shrinking stops). Fixed by dropping `display:flex`/`flex-direction` back to plain `display:block`.
- **`Panel.svelte`'s bottom padding.** `72px` of real bottom padding (reserving room for the fixed comments fab, `CommentsHost.svelte`) added exactly that much to the panel's own `scrollHeight` versus the original's uniform `20px`, so a Playwright `click()` that scrolls a newly-opened form into view landed at a different `scrollTop` on each side — the whole remaining cause of `form-change-stage`'s mismatch. Fixed by keeping `padding: 20px` (matching the original's aside exactly) and moving the fab clearance to `scroll-padding-bottom: 72px`, which reserves the same room for `scrollIntoView` without inflating layout height.
- **Three "always-present-but-conditionally-hidden" spans.** The original always renders a second span next to a label — `a.call` in the action list, `form.call` in the form header, `r.call` in the root-entry menu — even when it will be empty (non-dev mode); each sits in a `gap:2px` flex column, so an empty span still claims its row's worth of gap. The port had gated all three behind `{#if dev}`, making every action button, the form header, and every menu item 2px shorter than the original — compounding down a list of four action buttons or six history rows into the multi-percent mismatches `form-change-stage` and `card-resource` showed. Fixed in `Panel.svelte` (twice) and `App.svelte` by always rendering the span with `{dev ? call : ''}` instead of `{#if dev}`.
- **A fourth such span, in the "Connected to" list.** Same bug, `k.field` in `Panel.svelte`'s `.link` button: the original always renders three spans (`k.dir`, `k.field`, `k.title`) in a `gap:8px` flex row; the port's `{#if k.field}` dropped the whole middle span (and its gap) in non-dev mode, pulling every link's title 8px left of the original's. Fixed the same way, always rendering the span.
- **`optionLabel()` translated select options through F_WORD.** The original's own render step (`st.dev || ov !== ol ? ol : human(ol)`, not `F_WORD`) mechanically sentence-cases an enum option, it never uses the same friendly rewrites a badge gets. The port used `F_WORD`, so the "Change stage" form's "Next stage" select showed "Paused" where the original shows "Hibernating" (`human()` is a no-op on that particular word, since it has no camelCase boundary — the two functions only disagree on words like `PendingValidation` → "Pending validation"). Fixed in `words.ts`: `optionLabel` now calls `human()`, matching the original's own logic exactly.
- **Field-label font.** The original's form-field label span (`f.label`, e.g. "Next stage") is always `font-family: var(--ndo-font-mono)`, with no `dev` gate; the port had `class:mono={dev}`. Fixed to `class="mono"` unconditionally.

## Reachable backend errors (`words.ts`'s `F_ERR`, ported from the original's own list)

All eleven of the original's patterns, plus the three additive hApp-constraint messages `backend.ts` enforces that the original mock did not (documented in `words.ts`'s own comment). Reachability checked against every action this direction offers through its own forms — not just whether the string exists in `F_ERR`.

| Friendly text shown | Reached via | Verified |
|---|---|---|
| "Please fill in the name." | Empty name on Create person / Create group / Create a shared resource / Add a kind of item | Functional check (first three) |
| "Create a profile first." | `needPerson()` guard on almost every action, if the writer has no Person yet | Observed directly while building the functional check (before its person-creation step existed, "Add a kind of item" hit this exact message), then designed around once the check's step order was fixed; not asserted in the final script, which instead exercises the success path once a Person exists |
| "Join the group first." | `create_ndo_anchor` by a non-member | Code inspection (`Only group members can anchor NDOs in this group`); not independently triggered in this pass, since every functional-check writer is a member of every group it anchors into |
| "Only the person who created this resource can change its stage." | `update_lifecycle_stage` by anyone but the initiator | Functional check |
| "Pick the resource that replaces this one first." | `update_lifecycle_stage` to `Deprecated` with no `successor_ndo_hash` | Functional check |
| "You can't approve your own item. Ask someone else." | `create_validation_receipt` on an `EconomicResource` by its own author | Functional check |
| "You have already approved this." | A second `create_validation_receipt` from the same agent | Functional check |
| "You are already in this group." (intended) / **"Already a member of this group."** (actual) | `join_group` by an existing member | Functional check — see note below |
| "This person already has that role." | `assign_person_role` with a role the target already holds | Functional check |
| "Only the person currently holding this item can do that." | `update_operational_state` / `transfer_custody` by a non-custodian | Functional check (both call sites) |
| "This promise has already been kept." | A second `claim_commitment` on the same commitment | **Not reachable through the UI**: once `B.claimsOf(e.hash).length` is truthy, `actionsFor()` returns `[]` for that Commitment — the "Keep this promise" button itself disappears, so the UI can never re-submit. Verified by code inspection of `actionsFor`'s `Commitment` case, both here and in the original (`st.act` never offers the action either, since `this.actionsFor` mirrors the same guard). |
| "An uncapturable resource can't have a rule that hands over ownership. Choose custody, use rights or benefit instead." | `create_governance_rule` with `TransferCondition`/`Ownership` on a `Nondominium`-regime NDO | Functional check |
| "Kinds of item can't be added yet. Move the resource past the idea stage first." | `create_resource_specification` while the NDO is still `Ideation` (also: `Hibernating`, `Deprecated`, `EndOfLife`) | Functional check (Ideation case; the other three lifecycle stages are the same `if` branch, not independently re-tested) |
| "Nobody can take, use up or reduce an uncapturable resource that way." | `captureCheck()`: a `Commitment`/`EconomicEvent` whose `action` is `Transfer`, `Consume` or `Lower` on a `Nondominium`-regime NDO | **Not reachable through the current UI**: `propose_commitment`'s action select offers `TransferCustody, Use, Work, Move, AccessForUse`, and `log_economic_event`'s offers `Use, Work, Modify, Move, Cite` — none of the three raw `VfAction` values `captureCheck` matches against are ever a choice in either select. Verified by reading every call site of `captureCheck()` in `backend.ts` against every `opt([...])` list that feeds those two actions' forms. |

### An inherited quirk, not a port bug

The original's own `F_ERR` entry `[/already a member/, 'You are already in this group.']` has no `i` flag, and `ndo-backend.js`'s own error text starts "**A**lready a member of this group" (capital A). The regex never matches its own error, in the original as much as in the port: both sides show the raw backend string, not the intended friendly one. Verified by reading `docs/prototypes/original/prototypes/ndo-backend.js:226` and `F Flow Graph.dc.html:283` side by side, and confirmed live in the functional check. Fixing the port's regex to be case-insensitive would make it *more* correct than the original — which is not what this task asks for, so it was left as-is and the check asserts the raw string both sides actually show.

## The "Hide panel" / "Clear selection" corner

`.hide` (top-right, `position:absolute`, `z-index:1`) and `.close` (the `✕` at the end of `.insp-head`, normal flow, no `z-index`) occupy overlapping screen space in both the original and the port: `.insp-head`'s own comment notes the original reserves no padding for `.hide`, and measuring both buttons' `getBoundingClientRect()` on the live port confirms a real overlap (`.hide` at `x:1400-1428,y:64-92`, `.close` at `x:1394.6-1420,y:72.5-95.5`). A real mouse click at the center of `.close` lands on `.hide` instead, on both sides — inherited from the original's geometry, not introduced here. `scripts/verify/flow-graph.mjs` dispatches `.close`'s click via `element.click()` rather than a coordinate-based click to route around it; a person using either app would need to aim slightly left of that corner.

## Not this direction's to fix

- `$lib/screen-map.svelte.ts` and F's `views` entry in `src/lib/prototypes/directions.ts` (the fresh-start screen-map gap above).
- The comments fab (`CommentsHost.svelte`) and the design-system exit chip / `m` screen map: shared chrome, listed as additions over the original per ISA claim 41, not reinventoried here.
- `zome_person`, `zome_group`, `zome_resource`, `zome_gouvernance` themselves: `backend.ts` is F's own mock of them, cross-checked against `docs/prototypes/BACKEND.md` and `bun run check:prototypes` (which passed: 170 lifecycle pairs match the integrity zome at `3cbebf0`), not re-derived here.

## Zome-vs-mock divergences (claim 4 of "Done means")

`backend.ts` enforces three constraints the original's `ndo-backend.js` does not, because the real hApp (`crates/shared/src/constraints.rs`) does: `ownership_transfer_not_permitted_by_regime`, the Layer-1-at-Ideation gate, and `nondominium_no_unilateral_capture`. All three are additive (fidelity to the hApp over fidelity to the original mock, per this direction's own long-standing rule, restated in `words.ts`'s comment); none removes or weakens anything the original mock checked. Two of the three are reachable and verified above; the third (`nondominium_no_unilateral_capture`) is real in `backend.ts` but currently unreachable through this direction's own UI, as noted above — that gap is in the UI's action-select options, not in the constraint itself, and is left as found since closing it would mean adding VfAction options the original union never has.
