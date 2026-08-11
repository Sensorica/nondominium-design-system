<script lang="ts">
  // The badge sheet is the closest thing this system has to a specification:
  // three domain axes, twenty-one values, each with a fixed colour family.
  import { LIFECYCLE_STAGES, PROPERTY_REGIMES, RESOURCE_NATURES } from '$lib/types';
  import { NATURE_VOCAB, REGIME_VOCAB, STAGE_VOCAB } from '$lib/ndo-ui';
  import NdoBadge from '$lib/components/shared/NdoBadge.svelte';
  import Specimen from '$lib/components/shared/Specimen.svelte';
</script>

<header>
  <h1 class="ndo-h1">🏷️ Badges</h1>
  <p class="ndo-p mt-2" style="max-width:62ch">
    Nondominium's ontology is the visual system. Lifecycle stage, resource nature and property
    regime each own a colour family, so a reader who has seen a few screens recognises the state
    before reading the label.
  </p>
</header>

<Specimen
  title="Lifecycle stage"
  note="Ten stages. The ramp runs cool for early stages, warm for late ones, and red for the terminal one, so maturity reads as temperature."
  code={`<NdoBadge stage="Active" />`}
>
  {#snippet demo()}
    {#each LIFECYCLE_STAGES as stage (stage)}
      <NdoBadge {stage} />
    {/each}
  {/snippet}
</Specimen>

<Specimen
  title="Resource nature"
  note="What kind of thing this is. Five values; the code additionally carries Service and Information beyond the three in the original specification."
  code={`<NdoBadge nature="Physical" />`}
>
  {#snippet demo()}
    {#each RESOURCE_NATURES as nature (nature)}
      <NdoBadge {nature} />
    {/each}
  {/snippet}
</Specimen>

<Specimen
  title="Property regime"
  note="Four regimes in the UI. The Rust crate also carries Collective and Pool; the registry still renders them for data that predates the design review that removed them."
  code={`<NdoBadge regime="Nondominium" />`}
>
  {#snippet demo()}
    {#each PROPERTY_REGIMES as regime (regime)}
      <NdoBadge {regime} />
    {/each}
    <span class="ndo-badge ndo-badge--regime-collective">🏛️Collective</span>
    <span class="ndo-badge ndo-badge--regime-pool">🫗Pool</span>
  {/snippet}
</Specimen>

<Specimen
  title="Without an icon"
  note="Roles and link types use the neutral variant with the icon suppressed, so they read as labels rather than domain states."
  code={`<NdoBadge variant="neutral" label="AccountableAgent" icon={false} />`}
>
  {#snippet demo()}
    <NdoBadge variant="neutral" label="AccountableAgent" icon={false} />
    <NdoBadge variant="neutral" label="Transport" icon={false} />
    <NdoBadge variant="coming-soon" label="Coming soon" icon={false} />
  {/snippet}
</Specimen>

<Specimen
  title="Custom element"
  note="Variant slugs are identical between the Svelte component and the custom element."
  code={`<ndo-badge variant="lifecycle-active" label="Active"></ndo-badge>
<ndo-badge variant="nature-physical" label="Physical"></ndo-badge>
<ndo-badge variant="regime-nondominium" label="Nondominium"></ndo-badge>`}
>
  {#snippet demo()}
    <ndo-badge variant="lifecycle-active" label="Active"></ndo-badge>
    <ndo-badge variant="nature-physical" label="Physical"></ndo-badge>
    <ndo-badge variant="regime-nondominium" label="Nondominium"></ndo-badge>
  {/snippet}
</Specimen>

<section class="ndo-panel">
  <div class="ndo-panel__head"><h2 class="ndo-h3">Vocabulary</h2></div>
  <div class="ndo-panel__body">
    <table class="table">
      <thead><tr><th>Value</th><th>Variant</th><th>Meaning</th></tr></thead>
      <tbody>
        {#each LIFECYCLE_STAGES as stage (stage)}
          <tr><td>{STAGE_VOCAB[stage].icon} {stage}</td><td><code>{STAGE_VOCAB[stage].variant}</code></td><td>{STAGE_VOCAB[stage].hint}</td></tr>
        {/each}
        {#each RESOURCE_NATURES as nature (nature)}
          <tr><td>{NATURE_VOCAB[nature].icon} {nature}</td><td><code>{NATURE_VOCAB[nature].variant}</code></td><td>{NATURE_VOCAB[nature].hint}</td></tr>
        {/each}
        {#each PROPERTY_REGIMES as regime (regime)}
          <tr><td>{REGIME_VOCAB[regime].icon} {regime}</td><td><code>{REGIME_VOCAB[regime].variant}</code></td><td>{REGIME_VOCAB[regime].hint}</td></tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<style>
  .table { width: 100%; border-collapse: collapse; font-size: var(--ndo-text-sm); }
  th {
    text-align: left;
    font-size: var(--ndo-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--ndo-color-text-muted);
    padding: 0 var(--ndo-spacing-3) var(--ndo-spacing-2) 0;
    border-bottom: 1px solid var(--ndo-color-border);
  }
  td { padding: 6px var(--ndo-spacing-3) 6px 0; border-bottom: 1px solid var(--ndo-color-border-subtle); }
  code { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); }
</style>
