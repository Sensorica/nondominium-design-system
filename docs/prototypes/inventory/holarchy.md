# Holarchy (E) — control inventory

Every interactive control in `docs/prototypes/original/prototypes/E.jsx`, what it does in the original, its counterpart in the port (`src/lib/prototypes/directions/holarchy/`), and how it was verified. "Verified" means one of: a compare pair in `scripts/compare/pairs/holarchy.ts` (pixel fidelity), a check in `scripts/verify/holarchy.mjs` (a headless Playwright run against the live port), or, where the control is a shared UI-kit component this direction does not own, code inspection confirming the same props are wired through.

Shared-store actions (`pickUp`, `advance`, `addRule`, `transferCustody`, and so on) and the modal components they open (`CreateNdoModal`, `AttachModal`, `AdvanceModal`, `RuleModal`, `ResourcesModal`, `CommitModal`, `CommitmentsModal`, `ReceiptsModal`, `WhyModal`, `HelpModal`, `BrowseModal`, `ProfileModal`, `GroupModal`, `JoinModal`, ...) live in `$lib/prototypes/store` and `$lib/prototypes/ui`, owned by the shared-layer builder. This direction only owns getting the reader *to* those modals with the right arguments; their own fields are not re-inventoried here.

## Top bar

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| "Lobby" breadcrumb | Goes to the lobby (`go({})`) | `toLobby` → `goView('holarchy','lobby')` | Compare pairs `lobby`, `zoom-out-to-lobby`; functional check "lobby group disc opens the group" (reached via the same crumb path) |
| Group-name breadcrumb (e.g. "Sensorica") | Goes to that group, dropping the entered NDO (`go({group:at.group})`) | `toGroup` | Compare pairs `group`, `group-selected`, `zoom-out-to-group`, and every modal pair that starts by navigating there |
| NDO-name breadcrumb (current) | Read-only "you are here" pill; the original gives it no `onClick` at all | `<button class="on" aria-current="location">`, no `onclick` | Code inspection (both sides: current-page indicator only) |
| Menu (avatar + "Menu" + ▾) | Opens `FlowMenu`: profile, groups, resources, prototype actions, and (when an NDO is in focus or selected) that NDO's own actions | `<FlowMenu ndo={loc.at.ndo ?? loc.sel} onOpen={toNdo} onGroup={toGroup} />` | `scripts/verify/holarchy.mjs`: "Ask to borrow or receive", "How this works", "Find resources", "Your profile" all open from it |
| "scroll down to go back up · &lt;level&gt;" | Read-only zoom hint; text changes with depth | Static `<p class="zoom">`, `LEVEL[depth]` | Compare pairs (present in every view pair) |

## Lobby level (depth 1)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Group disc (click) | Enters that group (`go({group:g.id})`) | `LobbyLevel`'s `onenter(c.g.id)` → `toGroup` | Compare pair `lobby`; functional check "lobby group disc opens the group" |
| Group disc (hover) | None in the handoff — no hover rule targets `.group` at all | `.group:hover .disc` darkens the stroke (harmless addition, never in a default-state screenshot) | Compare pair `lobby-hover`, noted as a legitimate, intentional addition |
| Empty state text ("No groups yet...") | Read-only, shown when `gs.length === 0` | Same, `{#if !layout.length}` | Code inspection (unreachable with the example seed; both sides share the same `freshState()` data before any group exists) |

## Group level (depth 2)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| NDO disc, first click | Selects it: the card shows its summary and "Enter this holon" (`sel===n.id ? go(...) : setSel(n.id)`) | `GroupLevel`'s `pick(id)` → `onselect` | Compare pair `group-selected`; functional check "group: one click selects" |
| NDO disc, second click (same NDO already selected) | Enters it (depth 3) | Same `pick(id)` → `onenter` → `toNdo` | Functional check "group: second click enters the NDO" |
| "+ Resource" center disc | Opens `CreateNdoModal`; the new NDO opens on creation (`go({group, ndo:id})`) | `oncreate` → `modals.open({type:'create', after: toNdo})` | Functional check "group '+ Resource' opens the create modal" |
| Group title ("SENSORICA · GROUP DHT") | Read-only; always "GROUP DHT", not gated by Developer details | Static `<text class="title">`, fixed "GROUP DHT" suffix | Compare pair `group`; **fixed** — see below |

