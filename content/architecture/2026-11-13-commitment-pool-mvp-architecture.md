---
title: "Commitment pool MVP: the architecture of Tibi's experiment"
date: 2026-11-13
template: architecture
lifecycle: architecture
project: nondominium
status: open
summary: "Tibi's commitment-pool-experiment branch drawn as it stands: a Group is a pool, a Commitment lives on its NDO, and fulfillment is one closure that writes the event, the claim and two receipts. Marks what is on dev since #183 and what is branch only, with the decision cards that concern dev still open."
lang: en
repo: Sensorica/nondominium
sha: 057c5eb5b1a8ad0def907c05838d17fa872db747
---

# Commitment Pool MVP (Tibi's experiment)

The architecture of Tibi's `commitment-pool-experiment` branch at 057c5eb, drawn as it stands: a Group is a pool, a Commitment lives on its NDO, and fulfillment is one closure that writes the event, the claim and two verifiable receipts.
Every box marked **new** or **modified** is what the branch adds over `dev` at 91cfd11; unmarked boxes are already on `dev`.
Each box's spec says in words what of it is on `dev` and what is **branch only**; the code snippets are read at the branch head, so a snippet of a file `dev` also has can differ from `dev` by the lines the branch adds.
The general backend came to `dev` through [#183](https://github.com/Sensorica/nondominium/pull/183); the pool itself is on the [branch](https://github.com/Sensorica/nondominium/tree/commitment-pool-experiment), which has no PR because it is not meant to be merged.

**Updated on 17 November 2026.**
Checked against `dev` at 91cfd11 and the branch at 057c5eb, and against the 17 November Lab meeting with Tibi.
`dev` has not moved in code since #183 (its one later commit, #215, changes a README badge), so what #183 brought is now marked as on `dev` box by box: commitments per NDO, the fulfillment closure, `Measure` and the Layer 1 foreshadow fields.
The branch gained two commits: new commitment and event forms (2f5834c), and a refusal of a commitment whose provider and receiver are the same agent, with its Sweettest and a participation grammar spec (057c5eb); both are branch only.
The meeting decided that project management lives in the work context, not in the NDO: that settles nothing on the pool, but it adds D6 (where a pool attaches once work contexts exist) and a line to D5.
The local PR-board link is gone so the page can be published; the branch review's line-level findings stay off this page.

How to work it: walk the maps (double-click a box to open its level), open a box for its spec, then pick on each decision card.
The decisions are only the ones that concern `dev`; the experiment's own calls are Tibi's, listed under Evidence, and the open points on the pool's authorisation stay findings of the branch review.

## Evidence

Source of this board: the branch's own summary `documentation/Applications/commitment-pool-experiment.md` (sections 5 to 8), drawn at 00f6c0d on 13 November and checked again at 057c5eb on 17 November.

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

### What is on dev and what is not (17 November)

Read with `git log c18e926..origin/dev`, `git diff origin/dev origin/commitment-pool-experiment` and the [#183](https://github.com/Sensorica/nondominium/pull/183) description.

| Part | Where it is | Read in |
|---|---|---|
| `Measure` on commitments, events and resources | `dev`, from #183 | `crates/shared/src/types.rs` at 91cfd11, lines 298 to 330 |
| `NdoToCommitments` index and the hash-paired reads | `dev`, from #183 | `zome_gouvernance/src/commitment.rs` at 91cfd11, lines 99, 121, 157 and 197 |
| `fulfill_commitment_closure` and `countersign_fulfillment` with the unrestricted grant | `dev`, from #183, with the review fixes (non-author initiates, fulfilled once) | `zome_gouvernance/src/fulfillment.rs` at 91cfd11, lines 118, 177 to 189, 349 and 522; `zome_gouvernance/src/lib.rs` lines 43 to 63 |
| Layer 1 foreshadow fields on `ResourceSpecification` | `dev`, from #183 | `zome_resource` integrity `lib.rs` at 91cfd11, lines 15 to 53; `types.rs` lines 164 to 226 |
| A UI that calls the closure or the detailed reads | branch only | `git grep` finds no `fulfill_commitment_closure` call in `ui/src` on `dev` |
| `author` and `fulfilled` on `CommitmentRecord` | branch only | `commitment.rs` at 057c5eb, lines 170 to 210 |
| Distinct provider and receiver in `propose_commitment` | branch only (057c5eb, 14 November) | `commitment.rs` at 057c5eb, lines 61 to 72; Sweettest `propose_commitment_rejects_identical_provider_and_receiver` |
| `CommitmentAnchor`, admit, withdraw, pool contents | branch only | `commitment_anchor.rs` is absent on `dev` |
| Use and Consume fork, `ClosureReason`, hard dual create | branch only; [#204](https://github.com/Sensorica/nondominium/issues/204), v0.3 | `types.rs` at 057c5eb, lines 142 to 167 |
| Design-system shell and adapters | branch only; [#205](https://github.com/Sensorica/nondominium/issues/205), v0.3 | `ndo-ui-adapters.ts` is absent on `dev` |

`dev`'s `propose_commitment` still accepts a commitment whose provider and receiver are one agent, which Tibi's comment on the branch calls unfulfillable through the closure (`commitment.rs` at 057c5eb, lines 61 and 62); that check is protocol-general, not pool-specific.

### The 17 November Lab meeting

From the [meeting journal](https://design.sensorica.co/meetings/2026-11-17-lab?lang=fr), in its French original.

- **Decided:** project management lives at the level of the work context, not in the NDO, because one NDO can have several teams each with its own project management; the NDO carries a synthesis and links to the groups (Décisions, first point, citing P1 3 to 6 and 8 to 10). It bears on D5 and opens D6.
- **Discussed, not settled:** how much history the NDO carries, each version being a complete snapshot (Discussion, P1 2 to 6; Discuté, non tranché, first point). A pool entry points at the NDO's genesis `identity_action_hash`, never at a version, so nothing here changes until versions are designed.
- **Discussed, not settled:** forking the code isolates a fork from the network, going through the NDO's governance keeps it in (Discussion, P1 13 to 16). Nothing on this board depends on it.
- The meeting did not talk about the commitment pool itself.

The [v0.2 plan](https://github.com/Sensorica/nondominium/blob/dev/documentation/hREA/v0.2-release-plan.md) (section 4, Phase A) moves `zome_gouvernance::Commitment` and `EconomicEvent` onto hREA's `ReaCommitment` and `ReaEconomicEvent`, and keeps the participation receipts native for good ("Never migrates"); that is proposed, not coded, and it would change what the anchor's `commitment_action_hash` points at.

```board-components
- id: member
  name: Pool member
  level: system
  kind: person
  does: A participant of a group who lists promises, admits them into the pool and fulfills them with a counterparty.
  links:
    - label: "Design system: the app replica"
      url: "/app"
- id: ge
  name: Grassroots Economics collaborators
  level: system
  kind: person
  does: The commitment-pooling community the experiment is built to show the admit, fulfill and receipt loop to.
  links:
    - label: "Design system: the commitment pooling MVP brainstorm"
      url: "/brainstorms/2026-10-06-commitment-pooling-mvp"
- id: happ
  name: Nondominium hApp
  level: system
  kind: service
  tech: Holochain 0.7, SvelteKit
  does: "The multi-DNA hApp where a Group doubles as a Commitment Pool over NDO commitments. The hApp is on dev; the pool is branch only."
  change: modified
  links:
    - label: "Design system: the app replica"
      url: "/app"
- id: dsys
  name: Nondominium design system
  level: system
  kind: external
  tech: "@nondominium/ndo-ui, release-prototype branch"
  does: "The sibling repository whose Resource Perspective components the experiment remixes into the hApp. Branch only, through a file path and Vite aliases; dev is to take it as a private nix flake input (D1, #205, v0.3)."
  change: new
  links:
    - label: "#205: feat(ui): design-system adapters with a resolvable ndo-ui dependency"
      url: "https://github.com/Sensorica/nondominium/issues/205"
    - label: "Design system: the ndo-ui playbook"
      url: "/playbook"
    - label: "Design system: the ndo-ui UI kit"
      url: "/ui-kit"

- id: ui
  name: hApp UI
  level: container
  parent: happ
  kind: ui
  tech: SvelteKit 2, Svelte 5, Effect-TS
  does: "Lobby, Group and NDO views. On dev: the v0.1 views with the commitment and event forms from #183, which propose commitments and log events but never call the closure. Branch only: design-system chrome, the pool surfaces and the reworked forms of 2f5834c."
  change: modified
  links:
    - label: "PR #183: feat: bring Tibi's general backend work from commitment-pool-experiment onto dev"
      url: "https://github.com/Sensorica/nondominium/pull/183"
    - label: "Design system: the app replica"
      url: "/app"
- id: groupdna
  name: Group DNA
  level: container
  parent: happ
  kind: service
  tech: Rust, HDK 0.7
  does: "One cloned cell per group. On dev: membership and NDO anchors, and per ADR-014 the future home of work contexts. Branch only: the pool's commitment anchors."
  change: modified
  links:
    - label: "ADR-014-work-contexts-in-group-dht.md at 057c5eb"
      url: "https://github.com/Sensorica/nondominium/blob/057c5eb5b1a8ad0def907c05838d17fa872db747/documentation/specifications/adr/ADR-014-work-contexts-in-group-dht.md"
- id: ndodna
  name: Nondominium DNA
  level: container
  parent: happ
  kind: service
  tech: Rust, HDK 0.7
  does: "NDO identities, resources and governance. On dev since #183: commitments per NDO, the fulfillment closure with its receipts, Measure and the Layer 1 foreshadow fields. Branch only: the Use and Consume fork, the author and fulfilled flags on commitment reads, and distinct provider and receiver."
  change: modified
  links:
    - label: "PR #183: feat: bring Tibi's general backend work from commitment-pool-experiment onto dev"
      url: "https://github.com/Sensorica/nondominium/pull/183"
- id: shared
  name: Shared crate
  level: container
  parent: happ
  kind: module
  tech: Rust, nondominium_shared
  does: "Types both DNAs share. On dev: Measure and the foreshadow enums. Branch only: the Use and Consume fork and closure reasons."
  change: modified
  links:
    - label: "Source at 057c5eb: crates/shared/src/types.rs"
      url: "https://github.com/Sensorica/nondominium/blob/057c5eb5b1a8ad0def907c05838d17fa872db747/crates/shared/src/types.rs"

- id: poolui
  name: Pool surfaces
  level: component
  parent: ui
  kind: ui
  tech: Svelte 5
  does: "Pool section on the Group, admit and fulfill modals on the NDO, and the participation claims panel. Branch only: none of these files is on dev."
  change: new
  code:
    - ui/src/lib/components/group/PoolSection.svelte:1-134
    - ui/src/lib/components/ndo/AdmitToPoolModal.svelte:1-88
    - ui/src/lib/components/ndo/FulfillCommitmentModal.svelte:1-60
    - ui/src/lib/components/ndo/ParticipationClaimsPanel.svelte:1-78
  links:
    - label: "The commitment-pool-experiment branch"
      url: "https://github.com/Sensorica/nondominium/tree/commitment-pool-experiment"
    - label: "Source at 057c5eb: ui/src/lib/components/"
      url: "https://github.com/Sensorica/nondominium/tree/057c5eb5b1a8ad0def907c05838d17fa872db747/ui/src/lib/components"
- id: dsshell
  name: Design-system shell
  level: component
  parent: ui
  kind: ui
  tech: Svelte 5, ndo-ui
  does: "Group Resource and Agent perspectives, agent directory, NDO create wizard and the Layer 1 resources panel. Branch only: GroupView is on dev in its v0.1 form, the wizard and the directory are not."
  change: modified
  code:
    - ui/src/lib/components/group/NdoCreateWizard.svelte:1-87
    - ui/src/lib/components/group/GroupView.svelte:1-40
    - ui/src/lib/components/group/AgentDirectory.svelte:1-40
  links:
    - label: "Design system: the ndo-ui UI kit"
      url: "/ui-kit"
    - label: "Source at 057c5eb: ui/src/lib/components/group/"
      url: "https://github.com/Sensorica/nondominium/tree/057c5eb5b1a8ad0def907c05838d17fa872db747/ui/src/lib/components/group"
- id: adapters
  name: Design-system adapters
  level: component
  parent: ui
  kind: module
  tech: TypeScript
  does: "The boundary between design-system types and DHT types, plus the governance template to RuleData map. Branch only; next to reach dev (D2, #205, v0.3)."
  change: new
  code:
    - ui/src/lib/utils/ndo-ui-adapters.ts:1-60
    - ui/src/lib/utils/governance-template-map.ts:1-60
  links:
    - label: "#205: feat(ui): design-system adapters with a resolvable ndo-ui dependency"
      url: "https://github.com/Sensorica/nondominium/issues/205"
    - label: "Design system: the ndo-ui playbook"
      url: "/playbook"
    - label: "Design system: the ndo-ui UI kit"
      url: "/ui-kit"
- id: services
  name: Zome services and stores
  level: component
  parent: ui
  kind: module
  tech: Effect-TS, Svelte runes
  does: "Keeps zome calls out of components. On dev: propose_commitment, get_all_commitments and log_economic_event. Branch only: admit, withdraw, pool contents, the per-NDO detailed reads and the closure call."
  change: modified
  code:
    - ui/src/lib/services/zomes/governance.service.ts:195-230
    - ui/src/lib/services/zomes/group.service.ts:270-305
    - ui/src/lib/services/zomes/governance.service.ts:350-370
  links:
    - label: "Source at 057c5eb: ui/src/lib/services/zomes/"
      url: "https://github.com/Sensorica/nondominium/tree/057c5eb5b1a8ad0def907c05838d17fa872db747/ui/src/lib/services/zomes"

- id: anchor
  name: Commitment anchor
  level: component
  parent: groupdna
  kind: module
  tech: zome_group
  does: "A thick cross-cell pointer that admits a commitment into the pool; withdrawal rewrites its status and keeps it as pool memory. Branch only; it carries a group_hash and no work context (D6)."
  change: new
  code:
    - dnas/group/zomes/integrity/zome_group_integrity/src/lib.rs:112-130
    - dnas/group/zomes/coordinator/zome_group/src/commitment_anchor.rs:41-66
    - dnas/group/zomes/coordinator/zome_group/src/commitment_anchor.rs:182-209
  links:
    - label: "Source at 057c5eb: dnas/group/zomes/"
      url: "https://github.com/Sensorica/nondominium/tree/057c5eb5b1a8ad0def907c05838d17fa872db747/dnas/group/zomes"
- id: membership
  name: Group membership
  level: component
  parent: groupdna
  kind: module
  tech: zome_group
  does: "Membership entries and the member list; its validation accepts any entry today, on dev as on the branch."
  code:
    - dnas/group/zomes/integrity/zome_group_integrity/src/lib.rs:229-235
  links:
    - label: "Design system: replica of a group page"
      url: "/app/group/sensorica-lab-7f3a"
    - label: "Source at 057c5eb: dnas/group/zomes/integrity/zome_group_integrity/src/lib.rs"
      url: "https://github.com/Sensorica/nondominium/blob/057c5eb5b1a8ad0def907c05838d17fa872db747/dnas/group/zomes/integrity/zome_group_integrity/src/lib.rs"
- id: ndoanchor
  name: NDO anchor
  level: component
  parent: groupdna
  kind: module
  tech: zome_group
  does: "The pattern the commitment anchor copies, a pointer from a group to an NDO cell with immutable coordinates. On dev, the same lines 58 to 70; ADR-014 has work contexts name NDOs the same way."
  code:
    - dnas/group/zomes/integrity/zome_group_integrity/src/lib.rs:58-70
  links:
    - label: "ADR-014-work-contexts-in-group-dht.md at 057c5eb"
      url: "https://github.com/Sensorica/nondominium/blob/057c5eb5b1a8ad0def907c05838d17fa872db747/documentation/specifications/adr/ADR-014-work-contexts-in-group-dht.md"

- id: commitments
  name: Commitments per NDO
  level: component
  parent: ndodna
  kind: module
  tech: zome_gouvernance
  does: "Proposes commitments with an explicit receiver and lists them per NDO. On dev since #183: the NdoToCommitments index and the hash-paired reads. Branch only: the author and fulfilled flags on each record, and the refusal of a commitment whose provider and receiver are one agent. The v0.2 plan moves Commitment onto hREA (proposed)."
  change: modified
  code:
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/commitment.rs:61-72
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/commitment.rs:169-258
  links:
    - label: "PR #183: feat: bring Tibi's general backend work from commitment-pool-experiment onto dev"
      url: "https://github.com/Sensorica/nondominium/pull/183"
    - label: "Design system: replica of the commitment form"
      url: "/app/ndo/uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h?modal=commitment"
- id: fulfill
  name: Fulfillment closure
  level: component
  parent: ndodna
  kind: module
  tech: zome_gouvernance
  does: "One call that gets the counterparty's countersignature, writes the event and the claim, updates the resource state and issues both receipts. On dev since #183, with its Sweettests and no UI caller yet. Branch only: reworded errors, a custodian refusal among them."
  change: modified
  code:
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/fulfillment.rs:118-140
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/fulfillment.rs:345-370
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/fulfillment.rs:538-560
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/lib.rs:43-63
  links:
    - label: "PR #183: feat: bring Tibi's general backend work from commitment-pool-experiment onto dev"
      url: "https://github.com/Sensorica/nondominium/pull/183"
    - label: "Design system: replica of the event form"
      url: "/app/ndo/uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h?modal=event"
- id: identity
  name: NDO identity
  level: component
  parent: ndodna
  kind: module
  tech: zome_resource
  does: "Layer 0 identity. Branch only: the Use or Consume fork, a closure reason, and seeding Layer 1 inventory when the stage allows it, with initial_quantity still an f64 (dev takes it as a Measure, D3, #204)."
  change: modified
  code:
    - dnas/nondominium/zomes/integrity/zome_resource/src/lib.rs:92-153
    - dnas/nondominium/zomes/coordinator/zome_resource/src/ndo_identity.rs:244-330
    - dnas/nondominium/zomes/coordinator/zome_resource/src/ndo_identity.rs:689-710
  links:
    - label: "#204: feat(resource): bring the Use and Consume fork from the experiment branch"
      url: "https://github.com/Sensorica/nondominium/issues/204"
    - label: "Design system: replica of an NDO page"
      url: "/app/ndo/uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h"
- id: inventory
  name: Layer 1 inventory
  level: component
  parent: ndodna
  kind: store
  tech: zome_resource
  does: "ResourceSpecification with its foreshadow fields and the EconomicResource instances events act on; on dev since #183, where only the custodian may update a resource's operational state."
  code:
    - dnas/nondominium/zomes/integrity/zome_resource/src/lib.rs:16-53
    - dnas/nondominium/zomes/coordinator/zome_resource/src/economic_resource.rs:509-528
  links:
    - label: "PR #183: feat: bring Tibi's general backend work from commitment-pool-experiment onto dev"
      url: "https://github.com/Sensorica/nondominium/pull/183"

- id: types
  name: Shared types
  level: component
  parent: shared
  kind: module
  tech: Rust
  does: "Measure, on dev since #183, and the EconomicMode, UseKind and ClosureReason enums, branch only."
  change: modified
  code:
    - crates/shared/src/types.rs:140-175
    - crates/shared/src/types.rs:320-340
  links:
    - label: "PR #183: feat: bring Tibi's general backend work from commitment-pool-experiment onto dev"
      url: "https://github.com/Sensorica/nondominium/pull/183"
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
  says: reads members, anchors NDOs (on dev)
  via: zome calls on the group clone
- from: ui
  to: groupdna
  says: admits, withdraws, reads the pool (branch only)
  via: zome calls on the group clone
  change: new
- from: ui
  to: ndodna
  says: creates NDOs, proposes commitments, logs events (on dev)
  via: zome calls
- from: ui
  to: ndodna
  says: reads commitments per NDO, fulfills them through the closure (branch only)
  via: zome calls
  change: new
- from: groupdna
  to: ndodna
  says: points at commitments (branch only)
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
  says: refetches the commitment, lets only the non-author initiate, refuses a fulfilled one (on dev)
- from: fulfill
  to: inventory
  says: updates the operational state, custodian only (on dev)
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
  consequences: "Soushi, 2026-11-13, against my lean: the design-system adapters come next ([#205](https://github.com/Sensorica/nondominium/issues/205)), then the Use and Consume fork ([#204](https://github.com/Sensorica/nondominium/issues/204)); both sit in [v0.3](https://github.com/Sensorica/nondominium/milestone/14). The pool stays on the branch. Checked 17 November: both issues are still open in v0.3, and `dev` has taken nothing from the branch since #183. The branch's 14 November refusal of a commitment with the same provider and receiver (057c5eb) is protocol-general too, and no issue carries it yet."
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
  context: "Soushi, 2026-11-13: plan the capability slot for the v0.2 milestone. The CS substrate (REQ-NDO-CS-01 to 04, 06) is not coded; #99 and #156 wait on it, and Tibi's section 8.3 names a CustomApp(CommitmentPool) slot as its NDO-side index."
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
  consequences: "Soushi, 2026-11-13 16:13 and 16:32: slots ([#184](https://github.com/Sensorica/nondominium/issues/184)) in v0.2, work contexts ([#201](https://github.com/Sensorica/nondominium/issues/201)) in v0.3. v0.2 lanes: Soushi on hREA and slots, Tibi on NDO Layer 1 ([#206](https://github.com/Sensorica/nondominium/issues/206), [#207](https://github.com/Sensorica/nondominium/issues/207), [#141](https://github.com/Sensorica/nondominium/issues/141), [#144](https://github.com/Sensorica/nondominium/issues/144)), plus the standalone release ([#203](https://github.com/Sensorica/nondominium/issues/203)). Lab meeting of 17 November (journal, Décisions, first point): project management lives in the work context, not in the NDO, since one NDO can have several teams; the NDO carries a synthesis and links to its groups. That says what a work context is for and leaves this order as it is; where a pool attaches once work contexts exist is D6."
  touches: [identity, anchor]
- id: D6
  title: Once work contexts are on dev, where does a pool attach?
  context: "Opened 17 November from the Lab meeting: project management lives in the work context, not in the NDO, because one NDO can have several teams, each with its own project management (journal, Décisions, first point, P1 3 to 10). ADR-014 puts work contexts in the group DHT and has them name NDOs by clone coordinates, as NdoAnchor does (documentation/specifications/adr/ADR-014-work-contexts-in-group-dht.md, lines 25 to 31). The branch makes the Group itself the pool: CommitmentAnchor carries a group_hash and nothing about a work context (zome_group_integrity lib.rs at 057c5eb, lines 112 to 130). Work contexts are v0.3 (#201) and have no code yet; the meeting did not talk about the pool."
  options:
    - pick: The pool stays the Group; a work context only refers to pool entries
      effect: "No change to the anchor; a team's planning over commitments lives in its work context and points at the anchors."
    - pick: The anchor takes an optional work context
      effect: "A pool can be scoped to one project inside a group; one more field on an integrity entry, cheaper before the pool reaches dev than after."
    - pick: "Settle it in the design of #201, with the pool named as a consumer"
      effect: "Nothing now; the work-context design answers it while neither the pool nor the work-context entry is on dev."
  lean: 2
  why: "Neither the meeting nor ADR-014 says anything about pools, and the work-context entry does not exist yet, so the cheapest moment is the design of #201."
  touches: [anchor, groupdna]
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
  contract: "Branch only. Admit writes an anchor in status Admitted and links it from the group. Withdraw supersedes the latest version with status Withdrawn and refuses a stale previous hash. The pool read returns both statuses."
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
  contract: "Called by the party who did not author the commitment. The author's conductor countersigns a payload it rebuilds itself; a fulfilled commitment is refused on both sides. A resource state update needs the caller to be its custodian. On dev since #183, the same input and output (fulfillment.rs at 91cfd11, lines 59 to 86); the branch changes only error wording."
- id: ifmode
  component: types
  kind: type
  lang: rust
  signature: |
    pub enum EconomicMode { Use, Consume }
    pub enum UseKind { Unit, Capacity }
    pub enum ClosureReason { Depleted, Spoiled, Withdrawn, WrittenOff, DonatedRemainder, Other }
  contract: "Set on NondominiumIdentity at creation and immutable after. Use needs a UseKind, Capacity needs max_concurrent_users of 2 or more, Consume needs a unit, a positive initial quantity and an identification pattern. A Consume NDO closes with a reason. Branch only; dev takes it through #204, with initial_quantity as a Measure (D3)."
```
