<script lang="ts">
  // Joining by invite link. The link is a base64 payload of network seed, DNA
  // hash and group name; pasting it provisions the same-seed clone.
  import { goto } from '$app/navigation';
  import { paths } from '$lib/paths';
  import { appState, joinGroup, showToast } from '$lib/state.svelte';

  let code = $state('');
  let error = $state('');

  const knownIds = $derived(appState.groups.map((g) => g.id));

  function join() {
    const id = code.trim();
    if (!knownIds.includes(id)) {
      error = 'No group with that seed is announced on this lobby.';
      return;
    }
    joinGroup(id);
    showToast('success', 'Joined');
    goto(paths.groupProfile(id));
  }
</script>

<header>
  <h1 class="ndo-h1">🔑 Join a group</h1>
  <p class="ndo-p mt-2">Paste an invite link, or pick one of the groups announced on this lobby.</p>
</header>

<section class="ndo-panel">
  <div class="ndo-panel__body flex flex-col gap-4">
    <label class="ndo-field">
      <span class="ndo-field__label">Invite link or network seed</span>
      <input class="ndo-input" bind:value={code} placeholder="gr2" onkeydown={(e) => e.key === 'Enter' && join()} />
      {#if error}<span class="ndo-field__error">⚠️ {error}</span>{/if}
    </label>

    <div>
      <p class="ndo-label mb-2">Announced on this lobby</p>
      <ul class="list">
        {#each appState.groups as group (group.id)}
          <li>
            <span>
              <strong>{group.name}</strong>
              <span class="ndo-mono"> {group.networkSeed}</span>
            </span>
            <a class="ndo-btn ndo-btn--ghost ndo-btn--sm" href={paths.inviteLanding(group.id)}>Open invite</a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
  <div class="ndo-modal__foot">
    <a class="ndo-btn ndo-btn--ghost" href={paths.groups()}>Cancel</a>
    <button class="ndo-btn ndo-btn--primary" onclick={join} disabled={!code.trim()}>Join</button>
  </div>
</section>

<style>
  .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .list li { display: flex; align-items: center; justify-content: space-between; gap: var(--ndo-spacing-3); font-size: var(--ndo-text-sm); }
</style>
