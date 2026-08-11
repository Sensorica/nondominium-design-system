<script lang="ts">
  // An agent's public face: Person entry, roles, and the work the network can
  // see. Reputation itself is private — PPRs never leave the owning agent's
  // source chain — so this page shows counts, not scores.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { agentById, appState } from '$lib/state.svelte';
  import NdoBadge from '$lib/components/shared/NdoBadge.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  const agent = $derived(agentById(page.params.id ?? ''));
  const initiated = $derived(appState.ndos.filter((n) => n.initiator === agent?.id));
  const contributions = $derived(appState.contributions.filter((c) => c.provider === agent?.id));
  const validations = $derived(appState.contributions.filter((c) => c.validated_by.includes(agent?.id ?? '')));
  const custodies = $derived(appState.resources.filter((r) => r.custodian === agent?.id));
</script>

{#if !agent}
  <EmptyState icon="🫥" title="No such agent" body="This key is not known on this network." />
{:else}
  <header class="flex items-start gap-4">
    <span class="avatar" aria-hidden="true">{agent.person ? agent.person.name[0] : '🔑'}</span>
    <div>
      <h1 class="ndo-h1">{agent.person?.name ?? 'Unnamed agent'}</h1>
      <p class="ndo-mono mt-1">{agent.pubKey}</p>
      {#if agent.person?.bio}<p class="ndo-p mt-2">{agent.person.bio}</p>{/if}
      <div class="mt-3 flex flex-wrap gap-1.5">
        {#each agent.roles as role (role)}
          <NdoBadge variant="neutral" label={role} icon={false} />
        {/each}
      </div>
    </div>
  </header>

  <div class="stats">
    <div class="stat"><span class="n">{initiated.length}</span><span class="ndo-label">NDOs initiated</span></div>
    <div class="stat"><span class="n">{contributions.length}</span><span class="ndo-label">Contributions</span></div>
    <div class="stat"><span class="n">{validations.length}</span><span class="ndo-label">Validations given</span></div>
    <div class="stat"><span class="n">{custodies.length}</span><span class="ndo-label">Resources in custody</span></div>
  </div>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Reputation</h2></div>
    <div class="ndo-panel__body">
      <p class="ndo-small">
        Private Participation Receipts are private entries on this agent's own source chain. There
        is no global score and no third-party view. What you see above is what the DHT makes
        public: events, not judgements. An agent may choose to share a derived
        <code>ReputationSummary</code> with you — that is their disclosure, not the network's.
      </p>
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Initiated NDOs</h2></div>
    <div class="ndo-panel__body">
      {#if initiated.length === 0}
        <p class="ndo-small">None.</p>
      {:else}
        <ul class="list">
          {#each initiated as ndo (ndo.id)}
            <li>
              <a href={paths.ndoDetail(ndo.id)}>{ndo.name}</a>
              <NdoBadge stage={ndo.lifecycle_stage} />
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </section>
{/if}

<style>
  .avatar {
    width: 64px;
    height: 64px;
    border-radius: var(--ndo-radius-pill);
    background: rgb(var(--ndo-primary-100));
    color: rgb(var(--ndo-primary-700));
    display: grid;
    place-items: center;
    font-size: 1.5rem;
    font-weight: var(--ndo-weight-bold);
    flex-shrink: 0;
  }
  .stats { display: grid; gap: var(--ndo-spacing-3); grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
  .stat {
    background: rgb(var(--ndo-color-card-bg));
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-lg);
    padding: var(--ndo-spacing-4);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .n { font-size: var(--ndo-text-2xl); font-weight: var(--ndo-weight-bold); }
  .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .list li { display: flex; align-items: center; justify-content: space-between; gap: var(--ndo-spacing-3); }
  a { color: var(--ndo-color-link); }
  code { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); }
</style>
