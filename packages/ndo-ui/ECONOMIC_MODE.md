# Use / Consume Layer 0 fork

Physical and Hybrid NDOs (not Digital, not Source) choose an **economic mode** on the create wizard identity step:

| Mode | Meaning | Required fields | Governance pack accent |
|---|---|---|---|
| **Use + unit** | One held thing (tool, artwork) | optional unique ID | access + maintenance |
| **Use + capacity** | Place with concurrent occupancy | max concurrent ≥ 2 | `capacity_limit` |
| **Consume** | This batch / lot depletes | unit, initial qty, lot or stock ID | quota + max per agent |

Categories of similar NDOs emerge later; the NDO itself is the instance or the batch.

Closure (hApp Phase 2): no `Depleted` lifecycle stage — use `EndOfLife` with reason `Depleted` when quantity hits zero.

Code: `domain/wizard-state.ts`, `domain/governance-templates.ts`, `components/patterns/wizard/NarrativeKernelStep.svelte`.
