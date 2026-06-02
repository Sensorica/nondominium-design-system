import type { LifecycleStage } from './types.js';

export const LIFECYCLE_TRANSITIONS: Record<LifecycleStage, LifecycleStage[]> = {
  Ideation: ['Specification', 'Deprecated', 'EndOfLife'],
  Specification: ['Development', 'Deprecated', 'EndOfLife'],
  Development: ['Prototype', 'Deprecated', 'EndOfLife'],
  Prototype: ['Stable', 'Deprecated', 'EndOfLife'],
  Stable: ['Distributed', 'Deprecated', 'EndOfLife'],
  Distributed: ['Active', 'Deprecated', 'EndOfLife'],
  Active: ['Hibernating', 'Deprecated', 'EndOfLife'],
  Hibernating: ['Deprecated', 'EndOfLife'],
  Deprecated: ['EndOfLife'],
  EndOfLife: []
};

export function allowedTransitions(
  current: LifecycleStage | string | null,
  hibernationOrigin?: LifecycleStage | string | null
): LifecycleStage[] {
  if (!current) return [];
  const allowed = LIFECYCLE_TRANSITIONS[current as LifecycleStage] ?? [];
  if (current === 'Hibernating' && hibernationOrigin) {
    return [hibernationOrigin as LifecycleStage, ...allowed];
  }
  return allowed;
}

export function canTransition(current: LifecycleStage | string | null): boolean {
  return current != null && current !== 'EndOfLife';
}
