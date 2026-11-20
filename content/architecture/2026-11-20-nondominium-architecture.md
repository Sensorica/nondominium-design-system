---
title: "Nondominium: the whole app, as it runs and as it is planned"
date: 2026-11-20
template: architecture
lifecycle: architecture
project: nondominium
status: open
summary: "The complete architecture of the Nondominium hApp on dev at 2e2f235, from the C4 context down to every DNA, zome and UI module, with the planned work of the v0.1.0 Moss pilot, v0.2 and v0.3 drawn as planified, modified or removed parts. A map to explore the app, with no decision to take."
lang: en
sha: 2e2f235d980e27753ea8a6d8a4d252863d293de7
change-new: planified
---

# Nondominium, the whole app

The architecture of the Nondominium hApp as it stands on `dev` at 2e2f235, and as the open milestones plan to change it.
It is a map to explore, not a design to settle: there is no decision card on this page.

The hApp is one bundle of five DNA roles (`lobby`, `nondominium`, `hrea`, `group`, `ndo`), eleven Rust zome crates and one SvelteKit UI, run either as a tool inside Moss or as a standalone window over a local conductor.
A group is its own cloned cell, and so is every NDO, whose DNA hash is bound to its immutable Layer 0 fields.

Every box without a mark is on `dev` today.
A box or arrow marked **planified** is planned and not yet in the code, **modified** is on `dev` and planned to change, **removed** is on `dev` and planned to go.
Each planned part names its source (an issue, a milestone or a design document) in its spec.
The map's head offers **all · current · change**: *current* draws only what runs today, *change* fades what stays as it is.

How to walk it: start on Context, double-click a box (or use its ▸ badge) to open the level it holds, click a box for its spec, and follow the links in a spec to its neighbours.
The ▶ marks show where a person enters the app.

## Where the planned parts come from

Read on 2026-11-20 from `Sensorica/nondominium`, `dev` at 2e2f235, and its open milestones.

