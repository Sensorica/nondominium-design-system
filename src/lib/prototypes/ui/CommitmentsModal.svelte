<script lang="ts">
  // Requests, on one resource or across your groups. get_all_commitments ·
  // claim_commitment. Marking one done runs [transfer_custody →]
  // log_economic_event → claim_commitment → issue_participation_receipts.
  import Modal from './Modal.svelte';
  import Call from './Call.svelte';
  import ErrorNote from './ErrorNote.svelte';
  import AgentAvatar from './AgentAvatar.svelte';
  import { modals } from './modals.svelte';
  import { proto } from '../store/store.svelte';
  import type { Ndo } from '../store/logic';
  import { plain, developer } from '../plain';

  let { ndo = null, onclose }: { ndo?: Ndo | null; onclose: () => void } = $props();

  const list = $derived(ndo ? proto.q.commitmentsOf(ndo.id) : proto.s.commitments);
  let error = $state<string | null>(null);

  function fulfil(id: string) {
    const r = proto.actions.fulfil(id);
    error = r.ok ? null : r.error;
  }
</script>

<Modal title="Requests" sub={ndo ? ndo.name : 'Across your groups'} {onclose} width={560}>
  <Call c="get_all_commitments · claim_commitment" />
  {#each list as c (c.id)}
    <div class="pu-card req" class:req--done={c.status !== 'open'}>
      <span class="faces"><AgentAvatar id={c.provider} size={26} /><span class="second"><AgentAvatar id={c.receiver} size={26} ring /></span></span>
      <div class="what">
        <strong>{plain(c.action)}</strong>
        <span class="pu-muted">
          {proto.q.agent(c.provider)} → {proto.q.agent(c.receiver)}{!ndo ? ' · ' + (proto.q.ndo(c.ndo)?.name ?? '') : ''}
        </span>
        {#if c.note}<p class="pu-muted">{c.note}</p>{/if}
      </div>
      {#if c.status === 'open'}
        <button type="button" class="pu-btn pu-btn--sm" onclick={() => fulfil(c.id)}>{$developer ? 'Fulfil' : 'Mark as done'}</button>
      {:else}
        <span class="pu-muted">done</span>
      {/if}
    </div>
  {:else}
    <p class="pu-muted">No requests yet.</p>
  {/each}
  <p class="pu-muted">
    {$developer
      ? 'Fulfil runs [transfer_custody →] log_economic_event → claim_commitment → issue_participation_receipts.'
      : 'Complete a request when it has happened. Both people get a private receipt.'}
  </p>
  <ErrorNote {error} />
  {#if ndo}
    <div class="pu-row pu-row--end">
      <button type="button" class="pu-btn pu-btn--ghost" onclick={() => modals.open({ type: 'commit', ndo: ndo.id })}>+ New request</button>
    </div>
  {/if}
</Modal>

<style>
  .req {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .req--done {
    opacity: 0.6;
  }
  .faces {
    display: inline-flex;
  }
  .second {
    margin-left: -8px;
  }
  .what {
    flex: 1;
    min-width: 0;
  }
  .what strong {
    font-size: 14px;
    margin-right: 6px;
  }
</style>
