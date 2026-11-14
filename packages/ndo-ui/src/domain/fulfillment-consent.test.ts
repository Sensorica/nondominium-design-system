import { describe, expect, test } from 'bun:test';
import {
  ALREADY_FULFILLED_HINT,
  NOT_CUSTODIAN_RESOURCE_STATE_HINT,
  NOT_PARTY_FULFILL_HINT,
  OWN_COMMITMENT_FULFILL_HINT,
  canInitiateCommitmentFulfillment,
  commitmentFulfillDisabledReason,
  fulfillCommitmentErrorMessage
} from './fulfillment-consent.js';

describe('canInitiateCommitmentFulfillment', () => {
  test('author cannot initiate', () => {
    expect(
      canInitiateCommitmentFulfillment({ myAgentB64: 'agentA', authorB64: 'agentA' })
    ).toBe(false);
  });

  test('named non-author can initiate', () => {
    expect(
      canInitiateCommitmentFulfillment({
        myAgentB64: 'agentB',
        authorB64: 'agentA',
        providerB64: 'agentB',
        receiverB64: 'agentA'
      })
    ).toBe(true);
  });

  test('non-party cannot initiate when provider/receiver known', () => {
    expect(
      canInitiateCommitmentFulfillment({
        myAgentB64: 'agentC',
        authorB64: 'agentA',
        providerB64: 'agentB',
        receiverB64: 'agentA'
      })
    ).toBe(false);
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

describe('commitmentFulfillDisabledReason', () => {
  test('own commitment', () => {
    expect(
      commitmentFulfillDisabledReason({ myAgentB64: 'a', authorB64: 'a' })
    ).toBe(OWN_COMMITMENT_FULFILL_HINT);
  });

  test('not a party', () => {
    expect(
      commitmentFulfillDisabledReason({
        myAgentB64: 'c',
        authorB64: 'a',
        providerB64: 'b',
        receiverB64: 'a'
      })
    ).toBe(NOT_PARTY_FULFILL_HINT);
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

  test('maps not-party zome errors', () => {
    expect(
      fulfillCommitmentErrorMessage(
        'fulfill_commitment_closure must be called by the commitment\'s provider or receiver. Caller was AgentPubKey(...)'
      )
    ).toBe(NOT_PARTY_FULFILL_HINT);
  });

  test('maps already-fulfilled zome errors', () => {
    expect(
      fulfillCommitmentErrorMessage('Guest("This commitment is already fulfilled")')
    ).toBe(ALREADY_FULFILLED_HINT);
  });

  test('maps nested Host/Guest not-custodian errors from resource_state_update', () => {
    expect(
      fulfillCommitmentErrorMessage(
        'Wasm runtime error while working with Ribosome: RuntimeError: holochain::core::ribosome::host_fn::call:239: Host("Wasm runtime error while working with Ribosome: RuntimeError: nondominium_shared::errors:119: Guest(\\"Not the custodian of this resource\\")")'
      )
    ).toBe(NOT_CUSTODIAN_RESOURCE_STATE_HINT);
  });

  test('default mentions online countersign', () => {
    expect(fulfillCommitmentErrorMessage(null)).toMatch(/counterparty must be online/);
  });

  test('passes through other errors', () => {
    expect(fulfillCommitmentErrorMessage('Network timeout')).toBe('Network timeout');
  });
});
