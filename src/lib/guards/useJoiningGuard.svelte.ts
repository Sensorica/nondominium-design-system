/**
 * useJoiningGuard — the three-level identity ladder as a state machine.
 *
 * Nondominium defers identity cost until the agent actually acts. An agent may
 * browse the lobby anonymously, join a group under a pseudonym, and only commit
 * a `Person` entry to the DHT on their first DHT-active action. That is three
 * distinct levels (requirements.md §4.5, REQ-UI-ID-01 through REQ-UI-ID-03):
 *
 *   Level 1  LobbyUserProfile   localStorage, never a DHT write
 *   Level 2  GroupMemberProfile per-group disclosure choice, localStorage
 *   Level 3  Person entry       zome_person, public, permanent
 *
 * Every level has a screen. Without a machine those screens are orphans: they
 * only appear when an agent happens to be in that state, so they are the least
 * reviewed part of the app. This machine gives each one a URL a reviewer can
 * open cold.
 *
 * Two rules, both easy to violate:
 *
 *   1. `routeForStatus` is a FIXED POINT. Seeding a status on its own page and
 *      then redirecting on that status must land on the same URL, or the seed
 *      effect and the redirect effect fight.
 *   2. Forward and reverse maps are INVERSE-CONSISTENT — see app-nav.ts.
 */

/** Every state the agent can be in. Exhaustive: no implicit "other". */
export type JoiningStatus =
  /** The conductor handshake has not resolved. */
  | 'connecting'
  /** Connected, but no Level 1 lobby profile exists. */
  | 'no-lobby-profile'
  /** Arrived through an invite link; the group is known, membership is not. */
  | 'invited'
  /** Has a lobby profile, belongs to no group. Browsing is all that is possible. */
  | 'browsing'
  /** In a group, but has not made the Level 2 disclosure choice for it. */
  | 'group-undisclosed'
  /** Full group member, no Person entry yet. Reading is fine; writing is not. */
  | 'member'
  /** Tried a DHT-active action without a Person entry. The Level 3 gate. */
  | 'needs-person'
  /** Person entry committed. Everything is open. */
  | 'active';

/** Status → route key. The single source of truth for "where does this agent
 *  belong right now". Three statuses share the `lobby` key: once identity is
 *  sufficient for the surface, the ladder stops steering and the agent does. */
export function routeForStatus(status: JoiningStatus): string {
  switch (status) {
    case 'connecting':        return 'connecting';
    case 'no-lobby-profile':  return 'profile-setup';
    case 'invited':           return 'invite-landing';
    case 'group-undisclosed': return 'group-profile';
    case 'needs-person':      return 'profile-guard';
    case 'browsing':
    case 'member':
    case 'active':            return 'lobby';
  }
}

/** What the agent may do at each rung. Screens read this rather than
 *  re-deriving permissions from the status union. */
export function capabilitiesFor(status: JoiningStatus) {
  const hasLobbyProfile = status !== 'connecting' && status !== 'no-lobby-profile';
  const inGroup = status === 'group-undisclosed' || status === 'member' || status === 'active';
  const hasPerson = status === 'active';
  return {
    /** Level 1 satisfied. */
    hasLobbyProfile,
    /** Holds a GroupMembership entry on at least one group cell. */
    inGroup,
    /** Level 3 satisfied: a Person entry exists. */
    hasPerson,
    /** Browsing the lobby needs nothing at all. */
    canBrowse: true,
    /** Joining or creating a group needs a nickname to present. */
    canJoinGroup: hasLobbyProfile,
    /** Any DHT write (create an NDO, accept a commitment) needs Level 3. */
    canWriteToDht: hasPerson,
    /** Governance participation needs Level 3 plus a role; the role check lives
     *  with the agent record, not here. */
    canParticipateInGovernance: hasPerson,
  };
}

export function useJoiningGuard() {
  let status = $state<JoiningStatus>('active');
  let history = $state<JoiningStatus[]>([]);
  /** Set when `invited`: which group the invite payload named. */
  let pendingGroupId = $state<string | null>(null);
  /** Set when `needs-person`: what the agent was trying to do, so the gate can
   *  say "you were about to create an NDO" instead of a generic refusal. */
  let blockedIntent = $state<string | null>(null);

  return {
    get status() { return status; },
    get history() { return history; },
    get pendingGroupId() { return pendingGroupId; },
    get blockedIntent() { return blockedIntent; },

    /** Where this agent belongs right now. */
    get route() { return routeForStatus(status); },
    get can() { return capabilitiesFor(status); },

    /** Seed from a deep link or a hard reload, so a cold-loaded gate renders
     *  fully. Idempotent: seeding the current status does nothing. */
    seed(next: JoiningStatus) {
      if (next === status) return;
      status = next;
    },

    /** Advance the machine. Every transition is explicit; no fallthrough. */
    to(next: JoiningStatus) {
      history = [...history, status];
      status = next;
    },

    /** The agent followed an invite link. */
    receiveInvite(groupId: string) {
      pendingGroupId = groupId;
      this.to('invited');
    },

    /** The agent attempted a write without Level 3. */
    blockOn(intent: string) {
      blockedIntent = intent;
      this.to('needs-person');
    },

    /** The Person entry was committed; release whatever was blocked. */
    completePerson() {
      blockedIntent = null;
      this.to('active');
    },

    reset() {
      history = [];
      pendingGroupId = null;
      blockedIntent = null;
      status = 'connecting';
    },
  };
}
