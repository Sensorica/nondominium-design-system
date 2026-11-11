# Use / Consume Layer 0 fork

## UI capability model

Screens should not re-derive nature × regime × mode exceptions ad hoc. Use
`deriveNdoUiProfile` (`domain/ndo-ui-profile.ts`) as the single expansion point:

- `resources.allowSpecCreate` / `allowInstanceCreate` — Resources tab CTAs
- `actionPalette` / `activity.defaultAction` — Commitment & event forms
- `governance.recommended` / `applyableIds` — Governance template picker
- `economicFork` — Use unit / capacity / Consume / none

The create wizard mutates kernel/refinement only through `reduceWizard`
(`domain/wizard-machine.ts`) so dependent fields realign in one place.
Governance inventoriable packs are decision-table driven in
`domain/governance-templates.ts`.

Physical and Hybrid NDOs (not Digital, not Source) choose an **economic mode** on the create wizard identity step:

| Mode | Meaning | Required fields | Governance pack accent |
|---|---|---|---|
| **Use + unit** | One held thing (tool, artwork) | optional unique ID | access + maintenance |
| **Use + capacity** | Place with concurrent occupancy | max concurrent ≥ 2 | `capacity_limit` |
| **Consume** | This batch / lot depletes | unit, initial qty, lot or stock ID | quota + max per agent |

Categories of similar NDOs emerge later; the NDO itself is the instance or the batch.

## Resources UI

When `economic_mode` is set, hard dual create seeds the Layer 1 `ResourceSpecification` and the Layer 2 `EconomicResource` — either at create (if the lifecycle stage is already Layer-1-eligible) or on the **first transition into a Layer-1-eligible stage** (e.g. Ideation → Specification). Consume foreshadows `initial_quantity` on the identity so deferred dual create has a qty.

The Resources tab may **edit** that specification and list the inventoriable resource (qty, operational state, copy action hash for events) but **must not** offer:

- **A second specification** — the NDO already has its form from dual create
- **Create instance** / `create_economic_resource` — Use: a second instance would mean a different NDO; Consume: a new delivery is a new NDO

Activity forms should target the seeded EconomicResource (locked when exactly one instance exists), not a free-form multi-instance paste.

### Singular Layer 1 (first-order NDOs)

First-order NDOs treat Layer 1 as **one live form** of this thing (REQ-NDO-L1-03 versions are edits/supersedes, not sibling “kinds”):

- **Zero specs** → “+ Specify this NDO” (Source: “+ Specify this Source”).
- **One or more specs** → no create CTA; edit the canonical (latest) specification.
- **Another concrete artifact** → a **new NDO**, not another spec row.

`allowsManualKindOfItemCreate` is true only when `!economicMode` and `existingSpecCount === 0`. Inventoriable forks stay blocked via `economicMode`. Manual inventoriable **instance** creates remain only for Physical/Hybrid when `economic_mode` is unset (legacy). **Digital** and **Source** never show Inventoried instances.

### Digital defaults (UI)

- Layer 0 / create wizard and foreshadow: Digital → `inventory_intent: NotApplicable` (and digital locator fields).
- Activity: default VfAction **Cite** (not Use); inventoriable-resource prompts show a Digital message instead of a paste box.
- Action selects use `actionsForNdoContext` (`domain/vf-actions.ts`): primary shortlist + More; Hard/nature-nonsense omitted.
- Fulfill consent (`domain/fulfillment-consent.ts`): only the non-author may initiate `fulfill_commitment_closure`; gray out Fulfill for the commitment author with `OWN_COMMITMENT_FULFILL_HINT`. Already-fulfilled commitments (`CommitmentRecord.fulfilled`) show a Fulfilled badge — each commitment is closed once.

- Governance templates: host passes `creatableRuleIds`; non-creatable rows show Soon and are not selectable. Digital × Commons `access_attribution` maps to Free access until attribution is typed.
- Create wizard **recommends** templates on Review but does **not** preselect or auto-apply them. The agent opens Governance, selects, and presses Apply selected (same for every NDO).
- Templates already represented by on-chain rules show as **Applied**, are not selectable, and Apply skips them so repeats do not create duplicates.



- Legacy single-form create (hApp `NdoCreateModal`): Digital/Hybrid nature tooltips; Digital warning that inventoriable flows need the wizard / Resources path for Physical/Hybrid only.
- Hybrid copy: inventory may track the physical twin; the digital face is located by address, not shelf units.
- Digital (and any first-order NDO with a spec already) never offers a second specification CTA.

Closure (hApp Phase 2): no `Depleted` lifecycle stage — use `EndOfLife` with reason `Depleted` when quantity hits zero.

Code: `domain/wizard-state.ts`, `domain/governance-templates.ts`, `components/patterns/wizard/NarrativeKernelStep.svelte`, `components/patterns/perspectives/ResourcesPanel.svelte`, `SpecificationFormModal.svelte`, `ActivityTabStub.svelte`.