## NDO level (depth 3): the four rings

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Slots band / an existing linked-resource bubble | Toggles focus on `'slots'` | `NdoLevel`'s `toggle('slots')` on the band and each bubble | Compare pair `focus-slots` |
| "+" add-slot bubble | Opens `AttachModal` | `attach()` → `modals.open({type:'attach', ndo:id})` | Functional check "slot '+' bubble opens the attach modal" |
| Items band | Toggles focus on `'inst'` | `toggle('inst')` | Compare pair `focus-inst` |
| Rules band | Toggles focus on `'rules'` | `toggle('rules')` | Compare pair `focus-rules` |
| Signal dot (pulsing) | Opens `WhyModal` for that signal | `why()` → `modals.open({type:'why', sig, ndo:id})` | Compare pair `modal-why` (reached via the card's own "?" instead; same modal, same arguments — code inspection confirms the SVG dot calls the identical `modals.open` shape) |
| Center circle | Clears focus (`setFocus(null)`) | Click on `.core`'s parent → `onfocus(null)` | Functional check "center circle clears focus" |
| "no instances" text | Read-only, shown when the NDO has no items | Static `<text class="none">` | Compare pair `focus-inst` (renders whenever the focused NDO has none; **fixed copy**, see below) |

## Card (right panel)

### Nothing entered — Lobby or an unselected group

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| "+ Add resource" | Opens `CreateNdoModal` | `createNdo()` | Compare pair `modal-create` |
| "+ New group" (Lobby only) | Opens `GroupModal` | `modals.open({type:'group', after: ongroup})` | Compare pair `modal-group` |
| "→ Join group" (Lobby only) | Opens `JoinModal` | `modals.open({type:'join', after: ongroup})` | Compare pair `modal-join` |
| "⎘ Copy invite link" (group, unselected, only) | Copies the group's invite string to the clipboard; the label itself never changes in the original | `copyInvite()`; the port additionally flips the label to "✓ Copied" for 1.6s (a harmless, discoverable addition over the original's silent copy) | `scripts/verify/holarchy.mjs`: "copy invite link flips to 'Copied'" |
| Intro copy ("Click an NDO once...", "Each circle is a group DHT...") | Read-only | Static `<p class="p">` | **Fixed to the original's exact strings**, see below |

