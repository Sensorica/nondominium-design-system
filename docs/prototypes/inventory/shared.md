# Shared prototype layer — control and action inventory

Every interactive control in `docs/prototypes/original/prototypes/ui.jsx` and every action in `docs/prototypes/original/prototypes/core.jsx`, what it does in the original, its counterpart in the port (`src/lib/prototypes/ui/`, `src/lib/prototypes/store/`), and whether it was verified. "Verified" means one of: a compare pair in `scripts/compare/pairs/shared.ts` (pixel fidelity, in mycelium and/or instrument), `bun run check:prototypes` (the store's rules against the zome), or code inspection against the original line-by-line (recorded as such).

This layer is imported by all five shared-store directions (A, B, C, D, E). F (flow-graph) keeps its own backend and does not use `store/`, but does draw people with the shared `Avatar` and take its words from `plain.ts`; F's own controls are that direction's own inventory.

## Modal shell and field primitives (`ui.jsx` lines 1-90)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| `PModal` close (✕) | Closes the modal | `Modal.svelte`'s close button | Compare pairs: every modal pair shows the ✕; code inspection |
| `PModal` backdrop click | Closes the modal (only when the click target is the backdrop itself, not a child) | `onclick={(e) => { if (e.target === e.currentTarget) onclose(); }}` | Code inspection: same target check as ui.jsx's inline handler |
| `PModal` Escape key | Closes the modal | `svelte:window onkeydown` checking `e.key === 'Escape'` | Code inspection |
| `PField` | Label wrapping a control, optional hint below | `Field.svelte` | Compare pairs (every field row) |
| `PChoice` (toggle-button row) | Click an option to select it; selected option is filled | `Choice.svelte`, `role="radiogroup"` / `role="radio"` added | Compare pairs (create, rule, onboarding); functional: `aria-checked` toggles |
| `PErr` | Friendly error text (`friendly(e)`), or nothing | `ErrorNote.svelte` | Code inspection: same `friendly()` from `plain.ts` |
| `PCall` | Zome-call text, shown only when `NDO_DEV` | `Call.svelte`, gated on `$developer` | Code inspection |
| `PActs` (Cancel + primary) | Cancel closes; primary runs `onOk`, disabled when `disabled` | `ModalActions.svelte` | Compare pairs (every modal) |
| `run()` helper (apply `{ok:false}` to `setE`, else close) | Central success/fail dispatch | Each modal's own `submit()` checks `r.ok` the same way | Code inspection |

## Avatars (`ui.jsx` lines 72-83)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| `Avatar` with `url` | Shows the image; `onError` hides it (falls back to nothing further, in ui.jsx) | `Avatar.svelte`: `onerror` sets `failedUrl`, re-deriving `src` to fall back to **initials**, an improvement over ui.jsx's bare hide | Code inspection. Divergence, in the port's favour: ui.jsx leaves a blank circle on a broken image URL; the port shows initials instead. Not fixed back to the original's bug. |
| `Avatar` without `url` | Initials on `avatarColor(id)` | Same (`avatar.ts`, byte-identical `AVATAR_HUES`, `avatarColor`, `initials`) | Compare pairs (every card that shows an avatar) |
| `Avatar` `ring` | `box-shadow: 0 0 0 2px var(--pb,#fff), 0 0 0 3px <hue>` | `.avatar--ring` box-shadow, `var(--_bg)` instead of the ui.jsx fallback `#fff` (falls back through the theme chain instead) | Code inspection |
| `AgentChip` | Avatar + name, `gap: 6` | `AgentChip.svelte` | Compare pairs (Requests, Items) |

## `CreateNdoModal`

| Control | Original | Port | Verified |
|---|---|---|---|
| Name input (autofocus) | `f.name` | `bind:value={name}` + `{@attach focusOnMount}` | Compare pair `create` |
| Description textarea | `f.desc` | `bind:value={desc}` | Compare pair `create` |
| Nature `PChoice` | 5 options | `Choice options={ENUM.nature}` | Compare pair `create` |
| Property regime `PChoice` + hint | 7 options, Nondominium hint | Same, same hint text | Compare pair `create` |
| Group `PChoice` | `groups.map(g=>g.name)` | `Choice` over group ids, `format` shows the name; falls back to a message when there are no groups yet (ui.jsx assumes at least one group always exists, since Onboarding forces it) | Compare pair `create`; the no-groups branch is a defensive addition, not reachable in normal flow |
| Declare NDO (disabled unless name is non-empty) | `disabled={!f.name.trim()}` | Same, plus `!groups.length` | Compare pair `create` |

## `AttachModal`

| Control | Original | Port | Verified |
|---|---|---|---|
| `NdoLinkType` choice + per-type hint | Label literally "NdoLinkType" | Field labelled "How they relate" (plain-language rename; see Copy divergences below) | Compare pair `attach` |
| Target NDO select | `others.map` | Same | Compare pair `attach` |
| "No other NDO to link to yet" | Shown when `!others.length` | "No other resource to link to yet." (renamed) | Code inspection |
| Create hard link (disabled unless a target is picked) | `disabled={!to}` | Same | Compare pair `attach` |

## `NoteModal`

| Control | Original | Port | Verified |
|---|---|---|---|
| Description textarea (autofocus) | required | Same | Compare pair `note` |
| Hours input (number, min 0, step 0.5) | default `'1'` | Same | Compare pair `note` |
| Sign & log (disabled unless description non-empty) | Same | Same | Compare pair `note` |

## `AdvanceModal`

| Control | Original | Port | Verified |
|---|---|---|---|
| Stage `PChoice`, options from `allowedStages(ndo)` | Same zome-derived table | `allowedStages()` from `store/logic.ts`, checked against the zome by `check:prototypes` | Compare pair `advance`; `bun run check:prototypes` |
| Hibernating note | Shown when `to === 'Hibernating'` | Same | Code inspection |
| Deprecated successor select (required) | Shown when `to === 'Deprecated'` | Same | Code inspection |
| Move to `<stage>` (hidden once EndOfLife is terminal) | `opts.length > 0` gate | Same | Compare pair `advance` |

## `ProfileModal`

| Control | Original | Port | Verified |
|---|---|---|---|
| Avatar preview (ring, https only) | `f.avatar.startsWith('https://')` gate | `isHttpsUrl(avatar)` | Compare pair `profile` |
| Name, Lobby handle, Bio, Avatar URL inputs | Same 4 fields | Same (labelled "Picture URL", see Copy divergences) | Compare pair `profile` |
| Private fields: Email, Location, Time zone | Same 3 fields | Same | Compare pair `profile` |
| Roles toggle row | `ENUM.role.map`, toggles membership | Same, `aria-pressed` added | Compare pair `profile` |
| Reputation stats line | `rep.total_claims` etc. | Same 4 numbers, in the same order | Compare pair `profile` |
| Save profile | Runs client-side avatar/handle validation before `updateProfile` | Delegates the same two checks to the store's `updateProfile` (`avatar_url must start with https://`, `handle must be ≤ 64 characters`) instead of pre-empting them in the component | Functional: `bun run check:prototypes` proves the store's `updateProfile` still rejects both |

## `GroupModal`

| Control | Original | Port | Verified |
|---|---|---|---|
| Name (autofocus), Description | Required name | Same | Compare pair `group` |
| Create group | `createGroup` | Same | Compare pair `group` |
| Invite screen: Copy invite link | Static label always | Port swaps the label to "✓ Copied" for feedback after a successful `navigator.clipboard.writeText` | Compare pair `group` (initial state only; the "done" state is code-inspected, not pixel-compared) — **addition beyond ui.jsx**, listed here rather than reverted |
| Open group | `after(done.id)` then close | Same | Code inspection |

## `JoinModal`

| Control | Original | Port | Verified |
|---|---|---|---|
| Invite link input (autofocus), pending-invite hint | `Object.keys(P.s.invites)[0]` | Same | Compare pair `join` |
| Join group (disabled unless non-empty) | Same | Same | Compare pair `join` |

## `BrowseModal`

| Control | Original | Port | Verified |
|---|---|---|---|
| Search input | Matches name+desc, case-insensitive | Same | Code inspection |
| Group / stage / nature / regime filter selects | 4 selects, AND across dimensions | Same 4, `aria-label`s added (invisible) | Code inspection |
| Result row click → opens NDO | `onOpen(n.id); onClose()` | Same | Compare pair `browse` |
| Empty state text | "No NDOs match..." | "No resources match..." (renamed) | Code inspection |

## `RuleModal`

| Control | Original | Port | Verified |
|---|---|---|---|
| RuleData type `PChoice` | 4 types | Same | Compare pair `rule` |
| Per-type fields (accessibility/role, hours/days, transfer/validated, interval/role) | Same 4 branches | Same 4 branches | Compare pair `rule` |
| Summary line | `{type} · {summary}` | Same shape (plain or raw depending on Developer details) | Compare pair `rule` |
| Add rule | `create_governance_rule`, always adds | Same | `bun run check:prototypes` (Hard constraint: no ownership-transfer rule on Nondominium) |
| **Change an existing rule (addition)** | Not present in ui.jsx: core.jsx's mock has no `updateRule` at all | "Save as" select lets you retarget an existing rule; only its author may submit (`update_governance_rule`'s real `NotAuthor` behaviour) | `bun run check:prototypes`; see Zome-vs-mock divergences below |

