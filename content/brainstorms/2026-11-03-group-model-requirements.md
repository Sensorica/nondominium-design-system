---
title: "Nondominium group model: requirements for Moss and standalone"
date: 2026-11-03
template: requirements
lifecycle: requirements
project: nondominium
status: open
summary: "What a group is in standalone and in Moss, what v0.1.0 ships and what v0.2 adds: the proposed requirement rows for issue #167, each waiting on a priority, a status and nine open questions."
lang: en
---

# Nondominium group model: requirements for Moss and standalone

What a group is in standalone and in Moss, what v0.1.0 ships, and what v0.2 adds: work contexts in the group DHT, many-to-many with groups, and the federation layer. These rows are the ones proposed in the docs PR for issue #167 (`documentation/requirements/lobby-dna.md` and `requirements.md`). Set each priority and status, answer the nine questions at the bottom, and the PR is edited to match before it merges. A question whose answer changes a row is named on the row.

**Decided on 2026-11-03 (taken as given here).** Work contexts live in the group DHT, not in a DNA of their own (this reverses the 27 Oct lean). The Group DNA stays in both modes. In Moss the Moss group is the federation layer and there is one Nondominium group per Moss group, the tool instance's group cell, joined automatically with no invite code. v0.1.0 ships Moss only and no work context. Work contexts and groups are many-to-many (Catmaster: Sensorica, Ludociel, Sainte-Justine). Projects are not NDOs. Three sovereignty levels (NDO, work context, federation) each keep their own governance scope. The internal term is "work context", the displayed term is "project".

## Release scope (requirements.md §2.4)

```board-requirements
- id: REQ-REL-01
  statement: "v0.1.0 ships for Moss only. The standalone build is kept building and passing CI, but is not released."
  falsifier: "A standalone artifact among the v0.1.0 release assets, or a standalone build that fails in CI at the release commit."
  source: "Decision of 2026-11-03 (release board question 7: Moss only, standalone builds but is not released)"
  priority: must
  kind: functional
  why: "One artifact, one guide, one dogfood. Nothing is thrown away."
- id: REQ-REL-02
  statement: "v0.1.0 in Moss ships one Nondominium group per Moss group (the tool instance's group cell, joined automatically, no invite code) and NDOs as cloned cells anchored in that group."
  falsifier: "In a Moss group with two agents, one agent creates an NDO and the other cannot see and open it."
  source: "Decision of 2026-11-03 (release board question 8, option 1); ADR-010 and ADR-011"
  priority: must
  kind: functional
  why: "This is the pilot's whole use case."
- id: REQ-REL-03
  statement: "v0.1.0 ships no work context: no work-context entry type exposed to users, no coordinator function and no interface for it."
  falsifier: "A work-context screen, function or entry type reachable in the v0.1.0 build."
  source: "27 Oct brainstorm, decision 'La v0.1.0 vise une integration Moss de base, sans contexte de travail'; 2026-11-03"
  priority: must
  kind: functional
  why: "Not needed to raise the first release. Question 4 asks whether the entry types ship dormant."
- id: REQ-REL-04
  statement: "The v0.1.0 wiring leaves the seam for v0.2: the Moss group cell is the same cell that will hold work contexts, so adding them does not change how a group is created or joined."
  falsifier: "The v0.2 work-context change requires creating a different group cell or a different join step than v0.1.0 uses."
  source: "Release board epic E4 (the v0.1.0 wiring leaves the right seam)"
  priority: should
  kind: non-functional
  quality: maintainability
  why: "Cheap to hold now, expensive to retrofit. Question 4 decides how far the seam goes."
- id: REQ-REL-05
  statement: "v0.2 adds work contexts in the group DHT (REQ-WC-01 to REQ-WC-07), their many-to-many relation with groups (REQ-WC-03), and the cross-group view that serves the federation layer (REQ-FED-02)."
  falsifier: "A v0.2 release without one of these, or one that stores work contexts in a DNA of their own."
  source: "Decision of 2026-11-03; issue #167"
  priority: should
  kind: functional
  why: "The scope is settled, the date is not."
```

