<script lang="ts">
  // How this works, in plain words.
  import Modal from './Modal.svelte';

  let { onclose }: { onclose: () => void } = $props();

  const ROWS: [string, string][] = [
    ['Groups', 'The communities you belong to. Each group lists the resources its members share. Invite others with a link.'],
    ['Resources', 'Something shared: a machine, a design, an artwork. Each one carries its own rules, wherever it goes.'],
    ['Items', 'The actual physical or digital things of a resource, and who holds each one right now.'],
    ['Requests', 'When you ask to borrow or receive an item. The holder completes it by handing the item over.'],
    ['Approvals', 'Other members check new items and requests. Nobody can approve their own.'],
    ['Receipts', 'Each time you help, you get a private receipt. Only you see them, and they build your reputation.'],
    ['Offline', 'Everything works offline. Your actions are saved on your device and shared when you reconnect.']
  ];
</script>

<Modal title="How this works" sub="Nondominium lets people share things without anyone owning or controlling them." {onclose} width={560}>
  <dl>
    {#each ROWS as [h, p] (h)}
      <dt>{h}</dt>
      <dd class="pu-muted">{p}</dd>
    {/each}
  </dl>
  <div class="pu-row pu-row--end"><button type="button" class="pu-btn" onclick={onclose}>Got it</button></div>
</Modal>

<style>
  dl {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 12px;
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
  }
  dt {
    font-weight: 700;
  }
  dd {
    margin: 0;
    font-size: 14px;
  }
</style>
