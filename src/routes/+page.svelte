<svelte:head><title>Nondominium Design System</title></svelte:head>

<div class="page">
  <header class="page-header">
    <h1 class="text-2xl font-bold text-gray-900">Design Tokens</h1>
    <p class="text-sm text-gray-500 mt-1">
      All tokens are CSS custom properties on <code>:root</code>.
      Use <code>rgb(var(--ndo-*) / alpha)</code> for transparency.
    </p>
  </header>

  <!-- Color palette -->
  <section class="section">
    <h2 class="section-title">Colors</h2>

    <h3 class="subsection-title">Gray Scale</h3>
    <div class="swatch-row">
      {#each [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as step}
        <div class="swatch">
          <div class="swatch-color" style="background: rgb(var(--ndo-gray-{step})); border: 1px solid rgb(var(--ndo-gray-200))"></div>
          <span class="swatch-label">{step}</span>
        </div>
      {/each}
    </div>

    <h3 class="subsection-title mt-6">Lifecycle Status</h3>
    <div class="swatch-row flex-wrap">
      {#each [
        { name: 'Ideation', bg: '--ndo-gray-100', text: '--ndo-gray-600' },
        { name: 'Specification', bg: '--ndo-blue-50', text: '--ndo-blue-600' },
        { name: 'Development', bg: '--ndo-indigo-100', text: '--ndo-indigo-700' },
        { name: 'Prototype', bg: '--ndo-amber-100', text: '--ndo-amber-700' },
        { name: 'Stable', bg: '--ndo-green-100', text: '--ndo-green-700' },
        { name: 'Distributed', bg: '--ndo-teal-100', text: '--ndo-teal-700' },
        { name: 'Active', bg: '--ndo-emerald-100', text: '--ndo-emerald-700' },
        { name: 'Hibernating', bg: '--ndo-yellow-100', text: '--ndo-yellow-700' },
        { name: 'Deprecated', bg: '--ndo-orange-100', text: '--ndo-orange-700' },
        { name: 'End of Life', bg: '--ndo-red-100', text: '--ndo-red-700' }
      ] as s}
        <ndo-badge variant="lifecycle-{s.name.toLowerCase().replace(/ /g, '-')}" label={s.name}></ndo-badge>
      {/each}
    </div>

    <h3 class="subsection-title mt-6">Resource Nature</h3>
    <div class="swatch-row">
      <ndo-badge variant="nature-physical" label="Physical"></ndo-badge>
      <ndo-badge variant="nature-digital" label="Digital"></ndo-badge>
      <ndo-badge variant="nature-service" label="Service"></ndo-badge>
      <ndo-badge variant="nature-hybrid" label="Hybrid"></ndo-badge>
      <ndo-badge variant="nature-information" label="Information"></ndo-badge>
    </div>

    <h3 class="subsection-title mt-6">Property Regime</h3>
    <div class="swatch-row">
      <ndo-badge variant="regime-nondominium" label="Nondominium"></ndo-badge>
      <ndo-badge variant="regime-commons" label="Commons"></ndo-badge>
      <ndo-badge variant="regime-collective" label="Collective"></ndo-badge>
      <ndo-badge variant="regime-pool" label="Pool"></ndo-badge>
      <ndo-badge variant="regime-common-pool" label="CommonPool"></ndo-badge>
      <ndo-badge variant="regime-private" label="Private"></ndo-badge>
    </div>
  </section>

  <!-- Typography -->
  <section class="section">
    <h2 class="section-title">Typography</h2>
    <div class="type-scale">
      <div class="type-row">
        <span class="type-label">2xl · 24px</span>
        <span style="font-size: var(--ndo-text-2xl); font-weight: var(--ndo-weight-bold)">Community Solar Array</span>
      </div>
      <div class="type-row">
        <span class="type-label">xl · 20px</span>
        <span style="font-size: var(--ndo-text-xl); font-weight: var(--ndo-weight-semibold)">NDO Identity Layer</span>
      </div>
      <div class="type-row">
        <span class="type-label">lg · 18px</span>
        <span style="font-size: var(--ndo-text-lg); font-weight: var(--ndo-weight-semibold)">Open Hardware CNC</span>
      </div>
      <div class="type-row">
        <span class="type-label">base · 16px</span>
        <span style="font-size: var(--ndo-text-base)">Shared photovoltaic infrastructure governed under nondominium principles.</span>
      </div>
      <div class="type-row">
        <span class="type-label">sm · 14px</span>
        <span style="font-size: var(--ndo-text-sm); color: rgb(var(--ndo-gray-600))">Browse resources and economic events on your conductor.</span>
      </div>
      <div class="type-row">
        <span class="type-label">xs mono</span>
        <span style="font-size: var(--ndo-text-xs); font-family: var(--ndo-font-mono); color: rgb(var(--ndo-gray-400))">#uhC0kVX5k7dL2mPqR…</span>
      </div>
    </div>
  </section>

  <!-- Spacing -->
  <section class="section">
    <h2 class="section-title">Spacing</h2>
    <div class="spacing-scale">
      {#each [
        { token: '--ndo-spacing-1', px: '4px', label: '1' },
        { token: '--ndo-spacing-2', px: '8px', label: '2' },
        { token: '--ndo-spacing-3', px: '12px', label: '3' },
        { token: '--ndo-spacing-4', px: '16px', label: '4' },
        { token: '--ndo-spacing-6', px: '24px', label: '6' },
        { token: '--ndo-spacing-8', px: '32px', label: '8' }
      ] as s}
        <div class="spacing-row">
          <span class="spacing-label">{s.label} · {s.px}</span>
          <div class="spacing-bar" style="width: var({s.token}); height: 1rem; background: rgb(var(--ndo-blue-600))"></div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Shadows -->
  <section class="section">
    <h2 class="section-title">Shadows</h2>
    <div class="shadow-demos">
      <div class="shadow-card" style="box-shadow: var(--ndo-shadow-sm)">
        <span class="text-xs text-gray-500">shadow-sm</span>
      </div>
      <div class="shadow-card" style="box-shadow: var(--ndo-shadow-md)">
        <span class="text-xs text-gray-500">shadow-md</span>
      </div>
      <div class="shadow-card" style="box-shadow: var(--ndo-shadow-lg)">
        <span class="text-xs text-gray-500">shadow-lg</span>
      </div>
    </div>
  </section>
