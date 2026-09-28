<script lang="ts">
  // F's badge, ported from the ACTUAL component the original renders through:
  // `NondominiumDesignSystem_c29c2b.Badge` inside the bound
  // docs/prototypes/original/_ds/…/_ds_bundle.js (components/badge/Badge.jsx),
  // not registry/ndo-badge.svelte (a different, newer badge used elsewhere in
  // this repo, with different colours and no "opstate-" family). Variant
  // names and every colour below are read from that bundle file, verbatim.
  //
  // Unmapped variant → BADGE_VARIANTS.neutral, exactly as the bundle's
  // `BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral` — this is also why
  // `regime-public` (PropertyRegime.Public has no entry in the bundle either)
  // renders as a plain neutral chip on both sides: not a bug to fix here.
  const KNOWN = new Set([
    'lifecycle-ideation', 'lifecycle-specification', 'lifecycle-development', 'lifecycle-prototype', 'lifecycle-stable',
    'lifecycle-distributed', 'lifecycle-active', 'lifecycle-hibernating', 'lifecycle-deprecated', 'lifecycle-end-of-life',
    'nature-physical', 'nature-digital', 'nature-service', 'nature-hybrid', 'nature-information',
    'regime-nondominium', 'regime-commons', 'regime-collective', 'regime-pool', 'regime-common-pool', 'regime-private',
    'rule-access-requirement', 'rule-usage-limit', 'rule-transfer-condition', 'rule-maintenance-schedule',
    'scope-project', 'scope-network', 'scope-public',
    'opstate-available', 'opstate-reserved', 'opstate-in-transit', 'opstate-in-storage', 'opstate-in-maintenance', 'opstate-in-use', 'opstate-pending-validation',
    'coming-soon', 'neutral'
  ]);

  let { variant = 'neutral', label }: { variant?: string; label: string } = $props();

  const resolved = $derived(KNOWN.has(variant) ? variant : 'neutral');
  const isOp = $derived(resolved.startsWith('opstate-'));
</script>

