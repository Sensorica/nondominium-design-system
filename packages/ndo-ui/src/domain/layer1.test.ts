import { describe, expect, test } from 'bun:test';
import {
  canActivateLayer1,
  resolveScope,
  validateSpecInput,
  SPEC_NAME_MAX_LENGTH
} from './layer1.js';

describe('canActivateLayer1', () => {
  test('refuses Ideation', () => {
    expect(canActivateLayer1('Ideation')).toBe(false);
  });

  test('refuses Hibernating', () => {
    expect(canActivateLayer1('Hibernating')).toBe(false);
  });

  test('refuses Deprecated and EndOfLife', () => {
    expect(canActivateLayer1('Deprecated')).toBe(false);
    expect(canActivateLayer1('EndOfLife')).toBe(false);
  });

  test('allows Specification and Active', () => {
    expect(canActivateLayer1('Specification')).toBe(true);
    expect(canActivateLayer1('Active')).toBe(true);
  });

  test('allows Stable and Distributed', () => {
    expect(canActivateLayer1('Stable')).toBe(true);
    expect(canActivateLayer1('Distributed')).toBe(true);
  });
});

describe('resolveScope', () => {
  test('Nondominium forces Public', () => {
    expect(resolveScope('Nondominium', 'Project')).toBe('Public');
    expect(resolveScope('Nondominium', 'Network')).toBe('Public');
  });

  test('Public regime forces Public scope', () => {
    expect(resolveScope('Public', 'Project')).toBe('Public');
  });

  test('Commons keeps Project', () => {
    expect(resolveScope('Commons', 'Project')).toBe('Project');
  });

  test('Private keeps Network', () => {
    expect(resolveScope('Private', 'Network')).toBe('Network');
  });
});

describe('validateSpecInput', () => {
  test('rejects empty name', () => {
    const r = validateSpecInput({
      name: '  ',
      description: 'A description',
      scope: 'Project'
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/Name cannot be empty/);
  });

  test('rejects name over 100 characters', () => {
    const r = validateSpecInput({
      name: 'x'.repeat(SPEC_NAME_MAX_LENGTH + 1),
      description: 'A description',
      scope: 'Project'
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/at most 100/);
  });

  test('rejects empty description', () => {
    const r = validateSpecInput({
      name: 'Kind',
      description: '',
      scope: 'Project'
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/Description cannot be empty/);
  });

  test('accepts a valid input and defaults category', () => {
    const r = validateSpecInput({
      name: 'Kind of item',
      description: 'What it is',
      scope: 'Public',
      tags: [' a ', '', 'b']
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.input.category).toBe('general');
      expect(r.input.tags).toEqual(['a', 'b']);
      expect(r.input.image_url).toBeNull();
    }
  });
});
