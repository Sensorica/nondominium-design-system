import { describe, expect, test } from 'bun:test';
import { categoryChipsForNature, startersForNdo } from './spec-starters.js';

describe('startersForNdo', () => {
  test('Physical + Commons yields inventoriable equipment starter', () => {
    const s = startersForNdo({
      name: 'Open Hardware CNC Bed',
      resource_nature: 'Physical',
      property_regime: 'Commons'
    });
    expect(s.length).toBe(3);
    expect(s[0].label).toMatch(/Equipment/i);
    expect(s[0].inventory_intent).toBe('Inventoried');
    expect(s[0].identification_pattern).toBe('Serialized');
    expect(s[0].default_unit).toBe('each');
    expect(s[1].identification_pattern).toBe('Stock');
  });

  test('Nondominium forces Public on starters', () => {
    const s = startersForNdo({
      name: 'Community Solar Array',
      resource_nature: 'Physical',
      property_regime: 'Nondominium'
    });
    expect(s.every((x) => x.scope === 'Public')).toBe(true);
  });

  test('Digital starters are NotApplicable with locators', () => {
    const s = startersForNdo({
      name: 'Sensor Design',
      resource_nature: 'Digital',
      property_regime: 'Commons'
    });
    expect(s.map((x) => x.id)).toEqual([
      'design-package',
      'software',
      'docs',
      'method'
    ]);
    expect(s.every((x) => x.inventory_intent === 'NotApplicable')).toBe(true);
    expect(s.every((x) => x.identification_pattern === null)).toBe(true);
    expect(s.every((x) => x.digital_locator_kind != null)).toBe(true);
    expect(s.every((x) => !/inventoriable/i.test(x.blurb))).toBe(true);
    expect(s.find((x) => x.id === 'software')?.label).toBe('Software / application');
  });

  test('Source Hydrological starters are SourceSpecification patterns', () => {
    const s = startersForNdo({
      name: 'Mill Creek Watershed',
      resource_nature: 'Physical',
      property_regime: 'Nondominium',
      ndo_archetype: 'source_ndo',
      source_type: 'Hydrological'
    });
    expect(s.map((x) => x.id)).toEqual([
      'watershed',
      'river-reach',
      'groundwater',
      'wetland'
    ]);
    expect(s.every((x) => x.inventory_intent === 'NotApplicable')).toBe(true);
    expect(s.every((x) => x.identification_pattern === null)).toBe(true);
    expect(s.every((x) => !!x.boundary_description)).toBe(true);
    expect(s[0].label).toMatch(/Watershed/i);
    expect(s.every((x) => !/equipment|consumable|shareable unit/i.test(x.label))).toBe(true);
  });
});

describe('categoryChipsForNature', () => {
  test('Physical includes equipment', () => {
    expect(categoryChipsForNature('Physical')).toContain('equipment');
  });
  test('Digital includes design and software', () => {
    const chips = categoryChipsForNature('Digital');
    expect(chips).toContain('design');
    expect(chips).toContain('software');
  });

  test('Source Hydrological chips include watershed', () => {
    const chips = categoryChipsForNature('Physical', {
      isSource: true,
      source_type: 'Hydrological'
    });
    expect(chips).toContain('watershed');
    expect(chips).not.toContain('equipment');
  });
});