<span class="badge {resolved}" class:badge--op={isOp} title={label}>
  {#if isOp}<span class="dot" aria-hidden="true"></span>{/if}{label}
</span>

<style>
  /* Base: the bundle's `base` object, verbatim (no overflow/ellipsis/max-width
     — those belonged to registry/ndo-badge.svelte, not this component). */
  .badge {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    padding: var(--ndo-spacing-0-5) var(--ndo-spacing-2);
    border-radius: var(--ndo-radius-sm);
    font-family: var(--ndo-font-sans);
    font-size: var(--ndo-text-xs);
    font-weight: var(--ndo-weight-medium);
    line-height: 1.5;
    white-space: nowrap;
    border: 1px solid transparent;
    box-sizing: border-box;
  }

  /* Lifecycle: fill(bg, fg) */
  .lifecycle-ideation      { background: rgb(var(--ndo-gray-100));    color: rgb(var(--ndo-gray-600)); }
  .lifecycle-specification { background: rgb(var(--ndo-blue-50));     color: rgb(var(--ndo-blue-600)); }
  .lifecycle-development   { background: rgb(var(--ndo-indigo-100));  color: rgb(var(--ndo-indigo-700)); }
  .lifecycle-prototype     { background: rgb(var(--ndo-amber-100));   color: rgb(var(--ndo-amber-700)); }
  .lifecycle-stable        { background: rgb(var(--ndo-green-100));   color: rgb(var(--ndo-green-700)); }
  .lifecycle-distributed   { background: rgb(var(--ndo-teal-100));    color: rgb(var(--ndo-teal-700)); }
  .lifecycle-active        { background: rgb(var(--ndo-emerald-100)); color: rgb(var(--ndo-emerald-700)); }
  .lifecycle-hibernating   { background: rgb(var(--ndo-yellow-100));  color: rgb(var(--ndo-yellow-700)); }
  .lifecycle-deprecated    { background: rgb(var(--ndo-orange-100));  color: rgb(var(--ndo-orange-700)); }
  .lifecycle-end-of-life   { background: rgb(var(--ndo-red-100));     color: rgb(var(--ndo-red-700)); }

  /* Resource nature: fill(bg, fg) */
  .nature-physical    { background: rgb(var(--ndo-blue-100));   color: rgb(var(--ndo-blue-700)); }
  .nature-digital     { background: rgb(var(--ndo-purple-100)); color: rgb(var(--ndo-purple-700)); }
  .nature-service     { background: rgb(var(--ndo-orange-100)); color: rgb(var(--ndo-orange-700)); }
  .nature-hybrid      { background: rgb(var(--ndo-teal-100));   color: rgb(var(--ndo-teal-700)); }
  .nature-information { background: rgb(var(--ndo-indigo-100)); color: rgb(var(--ndo-indigo-700)); }

  /* Property regime: regime(fg) — transparent fill, dashed border, coloured text */
  .regime-nondominium { background: transparent; border: 1px dashed rgb(var(--ndo-blue-700));   color: rgb(var(--ndo-blue-700)); }
  .regime-commons     { background: transparent; border: 1px dashed rgb(var(--ndo-cyan-700));   color: rgb(var(--ndo-cyan-700)); }
  .regime-collective  { background: transparent; border: 1px dashed rgb(var(--ndo-violet-700)); color: rgb(var(--ndo-violet-700)); }
  .regime-pool        { background: transparent; border: 1px dashed rgb(var(--ndo-teal-700));   color: rgb(var(--ndo-teal-700)); }
  .regime-common-pool { background: transparent; border: 1px dashed rgb(var(--ndo-rose-700));   color: rgb(var(--ndo-rose-700)); }
  .regime-private     { background: transparent; border: 1px dashed rgb(var(--ndo-gray-700));   color: rgb(var(--ndo-gray-700)); }

  /* Governance rules (Layer 1): rule(bg, fg, edge) — rounded right only,
     3px solid left edge, base's transparent border elsewhere, mono. */
  .rule-access-requirement,
  .rule-usage-limit,
  .rule-transfer-condition,
  .rule-maintenance-schedule {
    border-radius: 0 var(--ndo-radius-sm) var(--ndo-radius-sm) 0;
    font-family: var(--ndo-font-mono);
  }
  .rule-access-requirement   { background: rgb(var(--ndo-blue-50));    color: rgb(var(--ndo-blue-700));   border-left: 3px solid rgb(var(--ndo-blue-700)); }
  .rule-usage-limit          { background: rgb(var(--ndo-amber-50));   color: rgb(var(--ndo-amber-800));  border-left: 3px solid rgb(var(--ndo-amber-700)); }
  .rule-transfer-condition   { background: rgb(var(--ndo-violet-100)); color: rgb(var(--ndo-violet-700)); border-left: 3px solid rgb(var(--ndo-violet-700)); }
  .rule-maintenance-schedule { background: rgb(var(--ndo-orange-50));  color: rgb(var(--ndo-orange-700)); border-left: 3px solid rgb(var(--ndo-orange-700)); }

  /* Scope: fill(bg, fg) */
  .scope-project { background: rgb(var(--ndo-gray-100));  color: rgb(var(--ndo-gray-700)); }
  .scope-network { background: rgb(var(--ndo-blue-100));  color: rgb(var(--ndo-blue-700)); }
  .scope-public  { background: rgb(var(--ndo-green-100)); color: rgb(var(--ndo-green-700)); }

  /* Operational state (Layer 2): fill(bg, fg), pill radius, leading dot in
     currentColor (isOp branch of the bundle's Badge()). */
  .opstate-available          { background: rgb(var(--ndo-green-50));   color: rgb(var(--ndo-green-700)); }
  .opstate-reserved           { background: rgb(var(--ndo-amber-50));   color: rgb(var(--ndo-amber-700)); }
  .opstate-in-transit         { background: rgb(var(--ndo-blue-50));    color: rgb(var(--ndo-blue-700)); }
  .opstate-in-storage         { background: rgb(var(--ndo-indigo-100)); color: rgb(var(--ndo-indigo-700)); }
  .opstate-in-maintenance     { background: rgb(var(--ndo-orange-100)); color: rgb(var(--ndo-orange-700)); }
  .opstate-in-use             { background: rgb(var(--ndo-teal-100));  color: rgb(var(--ndo-teal-700)); }
  .opstate-pending-validation { background: rgb(var(--ndo-gray-100));  color: rgb(var(--ndo-gray-600)); }
  .badge--op {
    border-radius: var(--ndo-radius-xl);
    padding-left: var(--ndo-spacing-1-5);
  }
  .dot {
    display: inline-block;
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    margin-right: var(--ndo-spacing-1-5);
    background: currentColor;
    flex-shrink: 0;
  }

  /* Special: fill(bg, fg) */
  .coming-soon { background: rgb(var(--ndo-amber-50));  color: rgb(var(--ndo-amber-600)); }
  .neutral     { background: rgb(var(--ndo-gray-100));  color: rgb(var(--ndo-gray-600)); }
</style>
