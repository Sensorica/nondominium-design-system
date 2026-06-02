<svelte:head><title>Modal — Playbook</title></svelte:head>

<script lang="ts">
  import { Modal, NdoButton } from '@nondominium/ndo-ui';

  let open = $state(false);
</script>

<h1 class="text-xl font-bold text-gray-900 mb-1">Modal</h1>
<p class="text-sm text-gray-600 mb-6">
  Shared overlay pattern from hApp modals:
  <code class="font-mono">fixed inset-0 z-50 bg-black/40 backdrop-blur-sm</code>.
</p>

<section class="specimen-section">
  <h2 class="specimen-heading">Demo</h2>
  <NdoButton variant="primary" onclick={() => { open = true; }}>Open modal</NdoButton>
</section>

{#if open}
  <Modal
    title="Example modal"
    subtitle="Matches NdoCreateModal, UserProfileForm, LifecycleTransitionModal shell"
    onclose={() => { open = false; }}
    maxWidth="md"
  >
    {#snippet children()}
      <p class="text-sm text-gray-600">
        Body content scrolls inside <code class="font-mono">max-h-[70vh]</code>.
        Footer actions are optional via the <code class="font-mono">footer</code> snippet.
      </p>
    {/snippet}
    {#snippet footer()}
      <NdoButton variant="ghost" onclick={() => { open = false; }}>Cancel</NdoButton>
      <NdoButton variant="primary" onclick={() => { open = false; }}>Confirm</NdoButton>
    {/snippet}
  </Modal>
{/if}

<section class="specimen-section">
  <h2 class="specimen-heading">hApp sources</h2>
  <ul class="text-sm text-gray-600 list-disc pl-5 space-y-1">
    <li><code class="font-mono">group/NdoCreateModal.svelte</code></li>
    <li><code class="font-mono">lobby/UserProfileForm.svelte</code> (modal mode)</li>
    <li><code class="font-mono">ndo/LifecycleTransitionModal.svelte</code></li>
    <li><code class="font-mono">ndo/ForkNdoModal.svelte</code></li>
  </ul>
</section>

<style>
  .specimen-section { margin-bottom: 2rem; }
  .specimen-heading {
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgb(var(--ndo-gray-500));
    margin: 0 0 0.75rem;
  }
</style>
