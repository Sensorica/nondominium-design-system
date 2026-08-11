<script lang="ts">
  import { INITIAL_NDOS } from '$lib/mock';
  import NdoCard from '$lib/components/shared/NdoCard.svelte';
  import Specimen from '$lib/components/shared/Specimen.svelte';

  const sample = INITIAL_NDOS[0];
</script>

<header>
  <h1 class="ndo-h1">🃏 Cards</h1>
  <p class="ndo-p mt-2" style="max-width:60ch">
    Two containers carry almost every screen: the NDO card, which is the unit the lobby and the
    group browsers are built from, and the panel, which frames a section.
  </p>
</header>

<Specimen
  title="NDO card — the canonical recipe"
  note="Name and stage on one line, description clamped to two lines, regime and nature beneath, hash and initiator on the base line. That order is fixed: it is what a reader scans for."
  code={`<a class="ndo-card ndo-card--interactive" href={paths.ndoDetail(ndo.id)}>
  <div class="flex items-start justify-between gap-3">
    <h3 class="ndo-h3">{ndo.name}</h3>
    <NdoBadge stage={ndo.lifecycle_stage} />
  </div>
  <p class="ndo-small mt-2 line-clamp-2">{ndo.description}</p>
  <div class="mt-3 flex flex-wrap gap-1.5">
    <NdoBadge regime={ndo.property_regime} />
    <NdoBadge nature={ndo.resource_nature} />
  </div>
  <div class="mt-3 flex items-center justify-between gap-3">
    <span class="ndo-mono">{shortHash(ndo.hash)}</span>
    <span class="ndo-small">{agentLabel(ndo.initiator)}</span>
  </div>
</a>`}
>
  {#snippet demo()}
    <div style="width:320px"><NdoCard ndo={sample} /></div>
  {/snippet}
</Specimen>

<Specimen
  title="Static card"
  note="Without the interactive modifier: no pointer, no hover lift, no border shift."
  code={`<div class="ndo-card">…</div>`}
>
  {#snippet demo()}
    <div class="ndo-card" style="width:320px">
      <h3 class="ndo-h3">A static card</h3>
      <p class="ndo-small mt-2">One border, one hairline shadow, 8px radius. Nothing moves.</p>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Panel"
  note="The section frame: a head with a title and at most one action, then a body. Used for every grouped block in the prototype."
  code={`<section class="ndo-panel">
  <div class="ndo-panel__head">
    <h2 class="ndo-h3">Title</h2>
    <button class="ndo-btn ndo-btn--ghost ndo-btn--sm">Action</button>
  </div>
  <div class="ndo-panel__body">…</div>
</section>`}
>
  {#snippet demo()}
    <section class="ndo-panel" style="width:100%">
      <div class="ndo-panel__head">
        <h2 class="ndo-h3">Associated groups</h2>
        <button class="ndo-btn ndo-btn--ghost ndo-btn--sm">Associate another</button>
      </div>
      <div class="ndo-panel__body">
        <p class="ndo-small">Panel bodies stack their children with a 16px gap.</p>
      </div>
    </section>
  {/snippet}
</Specimen>

<Specimen
  title="Custom element"
  note="The embeddable card takes its badges as a single semicolon-delimited string, because attributes cannot carry arrays."
  code={`<ndo-card
  name="Community Solar Array"
  description="Shared photovoltaic infrastructure."
  hash="uhC0kVX5k7dL2mPqR"
  href="#"
  badges="lifecycle-active:Active;regime-nondominium:Nondominium;nature-physical:Physical">
</ndo-card>`}
>
  {#snippet demo()}
    <div style="width:320px">
      <ndo-card
        name="Community Solar Array"
        description="Shared photovoltaic infrastructure on the lab roof."
        hash="uhC0kVX5k7dL2mPqR"
        href="#"
        badges="lifecycle-active:Active;regime-nondominium:Nondominium;nature-physical:Physical"
      ></ndo-card>
    </div>
  {/snippet}
</Specimen>
