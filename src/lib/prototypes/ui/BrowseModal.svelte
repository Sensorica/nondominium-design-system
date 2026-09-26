<script lang="ts">
  // Find resources. get_all_ndos · get_ndos_by_lifecycle_stage / _nature / _property_regime
  import Modal from './Modal.svelte';
  import Call from './Call.svelte';
  import { focusOnMount } from './attach';
  import { proto } from '../store/store.svelte';
  import { ENUM, STAGES } from '../store/logic';
  import { plain } from '../plain';

  interface Props {
    onclose: () => void;
    /** Called with the picked NDO's id. */
    onOpen?: (ndoId: string) => void;
  }

  let { onclose, onOpen }: Props = $props();

  let query = $state('');
  let group = $state('');
  let stage = $state('');
  let nature = $state('');
  let regime = $state('');

  const list = $derived(
    proto.s.ndos.filter(
      (n) =>
        (!query || (n.name + ' ' + n.desc).toLowerCase().includes(query.toLowerCase())) &&
        (!stage || n.stage === stage) &&
        (!nature || n.nature === nature) &&
        (!regime || n.regime === regime) &&
        (!group || n.group === group)
    )
  );
  const openCount = (id: string) => proto.q.openCommitments().filter((c) => c.ndo === id).length;
</script>

<Modal title="Find resources" sub="Everything shared in your groups." {onclose} width={620}>
  <Call c="get_all_ndos · get_ndos_by_lifecycle_stage / _nature / _property_regime" />
  <input class="pu-input" bind:value={query} placeholder="Search by name or description" aria-label="Search" {@attach focusOnMount} />
  <div class="pu-row">
    <select class="pu-select pu-select--inline" bind:value={group} aria-label="Group">
      <option value="">All groups</option>
      {#each proto.s.groups as g (g.id)}<option value={g.id}>{g.name}</option>{/each}
    </select>
    <select class="pu-select pu-select--inline" bind:value={stage} aria-label="Stage">
      <option value="">Any stage</option>
      {#each STAGES as x (x)}<option value={x}>{plain(x)}</option>{/each}
    </select>
    <select class="pu-select pu-select--inline" bind:value={nature} aria-label="Type">
      <option value="">Any type</option>
      {#each ENUM.nature as x (x)}<option value={x}>{plain(x)}</option>{/each}
    </select>
    <select class="pu-select pu-select--inline" bind:value={regime} aria-label="Ownership">
      <option value="">Any ownership</option>
      {#each ENUM.regime as x (x)}<option value={x}>{plain(x)}</option>{/each}
    </select>
  </div>
  <div class="pu-list">
    {#each list as n (n.id)}
      <button
        type="button"
        class="hit"
        onclick={() => {
          onOpen?.(n.id);
          onclose();
        }}
      >
        <strong>{n.name}</strong>
        <span class="pu-muted">
          {proto.q.group(n.group)?.name} · {plain(n.stage)} · {plain(n.regime)} · {plain(n.nature)} · {openCount(n.id)} open requests
        </span>
      </button>
    {:else}
      <p class="pu-muted">No resources match. Resources belong to groups: create or join one to see more.</p>
    {/each}
  </div>
</Modal>

<style>
  .hit {
    text-align: left;
    font: inherit;
    color: inherit;
    background: transparent;
    border: 1px solid var(--_line);
    border-radius: var(--_field-radius);
    padding: 9px 12px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .hit:hover {
    background: var(--_hover);
  }
  .hit strong {
    font-size: 14px;
  }
</style>
