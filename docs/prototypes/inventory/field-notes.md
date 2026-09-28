# Field Notes (B) — control inventory

Every interactive control in `docs/prototypes/original/prototypes/B.jsx`, what it does in the original, its counterpart in the port (`src/lib/prototypes/directions/field-notes/`), and how it was verified. "Verified" means one of: a compare pair in `scripts/compare/pairs/field-notes.ts` (pixel fidelity, already passing under threshold), a check in `.local/verify/field-notes.mjs` (a headless Playwright run driving the **same action on the original and the port**, in a fresh browser context per scenario, and asserting the same resulting state — counts, visibility, derived numbers, never exact label text), or, where the control is a shared UI-kit component this direction does not own, code inspection confirming the same props are wired through.

Shared-store actions (`pickUp`, `advance`, `addRule`, `toggleOffline`, and so on) and the modal components they open (`CreateNdoModal`, `AttachModal`, `AdvanceModal`, `RuleModal`, `ResourcesModal`, `CommitModal`, `CommitmentsModal`, `ReceiptsModal`, `WhyModal`, `HelpModal`, `ProfileModal`, `GroupModal`, `JoinModal`, `FlowMenu`, `Onboarding`, `Toasts`, ...) live in `$lib/prototypes/store` and `$lib/prototypes/ui`, owned by the shared-layer builder (see `docs/prototypes/inventory/shared.md`). This direction only owns getting the reader *to* those modals with the right arguments; their own internal fields are not re-inventoried here.

**Correction to `docs/prototypes/inventory/shared.md`'s "Not verified pixel-wise" note**, found while building this inventory: that file states "Field Notes (B) — `App.svelte` does not mount `<FlowMenu />` at all, so none of the shared modals are reachable from that direction today." That is stale. `Index.svelte`'s `.brand` row currently mounts `<FlowMenu ndo={sel} onOpen={onselect} align="left" label="Flows" />` (confirmed by reading the file, and by `scripts/compare/pairs/field-notes.ts`'s `modal-help`/`modal-profile` pairs, which already reach it via `text=Flows`, and by every FlowMenu-only modal check in `.local/verify/field-notes.mjs` below). This inventory does not edit `shared.md` (out of this task's owned paths) but records the correction here since it directly bears on this direction's own reachability claims.

