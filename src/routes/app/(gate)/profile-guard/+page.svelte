<script lang="ts">
  // Level 3 gate. An agent hit a DHT write without a Person entry. The screen
  // names what they were doing, because a refusal without a subject is the most
  // frustrating screen in any app.
  import { goto } from '$app/navigation';
  import { paths } from '$lib/paths';
  import { appState, ME_ID, agentById } from '$lib/state.svelte';
  import { joining } from '$lib/guards/joining.svelte';

  const me = $derived(agentById(ME_ID));

  function commitPerson() {
    const agent = agentById(ME_ID);
    if (agent) agent.person = { name: appState.profile?.realName ?? appState.profile?.nickname ?? 'Anonymous', bio: appState.profile?.bio };
    joining.completePerson();
    goto(paths.appHome());
  }
</script>

<header>
  <h1 class="ndo-h2">🪪 This needs a Person entry</h1>
  <p class="ndo-small mt-2">
    Level 3 of three. Browsing and group membership cost nothing. Writing to the DHT commits a
    permanent, public <code>Person</code> entry to your source chain — it cannot be deleted later.
  </p>
</header>

{#if joining.blockedIntent}
  <div class="ndo-card" style="background:rgb(var(--ndo-amber-50));border-color:rgb(var(--ndo-amber-100))">
    <p class="ndo-small">You were about to: <strong>{joining.blockedIntent}</strong></p>
  </div>
{/if}

<ul class="ladder">
  <li class="done">✅ Level 1 — lobby profile as <strong>{appState.profile?.nickname ?? 'anonymous'}</strong></li>
  <li class="done">✅ Level 2 — group membership and disclosure choice</li>
  <li class="todo">⬜ Level 3 — <strong>Person</strong> entry, public and permanent</li>
</ul>

<div class="flex items-center justify-between gap-3">
  <a class="ndo-small" href={paths.appHome()}>Not yet</a>
  <button class="ndo-btn ndo-btn--primary" onclick={commitPerson}>
    Create my Person entry{me?.pubKey ? ` (${me.pubKey})` : ''}
  </button>
</div>

<style>
  .ladder { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .ladder li { font-size: var(--ndo-text-sm); }
  .done { color: var(--ndo-color-text-secondary); }
  .todo { color: var(--ndo-color-text-primary); font-weight: var(--ndo-weight-medium); }
  code { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); }
</style>
