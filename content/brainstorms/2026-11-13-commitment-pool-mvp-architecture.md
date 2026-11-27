---
title: "Commitment Pool MVP: the architecture of Tibi's experiment"
date: 2026-11-13
template: architecture
lifecycle: architecture
project: nondominium
status: decided
summary: "The commitment-pool-experiment branch at 00f6c0d as it stands: a Group is a pool, a Commitment lives on its NDO, and fulfillment is one closure. Five decisions settle what reaches dev and when: capability slots in v0.2, the design-system adapters and the Use and Consume fork in v0.3."
lang: en
sha: 00f6c0d6fcab55bf287225776a88f7364259eb66
---

# Commitment Pool MVP (Tibi's experiment)

The architecture of Tibi's `commitment-pool-experiment` branch at 00f6c0d, drawn as it stands: a Group is a pool, a Commitment lives on its NDO, and fulfillment is one closure that writes the event, the claim and two verifiable receipts.
Every box marked **new** or **modified** is what the branch adds over `dev` at c18e926 (the merge of #183); unmarked boxes are already on `dev`.
Companion of the review notes on the branch, which hold the line-level findings.

How to work it: walk the maps (double-click a box to open its level), open a box for its spec, then pick on each decision card.
The decisions are only the ones that concern `dev`; the experiment's own calls are Tibi's, listed under Evidence, and the open points on the pool's authorisation are findings on the PR board.

## Evidence

Source of this board: the branch's own summary `documentation/Applications/commitment-pool-experiment.md` (sections 5 to 8), checked against the code at 00f6c0d.

Tibi's locked decisions, as his doc states them:

| Question | His choice |
|---|---|
| What is a pool? | A Group cell |
| Where does the commitment live? | On the NDO cell; the pool only points |
| Who may admit? | Any group member (not enforced in validation; see the PR board) |
| Withdrawal | A status mark, never a delete (pool memory) |
| Fulfillment | `call_remote` countersign inside one closure; offline counterparty fails cleanly |
| Pool listing | Group-side `CommitmentAnchor`, not a `CapabilitySlot` (CS is not coded yet) |
| Inventoriable fork | Use or Consume on Layer 0, Physical and Hybrid only |
| Consume identity | The NDO is the batch; a new delivery is a new NDO |
| Batch closure | `EndOfLife` or `Deprecated` with a `closure_reason` such as `Depleted` |
| Design system | Sibling checkout of `release-prototype` through a Vite alias |
| Merge to `dev` | Not automatic; slices after Grassroots Economics feedback |

```board-components
- id: member
  name: Pool member
  level: system
  kind: person
  does: A participant of a group who lists promises, admits them into the pool and fulfills them with a counterparty.
- id: ge
  name: Grassroots Economics collaborators
  level: system
  kind: person
  does: The commitment-pooling community the experiment is built to show the admit, fulfill and receipt loop to.
- id: happ
  name: Nondominium hApp
  level: system
  kind: service
  tech: Holochain 0.7, SvelteKit
  does: The multi-DNA hApp where a Group doubles as a Commitment Pool over NDO commitments.
  change: modified
- id: dsys
  name: Nondominium design system
  level: system
  kind: external
  tech: "@nondominium/ndo-ui, release-prototype branch"
  does: The sibling repository whose Resource Perspective components the experiment remixes into the hApp.
  change: new

- id: ui
  name: hApp UI
  level: container
  parent: happ
  kind: ui
  tech: SvelteKit 2, Svelte 5, Effect-TS
  does: Lobby, Group and NDO views, now in design-system chrome, with the pool surfaces kept live.
  change: modified
- id: groupdna
  name: Group DNA
  level: container
  parent: happ
  kind: service
  tech: Rust, HDK 0.7
  does: One cloned cell per group, holding membership, NDO anchors and now the pool's commitment anchors.
  change: modified
- id: ndodna
  name: Nondominium DNA
  level: container
  parent: happ
  kind: service
  tech: Rust, HDK 0.7
  does: NDO identities, resources and governance, where commitments, events, claims and receipts live.
  change: modified
- id: shared
  name: Shared crate
  level: container
  parent: happ
  kind: module
  tech: Rust, nondominium_shared
  does: Types both DNAs share, now with the Use and Consume fork and closure reasons beside Measure.
  change: modified

- id: poolui
  name: Pool surfaces
  level: component
  parent: ui
  kind: ui
  tech: Svelte 5
  does: Pool section on the Group, admit and fulfill modals on the NDO, and the participation claims panel.
  change: new
  code:
    - ui/src/lib/components/group/PoolSection.svelte:1-134
    - ui/src/lib/components/ndo/AdmitToPoolModal.svelte:1-88
    - ui/src/lib/components/ndo/FulfillCommitmentModal.svelte:1-60
    - ui/src/lib/components/ndo/ParticipationClaimsPanel.svelte:1-78
- id: dsshell
  name: Design-system shell
  level: component
  parent: ui
  kind: ui
  tech: Svelte 5, ndo-ui
  does: Group Resource and Agent perspectives, agent directory, NDO create wizard and the Layer 1 resources panel.
  change: modified
  code:
    - ui/src/lib/components/group/NdoCreateWizard.svelte:1-87
    - ui/src/lib/components/group/GroupView.svelte:1-40
    - ui/src/lib/components/group/AgentDirectory.svelte:1-40
- id: adapters
  name: Design-system adapters
  level: component
  parent: ui
  kind: module
  tech: TypeScript
  does: The boundary between design-system types and DHT types, plus the governance template to RuleData map.
  change: new
  code:
    - ui/src/lib/utils/ndo-ui-adapters.ts:1-60
    - ui/src/lib/utils/governance-template-map.ts:1-60
- id: services
  name: Zome services and stores
  level: component
  parent: ui
  kind: module
  tech: Effect-TS, Svelte runes
  does: Keeps zome calls out of components; adds admit, pool contents and fulfillment closure calls.
  change: modified
  code:
    - ui/src/lib/services/zomes/group.service.ts:270-305
    - ui/src/lib/services/zomes/governance.service.ts:355-370

- id: anchor
  name: Commitment anchor
  level: component
  parent: groupdna
  kind: module
  tech: zome_group
  does: A thick cross-cell pointer that admits a commitment into the pool; withdrawal rewrites its status and keeps it as pool memory.
  change: new
  code:
    - dnas/group/zomes/integrity/zome_group_integrity/src/lib.rs:112-130
    - dnas/group/zomes/coordinator/zome_group/src/commitment_anchor.rs:41-66
    - dnas/group/zomes/coordinator/zome_group/src/commitment_anchor.rs:182-209
- id: membership
  name: Group membership
  level: component
  parent: groupdna
  kind: module
  tech: zome_group
  does: Membership entries and the member list; its validation accepts any entry today.
- id: ndoanchor
  name: NDO anchor
  level: component
  parent: groupdna
  kind: module
  tech: zome_group
  does: The pattern the commitment anchor copies, a pointer from a group to an NDO cell with immutable coordinates.
  code:
    - dnas/group/zomes/integrity/zome_group_integrity/src/lib.rs:58-70

- id: commitments
  name: Commitments per NDO
  level: component
  parent: ndodna
  kind: module
  tech: zome_gouvernance
  does: Proposes commitments with an explicit receiver and lists them per NDO with author and fulfilled flag.
  change: modified
  code:
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/commitment.rs:156-245
- id: fulfill
  name: Fulfillment closure
  level: component
  parent: ndodna
  kind: module
  tech: zome_gouvernance
  does: One call that gets the counterparty's countersignature, writes the event and the claim, updates the resource state and issues both receipts.
  change: modified
  code:
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/fulfillment.rs:118-140
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/fulfillment.rs:345-370
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/fulfillment.rs:537-560
- id: identity
  name: NDO identity
  level: component
  parent: ndodna
  kind: module
  tech: zome_resource
  does: Layer 0 identity, now carrying the Use or Consume fork and a closure reason, and seeding Layer 1 inventory when the stage allows it.
  change: modified
  code:
    - dnas/nondominium/zomes/integrity/zome_resource/src/lib.rs:92-153
    - dnas/nondominium/zomes/coordinator/zome_resource/src/ndo_identity.rs:244-330
    - dnas/nondominium/zomes/coordinator/zome_resource/src/ndo_identity.rs:689-710
- id: inventory
  name: Layer 1 inventory
  level: component
  parent: ndodna
  kind: store
  tech: zome_resource
  does: ResourceSpecification with its foreshadow fields and the EconomicResource instances events act on.

- id: types
  name: Shared types
  level: component
  parent: shared
  kind: module
  tech: Rust
  does: Measure, and the new EconomicMode, UseKind and ClosureReason enums.
  change: modified
  code:
    - crates/shared/src/types.rs:140-175
    - crates/shared/src/types.rs:320-340
```

```board-relations
- from: member
  to: happ
  says: lists, admits and fulfills commitments
- from: ge
  to: happ
  says: walks the admit, fulfill and receipt loop
- from: happ
  to: dsys
  says: imports components and tokens
  via: file path and Vite alias
  change: new

- from: ui
  to: groupdna
  says: admits, withdraws, reads the pool
  via: zome calls on the group clone
- from: ui
  to: ndodna
  says: creates NDOs, proposes and fulfills commitments
  via: zome calls
- from: groupdna
  to: ndodna
  says: points at commitments
  via: cross-cell coordinates, no call
  change: new
- from: ndodna
  to: shared
  says: uses types
- from: groupdna
  to: shared
  says: uses types

- from: poolui
  to: services
  says: admit, pool contents, fulfill
- from: dsshell
  to: adapters
  says: converts design-system shapes
- from: adapters
  to: services
  says: create inputs and rule data
- from: anchor
  to: ndoanchor
  says: copies the pointer and immutability pattern
- from: anchor
  to: membership
  says: documented as gated by, not enforced
- from: fulfill
  to: commitments
  says: refetches the commitment and refuses a fulfilled one
- from: fulfill
  to: inventory
  says: updates the operational state
  via: same-agent cross-zome call
- from: identity
  to: inventory
  says: hard dual create of spec and resource
  change: new
```

```board-adrs
- id: D1
  title: How does dev take the design-system package?
  context: "Soushi wants the design-system adapters (ndo-ui-adapters.ts, governance-template-map.ts) on dev. They import @nondominium/ndo-ui, which the branch takes as file:../../nondominium-design-system/packages/ndo-ui plus Vite aliases. A fresh clone and CI cannot resolve that path."
  options:
    - pick: Publish @nondominium/ndo-ui to npm with a version
      effect: "Resolvable anywhere; the design system needs a release step, as the hREA GraphQL adapter already has."
    - pick: Vendor a packed tarball in the repo
      effect: "Resolvable, but each design-system change means a new tarball commit."
    - pick: Keep the adapters off dev until the package exists
      effect: "Nothing to build now; the v0.1 UI keeps its own components."
    - pick: Take it as a private nix flake input
      effect: "The design system stays private; nix develop provides the package to every machine that has access, CI included."
  lean: 0
  picked: 3
  why: "The adapters are the boundary between design-system and DHT types; they only make sense on dev with a dependency every machine resolves."
  consequences: "Soushi, 2026-11-13: the design system stays private, so no npm publish; it comes in as a nix flake input (decision recorded in [#205](https://github.com/Sensorica/nondominium/issues/205), v0.3). The file: path and the Vite aliases go."
  touches: [dsys, dsshell, adapters]
- id: D2
  title: Which slice of the experiment reaches dev next?
  context: "#183 took the protocol-general backend. What remains: the Use and Consume fork on NDO identity (five Sweettests), the pool (Tibi's experiment), the design-system UI remix."
  options:
    - pick: The Use and Consume fork, now
      effect: "Protocol-general and tested; the pool and the UI stay on the branch."
    - pick: The design-system adapters, once D1 is settled
      effect: "UI groundwork for v0.2; no DNA change."
    - pick: Nothing until Grassroots Economics feedback
      effect: "No drift work now; a larger rebase later."
  lean: 0
  why: "Same reasoning that sent the backend through #183: it is not pool-specific and it carries its tests."
  consequences: "Soushi, 2026-11-13, against my lean: the design-system adapters come next ([#205](https://github.com/Sensorica/nondominium/issues/205)), then the Use and Consume fork ([#204](https://github.com/Sensorica/nondominium/issues/204)); both sit in [v0.3](https://github.com/Sensorica/nondominium/milestone/14). The pool stays on the branch."
  touches: [identity, types, dsshell]
  picked: 1
- id: D3
  title: Should initial_quantity reach dev as a Measure?
  context: "Only if D2 brings the fork to dev. The branch adds initial_quantity as Option<f64> beside default_unit: Option<String>, after #183 moved every other quantity to Measure."
  options:
    - pick: Port it as Option<Measure>
      effect: "One shape for quantities on dev; the cherry-pick carries a small change."
    - pick: Port it as the branch has it
      effect: "A verbatim cherry-pick; the split pair lands on an integrity entry."
  lean: 0
  why: "A new integrity field costs nothing to shape now and a DNA change later."
  consequences: "[#204](https://github.com/Sensorica/nondominium/issues/204) lands initial_quantity as Option<Measure>."
  touches: [identity, types]
  picked: 0
- id: D4
  title: Capability slots in v0.2
  context: "Soushi, 2026-11-13: plan the capability slot for the v0.2 milestone. The CS substrate (REQ-NDO-CS-01 to 04, 06) is not coded; #99 and #156 wait on it, and Tibi's section 8.3 names a CustomApp(CommitmentPool) slot as its NDO-side index. Filed as [#184](https://github.com/Sensorica/nondominium/issues/184)."
  options:
    - pick: Substrate only in v0.2, slot types as their own issues
      effect: "One small issue; #99, #156 and the pool slot follow on it."
    - pick: Substrate plus the commitment-pool slot together
      effect: "Proves the substrate on a real consumer, but ties it to the experiment's pace."
  lean: 0
  why: "Three consumers already wait on the substrate; it should not wait on any one of them."
  consequences: "[#184](https://github.com/Sensorica/nondominium/issues/184) is the substrate in [v0.2](https://github.com/Sensorica/nondominium/milestone/13), on Soushi's lane with hREA ([#185](https://github.com/Sensorica/nondominium/issues/185)); file-storage ([#99](https://github.com/Sensorica/nondominium/issues/99)) follows in v0.2, Flowsta ([#156](https://github.com/Sensorica/nondominium/issues/156)) and the pool slot later."
  touches: [identity, anchor]
  picked: 0
- id: D5
  title: What comes first, capability slots or work contexts?
  context: "Asked on this board at 16:27. Work contexts live in the group DHT (ADR of #168); capability slots attach to the NDO identity. Nothing filed makes one depend on the other."
  options:
    - pick: Capability slots in v0.2, work contexts in v0.3
      effect: "Unblocks #99 and #156 and the pool's slot first; v0.2 stays three lanes."
    - pick: Work contexts first
      effect: "Groups get their seam sooner; the slot consumers wait."
  lean: 0
  picked: 0
  why: "Two open issues already wait on the slot substrate; work contexts have no waiting consumer yet."
  consequences: "Soushi, 2026-11-13 16:13 and 16:32: slots ([#184](https://github.com/Sensorica/nondominium/issues/184)) in v0.2, work contexts ([#201](https://github.com/Sensorica/nondominium/issues/201)) in v0.3. v0.2 lanes: Soushi on hREA and slots, Tibi on NDO Layer 1 ([#206](https://github.com/Sensorica/nondominium/issues/206), [#207](https://github.com/Sensorica/nondominium/issues/207), [#141](https://github.com/Sensorica/nondominium/issues/141), [#144](https://github.com/Sensorica/nondominium/issues/144)), plus the standalone release ([#203](https://github.com/Sensorica/nondominium/issues/203))."
  touches: [identity, anchor]
```

```board-interfaces
- id: ifadmit
  component: anchor
  kind: function
  lang: rust
  signature: |
    pub struct AdmitCommitmentInput {
      pub group_hash: ActionHash,
      pub ndo_dna_hash: DnaHash,
      pub network_seed: String,
      pub identity_action_hash: ActionHash,
      pub commitment_action_hash: ActionHash,
    }
    #[hdk_extern] pub fn admit_commitment(input: AdmitCommitmentInput) -> ExternResult<Record>
    #[hdk_extern] pub fn withdraw_commitment(input: WithdrawCommitmentInput) -> ExternResult<Record>
    #[hdk_extern] pub fn get_pool_contents(group_hash: ActionHash) -> ExternResult<Vec<PoolEntry>>
  contract: "Admit writes an anchor in status Admitted and links it from the group. Withdraw supersedes the latest version with status Withdrawn and refuses a stale previous hash. The pool read returns both statuses."
- id: iffulfill
  component: fulfill
  kind: function
  lang: rust
  signature: |
    pub struct FulfillCommitmentClosureInput {
      pub commitment_hash: ActionHash,
      pub observed_quantity: Measure,
      pub resource_state_update: Option<OperationalState>,
      pub provider_metrics: PerformanceMetrics,
      pub receiver_metrics: PerformanceMetrics,
      pub note: Option<String>,
    }
    #[hdk_extern] pub fn fulfill_commitment_closure(input: FulfillCommitmentClosureInput)
      -> ExternResult<FulfillCommitmentClosureOutput>
  contract: "Called by the party who did not author the commitment. The author's conductor countersigns a payload it rebuilds itself; a fulfilled commitment is refused on both sides. A resource state update needs the caller to be its custodian."
- id: ifmode
  component: types
  kind: type
  lang: rust
  signature: |
    pub enum EconomicMode { Use, Consume }
    pub enum UseKind { Unit, Capacity }
    pub enum ClosureReason { Depleted, Spoiled, Withdrawn, WrittenOff, DonatedRemainder, Other }
  contract: "Set on NondominiumIdentity at creation and immutable after. Use needs a UseKind, Capacity needs max_concurrent_users of 2 or more, Consume needs a unit, a positive initial quantity and an identification pattern. A Consume NDO closes with a reason."
```
