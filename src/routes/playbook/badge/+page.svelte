<svelte:head><title>Badge — Playbook</title></svelte:head>

<h1 class="text-xl font-bold text-gray-900 mb-1">Badge <code class="text-blue-600 text-base font-mono">&lt;ndo-badge&gt;</code></h1>
<p class="text-sm text-gray-600 mb-6">
  Status labels for lifecycle stage, resource nature, and property regime.
  Styled entirely via CSS custom properties — safe for shadow DOM.
</p>

<!-- Lifecycle -->
<section class="specimen-section">
  <h2 class="specimen-heading">Lifecycle Stages</h2>
  <div class="specimen-grid">
    {#each [
      'ideation', 'specification', 'development', 'prototype',
      'stable', 'distributed', 'active', 'hibernating', 'deprecated', 'end-of-life'
    ] as stage}
      <div class="specimen">
        <ndo-badge variant="lifecycle-{stage}" label={stage.replace('-', ' ')}></ndo-badge>
        <code class="specimen-code">variant="lifecycle-{stage}"</code>
      </div>
    {/each}
  </div>
</section>

<!-- Nature -->
<section class="specimen-section">
  <h2 class="specimen-heading">Resource Nature</h2>
  <div class="specimen-grid">
    {#each ['physical', 'digital', 'service', 'hybrid', 'information'] as nature}
      <div class="specimen">
        <ndo-badge variant="nature-{nature}" label={nature}></ndo-badge>
        <code class="specimen-code">variant="nature-{nature}"</code>
      </div>
    {/each}
  </div>
</section>

<!-- Regime -->
<section class="specimen-section">
  <h2 class="specimen-heading">Property Regime</h2>
  <div class="specimen-grid">
    {#each ['nondominium', 'commons', 'collective', 'pool', 'common-pool', 'private'] as regime}
      <div class="specimen">
        <ndo-badge variant="regime-{regime}" label={regime.replace('-', ' ')}></ndo-badge>
        <code class="specimen-code">variant="regime-{regime}"</code>
      </div>
    {/each}
  </div>
</section>

<!-- Special -->
<section class="specimen-section">
  <h2 class="specimen-heading">Special</h2>
  <div class="specimen-grid">
    <div class="specimen">
      <ndo-badge variant="coming-soon" label="Coming soon"></ndo-badge>
      <code class="specimen-code">variant="coming-soon"</code>
    </div>
    <div class="specimen">
      <ndo-badge variant="neutral" label="Neutral"></ndo-badge>
      <code class="specimen-code">variant="neutral"</code>
    </div>
  </div>
</section>

<!-- Usage -->
<section class="specimen-section">
  <h2 class="specimen-heading">Usage</h2>
  <pre class="code-block">{`<!-- HTML / any framework -->
<ndo-badge variant="lifecycle-active" label="Active"></ndo-badge>
<ndo-badge variant="nature-physical">Physical</ndo-badge>
<ndo-badge variant="regime-nondominium" label="Nondominium"></ndo-badge>`}</pre>
  <table class="token-table">
    <thead><tr><th>Token</th><th>Value</th></tr></thead>
    <tbody>
      <tr><td><code>--ndo-emerald-100</code></td><td>209 250 229</td></tr>
      <tr><td><code>--ndo-emerald-700</code></td><td>4 120 87</td></tr>
      <tr><td><code>--ndo-spacing-0-5</code></td><td>0.125rem (2px)</td></tr>
      <tr><td><code>--ndo-spacing-2</code></td><td>0.5rem (8px)</td></tr>
      <tr><td><code>--ndo-radius-sm</code></td><td>0.25rem (4px)</td></tr>
    </tbody>
  </table>
</section>

<style>
  .specimen-section { margin-bottom: 2rem; }
  .specimen-heading { font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgb(var(--ndo-gray-500)); margin: 0 0 0.75rem; }
  .specimen-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .specimen { display: flex; flex-direction: column; align-items: flex-start; gap: 0.375rem; }
  .specimen-code { font-size: 0.6875rem; color: rgb(var(--ndo-gray-400)); font-family: var(--ndo-font-mono); }
  .code-block { background: rgb(var(--ndo-gray-50)); border: 1px solid rgb(var(--ndo-gray-200)); border-radius: 0.5rem; padding: 1rem; font-size: 0.8125rem; font-family: var(--ndo-font-mono); overflow-x: auto; white-space: pre; }
  .token-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; margin-top: 1rem; }
  .token-table th { text-align: left; padding: 0.375rem 0.75rem; background: rgb(var(--ndo-gray-50)); border: 1px solid rgb(var(--ndo-gray-200)); color: rgb(var(--ndo-gray-700)); font-weight: 600; }
  .token-table td { padding: 0.375rem 0.75rem; border: 1px solid rgb(var(--ndo-gray-200)); color: rgb(var(--ndo-gray-700)); }
  .token-table code { font-family: var(--ndo-font-mono); color: rgb(var(--ndo-blue-600)); }
</style>