## Index (left, 300px)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Brand mark + "Nondominium" | Read-only | Same | Compare pair `trail` |
| FlowMenu ("Flows" button) | Opens the shared menu: profile, groups, resources, prototype actions, and (since `sel` is passed) the open entry's own actions | `<FlowMenu ndo={sel} onOpen={onselect} align="left" label="Flows" />` | `.local/verify/field-notes.mjs` "the \"Flows\" button opens FlowMenu on both sides", "FlowMenu \"Your profile\" opens the profile modal on both sides", "FlowMenu \"How this works\" opens the help modal on both sides" |
| ⌘K / Ctrl+K shortcut | Opens/closes FlowMenu from anywhere on the page | Same | `.local/verify/field-notes.mjs` "Ctrl/Cmd+K opens FlowMenu on both sides without clicking its button" |
| Search input ("Search the commons register…") | Filters every group's list by `(name+regime+stage+nature)` substring, case-insensitive | Same, plus the *plain-language* words also match (`match()` joins both raw and `plain()`-translated fields) — a strict superset of the original's matches, never narrower | `.local/verify/field-notes.mjs` "search narrows the index to the same count on both sides" — asserts the **same** filtered count (6 → 1) on original and port for a query ("sensor") that matches on the raw field either way, so the superset behaviour does not diverge here |
| Group section header (e.g. "Sensorica · register") | `onClick` toggles `shut[g.id]`, collapsing the list and flipping ▾/▸ | Same (`toggle(id)`) | `.local/verify/field-notes.mjs` "collapsing a group section hides its entries on both sides" — asserts the **same** entry count before (6) and after collapsing one group (4) on both sides |
| Register entry (name, plain stage · regime, "N left for you" when signalled, ink bars) | `onClick={()=>setSel(n.id)}` opens that entry | `onclick={() => onselect(n.id)}` | Compare pair `trail`; `.local/verify/field-notes.mjs` "clicking a register entry opens it on both sides" (asserts the page's own `h1` changes to the clicked NDO's name on both sides) |
| Ink bars (`FnInk`/`InkBars`) | Read-only: 7 bars, traces per 4 days, newest on the right | Read-only, same bucketing | Code inspection (byte-identical bucket math: `Math.floor(t.ago/1440/4) === 6-i`) |
| Empty-group text ("No entries match." / "No NDOs in this group yet.") | Read-only | Same, byte-identical | Code inspection |
| "Open a new entry" | Opens `CreateNdoModal`; the new entry is selected on creation | `modals.open({type:'create', after: onselect})` | Compare pair `modal-create`; `.local/verify/field-notes.mjs` "\"Open a new entry\" opens the create-resource modal on both sides"; exercised end to end by the reset scenario below |
| "+ New group" | Opens `GroupModal` | `modals.open({type:'group'})` | Compare pair `modal-group`; `.local/verify/field-notes.mjs` "\"+ New group\" opens the create-group modal on both sides" |
| "→ Join group" | Opens `JoinModal` | `modals.open({type:'join'})` | Compare pair `modal-join`; `.local/verify/field-notes.mjs` "\"→ Join group\" opens the join-group modal on both sides" |
| "Browse" | Opens `BrowseModal` | `modals.open({type:'browse', onOpen: onselect})` | Compare pair `modal-browse`; `.local/verify/field-notes.mjs` "\"Browse\" opens the find-resources modal on both sides" |
| Footer note ("Ink bars show traces per 4 days...") | Read-only | Same | Compare pair `trail` |

## Entry page (centre)

### No entry selected (empty register)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Heading + lede (two variants) | Read-only | Same, byte-identical | Code inspection (unreachable with the example seed, which always has entries) |
| "Open a new entry" / "→ Join group" | Same modals as the index footer's | Same | Code inspection (same `modals.open` calls) |

