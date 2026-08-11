<script lang="ts">
  import type { GroupDescriptor } from '../../../domain/types.js';
  import { getAvailableGroupsForAssociation } from '../../../domain/ndo-associations.js';
  import Modal from '../../primitives/Modal.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';

  interface Props {
    ndoName: string;
    groups: GroupDescriptor[];
    associatedGroupIds?: string[];
    isLoading?: boolean;
    onclose: () => void;
    onconfirm: (groupIds: string[]) => void | Promise<void>;
  }

  let {
    ndoName,
    groups,
    associatedGroupIds = [],
    isLoading = false,
    onclose,
    onconfirm
  }: Props = $props();

  let selected = $state<Set<string>>(new Set());
  let saved = $state(false);
  let saving = $state(false);

  const availableGroups = $derived(
    getAvailableGroupsForAssociation(groups, associatedGroupIds)
  );

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    selected = next;
  }

  async function handleConfirm() {
    if (selected.size === 0 || saved || saving) return;
    saving = true;
    try {
      await onconfirm([...selected]);
      saved = true;
      setTimeout(onclose, 600);
    } finally {
      saving = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onclose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<Modal
  title="Associate with a group"
  subtitle={`Add "${ndoName}" to one of your groups so group members can find and join it.`}
  maxWidth="sm"
>
  {#snippet children()}
    {#if isLoading}
      <p class="text-sm text-gray-400 italic">Loading groups…</p>
    {:else if groups.length === 0}
      <p class="text-sm text-gray-400 italic">
        You have no groups yet. Create one from the sidebar.
      </p>
    {:else if availableGroups.length === 0}
      <p class="text-sm text-gray-400 italic">
        This NDO is already associated with all your groups.
      </p>
    {:else}
      <ul class="space-y-1">
        {#each availableGroups as g (g.id)}
          <li>
            <label
              class="flex cursor-pointer items-center gap-2.5 rounded px-2 py-1.5 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selected.has(g.id)}
                onchange={() => toggle(g.id)}
                class="h-4 w-4 rounded border-gray-300 accent-blue-600"
              />
              <span class="text-sm text-gray-800">{g.name}</span>
            </label>
          </li>
        {/each}
      </ul>
    {/if}
  {/snippet}
  {#snippet footer()}
    <NdoButton variant="ghost" onclick={onclose}>Cancel</NdoButton>
    <NdoButton
      variant="primary"
      disabled={selected.size === 0 || saved || saving || availableGroups.length === 0}
      onclick={handleConfirm}
    >
      {#if saved}
        Saved!
      {:else if saving}
        Saving…
      {:else}
        Add to {selected.size || ''} group{selected.size !== 1 ? 's' : ''}
      {/if}
    </NdoButton>
  {/snippet}
</Modal>
