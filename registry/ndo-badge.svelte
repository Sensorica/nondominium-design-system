<svelte:options customElement="ndo-badge" />

<script lang="ts">
  // NOTE: registry files must use legacy `export let` syntax.
  // Svelte 5 runes ($props) are incompatible with customElement compiler mode.
  export let variant:
    | 'lifecycle-ideation'
    | 'lifecycle-specification'
    | 'lifecycle-development'
    | 'lifecycle-prototype'
    | 'lifecycle-stable'
    | 'lifecycle-distributed'
    | 'lifecycle-active'
    | 'lifecycle-hibernating'
    | 'lifecycle-deprecated'
    | 'lifecycle-end-of-life'
    | 'nature-physical'
    | 'nature-digital'
    | 'nature-service'
    | 'nature-hybrid'
    | 'nature-information'
    | 'regime-nondominium'
    | 'regime-commons'
    | 'regime-collective'
    | 'regime-pool'
    | 'regime-common-pool'
    | 'regime-private'
    | 'regime-public'
    | 'regime-nondominium-filter'
    | 'regime-commons-filter'
    | 'regime-collective-filter'
    | 'regime-pool-filter'
    | 'regime-common-pool-filter'
    | 'regime-private-filter'
    | 'regime-public-filter'
    | 'op-available'
    | 'op-reserved'
    | 'op-in-transit'
    | 'op-in-storage'
    | 'op-in-maintenance'
    | 'op-in-use'
    | 'op-pending-validation'
    | 'rivalry-rivalrous'
    | 'rivalry-non-rivalrous'
    | 'scope-project'
    | 'scope-network'
    | 'scope-public'
    | 'rule-access-requirement'
    | 'rule-usage-limit'
    | 'rule-transfer-condition'
    | 'rule-maintenance-schedule'
    | 'coming-soon'
    | 'neutral' = 'neutral';

  export let label = '';
</script>

<span class="badge {variant}">
  <slot>{label}</slot>
</span>

