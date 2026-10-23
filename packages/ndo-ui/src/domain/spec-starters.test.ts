import { describe, expect, test } from 'bun:test';
import { categoryChipsForNature, startersForNdo } from './spec-starters.js';

describe('startersForNdo', () => {
  test('Physical + Commons yields up to three starters with Project-capable scope', () => {
    const s = startersForNdo({
      name: 'Open Hardware CNC Bed',
      resource_nature: 'Physical',
      property_regime: 'Commons'
    });
    expect(s.length).toBe(3);
    expect(s[0].label).toMatch(/Equipment/i);
    expect(s[0].name).toContain('Open Hardware CNC Bed');
    expect(['Project', 'Network', 'Public']).toContain(s[0].scope);
  });

  test('Nondominium forces Public on starters', () => {
    const s = startersForNdo({
      name: 'Community Solar Array',
      resource_nature: 'Physical',
      property_regime: 'Nondominium'
    });
    expect(s.every((x) => x.scope === 'Public')).toBe(true);
  });

  test('Digital offers design / docs / method', () => {
    const s = startersForNdo({
      name: 'Sensor Design',
      resource_nature: 'Digital',
      property_regime: 'Commons'
    });
    expect(s.map((x) => x.id)).toEqual(['design-package', 'docs', 'method']);
  });
});

describe('categoryChipsForNature', () => {
  test('Physical includes equipment', () => {
    expect(categoryChipsForNature('Physical')).toContain('equipment');
  });
  test('Digital includes design', () => {
    expect(categoryChipsForNature('Digital')).toContain('design');
  });
});
