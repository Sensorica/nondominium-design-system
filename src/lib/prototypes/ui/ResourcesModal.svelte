<script lang="ts">
  // Items and who holds them. Per item: update_operational_state and
  // transfer_custody (custodian only), log_economic_event, and
  // create_validation_receipt for someone else's item. New items:
  // create_economic_resource (starts PendingValidation, you hold it).
  import Modal from './Modal.svelte';
  import Field from './Field.svelte';
  import ErrorNote from './ErrorNote.svelte';
  import AgentAvatar from './AgentAvatar.svelte';
  import { proto, type Result } from '../store/store.svelte';
  import { AGENTS, ENUM, type Ndo } from '../store/logic';
  import { plain, developer } from '../plain';

  let { ndo, onclose }: { ndo: Ndo; onclose: () => void } = $props();

  const items = $derived(proto.s.instances[ndo.id] ?? []);
  const agents = Object.keys(AGENTS);
  let newState = $state<Record<number, string>>({});
  let handTo = $state<Record<number, string>>({});
  let event = $state<Record<number, string>>({});
  let label = $state('');
  let error = $state<string | null>(null);

  function show(r: Result<unknown>) {
    error = r.ok ? null : r.error;
    return r.ok;
  }
</script>

<Modal
  title="Items and who holds them"
  sub={'The actual items of ' + ndo.name + '. Only the current holder can hand one over or change its status.'}
  {onclose}
  width={560}
>
  {#each items as [itemLabel, state, holder], i (i)}
    <div class="pu-card item">
      <div class="pu-row">
        <AgentAvatar id={holder} size={22} />
        <strong>{itemLabel}</strong>
        <span class="pu-muted">
          {plain(state)} · held by {proto.q.agent(holder)}{holder === proto.me.id ? ' (you)' : ''}
        </span>
      </div>
      <div class="pu-row">
        <select class="pu-select pu-select--inline" bind:value={newState[i]} aria-label="New status">
          <option value="">New status…</option>
          {#each ENUM.opstate.filter((x) => x !== state) as x (x)}<option value={x}>{plain(x)}</option>{/each}
        </select>
        <button
          type="button"
          class="pu-btn pu-btn--ghost pu-btn--sm"
          disabled={!newState[i]}
          onclick={() => show(proto.actions.setOpState(ndo.id, i, newState[i]))}
          >{$developer ? 'update_operational_state' : 'Change status'}</button
        >
        <select class="pu-select pu-select--inline" bind:value={handTo[i]} aria-label="Hand over to">
          <option value="">Hand over to…</option>
          {#each agents.filter((a) => a !== holder) as a (a)}<option value={a}>{proto.q.agent(a)}</option>{/each}
        </select>
        <button
          type="button"
          class="pu-btn pu-btn--sm"
          disabled={!handTo[i]}
          onclick={() => show(proto.actions.transferCustody(ndo.id, i, handTo[i]))}
          >{$developer ? 'transfer_custody' : 'Hand over'}</button
        >
        <select class="pu-select pu-select--inline" bind:value={event[i]} aria-label="Something happened">
          <option value="">Something happened…</option>
          {#each ['Use', 'Work', 'Modify', 'Move', 'Cite'] as x (x)}<option value={x}>{plain(x)}</option>{/each}
        </select>
        <button
          type="button"
          class="pu-btn pu-btn--ghost pu-btn--sm"
          disabled={!event[i]}
          onclick={() => show(proto.actions.logEvent(ndo.id, i, event[i]))}
          >{$developer ? 'log_economic_event' : 'Record'}</button
        >
        {#if holder !== proto.me.id && state === 'PendingValidation'}
          <button
            type="button"
            class="pu-btn pu-btn--ghost pu-btn--sm"
            onclick={() => show(proto.actions.validate(ndo.id + ':' + i, ndo.id))}
            >{$developer ? 'create_validation_receipt' : 'Approve'}</button
          >
        {/if}
      </div>
    </div>
  {:else}
    <p class="pu-muted">No items yet.</p>
  {/each}
  <Field
    label="New item"
    hint={$developer
      ? 'create_economic_resource · starts PendingValidation with you as custodian'
      : 'It starts waiting for approval, with you holding it.'}
  >
    <div class="pu-row new">
      <input class="pu-input" bind:value={label} placeholder="e.g. Spare spindle" />
      <button
        type="button"
        class="pu-btn"
        onclick={() => {
          if (show(proto.actions.addInstance(ndo.id, label))) label = '';
        }}>Create</button
      >
    </div>
  </Field>
  <ErrorNote {error} />
</Modal>

<style>
  .item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .item strong {
    font-size: 14px;
  }
  .new {
    flex-wrap: nowrap;
  }
</style>
