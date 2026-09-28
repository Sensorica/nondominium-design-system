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
    // Claude Design's Badge.jsx names these `opstate-*`, not `op-*`. Both
    // names are accepted and render identically (see the op-state block
    // below); `op-*` stays the documented, canonical name in the playbook.
    | 'opstate-available'
    | 'opstate-reserved'
    | 'opstate-in-transit'
    | 'opstate-in-storage'
    | 'opstate-in-maintenance'
    | 'opstate-in-use'
    | 'opstate-pending-validation'
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

  /* Property regime on cards — per-hue dashed outline (Claude Design's
     Badge.jsx `regime()` helper: transparent fill, `1px dashed <hue>-700`,
     text the same hue). Until 2026-09-28 this rendered every regime in a
     single uniform gray-400 dashed outline, matching the shipped app's own
     NdoCard.svelte rather than Claude Design; Soushi ratified Claude Design
     as the fidelity source for this repo's guideline pages, so this now
     matches Badge.jsx exactly. `regime-public`, below, has no Claude Design
     counterpart and keeps its previous gray treatment. */
  .badge.regime-nondominium,
  .badge.regime-commons,
  .badge.regime-collective,
  .badge.regime-pool,
  .badge.regime-common-pool,
  .badge.regime-private,
  .badge.regime-public {
    background: transparent;
  }
  .badge.regime-nondominium  { border: 1px dashed rgb(var(--ndo-blue-700));   color: rgb(var(--ndo-blue-700)); }
  .badge.regime-commons      { border: 1px dashed rgb(var(--ndo-cyan-700));   color: rgb(var(--ndo-cyan-700)); }
  .badge.regime-collective   { border: 1px dashed rgb(var(--ndo-violet-700)); color: rgb(var(--ndo-violet-700)); }
  .badge.regime-pool         { border: 1px dashed rgb(var(--ndo-teal-700));   color: rgb(var(--ndo-teal-700)); }
  .badge.regime-common-pool  { border: 1px dashed rgb(var(--ndo-rose-700));   color: rgb(var(--ndo-rose-700)); }
  .badge.regime-private      { border: 1px dashed rgb(var(--ndo-gray-700));   color: rgb(var(--ndo-gray-700)); }
  /* No Claude Design equivalent for `public`; unchanged from before. */
  .badge.regime-public       { border: 1px dashed rgb(var(--ndo-gray-400));   color: rgb(var(--ndo-gray-700)); }

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
     Matches Claude Design's Badge.jsx exactly as of 2026-09-28: a filled pill
     (its own hue per state, `--ndo-radius-xl`, extra left padding) with a
     leading dot in `currentColor` (so the dot always matches that state's own
     text colour, never a separate palette).

     Until 2026-09-28 this rendered a neutral gray-50 chip with only the dot
     coloured, on purpose: OperationalState and LifecycleStage are orthogonal
     axes (a resource under repair is LifecycleStage.Active AND
     OperationalState.InMaintenance at once — PR #132 split the type apart for
     exactly this), and a second family of filled pastel pills reads as
     "another lifecycle" at a glance, confusing the two. That design concern is
     still real; it is just no longer what this component renders, because
     Soushi ratified Claude Design as this repo's fidelity source and
     Badge.jsx fills every op-state pill. The two axes stay visually
     distinguishable by shape, not colour restraint: no lifecycle badge has a
     leading dot, every op-state badge does, and its border-radius is the
     `-xl` pill Claude Design gives it while lifecycle stays `-sm`. */
  .badge[class*='op-'],
  .badge[class*='opstate-'] {
    border-radius: var(--ndo-radius-xl);
    padding-left: var(--ndo-spacing-1-5);
  }
  .badge[class*='op-']::before,
  .badge[class*='opstate-']::before {
    content: '';
    display: inline-block;
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    flex: none;
    margin-right: var(--ndo-spacing-1-5);
    background: currentColor;
  }
  .badge.op-available,          .badge.opstate-available          { background: rgb(var(--ndo-green-50));   color: rgb(var(--ndo-green-700)); }
  .badge.op-reserved,            .badge.opstate-reserved            { background: rgb(var(--ndo-amber-50));   color: rgb(var(--ndo-amber-700)); }
  .badge.op-in-transit,          .badge.opstate-in-transit          { background: rgb(var(--ndo-blue-50));    color: rgb(var(--ndo-blue-700)); }
  .badge.op-in-storage,          .badge.opstate-in-storage          { background: rgb(var(--ndo-indigo-100)); color: rgb(var(--ndo-indigo-700)); }
  .badge.op-in-maintenance,      .badge.opstate-in-maintenance      { background: rgb(var(--ndo-orange-100)); color: rgb(var(--ndo-orange-700)); }
  .badge.op-in-use,              .badge.opstate-in-use              { background: rgb(var(--ndo-teal-100));   color: rgb(var(--ndo-teal-700)); }
  .badge.op-pending-validation,  .badge.opstate-pending-validation  { background: rgb(var(--ndo-gray-100));   color: rgb(var(--ndo-gray-600)); }

  /* ── Rivalry and scope (classification facets) ────────────────────────────
     These two ARE Layer 0 and Layer 1 classification, so they are filled
     pills like nature, matching Claude Design's Badge.jsx `fill()` variants
     exactly. Until 2026-09-28 rivalry borrowed the regime card's outlined,
     small-caps treatment instead; Badge.jsx fills it like any other
     classification pill, so this now matches. */
  .badge.rivalry-rivalrous     { background: rgb(var(--ndo-rose-100)); color: rgb(var(--ndo-rose-700)); }
  .badge.rivalry-non-rivalrous { background: rgb(var(--ndo-cyan-100)); color: rgb(var(--ndo-cyan-700)); }

  .badge.scope-project { background: rgb(var(--ndo-gray-100)); color: rgb(var(--ndo-gray-700)); }
  .badge.scope-network { background: rgb(var(--ndo-blue-100));  color: rgb(var(--ndo-blue-700)); }
  .badge.scope-public  { background: rgb(var(--ndo-green-100)); color: rgb(var(--ndo-green-700)); }

  /* ── Governance rules (Layer 1) ───────────────────────────────────────────
     Rules are not a fourth classification facet and must never read as one. A
     classification says what a resource IS; a rule says what an agent MAY do,
     and it carries a typed payload. So rule badges leave the pill language
     entirely: monospace, a left accent bar, rounded only on the right (Claude
     Design's Badge.jsx `rule()` helper). The 2026-08-18 parity plan asked for
     exactly this shape; until 2026-09-28 this component filled it with a flat
     gray-50 chip and square corners throughout, rather than Badge.jsx's own
     per-rule fill and right-rounded corner, which it now matches exactly
     (fidelity ratified by Soushi 2026-09-28). `RuleData` is still a tagged
     union whose discriminant sits at a different layer from PropertyRegime
     and ResourceNature, which is the reason this stays out of the pill
     language rather than a claim about which fill colour it gets.

     The four names below are the real Rust variants. The kit previously shipped
     `AccessControl` and `TransferPolicy`, which exist in no zome. */
  .badge[class*='rule-'] {
    border-radius: 0 var(--ndo-radius-sm) var(--ndo-radius-sm) 0;
    font-family: var(--ndo-font-mono, ui-monospace, monospace);
    border: 1px solid transparent;
  }
  .badge.rule-access-requirement   { background: rgb(var(--ndo-blue-50));    color: rgb(var(--ndo-blue-700));  border-left: 3px solid rgb(var(--ndo-blue-700)); }
  .badge.rule-usage-limit          { background: rgb(var(--ndo-amber-50));   color: rgb(var(--ndo-amber-800)); border-left: 3px solid rgb(var(--ndo-amber-700)); }
  .badge.rule-transfer-condition   { background: rgb(var(--ndo-violet-100)); color: rgb(var(--ndo-violet-700)); border-left: 3px solid rgb(var(--ndo-violet-700)); }
  .badge.rule-maintenance-schedule { background: rgb(var(--ndo-orange-50)); color: rgb(var(--ndo-orange-700)); border-left: 3px solid rgb(var(--ndo-orange-700)); }

  /* Special */
  .badge.coming-soon { background: rgb(var(--ndo-amber-50)); color: rgb(var(--ndo-amber-600)); }
  .badge.neutral     { background: rgb(var(--ndo-gray-100)); color: rgb(var(--ndo-gray-600)); }
</style>
