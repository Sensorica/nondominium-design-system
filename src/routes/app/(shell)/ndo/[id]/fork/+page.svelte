<script lang="ts">
  // Fork is informational in the MVP (REQ-UI-NDO-05). The button exists to
  // explain the friction, not to perform it: forking a commons object is a
  // social act first, and the protocol deliberately does not make it one click.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { agentById, agentLabel, ndoById, showToast } from '$lib/state.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  const id = $derived(page.params.id ?? '');
  const ndo = $derived(ndoById(id));
  const initiator = $derived(ndo ? agentById(ndo.initiator) : null);

  async function copyKey() {
    if (!initiator) return;
    try {
      await navigator.clipboard.writeText(initiator.pubKey);
      showToast('success', 'Initiator key copied');
    } catch {
      showToast('error', 'Clipboard unavailable');
    }
  }
</script>

{#if !ndo}
  <EmptyState icon="🫥" title="No such NDO" />
{:else}
  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">🍴 Fork {ndo.name}</h2></div>
    <div class="ndo-panel__body flex flex-col gap-4">
      <p class="ndo-p">
        Anyone may fork. Nothing in the protocol prevents it, and nothing in the protocol makes it
        cheap either — that is the design.
      </p>

      <ol class="friction">
        <li>
          <strong>Negotiate first.</strong> A fork that nobody discussed splits the contributor pool
          and halves the value of both branches.
        </li>
        <li>
          <strong>Seek consensus in the group.</strong> Forks that carry the group with them keep the
          benefit redistribution agreement intact.
        </li>
        <li>
          <strong>Post-MVP: stake.</strong> Unyt integration will let a community require an economic
          stake behind a fork, so the cost of a frivolous one is borne by whoever proposes it.
        </li>
      </ol>

      <div class="ndo-card">
        <p class="ndo-label mb-2">Talk to the initiator</p>
        <p class="ndo-small">{agentLabel(ndo.initiator)}</p>
        <p class="ndo-mono mt-1">{initiator?.pubKey}</p>
        <button class="ndo-btn ndo-btn--ghost ndo-btn--sm mt-3" onclick={copyKey}>📋 Copy initiator key</button>
      </div>

      <p class="ndo-field__hint">
        Fork submission itself is post-MVP. When it lands, a fork will commit a new Layer 0 anchor
        with a <code>DerivedFrom</code> hard link back to this one, so attribution keeps flowing
        upstream.
      </p>
    </div>
    <div class="ndo-modal__foot">
      <a class="ndo-btn ndo-btn--ghost" href={paths.ndoDetail(id)}>Back to the NDO</a>
    </div>
  </section>
{/if}

<style>
  .friction { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: var(--ndo-spacing-2); font-size: var(--ndo-text-sm); }
  code { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); }
</style>