</div>

<style>
  .page { padding: 2rem 1.5rem; max-width: 64rem; margin: 0 auto; }
  .page-header { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid rgb(var(--ndo-gray-200)); }
  .section { margin-bottom: 2.5rem; }
  .section-title { font-size: 1.125rem; font-weight: 600; color: rgb(var(--ndo-gray-900)); margin: 0 0 1rem; }
  .subsection-title { font-size: 0.8125rem; font-weight: 600; color: rgb(var(--ndo-gray-500)); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 0.5rem; }
  .mt-6 { margin-top: 1.5rem; }

  .swatch-row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
  .swatch { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
  .swatch-color { width: 3rem; height: 3rem; border-radius: 0.375rem; }
  .swatch-label { font-size: 0.6875rem; color: rgb(var(--ndo-gray-500)); }

  .type-scale { display: flex; flex-direction: column; gap: 0.75rem; }
  .type-row { display: flex; align-items: baseline; gap: 1rem; }
  .type-label { font-size: 0.6875rem; color: rgb(var(--ndo-gray-400)); font-family: var(--ndo-font-mono); width: 7rem; flex-shrink: 0; }

  .spacing-scale { display: flex; flex-direction: column; gap: 0.5rem; }
  .spacing-row { display: flex; align-items: center; gap: 1rem; }
  .spacing-label { font-size: 0.6875rem; color: rgb(var(--ndo-gray-400)); font-family: var(--ndo-font-mono); width: 6rem; flex-shrink: 0; }

  .shadow-demos { display: flex; gap: 1.5rem; }
  .shadow-card { background: #fff; border-radius: 0.5rem; padding: 1.5rem 2rem; display: flex; align-items: center; justify-content: center; }
</style>
