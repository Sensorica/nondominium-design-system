<script lang="ts">
  import Specimen from '$lib/components/shared/Specimen.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  let showModal = $state(false);
  let showToast = $state(false);
</script>

<header>
  <h1 class="ndo-h1">🖼️ Shell</h1>
  <p class="ndo-p mt-2" style="max-width:62ch">
    The frame every prototype screen sits in: a dark rail at a fixed 240px, a content column capped
    at 1200px, and the two layer-level surfaces — the confirm modal and the toast — that the app
    layout renders once for the whole subtree.
  </p>
</header>

<Specimen
  title="Grid"
  note="Rail plus content, collapsing to a single column below 860px. The rail is sticky and scrolls independently."
  code={`<div class="ndo-shell">
  <Sidebar />
  <main class="ndo-shell__main">
    <div class="ndo-shell__content">…</div>
  </main>
</div>`}
>
  {#snippet demo()}
    <div class="mini">
      <div class="mini__rail"><span>rail 240px</span></div>
      <div class="mini__main"><span>content, max 1200px, 24px gap between sections</span></div>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Empty state"
  note="One icon, one sentence, and an action only when an action would resolve it."
  code={`<EmptyState icon="🧿" title="No NDOs in this group yet" body="Create the first one." />`}
>
  {#snippet demo()}
    <div style="width:100%">
      <EmptyState icon="🧿" title="No NDOs in this group yet" body="Create the first one.">
        {#snippet action()}
          <button class="ndo-btn ndo-btn--primary">➕ New NDO</button>
        {/snippet}
      </EmptyState>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Confirm modal"
  note="Rendered once by the app layout and driven from the state singleton, so any screen can raise one without owning a dialog."
  code={`openConfirm('Declare end of life?', () => recordTransition(id, 'EndOfLife'));`}
>
  {#snippet demo()}
    <button class="ndo-btn ndo-btn--ghost" onclick={() => (showModal = true)}>Show the modal</button>
  {/snippet}
</Specimen>

<Specimen
  title="Toast"
  note="Confirmation of something that already happened. It never asks a question and never blocks."
  code={`showToast('success', 'Created Community Solar Array');`}
>
  {#snippet demo()}
    <button class="ndo-btn ndo-btn--ghost" onclick={() => { showToast = true; setTimeout(() => (showToast = false), 2200); }}>
      Show a toast
    </button>
  {/snippet}
</Specimen>

{#if showModal}
  <div class="ndo-modal-backdrop" role="button" tabindex="-1"
    onclick={(e) => { if (e.target === e.currentTarget) showModal = false; }}
    onkeydown={(e) => e.key === 'Escape' && (showModal = false)}>
    <div class="ndo-modal" style="max-width:420px" role="dialog" aria-modal="true">
      <div class="ndo-modal__head"><h3 class="ndo-h3">⚠️ Confirm</h3></div>
      <div class="ndo-modal__body">
        <p class="ndo-p">Declare end of life for Community Solar Array?</p>
        <p class="ndo-small">The identity anchor stays as a permanent tombstone.</p>
      </div>
      <div class="ndo-modal__foot">
        <button class="ndo-btn ndo-btn--ghost" onclick={() => (showModal = false)}>Cancel</button>
        <button class="ndo-btn ndo-btn--destructive" onclick={() => (showModal = false)}>Confirm</button>
      </div>
    </div>
  </div>
{/if}

{#if showToast}
  <div class="toast" role="status">
    <span aria-hidden="true">✅</span>
    <span class="ndo-small">Created Community Solar Array</span>
  </div>
{/if}

<style>
  .mini { display: grid; grid-template-columns: 90px 1fr; width: 100%; height: 140px; border-radius: var(--ndo-radius-lg); overflow: hidden; border: 1px solid var(--ndo-color-border); }
  .mini__rail { background: rgb(var(--ndo-gray-900)); color: rgb(255 255 255 / 0.6); display: grid; place-items: center; font-size: var(--ndo-text-xs); }
  .mini__main { background: var(--ndo-color-bg-app); display: grid; place-items: center; padding: 12px; text-align: center; font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); }
  .toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 75;
    display: flex; align-items: center; gap: var(--ndo-spacing-2);
    padding: var(--ndo-spacing-2) var(--ndo-spacing-4);
    border-radius: var(--ndo-radius-pill); background: rgb(var(--ndo-gray-900)); color: #fff;
    box-shadow: var(--ndo-shadow-lg);
  }
  .toast :global(.ndo-small) { color: #fff; }
</style>
