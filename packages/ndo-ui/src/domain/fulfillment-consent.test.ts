import { describe, expect, test } from 'bun:test';
import {
  ALREADY_FULFILLED_HINT,
  OWN_COMMITMENT_FULFILL_HINT,
  canInitiateCommitmentFulfillment,
  fulfillCommitmentErrorMessage
} from './fulfillment-consent.js';

describe('canInitiateCommitmentFulfillment', () => {
  test('author cannot initiate', () => {
    expect(
      canInitiateCommitmentFulfillment({ myAgentB64: 'agentA', authorB64: 'agentA' })
    ).toBe(false);
  });

  test('non-author can initiate', () => {
    expect(
      canInitiateCommitmentFulfillment({ myAgentB64: 'agentB', authorB64: 'agentA' })
    ).toBe(true);
  });

  test('missing keys allow attempt (zome is source of truth)', () => {
    expect(canInitiateCommitmentFulfillment({ myAgentB64: null, authorB64: 'a' })).toBe(true);
    expect(canInitiateCommitmentFulfillment({ myAgentB64: 'a', authorB64: undefined })).toBe(true);
  });

  test('already fulfilled blocks even for non-author', () => {
    expect(
      canInitiateCommitmentFulfillment({
        myAgentB64: 'agentB',
        authorB64: 'agentA',
        fulfilled: true
      })
    ).toBe(false);
  });
});

describe('fulfillCommitmentErrorMessage', () => {
  test('maps author-initiate zome errors', () => {
    expect(
      fulfillCommitmentErrorMessage(
        'Guest("fulfill_commitment_closure must be initiated by the party who did not author the commitment; the author countersigns")'
      )
    ).toBe(OWN_COMMITMENT_FULFILL_HINT);
  });

  test('maps already-fulfilled zome errors', () => {
    expect(
      fulfillCommitmentErrorMessage('Guest("This commitment is already fulfilled")')
    ).toBe(ALREADY_FULFILLED_HINT);
  });

  test('default mentions online countersign', () => {
    expect(fulfillCommitmentErrorMessage(null)).toMatch(/counterparty must be online/);
  });

  test('passes through other errors', () => {
    expect(fulfillCommitmentErrorMessage('Network timeout')).toBe('Network timeout');
  });
});
