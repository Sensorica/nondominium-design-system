<script lang="ts">
  // The token showcase. Reads the live custom properties rather than restating
  // their values, so this page cannot drift from tokens.css.
  const scales = [
    { name: 'primary', label: 'Primary — the action color', steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
    { name: 'gray', label: 'Gray — the canvas', steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
  ];

  const domainFamilies = [
    { name: 'Lifecycle', families: ['gray', 'indigo', 'amber', 'green', 'teal', 'emerald', 'yellow', 'orange', 'red'] },
    { name: 'Nature', families: ['blue', 'purple', 'sky', 'teal', 'indigo'] },
    { name: 'Regime', families: ['gray', 'cyan', 'violet', 'rose', 'emerald'] },
  ];

  const semantic = [
    '--ndo-color-bg-app',
    '--ndo-color-surface',
    '--ndo-color-border',
    '--ndo-color-text-primary',
    '--ndo-color-text-secondary',
    '--ndo-color-text-muted',
    '--ndo-color-link',
  ];

  const type = [
    { token: '--ndo-text-3xl', label: 'Display' },
    { token: '--ndo-text-2xl', label: 'Heading 1' },
    { token: '--ndo-text-xl', label: 'Heading 2' },
    { token: '--ndo-text-lg', label: 'Heading 3' },
    { token: '--ndo-text-base', label: 'Body' },
    { token: '--ndo-text-sm', label: 'Small' },
    { token: '--ndo-text-xs', label: 'Caption' },
  ];

  const spacing = ['0-5', '1', '1-5', '2', '3', '4', '5', '6', '8', '12'];
  const radii = ['sm', 'md', 'lg', 'xl', 'pill'];
  const shadows = ['sm', 'md', 'lg', 'xl'];
</script>

<div class="ndo-shell__content">
  <header>
    <h1 class="ndo-h1">🎨 Tokens</h1>
    <p class="ndo-p mt-2">
      Every value is an RGB triplet on <code>:root</code>, so it composes with an alpha channel:
      <code>rgb(var(--ndo-primary-500) / 0.4)</code>. The numbered scales are absolute and never
      redefined; only the semantic layer flips in dark mode.
    </p>
  </header>

  {#each scales as scale (scale.name)}
    <section class="ndo-panel">
      <div class="ndo-panel__head"><h2 class="ndo-h3">{scale.label}</h2></div>
      <div class="ndo-panel__body">
        <div class="ramp">
          {#each scale.steps as step (step)}
            <div class="swatch">
              <div class="chip" style="background:rgb(var(--ndo-{scale.name}-{step}))"></div>
              <span class="ndo-mono">{step}</span>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/each}

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Domain families</h2></div>
    <div class="ndo-panel__body flex flex-col gap-4">
      {#each domainFamilies as axis (axis.name)}
        <div>
          <p class="ndo-label mb-2">{axis.name}</p>
          <div class="ramp">
            {#each axis.families as family (family)}
              <div class="swatch">
                <div class="chip" style="background:rgb(var(--ndo-{family}-100))"></div>
                <span class="ndo-mono">{family}</span>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Semantic surface</h2></div>
    <div class="ndo-panel__body">
      <ul class="tokenlist">
        {#each semantic as token (token)}
          <li>
            <span class="chip chip--sm" style="background:var({token})"></span>
            <code>{token}</code>
          </li>
        {/each}
      </ul>
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Type</h2></div>
    <div class="ndo-panel__body flex flex-col gap-2">
      {#each type as t (t.token)}
        <div class="typerow">
          <span style="font-size:var({t.token});font-weight:var(--ndo-weight-semibold)">{t.label}</span>
          <code>{t.token}</code>
        </div>
      {/each}
      <p class="mt-3" style="font-family:var(--ndo-font-mono)">
        Monospace: <code>--ndo-font-mono</code> — used for hashes and keys.
      </p>
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Spacing, radii, elevation</h2></div>
    <div class="ndo-panel__body flex flex-col gap-4">
      <div>
        <p class="ndo-label mb-2">Spacing</p>
        <div class="ramp">
          {#each spacing as s (s)}
            <div class="swatch">
              <div class="bar" style="width:var(--ndo-spacing-{s})"></div>
              <span class="ndo-mono">{s}</span>
            </div>
          {/each}
        </div>
      </div>
      <div>
        <p class="ndo-label mb-2">Radii — 8px is the base; pill is for badges and dots</p>
        <div class="ramp">
          {#each radii as r (r)}
            <div class="swatch">
              <div class="chip" style="border-radius:var(--ndo-radius-{r});background:rgb(var(--ndo-primary-200))"></div>
              <span class="ndo-mono">{r}</span>
            </div>
          {/each}
        </div>
      </div>
      <div>
        <p class="ndo-label mb-2">Elevation</p>
        <div class="ramp">
          {#each shadows as s (s)}
            <div class="swatch">
              <div class="chip" style="box-shadow:var(--ndo-shadow-{s});background:rgb(var(--ndo-color-card-bg))"></div>
              <span class="ndo-mono">{s}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .ramp { display: flex; flex-wrap: wrap; gap: var(--ndo-spacing-3); }
  .swatch { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .chip {
    width: 56px;
    height: 40px;
    border-radius: var(--ndo-radius-md);
    border: 1px solid var(--ndo-color-border);
  }
  .chip--sm { width: 28px; height: 20px; display: inline-block; vertical-align: middle; }
  .bar { height: 20px; background: rgb(var(--ndo-primary-400)); border-radius: var(--ndo-radius-sm); min-width: 2px; }
  .tokenlist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .tokenlist li { display: flex; align-items: center; gap: var(--ndo-spacing-3); }
  .typerow { display: flex; align-items: baseline; justify-content: space-between; gap: var(--ndo-spacing-4); }
  code { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); }
</style>
