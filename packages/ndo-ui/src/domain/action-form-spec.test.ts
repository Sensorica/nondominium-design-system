import { describe, expect, test } from 'bun:test';
import {
  actionFormSpec,
  validateCommitmentDraft
} from './action-form-spec.js';

describe('actionFormSpec', () => {
  test('Digital Cite commitment: bilateral performer + witness (closure)', () => {
    const s = actionFormSpec('Cite', {
      resourceNature: 'Digital',
      surface: 'commitment'
    });
    expect(s.agents.mode).toBe('bilateral');
    expect(s.requireDistinctAgents).toBe(true);
    expect(s.agents.providerLabel).toBe('Citer');
    expect(s.agents.receiverLabel).toBe('Witness');
    expect(s.time.mode).toBe('punctual');
    expect(s.time.defaultToNow).toBe(true);
    expect(s.resourceHash.presence).toBe('hidden');
    expect(s.resourceQuantity.presence).toBe('hidden');
    expect(s.effortQuantity.presence).toBe('hidden');
    expect(s.phase2).toEqual([]);
  });

  test('Digital Cite event: unilateralSame allowed', () => {
    const s = actionFormSpec('Cite', {
      resourceNature: 'Digital',
      surface: 'event'
    });
    expect(s.agents.mode).toBe('unilateralSame');
    expect(s.requireDistinctAgents).toBe(false);
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
    expect(s.authorSeedWire).toBe('provider');
  });

  test('Consume commitment: bilateral; event unilateral', () => {
    const c = actionFormSpec('Consume', {
      resourceNature: 'Physical',
      economicMode: 'consume',
      hasInventoriableResource: true,
      surface: 'commitment'
    });
    expect(c.agents.mode).toBe('bilateral');
    expect(c.requireDistinctAgents).toBe(true);
    expect(c.resourceQuantity.presence).toBe('required');

    const e = actionFormSpec('Consume', {
      resourceNature: 'Physical',
      economicMode: 'consume',
      hasInventoriableResource: true,
      surface: 'event'
    });
    expect(e.agents.mode).toBe('unilateralSame');
  });

  test('Work: effort required on commitment; Modify seeds witness wire', () => {
    const s = actionFormSpec('Work', {
      resourceNature: 'Digital',
      surface: 'commitment'
    });
    expect(s.effortQuantity.presence).toBe('required');
    expect(s.resourceQuantity.presence).toBe('hidden');

    const m = actionFormSpec('Modify', {
      resourceNature: 'Physical',
      propertyRegime: 'Nondominium',
      surface: 'commitment'
    });
    expect(m.authorSeedWire).toBe('receiver');
    expect(m.requireDistinctAgents).toBe(true);
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
      provider: 'agentA',
      receiver: 'agentB',
      timeLocal: '2026-01-01T12:00',
      resourceHash: 'hash'
    });
    expect(errs).toEqual([]);
  });
});

describe('validateCommitmentDraft', () => {
  test('Cite commitment needs both agents + when; rejects same agent', () => {
    const s = actionFormSpec('Cite', { resourceNature: 'Digital', surface: 'commitment' });
    expect(validateCommitmentDraft(s, {})).toEqual(
      expect.arrayContaining(['Citer is required.', 'Witness is required.', 'When is required.'])
    );
    expect(
      validateCommitmentDraft(s, {
        provider: 'me',
        receiver: 'me',
        timeLocal: '2026-01-01T00:00'
      })
    ).toEqual(
      expect.arrayContaining([
        'Citer and Witness must be different agents.'
      ])
    );
    expect(
      validateCommitmentDraft(s, {
        provider: 'me',
        receiver: 'other',
        timeLocal: '2026-01-01T00:00'
      })
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
