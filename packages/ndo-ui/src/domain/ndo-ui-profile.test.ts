import { describe, expect, test } from 'bun:test';
import { deriveEconomicFork, deriveNdoUiProfile } from './ndo-ui-profile.js';

describe('deriveEconomicFork', () => {
  test('Digital and Source are none', () => {
    expect(deriveEconomicFork({ resourceNature: 'Digital' })).toBe('none');
    expect(deriveEconomicFork({ resourceNature: 'Physical', isSource: true })).toBe('none');
  });

  test('maps use/consume kinds', () => {
    expect(
      deriveEconomicFork({ resourceNature: 'Physical', economicMode: 'consume' })
    ).toBe('consume');
    expect(
      deriveEconomicFork({
        resourceNature: 'Physical',
        economicMode: 'use',
        useKind: 'capacity'
      })
    ).toBe('use_capacity');
    expect(
      deriveEconomicFork({ resourceNature: 'Hybrid', economicMode: 'use', useKind: 'unit' })
    ).toBe('use_unit');
  });
});

describe('deriveNdoUiProfile', () => {
  test('Digital: no inventoriable create, Cite default, Commons pack', () => {
    const p = deriveNdoUiProfile({
      resourceNature: 'Digital',
      propertyRegime: 'Commons',
      existingSpecCount: 0
    });
    expect(p.isDigital).toBe(true);
    expect(p.needsEconomicMode).toBe(false);
    expect(p.economicFork).toBe('none');
    expect(p.resources.allowSpecCreate).toBe(true);
    expect(p.resources.allowInstanceCreate).toBe(false);
    expect(p.activity.defaultAction).toBe('Cite');
    expect(p.governance.recommendedIds).toContain('access_attribution');
  });

  test('first-order: second spec blocked', () => {
    const p = deriveNdoUiProfile({
      resourceNature: 'Digital',
      propertyRegime: 'Commons',
      existingSpecCount: 1
    });
    expect(p.resources.allowSpecCreate).toBe(false);
  });

  test('consume fork: instance create blocked; action palette omits Use', () => {
    const p = deriveNdoUiProfile({
      resourceNature: 'Physical',
      propertyRegime: 'CommonPool',
      economicMode: 'consume',
      existingSpecCount: 1,
      hasInventoriableResource: true
    });
    expect(p.economicFork).toBe('consume');
    expect(p.resources.allowSpecCreate).toBe(false);
    expect(p.resources.allowInstanceCreate).toBe(false);
    expect(p.actionPalette.omitted).toContain('Use');
    expect(p.governance.recommendedIds).toContain('quota_extraction');
  });

  test('host maturity + applied filter applyableIds', () => {
    const p = deriveNdoUiProfile({
      resourceNature: 'Digital',
      propertyRegime: 'Commons',
      creatableRuleIds: ['access_attribution'],
      appliedRuleIds: ['access_attribution']
    });
    expect(p.governance.creatableIds).toEqual(['access_attribution']);
    expect(p.governance.appliedIds).toEqual(['access_attribution']);
    expect(p.governance.applyableIds).toEqual([]);
  });

  test('fulfillPolicy is always bilateral_once', () => {
    expect(deriveNdoUiProfile({ resourceNature: 'Physical' }).activity.fulfillPolicy).toBe(
      'bilateral_once'
    );
  });
});
