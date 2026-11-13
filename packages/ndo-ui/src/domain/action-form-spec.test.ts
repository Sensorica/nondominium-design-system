import { describe, expect, test } from 'bun:test';
import {
  actionFormSpec,
  validateCommitmentDraft
} from './action-form-spec.js';

describe('actionFormSpec', () => {
  test('Digital Cite: unilateral, punctual, no qty/hash/effort', () => {
    const s = actionFormSpec('Cite', {
      resourceNature: 'Digital',
      surface: 'commitment'
    });
    expect(s.agents.mode).toBe('unilateralSame');
    expect(s.agents.singleLabel).toBe('Citer');
    expect(s.time.mode).toBe('punctual');
    expect(s.time.defaultToNow).toBe(true);
    expect(s.resourceHash.presence).toBe('hidden');
    expect(s.resourceQuantity.presence).toBe('hidden');
    expect(s.effortQuantity.presence).toBe('hidden');
    expect(s.phase2).toEqual([]);
  });

  test('Physical Use inventoriable: bilateral, intervalEnd, hash required, Phase 2 interval', () => {
    const s = actionFormSpec('Use', {
      resourceNature: 'Physical',
      economicMode: 'use',
      hasInventoriableResource: true,
      surface: 'commitment'
    });
    expect(s.agents.mode).toBe('bilateral');
    expect(s.agents.providerLabel).toBe('Custodian');
    expect(s.agents.receiverLabel).toBe('User');
    expect(s.time.mode).toBe('intervalEnd');
    expect(s.time.label).toBe('Until');
    expect(s.resourceHash.presence).toBe('required');
    expect(s.effortQuantity.presence).toBe('optional');
    expect(s.phase2.map((p) => p.id)).toEqual(['hasBeginning', 'hasEnd']);
  });

  test('TransferCustody: From/To, inventoriable hash required', () => {
    const s = actionFormSpec('TransferCustody', {
      resourceNature: 'Physical',
      economicMode: 'use',
      hasInventoriableResource: true,
      surface: 'commitment'
    });
    expect(s.agents.mode).toBe('bilateral');
    expect(s.agents.providerLabel).toBe('From');
    expect(s.agents.receiverLabel).toBe('To');
    expect(s.resourceHash.presence).toBe('required');
    expect(s.effortQuantity.presence).toBe('hidden');
  });

  test('Consume: unilateral, resource qty required, effort hidden', () => {
    const s = actionFormSpec('Consume', {
      resourceNature: 'Physical',
      economicMode: 'consume',
      hasInventoriableResource: true,
      surface: 'commitment'
    });
    expect(s.agents.mode).toBe('unilateralSame');
    expect(s.time.mode).toBe('punctual');
    expect(s.resourceQuantity.presence).toBe('required');
    expect(s.effortQuantity.presence).toBe('hidden');
  });

  test('Work: effort required on commitment', () => {
    const s = actionFormSpec('Work', {
      resourceNature: 'Digital',
      surface: 'commitment'
    });
    expect(s.effortQuantity.presence).toBe('required');
    expect(s.resourceQuantity.presence).toBe('hidden'); // digital no inventoriable
  });

  test('event surface: Work effort becomes optional; inventoriable qty required', () => {
    const s = actionFormSpec('Work', {
      resourceNature: 'Physical',
      hasInventoriableResource: true,
      surface: 'event'
    });
    expect(s.surface).toBe('event');
    expect(s.effortQuantity.presence).toBe('optional');
    expect(s.resourceQuantity.presence).toBe('required');
    expect(s.resourceHash.presence).toBe('required');
  });

  test('Move lists Phase 2 targetLocation but Phase 1 validator ignores it', () => {
    const s = actionFormSpec('Move', {
      resourceNature: 'Physical',
      hasInventoriableResource: true,
      surface: 'commitment'
    });
    expect(s.phase2.map((p) => p.id)).toContain('targetLocation');
    const errs = validateCommitmentDraft(s, {
      provider: 'agent',
      timeLocal: '2026-01-01T12:00',
      resourceHash: 'hash'
    });
    expect(errs).toEqual([]);
  });
});

describe('validateCommitmentDraft', () => {
  test('Cite needs agent + when', () => {
    const s = actionFormSpec('Cite', { resourceNature: 'Digital', surface: 'commitment' });
    expect(validateCommitmentDraft(s, {})).toEqual(
      expect.arrayContaining(['Citer is required.', 'When is required.'])
    );
    expect(
      validateCommitmentDraft(s, { provider: 'me', timeLocal: '2026-01-01T00:00' })
    ).toEqual([]);
  });

  test('Work requires effort quantity', () => {
    const s = actionFormSpec('Work', {
      resourceNature: 'Physical',
      hasInventoriableResource: true,
      surface: 'commitment'
    });
    const errs = validateCommitmentDraft(s, {
      provider: 'a',
      receiver: 'b',
      timeLocal: '2026-01-01T00:00'
    });
    expect(errs).toContain('Effort quantity is required.');
  });

  test('TransferCustody bilateral requires From and To', () => {
    const s = actionFormSpec('TransferCustody', {
      resourceNature: 'Physical',
      hasInventoriableResource: true,
      surface: 'commitment'
    });
    const errs = validateCommitmentDraft(s, {
      provider: 'a',
      timeLocal: '2026-01-01T00:00',
      resourceHash: 'h'
    });
    expect(errs).toContain('To is required.');
  });
});