| Milestone | Open issues | What it changes in this architecture |
|---|---|---|
| [v0.1.0 Moss pilot](https://github.com/Sensorica/nondominium/milestone/11) | 16 | The bootstrap and relay server, the always-online node, the release `.webhapp`, and the contribution pie chart on an NDO's agreement |
| [v0.2](https://github.com/Sensorica/nondominium/milestone/13) | 32 | hREA as the economic substrate (epic [#185](https://github.com/Sensorica/nondominium/issues/185)), the CapabilitySlot substrate ([#184](https://github.com/Sensorica/nondominium/issues/184)), NDO Layer 1 versions and dormancy, the governance engine, the standalone release |
| [v0.3](https://github.com/Sensorica/nondominium/milestone/14) | 13 | Work contexts in the group DHT ([#201](https://github.com/Sensorica/nondominium/issues/201)), the Moss public library, the Use and Consume fork, the design-system adapters, Flowsta |

The design documents behind them, all in the app repository at that commit:

- `documentation/hREA/v0.2-release-plan.md`: Phase A (native Valueflows types replaced by hREA's, behind dual-read) and Phase B (the `source`, `nondominium-identity`, `governance` and `federation` modules through an hREA module interface that does not exist yet).

- `documentation/specifications/adr/ADR-010-013-per-ndo-cells.md` and `ADR-014-work-contexts-in-group-dht.md`: one cell per NDO bound to its DNA properties, and work contexts in the group DHT.

- `documentation/requirements/ndo_prima_materia.md` §6 and §9: capability slots and the Layer 1 requirements.

- `documentation/requirements/post-mvp/unyt-integration.md` and `flowsta-integration.md`: the two optional integrations after the MVP.

- `documentation/specifications/governance/governance-operator-architecture.md`: governance as an operator over state transitions.

The issue counts are `gh issue list --milestone <title> --state open` on 2026-11-20.

## Related boards

The commitment-pool experiment on Tibi's branch has its own architecture board, [Commitment pool MVP](/architecture/2026-11-13-commitment-pool-mvp-architecture), and is not redrawn here.
What of it reached `dev` through [#183](https://github.com/Sensorica/nondominium/pull/183) (commitments per NDO, the fulfillment closure, `Measure`) is drawn here as part of the governance zome; the Use and Consume fork it still holds is the planned [#204](https://github.com/Sensorica/nondominium/issues/204).

The [group model requirements](/brainstorms/2026-11-03-group-model-requirements) are the requirements this architecture answers for groups, Moss and standalone, and the [v0.1.0 Moss release plan](/brainstorms/2026-10-27-v0-1-0-moss-release-plan) is the project-management board for the pilot.

## How the cells fit together

Five roles are declared in `workdir/happ.yaml`.
`lobby`, `nondominium` and `hrea` are provisioned at install; `group` and `ndo` are deferred templates, cloned on demand, up to 64 groups and 512 NDOs per conductor.

An NDO is created in three steps by the UI (`ndo.service.ts`): it clones the `ndo` role with the NDO's Layer 0 fields as DNA properties, writes the `NondominiumIdentity` inside that new cell, then writes an `NdoAnchor` with the clone coordinates in the group cell.
A peer who reads the anchor derives the same DNA hash and joins the same NDO network.
Inside the NDO cell, integrity refuses an identity whose name, regime or nature differ from the DNA properties (ADR-013).

Inside Moss, the Moss group takes the place of the lobby: the tool's provisioned `group` cell is the group, profiles come from Moss, clone cells are created through the WeaveClient, and every NDO is offered to other tools as a Moss asset.

```board-components
- id: member
  name: Member
  level: system
  kind: person
  entry: a member of a group, in Moss or standalone
  does: "A person in an open value network who creates groups and NDOs, joins them, proposes commitments, logs economic events and fulfills commitments with a counterparty."
- id: developer
  name: Developer
  level: system
  kind: person
  entry: a developer running the app locally
  does: "A contributor who builds the zomes and the UI and runs two agents locally, in weave dev mode inside Moss or in a Holochain sandbox."

- id: nd
  name: Nondominium hApp
  level: system
  kind: service
  tech: Holochain 0.7.1, Rust, SvelteKit
  does: "A multi-DNA Holochain app for commons-based resource sharing on Valueflows: Nondominium Objects (NDOs) with embedded governance, groups, commitments, economic events and private participation receipts."
  code:
    - workdir/happ.yaml:1-60
    - Cargo.toml:7-43
- id: conductor
  name: Holochain conductor
  level: system
  kind: external
  tech: Holochain 0.7.1, kitsune2
  does: "Runs the cells of every DNA on the member's machine, validates and gossips their data with peers, and serves the app and admin websockets the UI calls."
  code:
    - Cargo.toml:47-55
    - scripts/launch-happ.mjs:1-20
- id: moss
  name: Moss and The Weave
  level: system
  kind: external
  tech: "@theweave/api 0.7.0-rc.3"
  does: "The group-ware host the pilot runs in: it hosts Nondominium as a tool in an iframe, gives it the Moss group, its profiles and roles, and links NDOs to other tools as assets."
  code:
    - ui/package.json:47-58
    - documentation/specifications/moss-integration.md:1-91
- id: netinfra
  name: Bootstrap and relay server
  level: system
  kind: external
  tech: kitsune2-bootstrap-srv, NixOS
  does: "One public bootstrap server, serving the relay on /relay, on Sensorica's Holoports through nixos-holochain, so pilot members on two machines find each other. Planned in #122 (v0.1.0 Moss pilot)."
  change: new
  code:
    - weave/weave.dev.config.ts:1-14
- id: alwayson
  name: Always-online node
  level: system
  kind: external
  tech: wdocker, NixOS
  does: "A headless conductor on Sensorica's Holoports that joins the pilot group and keeps its group and NDO cells readable while every member is offline. Planned in #166 (v0.1.0 Moss pilot)."
  change: new
- id: dsys
  name: Nondominium design system
  level: system
  kind: external
  tech: "@nondominium/ndo-ui, nix flake input"
  does: "This design system's component package, to come into the UI as a pinned nix flake input rather than npm, resolved inside nix develop. Planned in #205 (v0.3)."
  change: new
- id: mosslib
  name: Moss public library
  level: system
  kind: external
  does: "The catalogue a Moss group installs tools from; the tool is to be listed there once Moss 0.16 is stable. Planned in #202 (v0.3)."
  change: new
- id: flowsta
  name: Flowsta
  level: system
  kind: external
  does: "Cross-app identity and key recovery: an agent links its key to a Flowsta identity, so its history survives a lost device and is recognised across Holochain apps. Planned in #156 (v0.3), specified in flowsta-integration.md."
  change: new
  code:
    - documentation/requirements/post-mvp/flowsta-integration.md:1-12
- id: unyt
  name: Unyt
  level: system
  kind: external
  does: "Settlement through Smart Agreements on an NDO's wallet: the license's fixed share first, then the group's split of the rest. Post-MVP with no milestone; #222 stores the share parameter and leaves Unyt out of scope."
  change: new
  code:
    - documentation/requirements/post-mvp/unyt-integration.md:141-160

- id: ui
  name: hApp UI
  level: container
  parent: nd
  kind: ui
  tech: SvelteKit 2, Svelte 5, Effect-TS 4, UnoCSS, Melt
  does: "The single-page UI: lobby, groups and NDOs, over Effect services and Svelte stores, with a host layer that runs it standalone or inside Moss. Planned: SvelteKit 3 (#150, v0.2), economic reads through hREA (#193, v0.2), a build flag for the standalone target (#203, v0.2)."
  change: modified
  code:
    - ui/package.json:1-58
    - ui/scripts/check-architecture.ts:1-13
- id: lobbydna
  name: Lobby DNA
  level: container
  parent: nd
  kind: service
  tech: Rust, HDK 0.7.1, fixed network seed
  does: "One permissionless federation DHT shared by every install, holding lobby profiles and the announcements groups make to be found. Used standalone; inside Moss the Moss group takes its place."
  code:
    - workdir/happ.yaml:4-14
    - dnas/lobby/workdir/dna.yaml:1-17
- id: coredna
  name: Nondominium DNA
  level: container
  parent: nd
  kind: service
  tech: Rust, HDK 0.7.1
  does: "The shared core cell: persons, roles, private data and devices, plus the resource and governance zomes for data not scoped to one NDO. Planned: hREA Phase A moves specifications, resources, events and commitments onto hREA types (#185, v0.2)."
  change: modified
  code:
    - workdir/happ.yaml:15-23
    - dnas/nondominium/workdir/dna.yaml:1-36
- id: groupdna
  name: Group DNA
  level: container
  parent: nd
  kind: service
  tech: Rust, HDK 0.7.1, cloned per group
  does: "One cloned cell per group: its profile, members, work log, soft links and the anchors that point at its NDO cells. Planned: work contexts in the same DHT (#201, v0.3, ADR-014)."
  change: modified
  code:
    - workdir/happ.yaml:34-43
    - dnas/group/workdir/dna.yaml:1-17
- id: ndodna
  name: NDO DNA
  level: container
  parent: nd
  kind: service
  tech: Rust, HDK 0.7.1, cloned per NDO
  does: "One cloned cell per NDO, its DNA hash bound to the NDO's immutable Layer 0 fields: the identity, its members, its specifications, commitments, events and agreement. Planned: capability slots on the identity (#184, v0.2) and a fork's inherited share in its DNA properties (#223, v0.1.0)."
  change: modified
  code:
    - workdir/happ.yaml:44-53
    - dnas/ndo/workdir/dna.yaml:1-25
- id: hreadna
  name: hREA DNA
  level: container
  parent: nd
  kind: store
  tech: hREA happ-0.5.0-beta.1, git submodule
  does: "The Valueflows economic backend, built from the vendored hREA submodule. Today it holds the ReaAgent of every Person. Planned: the economic substrate of the whole app, with a module interface for what Valueflows lacks (#185, #187, v0.2)."
  change: modified
  code:
    - workdir/happ.yaml:24-33
    - .gitmodules:1-3
    - vendor/README.md:1-3
- id: sharedcrate
  name: Shared Rust crate
  level: container
  parent: nd
  kind: module
  tech: Rust, nondominium_shared
  does: "The types, constraint checks, anchor paths and cross-zome call helpers every zome compiles in, so the DNAs agree on one vocabulary."
  code:
    - crates/shared/src/lib.rs:1-146
- id: bundle
  name: Bundle and packaging
  level: container
  parent: nd
  kind: module
  tech: hc app pack, hc web-app pack, weave CLI
  does: "The manifests and scripts that pack the zomes into DNAs, the DNAs into the .happ, the .happ and the zipped UI into the .webhapp and the Moss tool, and start local networks. Planned: the released Moss tool (#121) and a standalone release beside it (#203)."
  change: modified
  code:
    - package.json:10-34
- id: testsuites
  name: Test suites
  level: container
  parent: nd
  kind: module
  tech: Sweettest, Playwright, Vitest
  does: "Multi-agent Sweettest crates per DNA (the primary suite), Playwright end-to-end runs against real conductors, Vitest unit specs in the UI, and the deprecated Tryorama suite."
  code:
    - Cargo.toml:16-19
    - package.json:13-15

- id: routes
  name: Routes and root layout
  level: component
  parent: ui
  kind: ui
  tech: SvelteKit routes
  does: "The root layout connects to Holochain, sets up the profile (from Moss inside Moss), loads the lobby and, inside Moss, joins every anchored NDO cell in the background; routes open the lobby, a group, an NDO and the NDO creation page."
  code:
    - ui/src/routes/+layout.svelte:1-58
    - ui/src/routes/ndo/new/+page.svelte:1-32
- id: shell
  name: App shell
  level: component
  parent: ui
  kind: ui
  tech: Svelte 5
  does: "The frame every page renders in: the sidebar with groups and NDOs, and the content area."
  code:
    - ui/src/lib/components/shell/AppShell.svelte:1-72
    - ui/src/lib/components/shell/Sidebar.svelte:1-294
- id: lobbyviews
  name: Lobby views
  level: component
  parent: ui
  kind: ui
  tech: Svelte 5
  does: "The lobby: the NDO browser with its filters, the group sidebar, the profile bar and the first-run profile form."
  code:
    - ui/src/lib/components/lobby/LobbyView.svelte:1-52
    - ui/src/lib/components/lobby/NdoBrowser.svelte:1-279
    - ui/src/lib/components/lobby/GroupSidebar.svelte:1-184
    - ui/src/lib/components/lobby/ProfileSetupModal.svelte:1-79
- id: groupviews
  name: Group views
  level: component
  parent: ui
  kind: ui
  tech: Svelte 5
  does: "A group's page: its members, work log, soft links, its NDOs, and the modal that creates an NDO in the group."
  code:
    - ui/src/lib/components/group/GroupView.svelte:1-228
    - ui/src/lib/components/group/NdoCreateModal.svelte:1-245
    - ui/src/lib/components/group/MemberList.svelte:1-36
- id: ndoviews
  name: NDO views
  level: component
  parent: ui
  kind: ui
  tech: Svelte 5
  does: "An NDO's page: the Layer 0 identity, resources, governance rules, activity, composition, the lifecycle transition and its history, fork, association with another group, and the commitment and event forms of #183. Planned: the fork flow writes the parent's share into the clone properties (#223, v0.1.0)."
  change: modified
  code:
    - ui/src/lib/components/ndo/NdoView.svelte:1-360
    - ui/src/lib/components/ndo/NdoIdentityLayer.svelte:1-224
    - ui/src/lib/components/ndo/CommitmentCreateForm.svelte:1-314
    - ui/src/lib/components/ndo/EconomicEventCreateForm.svelte:1-289
    - ui/src/lib/components/ndo/ForkNdoModal.svelte:1-102
    - ui/src/lib/components/ndo/LifecycleTransitionModal.svelte:1-182
- id: piechart
  name: Contribution pie chart
  level: component
  parent: ui
  kind: ui
  tech: Svelte 5
  does: "Shows and edits an NDO's contribution pie chart, the shares of its agreement. Planned in #221 (v0.1.0 Moss pilot), with #220 (shares sum to exactly 100) and #224 (import pie-chart.json)."
  change: new
- id: dsadapters
  name: Design-system adapters
  level: component
  parent: ui
  kind: module
  tech: TypeScript
  does: "Convert between the design system's component shapes and the app's create inputs and rule data. On Tibi's experiment branch today; to land on dev with a resolvable ndo-ui dependency in #205 (v0.3)."
  change: new
- id: stores
  name: Stores
  level: component
  parent: ui
  kind: module
  tech: Svelte 5 runes, Effect-TS
  does: "Reactive state per domain (lobby, group, NDO, person, resource, governance, Moss, connection): the only way a component reaches a service. A store never imports another store (rule I2)."
  code:
    - ui/src/lib/stores/ndo.store.svelte.ts:1-433
    - ui/src/lib/stores/lobby.store.svelte.ts:1-237
    - ui/src/lib/stores/governance.store.svelte.ts:1-430
    - ui/src/lib/stores/moss.store.svelte.ts:1-96
- id: domainlayer
  name: Domain layer
  level: component
  parent: ui
  kind: module
  tech: TypeScript, pure functions
  does: "Pure rules with no Svelte, Effect or service import (rule I3): resource and agent perspectives, lifecycle transitions allowed, entity states and NDO filters."
  code:
    - ui/src/lib/domain/perspective.ts:1-86
    - ui/src/lib/domain/lifecycle.ts:1-29
    - ui/src/lib/domain/entity-state.ts:1-104
    - ui/src/lib/domain/ndo-filters.ts:1-25
- id: zomeservices
  name: Zome services
  level: component
  parent: ui
  kind: module
  tech: Effect-TS layers
  does: "One Effect service per zome domain (lobby, group, NDO, person, resource, governance), calling zomes by role or by cell id; the NDO service creates an NDO in three steps and joins anchored NDO cells; the lobby service has a Moss variant backed by the group cell."
  code:
    - ui/src/lib/services/zomes/ndo.service.ts:376-452
    - ui/src/lib/services/zomes/lobby.service.ts:627-675
    - ui/src/lib/services/zomes/governance.service.ts:1-273
    - ui/src/lib/services/zomes/moss-lobby.ts:1-25
- id: schemas
  name: Schemas and errors
  level: component
  parent: ui
  kind: module
  tech: Effect Schema
  does: "Decode zome records into typed values and map failures into one tagged error per domain with a context code."
  code:
    - ui/src/lib/schemas/resource.schemas.ts:1-190
    - ui/src/lib/errors/error-contexts.ts:1-142
- id: hcservice
  name: Holochain client service
  level: component
  parent: ui
  kind: module
  tech: "@holochain/client 0.21"
  does: "The one gateway to the conductor: zome calls by role or cell id, app info caching, and clone cell creation for groups and NDOs (through the WeaveClient inside Moss), with signing credentials authorised for every new cell."
  code:
    - ui/src/lib/services/holochain.service.svelte.ts:1-60
    - ui/src/lib/services/holochain.service.svelte.ts:230-300
    - ui/src/lib/services/cell.manager.ts:1-85
- id: hcconnect
  name: Connection modes
  level: component
  parent: ui
  kind: module
  tech: TypeScript
  does: "Opens the conductor connection in one of four modes: the launcher, the hc-connection.json manifest the dev launcher writes, environment variables, or the applet client Moss hands the tool."
  code:
    - ui/src/lib/utils/hc-connect.ts:1-287
- id: mossadapter
  name: Moss host layer
  level: component
  parent: ui
  kind: module
  tech: "@theweave/api"
  does: "Detects whether the UI runs inside Moss, connects the WeaveClient, offers NDOs as Moss assets (search, asset info, open), reads profiles and roles, and creates NDO clone cells through Weave."
  code:
    - ui/src/lib/moss/host.ts:1-53
    - ui/src/lib/moss/connect.ts:1-58
    - ui/src/lib/moss/applet-services.ts:1-26
    - ui/src/lib/moss/assets.ts:1-55
    - ui/src/lib/moss/profile.ts:1-64
    - ui/src/lib/moss/ndo-clone.ts:1-43
- id: sharedtypes
  name: Shared TypeScript types
  level: component
  parent: ui
  kind: module
  tech: "@nondominium/shared-types workspace package"
  does: "The TypeScript mirror of the zome inputs and outputs (lobby, group, person, resource, governance, PPR), the integration seam between the services and the zomes."
  code:
    - packages/shared-types/src/index.ts:1-43
    - packages/shared-types/src/resource.types.ts:1-463
- id: archcheck
  name: Architecture check
  level: component
  parent: ui
  kind: module
  tech: Bun script, run by bun run check
  does: "Fails the UI check when a Svelte file reaches effect or the services (I1), a store imports another store (I2), or the domain layer imports Svelte, Effect, services or stores (I3)."
  code:
    - ui/scripts/check-architecture.ts:1-60
- id: vendoredadapter
  name: Vendored GraphQL adapter
  level: component
  parent: ui
  kind: module
  tech: "@valueflows/vf-graphql-holochain 0.700.0-rc.0 tarball"
  does: "The hREA GraphQL adapter installed from a tarball in vendor/, because npm served only the 0.6 line when it was added (#153). Declared, not yet imported by the UI source. Removed in #193 (v0.2) for the npm package."
  change: removed
  code:
    - ui/package.json:54-54
    - vendor/README.md:5-21
- id: hreareads
  name: hREA economic reads
  level: component
  parent: ui
  kind: module
  tech: "@valueflows/vf-graphql-holochain from npm"
  does: "The specification, resource, commitment and event views read through hREA's GraphQL adapter instead of the native zomes. Planned in #193 (v0.2, plan §7 criterion 2); write paths out of scope."
  change: new
  code:
    - documentation/hREA/v0.2-release-plan.md:126-135

- id: lobbyint
  name: zome_lobby_integrity
  level: component
  parent: lobbydna
  kind: module
  tech: Rust, HDI 0.8.1
  does: "Defines and validates LobbyAgentProfile and GroupAnnouncement, with their path and agent links."
  code:
    - dnas/lobby/zomes/integrity/zome_lobby_integrity/src/lib.rs:6-47
    - dnas/lobby/zomes/integrity/zome_lobby_integrity/src/lib.rs:63-120
- id: lobbycoord
  name: zome_lobby_coordinator
  level: component
  parent: lobbydna
  kind: service
  tech: Rust, HDK 0.7.1
  does: "Nine hdk_extern functions, init included: upsert and read lobby profiles, announce a group, and list all groups, my groups or one group by its DNA hash."
  code:
    - dnas/lobby/zomes/coordinator/zome_lobby_coordinator/src/lib.rs:1-291

- id: personint
  name: zome_person integrity
  level: component
  parent: coredna
  kind: module
  tech: Rust, HDI 0.8.1
  does: "Person, PersonRole, Device and AgentPersonRelationship as public entries; PrivatePersonData, capability metadata and revocation markers as private entries; the person-centric links and their validation."
  code:
    - dnas/nondominium/zomes/integrity/zome_person/src/lib.rs:42-120
    - dnas/nondominium/zomes/integrity/zome_person/src/lib.rs:264-306
- id: personcoord
  name: zome_person coordinator
  level: component
  parent: coredna
  kind: service
  tech: Rust, HDK 0.7.1
  does: "47 hdk_extern functions, init included: persons and their agents, roles and promotion, field-level private data sharing through capability grants, devices, and the hREA agent bridge."
  code:
    - dnas/nondominium/zomes/coordinator/zome_person/src/person.rs:27-66
    - dnas/nondominium/zomes/coordinator/zome_person/src/role.rs:55-104
    - dnas/nondominium/zomes/coordinator/zome_person/src/capability_based_sharing.rs:30-120
    - dnas/nondominium/zomes/coordinator/zome_person/src/device_management.rs:46-130
    - dnas/nondominium/zomes/coordinator/zome_person/src/hrea_bridge.rs:1-39
- id: resint
  name: zome_resource integrity
  level: component
  parent: coredna
  kind: module
  tech: Rust, HDI 0.8.1
  does: "ResourceSpecification, EconomicResource, GovernanceRule, NondominiumIdentity and NdoMembership, with the discovery, lifecycle and NDO links. Compiled into both the core and the NDO DNA. Planned: the CapabilitySlot link type (#184, v0.2) and the Use and Consume fork on the identity (#204, v0.3)."
  change: modified
  code:
    - dnas/nondominium/zomes/integrity/zome_resource/src/lib.rs:15-145
    - dnas/nondominium/zomes/integrity/zome_resource/src/lib.rs:146-209
- id: rescoord
  name: zome_resource coordinator
  level: component
  parent: coredna
  kind: service
  tech: Rust, HDK 0.7.1
  does: "47 hdk_extern functions, init and post_commit included: NDO identity and lifecycle, NDO membership, specifications, economic resources with custody transfer and operational state, and governance rules. Planned: Layer 1 specification versions and dormancy (#206, #207, #144, v0.2) and hREA dual-read for specifications and resources (#189, #190)."
  change: modified
  code:
    - dnas/nondominium/zomes/coordinator/zome_resource/src/ndo_identity.rs:140-249
    - dnas/nondominium/zomes/coordinator/zome_resource/src/resource_specification.rs:113-299
    - dnas/nondominium/zomes/coordinator/zome_resource/src/economic_resource.rs:390-509
    - dnas/nondominium/zomes/coordinator/zome_resource/src/governance_rule.rs:25-107
    - dnas/nondominium/zomes/coordinator/zome_resource/src/lib.rs:44-80
- id: govint
  name: zome_gouvernance integrity
  level: component
  parent: coredna
  kind: module
  tech: Rust, HDI 0.8.1
  does: "ValidationReceipt, EconomicEvent, Commitment, Claim, ResourceValidation, the private PrivateParticipationClaim, and the federation entries NdoHardLink, Contribution and Agreement. Planned: agreement shares sum to 100 (#220), the license share parameter (#222) and a fork's inherited share validated in integrity (#223), all v0.1.0."
  change: modified
  code:
    - dnas/nondominium/zomes/integrity/zome_gouvernance/src/lib.rs:17-158
    - dnas/nondominium/zomes/integrity/zome_gouvernance/src/lib.rs:160-202
    - dnas/nondominium/zomes/integrity/zome_gouvernance/src/ppr.rs:253-330
- id: govcoord
  name: zome_gouvernance coordinator
  level: component
  parent: coredna
  kind: service
  tech: Rust, HDK 0.7.1
  does: "51 hdk_extern functions, init and post_commit included: commitments and claims, the atomic fulfillment closure that countersigns through call_remote, economic events, validation receipts, PPR issuance and reputation, transition evaluation, hard links, contributions and agreements. Planned: hREA dual-read for events and commitments (#191, #192, v0.2)."
  change: modified
  code:
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/commitment.rs:41-121
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/fulfillment.rs:1-30
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/fulfillment.rs:118-140
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/ppr.rs:85-120
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/transition.rs:1-70
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/lib.rs:42-68
- id: misc
  name: misc
  level: component
  parent: coredna
  kind: service
  tech: Rust, HDK 0.7.1
  does: "A coordinator zome with one function, ping, answering Pong: a liveness probe for the core cell."
  code:
    - dnas/nondominium/zomes/coordinator/misc/src/lib.rs:1-6
- id: nativevf
  name: Native Valueflows types
  level: component
  parent: coredna
  kind: store
  tech: Rust entry types
  does: "Nondominium's own ResourceSpecification, EconomicResource, EconomicEvent and Commitment, which duplicate concepts hREA implements. Removed in #194 (v0.2) once the dual-read parity suite holds for each type; the PPR and private identity entries never migrate (plan §4)."
  change: removed
  code:
    - dnas/nondominium/zomes/integrity/zome_resource/src/lib.rs:15-90
    - dnas/nondominium/zomes/integrity/zome_gouvernance/src/lib.rs:28-69
    - documentation/hREA/v0.2-release-plan.md:52-85
- id: govengine
  name: Governance engine
  level: component
  parent: coredna
  kind: module
  tech: Rust, pure functions
  does: "A pure-function engine that evaluates a state transition against the governance rules, behind cross-zome interface types, so write paths follow request, evaluate, apply. Planned in #41 and #42 (v0.2), with #145 deciding whether every write path funnels through it, and #43, #44, #45 in v0.3."
  change: new
  code:
    - documentation/specifications/governance/governance-operator-architecture.md:1-36
- id: filestorage
  name: File storage zomes
  level: component
  parent: coredna
  kind: store
  tech: holochain-open-dev/file-storage
  does: "Chunked, peer-hosted file storage so an NDO carries its design files, models and documents as DigitalAsset capability slots. Planned in #99 (v0.2), which names the nondominium DNA as its home; it predates the per-NDO cells."
  change: new

- id: groupint
  name: zome_group_integrity
  level: component
  parent: groupdna
  kind: module
  tech: Rust, HDI 0.8.1
  does: "GroupProfile, GroupMembership, WorkLog, SoftLink and NdoAnchor, with their links and validation, including the immutable coordinates of an NDO anchor."
  code:
    - dnas/group/zomes/integrity/zome_group_integrity/src/lib.rs:12-93
    - dnas/group/zomes/integrity/zome_group_integrity/src/lib.rs:180-241
- id: groupcoord
  name: zome_group coordinator
  level: component
  parent: groupdna
  kind: service
  tech: Rust, HDK 0.7.1
  does: "20 hdk_extern functions, init included: the group profile, joining and leaving, members, the work log, soft links, and NDO anchors with their cached lifecycle stage."
  code:
    - dnas/group/zomes/coordinator/zome_group/src/group_profile.rs:12-98
    - dnas/group/zomes/coordinator/zome_group/src/membership.rs:7-113
    - dnas/group/zomes/coordinator/zome_group/src/ndo_anchor.rs:1-117
    - dnas/group/zomes/coordinator/zome_group/src/work_log.rs:13-44
- id: workctx
  name: Work contexts
  level: component
  parent: groupdna
  kind: store
  tech: Rust entries in the group cell
  does: "A work context (shown as a project) is an open space of agents, many-to-many with groups, naming NDOs by their clone coordinates as NdoAnchor does. Planned in #201 (v0.3), decided in ADR-014."
  change: new
  code:
    - documentation/specifications/adr/ADR-014-work-contexts-in-group-dht.md:23-31

- id: ndoresint
  name: zome_resource integrity (NDO cell)
  level: component
  parent: ndodna
  kind: module
  tech: same wasm as the core DNA
  does: "The same zome_resource integrity wasm, bundled again in the NDO DNA; on an NDO cell it refuses an identity whose name, regime or nature differ from the DNA properties (ADR-013)."
  code:
    - dnas/ndo/workdir/dna.yaml:3-12
    - dnas/nondominium/zomes/integrity/zome_resource/src/lib.rs:675-692
- id: ndorescoord
  name: zome_resource coordinator (NDO cell)
  level: component
  parent: ndodna
  kind: service
  tech: same wasm as the core DNA
  does: "Writes the NDO's genesis identity, its lifecycle transitions, its members and its Layer 1 specifications inside the NDO's own DHT."
  code:
    - dnas/ndo/workdir/dna.yaml:13-19
    - dnas/nondominium/zomes/coordinator/zome_resource/src/ndo_identity.rs:140-214
    - dnas/nondominium/zomes/coordinator/zome_resource/src/ndo_membership.rs:31-118
- id: ndogovint
  name: zome_gouvernance integrity (NDO cell)
  level: component
  parent: ndodna
  kind: module
  tech: same wasm as the core DNA
  does: "The same zome_gouvernance integrity wasm, validating the NDO's commitments, claims, events and agreement inside its own DHT."
  code:
    - dnas/ndo/workdir/dna.yaml:9-12
- id: ndogovcoord
  name: zome_gouvernance coordinator (NDO cell)
  level: component
  parent: ndodna
  kind: service
  tech: same wasm as the core DNA
  does: "Proposes and lists the commitments of this NDO, fulfills them through the closure, logs its events and holds its agreement."
  code:
    - dnas/ndo/workdir/dna.yaml:20-25
    - dnas/nondominium/zomes/coordinator/zome_gouvernance/src/commitment.rs:121-163
- id: dnaprops
  name: NDO DNA properties
  level: component
  parent: ndodna
  kind: module
  tech: NdoDnaProperties, ADR-010 and ADR-013
  does: "The immutable Layer 0 fields (name, property regime, resource nature, creation time) passed as clone properties, so the NDO's DNA hash is its identity. Planned: a fork also carries its parent's DNA hash, identity and inherited share (#223, v0.1.0)."
  change: modified
  code:
    - crates/shared/src/types.rs:277-282
    - documentation/specifications/adr/ADR-010-013-per-ndo-cells.md:1-40
- id: capslot
  name: Capability slots
  level: component
  parent: ndodna
  kind: module
  tech: CapabilitySlot link type in zome_resource
  does: "A link from an NDO identity to any DHT hash, tagged with its SlotType (CustomApp included), that any accountable agent may attach and that stays readable at every lifecycle stage. Planned in #184 (v0.2), the attachment point for #99 and #156."
  change: new
  code:
    - documentation/requirements/ndo_prima_materia.md:547-606
    - documentation/requirements/ndo_prima_materia.md:1131-1160

- id: hreazomes
  name: hREA zomes
  level: component
  parent: hreadna
  kind: store
  tech: Rust, Valueflows 1.0 surface
  does: "hREA's Valueflows entry types (agents, specifications, resources, events, commitments, claims) and the GraphQL schema the adapter serves. Nondominium calls the hrea zome by role name; today only ReaAgent is used."
  code:
    - crates/shared/src/lib.rs:83-110
    - vendor/README.md:1-3
- id: hreamodif
  name: hREA module interface
  level: component
  parent: hreadna
  kind: module
  does: "A way for an hApp to extend hREA's vocabulary, by compile-time composition or runtime attachment, which hREA does not have yet. Planned upstream through the RFC of #187 (v0.2), with InitialTransfer and AccessForUse as its smallest test (#199)."
  change: new
  code:
    - documentation/hREA/v0.2-release-plan.md:37-48
- id: hreamodules
  name: Nondominium hREA modules
  level: component
  parent: hreadna
  kind: module
  does: "The four Phase B modules, smallest first: source (#195), nondominium-identity (#196), governance (#197) and federation (#198), all v0.2."
  change: new
  code:
    - documentation/hREA/v0.2-release-plan.md:70-80

- id: shareddomain
  name: Domain types and constraints
  level: component
  parent: sharedcrate
  kind: module
  tech: Rust
  does: "LifecycleStage, PropertyRegime, ResourceNature, OperationalState, Measure, VfAction, NdoLinkType and benefit clauses, and the constraint checks a rule or an action is held to."
  code:
    - crates/shared/src/types.rs:13-401
    - crates/shared/src/constraints.rs:128-260
- id: sharedcalls
  name: Call helpers and paths
  level: component
  parent: sharedcrate
  kind: module
  tech: Rust
  does: "call_person_zome, call_resource_zome, call_governance_zome and call_hrea_zome, the anchor path builders and the shared error types."
  code:
    - crates/shared/src/lib.rs:29-110
    - crates/shared/src/paths.rs:1-36

- id: happyaml
  name: hApp manifest
  level: component
  parent: bundle
  kind: module
  tech: happ.yaml
  does: "Declares the five roles, which are provisioned at install and which are cloned on demand, and their clone limits."
  code:
    - workdir/happ.yaml:1-60
- id: mossmanifest
  name: webhapp and Moss manifests
  level: component
  parent: bundle
  kind: module
  tech: web-happ.yaml, moss.yaml
  does: "Wrap the .happ and the zipped UI into the .webhapp and describe the Moss tool, with the lobby network seed. Planned: the released and smoke-tested Moss tool (#121, v0.1.0)."
  change: modified
  code:
    - workdir/web-happ.yaml:1-6
    - workdir/moss.yaml:1-11
- id: standalone
  name: Standalone release
  level: component
  parent: bundle
  kind: module
  does: "A released standalone .webhapp from the same tag as the Moss tool, the target chosen by a Vite build flag, each with a smoke test. Planned in #203 (v0.2)."
  change: new
- id: weavedev
  name: Weave dev config
  level: component
  parent: bundle
  kind: module
  tech: weave CLI, Electron
  does: "Starts two Moss agents, Alice and Bob, in one dev group with the tool served from the local Vite server."
  code:
    - weave/weave.dev.config.ts:1-60
- id: launcher
  name: Dev network launcher
  level: component
  parent: bundle
  kind: module
  tech: Node script
  does: "Starts a bootstrap server and one sandbox conductor per agent, installs the .happ by path and writes the connection manifest the UI reads."
  code:
    - scripts/launch-happ.mjs:1-60

- id: sweettest
  name: Sweettest suites
  level: component
  parent: testsuites
  kind: module
  tech: Rust, holochain test_utils
  does: "Multi-agent tests on real conductors, one crate per DNA: persons, resources, governance, NDO Layer 0 and membership, groups, NDO anchors and the lobby."
  code:
    - dnas/nondominium/tests/src/nondominium/ndo_layer0/mod.rs:1-80
    - dnas/group/tests/src/ndo_anchor/mod.rs:1-80
    - dnas/lobby/tests/src/lobby/mod.rs:1-60
- id: e2e
  name: Playwright end-to-end
  level: component
  parent: testsuites
  kind: module
  tech: Playwright 1.61
  does: "Drives the UI in a browser against real conductors: the core flows and a multi-agent run."
  code:
    - ui/playwright.config.ts:1-67
    - ui/tests/e2e/specs/multi-agent.spec.ts:1-60
- id: tryorama
  name: Tryorama suite (deprecated)
  level: component
  parent: testsuites
  kind: module
  tech: TypeScript, Vitest
  does: "The legacy TypeScript suite, kept as reference only: it cannot connect to a Holochain 0.7 conductor."
  code:
    - tests/DEPRECATED.md:1-20
- id: parity
  name: Dual-read parity harness
  level: component
  parent: testsuites
  kind: module
  tech: Sweettest
  does: "Reads every Phase A type from the native store and from hREA and compares them, the gate before any native type is removed. Planned in #188 (v0.2)."
  change: new
  code:
    - documentation/hREA/v0.2-release-plan.md:89-108
```

```board-relations
- from: member
  to: moss
  says: opens the tool in a Moss group
- from: moss
  to: routes
  says: hosts the tool in an iframe, hands it the applet client and the open view
  via: Weave API
- from: mossadapter
  to: moss
  says: connects, offers NDOs as assets, reads profiles and roles, creates clone cells
  via: "@theweave/api"
- from: member
  to: routes
  says: uses the app standalone
  via: browser window over a local conductor
- from: developer
  to: weavedev
  says: runs two Moss agents
  via: bun run tool-dev
- from: developer
  to: launcher
  says: starts a local network
  via: bun run start
- from: hcconnect
  to: conductor
  says: opens the app and admin websockets
  via: WebSocket
- from: launcher
  to: conductor
  says: starts sandboxes and installs the .happ
  via: hc sandbox, admin websocket
- from: weavedev
  to: moss
  says: starts two agents in one dev group
  via: weave CLI
- from: conductor
  to: netinfra
  says: finds peers and relays through
  via: bootstrap and relay URLs
  change: new
- from: alwayson
  to: groupdna
  says: holds the group cell while members are offline
  change: new
- from: alwayson
  to: ndodna
  says: holds the NDO cells while members are offline
  change: new
- from: dsadapters
  to: dsys
  says: imports components and tokens
  via: nix flake input
  change: new
- from: mossmanifest
  to: mosslib
  says: is published as a tool
  change: new
- from: personcoord
  to: flowsta
  says: links an agent to its Flowsta identity
  via: Person capability slot
  change: new
- from: govcoord
  to: unyt
  says: hands the agreement to Smart Agreements for settlement
  change: new

- from: routes
  to: shell
  says: renders every page inside
- from: routes
  to: lobbyviews
  says: mounts
- from: routes
  to: groupviews
  says: mounts
- from: routes
  to: ndoviews
  says: mounts
- from: lobbyviews
  to: stores
  says: reads state, calls actions
- from: groupviews
  to: stores
  says: reads state, calls actions
- from: ndoviews
  to: stores
  says: reads state, calls actions
- from: piechart
  to: stores
  says: reads and edits the agreement's shares
  change: new
- from: dsadapters
  to: ndoviews
  says: converts design-system shapes for
  change: new
- from: stores
  to: zomeservices
  says: runs Effect programs
- from: stores
  to: domainlayer
  says: derives perspectives and allowed transitions
- from: zomeservices
  to: hcservice
  says: calls zomes by role or cell id
- from: zomeservices
  to: schemas
  says: decodes records, maps errors
- from: zomeservices
  to: sharedtypes
  says: types its payloads
- from: hcservice
  to: hcconnect
  says: connects through
- from: hcconnect
  to: mossadapter
  says: detects the host, connects to Moss
- from: hcservice
  to: mossadapter
  says: creates clone cells through the WeaveClient inside Moss
- from: hcservice
  to: dnaprops
  says: clones the ndo role with the Layer 0 fields as properties
  via: createCloneCell
- from: archcheck
  to: stores
  says: keeps components out of services and stores apart
- from: hreareads
  to: hreazomes
  says: reads specifications, resources, commitments and events
  via: GraphQL adapter
  change: new
- from: stores
  to: hreareads
  says: reads economic records through
  change: new

- from: zomeservices
  to: lobbycoord
  says: profiles, group announcements
  via: lobby role
- from: zomeservices
  to: personcoord
  says: persons, roles, private data, devices
  via: nondominium role
- from: zomeservices
  to: rescoord
  says: specifications, resources, rules not scoped to an NDO
  via: nondominium role
- from: zomeservices
  to: govcoord
  says: events, commitments, validations not scoped to an NDO
  via: nondominium role
- from: zomeservices
  to: groupcoord
  says: group profile, members, work log, NDO anchors
  via: group clone cell id
- from: zomeservices
  to: ndorescoord
  says: creates the NDO identity, transitions, members, specifications
  via: NDO clone cell id
- from: zomeservices
  to: ndogovcoord
  says: commitments, events, fulfillment of this NDO
  via: NDO clone cell id

- from: lobbycoord
  to: lobbyint
  says: writes entries validated by
- from: lobbycoord
  to: groupcoord
  says: announces groups by their DNA hash
  via: GroupAnnouncement, no call
- from: personcoord
  to: personint
  says: writes entries validated by
- from: rescoord
  to: resint
  says: writes entries validated by
- from: govcoord
  to: govint
  says: writes entries validated by
- from: personcoord
  to: govcoord
  says: asks for agent identity and specialized role validation
  via: same-cell call
- from: govcoord
  to: personcoord
  says: checks role capability and private data for validation
  via: same-cell call
- from: govcoord
  to: rescoord
  says: reads the NDO to evaluate a transition, updates operational state on fulfillment
  via: same-cell call
- from: personcoord
  to: hreazomes
  says: creates a ReaAgent per Person, resolves agents
  via: call_hrea_zome, hrea role
- from: rescoord
  to: hreazomes
  says: writes specifications and resources as Rea types, dual-read
  via: call_hrea_zome
  change: new
- from: govcoord
  to: hreazomes
  says: writes events and commitments as Rea types, dual-read
  via: call_hrea_zome
  change: new
- from: rescoord
  to: nativevf
  says: writes native specifications and resources
- from: govcoord
  to: nativevf
  says: writes native events and commitments
- from: govcoord
  to: govengine
  says: delegates transition evaluation
  change: new
- from: filestorage
  to: capslot
  says: fills DigitalAsset slots
  change: new

- from: groupcoord
  to: groupint
  says: writes entries validated by
- from: groupcoord
  to: ndorescoord
  says: points at NDO cells by clone coordinates
  via: NdoAnchor, no call
- from: workctx
  to: groupint
  says: adds work context entries to
  change: new
- from: workctx
  to: ndorescoord
  says: names NDOs by clone coordinates
  via: pointer, no call
  change: new

- from: ndorescoord
  to: ndoresint
  says: writes entries validated by
- from: ndogovcoord
  to: ndogovint
  says: writes entries validated by
- from: ndoresint
  to: dnaprops
  says: checks the identity against
  via: dna_info
- from: ndogovcoord
  to: ndorescoord
  says: reads the NDO, updates operational state on fulfillment
  via: same-cell call
- from: capslot
  to: ndoresint
  says: adds the CapabilitySlot link type to
  change: new
- from: piechart
  to: ndogovcoord
  says: writes the NDO's agreement
  change: new

- from: hreamodules
  to: hreamodif
  says: register through
  change: new
- from: hreamodif
  to: hreazomes
  says: extends the vocabulary of
  change: new

- from: resint
  to: shareddomain
  says: uses types and constraints
- from: govint
  to: shareddomain
  says: uses types and constraints
- from: groupint
  to: shareddomain
  says: uses lifecycle and regime types
- from: ndoresint
  to: shareddomain
  says: uses NdoDnaProperties and types
- from: personcoord
  to: sharedcalls
  says: calls other zomes and hREA through
- from: govcoord
  to: sharedcalls
  says: calls other zomes through

- from: happyaml
  to: lobbydna
  says: declares the lobby role
- from: happyaml
  to: coredna
  says: declares the nondominium role
- from: happyaml
  to: hreadna
  says: declares the hrea role
- from: happyaml
  to: groupdna
  says: declares the deferred group role, 64 clones
- from: happyaml
  to: ndodna
  says: declares the deferred ndo role, 512 clones
- from: mossmanifest
  to: happyaml
  says: wraps the .happ
- from: standalone
  to: happyaml
  says: packs the same .happ with the standalone UI
  change: new
- from: launcher
  to: hcconnect
  says: writes the connection manifest read by
  via: hc-connection.json

- from: sweettest
  to: personcoord
  says: tests on real conductors
- from: sweettest
  to: rescoord
  says: tests on real conductors
- from: sweettest
  to: govcoord
  says: tests on real conductors
- from: sweettest
  to: groupcoord
  says: tests on real conductors
- from: sweettest
  to: lobbycoord
  says: tests on real conductors
- from: e2e
  to: routes
  says: drives the UI against real conductors
- from: tryorama
  to: personcoord
  says: tested on Holochain 0.6, unrunnable on 0.7
- from: parity
  to: hreazomes
  says: compares hREA reads with native reads
  change: new
- from: parity
  to: nativevf
  says: compares native reads with hREA reads
  change: new
```

```board-interfaces
- id: IF1
  component: ndorescoord
  kind: function
  lang: rust
  signature: |
    pub struct NdoInput {
      pub name: String,
      pub property_regime: PropertyRegime,
      pub resource_nature: ResourceNature,
      pub lifecycle_stage: LifecycleStage,
      pub description: Option<String>,
      pub rivalry_override: Option<Rivalry>,
    }

    #[hdk_extern]
    pub fn create_ndo(input: NdoInput) -> ExternResult<NdoOutput>
  contract: "Writes the NDO's Layer 0 identity in the cell it runs on; on an NDO clone cell, integrity refuses an identity whose name, regime or nature differ from the DNA properties. ndo_identity.rs:7-16 and 139-140."
- id: IF2
  component: groupcoord
  kind: function
  lang: rust
  signature: |
    pub struct NdoAnchorInput {
      pub group_hash: ActionHash,
      pub name: String,
      pub description: Option<String>,
      pub ndo_dna_hash: DnaHash,
      pub network_seed: String,
      pub identity_action_hash: ActionHash,
      pub initiator: AgentPubKey,
      pub ndo_created_at: Timestamp,
      pub lifecycle_stage: LifecycleStage,
      pub property_regime: nondominium_shared::PropertyRegime,
      pub resource_nature: nondominium_shared::ResourceNature,
    }

    #[hdk_extern]
    pub fn create_ndo_anchor(input: NdoAnchorInput) -> ExternResult<Record>
  contract: "The authoritative group-to-NDO pointer: the clone coordinates let any group member derive, verify and join the NDO network. ndo_anchor.rs:7-28."
- id: IF3
  component: dnaprops
  kind: type
  lang: rust
  signature: |
    pub struct NdoDnaProperties {
      pub name: String,
      pub property_regime: PropertyRegime,
      pub resource_nature: ResourceNature,
      pub created_at: Timestamp,
    }
  contract: "Passed as a plain object in createCloneCell; different properties give a different DNA hash, so an NDO's network is its identity. crates/shared/src/types.rs:277-282."
- id: IF4
  component: hcservice
  kind: function
  lang: typescript
  signature: |
    createNdoCloneCell(args: {
      networkSeed: string;
      properties: NdoDnaProperties;
    }): Promise<ClonedCell>;
  contract: "Clones the ndo role through the app client standalone, through the WeaveClient inside Moss, then authorises signing for the new cell. holochain.service.svelte.ts:55-58 and 267-300."
- id: IF5
  component: govcoord
  kind: function
  lang: rust
  signature: |
    #[hdk_extern]
    pub fn fulfill_commitment_closure(
      input: FulfillCommitmentClosureInput,
    ) -> ExternResult<FulfillCommitmentClosureOutput>

    #[hdk_extern]
    pub fn countersign_fulfillment(
      input: CountersignFulfillmentInput,
  contract: "One call closes a commitment: the non-author initiates, the author countersigns through call_remote, then the event, the claim, the optional operational state update and both private participation claims are written, or nothing is. fulfillment.rs:1-30, 117-120 and 521-523."
- id: IF6
  component: sharedcalls
  kind: function
  lang: rust
  signature: |
    pub fn call_hrea_zome<I, O>(fn_name: &str, payload: I) -> ExternResult<O>
    where
      I: Serialize + std::fmt::Debug,
      O: std::fmt::Debug + for<'de> Deserialize<'de>,
  contract: "Calls the hrea zome of the hrea role in the same conductor, the seam every hREA migration goes through. crates/shared/src/lib.rs:83-94."
- id: IF7
  component: lobbycoord
  kind: function
  lang: rust
  signature: |
    #[hdk_extern]
    pub fn announce_group(input: AnnounceGroupInput) -> ExternResult<Record>
  contract: "Makes a group findable in the lobby by announcing its DNA hash on the fixed federation DHT. zome_lobby_coordinator/src/lib.rs:142-143."
- id: IF8
  component: govcoord
  kind: function
  lang: rust
  signature: |
    #[hdk_extern]
    pub fn propose_commitment(input: ProposeCommitmentInput) -> ExternResult<ProposeCommitmentOutput>
  contract: "Writes a commitment and links it to its NDO (NdoToCommitments), so anyone can list an NDO's commitments without scanning every commitment. commitment.rs:40-41."
```
