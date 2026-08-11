<script lang="ts">
  // Creating a group provisions a clone cell, commits a GroupProfile to it,
  // joins it, and announces it on the Lobby DNA for discovery. The last two
  // steps are best-effort over a gossiping DHT, which is why the real client
  // reconciles membership every time a group is opened.
  import { goto } from '$app/navigation';
  import { paths } from '$lib/paths';
  import { createGroup, showToast } from '$lib/state.svelte';
  import Field from '$lib/components/shared/Field.svelte';

  let name = $state('');
  let description = $state('');

  function create() {
    if (!name.trim()) return;
    const group = createGroup(name.trim(), description.trim());
    showToast('success', `Created ${group.name}`);
    goto(paths.groupDetail(group.id));
  }
</script>

<header>
  <h1 class="ndo-h1">＋ Create a group</h1>
  <p class="ndo-p mt-2">A new network seed, a new cell, a new DHT. Nothing is shared with the lobby but the announcement.</p>
</header>

<section class="ndo-panel">
  <div class="ndo-panel__body flex flex-col gap-4">
    <Field label="Group name" required>
      {#snippet control()}<input class="ndo-input" bind:value={name} placeholder="Watershed Commons" />{/snippet}
    </Field>
    <Field label="Description" hint="One sentence. What is this group for?">
      {#snippet control()}<textarea class="ndo-textarea" bind:value={description}></textarea>{/snippet}
    </Field>
    <ol class="steps ndo-small">
      <li><code>createCloneCell</code> — provision the group cell with a fresh network seed</li>
      <li><code>create_group</code> — commit the GroupProfile to that cell</li>
      <li><code>join_group</code> — commit your own GroupMembership</li>
      <li><code>announce_group</code> — publish it on the Lobby DNA so others can find it</li>
    </ol>
  </div>
  <div class="ndo-modal__foot">
    <a class="ndo-btn ndo-btn--ghost" href={paths.groups()}>Cancel</a>
    <button class="ndo-btn ndo-btn--primary" onclick={create} disabled={!name.trim()}>Create group</button>
  </div>
</section>

<style>
  .steps { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; }
  code { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); }
</style>