## Group model by deployment mode (lobby-dna.md §5.6)

```board-requirements
- id: REQ-GROUP-19
  statement: "The Group DNA is the group architecture in both deployment modes: a Moss build and a standalone build contain the same group role, and a group cell answers the same zome calls in both."
  falsifier: "A Moss build without the group role, or a zome call that exists in one mode's group cell and not in the other's."
  source: "Decision of 2026-11-03 (the Group DNA stays in both modes)"
  priority: must
  kind: functional
  why: "The decision of the day. It supersedes the earlier wording that delegated the Group DNA to a Moss equivalent."
- id: REQ-GROUP-20
  statement: "In standalone mode a group is a cloned Group DNA cell that an agent creates, registers in the Lobby and opens to others by invite code."
  falsifier: "An agent joins a standalone group without a valid invite code."
  source: "Existing REQ-GROUP-01, REQ-GROUP-05, REQ-LOBBY-10; PR #107 and PR #111"
  priority: must
  kind: functional
  why: "Already implemented; stated so the two modes read side by side."
  checks:
    - "group_sweettest, group test binary (dnas/group/tests/src)"
- id: REQ-GROUP-21
  statement: "In Moss there is exactly one Nondominium group per Moss group: the group cell of the Nondominium tool instance installed in that Moss group. The Moss group is the federation layer above it."
  falsifier: "Two Nondominium group cells for one tool instance, or a member of the Moss group with no Nondominium group to act in."
  source: "Decision of 2026-11-03 (release board question 8, option 1)"
  priority: must
  kind: functional
  why: "The Moss group is the federation layer; one group cell per tool instance keeps membership in one place."
  detail: "The Moss spike (issue M0) checks that Moss accepts a deferred group role. If it does not, this row is reopened."
- id: REQ-GROUP-22
  statement: "In Moss an agent joins the Nondominium group automatically when the agent joins the tool instance. No invite code is requested and no Lobby group announcement is needed to reach the group."
  falsifier: "A Moss-mode screen that asks for an invite code, or a Moss group member who must take a Nondominium-specific step to reach the group's NDOs."
  source: "Decision of 2026-11-03 (joined automatically, no invite code)"
  priority: must
  kind: functional
  why: "Membership belongs to the Moss group; asking twice would duplicate it."
- id: REQ-GROUP-23
  statement: "In Moss, membership and the agent profile come from Moss, and Nondominium does not keep a second copy of either. Standalone keeps the Lobby agent profile and the invite flow unchanged."
  falsifier: "A profile edited in Moss that reads differently in Nondominium, or a Moss-mode write of a Lobby agent profile."
  source: "lobby-architecture.md section 9 (Moss vs standalone feature map); release board issue M2"
  priority: should
  kind: functional
  why: "Avoids two sources of truth. Question 1 asks whether the Lobby role is still present in the Moss build."
```

## Work contexts (lobby-dna.md §5.7, v0.2)

