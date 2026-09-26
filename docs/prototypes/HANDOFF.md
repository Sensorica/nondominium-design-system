# Handoff: Nondominium v0.1 UI prototypes

## Overview
These are six working UI directions for the Nondominium v0.1 release. Each one covers the full user journey:
1. Create a profile.
2. Create a group, join one with an invite link, or load the example network.
3. Declare a shared resource (NDO).
4. Manage it: lifecycle, rules, items and custody, requests (commitments), approvals, private receipts and offline mode.

The goal is for Tibi to pick one direction (or combine several) and implement it in our custom design system repo (Sensorica/nondominium-design-system, SvelteKit + UnoCSS + custom elements) against the real hApp (Sensorica/nondominium@dev).

The audience is people new to resource sharing, not ValueFlows experts. The default UI uses everyday words. A **Developer details** switch adds the technical layer: zome function names, hashes and rule chains.

## About the design files
The files in this bundle are **design references built in HTML**. They are prototypes that show the intended look and behaviour, not production code to copy. Recreate them in the design-system repo's own environment:
- Svelte components and custom elements.
- The existing `ndo-badge`, `ndo-button`, `ndo-card` and `ndo-status-dot`.
- The tokens in `static/tokens.css`.

Wire them to the real zome calls listed in `prototypes/BACKEND.md`.

## Fidelity
- **F Flow Graph** is **high-fidelity** and already uses the Nondominium design system: its tokens, its Badge and Button components, and the badge shape grammar. Recreate it close to pixel-perfect.
- **A–E** are **mid-fidelity explorations**. Each has its own deliberate visual style for comparison: A dark field, B paper register, C technical instrument, D signal board, E holarchy rings. Use them for layout, flow and interaction. Restyle them with the design system's tokens and components; don't copy their palettes.