<style>
  :host { display: inline-flex; }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: var(--ndo-spacing-0-5) var(--ndo-spacing-2);
    border-radius: var(--ndo-radius-sm);
    font-family: var(--ndo-font-sans);
    font-size: var(--ndo-text-xs);
    font-weight: var(--ndo-weight-medium);
    line-height: 1.5;
    white-space: nowrap;
    border: 1px solid transparent;
  }

  /* Lifecycle */
  .badge.lifecycle-ideation      { background: rgb(var(--ndo-gray-100));    color: rgb(var(--ndo-gray-600)); }
  .badge.lifecycle-specification { background: rgb(var(--ndo-blue-50));     color: rgb(var(--ndo-blue-600)); }
  .badge.lifecycle-development   { background: rgb(var(--ndo-indigo-100));  color: rgb(var(--ndo-indigo-700)); }
  .badge.lifecycle-prototype     { background: rgb(var(--ndo-amber-100));   color: rgb(var(--ndo-amber-700)); }
  .badge.lifecycle-stable        { background: rgb(var(--ndo-green-100));   color: rgb(var(--ndo-green-700)); }
  .badge.lifecycle-distributed   { background: rgb(var(--ndo-teal-100));    color: rgb(var(--ndo-teal-700)); }
  .badge.lifecycle-active        { background: rgb(var(--ndo-emerald-100)); color: rgb(var(--ndo-emerald-700)); }
  .badge.lifecycle-hibernating   { background: rgb(var(--ndo-yellow-100));  color: rgb(var(--ndo-yellow-700)); }
  .badge.lifecycle-deprecated    { background: rgb(var(--ndo-orange-100));  color: rgb(var(--ndo-orange-700)); }
  .badge.lifecycle-end-of-life   { background: rgb(var(--ndo-red-100));     color: rgb(var(--ndo-red-700)); }

  /* Resource nature */
  .badge.nature-physical    { background: rgb(var(--ndo-blue-100));   color: rgb(var(--ndo-blue-700)); }
  .badge.nature-digital     { background: rgb(var(--ndo-purple-100)); color: rgb(var(--ndo-purple-700)); }
  .badge.nature-service     { background: rgb(var(--ndo-orange-100)); color: rgb(var(--ndo-orange-700)); }
  .badge.nature-hybrid      { background: rgb(var(--ndo-teal-100));   color: rgb(var(--ndo-teal-700)); }
  .badge.nature-information { background: rgb(var(--ndo-indigo-100)); color: rgb(var(--ndo-indigo-700)); }

  /* Property regime on cards — dashed gray (hApp NdoCard) */
  .badge.regime-nondominium,
  .badge.regime-commons,
  .badge.regime-collective,
  .badge.regime-pool,
  .badge.regime-common-pool,
  .badge.regime-private,
  .badge.regime-public {
    background: transparent;
    border: 1px dashed rgb(var(--ndo-gray-400));
    color: rgb(var(--ndo-gray-700));
  }

  /* Property regime filter chips — filled colors (hApp NdoBrowser) */
  .badge.regime-private-filter {
    background: rgb(var(--ndo-gray-100));
    color: rgb(var(--ndo-gray-600));
    border: 1px dashed rgb(var(--ndo-gray-300));
  }
  .badge.regime-commons-filter {
    background: rgb(var(--ndo-cyan-100));
    color: rgb(var(--ndo-cyan-700));
    border: 1px dashed rgb(var(--ndo-cyan-300));
  }
  .badge.regime-nondominium-filter {
    background: rgb(var(--ndo-emerald-100));
    color: rgb(var(--ndo-emerald-700));
    border: 1px dashed rgb(var(--ndo-emerald-300));
  }
  .badge.regime-common-pool-filter {
    background: rgb(var(--ndo-rose-100));
    color: rgb(var(--ndo-rose-700));
    border: 1px dashed rgb(var(--ndo-rose-300));
  }
  .badge.regime-collective-filter {
    background: rgb(var(--ndo-violet-100));
    color: rgb(var(--ndo-violet-700));
    border: 1px dashed rgb(var(--ndo-violet-300));
  }
  .badge.regime-pool-filter {
    background: rgb(var(--ndo-teal-100));
    color: rgb(var(--ndo-teal-700));
    border: 1px dashed rgb(var(--ndo-teal-300));
  }

  .badge.regime-public-filter {
    background: rgb(var(--ndo-sky-100));
    color: rgb(var(--ndo-sky-700));
    border: 1px dashed rgb(var(--ndo-sky-300));
  }

  /* ── Operational state (Layer 2) ──────────────────────────────────────────
     A DIFFERENT SHAPE, not a different colour, and the difference is the point.

     OperationalState and LifecycleStage are orthogonal axes: a resource under
     repair is LifecycleStage.Active and OperationalState.InMaintenance at the
     same time. PR #132 spent a whole type splitting them apart, and the kit used
     to weld them back together by rendering `available` inside
     `variant="lifecycle-stable"`. Giving operational state its own colours would
     not fix that, because a second family of filled pastel pills still reads as
     "another lifecycle". So these are not pills. They are neutral chips with a
     coloured status dot, and the colour lives only in the dot. No lifecycle badge
     has a dot; no operational chip has a coloured background. The two cannot be
     confused at a glance, which is the only test that matters here. */
  .badge[class*='op-'] {
    background: rgb(var(--ndo-gray-50));
    border: 1px solid rgb(var(--ndo-gray-200));
    color: rgb(var(--ndo-gray-700));
    gap: var(--ndo-spacing-1-5);
  }
  .badge[class*='op-']::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    flex: none;
    background: rgb(var(--ndo-gray-400));
  }
  .badge.op-available::before          { background: rgb(var(--ndo-green-600)); }
  .badge.op-reserved::before           { background: rgb(var(--ndo-blue-600)); }
  .badge.op-in-transit::before         { background: rgb(var(--ndo-indigo-700)); }
  .badge.op-in-storage::before         { background: rgb(var(--ndo-teal-700)); }
  .badge.op-in-maintenance::before     { background: rgb(var(--ndo-amber-600)); }
  .badge.op-in-use::before             { background: rgb(var(--ndo-violet-700)); }
  .badge.op-pending-validation::before { background: rgb(var(--ndo-gray-400)); }

  /* ── Rivalry and scope (classification facets) ────────────────────────────
     These two ARE Layer 0 and Layer 1 classification, so they are pills like
     nature and regime. Rivalry borrows the regime card treatment (outlined, no
     fill) because it qualifies a regime rather than standing beside it: the
     effective rivalry of a resource is its nature's default unless the regime's
     creator overrode it. */
  .badge.rivalry-rivalrous,
  .badge.rivalry-non-rivalrous {
    background: transparent;
    border: 1px solid rgb(var(--ndo-gray-300));
    color: rgb(var(--ndo-gray-700));
    font-variant: small-caps;
  }
  .badge.rivalry-rivalrous     { border-color: rgb(var(--ndo-orange-600)); color: rgb(var(--ndo-orange-700)); }
  .badge.rivalry-non-rivalrous { border-color: rgb(var(--ndo-cyan-300));   color: rgb(var(--ndo-cyan-700)); }

  .badge.scope-project { background: rgb(var(--ndo-gray-100)); color: rgb(var(--ndo-gray-700)); }
  .badge.scope-network { background: rgb(var(--ndo-sky-100));  color: rgb(var(--ndo-sky-700)); }
  .badge.scope-public  { background: rgb(var(--ndo-teal-100)); color: rgb(var(--ndo-teal-700)); }

  /* ── Governance rules (Layer 1) ───────────────────────────────────────────
     Rules are not a fourth classification facet and must never read as one. A
     classification says what a resource IS; a rule says what an agent MAY do,
     and it carries a typed payload. So rule badges leave the pill language
     entirely: square corners, monospace, a left accent bar. The 2026-08-18 parity
     plan asked for exactly this, and the reason has since sharpened: `RuleData`
     is a tagged union whose discriminant sits at a different layer from
     PropertyRegime and ResourceNature, and a typed rule that looks like a
     classification teaches the wrong model to whoever designs the rule surface.

     The four names below are the real Rust variants. The kit previously shipped
     `AccessControl` and `TransferPolicy`, which exist in no zome. */
  .badge[class*='rule-'] {
    border-radius: 0;
    font-family: var(--ndo-font-mono, ui-monospace, monospace);
    font-size: calc(var(--ndo-text-xs) * 0.95);
    letter-spacing: 0.01em;
    background: rgb(var(--ndo-gray-50));
    border: 1px solid rgb(var(--ndo-gray-200));
    border-left-width: 3px;
    color: rgb(var(--ndo-gray-800));
  }
  .badge.rule-access-requirement   { border-left-color: rgb(var(--ndo-blue-600)); }
  .badge.rule-usage-limit          { border-left-color: rgb(var(--ndo-amber-600)); }
  .badge.rule-transfer-condition   { border-left-color: rgb(var(--ndo-rose-700)); }
  .badge.rule-maintenance-schedule { border-left-color: rgb(var(--ndo-teal-700)); }

  /* Special */
  .badge.coming-soon { background: rgb(var(--ndo-amber-50)); color: rgb(var(--ndo-amber-600)); }
  .badge.neutral     { background: rgb(var(--ndo-gray-100)); color: rgb(var(--ndo-gray-600)); }
</style>