```board-requirements
- id: REQ-WC-01
  statement: "A work context is stored in the Group DHT, as entries of the group cell, in both deployment modes. It has no DNA of its own."
  falsifier: "A work_context DNA or role in workdir/happ.yaml, or a work-context entry written outside a group cell."
  source: "Decision of 2026-11-03; reverses the 27 Oct lean toward a dedicated DNA"
  priority: must
  kind: functional
  why: "Standalone and Moss share one architecture, and a group already makes its NDOs discoverable in one place."
- id: REQ-WC-02
  statement: "A work context is not an NDO: no Nondominium identity, no Layer 0 lifecycle, no PPRs. It is a space and an amalgam of agents, closer to an organizational agent than to a resource."
  falsifier: "A Nondominium identity entry created to represent a work context."
  source: "27 Oct brainstorm, decision 'Les projets ne sont pas des NDO'; 2026-11-03"
  priority: must
  kind: functional
  why: "Valueflows keeps the agent and the resource apart; a project NDO is feasible but not idiomatic. Question 8 asks how this sits with REQ-AGENT-02."
- id: REQ-WC-03
  statement: "Work contexts and groups are many-to-many: a group holds several work contexts, and one work context may be worked in by several groups. Reference case: Catmaster, worked in by Sensorica, Ludociel and Sainte-Justine."
  falsifier: "The Catmaster scenario fails: a work context that three groups each see and work in cannot be set up, or a work context can be attached to one group only."
  source: "27 Oct brainstorm, decision 'plusieurs a plusieurs'; 2026-11-03"
  priority: must
  kind: functional
  why: "Composability all the way up is the point of the model."
  detail: "Open: with the work context living in a group DHT, where does a shared work context's canonical state live? See question 2."
- id: REQ-WC-04
  statement: "A work context works with NDOs by reference, following the pointer pattern of ADR-011: it stores the NDO's clone coordinates (DnaHash, network seed, properties), never a copy of the NDO's data. One NDO may appear in several work contexts."
  falsifier: "NDO data duplicated inside a work context, or an NDO that cannot be listed by two work contexts at once."
  source: "27 Oct brainstorm (interoperability through pointers between DHTs); ADR-011"
  priority: must
  kind: functional
  why: "A copy would fork the NDO's sovereignty."
- id: REQ-WC-05
  statement: "A work context governs its own scope only. Its governance cannot change an NDO's lifecycle or an NDO's governance rules."
  falsifier: "A work-context rule that blocks or triggers an NDO lifecycle transition."
  source: "27 Oct brainstorm (each level has its own plate-bande); REQ-GROUP-18"
  priority: must
  kind: functional
  why: "Keeps the levels sovereign."
- id: REQ-WC-06
  statement: "A work context may clone an NDO to experiment. Disagreements about the clone stay in the clone, and the original NDO and its governance are untouched."
  falsifier: "A governance event or a lifecycle change in a clone that appears on the original NDO."
  source: "27 Oct brainstorm (the cloning illustration of fractal sovereignty)"
  priority: should
  kind: functional
  why: "The clearest test of the sovereignty model. A fork is expressed today by a DerivedFrom hard link."
- id: REQ-WC-07
  statement: "The interface displays a work context as a project by default, and the code and the design documents call it a work context."
  falsifier: "A code identifier that names the entity project, or a default screen that says work context."
  source: "27 Oct brainstorm, decision 'Le contexte de travail est le nom technique interne, projet le nom affiche'; 2026-11-03"
  priority: could
  kind: non-functional
  quality: usability
  why: "A naming rule. Question 9 asks whether the display term should follow Moss's own vocabulary."
```

## Three sovereignty levels (lobby-dna.md §8.4) and federation (§8.5)

