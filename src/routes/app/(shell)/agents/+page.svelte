<script lang="ts">
  // The agent directory. An agent with no Person entry still appears — as a
  // truncated key — because participation does not require identity here.
  import { paths } from '$lib/paths';
  import { appState } from '$lib/state.svelte';
  import NdoBadge from '$lib/components/shared/NdoBadge.svelte';
</script>

<header>
  <h1 class="ndo-h1">👤 Agents</h1>
  <p class="ndo-p mt-2">Everyone visible on this network, with the roles they hold.</p>
</header>

<div class="grid">
  {#each appState.agents as agent (agent.id)}
    <a class="ndo-card ndo-card--interactive" href={paths.agentProfile(agent.id)}>
      <div class="flex items-center gap-3">
        <span class="avatar" aria-hidden="true">{agent.person ? agent.person.name[0] : '🔑'}</span>
        <div>
          <h2 class="ndo-h3">{agent.person?.name ?? 'Unnamed agent'}</h2>
          <p class="ndo-mono">{agent.pubKey}</p>
        </div>
      </div>
      {#if agent.person?.bio}<p class="ndo-small mt-3">{agent.person.bio}</p>{/if}
      <div class="mt-3 flex flex-wrap gap-1.5">
        {#each agent.roles as role (role)}
          <NdoBadge variant="neutral" label={role} icon={false} />
        {/each}
      </div>
      {#if !agent.person}
        <p class="ndo-field__hint mt-3">No Person entry — browsing and membership only.</p>
      {/if}
    </a>
  {/each}
</div>

<style>
  .grid { display: grid; gap: var(--ndo-spacing-4); grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--ndo-radius-pill);
    background: rgb(var(--ndo-primary-100));
    color: rgb(var(--ndo-primary-700));
    display: grid;
    place-items: center;
    font-weight: var(--ndo-weight-bold);
    flex-shrink: 0;
  }
</style>
