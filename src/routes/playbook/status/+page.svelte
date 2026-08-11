<svelte:head><title>Status Dot — Playbook</title></svelte:head>

<h1 class="text-xl font-bold text-gray-900 mb-1">Status Dot <code class="text-blue-600 text-base font-mono">&lt;ndo-status-dot&gt;</code></h1>
<p class="text-sm text-gray-600 mb-6">Compact inline status indicators with optional label.</p>

<section class="specimen-section">
  <h2 class="specimen-heading">All Statuses</h2>
  <div class="specimen-col">
    {#each [
      { status: 'active',      label: 'Active' },
      { status: 'inactive',    label: 'Inactive' },
      { status: 'pending',     label: 'Pending validation' },
      { status: 'coming-soon', label: 'Coming soon' }
    ] as s}
      <div class="specimen-row">
        <ndo-status-dot status={s.status} label={s.label}></ndo-status-dot>
        <code class="specimen-code">status="{s.status}"</code>
      </div>
    {/each}
  </div>
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">Without Label (icon only)</h2>
  <div class="specimen-row">
    <ndo-status-dot status="active"></ndo-status-dot>
    <ndo-status-dot status="inactive"></ndo-status-dot>
    <ndo-status-dot status="pending"></ndo-status-dot>
    <ndo-status-dot status="coming-soon"></ndo-status-dot>
  </div>
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">Usage</h2>
  <pre class="code-block">{`<ndo-status-dot status="active" label="Active"></ndo-status-dot>
<ndo-status-dot status="coming-soon" label="Coming soon"></ndo-status-dot>
<ndo-status-dot status="pending"></ndo-status-dot>`}</pre>
  <table class="token-table">
    <thead><tr><th>Prop</th><th>Values</th><th>Default</th></tr></thead>
    <tbody>
      <tr><td><code>status</code></td><td>active · inactive · pending · coming-soon</td><td>pending</td></tr>
      <tr><td><code>label</code></td><td>string</td><td>— (omits label text)</td></tr>
    </tbody>
  </table>
</section>

<style>
  .specimen-section { margin-bottom: 2rem; }
  .specimen-heading { font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgb(var(--ndo-gray-500)); margin: 0 0 0.75rem; }
  .specimen-col { display: flex; flex-direction: column; gap: 0.75rem; }
  .specimen-row { display: flex; align-items: center; gap: 1rem; }
  .specimen-code { font-size: 0.6875rem; color: rgb(var(--ndo-gray-400)); font-family: var(--ndo-font-mono); }
  .code-block { background: rgb(var(--ndo-gray-50)); border: 1px solid rgb(var(--ndo-gray-200)); border-radius: 0.5rem; padding: 1rem; font-size: 0.8125rem; font-family: var(--ndo-font-mono); overflow-x: auto; white-space: pre; }
  .token-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; margin-top: 1rem; }
  .token-table th { text-align: left; padding: 0.375rem 0.75rem; background: rgb(var(--ndo-gray-50)); border: 1px solid rgb(var(--ndo-gray-200)); color: rgb(var(--ndo-gray-700)); font-weight: 600; }
  .token-table td { padding: 0.375rem 0.75rem; border: 1px solid rgb(var(--ndo-gray-200)); color: rgb(var(--ndo-gray-700)); }
  .token-table code { font-family: var(--ndo-font-mono); color: rgb(var(--ndo-blue-600)); }
</style>
