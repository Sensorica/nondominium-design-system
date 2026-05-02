<script>
  import { base } from '$app/paths';
</script>

<svelte:head><title>Button — Playbook</title></svelte:head>

<h1 class="text-xl font-bold text-gray-900 mb-1">Button <code class="text-blue-600 text-base font-mono">&lt;ndo-button&gt;</code></h1>
<p class="text-sm text-gray-600 mb-6">Action triggers in primary, ghost, and destructive styles.</p>

<section class="specimen-section">
  <h2 class="specimen-heading">Variants</h2>
  <div class="specimen-row">
    <ndo-button variant="primary">Create NDO</ndo-button>
    <ndo-button variant="ghost">Cancel</ndo-button>
    <ndo-button variant="destructive">Delete</ndo-button>
  </div>
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">Disabled</h2>
  <div class="specimen-row">
    <ndo-button variant="primary" disabled>Create NDO</ndo-button>
    <ndo-button variant="ghost" disabled>Cancel</ndo-button>
    <ndo-button variant="destructive" disabled>Delete</ndo-button>
  </div>
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">As Link</h2>
  <div class="specimen-row">
    <ndo-button variant="primary" href="{base}/playbook">Back to Playbook</ndo-button>
    <ndo-button variant="ghost" href="{base}/">Home</ndo-button>
  </div>
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">Usage</h2>
  <pre class="code-block">{`<ndo-button variant="primary">Create NDO</ndo-button>
<ndo-button variant="ghost">Cancel</ndo-button>
<ndo-button variant="destructive">Delete</ndo-button>
<ndo-button variant="primary" disabled>Disabled</ndo-button>
<ndo-button variant="ghost" href="/somewhere">Link</ndo-button>`}</pre>
  <table class="token-table">
    <thead><tr><th>Prop</th><th>Values</th><th>Default</th></tr></thead>
    <tbody>
      <tr><td><code>variant</code></td><td>primary · ghost · destructive</td><td>primary</td></tr>
      <tr><td><code>disabled</code></td><td>boolean</td><td>false</td></tr>
      <tr><td><code>href</code></td><td>string</td><td>— (renders button)</td></tr>
      <tr><td><code>type</code></td><td>button · submit · reset</td><td>button</td></tr>
    </tbody>
  </table>
</section>

<style>
  .specimen-section { margin-bottom: 2rem; }
  .specimen-heading { font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgb(var(--ndo-gray-500)); margin: 0 0 0.75rem; }
  .specimen-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
  .code-block { background: rgb(var(--ndo-gray-50)); border: 1px solid rgb(var(--ndo-gray-200)); border-radius: 0.5rem; padding: 1rem; font-size: 0.8125rem; font-family: var(--ndo-font-mono); overflow-x: auto; white-space: pre; }
  .token-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; margin-top: 1rem; }
  .token-table th { text-align: left; padding: 0.375rem 0.75rem; background: rgb(var(--ndo-gray-50)); border: 1px solid rgb(var(--ndo-gray-200)); color: rgb(var(--ndo-gray-700)); font-weight: 600; }
  .token-table td { padding: 0.375rem 0.75rem; border: 1px solid rgb(var(--ndo-gray-200)); color: rgb(var(--ndo-gray-700)); }
  .token-table code { font-family: var(--ndo-font-mono); color: rgb(var(--ndo-blue-600)); }
</style>