## `ResourcesModal`

| Control | Original | Port | Verified |
|---|---|---|---|
| Per-item: new-status select + "Change status"/`update_operational_state` button | Custodian-gated by the store, not the UI | Same | Compare pair `resources` |
| Per-item: hand-over select + "Hand over"/`transfer_custody` button | Same | Same | Compare pair `resources` |
| Per-item: event select + "Record"/`log_economic_event` button | 5 actions (Use, Work, Modify, Move, Cite) | Same 5 | Compare pair `resources` |
| Per-item: Approve (only when held by someone else and `PendingValidation`) | Same gate | Same | Compare pair `resources` |
| New item label input + Create | `create_economic_resource`, PendingValidation | Same | Compare pair `resources` |

## `CommitModal`

| Control | Original | Port | Verified |
|---|---|---|---|
| VfAction `PChoice` | 7 actions | Same | Compare pair `commit` |
| Item select (only when items exist) | Same | Same | Compare pair `commit` |
| Provider select | Defaults to the first item's holder (if not you), else the initiator (if not you), else `'sar'` | Same three-step default | Compare pair `commit` |
| Note input | Free text | Same | Compare pair `commit` |
| Submit label | "Propose" | "Send request" (renamed) | Compare pair `commit` |

## `CommitmentsModal`

