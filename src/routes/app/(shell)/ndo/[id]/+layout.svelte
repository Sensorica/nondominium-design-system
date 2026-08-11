<script lang="ts">
  // NDO chrome: the Layer 0 identity panel, then the layer tabs.
  //
  // The identity panel is the permanent part — the action hash of the original
  // create is this object's name for all time, and the regime and nature beside
  // it never change. Everything below the tabs is Layer 1 and Layer 2: the form
  // it has taken and the activity around it.
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { ME_ID, agentLabel, ndoById } from '$lib/state.svelte';
  import { shortHash } from '$lib/ndo-ui';
  import { isTerminal } from '$lib/guards/useLifecycleFlow.svelte';
  import NdoBadge from '$lib/components/shared/NdoBadge.svelte';
  import TabNav from '$lib/components/shared/TabNav.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  let { children }: { children: Snippet } = $props();

  const id = $derived(page.params.id ?? '');
  const ndo = $derived(ndoById(id));
  const isInitiator = $derived(ndo?.initiator === ME_ID);

  const tabs = $derived([
    { href: paths.ndoDetail(id), label: 'Identity', icon: '🧿' },
    { href: paths.ndoActivity(id), label: 'Activity', icon: '📈' },
    { href: paths.ndoComposition(id), label: 'Composition', icon: '🧩' },
    { href: paths.ndoGovernance(id), label: 'Governance', icon: '⚖️' },
    { href: paths.ndoResources(id), label: 'Resources', icon: '📦' },
    { href: paths.ndoHistory(id), label: 'History', icon: '🕓' },
  ]);

  let copied = $state(false);
  async function copyHash() {
    if (!ndo) return;
    try {
      await navigator.clipboard.writeText(ndo.hash);
      copied = true;
      setTimeout(() => (copied = false), 1600);
    } catch {
      copied = false;
    }
  }
</script>

{#if !ndo}
  <EmptyState icon="🫥" title="No such NDO" body="That identity anchor is not on this DHT." />
{:else}
  <header class="head">
    <div class="head__main">
      <h1 class="ndo-h1">{ndo.name}</h1>
      {#if ndo.description}<p class="ndo-p mt-2" style="max-width:64ch">{ndo.description}</p>{/if}

      <div class="mt-3 flex flex-wrap gap-1.5">
        <NdoBadge stage={ndo.lifecycle_stage} />
        <NdoBadge regime={ndo.property_regime} />
        <NdoBadge nature={ndo.resource_nature} />
      </div>

      <dl class="facts mt-4">
        <div>
          <dt>Layer 0 hash</dt>
          <dd>
            <button class="hash" onclick={copyHash} title="Copy full hash">
              {shortHash(ndo.hash, 14, 6)} {copied ? '✅' : '📋'}
            </button>
          </dd>
        </div>
        <div>
          <dt>Initiator</dt>
          <dd><a href={paths.agentProfile(ndo.initiator)}>{agentLabel(ndo.initiator)}</a></dd>
        </div>
        <div><dt>Created</dt><dd>{ndo.created_at}</dd></div>
        {#if ndo.hibernation_origin}
          <div><dt>Resumes to</dt><dd>{ndo.hibernation_origin}</dd></div>
        {/if}
        {#if ndo.successor_ndo_hash}
          <div><dt>Successor</dt><dd class="ndo-mono">{shortHash(ndo.successor_ndo_hash)}</dd></div>
        {/if}
      </dl>
    </div>

    <div class="head__actions">
      {#if isInitiator && !isTerminal(ndo.lifecycle_stage)}
        <a class="ndo-btn ndo-btn--primary" href={paths.ndoLifecycle(id)}>🔄 Transition</a>
      {/if}
      <a class="ndo-btn ndo-btn--ghost" href={paths.ndoAssociate(id)}>🔗 Associate</a>
      <a class="ndo-btn ndo-btn--ghost" href={paths.ndoFork(id)}>🍴 Fork</a>
    </div>
  </header>

  <TabNav {tabs} />

  {@render children()}
{/if}

<style>
  .head { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--ndo-spacing-6); flex-wrap: wrap; }
  .head__main { flex: 1; min-width: 280px; }
  .head__actions { display: flex; flex-direction: column; gap: var(--ndo-spacing-2); }
  .facts { margin: 0; display: grid; gap: 8px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  dt { font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); }
  dd { margin: 0; font-size: var(--ndo-text-sm); }
  .hash {
    font-family: var(--ndo-font-mono);
    font-size: var(--ndo-text-xs);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--ndo-color-text-secondary);
  }
  .hash:hover { color: rgb(var(--ndo-primary-600)); }
  a { color: var(--ndo-color-link); }
</style>
