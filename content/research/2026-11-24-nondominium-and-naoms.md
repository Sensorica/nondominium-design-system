---
title: "Nondominium and NAOMS: what they share, where they differ"
date: 2026-11-24
project: nondominium
status: open
summary: "Nondominium governs resources no one can capture; NAOMS gives each person sovereign memory and AI as the interface. Eleven themes compared from both codebases, with what each could take from the other."
lang: en
---

# Nondominium and *NAOMS*

NAOMS (naoms.dev) is a local-first, peer-to-peer memory system: one daemon per device holds a person's signed histories, projects them into a graph, governs groups ("hives") and serves AI agents over MCP. It came up while comparing it with Holochain; this board keeps only what matters for Nondominium.

Nondominium is Sensorica's Holochain hApp for resources that no one can capture, built on Valueflows (Holochain 0.7.1, OVN License). NAOMS never mentions it: 0 files in its `docs/` and `src/` name Nondominium, Sensorica or open value networks. Read side by side, the two answer the same refusal from opposite ends: Nondominium starts from the **resource** that must stay uncapturable, NAOMS from the **being** that must stay sovereign. Sources: the Nondominium repository (`documentation/`, cited `path:line`) and the NAOMS repository.

Researched and drafted by SoushAI, Soushi's AI assistant; reviewed and posted by @Soushi888. NAOMS was read from a source snapshot of 24 November 2026 (version 0.5.39, pre-release); Nondominium from `dev` at that date.

```board-idea
headline: |
  Nondominium governs what is shared.
  NAOMS governs who shares.
detail: "Both refuse capture and treat governance as an operator on state. They part on trust: Nondominium is built for agents who do not know each other, NAOMS for chains of acquaintance."
```

## Theme by theme {wide}

```board-compare
left:
  title: Nondominium
  who: "Sensorica. Holochain 0.7.1, Valueflows via hREA, OVN License v1.0. NDO Layer 0 implemented; Layers 1 and 2 post-MVP."
  items:
    - "Centre: the Resource, 'organization-agnostic, uncapturable, natively collaborative'"
    - "Governance-as-operator: the governance zome approves or rejects each state change"
    - "Private Participation Receipts: bilateral signed receipts of economic acts, 16 categories"
    - "Valueflows economic events through hREA"
    - "Seven property regimes, one of them Nondominium"
    - "Lobby, Group and NDO networks: one cloned DHT per group and per resource"
right:
  title: NAOMS
  who: "NAO / Allelo. Own substrate on iroh. Contributions and tokens shipped; resource pooling designed, not built."
  items:
    - "Centre: the Being, its memory and relationships"
    - "Generic governance engine: proposal, vote, attestation, decision on any chain"
    - "Trust signals and role credentials signed on R-Cards between people who know each other"
    - "contribution.record events on hive chains; no Valueflows"
    - "Stewardship: an identity and guardians for land, rivers, ecosystems"
    - "Hives: one chain and one trust-gated replication scope per group"
between: "resource vs being"
caption: "Nondominium governs what is shared; NAOMS governs who shares"
```

