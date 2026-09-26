<script lang="ts">
  // Your private receipts and the reputation derived from them.
  // get_my_participation_claims · derive_reputation_summary
  import Modal from './Modal.svelte';
  import Call from './Call.svelte';
  import { proto } from '../store/store.svelte';
  import { plain } from '../plain';

  let { onclose }: { onclose: () => void } = $props();

  const rep = $derived(proto.q.reputation());
  const LABEL: Record<string, string> = {
    total_claims: 'receipts',
    custody_claims: 'hand-overs',
    service_claims: 'services',
    governance_claims: 'approvals',
    creation_claims: 'created'
  };
</script>

<Modal
  title="Your receipts"
  sub="Each time you help, you get a private receipt. Only you can see them, and you choose what to share."
  {onclose}
  width={520}
>
  <Call c="get_my_participation_claims · derive_reputation_summary" />
  <p class="pu-sec">Your reputation so far</p>
  <div class="stats">
    {#each Object.entries(rep) as [k, v] (k)}
      <div class="pu-card stat" title={k}><strong>{v}</strong><span class="pu-muted">{LABEL[k]}</span></div>
    {/each}
  </div>
  <div class="pu-list">
    {#each proto.s.receipts as r (r.id)}
      <div class="row"><span>◆ {r.text}</span><span class="pu-muted">{plain(r.type) || 'Receipt'}</span></div>
    {:else}
      <p class="pu-muted">None yet. Complete a request or pick up a suggestion.</p>
    {/each}
  </div>
</Modal>

<style>
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
    gap: 6px;
  }
  .stat {
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }
  .stat strong {
    font-size: 20px;
  }
  .stat span {
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .row {
    display: flex;
    gap: 10px;
    font-size: 13px;
    border-bottom: 1px solid var(--_line);
    padding: 6px 0;
  }
  .row span:first-child {
    flex: 1;
  }
</style>
