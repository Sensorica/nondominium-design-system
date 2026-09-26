<script lang="ts">
  // The design system's badge, for F. A Svelte 5 port of registry/ndo-badge.svelte
  // (same variant names, same token values), because that custom element's
  // bundle is loaded only inside the playbook layout. It keeps the DS shape
  // grammar the handoff asks for:
  //   filled tint              Layer 0 classification (lifecycle, nature)
  //   dashed outline           property regime
  //   3px left edge + mono     Layer 1 governance rule
  //   neutral chip + dot       Layer 2 operational state
  let { variant = 'neutral', label }: { variant?: string; label: string } = $props();
  const family = $derived(variant.startsWith('op-') ? 'op' : variant.startsWith('rule-') ? 'rule' : variant.startsWith('regime-') ? 'regime' : '');
</script>

<span class="badge {variant} {family}" title={label}>{label}</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    max-width: 100%;
    padding: var(--ndo-spacing-0-5) var(--ndo-spacing-2);
    border-radius: var(--ndo-radius-sm);
    font-family: var(--ndo-font-sans);
    font-size: var(--ndo-text-xs);
    font-weight: var(--ndo-weight-medium);
    line-height: 1.5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 1px solid transparent;
    box-sizing: border-box;
  }

  /* Lifecycle */
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

  /* Resource nature */
  .nature-physical    { background: rgb(var(--ndo-blue-100));   color: rgb(var(--ndo-blue-700)); }
  .nature-digital     { background: rgb(var(--ndo-purple-100)); color: rgb(var(--ndo-purple-700)); }
  .nature-service     { background: rgb(var(--ndo-orange-100)); color: rgb(var(--ndo-orange-700)); }
  .nature-hybrid      { background: rgb(var(--ndo-teal-100));   color: rgb(var(--ndo-teal-700)); }
  .nature-information { background: rgb(var(--ndo-indigo-100)); color: rgb(var(--ndo-indigo-700)); }

  /* Property regime: dashed outline */
  .regime {
    background: transparent;
    border: 1px dashed rgb(var(--ndo-gray-400));
    color: rgb(var(--ndo-gray-700));
  }

  /* Operational state (Layer 2): neutral chip, the colour lives in the dot */
  .op {
    gap: var(--ndo-spacing-1-5);
    border-radius: var(--ndo-radius-pill);
    background: rgb(var(--ndo-gray-50));
    border: 1px solid rgb(var(--ndo-gray-200));
    color: rgb(var(--ndo-gray-700));
  }
  .op::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    flex: none;
    background: rgb(var(--ndo-gray-400));
  }
  .op-available::before          { background: rgb(var(--ndo-green-600)); }
  .op-reserved::before           { background: rgb(var(--ndo-blue-600)); }
  .op-in-transit::before         { background: rgb(var(--ndo-indigo-700)); }
  .op-in-storage::before         { background: rgb(var(--ndo-teal-700)); }
  .op-in-maintenance::before     { background: rgb(var(--ndo-amber-600)); }
  .op-in-use::before             { background: rgb(var(--ndo-violet-700)); }
  .op-pending-validation::before { background: rgb(var(--ndo-gray-400)); }

  /* Scope */
  .scope-project { background: rgb(var(--ndo-gray-100)); color: rgb(var(--ndo-gray-700)); }
  .scope-network { background: rgb(var(--ndo-sky-100));  color: rgb(var(--ndo-sky-700)); }
  .scope-public  { background: rgb(var(--ndo-teal-100)); color: rgb(var(--ndo-teal-700)); }

  /* Governance rules (Layer 1): square, mono, 3px left edge */
  .rule {
    border-radius: 0;
    font-family: var(--ndo-font-mono);
    font-size: calc(var(--ndo-text-xs) * 0.95);
    letter-spacing: 0.01em;
    background: rgb(var(--ndo-gray-50));
    border: 1px solid rgb(var(--ndo-gray-200));
    border-left-width: 3px;
    color: rgb(var(--ndo-gray-800));
  }
  .rule-access-requirement   { border-left-color: rgb(var(--ndo-blue-600)); }
  .rule-usage-limit          { border-left-color: rgb(var(--ndo-amber-600)); }
  .rule-transfer-condition   { border-left-color: rgb(var(--ndo-rose-700)); }
  .rule-maintenance-schedule { border-left-color: rgb(var(--ndo-teal-700)); }

  /* Special */
  .coming-soon { background: rgb(var(--ndo-amber-50)); color: rgb(var(--ndo-amber-600)); }
  .neutral     { background: rgb(var(--ndo-gray-100)); color: rgb(var(--ndo-gray-600)); }
</style>