```board-requirements
- id: REQ-SOV-01
  statement: "Three sovereignty levels exist, NDO, work context and federation, each with its own governance scope, and no level's governance changes another level's."
  falsifier: "A governance action at one level that alters the lifecycle, the rules or the membership of another level's entity."
  source: "27 Oct brainstorm, decision 'Trois niveaux de souverainete'"
  priority: must
  kind: functional
  why: "The principle the other rows apply."
- id: REQ-SOV-02
  statement: "The NDO governs what it becomes: its lifecycle from idea to design specification, prototype and new versions, including the choice between designs and forking."
  falsifier: "An NDO lifecycle transition decided by a work-context or federation rule."
  source: "27 Oct brainstorm (what each level governs)"
  priority: must
  kind: functional
  why: "Mostly implemented (Layer 0, #80)."
- id: REQ-SOV-03
  statement: "A work context governs which NDOs it works with, the soft links it makes, the direction it develops in, what it submits to an NDO as a version or update, activity management, and the order of contributions before they reach the NDO."
  falsifier: "A work-context rule that acts on something outside this list, or something in this list that only the NDO or the federation can decide."
  source: "27 Oct brainstorm (what each level governs)"
  priority: should
  kind: functional
  why: "Benefit redistribution is left out on purpose: REQ-GROUP-17 places it with NDO governance. Question 3."
- id: REQ-SOV-04
  statement: "The federation governs the list of work contexts, the overall strategy, the link to the macro level and common policies across work contexts."
  falsifier: "A federation rule that acts on a single NDO's lifecycle or on a work context's internal organization."
  source: "27 Oct brainstorm (what each level governs)"
  priority: could
  kind: functional
  why: "Moss groups carry no governance, so nothing holds this yet. Question 6."
- id: REQ-SOV-05
  statement: "A work context may clone an NDO and disagree on the clone without touching the original NDO or its governance."
  falsifier: "A change made on a clone that shows on the original NDO."
  source: "27 Oct brainstorm (cloning as the illustration)"
  priority: should
  kind: functional
  why: "Same test as REQ-WC-06, stated at the level of the model."
- id: REQ-FED-01
  statement: "In Moss the Moss group is the federation layer. Nondominium adds no group-of-groups structure of its own, so groups stay flat. In standalone mode the Lobby remains the only shared layer above groups."
  falsifier: "A Nondominium entry type or role that nests a group inside another group."
  source: "27 Oct brainstorm, decision 'Dans Moss, les groupes Moss sont la couche federative'; REQ-GROUP-03"
  priority: must
  kind: functional
  why: "Nothing to build; the row stops anyone building it. Question 5 asks about standalone."
- id: REQ-FED-02
  statement: "In Moss an agent can view the work contexts of all the agent's groups from one place, across Moss groups."
  falsifier: "An agent in two Moss groups who must open each group's tool instance to learn which work contexts exist."
  source: "27 Oct brainstorm (the source chain gives the agent's groups, groups give work contexts); release board issue M2 (cross-group view out of scope for v0.1.0)"
  priority: should
  kind: functional
  why: "The one concrete thing the federation layer does in v0.2."
```

## Interoperability (lobby-dna.md §7.4)

```board-requirements
- id: REQ-XCUT-05
  statement: "An agent in a standalone Nondominium and an agent in Moss reach the same NDO when both derive the same clone cell from the same coordinates (DnaHash, network seed, properties) and run the same Holochain network protocol."
  falsifier: "An NDO created in Moss whose anchor coordinates, given to a standalone agent on the same protocol, do not open the same cell."
  source: "27 Oct brainstorm, corrections section (measured the same evening on the Moss releases)"
  priority: should
  kind: non-functional
  quality: compatibility
  why: "Not testable in v0.1.0, which ships Moss only. The Moss 0.16 test builds run a patched Holochain 0.7.1 that partitions their network from a standard one."
```

## Open questions

