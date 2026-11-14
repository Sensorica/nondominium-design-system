import { describe, expect, test } from 'bun:test';
import {
  authorSeedWireField,
  commitmentRequiresDistinctAgents,
  isSharedStewardshipRegime,
  participationGrammar
} from './participation-grammar.js';

describe('isSharedStewardshipRegime', () => {
  test('Private is not shared', () => {
    expect(isSharedStewardshipRegime('Private')).toBe(false);
  });

  test('Pool / Nondominium / Commons are shared', () => {
    expect(isSharedStewardshipRegime('Pool')).toBe(true);
    expect(isSharedStewardshipRegime('Nondominium')).toBe(true);
    expect(isSharedStewardshipRegime('Commons')).toBe(true);
  });
});

describe('participationGrammar', () => {
  test('Modify commitment requires distinct agents; publish seeds witness (receiver)', () => {
    const g = participationGrammar({
      action: 'Modify',
      surface: 'commitment',
      propertyRegime: 'Nondominium',
      resourceNature: 'Physical'
    });
    expect(g.requireDistinctAgents).toBe(true);
    expect(g.agents.mode).toBe('bilateral');
    expect(g.initiation).toBe('publish_request');
    expect(g.authorSeed).toBe('witness');
    expect(authorSeedWireField(g)).toBe('receiver');
    expect(g.performerWire).toBe('provider');
    expect(g.family).toBe('Labour');
  });

  test('Modify Private uses Custodian label for witness', () => {
    const g = participationGrammar({
      action: 'Modify',
      surface: 'commitment',
      propertyRegime: 'Private',
      resourceNature: 'Physical'
    });
    expect(g.agents.receiverLabel).toBe('Custodian');
    expect(g.sharedStewardship).toBe(false);
  });

  test('Cite event may be unilateral; Cite commitment is bilateral', () => {
    const event = participationGrammar({
      action: 'Cite',
      surface: 'event',
      resourceNature: 'Digital'
    });
    expect(event.requireDistinctAgents).toBe(false);
    expect(event.agents.mode).toBe('unilateralSame');

    const commitment = participationGrammar({
      action: 'Cite',
      surface: 'commitment',
      resourceNature: 'Digital'
    });
    expect(commitment.requireDistinctAgents).toBe(true);
    expect(commitment.agents.mode).toBe('bilateral');
  });

  test('Consume event unilateral; commitment bilateral', () => {
    expect(
      participationGrammar({
        action: 'Consume',
        surface: 'event',
        resourceNature: 'Physical'
      }).requireDistinctAgents
    ).toBe(false);
    expect(commitmentRequiresDistinctAgents('Consume')).toBe(true);
  });

  test('Labour self_allocate seeds performer (provider)', () => {
    const g = participationGrammar({
      action: 'Work',
      surface: 'commitment',
      initiation: 'self_allocate',
      propertyRegime: 'Commons'
    });
    expect(g.authorSeed).toBe('performer');
    expect(authorSeedWireField(g)).toBe('provider');
  });

  test('TransferCustody publish seeds From (provider)', () => {
    const g = participationGrammar({
      action: 'TransferCustody',
      surface: 'commitment',
      resourceNature: 'Physical'
    });
    expect(authorSeedWireField(g)).toBe('provider');
    expect(g.requireDistinctAgents).toBe(true);
  });
});
