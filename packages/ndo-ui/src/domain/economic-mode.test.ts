import { describe, expect, test } from 'bun:test';
import { getGovernanceTemplatesForNdo } from './governance-templates.js';
import {
  buildWizardResult,
  createInitialKernel,
  createInitialRefinement,
  defaultSpecificationDraftForDescriptor,
  deriveSubtraction,
  needsEconomicMode,
  recommendedGovernanceRuleIds,
  validateKernel
} from './wizard-state.js';

describe('economic mode helpers', () => {
  test('needsEconomicMode only for Physical/Hybrid non-Source', () => {
    expect(needsEconomicMode('Physical', false)).toBe(true);
    expect(needsEconomicMode('Hybrid', false)).toBe(true);
    expect(needsEconomicMode('Digital', false)).toBe(false);
    expect(needsEconomicMode('Physical', true)).toBe(false);
  });

  test('deriveSubtraction maps mode + use_kind', () => {
    expect(deriveSubtraction('consume', null)).toBe('consumable');
    expect(deriveSubtraction('use', 'unit')).toBe('unit');
    expect(deriveSubtraction('use', 'capacity')).toBe('capacity');
    expect(deriveSubtraction(null, null)).toBeNull();
  });
});

describe('validateKernel economic fork', () => {
  test('requires mode for Physical active_project', () => {
    const k = createInitialKernel('active_project');
    k.name = 'Printer';
    k.resource_nature = 'Physical';
    expect(validateKernel(k)).toMatch(/use.*consume/i);
  });

  test('accepts use + unit', () => {
    const k = createInitialKernel('active_project');
    k.name = 'Printer';
    k.resource_nature = 'Physical';
    k.economic_mode = 'use';
    k.use_kind = 'unit';
    expect(validateKernel(k)).toBeNull();
  });

  test('requires capacity ≥ 2', () => {
    const k = createInitialKernel('active_project');
    k.name = 'Workshop';
    k.resource_nature = 'Physical';
    k.economic_mode = 'use';
    k.use_kind = 'capacity';
    k.max_concurrent_users = 1;
    expect(validateKernel(k)).toMatch(/capacity/i);
    k.max_concurrent_users = 8;
    expect(validateKernel(k)).toBeNull();
  });

  test('requires consume batch fields', () => {
    const k = createInitialKernel('active_project');
    k.name = 'Tomatoes';
    k.resource_nature = 'Physical';
    k.economic_mode = 'consume';
    expect(validateKernel(k)).toMatch(/unit/i);
    k.default_unit = 'kg';
    expect(validateKernel(k)).toMatch(/quantity/i);
    k.initial_quantity = 250;
    expect(validateKernel(k)).toMatch(/identified/i);
    k.identification_pattern = 'LotControlled';
    expect(validateKernel(k)).toBeNull();
  });

  test('skips inventoriable fork for Digital', () => {
    const k = createInitialKernel('open_design');
    k.name = 'CAD';
    expect(k.resource_nature).toBe('Digital');
    expect(validateKernel(k)).toBeNull();
  });
});

describe('governance packs Use vs Consume', () => {
  test('consume pack includes quota and max_per_agent', () => {
    const ids = getGovernanceTemplatesForNdo({
      regime: 'CommonPool',
      nature: 'Physical',
      economicMode: 'consume'
    }).map((t) => t.id);
    expect(ids).toContain('quota_extraction');
    expect(ids).toContain('max_per_agent');
    expect(ids).toContain('access_accountable');
  });

  test('use unit pack prefers maintenance', () => {
    const ids = getGovernanceTemplatesForNdo({
      regime: 'Private',
      nature: 'Physical',
      economicMode: 'use',
      useKind: 'unit'
    }).map((t) => t.id);
    expect(ids).toContain('access_accountable');
    expect(ids).toContain('maintenance_schedule');
    expect(ids).not.toContain('quota_extraction');
  });

  test('use capacity pack includes capacity_limit with override', () => {
    const templates = getGovernanceTemplatesForNdo({
      regime: 'Private',
      nature: 'Physical',
      economicMode: 'use',
      useKind: 'capacity',
      maxConcurrentUsers: 12
    });
    const cap = templates.find((t) => t.id === 'capacity_limit');
    expect(cap).toBeTruthy();
    expect(cap?.rule_data.max_concurrent_users).toBe(12);
  });

  test('digital still uses integrity for Commons', () => {
    const ids = getGovernanceTemplatesForNdo({
      regime: 'Commons',
      nature: 'Digital'
    }).map((t) => t.id);
    expect(ids).toContain('access_attribution');
    expect(ids).toContain('integrity_manifest');
  });

  test('source pack unchanged', () => {
    const ids = getGovernanceTemplatesForNdo({
      regime: 'Nondominium',
      nature: 'Physical',
      isSourceNdo: true
    }).map((t) => t.id);
    expect(ids).toContain('source_monitoring');
    expect(ids).toContain('no_ownership_transfer');
  });
});

describe('create/review preselect', () => {
  test('buildWizardResult preselects consume pack ids', () => {
    const kernel = createInitialKernel('active_project');
    kernel.name = 'Tomatoes';
    kernel.resource_nature = 'Physical';
    kernel.economic_mode = 'consume';
    kernel.default_unit = 'kg';
    kernel.initial_quantity = 100;
    kernel.identification_pattern = 'LotControlled';
    const refinement = createInitialRefinement('active_project', 'Physical');
    refinement.property_regime = 'CommonPool';
    const result = buildWizardResult(kernel, refinement);
    expect(result.ndo_input.governance_rule_ids).toEqual(
      recommendedGovernanceRuleIds(kernel, refinement)
    );
    expect(result.ndo_input.governance_rule_ids).toContain('quota_extraction');
    expect(result.ndo_input.governance_rule_ids).toContain('max_per_agent');
  });

  test('defaultSpecificationDraftForDescriptor mirrors Use/unit pack', () => {
    const draft = defaultSpecificationDraftForDescriptor({
      hash: 'x',
      name: 'Printer',
      lifecycle_stage: 'Active',
      property_regime: 'Private',
      resource_nature: 'Physical',
      description: null,
      initiator: null,
      created_at: null,
      successor_ndo_hash: null,
      hibernation_origin: null,
      economic_mode: 'use',
      use_kind: 'unit'
    });
    expect(draft.governance_rule_ids).toContain('access_accountable');
    expect(draft.governance_rule_ids).toContain('maintenance_schedule');
  });
});