| Theme | Nondominium | NAOMS | Resonance | Sources |
|---|---|---|---|---|
| Purpose | Resources "uncapturable and resilient to monopolization. No Agent or group of Agents can control or delete Resources" | "we chose the option that keeps power with you and your community"; "no platform in the middle to take a cut" | **Convergent**: both are built against capture | ND `requirements/requirements.md:5,22`; NAOMS `docs/understand/about/why-these-tradeoffs.md:39`, `docs/understand/vision/10-economics-governance.md` § No platform tax |
| Governance placement | Governance-as-operator: the resource zome requests a transition, the governance zome evaluates the rules and approves or rejects | "Governance is not a page you visit"; one engine routes proposal, vote, attestation, decision for any chain with a contract branch | **Convergent**: governance as an operator on state, not an admin panel | ND `requirements/governance.md:98-103`; NAOMS `10-economics-governance.md:17-38` |
| Decision modes | Rules per resource and regime; no affiliation spectrum yet ("all validated agents treated equivalently") | Named group models: admins, owner, consent, consensus, majority | **Complementary**: NAOMS has the group decision modes Nondominium's governance gap names | ND `requirements/governance.md:237`; NAOMS `docs/understand/hives/making-decisions.md:17` |
| Accountability | PPRs: private, cumulative, each pairwise receipt signed by both parties | Trust signals (VCs on an R-Card, "I vouch for their expertise") and role credentials from hive membership | **Resonant, different trust**: both are bilateral signed attestations; PPRs record acts between strangers, NAOMS signals record relationships | ND `requirements/governance.md:148-188`; NAOMS `docs/glossary.md:205-215` |
| Economic events | Valueflows events (Commitment, Claim, ValidationReceipt) through hREA | `contribution.record`, `.added`, `.retracted` on hive chains; mutual credit, pooling and surplus distribution are designed, not built | **Gap NAOMS could close with Valueflows**: its only Valueflows mention is a note that another project does not use it | ND `requirements/ndo_prima_materia.md:727`; NAOMS `10-economics-governance.md:58-70`, `docs/design/inspiration/commitment-pooling.md:27` |
| What is held | NDO: identity first (Layer 0, lifecycle Ideation to EndOfLife), then specification and process; property regimes include `Nondominium` | Stewardship package: an identity for non-human beings (land, rivers, species) with FROST threshold signing by guardians | **Resonant**: a resource no one owns and a being that holds itself through guardians are close ideas | ND `requirements/ndo_prima_materia.md:43,247`; NAOMS `src/packages/stewardship/README.md` |
| Group shape | A Group DNA cloned per group, and one NDO DNA cloned per resource, each its own network | One hive per group: its own chain with contract, metadata, content and graph branches | **Convergent**: per-group network isolation on both sides | ND `README.md` § Architecture; NAOMS `docs/design/chain-architecture.md:45` |
| Portability | "Roles and PPRs are local"; no VC or DID yet; planned Flowsta DID and a `PortableCredential` | DIDs (`did:key`, `did:webvh`) per device and per agent, W3C-format credentials | **Complementary**: NAOMS already has the portable identity Nondominium plans | ND `requirements/agent.md:474,489`; NAOMS `docs/design/identity-model.md:47,73` |
| Trust between strangers | "Permissionless but accountable": any agent may act on a resource, peers validate, PPRs build reputation between parties who did not know each other | Friend-of-a-friend only: Appleseed-family propagation gives a stranger a weighted score when a trust path exists (`TRUST_GATE_THRESHOLD = 0.6`); greencheck proves a unique person without knowing them; with no path, the docs themselves say a stranger stays a stranger | **Divergent**: Nondominium is built for strangers, NAOMS for chains of acquaintance; the propagation has no Sybil defence yet (DE-68) and the decay the vision describes is not in the trust package | ND `requirements/requirements.md:9`; NAOMS `src/packages/trust/trust-propagation.ts:79-101`, `docs/design/trust-model.md:49-63`, `docs/understand/philosophy/economics/blockchain-vs-hashgraph-sovereignty.md:189-191` |
| Memory | Reputation is cumulative by design | "Forgetting is a feature" (the Mystery axiom) | **Tension**: an accountable record and a right to forget pull apart | ND `requirements/requirements.md:41`; NAOMS `docs/understand/about/design-principles.md:113` |
| License | OVN License v1.0: GPLv3 plus Peer Production reciprocity | Alignment License 0.1, an unreviewed alpha draft based on MPL 2.0 | **Unknown**: compatibility cannot be judged until NAOMS's text is final | ND `LICENSE.md:1-7`; NAOMS `LICENSE:1-21` |

```board-stickies
- title: "A private home for PPRs"
  kind: idea
  body: "PPRs are private receipts each agent holds about their own economic acts. A NAOMS being's personal chain and memory graph is built for exactly that kind of private, signed, searchable record."
  so: "ND requirements/governance.md:148-188; NAOMS docs/architecture.md:240-263"
- title: "Valueflows for NAOMS contributions"
  kind: idea
  body: "NAOMS's contribution events and its planned pooling and surplus distribution are the ground Valueflows and hREA already map. Nondominium is a working example of that mapping on a commons."
  so: "NAOMS 10-economics-governance.md:58-70; ND requirements/ndo_prima_materia.md:727"
- title: "Portable identity both ways"
  kind: idea
  body: "Nondominium's open item is credentials that leave the DNA. NAOMS's DIDs and W3C credentials are one existing answer to compare with the planned Flowsta route."
  so: "ND requirements/agent.md:489; NAOMS docs/design/identity-model.md:47"
- title: "Strangers again"
  kind: model
  body: "Nondominium is 'permissionless but accountable': agents who do not know each other share a resource, so peers validate. NAOMS trusts the relationship it already has. A bridge would sit at that frontier."
  so: "ND requirements/requirements.md:9; NAOMS docs/design/inspiration/holochain.md:245"
- title: "Forgetting vs reputation"
  kind: risk
  body: "A NAOMS being may forget by principle; a Nondominium counterparty relies on the receipt staying. Any shared design has to say which record survives a forgetting, and on whose side."
  so: "NAOMS design-principles.md:113; ND requirements/requirements.md:41"
```

## Sources

Nondominium: `documentation/requirements/requirements.md`, `documentation/requirements/governance.md`, `documentation/requirements/agent.md`, `documentation/requirements/ndo_prima_materia.md`, `README.md`, `LICENSE.md`, at `dev` on 24 November 2026.

NAOMS: the repository's `docs/` and `src/` as cited in each row, from a snapshot of 24 November 2026; the public site [naoms.dev](https://www.naoms.dev/).