### An NDO selected or entered

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Ring row (What it is / N rules go with it / N items / N linked resources), only when entered | Toggles focus the same as the matching SVG band | `class="card-ring"`, `onclick={() => onfocus(...)}` | Compare pairs `focus-id`, `focus-rules`, `focus-inst`, `focus-slots` |
| Ring row, only when merely selected (not entered) | Same markup, `onClick` is a no-op (`at.ndo &&` guard) | `<div class="card-ring static">`, no click handler at all | Compare pair `group-selected`; code inspection |
| Expanded detail box (rules/items/linked list) | Renders once, after all four rows, for whichever ring is focused | Same, after the `{#each rows}` loop | **Fixed** — see below |
| "Needs attention" pick-up button (amber pill) | Runs `P.actions.pickUp(sig)`; a rejection is silently dropped by the original (no inline error surfaced) | `pickUp(g)`; the port additionally shows `ErrorNote` on failure (a harmless, discoverable addition — the original gives no feedback at all when a pick-up is rejected) | Code inspection; the store action itself is shared and out of scope here |
| "Needs attention" "?" button | Opens `WhyModal` | `modals.open({type:'why', sig, ndo: n.id})` | Compare pair `modal-why` |
| "Link resource" (entered) / "Enter this holon" (selected only) | Opens `AttachModal` / enters the NDO | Same | Compare pair `modal-create`'s sibling states; functional checks "card CTA … opens its modal" and "group: second click enters" |
| "Log work" | Opens `NoteModal` | `modals.open({type:'note', ndo:n.id})` | `scripts/verify/holarchy.mjs` |
| "Lifecycle" (entered only) | Opens `AdvanceModal` | `modals.open({type:'advance', ndo:n.id})` | Compare pair `modal-advance` |
| "Items" (entered only) | Opens `ResourcesModal` | `modals.open({type:'resources', ndo:n.id})` | Compare pair `modal-resources` |
| "Requests" (entered only) | Opens `CommitmentsModal` | `modals.open({type:'commitments', ndo:n.id})` | Compare pair `modal-commitments` |
| "+ Rule" (entered only) | Opens `RuleModal` | `modals.open({type:'rule', ndo:n.id})` | Compare pair `modal-rule` (theming discrepancy found in the shared modal — see "Shared-layer discrepancies" below) |
| Recent-activity row | Read-only: avatar, agent name, action text, and either elapsed time (`validated`) or the raw write-lifecycle status word | Same | Compare pairs `focus-*`; **fixed**, see below (was translating the status word through `stageLabel`) |

## Legend and footer

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Legend (colour key) | Read-only | Static `<ul class="legend">` | Every compare pair |
| Offline toggle ("● N peers hold this holon" / "○ offline...") | Toggles `proto.actions.toggleOffline()`; the "●"/"○" glyph is part of the string itself | Same action; **fixed** — see below (the glyph had been dropped in favour of a separate coloured dot) | `scripts/verify/holarchy.mjs`: "offline toggle changes the peers label" |
| "◆ N receipts" | Opens `ReceiptsModal` | `modals.open({type:'receipts'})`; **fixed** the missing "◆" glyph, see below | `scripts/verify/holarchy.mjs`: "receipts button opens the receipts modal" |
| "reset" | Reseeds the mock back to the example network | `proto.actions.reset()` | `scripts/verify/holarchy.mjs`: "reset reseeds the example network" |

## Onboarding, toasts, modal host

Mounted the same way every other shared-store direction mounts them (`<ModalHost />`, `<Toasts />`, `<Onboarding onndo={toNdo} ongroup={toGroup} />`), with no Holarchy-specific wiring beyond the callbacks already covered above. Not re-inventoried here; see the field-notes/mycelium/signal-board inventories for their own internals if needed.

## Fixes made to reach this state

Seven behavioural or copy bugs were found and corrected in this direction's own files while chasing pixel fidelity, beyond the palette and typeface work (ISA Phase 9, D8):

- **Recent-activity row's avatar+name wrapped in a flex container the original doesn't have.** The original renders the avatar and the bold agent name inline, in one plain `<span>`, with a single literal space between them. `HoloCard.svelte`'s `.who { display: flex; gap: 6px; align-items: flex-start }` replaced that space with a 6px gap and switched the avatar's vertical alignment from inline (roughly centred on the text) to pinned-to-top, measured via `boundingBox()` as a 3.4px rightward shift of the name and text plus a ~2.5px vertical shift of the avatar, on every recent-activity row. Fixed by removing the flex styling from `.who` in `HoloCard.svelte`; every pair that shows this card dropped from the 1.0-2.0% range to 0.3-0.8%.

