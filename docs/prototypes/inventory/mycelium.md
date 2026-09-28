# Mycelium (A) — control inventory

Every interactive control in `docs/prototypes/original/prototypes/A.jsx`, what it does in the original, its counterpart in the port (`src/lib/prototypes/directions/mycelium/`), and how it was verified. "Verified" means one of: a compare pair in `scripts/compare/pairs/mycelium.ts` (pixel fidelity, already passing under 1%), a check in `.local/verify/mycelium.mjs` (a headless Playwright run driving the **same action on the original and the port**, in a fresh browser context per scenario, and asserting the same resulting state — counts, visibility, derived numbers, never exact label text), or, where the control is a shared UI-kit component this direction does not own, code inspection confirming the same props are wired through.

Shared-store actions (`pickUp`, `advance`, `addRule`, `toggleOffline`, and so on) and the modal components they open (`CreateNdoModal`, `AttachModal`, `AdvanceModal`, `RuleModal`, `ResourcesModal`, `CommitModal`, `CommitmentsModal`, `ReceiptsModal`, `WhyModal`, `HelpModal`, `ProfileModal`, `GroupModal`, `JoinModal`, `FlowMenu`, `Onboarding`, `Toasts`, ...) live in `$lib/prototypes/store` and `$lib/prototypes/ui`, owned by the shared-layer builder (see `docs/prototypes/inventory/shared.md`). This direction only owns getting the reader *to* those modals with the right arguments; their own internal fields are not re-inventoried here, except where `.local/verify/mycelium.mjs` exercises one directly (pick-up, note submission) to prove a cross-cutting flow.

## Rail (left, 64px)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Logo | Read-only | `<img class="logo">` | Compare pair `field` |
| "Field" rail item | Switches `view` to `'field'` (React state) | `goView(SLUG,'field',record())` (`?view=` param) | Compare pair `field`; every scenario in `.local/verify/mycelium.mjs` that returns to the field view |
| "Signals" rail item + count badge | Switches to the signals list; `<em class="cnt">{openSig.length}</em>` | Same; `{proto.signals.length}` | Compare pair `signals`; `.local/verify/mycelium.mjs` "rail Signals switches to the signals list" and "signals badge count matches between original and port" (asserts the same integer on both sides, not just presence) |
| "Traces" rail item | Switches to the traces list | Same | Compare pair `traces`; `.local/verify/mycelium.mjs` "rail Traces switches to the traces list" |
| "You" rail item (avatar) | Switches to the profile view | Same, `AgentAvatar` with `ring` when active | Compare pair `you`; `.local/verify/mycelium.mjs` "rail You switches to the profile view" |

