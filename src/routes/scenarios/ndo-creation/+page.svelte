<script lang="ts">
  // Scenario: creating an NDO. Two claims worth arguing with: creation is
  // group-scoped, and three of the four choices are permanent.
  import { paths } from '$lib/paths';
  import { CREATABLE_STAGES, LIFECYCLE_STAGES, PROPERTY_REGIMES, RESOURCE_NATURES } from '$lib/types';
  import { REGIME_VOCAB, NATURE_VOCAB, STAGE_VOCAB } from '$lib/ndo-ui';
  import NdoBadge from '$lib/components/shared/NdoBadge.svelte';
</script>

<div class="ndo-shell__content">
  <header>
    <h1 class="ndo-h1">➕ NDO creation</h1>
    <p class="ndo-p mt-2" style="max-width:64ch">
      Creating an NDO commits the Layer 0 identity anchor. The action hash of that create is the
      object's name for the rest of its existence, and three of the four fields beside it never
      change again.
    </p>
  </header>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Why there is no global create button</h2></div>
    <div class="ndo-panel__body flex flex-col gap-3">
      <p class="ndo-small">
        The hierarchy is Lobby → Group → NDO. A group is a cloned DNA cell with its own DHT; an NDO
        created inside one is soft-linked from that cell and announced to its members. A global
        create flow would have nowhere to put the result.
      </p>
      <p class="ndo-small">
        So the sidebar's <strong>New NDO</strong> link is context-aware: with a group selected it
        opens that group's create flow, and without one it lands on the explanation rather than a
        form that cannot be submitted. The dead end is deliberate and it is documented.
      </p>
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Permanent versus mutable</h2></div>
    <div class="ndo-panel__body">
      <table class="table">
        <thead><tr><th>Field</th><th>After creation</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td>Name</td><td>🔒 permanent</td><td>It is how the network refers to the object.</td></tr>
          <tr><td>Property regime</td><td>🔒 permanent</td><td>It constrains which governance rules and agreements are valid at all.</td></tr>
          <tr><td>Resource nature</td><td>🔒 permanent</td><td>Rivalry and governance defaults follow from it.</td></tr>
          <tr><td>Lifecycle stage</td><td>🔄 transitions</td><td>The only field the object is meant to move through.</td></tr>
          <tr><td>Description</td><td>🔄 editable</td><td>Prose, not identity.</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">The four choices</h2></div>
    <div class="ndo-panel__body flex flex-col gap-4">
      <div>
        <p class="ndo-label mb-2">Property regime — four in the UI</p>
        <div class="flex flex-wrap gap-2">
          {#each PROPERTY_REGIMES as regime (regime)}
            <span class="opt"><NdoBadge {regime} /><span class="ndo-field__hint">{REGIME_VOCAB[regime].hint}</span></span>
          {/each}
        </div>
      </div>
      <div>
        <p class="ndo-label mb-2">Resource nature — five</p>
        <div class="flex flex-wrap gap-2">
          {#each RESOURCE_NATURES as nature (nature)}
            <span class="opt"><NdoBadge {nature} /><span class="ndo-field__hint">{NATURE_VOCAB[nature].hint}</span></span>
          {/each}
        </div>
      </div>
      <div>
        <p class="ndo-label mb-2">Starting stage — seven of ten are creatable</p>
        <div class="flex flex-wrap gap-2">
          {#each LIFECYCLE_STAGES as stage (stage)}
            {@const creatable = CREATABLE_STAGES.includes(stage)}
            <span class="opt" style:opacity={creatable ? 1 : 0.4}>
              <NdoBadge {stage} />
              {#if !creatable}<span class="ndo-field__hint">transition only</span>{/if}
            </span>
          {/each}
        </div>
        <p class="ndo-small mt-2">
          An already mature thing can be registered at {STAGE_VOCAB.Active.icon} Active — the ladder
          describes the object, not the moment it was entered into the system. Hibernating and the
          two terminal stages are reachable only by transition, because each carries data the create
          form has no way to supply.
        </p>
      </div>
    </div>
  </section>

  <p class="ndo-small">Live version: <a href={paths.ndoCreate('gr1')}>the create form inside a group</a>, and <a href={paths.ndoCreate()}>without one</a>.</p>
</div>

<style>
  .table { width: 100%; border-collapse: collapse; font-size: var(--ndo-text-sm); }
  th { text-align: left; font-size: var(--ndo-text-xs); text-transform: uppercase; letter-spacing: .06em; color: var(--ndo-color-text-muted); padding: 0 12px 8px 0; border-bottom: 1px solid var(--ndo-color-border); }
  td { padding: 8px 12px 8px 0; border-bottom: 1px solid var(--ndo-color-border-subtle); }
  .opt { display: inline-flex; align-items: center; gap: 6px; }
  a { color: var(--ndo-color-link); }
</style>
