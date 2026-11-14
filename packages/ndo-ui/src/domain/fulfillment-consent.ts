/**
 * Bilateral fulfillment consent (`fulfill_commitment_closure`).
 *
 * The commitment's action author agreed by writing it; the other party agrees
 * by initiating fulfillment; the author countersigns. The author must not
 * initiate — the zome rejects that path. A commitment is fulfilled once.
 *
 * The initiator must also be named as provider or receiver (participation
 * grammar: performer + witness on the wire).
 */

/** Shown when the current agent authored the commitment and cannot Fulfill. */
export const OWN_COMMITMENT_FULFILL_HINT =
  'Cannot fulfill your own commitment. The other party must initiate; you countersign when they do.';

/** Shown when a Claim already closes this commitment. */
export const ALREADY_FULFILLED_HINT =
  'This commitment is already fulfilled. Each commitment can be fulfilled only once.';

/**
 * Shown when fulfillment requested a resource operational-state change but the
 * initiator is not the current custodian (`update_operational_state` rejects).
 */
export const NOT_CUSTODIAN_RESOURCE_STATE_HINT =
  'Only the current custodian can change resource operational state. Leave “Resource state after” unchanged, then fulfill again — or ask the custodian to fulfill.';

/** Shown when the caller is not provider or receiver on the commitment. */
export const NOT_PARTY_FULFILL_HINT =
  'Only the commitment’s named parties (performer or witness) can fulfill it.';

/**
 * Whether the current agent may open / submit fulfillment for this commitment.
 *
 * When identity keys are missing (legacy payload, not yet loaded), returns `true`
 * so the UI still allows an attempt — the zome remains the source of truth —
 * unless `fulfilled` is already known. When provider/receiver are present, the
 * caller must be one of them and must not be the author.
 */
export function canInitiateCommitmentFulfillment(args: {
  myAgentB64: string | null | undefined;
  authorB64: string | null | undefined;
  /** When true, the commitment already has a Claim — never initiate again. */
  fulfilled?: boolean | null | undefined;
  /** Wire provider (base64). When set with receiver, caller must be named. */
  providerB64?: string | null | undefined;
  /** Wire receiver (base64). */
  receiverB64?: string | null | undefined;
}): boolean {
  if (args.fulfilled === true) return false;
  const me = args.myAgentB64?.trim();
  const author = args.authorB64?.trim();
  if (!me || !author) return true;
  if (me === author) return false;

  const provider = args.providerB64?.trim();
  const receiver = args.receiverB64?.trim();
  if (provider || receiver) {
    const named = me === provider || me === receiver;
    if (!named) return false;
  }
  return true;
}

/** Hint when Fulfill is disabled; undefined when fulfill is allowed. */
export function commitmentFulfillDisabledReason(args: {
  myAgentB64: string | null | undefined;
  authorB64: string | null | undefined;
  fulfilled?: boolean | null | undefined;
  providerB64?: string | null | undefined;
  receiverB64?: string | null | undefined;
}): string | undefined {
  if (args.fulfilled === true) return ALREADY_FULFILLED_HINT;
  const me = args.myAgentB64?.trim();
  const author = args.authorB64?.trim();
  if (me && author && me === author) return OWN_COMMITMENT_FULFILL_HINT;
  const provider = args.providerB64?.trim();
  const receiver = args.receiverB64?.trim();
  if (me && (provider || receiver) && me !== provider && me !== receiver) {
    return NOT_PARTY_FULFILL_HINT;
  }
  return undefined;
}

/** Map a raw zome/store error into a clearer author-initiated message when applicable. */
export function fulfillCommitmentErrorMessage(raw: string | null | undefined): string {
  const text = (raw ?? '').trim();
  if (
    /did not author this commitment|must be initiated by the party who did not author|author the commitment/i.test(
      text
    )
  ) {
    return OWN_COMMITMENT_FULFILL_HINT;
  }
  if (
    /must be called by the commitment's provider|Caller was AgentPubKey|not provider or receiver/i.test(
      text
    )
  ) {
    return NOT_PARTY_FULFILL_HINT;
  }
  if (/already fulfilled/i.test(text)) {
    return ALREADY_FULFILLED_HINT;
  }
  if (/Not the custodian|not the custodian/i.test(text)) {
    return NOT_CUSTODIAN_RESOURCE_STATE_HINT;
  }
  if (text) return text;
  return 'Fulfillment failed. The counterparty must be online to countersign — wait a moment and try again if they just came online.';
}