- **Detail box position (the largest one).** The port rendered the expanded rules/items/linked-resources list immediately under the row that opened it. The original always renders it once, *after* all four summary rows (`rows.map(...)` followed by three sibling `{focus === k && ...}` expressions in `HoCard`), regardless of which ring is focused. This pushed every focus state's layout out of alignment below the second row and was the direction's single largest fidelity gap (`focus-rules` measured 5.46% before the fix, 0.95% after). Fixed in `HoloCard.svelte` by moving the detail block out of the `{#each rows}` loop.
- **`--proto-*` collision with UnoCSS's `ring` utility.** The card's summary rows used the class `card-ring`... originally just `ring`, which collided with UnoCSS `presetUno()`'s built-in Tailwind-compatible `ring` utility (a 3px `box-shadow` "focus ring" in `rgba(147,197,253,.5)`), rendering an outline around every row on every load, in every state. Renamed to `card-ring` throughout `HoloCard.svelte`.
- **Line-height inherited from the design system's own reset.** The design system's root sets `line-height:1.5`; the original never sets one outside `.card h2` (1.1) and `.p` (1.5), so its rows render at the browser's own metric line-height (about 1.36 for Manrope). Every row that didn't set its own value rendered visibly taller, and the drift compounded down the card (by "Recent activity" the two sides were 17.5px apart). Fixed by setting `line-height: normal` on the direction root in `App.svelte`.
- **Missing status glyph.** The offline/online footer's "●"/"○" prefix and the receipts button's "◆" prefix are literal characters in the original's string, not a separate coloured dot. The port had replaced them with a CSS dot element and dropped the glyph from the text entirely. Fixed in `App.svelte`.
- **"GROUP DHT" gated behind Developer details.** The port only showed "GROUP DHT" with Developer details on, falling back to "GROUP" otherwise; the original always says "GROUP DHT", unconditionally. Fixed in `GroupLevel.svelte`.
- **Copy divergences from the original's exact strings**: "no instances" (was "no items") in `NdoLevel.svelte`; "Click an NDO once to inspect it, twice to enter it." and "Each circle is a group DHT you belong to. Click one to zoom in." (were paraphrased to say "resource"/"group") in `HoloCard.svelte`; the recent-activity status word for a non-validated trace is the raw write-stage (`t.status`, e.g. "signed"), not passed through `stageLabel()` (a toast-only translation that doesn't apply here in the original).

None of these needed a `--proto-*`/theme change; all were structure or copy, found by comparing the rendered DOM and copy against `E.jsx` line by line once the palette work made a pixel-level comparison meaningful in the first place.

## Shared-layer discrepancies (not this direction's to fix)

- **`RuleModal` and `ResourcesModal` now show the original's raw labels.** `ui.jsx`'s `RuleModal` always shows literal field names ("RuleData", "accessibility", "required_role") and a raw enum preview line, with no Developer-details gate on the labels themselves; `ui.jsx`'s `ResourcesModal` hint is always the literal `create_economic_resource · starts PendingValidation with you as custodian`. Both were once plain-language paraphrases in the shared kit; commit 24db13a put them back on `ui.jsx`'s own fields and copy. The `modal-rule` pair measures 0.40% and `modal-resources` 0.62%, both under the 1% default, neither carrying a threshold override.
- **`CreateNdoModal`, the shared kit's group-create modal, and `JoinModal` (behind `modal-create`, `modal-group`, `modal-join`) no longer carry a spacing residual.** The field/pill spacing pass (commit 4e4d299) and the shared autofocus focus-ring fix (ISA Phase 9 finding 6, `src/lib/prototypes/ui/proto.css`) have both landed; all three now measure 0.77-0.78%, under the 1% default, and no longer carry a `threshold` override in `holarchy.ts`.
- The shared `paths.logoMark()` asset is a slightly different crop of the network glyph than the original's `background-position` crop of its full logo file; every A to E direction uses the same asset.
- `FlowMenu`, `ModalHost`, `Onboarding`, `Toasts` and every modal's own fields (`AdvanceModal`'s stage picker, `ResourcesModal`'s per-item controls, and so on) are shared UI-kit components; this inventory only verifies that this direction reaches them with the right arguments, not their own internals.