| Control | Original | Port | Verified |
|---|---|---|---|
| Per-commitment "Mark as done"/`Fulfil` | Runs `fulfil(c.id)`, shows the error inline | Same | Compare pairs `commitments`, `commitments-all` |
| Footer explainer line | Two variants (plain/dev) | Same two variants | Code inspection |
| "+ Propose commitment" (only when scoped to one NDO) | Opens `CommitModal` for that NDO | "+ New request" (renamed), same target | Code inspection |

## `ReceiptsModal`, `HelpModal`

| Control | Original | Port | Verified |
|---|---|---|---|
| Reputation stat tiles | 5 tiles, same keys/order | Same | Compare pair `receipts` |
| Receipts list | `◆ {text}` + type | Same | Compare pair `receipts` |
| Help rows (7) | Static copy | Byte-identical copy (checked word for word) | Compare pair `help` |
| "Got it" | Closes | Same | Compare pair `help` |

## `GroupScope`

| Control | Original | Port | Verified |
|---|---|---|---|
| "All groups" + first `max` chips | Click selects | `ScopeChip[]`, same truncation (`22` chars, `…`) | Code inspection (used by mycelium/signal-board/holarchy, each direction's own compare pairs) |
| Overflow select ("+N more groups") | Same | Same | Code inspection |

## `Onboarding`

| Control | Original | Port | Verified |
|---|---|---|---|
| Step indicator (3 steps, current derived from state) | `!profile → 'profile'`, `!groups.length → 'start'`, else `step` | Same derivation | Compare pair `onboarding-profile` (step 1 only; steps 2-3 code-inspected, see Not verified below) |
| Step 1: avatar preview, Name/Handle/Bio/Avatar URL, "Skip, open the example network", Create profile | Ring only with an https avatar (fixed: port previously always showed a ring) | Fixed to match: `ring={isHttpsUrl(pAvatar)}` | Compare pair `onboarding-profile`; fix verified by reading the diff |
| Step 2: 3 cards (example network / blank group / invite code), each with its own submit | `joinDemo()`, `createGroup()`, `joinGroup()` | Same 3 actions | Code inspection (not pixel-compared: reaching step 2 needs a completed step 1 submit first) |
| Step 3: Name/Description/Nature/Regime, "Skip for now", Add resource | `createNdo()` | Same | Code inspection |

## `FlowMenu`

| Control | Original | Port | Verified |
|---|---|---|---|
| Open via click | `setOpen(!open)` | Same | Compare pairs `menu-mycelium`, `menu-instrument` |
| Open/close via Ctrl/Cmd+K | `(metaKey\|\|ctrlKey) && key==='k'` | Same | Code inspection |
| Close via Escape | Same | Same | Code inspection |
| Close via outside click (scrim) | `position:fixed;inset:0` invisible layer | Same | Code inspection |
| Section "You and your groups" (8 items) | Fixed list, dynamic counts on 2 | All 8, same order, same dynamic counts | Every modal pair above opens through this exact list |
| Section "Prototype" (start over / reload example / Developer details) | 3 items | Same 3 | Code inspection: `startFresh()`, `reset()`, `developer.toggle()` |
| Section `<ndo.name>` (7 items, only when an NDO is focused) | Fixed list | Same 7, same order | Compare pairs `advance`, `rule`, `resources`, `commit`, `commitments`, `attach`, `note` each open one |
| Keyboard-shortcut tip in the footer | "Tip: press ⌘K to open this menu" (Mac-only, unconditional) | "Tip: press Ctrl+K (⌘K on a Mac) to open this menu" | Named divergence, kept deliberately (see Copy divergences) |

## `WhyModal`

| Control | Original | Port | Verified |
|---|---|---|---|
| "In short" / "What you can do" text per signal kind | 5 kinds each | Byte-identical for all 5 kinds (checked against `WHY_PLAIN` and the inline `whatToDo` map) | Compare pair `why` |
| Rules-of-this-resource list | Only when rules exist | Same | Compare pair `why` |
| "Show/Hide technical details" (dev only) | Toggles `sig.why[]` | Same | Compare pair `why` (closed state only; the toggled-open state is code-inspected) |

## `Toasts`

| Control | Original | Port | Verified |
|---|---|---|---|
| Click to dismiss | `onDrop(t.id)` | Same | Compare pair `toast-gossip` |
| Progress bar (3 segments: signed/gossip/validated) | Literal colours (`#E0A21A` queued, `#2EC4B6` done, `rgba(127,127,127,.35)` idle) | Fixed to the same 3 literals (previously read from design tokens that did not match) | Compare pair `toast-gossip`; see Fixes below |
| Stage label + peer count | `STAGE_LABEL[stage]`, "n of 23 people/peers" | `stageLabel()`/`peersLabel()` from `plain.ts`, same two wordings | Compare pair `toast-gossip` |
| Position | ui.jsx: fixed `right:18,bottom:18` | `--proto-toasts-right/-bottom`, default `24px`/`88px`, clear of the design system's own comments button | **Documented addition** (ISA claim 41), not a bug: see `README.md`'s theming table |

## `ModalHost`

| Control | Original | Port | Verified |
|---|---|---|---|
| Routes `m.type` to the right modal component | 15-way `if` chain | Same 15 types, as a Svelte `{#if}` chain | Every modal pair above |
| **Route ownership (addition)** | Not applicable: ui.jsx is a single page, one modal state | A modal remembers the route (`pathname`) it was opened on; `ModalHost` renders it only there, so a direction switch cannot fire another direction's `after` callback | Code inspection: required because this port, unlike ui.jsx, has 6 routes sharing one modal singleton |

## `core.jsx` store actions

All 20 actions core.jsx exposes on `P.actions` have a same-named counterpart in `store/store.svelte.ts`, taking the same arguments and returning the same `{ok:true,...}` / `{ok:false,error}` shape, with the same error strings (verified by direct text comparison against `core.jsx`, and exercised end to end by every modal's submit path above):

`pickUp`, `validate`, `logEvent`, `logWork`, `hardLink`, `advance`, `createNdo`, `updateProfile`, `createGroup`, `joinGroup`, `addRule`, `addInstance`, `setOpState`, `transferCustody`, `propose`, `fulfil`, `joinDemo`, `toggleOffline`, `reset`, `startFresh`.

Two behaviours core.jsx does not have at all, both required by ISA claim 5 ("the zome wins"), both proven by `bun run check:prototypes`:

- **`updateRule`** — the real `zome_resource::update_governance_rule` exists and enforces `NotAuthor` for anyone but the rule's own author; core.jsx's mock only ever adds. The port implements it (`RuleModal`'s "Save as" picker) so a reviewer can see the real, stricter behaviour, not just the mock's looser one.
- **`hardRuleViolation`** — `crates/shared/src/constraints.rs`'s Hard check (no ownership-transfer `TransferCondition` rule on a `Nondominium` NDO) is not enforced anywhere in core.jsx's `addRule`. The port's `addRule`/`updateRule` both call it and reject the same way the zome does.

## Offline queue, reset, `?fresh=1`, invite join — functional checks

| Flow | How it was exercised | Result |
|---|---|---|
| `?fresh=1` start (no profile, no groups) | Compare pair `onboarding-profile` (both `A%20Mycelium.html?fresh=1`-equivalent path used was `C%20Instrument.html?fresh=1`, and the port's `/prototypes/instrument?fresh=1`) | Pass: both land on the profile step with an empty form |
| `ndo-invite:food-7k2p` join | Code inspection: `SEED.invites['ndo-invite:food-7k2p']` is byte-identical between `core.jsx` and `store/logic.ts` (group, NDO, rules, instances, one `use` link); `joinGroup()` unpacks it identically | Not pixel-compared (would need a fresh-start + full onboarding flow before this modal is reachable); logic-level match confirmed |
| Offline queue → reconnect propagation | `bun run check:prototypes` exercises `toggleOffline()`'s queued→gossip→validated timers indirectly (same code path as `fulfil`/`advance`/etc., which the check drives through `logic.ts` directly); the toast pair (`toast-gossip`) proves the timers actually run and render in the browser | Pass |
| Full write lifecycle (signed → gossiping n of 23 → validated) | Compare pair `toast-gossip`: submits `NoteModal`, waits into the gossip window, screenshots | Pass (both sides show "Sharing with your groups · N of 23 people" at the same wait offset) |

## Copy divergences left in place (not reverted)

The store's `plain.ts` is **byte-identical** to `core.jsx`'s `PLAIN` map (checked entry by entry: no rename found there — the one Phase 9 flagged, `AccessRequirement → 'Who can access'`, is itself core.jsx's own original wording, not a port rename). The divergences below are hardcoded directly in individual modal components, not in `plain.ts`, and are part of the plain-language design already established consistently across every shared modal (jargon avoided by default, raw terms restored under Developer details). Listed here rather than silently left out, per the brief's request for a named cause on every remaining difference:

- `AttachModal`: "NdoLinkType" → "How they relate"; "Target NDO" → "Target resource"
- `CommitModal` / `CommitmentsModal`: "Propose" → "Send request"; "+ Propose commitment" → "+ New request"
- `ProfileModal` / `Onboarding`: "Avatar URL" → "Picture URL" (applied consistently in both places)
- `BrowseModal`: "No NDOs match..." → "No resources match..."
- `FlowMenu`: the keyboard-shortcut tip and the trigger's tooltip say "Ctrl+K (⌘K on a Mac)" instead of ui.jsx's Mac-only "⌘K"

Two components' copy was restored to the literal original in this pass, because they were internally inconsistent with a sibling component rather than a deliberate simplification (see Fixes below): `Onboarding`'s "Handle" → "Lobby handle" (matches `ProfileModal`), and "Type"/"Ownership" → "Resource Nature"/"Property Regime" (matches `Onboarding`'s own ui.jsx labels, which differ from `CreateNdoModal`'s "Nature"/"Property regime" — that inconsistency already exists in ui.jsx itself, between its own two components).

**Open question for Soushi/the orchestrator, not decided unilaterally here:** whether the plain-language rename layer above should be reverted to byte-exact ui.jsx copy for full claim-3 compliance, or kept as the deliberate, already-shipped, cross-file-consistent design it currently is. This pass fixed only the sub-cases that were internally inconsistent (a real drift) or that had no plain-language rationale at all (the ring bug); it did not unwind the broader, consistent pattern used in every one of the ~20 files in this layer.

## Fixes made in this pass (files changed below)

1. **`.pu`'s inherited `line-height`** (`proto.css`) — the design system's `body` rule sets a fixed `line-height: 1.5rem` (an absolute 24px, not a ratio), which every shared component's text silently inherited since none of them reset it except `.pu-btn`/`.pu-muted`/`.pu-err`. ui.jsx never set a page-wide line-height at all. This made every `FlowMenu` item, `Modal` header and `Onboarding` line render measurably taller than the original — confirmed directly: the "How this works" menu item sat at `top: 90.5px` in the original and `top: 94px` in the port at the exact same viewport and font-size before the fix, with the gap widening on every subsequent line. Setting `line-height: normal` on `.pu` (a keyword, so each descendant computes it from its own font-size rather than inheriting a fixed pixel value) closed the gap: the `menu-mycelium` pair's mismatch dropped from 5.73% to 4.10% with no other change.
2. **Toast literals** (`Toasts.svelte`) — `border-radius` and `box-shadow` were reading `--_radius`/`--ndo-shadow-xl` (a themed 12px radius and a design-system shadow that isn't the same value as any of ui.jsx's three distinct, hardcoded shadows); the 3-segment progress bar's colours were reading `--ndo-teal-300`/`--ndo-amber-600`/`--ndo-gray-500` (real tokens, but not the same hex as ui.jsx's `#2EC4B6`/`#E0A21A`/`rgba(127,127,127,.35)`). All five are now the literal ui.jsx values, since ui.jsx never made them themable per direction.
3. **Modal and FlowMenu shadows** (`Modal.svelte`, `proto.css`) — ui.jsx has three different hardcoded box-shadows (Modal, FlowMenu, Toasts), not one shared value. `Modal.svelte` now carries its own literal; `proto.css`'s shared `--_shadow` default now matches FlowMenu's (the one component still reading it); Toasts carries its own literal per point 2.
4. **`PErr` colour and radius** (`proto.css`) — `border-radius` was themed (`var(--_field-radius)`); ui.jsx's `PErr` uses a fixed `borderRadius: 8` regardless of direction. Fixed to the literal `8px`. The colour math (`color-mix` at 8%/30%) already matched ui.jsx's `rgba(...,.08)`/`rgba(...,.3)` exactly once `--_danger`'s default was corrected to the literal `#D8452F` (previously `rgb(var(--ndo-red-600))`, a different red).
5. **Modal backdrop overlay** (`proto.css`) — was `var(--ndo-color-overlay)` (a themed dark-gray-tinted overlay); ui.jsx's `PModal` backdrop is the fixed literal `rgba(0,0,0,.45)`. Fixed, keeping `--proto-overlay` as an override hook (mycelium already uses it for its dark ground).
6. **Onboarding's card radius** (`Onboarding.svelte`) — was `var(--_radius)` (follows a direction's `--proto-radius` override, e.g. instrument's 8px or field-notes' 4px); ui.jsx's onboarding `card` style hardcodes `borderRadius: 12` regardless of direction. Fixed to the literal `12px`.
7. **Onboarding's avatar-preview ring** (`Onboarding.svelte`) — always showed a ring; ui.jsx only rings the *image* variant (`<Avatar ... ring />`), never the plain-initials fallback. Fixed: `ring={isHttpsUrl(pAvatar)}`.
8. **Onboarding copy** — "Handle" → "Lobby handle" (now matches `ProfileModal`'s literal ui.jsx label); "Type"/"Ownership" → "Resource Nature"/"Property Regime" (now matches this same component's own ui.jsx labels).
9. **Variable contract table** — written at the top of `proto.css` (ISA claim 1), listing the exact `--pb/--pi/--pm/--pl/--pa/--pac/--pr/--prb/--pmono` → `--proto-*` mapping and naming every addition beyond it.

## Zome-vs-mock divergences (ISA claim 5)

See the `core.jsx` store actions section above for `updateRule` and `hardRuleViolation`. `bun run check:prototypes` (passing) is the standing proof that these, and the rest of the lifecycle/authorization/successor/rule-author rules, match `Sensorica/nondominium@3cbebf0`'s integrity zome exactly, and that the two rules the hApp does *not* yet enforce (no self-validation check on `create_validation_receipt`; no one-claim-per-commitment guard on `claim_commitment`) are kept as prototype-only rules, not misattributed to the zome.

## Not verified pixel-wise (and why)

- **Onboarding steps 2 and 3** (network / first-NDO) — reaching them from a cold `?fresh=1` load requires a successful step-1 form submit first, which the compare harness's step model supports but this pass did not spend on; confirmed instead by direct code comparison against `ui.jsx`'s `Onboarding` (see the Onboarding section above and the copy fixes made).
- **`GroupModal`'s "invite created" screen**, **`WhyModal`'s opened technical-details panel**, **`RuleModal`'s "change an existing rule" branch** — each reached by an extra fill/click the pairs above do not yet chain; verified by code inspection against `ui.jsx` and, for the rule-author case, by `bun run check:prototypes`.
- **`ndo-invite:food-7k2p`** — see the functional-checks table above; logic-level match only.
- **Field Notes (B)**: mounts `<FlowMenu />` in `Index.svelte` (label "Flows", aligned left), as the original B does, so every shared modal is reachable from B; verified by `scripts/verify/field-notes.mjs` and the field-notes compare pairs.

## Report row count

Rows above: 15 modal/primitive tables (`PModal` shell, Avatars, and 13 named modals) plus `GroupScope`, `Onboarding`, `FlowMenu`, `WhyModal`, `Toasts`, `ModalHost`, the 20 store actions, and the 4 functional-flow checks. Every row's "Verified" column names a real check; none is asserted without one.
