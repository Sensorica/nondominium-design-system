import { describe, expect, test } from 'bun:test';
import { actionsForNdoContext, omittedActionsForContext } from './vf-actions.js';

describe('actionsForNdoContext', () => {
  test('Digital: Cite first; Move/Consume/Use omitted without inventoriable stock', () => {
    const p = actionsForNdoContext({ resourceNature: 'Digital' });
    expect(p.defaultAction).toBe('Cite');
    expect(p.primary).toContain('Cite');
    expect(p.primary).toContain('Work');
    for (const a of ['Move', 'TransferCustody', 'Consume', 'Use', 'AccessForUse'] as const) {
      expect(p.omitted).toContain(a);
    }
    expect(p.primary).not.toContain('Move');
    expect([...p.primary, ...p.more]).not.toContain('Consume');
  });

  test('Use mode: Use first; Consume omitted', () => {
    const p = actionsForNdoContext({
      resourceNature: 'Physical',
      economicMode: 'Use',
      hasInventoriableResource: true
    });
    expect(p.defaultAction).toBe('Use');
    expect(p.primary[0]).toBe('Use');
    expect(p.omitted).toContain('Consume');
    expect([...p.primary, ...p.more]).not.toContain('Consume');
  });

  test('Consume mode: Consume first; Use omitted', () => {
    const p = actionsForNdoContext({
      resourceNature: 'Physical',
      economicMode: 'consume',
      hasInventoriableResource: true
    });
    expect(p.defaultAction).toBe('Consume');
    expect(p.omitted).toContain('Use');
    expect([...p.primary, ...p.more]).not.toContain('Use');
  });

  test('Nondominium: Transfer/Consume/Lower Hard-omitted', () => {
    const omitted = omittedActionsForContext({
      resourceNature: 'Physical',
      propertyRegime: 'Nondominium'
    });
    expect(omitted.has('Transfer')).toBe(true);
    expect(omitted.has('Consume')).toBe(true);
    expect(omitted.has('Lower')).toBe(true);
    const p = actionsForNdoContext({
      resourceNature: 'Physical',
      propertyRegime: 'Nondominium'
    });
    expect([...p.primary, ...p.more]).not.toContain('Transfer');
  });

  test('primary and more partition without overlap', () => {
    const p = actionsForNdoContext({ resourceNature: 'Hybrid', economicMode: 'use' });
    const overlap = p.primary.filter((a) => p.more.includes(a));
    expect(overlap).toEqual([]);
    for (const a of p.omitted) {
      expect(p.primary).not.toContain(a);
      expect(p.more).not.toContain(a);
    }
  });
});
