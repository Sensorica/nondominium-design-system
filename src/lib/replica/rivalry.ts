// Copy of ui/src/lib/utils/rivalry.ts from the app at
// 20adb117219de3e7a1a45b53d8a02fc0602feb7e. Only the type import is repointed.
//
// The app path and SHA above are load-bearing: check:fidelity walks
// ui/src/lib/components only, so no instrument in this repo measures a util
// against its original. This comment is the only record of what it was
// faithful to. The em-dash below is the app's own, kept because changing it
// would break byte-fidelity with the source.
import type { ResourceNature, Rivalry } from './types';

/**
 * Client-side nature→rivalry hint for UI (no DHT round-trip).
 * Mirrors `ResourceNature::default_rivalry` for Physical/Hybrid/Digital/Information.
 * `Service` is ambiguous — returns `null` so the UI can prompt for an override.
 */
export function defaultRivalryFor(nature: ResourceNature): Rivalry | null {
  switch (nature) {
    case 'Physical':
    case 'Hybrid':
      return 'Rivalrous';
    case 'Digital':
    case 'Information':
      return 'NonRivalrous';
    case 'Service':
      return null;
  }
}

/** Effective rivalry for display: explicit override wins; else nature default (or null for Service). */
export function effectiveRivalryLabel(
  nature: ResourceNature | null | undefined,
  rivalryOverride: string | null | undefined
): string | null {
  if (rivalryOverride === 'Rivalrous' || rivalryOverride === 'NonRivalrous') {
    return `${rivalryOverride} (override)`;
  }
  if (!nature) return null;
  const def = defaultRivalryFor(nature);
  return def ? `${def} (default)` : null;
}
