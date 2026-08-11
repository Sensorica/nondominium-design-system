/**
 * useLifecycleFlow — the NDO lifecycle stage machine.
 *
 * This is the one machine in the design system that is allowed to be wrong only
 * in the safe direction. The transition table below MIRRORS the Rust integrity
 * validation (`specifications.md` §7.5, REQ-NDO-LC-*). If the prototype offers a
 * transition the zome rejects, a reviewer approves a flow that cannot ship.
 *
 * The table, verbatim from the specification:
 *
 *   Ideation      → Specification | Deprecated | EndOfLife
 *   Specification → Development   | Deprecated | EndOfLife
 *   Development   → Prototype     | Deprecated | EndOfLife
 *   Prototype     → Stable        | Deprecated | EndOfLife
 *   Stable        → Distributed   | Deprecated | EndOfLife
 *   Distributed   → Active        | Deprecated | EndOfLife
 *   Active        → Hibernating   | Deprecated | EndOfLife
 *   Hibernating   → <hibernation_origin> | Deprecated | EndOfLife
 *   Deprecated    → EndOfLife
 *   EndOfLife     → (terminal)
 *
 * Two special cases carry data, not just a stage change:
 *   → Deprecated  requires a successor NDO hash (REQ-NDO-LC-06)
 *   → Hibernating records the origin stage, and a resume returns to it
 *
 * Unlike the joining guard this machine is per-NDO, so the exported helpers are
 * pure functions over a stage. The singleton in `lifecycle.svelte.ts` holds only
 * the transition modal's draft state.
 */

import type { LifecycleStage } from '../types';
import { LIFECYCLE_STAGES } from '../types';

/** The forward chain: each stage's single natural successor. */
const FORWARD: Partial<Record<LifecycleStage, LifecycleStage>> = {
  Ideation: 'Specification',
  Specification: 'Development',
  Development: 'Prototype',
  Prototype: 'Stable',
  Stable: 'Distributed',
  Distributed: 'Active',
  Active: 'Hibernating',
};

/** Stages every non-terminal NDO can always fall to. */
const ALWAYS_AVAILABLE: LifecycleStage[] = ['Deprecated', 'EndOfLife'];

/**
 * Every stage this NDO may transition to. `hibernationOrigin` is required to
 * resolve a Hibernating resume — without it the only moves left are the
 * terminal ones, which is exactly what the zome would enforce.
 */
export function allowedTransitions(
  from: LifecycleStage,
  hibernationOrigin?: LifecycleStage
): LifecycleStage[] {
  if (from === 'EndOfLife') return [];
  if (from === 'Deprecated') return ['EndOfLife'];
  if (from === 'Hibernating') {
    return [...(hibernationOrigin ? [hibernationOrigin] : []), ...ALWAYS_AVAILABLE];
  }
  const next = FORWARD[from];
  return [...(next ? [next] : []), ...ALWAYS_AVAILABLE];
}

export function canTransition(
  from: LifecycleStage,
  to: LifecycleStage,
  hibernationOrigin?: LifecycleStage
): boolean {
  return allowedTransitions(from, hibernationOrigin).includes(to);
}

/** Transitions that cannot be committed on the stage change alone. */
export function requirementFor(to: LifecycleStage): 'successor' | 'confirmation' | null {
  if (to === 'Deprecated') return 'successor';
  if (to === 'Hibernating') return 'confirmation';
  if (to === 'EndOfLife') return 'confirmation';
  return null;
}

export function isTerminal(stage: LifecycleStage): boolean {
  return stage === 'EndOfLife';
}

/** Position on the ladder, for progress rendering. Hibernating and the terminal
 *  stages sit off the chain, so they report their origin's index or the end. */
export function ladderIndex(stage: LifecycleStage): number {
  return LIFECYCLE_STAGES.indexOf(stage);
}

/** The seven stages an NDO may be registered at (REQ-UI-NDO-01). */
export function isCreatable(stage: LifecycleStage): boolean {
  return ladderIndex(stage) <= ladderIndex('Active');
}

/** One-line rationale per stage, shown beside the option in the transition
 *  modal so the choice is legible without opening the requirements doc. */
export const STAGE_MEANING: Record<LifecycleStage, string> = {
  Ideation: 'A documented intent. Nothing specified, near-zero governance overhead.',
  Specification: 'The form is being written down: design, rules, what it is.',
  Development: 'Being built. Contributions accrue against the specification.',
  Prototype: 'Tangible and partly functional. Peer validation begins.',
  Stable: 'Validated and ready to be relied on.',
  Distributed: 'Copies or instances exist beyond the originating group.',
  Active: 'In use, with custody and maintenance running.',
  Hibernating: 'Dormant on purpose. Resumes to the stage it paused from.',
  Deprecated: 'Superseded. A successor NDO must be named.',
  EndOfLife: 'Decommissioned. The identity anchor stays as a permanent tombstone.',
};

export function useLifecycleFlow() {
  /** The NDO the transition modal is acting on. */
  let targetId = $state<string | null>(null);
  let draftStage = $state<LifecycleStage | null>(null);
  let draftSuccessorHash = $state<string>('');
  let confirmed = $state(false);

  return {
    get targetId() { return targetId; },
    get draftStage() { return draftStage; },
    get draftSuccessorHash() { return draftSuccessorHash; },
    get confirmed() { return confirmed; },

    /** True when the draft satisfies whatever the target stage requires. */
    get ready() {
      if (!draftStage) return false;
      const need = requirementFor(draftStage);
      if (need === 'successor') return draftSuccessorHash.trim().length > 0;
      if (need === 'confirmation') return confirmed;
      return true;
    },

    open(ndoId: string) {
      targetId = ndoId;
      draftStage = null;
      draftSuccessorHash = '';
      confirmed = false;
    },
    select(stage: LifecycleStage) {
      draftStage = stage;
      confirmed = false;
      if (stage !== 'Deprecated') draftSuccessorHash = '';
    },
    setSuccessor(hash: string) { draftSuccessorHash = hash; },
    confirm(value: boolean) { confirmed = value; },
    close() {
      targetId = null;
      draftStage = null;
      draftSuccessorHash = '';
      confirmed = false;
    },
  };
}