```board-questions
- id: Q1
  q: "Is the Lobby DNA role still present in the Moss build?"
  context: "In Moss, groups are not registered in the Lobby and nobody enters an invite code (REQ-GROUP-22), so the Lobby group registry has no caller. The role is provisioned in the current happ manifest."
  options:
    - "Present but idle in Moss (one manifest for both modes; the Lobby is used again in standalone)"
    - "Absent from the Moss build (a second manifest; one less cell to compile and sync)"
  lean: 0
  why: "One manifest keeps REQ-GROUP-19 (same architecture in both modes) easiest to hold. The cost is one idle cell per agent."
- id: Q2
  q: "Where does a shared work context's canonical state live?"
  context: "A work context lives in a group DHT (decided) and may be worked in by several groups (REQ-WC-03). Those two facts need a rule for which DHT holds the state when Sensorica, Ludociel and Sainte-Justine share Catmaster."
  options:
    - "A home group holds the work context; each other group holds a pointer entry to it, as NdoAnchor does for NDOs (ADR-011)"
    - "Every group holds its own copy of the work context's entries, kept in step"
  lean: 0
  why: "Reuses a pattern that is already built and tested, and a copy would fork the work context's sovereignty, the thing the model protects. The cost: the home group's members must let others in, and the home group is a point of dependency."
- id: Q3
  q: "Does work-context governance cover benefit redistribution (the contribution tables)?"
  context: "The 27 Oct brainstorm places redistribution at the work-context level. REQ-GROUP-17 and section 8.2 say group governance does not govern benefit distribution, which belongs to NDO governance (smart agreements)."
  options:
    - "No: redistribution stays with NDO smart agreements; the work context only orders contributions before they reach the NDO"
    - "Yes: the work context holds its own contribution table, and REQ-GROUP-17 is amended"
  lean: 0
  why: "Changing REQ-GROUP-17 is a scope change in a normative requirement and should be its own decision. Reopen when v0.2 designs contributions."
- id: Q4
  q: "Do the work-context entry types ship dormant in v0.1.0?"
  context: "Integrity code is part of the DNA hash, so adding work-context entry types to the Group DNA in v0.2 produces a different group DNA and a new network. v0.1.0 group cells would not carry over without a migration."
  options:
    - "No: v0.1.0 has no work-context types; v0.2 adds them and the pilot groups are recreated"
    - "Yes: the integrity zome ships the types in v0.1.0, with no coordinator function or UI, so v0.2 only adds coordinator code"
  lean: 0
  why: "The schema is not designed yet, and shipping it dormant locks it before the requirements settle. The pilot has two developer members, so recreating the group costs little. If a wider pilot is expected, take the second option."
- id: Q5
  q: "Is there a federation layer in standalone mode in v0.2?"
  context: "In Moss the Moss group is the federation layer. The 27 Oct brainstorm said that outside Moss the same structure could be cloned for the federation, with differently typed governance, or be a different entity. REQ-GROUP-03 keeps groups flat."
  options:
    - "No: in standalone the Lobby stays the only layer above groups, and federation is Moss-only in v0.2"
    - "Yes: a typed group acts as the federation in standalone, which amends REQ-GROUP-03"
  lean: 0
  why: "Standalone is not released in v0.1.0, so nothing needs it yet."
- id: Q6
  q: "Where does federation governance live in Moss?"
  context: "Moss groups carry no governance of their own. The brainstorm floated offering Moss a federation and work-context governance layer once the work exists, but did not settle it."
  options:
    - "In the Nondominium group cell of the tool instance, which is the one place Nondominium owns in a Moss group"
    - "Nowhere in v0.2: REQ-SOV-04 stays a direction, and the offer to Moss comes later"
  lean: 1
  why: "The group cell is already the work-context home, and a federation rule there would mix two scopes. Better to leave it open than build it before the offer to Moss is made."
- id: Q7
  q: "Where does project management live: in the work context or at the federation?"
  context: "The question that started the brainstorm. It sits between the two upper levels and was left open on 27 Oct."
  options:
    - "In the work context (activity management and contribution order are already in its scope, REQ-SOV-03)"
    - "At the federation (portfolio level: which projects, in what order)"
  lean: 0
  why: "Day-to-day management is activity inside a project; the federation only lists and prioritises projects, which REQ-SOV-04 already covers."
- id: Q8
  q: "Does a work context ever have an NDO twin, given REQ-AGENT-02?"
  context: "REQ-AGENT-02 says collective agents, projects included, have an agent face and may have an NDO as an optional digital twin. REQ-WC-02 says a work context is not an NDO."
  options:
    - "Keep REQ-AGENT-02: the twin, if any, is a separate NDO that the work context points to, and the work context itself is never the NDO"
    - "Amend REQ-AGENT-02: remove the project twin, since a work context is a space, not a resource"
  lean: 0
  why: "A twin is a resource about the project (its design, its documents), which is a legitimate NDO. Only the identification of the two was rejected on 27 Oct."
- id: Q9
  q: "Who may enter a work context, and is the display term aligned with Moss?"
  context: "Bob Haugen's work context is open: agents arrive and leave without a contract. Group membership is invite-only (REQ-GROUP-05). The 27 Oct brainstorm also left open aligning the display term with Moss's own vocabulary to avoid clashes in the interface."
  options:
    - "Any member of an associated group enters and leaves freely; display term stays 'project' unless Moss uses it for something else"
    - "Entry follows a rule each work context sets, with 'project' as the default word"
  lean: 0
  why: "Free entry within a group matches the open-collaboration idea and needs no new mechanism. Not written into the PR as a requirement; it waits on your call."
```
