# C Instrument: interactive control inventory

Every interactive control in the handoff's `C.jsx` (`InstrumentApp`, `InSpec`, `InBench`, `InScope`), what it does in the original, its counterpart in this port, and how the same effect was verified.

Two verification paths are used, both under `.worktrees/feat-claude-design-fidelity`:

- **compare pair**: a pair in `scripts/compare/pairs/instrument.ts`, run with `ORIG_PORT=8794 bun run compare:prototypes instrument`. Confirms the control exists and renders identically; it does not exercise a click, so pairs with a `click`/`hover` step also confirm the resulting state renders correctly.
- **functional check**: `.local/instrument-check/functional.mjs` (`bun .local/instrument-check/functional.mjs`, dev server on `:5180`), a Playwright script that clicks each control against the live port and asserts the resulting modal title, URL or store value. 22/22 assertions pass as of this report.

| # | Control (C.jsx) | Original effect | Port counterpart | Verified |
|---|---|---|---|---|
| 1 | Profile avatar, top bar | Opens `ProfileModal` (`setM({type:'profile'})`) | `App.svelte` `.me` button → `modals.open({type:'profile'})` | functional check |
| 2 | NDO tab, top bar (one per NDO) | Selects that NDO on the bench (`setId(n.id)`) | `App.svelte` `.tab` button → `select(n.id)` → `goView('instrument','bench',{ndo})` | functional check (switches the spec sheet and updates `?ndo=`) |
| 3 | "+ new" tab | Opens `CreateNdoModal`, selecting the new NDO after creation | `App.svelte` `.tab` → `modals.open({type:'create', after: select})` | functional check |
| 4 | "browse N" tab | Opens `BrowseModal`, selecting the opened NDO | `App.svelte` `.tab` → `modals.open({type:'browse', onOpen: select})` | functional check |
| 5 | `FlowMenu` ("Menu ▾"), top bar | Opens the shared flow menu (every flow reachable from C, plus Start over / Reload example / Developer details) | `App.svelte` renders the shared `<FlowMenu ndo={id} onOpen={select} />`, unchanged | Shared component; its own items duplicate rows 1, 3, 4, 6, 8, 10, 15, 16, 20 above and are covered by the shared UI kit's own tests, not re-tested item by item here |
| 6 | Node online/offline toggle | Flips `P.s.offline`; queued traces re-gossip on return online | `App.svelte` `.stat` button → `proto.actions.toggleOffline()` | functional check (label flips online ↔ offline) |
| 7 | "peers 23" stat | Not interactive in the original (no `onClick`) | `App.svelte` renders it as a plain `<span>`, not a button | Read (both sides: no click handler) |
| 8 | "receipts N" stat | Opens `ReceiptsModal` | `App.svelte` `.stat` button → `modals.open({type:'receipts'})` | functional check |
| 9 | "reset" link | `P.actions.reset()`: clears local storage, reloads the seed | `App.svelte` `.stat.reset` button → `proto.actions.reset()` | functional check |
| 10 | "change" link (stage row) | Opens `AdvanceModal` for this NDO | `SpecSheet.svelte` `.lnk` → `modals.open({type:'advance', ndo:id})` | functional check |
| 11 | "+ add rule" link | Opens `RuleModal` for this NDO | `SpecSheet.svelte` `.lnk` → `modals.open({type:'rule', ndo:id})` | functional check |
| 12 | "who holds them" link (Items header) | Opens `ResourcesModal` for this NDO | `SpecSheet.svelte` `.lnk` → `modals.open({type:'resources', ndo:id})` | functional check |
| 13 | "why?" link (per signal) | Opens `WhyModal` explaining that signal | `SpecSheet.svelte` `.lnk` → `modals.open({type:'why', sig:g, ndo:id})` | functional check |
| 14 | Signal verb button (Approve / Fulfil / Make available / Request / Log work, per signal) | `P.actions.pickUp(sig)`: routes to `validate`, `fulfil`, `setOpState` or `propose` depending on the signal's kind | `SpecSheet.svelte` `.btn.sm` → `proto.actions.pickUp(g)` | functional check (signal count drops after Approve) |
| 15 | "Mark done" button (per open request) | Opens `CommitmentsModal` for this NDO | `SpecSheet.svelte` `.btn.sm` → `modals.open({type:'commitments', ndo:id})` | functional check |
| 16 | "Ask to borrow" button | Opens `CommitModal` for this NDO | `SpecSheet.svelte` `.btn.ghost` → `modals.open({type:'commit', ndo:id})` | functional check |
| 17 | "Log work" button | Opens `NoteModal` for this NDO | `SpecSheet.svelte` `.btn.ghost` → `modals.open({type:'note', ndo:id})` | functional check |
| 18 | "+ Link resource" button, bench header | Opens `AttachModal` for this NDO | `Bench.svelte` `.btn` → `modals.open({type:'attach', ndo:id})` | functional check, and the `attach-modal` compare pair (rendering) |
| 19 | "+ Rule" button, bench header | Opens `RuleModal` (same modal as row 11, second entry point) | `Bench.svelte` `.btn` → `modals.open({type:'rule', ndo:id})` | functional check |
| 20 | "+ Item" button, bench header | Opens `ResourcesModal` (same modal as row 12, second entry point) | `Bench.svelte` `.btn` → `modals.open({type:'resources', ndo:id})` | functional check |
| 21 | Filled socket (Group / Rule / Item / Request / Linked resource) | Toggles `pick`: shows the popover with type, label and author; a second click on the same socket closes it | `Bench.svelte` `<g class="socket">` → `toggle(l.id)`, a local `$state` scoped to the current NDO | functional check (popover appears), and the `socket-picked` compare pair (rendering, including the highlighted teal wire and box) |
| 22 | Open socket (the 12th slot) | Opens `AttachModal` for this NDO | `Bench.svelte` `<g class="socket socket--open">` → `attach()` | functional check |
| 23 | "close" link, popover | Clears `pick` | `Bench.svelte` `.lnk` → `picked = null` | functional check |

## Every row works

All 23 rows are wired and produce the same effect as the original; the functional check's 22/22 (row 7 is deliberately not a control, row 5 is a shared component not re-asserted here) confirms this against the live port.

## Additions over the original (ISA claim 41)

None beyond the standing design-system chrome (the exit chip, the `m` screen map, the `c` comments button) and the fresh-start entry, both outside this direction's own markup. The instrument hides the exit chip and the comments button per the direction's own brief; no control in the table above has an original counterpart that is missing, and no control exists in the port without one in `C.jsx`.