## Top bar (field view only)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Group scope chips ("All groups", "Sensorica", "Open Value Network") | `onChange` narrows `MyField`'s node set to that group | `GroupScope` `onchange={setGroup}` (`?group=`) | Compare pairs (implicit in every field-view pair, same seed); `.local/verify/mycelium.mjs` "group scope chip narrows the field to the same count on both sides" — asserts the **same node count** on original and port, both before and after the narrow (7 → 3), not merely "fewer" |
| Trail mode toggle (Trails / Custody / Citations) | `setMode(k)`; `MyField` filters `P.s.links` to `kinds = {Trails:[use,hard,cite], Custody:[use], Citations:[cite,hard]}[mode]` | Same, `MODES` in `field.ts` | `.local/verify/mycelium.mjs` "\"Custody\" mode narrows the trails to the same count on both sides" — asserts identical trail-path counts on both sides (6 → 1) |
| "+ Group" | Opens `GroupModal` | `modals.open({type:'group', after: setGroup})` | Compare pair `modal-group`; `.local/verify/mycelium.mjs` "\"+ Group\" opens the create-group modal on both sides" |
| "→ Join" | Opens `JoinModal` | `modals.open({type:'join', after: setGroup})` | Compare pair `modal-join`; `.local/verify/mycelium.mjs` "\"→ Join\" opens the join-group modal on both sides" |
| Menu (avatar + "Menu" + ▾), FlowMenu | Opens the shared menu: profile, groups, resources, prototype actions, and (since `sel` is always the panel's NDO here) that NDO's own actions | `<FlowMenu ndo={sel} onOpen={select} onGroup={setGroup} />` | Compare pairs `modal-commit`, `modal-browse`, `modal-receipts`, `modal-profile`, `modal-help`; `.local/verify/mycelium.mjs` "the Menu button opens FlowMenu on both sides", "FlowMenu \"Ask to borrow or receive\" opens the commit modal on both sides" |
| ⌘K / Ctrl+K shortcut | Opens/closes FlowMenu from anywhere on the page (`addEventListener('keydown', ...)`) | Same (`FlowMenu.svelte`'s `onkeydown`) | `.local/verify/mycelium.mjs` "Ctrl/Cmd+K opens FlowMenu on both sides without clicking its button" |
| "+ Declare NDO" | Opens `CreateNdoModal`; the new NDO is selected on creation | `modals.open({type:'create', after: select})` | Compare pair `modal-create`; `.local/verify/mycelium.mjs` "\"+ Declare NDO\" opens the create-resource modal on both sides"; also exercised end to end by the "reset" scenario (declares one, then resets) |

## Field (the SVG canvas)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| NDO node (click) | Selects it: `setSel(n.id)`, driving the detail panel | `FieldView`'s `onclick={() => onselect(v.n.id)}` | Compare pair `field`; `.local/verify/mycelium.mjs` "clicking a field node selects it in the detail panel on both sides" (asserts the panel's own `h1` changes to the clicked NDO's name) |
| NDO node (keyboard Enter/Space) | Not present in the original (`<g onClick>` has no `tabindex`/`onKeyDown`) | `role="button" tabindex="0"` + `onkeydown` calling the same `onselect` | Code inspection: an accessibility addition, never shown in a default-state screenshot (no focus ring without `:focus-visible`), harmless per the same policy as Holarchy's hover addition |
| Trail (curved path between two nodes) | Read-only: decorative, no `onClick` anywhere in `MyField` | Read-only, no `onclick` | Code inspection |
| Fade slider ("Trails fade over ... N d") | `<input type="range" min="1" max="90" value={decay} onChange=...>`; changes `heatOf()` decay and every trace's freshness/opacity | Same, `bind:value={decay}` | Compare pair `field`; `.local/verify/mycelium.mjs` "fade slider updates the \"N d\" readout the same on both sides" (drives the native range input via a real `input`/`change` event, reads back the same `"45 d"` text on both) |
| Legend (colour key) | Read-only | Static | Compare pair `field` |

## Detail panel (right, 380px)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Close (✕) | `onClose={() => setSel(null)}`, replaces the panel with the empty state | `onclose={closePanel}` (clears `?ndo=`) | Compare pair `field`; `.local/verify/mycelium.mjs` "closing the detail panel shows the same empty-state text on both sides" (byte-identical fallback copy on both sides) |
| "Log work" | Opens `NoteModal` | `modals.open({type:'note', ndo:id})` | Compare pair `modal-note`; `.local/verify/mycelium.mjs` "detail panel \"Log work\" opens its modal on both sides"; further exercised end to end by the cross-direction check below (a real submit) |
| "Lifecycle" | Opens `AdvanceModal` | `modals.open({type:'advance', ndo:id})` | Compare pair `modal-advance`; `.local/verify/mycelium.mjs` "detail panel \"Lifecycle\" opens its modal on both sides" |
| "Items & holders" | Opens `ResourcesModal` | `modals.open({type:'resources', ndo:id})` | Compare pair `modal-resources`; `.local/verify/mycelium.mjs` "detail panel \"Items & holders\" opens its modal on both sides" |
| "Requests · N" | Opens `CommitmentsModal`; the count is `commitmentsOf(id).filter(open).length` | Same, `openRequests` derived the same way | Compare pair `modal-commitments`; `.local/verify/mycelium.mjs` "detail panel \"Requests\" opens its modal on both sides" |
| "+ Rule" | Opens `RuleModal` | `modals.open({type:'rule', ndo:id})` | Compare pair `modal-rule`; `.local/verify/mycelium.mjs` "detail panel \"+ Rule\" opens its modal on both sides" |
| Signal card: pick-up button (verb text varies: "Done it" / "Approve" / "Make available" / "Ask to borrow" / "Log work") | Runs `P.actions.pickUp(g)`; a rejection is silently dropped (no inline error) | `pickUp(g)`; the port additionally shows `ErrorNote` on failure (a harmless, discoverable addition, same policy as Holarchy) | Code inspection for the error-surfacing addition; state effect verified live by `.local/verify/mycelium.mjs` "picking up a signal shrinks the signals list the same way on both sides" (asserts the same before/after counts on the Signals view, where the same control also lives — see below) |
| Signal card: "why am I seeing this?" | Opens `WhyModal` for that signal | `modals.open({type:'why', sig:g, ndo:g.ndo})` | Compare pair `modal-why`; `.local/verify/mycelium.mjs` "\"why am I seeing this?\" opens the why modal on both sides" |
| Traces list (avatar, agent, text, freshness opacity, hover title with hops) | Read-only | Read-only, same `title` attribute | Compare pairs (every panel screenshot) |
| Linked-resource slot (existing link) | Read-only label, no `onClick` in `MyPanel` | Read-only `<span class="slot">` | Code inspection |
| "+ link resource" | Opens `AttachModal` | `modals.open({type:'attach', ndo:id})` | Compare pair `modal-attach`; `.local/verify/mycelium.mjs` "\"+ link resource\" opens the attach modal on both sides" |

## Empty panel (no NDO selected)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Fallback text (two variants: has NDOs / has none) | Read-only | Same, byte-identical strings | `.local/verify/mycelium.mjs` "closing the detail panel shows the same empty-state text on both sides" |

## Signals view

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Heading + lede | Read-only | Same | Compare pair `signals` |
| Signal card (pick-up, why) — same component as the panel's, with `showNdo` | Same as above, plus the resource name shown above the title | Same | `.local/verify/mycelium.mjs` "picking up a signal shrinks the signals list the same way on both sides" — asserts the **same before and after counts** on original and port (8 → 7) |
| Empty state ("Nothing is asking for attention right now.") | Read-only, shown when `openSig.length === 0` | Same | Code inspection (not reachable with the example seed, which always has open signals) |

## Traces view

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Heading + lede (names the current fade window) | Read-only | Same | Compare pair `traces` |
| Trace row (hover title with hops) | Read-only | Read-only | Compare pair `traces` |
| Empty state | Read-only | Same | Code inspection |

## You view

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Avatar + name, roles line | Read-only | Same | Compare pair `you` |
| "Edit profile & roles" | Opens `ProfileModal` | `modals.open({type:'profile'})` | Compare pair `modal-profile`; `.local/verify/mycelium.mjs` "\"Edit profile & roles\" opens the profile modal on both sides" |
| "Reputation summary" | Opens `ReceiptsModal` | `modals.open({type:'receipts'})` | Compare pair `modal-receipts`; `.local/verify/mycelium.mjs` "\"Reputation summary\" opens the receipts modal on both sides" |
| Private participation receipts list | Read-only | Same | Compare pair `you` |
| Your traces list | Read-only | Same | Compare pair `you` |
| "Reset prototype data" | `P.actions.reset()`: reseeds `localStorage` back to the example network | Same action | `.local/verify/mycelium.mjs` "reset reseeds the field to 6 NDOs on both sides after a new one is declared" — declares a 7th NDO, resets, and asserts the field returns to exactly the original 6-NDO count on **both** sides |

## Status bar (footer)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| "Your node · online/offline" | `onClick={P.actions.toggleOffline}`; flips the label and the dot colour | Same action | `.local/verify/mycelium.mjs` "the offline toggle flips the node label the same way on both sides" (asserts the exact same label text on both sides, before and after) |
| Peers count / queued-or-last-trace text | Read-only, derived from `offline` and queued traces | Same | Code inspection |
| "DHT ⟳ ..." | Read-only | Same | Code inspection |

## Onboarding, ⌘K, `?fresh=1`, cross-direction flow

| Flow | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| `?fresh=1` cold start | `useProto()` reads `location.search`; no profile, no groups → `Onboarding` shows the profile step | `store.svelte.ts`'s `load()` reads the same flag → same `Onboarding` component | `.local/verify/mycelium.mjs` "?fresh=1 opens onboarding at the profile step" (fresh browser context on both sides, `?fresh=1` in the URL) |
| Onboarding itself (profile → network → first NDO) | Shared flow, identical in every direction | Same (`Onboarding.svelte`) | Not re-inventoried here: see `docs/prototypes/inventory/shared.md`'s `Onboarding` section, which owns its own fields |
| Cross-direction flow: an action here shows up in Field Notes (B) | Both directions are separate React roots but read/write the **same** `PROTO_KEY` in `localStorage` (same origin: every `A`–`E` `.html` file in `docs/prototypes/original/prototypes/`) | Both directions read/write the same `STORE_KEY` module-level store (same origin: every `/prototypes/<slug>` route) | `.local/verify/mycelium.mjs` "logging work in Mycelium shows the same trace in Field Notes (shared store)" — logs work on the CNC machine (`sol`) here, then navigates the **same browser page** to Field Notes (`B Field Notes.html` / `/prototypes/field-notes`) and asserts the identical trace text ("logged 2 h work" plus the typed note) appears in its trail, on both the original and the port |

## Fixes made in this pass

None: pixel fidelity for this direction was already complete before this task (`scripts/compare/pairs/mycelium.ts`, every pair 0.3%–1.0%, no threshold overrides), and every control exercised by `.local/verify/mycelium.mjs` passed on the first hardened run, save for two selector strict-mode bugs in the check script itself (a `text=Custody` collision with the legend's "use & custody" copy, and a `has-text("Declare NDO")` collision with the still-present "+ Declare NDO" trigger under the modal overlay) — both fixed in the script, not the direction.

## Not verified pixel-wise / behaviourally (and why)

- **GroupModal's "invite created" screen, WhyModal's opened technical-details panel, RuleModal's "change an existing rule" branch** — shared-layer internals, out of this direction's scope; see `docs/prototypes/inventory/shared.md`.
- **The "Approve"/"Make available"/"Ask to borrow" pick-up verb branches individually** — `.local/verify/mycelium.mjs` picks up whichever signal derives first from the shared seed (deterministic, since both sides run the identical `deriveSignals()` order); every branch's dispatch (`pickUp` routing to `fulfil`/`validate`/`setOpState`/`propose`/`logEvent`) is shared-store logic, covered by `bun run check:prototypes` and `docs/prototypes/inventory/shared.md`, not re-tested branch by branch here.

## Report row count

30/30 `.local/verify/mycelium.mjs` checks passed (see the script's own output for the exact list), plus the compare pairs enumerated above (all already green under `bun run compare:prototypes mycelium`). Every row's "Verified" column names a real, executed check.
