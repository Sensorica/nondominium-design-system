// The single mapping from Nondominium domain values to visual vocabulary.
//
// Lifecycle stage, resource nature and property regime are the three axes the
// brand encodes directly: each value owns a color family, an emoji, and a badge
// variant slug. Every surface that renders one of these values reads it from
// here, so a stage never gets a different color on two screens.
//
// The variant slugs match the `ndo-badge` custom element's `variant` prop, so a
// prototype screen and an embedded custom element render identically.

import type { LifecycleStage, PropertyRegime, ResourceNature } from './types';

export type Vocab = {
  /** Badge variant slug, e.g. `lifecycle-active`. */
  variant: string;
  /** Emoji icon. Nondominium uses emoji as its icon system; see the brand brief. */
  icon: string;
  /** One-line gloss, shown in tooltips and filter chips. */
  hint: string;
};

export const STAGE_VOCAB: Record<LifecycleStage, Vocab> = {
  Ideation:      { variant: 'lifecycle-ideation',      icon: '💭', hint: 'A documented intent' },
  Specification: { variant: 'lifecycle-specification', icon: '📐', hint: 'The form is being written down' },
  Development:   { variant: 'lifecycle-development',   icon: '🔧', hint: 'Being built' },
  Prototype:     { variant: 'lifecycle-prototype',     icon: '🧪', hint: 'Tangible and partly functional' },
  Stable:        { variant: 'lifecycle-stable',        icon: '✅', hint: 'Validated and reliable' },
  Distributed:   { variant: 'lifecycle-distributed',   icon: '🌐', hint: 'Instances exist beyond the group' },
  Active:        { variant: 'lifecycle-active',        icon: '⚡', hint: 'In use, with custody running' },
  Hibernating:   { variant: 'lifecycle-hibernating',   icon: '🌙', hint: 'Dormant on purpose' },
  Deprecated:    { variant: 'lifecycle-deprecated',    icon: '📦', hint: 'Superseded by a successor' },
  EndOfLife:     { variant: 'lifecycle-end-of-life',   icon: '🪦', hint: 'Decommissioned; the anchor remains' },
};

export const NATURE_VOCAB: Record<ResourceNature, Vocab> = {
  Physical:    { variant: 'nature-physical',    icon: '🔩', hint: 'Material objects and equipment' },
  Digital:     { variant: 'nature-digital',     icon: '💾', hint: 'Software, data, design files' },
  Service:     { variant: 'nature-service',     icon: '🛠️', hint: 'Work offered on request' },
  Hybrid:      { variant: 'nature-hybrid',      icon: '🔗', hint: 'A digital twin of a physical thing' },
  Information: { variant: 'nature-information', icon: '📚', hint: 'Knowledge assets and methods' },
};

export const REGIME_VOCAB: Record<PropertyRegime, Vocab> = {
  Private:      { variant: 'regime-private',      icon: '🔒', hint: 'Full rights bundle, one holder' },
  Commons:      { variant: 'regime-commons',      icon: '🌱', hint: 'Non-rivalrous, shared stewardship' },
  Nondominium:  { variant: 'regime-nondominium',  icon: '🧿', hint: 'Uncapturable by design; no alienation' },
  CommonPool:   { variant: 'regime-common-pool',  icon: '🫧', hint: 'Rivalrous, governed by quota' },
};

/** Custody and connection states, for the status dot. */
export const STATUS_VOCAB = {
  active: { icon: '🟢', label: 'Active' },
  pending: { icon: '🟡', label: 'Pending' },
  inactive: { icon: '⚪', label: 'Inactive' },
  error: { icon: '🔴', label: 'Error' },
  'coming-soon': { icon: '🟣', label: 'Coming soon' },
} as const;
export type StatusKey = keyof typeof STATUS_VOCAB;

/** Economic resource state → status dot key. */
export const RESOURCE_STATE_STATUS: Record<string, StatusKey> = {
  Active: 'active',
  Reserved: 'pending',
  Maintenance: 'pending',
  PendingValidation: 'pending',
  Retired: 'inactive',
};

/** Truncate a base64 hash the way the app does, keeping both ends so two
 *  hashes remain distinguishable at a glance. */
export function shortHash(hash: string, head = 8, tail = 4): string {
  if (hash.length <= head + tail + 1) return hash;
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`;
}