### An entry is open

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| "Entry № {hash} · opened by {avatar} {agent}" | Read-only | Same | Compare pair `trail` |
| Title, description | Read-only | Same | Compare pair `trail` |
| Stamp (Stage / Ownership / Type / Use) | Read-only | Same | Compare pair `trail` |
| Tab: "The trail" (default) | Shows the trace timeline | `view === 'trail'` | Compare pair `trail`; `.local/verify/field-notes.mjs` "the register opens on the same default entry on both sides" |
| Tab: "Rules & items" | Shows rules-in-force and items, two columns | `view === 'rules'` | Compare pair `rules`; `.local/verify/field-notes.mjs` "\"Rules & items\" tab shows the rules-in-force heading on both sides" |
| Tab: "Requests" | Shows commitments on this entry | `view === 'requests'`/`'commit'` (same tab, id renamed; original's internal key is `'commit'`, the port's is `'requests'` — cosmetic, both bind to the same `[k,label]` pair in the tab row) | Compare pair `requests`; `.local/verify/field-notes.mjs` "\"Requests\" tab shows the ask-to-borrow action on both sides" |
| Tab: "Linked" | Shows hard links | `view === 'linked'`/`'attached'` (same cosmetic id rename as above) | Compare pair `linked`; `.local/verify/field-notes.mjs` "\"Linked\" tab shows the link-to-another-NDO action on both sides" |
| "Log work" (tab-row action) | Opens `NoteModal` | `modals.open({type:'note', ndo:n.id})` | Compare pair `modal-note`; `.local/verify/field-notes.mjs` "\"Log work\" opens the log-work modal on both sides" |
| "Turn the page (lifecycle)" (tab-row action) | Opens `AdvanceModal` | `modals.open({type:'advance', ndo:n.id})` | Compare pair `modal-advance`; `.local/verify/field-notes.mjs` "\"Turn the page (lifecycle)\" opens the advance modal on both sides" |
| Trail: event rows (avatar, agent, text, freshness), **margin notes** (a trace's own note, in the blockquote-style `.margin` box, attributed "— {agent}, note on this trace") | Read-only | Read-only, same rendering | `.local/verify/field-notes.mjs` "a trace note renders as a margin quote, identically, on both sides" — checks `sol`'s seeded note ("Prototype run at the FabLab…") renders inside `.margin` on both |
| Trail: empty state | Read-only | Same | Code inspection |
| Rules tab: "Add a rule" | Opens `RuleModal` | `modals.open({type:'rule', ndo:n.id})` | Compare pair `modal-rule`; `.local/verify/field-notes.mjs` "\"Add a rule\" (rules tab) opens the rule modal on both sides" |
| Rules tab: "Items & holders" | Opens `ResourcesModal` | `modals.open({type:'resources', ndo:n.id})` | Compare pair `modal-resources`; `.local/verify/field-notes.mjs` "\"Items & holders\" opens the resources modal on both sides" |
| Rules tab: rule/item empty states (including the stage-gated "Instances cannot be added at stage X" text) | Read-only | Same, via the shared `friendly()`/`NO_ITEM_STAGES` | Code inspection |
| Requests tab: "Ask to borrow or receive" | Opens `CommitModal` | `modals.open({type:'commit', ndo:n.id})` | Compare pair `modal-commit`; `.local/verify/field-notes.mjs` "\"Ask to borrow or receive\" (requests tab) opens the commit modal on both sides"; exercised end to end (a real submit) by the cross-direction check below |
| Requests tab: "Mark done…" | Opens `CommitmentsModal` | `modals.open({type:'commitments', ndo:n.id})` | Compare pair `modal-commitments`; `.local/verify/field-notes.mjs` "\"Mark done…\" opens the commitments modal on both sides" |
| Requests tab: commitment rows (waiting/done) | Read-only | Same | Compare pair `requests` |
| Linked tab: "Link to another NDO" | Opens `AttachModal` | `modals.open({type:'attach', ndo:n.id})` | Compare pair `modal-attach`; `.local/verify/field-notes.mjs` "\"Link to another NDO\" opens the attach modal on both sides" |
| Linked tab: hard-link rows, empty state | Read-only | Same | Compare pair `linked` |

## Side column (right, 290px)

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| No entry selected: "Left here for you" summary, "Your receipts →" | Read-only text + the receipts link (see below) | Same | Code inspection (unreachable with the example seed) |
| "Left here for you" — signal note (pick-up button, "→"-suffixed verb) | `P.actions.pickUp(g)` | Same, plus `ErrorNote` on failure (harmless addition, same policy as the other directions) | `.local/verify/field-notes.mjs` "picking up the \"Left here for you\" signal empties that section on both sides" — asserts the specific seeded signal ("Approve Marco's request") is present before, and the exact empty-state copy ("Nothing left here. The entry is quiet.") is present after, on **both** sides (a `.note` div-count check alone would not move, since the empty-state placeholder is itself a `.note`) |
| "Left here for you" — "why?" link | Opens `WhyModal` | `modals.open({type:'why', sig:g, ndo:g.ndo})` | Compare pair `modal-why` (reached via the trail tab's own trigger); `.local/verify/field-notes.mjs` "the side column's \"why?\" link opens the why modal on both sides" |
| "Left here for you" — empty state | Read-only | Same | Code inspection (unreachable while `sol` has an open signal in the seed) |
| "Elsewhere in the register" — count, up to 3 notes (name, title, pick-up button, no "why") | Same `pickUp` action, scoped to signals on *other* NDOs | Same | Code inspection: the same `pickUp` control the "Left here for you" row above already exercises live |
| "Your receipts →" | Opens `ReceiptsModal` | `modals.open({type:'receipts'})` | Compare pair `modal-receipts`; `.local/verify/field-notes.mjs` "\"Your receipts →\" opens the receipts modal on both sides" |
| Receipts preview list (up to 4, "◆ {text}" / first word of the NDO name) | Read-only | Same | Compare pair `trail` |
| Conductor line: "● 23 peers hold this entry" / "○ offline · writing locally" | `onClick={P.actions.toggleOffline}` | Same action | Compare pair `offline`; `.local/verify/field-notes.mjs` "the offline toggle flips the conductor line the same way on both sides" |
| "reset prototype" | `P.actions.reset()`: reseeds `localStorage` back to the example network | Same action | `.local/verify/field-notes.mjs` "reset reseeds the register to 6 entries on both sides after one is declared" — declares a 7th entry, resets, and asserts the register returns to exactly the original 6-entry count on **both** sides |

## Onboarding, `?fresh=1`, cross-direction flow

| Flow | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| `?fresh=1` cold start | `useProto()` reads `location.search`; no profile, no groups → `Onboarding` shows the profile step | `store.svelte.ts`'s `load()` reads the same flag → same `Onboarding` component | `.local/verify/field-notes.mjs` "?fresh=1 opens onboarding at the profile step" (fresh browser context on both sides, `?fresh=1` in the URL) |
| Onboarding itself (profile → network → first NDO) | Shared flow, identical in every direction | Same (`Onboarding.svelte`) | Not re-inventoried here: see `docs/prototypes/inventory/shared.md`'s `Onboarding` section, which owns its own fields |
| Cross-direction flow: an action here shows up in Mycelium (A) | Both directions are separate React roots but read/write the **same** `PROTO_KEY` in `localStorage` (same origin: every `A`–`E` `.html` file in `docs/prototypes/original/prototypes/`) | Both directions read/write the same `STORE_KEY` module-level store (same origin: every `/prototypes/<slug>` route) | `.local/verify/field-notes.mjs` "proposing a request in Field Notes shows the same trace in Mycelium (shared store)" — proposes a commitment ("Ask to borrow or receive") on the CNC machine (`sol`) here, then navigates the **same browser page** to Mycelium (`A Mycelium.html` / `/prototypes/mycelium`) and asserts the identical trace/note text shows up there, on both the original and the port. (Complements `docs/prototypes/inventory/mycelium.md`'s own cross-direction check, which runs the flow in the opposite direction: Mycelium → Field Notes.) |

## Fixes made in this pass

None to this direction's own files: pixel fidelity was already complete (`scripts/compare/pairs/field-notes.ts`, every pair 0.3%–1.6%, two named and justified threshold overrides for a font-metric gap outside this direction's scope) before this task, and every control exercised by `.local/verify/field-notes.mjs` passed on the first hardened run, save for one weak assertion in the check script itself (the side-column pick-up check originally compared `.note` div counts, which do not move because the empty-state placeholder is itself a `.note`; rewritten to check the specific signal text disappearing and the specific empty-state text appearing, on both sides).

## Not verified pixel-wise / behaviourally (and why)

- **`GroupModal`'s "invite created" screen, `WhyModal`'s opened technical-details panel, `RuleModal`'s "change an existing rule" branch** — shared-layer internals, out of this direction's scope; see `docs/prototypes/inventory/shared.md`.
- **"Elsewhere in the register" pick-up individually** — uses the identical `pickUp` control already exercised live by the "Left here for you" check above; the dispatch table (`fulfil`/`validate`/`setOpState`/`propose`/`logEvent`) is shared-store logic, covered by `bun run check:prototypes`.
- **The tab-id cosmetic rename** (`'commit'`→`'requests'`, `'attached'`→`'linked'` between the original's internal state key and the port's `ViewOf<'field-notes'>` union) has no observable effect: both bind the same label to the same content in the same tab-row position, confirmed by the `requests`/`linked` compare pairs and the matching `.local/verify/field-notes.mjs` tab checks.

## Report row count

31/31 `.local/verify/field-notes.mjs` checks passed (see the script's own output for the exact list), plus the compare pairs enumerated above (all already green under `bun run compare:prototypes field-notes`). Every row's "Verified" column names a real, executed check.
