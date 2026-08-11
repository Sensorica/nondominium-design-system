<script lang="ts">
  // ROOT prototype layout. Owns:
  //  - the screen-map overlay host ('m' shortcut, sidebar button)
  //  - the layer-level confirm modal and toast, driven by the state singleton
  //  - seeding and redirecting the joining guard
  // It renders NO chrome; (shell) and (gate) add their own.
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { appState } from '$lib/state.svelte';
  import { joining } from '$lib/guards/joining.svelte';
  import { PATH_TO_STATUS, ROUTE_KEY_TO_URL } from '$lib/app-nav';
  import type { JoiningStatus } from '$lib/guards/useJoiningGuard.svelte';
  import ScreenMapHost from '$lib/components/shared/ScreenMapHost.svelte';

  let { children }: { children: Snippet } = $props();

  // Cold-load seeding. A reviewer who deep-links a gate must see it fully
  // rendered, so the URL seeds the status it demonstrates. `seed` is idempotent
  // and `routeForStatus` is a fixed point, so this cannot fight the redirect
  // effect below. Seeding lives here rather than in the (gate) layout because
  // one of Nondominium's gates (the level-2 disclosure choice) renders inside
  // the shell.
  $effect(() => {
    const seedStatus = PATH_TO_STATUS[page.url.pathname];
    if (seedStatus) joining.seed(seedStatus);
  });

  // Forward redirect on status TRANSITIONS, never on the present state. The
  // guard owns "what state is this agent in"; the reviewer owns "which screen
  // am I looking at within that state". Redirecting on cold mount would break
  // every deep link.
  let lastStatus: JoiningStatus | null = null;
  $effect(() => {
    const status = joining.status;
    const target = ROUTE_KEY_TO_URL[joining.route];
    if (lastStatus === null) {
      lastStatus = status;
      return;
    }
    if (status !== lastStatus) {
      lastStatus = status;
      if (target && page.url.pathname !== target) goto(target);
    }
  });

  function closeConfirm() { appState.confirmModal = null; }
  function runConfirm() {
    appState.confirmModal?.onConfirm();
    appState.confirmModal = null;
  }
</script>

{@render children()}

<ScreenMapHost />

{#if appState.confirmModal}
  {@const target = appState.confirmModal}
  <div
    class="ndo-modal-backdrop"
    role="button"
    tabindex="-1"
    onclick={(e) => { if (e.target === e.currentTarget) closeConfirm(); }}
    onkeydown={(e) => e.key === 'Escape' && closeConfirm()}
  >
    <div class="ndo-modal" style="max-width:420px" role="dialog" aria-modal="true">
      <div class="ndo-modal__head">
        <h3 class="ndo-h3">⚠️ Confirm</h3>
      </div>
      <div class="ndo-modal__body">
        <p class="ndo-p">{target.message}</p>
        {#if target.detail}<p class="ndo-small">{target.detail}</p>{/if}
      </div>
      <div class="ndo-modal__foot">
        <button class="ndo-btn ndo-btn--ghost" onclick={closeConfirm}>Cancel</button>
        <button class="ndo-btn ndo-btn--destructive" onclick={runConfirm}>Confirm</button>
      </div>
    </div>
  </div>
{/if}

{#if appState.toast}
  {@const toast = appState.toast}
  <div class="toast" role="status">
    <span aria-hidden="true">{toast.kind === 'success' ? '✅' : toast.kind === 'error' ? '⚠️' : 'ℹ️'}</span>
    <span class="ndo-small">{toast.message}</span>
    <button class="dismiss" onclick={() => (appState.toast = null)} aria-label="Dismiss">✕</button>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 75;
    display: flex;
    align-items: center;
    gap: var(--ndo-spacing-2);
    padding: var(--ndo-spacing-2) var(--ndo-spacing-4);
    border-radius: var(--ndo-radius-pill);
    background: rgb(var(--ndo-gray-900));
    color: #fff;
    box-shadow: var(--ndo-shadow-lg);
  }
  .toast :global(.ndo-small) { color: #fff; }
  .dismiss { background: none; border: none; color: rgb(255 255 255 / 0.6); cursor: pointer; font: inherit; }
  .dismiss:hover { color: #fff; }
</style>
