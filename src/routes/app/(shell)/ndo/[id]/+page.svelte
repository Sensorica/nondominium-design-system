<script lang="ts">
  // The identity tab. Layer 0 is deliberately thin: what this object is, and
  // which layers have been activated. Coordination overhead grows with social
  // complexity, so an Ideation-stage NDO showing three empty layers is correct,
  // not incomplete.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import {
    agreementFor,
    appState,
    contributionsFor,
    groupById,
    linksFor,
    ndoById,
    resourcesFor,
    transitionsFor,
  } from '$lib/state.svelte';
  import { STAGE_VOCAB } from '$lib/ndo-ui';

  const id = $derived(page.params.id ?? '');
  const ndo = $derived(ndoById(id));
  const groups = $derived((ndo?.groupIds ?? []).map((g) => groupById(g)).filter(Boolean));
  const layer1Active = $derived(!!agreementFor(id) || resourcesFor(id).length > 0);
  const layer2Active = $derived(contributionsFor(id).length > 0 || transitionsFor(id).length > 0);
</script>

{#if ndo}
  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Where it stands</h2></div>
    <div class="ndo-panel__body">
      <p class="ndo-p">
        {STAGE_VOCAB[ndo.lifecycle_stage].icon} <strong>{ndo.lifecycle_stage}</strong> — {STAGE_VOCAB[ndo.lifecycle_stage].hint}
      </p>
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Layers</h2></div>
    <div class="ndo-panel__body">
      <ul class="layers">
        <li class="on">
          <strong>Layer 0 — Identity</strong>
          <span class="ndo-small">The permanent anchor. Always present; never deleted, even at end of life.</span>
        </li>
        <li class={layer1Active ? 'on' : 'off'}>
          <strong>Layer 1 — Specification</strong>
          <span class="ndo-small">
            {layer1Active
              ? 'Active: this NDO has a documented form, resources or governance rules.'
              : 'Not yet activated. It becomes worth having when the form is worth sharing.'}
          </span>
        </li>
        <li class={layer2Active ? 'on' : 'off'}>
          <strong>Layer 2 — Process</strong>
          <span class="ndo-small">
            {layer2Active
              ? 'Active: contributions and transitions are accruing against it.'
              : 'Not yet activated. It becomes worth having when several agents coordinate around it.'}
          </span>
        </li>
      </ul>
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head">
      <h2 class="ndo-h3">Associated groups</h2>
      <a class="ndo-btn ndo-btn--ghost ndo-btn--sm" href={paths.ndoAssociate(id)}>Associate another</a>
    </div>
    <div class="ndo-panel__body">
      {#if groups.length === 0}
        <p class="ndo-small">No group has soft-linked this NDO.</p>
      {:else}
        <ul class="list">
          {#each groups as group (group!.id)}
            <li>
              <a href={paths.groupDetail(group!.id)}>{group!.name}</a>
              <span class="ndo-mono">{group!.networkSeed}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </section>

  <div class="stats">
    <a class="stat" href={paths.ndoActivity(id)}>
      <span class="n">{contributionsFor(id).length}</span><span class="ndo-label">Contributions</span>
    </a>
    <a class="stat" href={paths.ndoComposition(id)}>
      <span class="n">{linksFor(id).length}</span><span class="ndo-label">Hard links</span>
    </a>
    <a class="stat" href={paths.ndoResources(id)}>
      <span class="n">{resourcesFor(id).length}</span><span class="ndo-label">Resources</span>
    </a>
    <a class="stat" href={paths.ndoHistory(id)}>
      <span class="n">{transitionsFor(id).length}</span><span class="ndo-label">Transitions</span>
    </a>
  </div>
{/if}

<style>
  .layers { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  .layers li {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-left: var(--ndo-spacing-3);
    border-left: 3px solid var(--ndo-color-border);
  }
  .layers .on { border-left-color: rgb(var(--ndo-emerald-600)); }
  .layers .off { opacity: 0.65; }
  .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .list li { display: flex; align-items: center; justify-content: space-between; gap: var(--ndo-spacing-3); }
  .stats { display: grid; gap: var(--ndo-spacing-3); grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
  .stat {
    background: rgb(var(--ndo-color-card-bg));
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-lg);
    padding: var(--ndo-spacing-4);
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-decoration: none;
    transition: var(--ndo-transition-colors);
  }
  .stat:hover { border-color: rgb(var(--ndo-primary-300)); }
  .n { font-size: var(--ndo-text-2xl); font-weight: var(--ndo-weight-bold); color: var(--ndo-color-text-primary); }
  a { color: var(--ndo-color-link); }
</style>
