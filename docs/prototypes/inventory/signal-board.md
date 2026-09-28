# Signal Board (D) — control inventory

Every interactive control in `docs/prototypes/original/prototypes/D.jsx`, what it does in the original, its counterpart in the port (`src/lib/prototypes/directions/signal-board/`), and how it was verified. "Verified" means one of: a compare pair in `scripts/compare/pairs/signal-board.ts` (pixel fidelity), a check in `scripts/verify/signal-board.mjs` (a headless Playwright run against the live port), or, where the control is a shared UI-kit component this direction does not own, code inspection confirming the same props are wired through.

Shared-store actions (`pickUp`, `advance`, `addRule`, `transferCustody`, and so on) and the modal components they open (`CreateNdoModal`, `AttachModal`, `ProfileModal`, ...) live in `$lib/prototypes/store` and `$lib/prototypes/ui`, owned by the shared-layer builder. This board only owns getting the user *to* those modals with the right arguments; their own fields are not re-inventoried here.

## Header

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Group scope chips ("All my groups", first 3 groups, "+N more" select) | Narrows the board and the "Just happened" column to one group; the drawer stays open across a scope change if the selected NDO is still visible | `GroupScope` (shared) with a `chip` snippet in `App.svelte`; `setScope` updates `?group=` | Compare pair `default`; functional check "scope chip narrows the board" (16 → 7 cards) |
| "+ Add resource" button | Opens `CreateNdoModal`; the new NDO opens in the drawer on create | `modals.open({ type: 'create', after: setOpen })` | Functional check "+ Add resource opens a modal" |
| "+ Group" button | Opens `GroupModal`; the new group becomes the scope on create | `modals.open({ type: 'group', after: setScope })` | Functional check "+ Group opens a modal" |
| Menu (avatar + "Menu" + ▾) | Opens `FlowMenu`: profile, groups, resources, prototype actions, and (when a resource is open) that resource's own actions | `<FlowMenu ndo={open} onOpen={setOpen} onGroup={setScope} />` | Functional check "Menu button opens the flow menu" |
| Offline toggle ("● 23 peers" / "○ offline") | Toggles the mock's offline write queue; queued traces gossip in on reconnect | `proto.actions.toggleOffline()` | Functional check "offline toggle changes label" |
| Receipts ("◆ N receipts") | Opens `ReceiptsModal` | `modals.open({ type: 'receipts' })` | Functional check "receipts button opens a modal" |
| Profile (avatar + name) | Opens `ProfileModal` | `modals.open({ type: 'profile' })` | Functional check "profile button opens a modal" |
| "reset" | Reseeds the mock back to the example network | `proto.actions.reset()` | Functional check "reset reseeds the example network" |

## Board

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Signal card (click the card body) | Opens that signal's resource in the drawer | `SignalCard`'s `onCardClick`, ignoring clicks on its own controls | Compare pairs `default`, `drawer`; functional check "card click opens the drawer" |
| Signal card verb button ("Approve", "Done it", "Ask to borrow", "Log work", ...) | Runs `P.actions.pickUp(sig)`, the zome call the signal was derived from; a rejection (e.g. validating your own item) shows inline | `proto.actions.pickUp(sig)`; `ErrorNote` on failure | Compare pair `default`; functional check "Approve changes state" |
| Signal card "why" footer | Opens `WhyModal` for that signal, independent of the drawer | `modals.open({ type: 'why', sig, ndo: sig.ndo })` | Compare pair `why`; functional check "why link opens a modal" |
| "Just happened" card (click) | Opens the trace's resource in the drawer | `HappenedCard`'s `onclick` | Code inspection: same `onopen(t.ndo)` call as the board's own cards; the compare `default` pair covers its appearance |
| Card hover (lift + shadow) | `.card:hover{transform:translateY(-2px);box-shadow:...}` | Same rule, ported verbatim | Compare pair `hover` |
| Empty lane placeholder | "Nothing here right now." when a lane has no signals | `.empty` block in `App.svelte` | Visible whenever a scoped lane is empty (for example after narrowing to a group with only one signal); code inspection confirms the exact original copy |

## Drawer

| Control | Original behaviour | Port counterpart | Verified |
|---|---|---|---|
| Close ("✕") | Closes the drawer | `onclose` | Compare pair `drawer`; functional check "drawer close button closes it" |
| Backdrop click | Closes the drawer | `button.backdrop`'s `onclick` | Functional check "drawer backdrop closes it" |
| Escape key | Closes the drawer, unless a modal is open on top of it (the modal's own Escape wins) | `onkeydown` guard on `modals.current` | Code inspection: same guard `ui.jsx`'s `PModal` uses for itself |
| "Log work" (primary action) | Opens `NoteModal` | `modals.open({ type: 'note', ndo: id })` | Compare pair `drawer`; functional check |
| "Link NDO" | Opens `AttachModal` | `modals.open({ type: 'attach', ndo: id })` | Functional check; label corrected to match the original exactly (see Fixes below) |
| "Lifecycle" | Opens `AdvanceModal` | `modals.open({ type: 'advance', ndo: id })` | Functional check |
| "Items" | Opens `ResourcesModal` | `modals.open({ type: 'resources', ndo: id })` | Functional check |
| "Ask to borrow" | Opens `CommitModal` | `modals.open({ type: 'commit', ndo: id })` | Functional check |
| "+ Rule" | Opens `RuleModal` | `modals.open({ type: 'rule', ndo: id })` | Functional check |
| Request row "Mark done" | Opens `CommitmentsModal` scoped to this NDO | `modals.open({ type: 'commitments', ndo: id })` | Functional check "Mark done opens the commitments modal" |
| Signal row verb button | Same `pickUp` as a board card, scoped to this NDO; a failure shows inline | `pickUp(g)` + `ErrorNote` | Functional check "drawer signal row pick-up changes state" |
| Trail row | Read-only: agent, action text, quoted note, and either the elapsed time or the write-lifecycle stage | Static row; `fmtAgo` / `stageLabel` | Compare pair `drawer`; code inspection |
| Linked resources pills | Read-only: hard-link type and direction arrow to the other NDO's name | Static pills | Compare pair `drawer` |

## Fixes made to reach this state

Two behavioural bugs were found and corrected in this direction's own files while chasing pixel fidelity, beyond the palette and typeface work.

- **"Just happened" order.** The port sorted recent traces by `ago` ascending; the original does not sort at all, it filters and slices in the traces array's own order. Fixed in `App.svelte`, which is why the column now shows the same second item ("Sarah approved Marco to hold it") the original does, not a reordered one.
- **Drawer label.** The port's "Link a resource" button read differently from the original's "Link NDO". Fixed in `Drawer.svelte` to the exact original string.

## Not this direction's to fix

- The shared `paths.logoMark()` asset is a different crop of the mark than the original's `background-position` crop of its full logo file; every A to E direction uses the same asset.
- `FlowMenu`, `ModalHost` and every modal's own fields (`ProfileModal`'s form, `ResourcesModal`'s per-item controls, and so on) are shared UI-kit components; this inventory only verifies that this direction reaches them with the right arguments, not their own internals.
