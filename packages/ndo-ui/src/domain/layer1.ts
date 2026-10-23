/**
 * Layer 1 activation rules — mirror Rust integrity + constraints.rs.
 * Pure functions; no UI or session state.
 */
import type {
  LifecycleStage,
  PropertyRegime,
  ResourceScope,
  ResourceSpecificationInput
} from './types.js';

/** Stages that cannot activate Layer 1 (REQ-NDO-L1-02). */
export const LAYER1_INELIGIBLE_STAGES = new Set<string>([
  'Ideation',
  'Hibernating',
  'Deprecated',
  'EndOfLife'
]);

/** Regimes that must carry Public scope (check_scope_coherence / REQ-RES-03). */
export const OPEN_ACCESS_REGIMES = new Set<string>(['Nondominium', 'Public']);

export const SPEC_NAME_MAX_LENGTH = 100;

export function canActivateLayer1(
  lifecycleStage: LifecycleStage | string | null | undefined
): boolean {
  if (!lifecycleStage) return true;
  return !LAYER1_INELIGIBLE_STAGES.has(String(lifecycleStage));
}

/**
 * Resolve the scope for a create/update form.
 * Open-access regimes always force Public; otherwise the chosen scope stands.
 */
export function resolveScope(
  propertyRegime: PropertyRegime | string | null | undefined,
  chosen: ResourceScope
): ResourceScope {
  if (propertyRegime && OPEN_ACCESS_REGIMES.has(String(propertyRegime))) {
    return 'Public';
  }
  return chosen;
}

export function isScopeLocked(
  propertyRegime: PropertyRegime | string | null | undefined
): boolean {
  return !!propertyRegime && OPEN_ACCESS_REGIMES.has(String(propertyRegime));
}

export type SpecValidationResult =
  | { ok: true; input: Required<Pick<ResourceSpecificationInput, 'name' | 'description' | 'category' | 'scope'>> & {
      image_url: string | null;
      tags: string[];
    } }
  | { ok: false; error: string };

/**
 * Validate Layer 1 field rules (integrity: non-empty name ≤100, non-empty description).
 */
export function validateSpecInput(
  raw: ResourceSpecificationInput
): SpecValidationResult {
  const name = raw.name.trim();
  const description = raw.description.trim();
  if (!name) {
    return { ok: false, error: 'Name cannot be empty.' };
  }
  if (name.length > SPEC_NAME_MAX_LENGTH) {
    return {
      ok: false,
      error: `Name must be at most ${SPEC_NAME_MAX_LENGTH} characters.`
    };
  }
  if (!description) {
    return { ok: false, error: 'Description cannot be empty.' };
  }
  const category = (raw.category ?? 'general').trim() || 'general';
  const tags = (raw.tags ?? []).map((t) => t.trim()).filter(Boolean);
  const image_url =
    raw.image_url == null || String(raw.image_url).trim() === ''
      ? null
      : String(raw.image_url).trim();

  return {
    ok: true,
    input: {
      name,
      description,
      category,
      scope: raw.scope,
      image_url,
      tags
    }
  };
}

/** Protocol-shaped message (errors, logs). Prefer {@link layer1GateMessagePlain} in UI. */
export function layer1GateMessage(
  lifecycleStage: LifecycleStage | string | null | undefined
): string {
  return `Cannot activate Layer 1 while the NDO is ${lifecycleStage}.`;
}

/** Plain-language gate for the Resources tab and form. */
export function layer1GateMessagePlain(
  lifecycleStage: LifecycleStage | string | null | undefined
): string {
  return `Kinds of item can't be added yet while this resource is in ${lifecycleStage}. Move it past the idea stage first (and avoid Hibernating, Deprecated, or End of life).`;
}
