import { describe, expect, test } from 'bun:test';
import {
  defaultForeshadowForNature,
  foreshadowBadge,
  trackingFieldsApply,
  validateForeshadow
} from './spec-inventory.js';

describe('defaultForeshadowForNature', () => {
  test('Digital defaults to NotApplicable with content-addressed locator', () => {
    const f = defaultForeshadowForNature('Digital');
    expect(f.inventory_intent).toBe('NotApplicable');
    expect(f.identification_pattern).toBeNull();
    expect(f.default_unit).toBeNull();
    expect(f.digital_locator_kind).toBe('ContentAddressed');
    expect(f.digital_locator).toBeNull();
  });

  test('Physical defaults to Inventoried Serialized each', () => {
    const f = defaultForeshadowForNature('Physical');
    expect(f.inventory_intent).toBe('Inventoried');
    expect(f.identification_pattern).toBe('Serialized');
    expect(f.default_unit).toBe('each');
    expect(f.digital_locator_kind).toBeNull();
  });
});

describe('validateForeshadow', () => {
  test('Inventoried without pattern fails', () => {
    const r = validateForeshadow({
      inventory_intent: 'Inventoried',
      identification_pattern: null,
      default_unit: 'each',
      substitutable: false
    });
    expect(r.ok).toBe(false);
  });

  test('Inventoried without unit fails', () => {
    const r = validateForeshadow({
      inventory_intent: 'Inventoried',
      identification_pattern: 'Stock',
      default_unit: '  ',
      substitutable: true
    });
    expect(r.ok).toBe(false);
  });

  test('Inventoried with pattern and unit passes', () => {
    const r = validateForeshadow({
      inventory_intent: 'Inventoried',
      identification_pattern: 'Serialized',
      default_unit: 'each',
      substitutable: false
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.foreshadow.default_unit).toBe('each');
    }
  });

  test('NotApplicable clears pattern and unit', () => {
    const r = validateForeshadow({
      inventory_intent: 'NotApplicable',
      identification_pattern: 'Stock',
      default_unit: 'kg',
      substitutable: null
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.foreshadow.identification_pattern).toBeNull();
      expect(r.foreshadow.default_unit).toBeNull();
    }
  });

  test('NotInventoried allows empty pattern/unit', () => {
    const r = validateForeshadow({
      inventory_intent: 'NotInventoried',
      identification_pattern: null,
      default_unit: null,
      substitutable: null
    });
    expect(r.ok).toBe(true);
  });

  test('Digital nature forces NotApplicable and keeps locator', () => {
    const r = validateForeshadow(
      {
        inventory_intent: 'Inventoried',
        identification_pattern: 'Serialized',
        default_unit: 'each',
        substitutable: false,
        digital_locator_kind: 'Url',
        digital_locator: 'https://example.org/design'
      },
      'Digital'
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.foreshadow.inventory_intent).toBe('NotApplicable');
      expect(r.foreshadow.identification_pattern).toBeNull();
      expect(r.foreshadow.default_unit).toBeNull();
      expect(r.foreshadow.digital_locator_kind).toBe('Url');
      expect(r.foreshadow.digital_locator).toBe('https://example.org/design');
    }
  });

  test('Source forces NotApplicable and keeps boundary fields', () => {
    const r = validateForeshadow(
      {
        inventory_intent: 'Inventoried',
        identification_pattern: 'Serialized',
        default_unit: 'each',
        substitutable: false,
        boundary_description: ' Basin extent ',
        monitoring_plan: 'Flow gauges'
      },
      'Physical',
      { isSource: true }
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.foreshadow.inventory_intent).toBe('NotApplicable');
      expect(r.foreshadow.identification_pattern).toBeNull();
      expect(r.foreshadow.boundary_description).toBe('Basin extent');
      expect(r.foreshadow.monitoring_plan).toBe('Flow gauges');
    }
  });
});

describe('trackingFieldsApply', () => {
  test('true for Inventoried and NotInventoried', () => {
    expect(trackingFieldsApply('Inventoried')).toBe(true);
    expect(trackingFieldsApply('NotInventoried')).toBe(true);
    expect(trackingFieldsApply('NotApplicable')).toBe(false);
  });
});

describe('foreshadowBadge', () => {
  test('Serialized · each', () => {
    expect(
      foreshadowBadge({
        inventory_intent: 'Inventoried',
        identification_pattern: 'Serialized',
        default_unit: 'each',
        substitutable: false
      })
    ).toBe('Serialized · each');
  });

  test('Not inventoried', () => {
    expect(
      foreshadowBadge({
        inventory_intent: 'NotApplicable',
        identification_pattern: null,
        default_unit: null,
        substitutable: null
      })
    ).toBe('Not inventoried');
  });

  test('Digital locator badge', () => {
    expect(
      foreshadowBadge({
        inventory_intent: 'NotApplicable',
        identification_pattern: null,
        default_unit: null,
        substitutable: null,
        digital_locator_kind: 'Repository',
        digital_locator: null
      })
    ).toBe('Digital · Source repository');
  });

  test('Source specification badge', () => {
    expect(
      foreshadowBadge({
        inventory_intent: 'NotApplicable',
        identification_pattern: null,
        default_unit: null,
        substitutable: null,
        boundary_description: 'Drainage basin',
        monitoring_plan: null
      })
    ).toBe('Source specification');
  });
});