## How to run
Open `prototypes/index.html` in a browser (served over http, not file://). It links to all six prototypes.
- `A Mycelium.html?fresh=1` (or any A–E page with `?fresh=1`) starts as a new agent: no profile, no groups.
- The **Menu ▾** button (⌘K) in every prototype lists every flow. Its **Prototype** section has "Start over as a new person", "Reload the example" and "Developer details".
- `export/` has standalone offline builds of A–E, one file each.

## Screens / directions

### A · Mycelium (`A Mycelium.html`, `A.jsx`)
- **Layout:** 64px icon rail, a fluid SVG field of NDO nodes, and a 380px detail panel on the right. A 36px status bar at the bottom shows peers, the offline toggle and queued traces.
- **Field:** nodes glow with recent activity ("heat"). Links show use, citations and hard links. A fade slider (1–90 days) controls how long trails stay visible. Seeded NDOs have fixed positions; new ones go on a golden-angle spiral, and the viewBox grows to fit any number.
- **Rail views:** Field, Signals (the derived suggestions), Traces (activity) and You (profile, receipts, reputation).
- **Panel:** title, badges, 28-day activity bars, action buttons, needs attention, activity and linked resources. The actions are Log work, Lifecycle, Items & holders, Requests and + Rule.

### B · Field Notes (`B Field Notes.html`, `B.jsx`)
- **Layout:** 300px searchable index grouped by group (each group collapses), a centre "page" for the NDO, and a 290px side column for "Left here for you" and receipts.
- **Tabs:** The trail, Rules & items, Requests and Linked.

### C · Instrument (`C Instrument.html`, `C.jsx`)
- **Top bar:** every NDO in a scrolling bar, plus Browse.
- **Left panel ("spec sheet"):** stage, ownership, type, use, rules, items with holders, needs attention and requests.
- **Centre:** a bench diagram of everything attached to the NDO (group listing, rules, items, requests, linked resources). A 30-day activity chart sits below it.

### D · Signal Board (`D Signal Board.html`, `D.jsx`)
- **Columns:** Needs hands, Available now and Needs eyes, all derived from real data, plus a "Just happened" activity column.
- **Group scope:** chips for the first 3 groups, then a "+N more groups" select.
- **Card:** clicking one opens a drawer for its resource with requests, activity and linked resources.

### E · Holarchy (`E Holarchy.html`, `E.jsx`)
- **Levels:** zoomable Lobby → Group → NDO rings. Groups are laid out on a grid for any N; a group with more than 12 NDOs uses two rings. Scrolling down on the canvas goes up a level.
- **NDO view:** concentric rings for identity, rules, items and linked resources, with signal dots.
- **Right card:** a summary of each ring and the actions for it.

### F · Flow Graph (`F Flow Graph.dc.html`, `ndo-backend.js`)
Inspired by the hREA Playground graph, but aimed at end users.
- **Canvas:** 8 columns in ValueFlows order: Groups, People, Shared resources, Rules, Items, Promises, What happened and Receipts. Each card is a source-chain entry and arrows show references. Pan and zoom with Fit, a minimum zoom of 85%, and a sticky column header you can click to jump.
- **Perspective:** the header switches between Whole network and each of two conductors. Entries that haven't arrived yet show dashed with "syncing…". Private receipts appear only on their owner's conductor.
- **Right panel:** collapsible. With nothing selected it shows the scenario picker and guided steps. With a card selected it shows plain-language details, who has it, what it's connected to, its history, and the actions available to the current person. Forms map one to one onto zome inputs.
- **Bottom:** an Activity feed of zome calls (collapsed by default) and each conductor's online/offline toggle.
- **Three scenarios** from the user stories: equipment sharing (ERP bridge), open science, and ArtCoin.

## Interactions & behaviour (shared)
- **Onboarding** (`Onboarding` in `ui.jsx`) shows when there's no profile or no group:
  1. **Profile:** name, handle ≤ 64 characters, bio, avatar URL (https only; otherwise initials on a colour derived from the agent key).
  2. **Start:** join the example network, start from a blank canvas (a new group), or paste an invite link. The demo invite is `ndo-invite:food-7k2p`.
  3. **First NDO:** optional.
- **Write lifecycle:** each write shows a toast that moves through "Saved on your device" → "Sharing with your groups" (n of 23) → "Shared and confirmed". When offline, writes queue and propagate on reconnect.
- **Backend rules enforced in the UI**, with friendly error text:
  - Only the initiator can change the lifecycle stage.
  - Only the custodian can transfer custody or change an item's operational state.
  - Moving to Deprecated requires a successor.
  - Nobody can validate their own resource.
  - A commitment can only be claimed once.
- **Allowed lifecycle transitions** (integrity state machine):
  - The forward chain: Ideation → … → Active.
  - Any non-terminal stage can be suspended to Hibernating; resuming returns to its origin stage.
  - Any stage can go to Deprecated (needs a successor) or EndOfLife.
  - Deprecated can only go to EndOfLife.
- **Fulfilling a commitment** runs, in order: [`transfer_custody` →] `log_economic_event` → `claim_commitment` → `issue_participation_receipts`. Receipt types by action:
  - TransferCustody → CustodyTransfer / CustodyAcceptance
  - AccessForUse → RuleCompliance
  - Work / Modify → MaintenanceFulfillmentCompleted
  - Move → TransportFulfillmentCompleted
- **Signals are derived, never stored** (`deriveSignals` in `core.jsx`):
  - Fulfil: open commitments where you are provider or receiver.
  - Validate: other people's commitments, and PendingValidation items.
  - Make available: your own approved items.
  - Request: Available items held by others.
  - Maintenance: NDOs with a MaintenanceSchedule rule.
- **"Why am I seeing this?"** shows In short, What you can do, and the resource's rules. The technical chain is only available with Developer details on.

## Plain-language layer
The `PLAIN` map in `core.jsx` (and `F_WORD` / `F_TYPE` / `F_LANE` in F) translates backend enums into UI words. Examples:
- Hibernating → Paused, Deprecated → Replaced, EndOfLife → Retired
- Pool → Shared pool, Nondominium → Uncapturable, Collective → Co-owned
- PendingValidation → Waiting for approval, InTransit → On the move
- AccessForUse → Borrow, TransferCustody → Hand over
- AccountableAgent → Trusted member, PrimaryAccountableAgent → Steward
- Commitment → Request / Promise, EconomicEvent → What happened

Keep this mapping in one module in the design system so every screen uses the same words.

## State management
- **Profile:** `{ name, handle, bio, avatar, private: { email, location, time_zone } }` plus `roles[]`.
- **Groups:** `groups[] { id, name, desc, invite }`. Pending invites map an invite code to a group bundle.
- **NDOs:** `ndos[] { id, name, group, stage, regime, nature, rivalry, initiator, desc, hibernation_origin, successor }`.
- **Per NDO:** `rules{ ndo: [type, summary][] }` and `instances{ ndo: [label, OperationalState, custodian][] }`.
- **Commitments:** `commitments[] { ndo, action, provider, receiver, inst, note, status }`.
- **Other:** `validations{ ref: agent[] }`, `hardLinks[] { from, to, type }`, `traces[]` (activity), `receipts[]` (PPRs) and `offline`.
- **F** keeps entries keyed by hash, each with `held{ a, b }` per conductor. That is the per-conductor DHT view.

## Design tokens (F, and the target for A–E)
- **Source:** the Nondominium DS tokens (`tokens/colors.css`, as Tailwind RGB triplets: `rgb(var(--ndo-gray-100))` etc.).
- **Surfaces and primary:** app ground gray-100 #F3F4F6, cards white with a 1px gray-200 #E5E7EB border, 8px radius and shadow-sm; primary blue-600 #2563EB, hover blue-700.
- **Column dots in F:** Groups sky-700, People gray-500, Shared resources blue-600, Rules violet-700, Items green-700, Promises amber-600, What happened teal-700, Receipts rose-700.
- **Badge shape grammar:** filled tint = Layer 0 classification; dashed outline = property regime; 3px left edge + mono = Layer 1 rule; pill + dot = Layer 2 operational state. Use `BADGE_VARIANTS` from the DS Badge.
- **Type:** system-ui sans; mono for hashes. Scale 12/14/16/18/20/24; card titles 14/600, panel titles 20/700.
- **Spacing:** 4px steps. F cards are 218 × 116px, spaced 132px apart vertically, in 250px-wide columns.
- **Default avatar:** initials on one of 8 hues (#2E7D74, #3F6FDB, #7C55E6, #C2410C, #B45309, #0E7490, #BE185D, #4D7C0F), chosen by hashing the agent key. The design system has no avatar component yet; add one.

## Assets
- `prototypes/assets/nondominium_logo.png`, the brand logo from the hApp repo.
- There are no icons. The UI uses Unicode glyphs (+ → ← ⎘ ✓ ⚠ · ▾ ‹ ›), following the DS iconography rule.

## Files
- `prototypes/index.html`: entry point.
- `prototypes/A–E *.html` with `A.jsx`–`E.jsx`: one direction each.
- `prototypes/core.jsx`: store for A–E, the scenario data, derived signals and the plain-language map.
- `prototypes/ui.jsx`: shared modals, `FlowMenu`, `Onboarding`, `Avatar`, `GroupScope`, the help modal and friendly errors.
- `prototypes/F Flow Graph.dc.html` and `prototypes/ndo-backend.js`: F and its mock of the real zome API (same fn names, inputs, enums and validation messages).
- `prototypes/BACKEND.md`: maps each UI action to its zome call(s) and backend file, and lists known backend gaps.
- `docs/user-stories/`: the seven user stories the scenarios come from.
- `export/`: standalone offline builds of A–E.

## Known backend gaps to plan for
- `claim_commitment` sets `fulfilled_by` to the commitment hash, not the event (a TODO in `commitment.rs`). The PPR carries the real event link.
- `transfer_custody` does not log its own EconomicEvent, so the client calls `log_economic_event` right after.
- Group `remote_signal` is not implemented yet, so the UI has to poll.
