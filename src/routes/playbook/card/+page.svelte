<svelte:head><title>Card — Playbook</title></svelte:head>

<h1 class="text-xl font-bold text-gray-900 mb-1">Card <code class="text-blue-600 text-base font-mono">&lt;ndo-card&gt;</code></h1>
<p class="text-sm text-gray-600 mb-6">NDO listing card. Badges are passed as a serialized string.</p>

<section class="specimen-section">
  <h2 class="specimen-heading">Full Card</h2>
  <div class="card-grid">
    <ndo-card
      name="Community Solar Array"
      description="Shared photovoltaic infrastructure governed under nondominium principles by the Sensorica collective."
      hash="uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF"
      href="#"
      badges="lifecycle-active:Active;regime-nondominium:Nondominium;nature-physical:Physical">
    </ndo-card>

    <ndo-card
      name="Open Hardware CNC Bed"
      description="Community-maintained CNC router available for approved fabrication tasks. Transport role required."
      hash="uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy"
      href="#"
      badges="lifecycle-stable:Stable;regime-pool:Pool;nature-physical:Physical">
    </ndo-card>

    <ndo-card
      name="Distributed Sensor Design"
      description="Open-source IoT sensor design file optimised for environmental monitoring in urban commons."
      hash="uhC0kZyXwVuTsRqPoNmLkJiHgFeDcBa9"
      href="#"
      badges="lifecycle-distributed:Distributed;regime-commons:Commons;nature-digital:Digital">
    </ndo-card>
  </div>
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">Minimal</h2>
  <div class="card-grid">
    <ndo-card name="Unnamed Resource" hash="uhC0k1234567890"></ndo-card>
  </div>
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">Usage</h2>
  <pre class="code-block">{`<ndo-card
  name="Community Solar Array"
  description="Shared photovoltaic infrastructure..."
  hash="uhC0kVX5k7dL2mPqR..."
  href="/ndo/uhC0kVX5..."
  badges="lifecycle-active:Active;regime-nondominium:Nondominium;nature-physical:Physical">
</ndo-card>

<!-- badges format: "variant:label;variant:label;..." -->`}</pre>
</section>

<style>
  .specimen-section { margin-bottom: 2rem; }
  .specimen-heading { font-size: 0.8125rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgb(var(--ndo-gray-500)); margin: 0 0 0.75rem; }
  .card-grid { display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr)); }
  .code-block { background: rgb(var(--ndo-gray-50)); border: 1px solid rgb(var(--ndo-gray-200)); border-radius: 0.5rem; padding: 1rem; font-size: 0.8125rem; font-family: var(--ndo-font-mono); overflow-x: auto; white-space: pre; }
</style>
