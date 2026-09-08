// Classification-coherence predicates, ported from `crates/shared/src/constraints.rs`
// at origin/dev 20adb117219de3e7a1a45b53d8a02fc0602feb7e.
//
// WHY THIS EXISTS AS REAL LOGIC RATHER THAN A FIXTURE. The app's Layer 1 surfaces
// are not forms that collect fields and post them. They are forms that argue with
// you: `RuleEditorModal`, `SpecificationCreateModal`, `CommitmentCreateForm` and
// `EconomicEventCreateForm` all dry-run a constraint check as you type and refuse a
// Hard violation before it can be submitted. A prototype that stubs the check out
// and returns an empty array renders the same pixels and teaches the opposite
// model: it shows a rule editor that accepts anything, when the whole point of
// #132 is that a classification forbids incoherent rules.
//
// So these are ports, not approximations. Each predicate below names the Rust
// function it mirrors, and the rule ids and message text are the app's own, so a
// screenshot of the prototype and a screenshot of the app say the same words.
//
// The one thing deliberately NOT ported is `ResourceNature::default_rivalry` for
// `Service`. Rust answers `NonRivalrous`; `rivalry.ts` answers `null` so the UI can
// prompt for an override. That divergence is the app's own, it lives in
// `ui/src/lib/utils/rivalry.ts`, and this file defers to it rather than
// contradicting either side.

import { defaultRivalryFor } from './rivalry';
import type {
  ConstraintViolation,
  PropertyRegime,
  ResourceNature,
  ResourceScope,
  Rivalry,
  RuleData,
  VfAction
} from './types';

/** Mirrors `constraints.rs::ResourceClassification`. */
export interface ResourceClassification {
  resource_nature: ResourceNature;
  property_regime: PropertyRegime;
  /** `null` at call sites that do not need lifecycle, e.g. rule-definition checks. */
  lifecycle_stage?: string | null;
  rivalry_override?: Rivalry | null;
}

/** Mirrors `PropertyRegime::permits_ownership_transfer`. */
export function permitsOwnershipTransfer(regime: PropertyRegime): boolean {
  return regime === 'Private' || regime === 'Collective';
}

/**
 * Mirrors `PropertyRegime::is_uncapturable`.
 *
 * Only `Nondominium`. `Public` is non-alienable by policy of the stewarding body
 * and is not cryptographically uncapturable, which is why the two regimes diverge
 * in severity below: the same incoherent rule is Hard on Nondominium and Soft on
 * everything else that merely forbids ownership transfer.
 */
export function isUncapturable(regime: PropertyRegime): boolean {
  return regime === 'Nondominium';
}

/** Mirrors `PropertyRegime::default_accessibility`. */
export function defaultAccessibility(regime: PropertyRegime): 'Free' | 'Credentialed' | 'Gated' {
  switch (regime) {
    case 'Private':
      return 'Gated';
    case 'Commons':
    case 'Public':
    case 'Nondominium':
      return 'Free';
    case 'Collective':
    case 'Pool':
    case 'CommonPool':
      return 'Credentialed';
  }
}

/** Mirrors `ResourceClassification::effective_rivalry`, deferring to `rivalry.ts` for the default. */
export function effectiveRivalry(ctx: ResourceClassification): Rivalry | null {
  return ctx.rivalry_override ?? defaultRivalryFor(ctx.resource_nature);
}

export function hasHardViolation(violations: ConstraintViolation[]): boolean {
  return violations.some((v) => v.severity === 'Hard');
}

/** Mirrors `hard_violation_message`. */
export function hardViolationMessage(violations: ConstraintViolation[]): string {
  return violations
    .filter((v) => v.severity === 'Hard')
    .map((v) => `[${v.rule_id}] ${v.message}`)
    .join('; ');
}

/** Mirrors `soft_violation_messages`. */
export function softViolationMessages(violations: ConstraintViolation[]): string[] {
  return violations
    .filter((v) => v.severity === 'Soft')
    .map((v) => `[${v.rule_id}] ${v.message}`);
}

/** Mirrors `check_rule_data_permitted`: which `RuleData` variants a classification allows. */
export function checkRuleDataPermitted(
  ctx: ResourceClassification,
  ruleData: RuleData
): ConstraintViolation[] {
  if ('TransferCondition' in ruleData) {
    if (ruleData.TransferCondition.transfer_type !== 'Ownership') return [];
    if (permitsOwnershipTransfer(ctx.property_regime)) return [];
    return [
      {
        rule_id: 'ownership_transfer_not_permitted_by_regime',
        message: `${ctx.property_regime} does not permit ownership-transfer rules.`,
        severity: isUncapturable(ctx.property_regime) ? 'Hard' : 'Soft'
      }
    ];
  }

  if ('AccessRequirement' in ruleData) {
    if (ruleData.AccessRequirement.accessibility !== 'Gated') return [];
    if (!isUncapturable(ctx.property_regime)) return [];
    return [
      {
        rule_id: 'gated_access_contradicts_permissionless_regime',
        message:
          "Nondominium resources must remain permissionless (REQ-RES-01); 'Gated' access creates a discretionary chokepoint.",
        severity: 'Soft'
      }
    ];
  }

  return [];
}

/** Mirrors `check_transport_applicability`: Move does not apply to Digital or Information. */
export function checkTransportApplicability(
  ctx: ResourceClassification,
  action: VfAction
): ConstraintViolation | null {
  const nonPhysical = ctx.resource_nature === 'Digital' || ctx.resource_nature === 'Information';
  if (action !== 'Move' || !nonPhysical) return null;
  return {
    rule_id: 'no_transport_for_non_physical_nature',
    message: `Transport (Move) does not apply to a ${ctx.resource_nature} resource.`,
    severity: 'Soft'
  };
}

/** Mirrors `check_capture_resistance`: Transfer, Consume and Lower are Hard-forbidden on Nondominium. */
export function checkCaptureResistance(
  ctx: ResourceClassification,
  action: VfAction
): ConstraintViolation | null {
  if (!isUncapturable(ctx.property_regime)) return null;
  const forbidden = action === 'Transfer' || action === 'Consume' || action === 'Lower';
  if (!forbidden) return null;
  return {
    rule_id: 'nondominium_no_unilateral_capture',
    message: `${action} is not permitted on a Nondominium resource (REQ-RES-03).`,
    severity: 'Hard'
  };
}

/**
 * Mirrors `check_scope_coherence`.
 *
 * Hard, and the Rust comment explains why it is the one Layer 1 field that can
 * quietly undo a Layer 0 guarantee: narrowing an open-access regime's scope is
 * enclosure by visibility. The resource stays technically unownable while becoming
 * undiscoverable to everyone outside the narrowing group.
 */
export function checkScopeCoherence(
  ctx: ResourceClassification,
  scope: ResourceScope
): ConstraintViolation | null {
  const openAccess =
    ctx.property_regime === 'Nondominium' || ctx.property_regime === 'Public';
  if (!openAccess || scope === 'Public') return null;
  return {
    rule_id: 'open_regime_requires_public_scope',
    message: `A ${ctx.property_regime} resource cannot carry ${scope} scope; it implies Public scope (REQ-RES-03).`,
    severity: 'Hard'
  };
}

/** Mirrors `check_action_permitted`: composes the action-execution predicates. */
export function checkActionPermitted(
  ctx: ResourceClassification,
  action: VfAction
): ConstraintViolation[] {
  return [checkCaptureResistance(ctx, action), checkTransportApplicability(ctx, action)].filter(
    (v): v is ConstraintViolation => v !== null
  );
}
