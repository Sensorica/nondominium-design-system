# Backend coverage

Source: `Sensorica/nondominium@dev` (commit 3cbebf0, read 2026-09-26). Zome and function names below are the real `#[hdk_extern]` names.

## Shared mock backend: `prototypes/ndo-backend.js`

`createBackend().call(zome, fn, input, agent)` mirrors the listed zome functions: same input field names, same enums (`crates/shared/src/types.rs`, `rule_data.rs`) and the same validation messages where the source defines them. There are two conductors per scenario (agent keys `a` :8888 and `b` :8889; names come from the scenario, e.g. Sarah / Marco). Public entries gossip between them. `PrivateParticipationClaim` entries stay on their owner's chain. Data is saved in `localStorage` under the key `ndo-backend-v1`.

| UI action | Zome calls (in order) | Backend file |
|---|---|---|
| Create person | `zome_person::create_person` | zome_person/person.rs |
| Assign role | `zome_person::assign_person_role` (RoleType) | zome_person/role.rs |
| Create group | `zome_group::create_group` (+ membership) | group/zome_group/group_profile.rs |
| Join group | `zome_group::join_group` | group/zome_group/membership.rs |
| Declare NDO | `zome_resource::create_ndo` → `zome_group::create_ndo_anchor` | ndo_identity.rs, ndo_anchor.rs |
| Browse NDOs | `get_all_ndos`, `get_ndos_by_lifecycle_stage / _nature / _property_regime` | ndo_identity.rs |
| Lifecycle transition | `zome_resource::update_lifecycle_stage` (initiator only; Deprecated needs `successor_ndo_hash`) → `refresh_ndo_anchor_lifecycle_stage` | ndo_identity.rs, integrity state machine |
| Transition history | `get_ndo_transition_history` | ndo_identity.rs |
| Resource specification | `zome_resource::create_resource_specification` | resource_specification.rs |
| Governance rule | `zome_resource::create_governance_rule` with typed `RuleData` (AccessRequirement, UsageLimit, TransferCondition, MaintenanceSchedule) | governance_rule.rs |
| Economic resource | `zome_resource::create_economic_resource` (starts `PendingValidation`) | economic_resource.rs |
| Validate | `zome_gouvernance::create_validation_receipt` | validation.rs |
| Operational state | `zome_resource::update_operational_state` (custodian only) | economic_resource.rs |
| Custody transfer | `transfer_custody` → `log_economic_event(TransferCustody)` → `issue_participation_receipts` | economic_resource.rs, economic_event.rs, ppr.rs |
| Commitment | `zome_gouvernance::propose_commitment` (receiver = caller) | commitment.rs |
| Fulfil commitment | [`transfer_custody` →] `log_economic_event` → `claim_commitment` → `issue_participation_receipts` | commitment.rs, ppr.rs |
| Economic event | `zome_gouvernance::log_economic_event` | economic_event.rs |
| Reputation | `derive_reputation_summary` | ppr.rs |
| Offline / sync | Writes commit to the local source chain and gossip on reconnect. This is conductor behaviour, not a zome function. | — |

## Known backend gaps (shown in the UI)

- `claim_commitment` sets `Claim.fulfilled_by` to the commitment hash, not the EconomicEvent (a TODO in commitment.rs). The event → commitment link only exists through the PPR (`fulfills` + `fulfilled_by`).
- `EconomicEvent` has no `fulfills` field.
- `transfer_custody` updates the resource's custodian but does not log an event, so the UI calls `log_economic_event` itself.
- `update_lifecycle_stage` is initiator-only in the MVP. Role-based authorisation is deferred.
- Group signals (`remote_signal`) are still TODO. The UI has to poll.

## A–E (core.jsx)

A–E use the lighter store in `core.jsx`. They show only features the hApp has:
- Each action has a comment naming the zome call it stands for.
- The store enforces the backend rules: initiator-only lifecycle, custodian-only custody and state changes, a successor for Deprecated, invite codes to join a group, and no self-validation.
- Free-text notes use `zome_group::log_work` (description + hours).
- Links between NDOs use `create_ndo_hard_link` (Component / DerivedFrom / Supersedes).
- Capability slots and the trust filter were removed.
- **Signals are not stored.** `deriveSignals()` computes them on the client from open commitments, PendingValidation and Available resources, and MaintenanceSchedule rules. Picking one up runs the matching zome call.
