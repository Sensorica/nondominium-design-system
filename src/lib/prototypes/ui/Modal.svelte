<script lang="ts">
  // The modal shell every shared modal uses (ui.jsx PModal). Escape and a
  // click on the backdrop close it.
  import type { Snippet } from 'svelte';
  import './proto.css';

  interface Props {
    title: string;
    sub?: string | null;
    onclose: () => void;
    width?: number;
    children: Snippet;
  }

  let { title, sub = null, onclose, width = 440, children }: Props = $props();

  function onkeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onclose();
  }
</script>

<svelte:window {onkeydown} />

<!-- The backdrop click is a pointer shortcut; Escape closes it from the keyboard. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="pu backdrop" onclick={(e) => { if (e.target === e.currentTarget) onclose(); }}>
  <div class="dialog" role="dialog" aria-modal="true" aria-label={title} style:width="{width}px">
    <header>
      <div class="titles">
        <h2>{title}</h2>
        {#if sub}<p class="pu-muted">{sub}</p>{/if}
      </div>
      <button class="pu-btn pu-btn--ghost pu-btn--sm" onclick={onclose} aria-label="Close">✕</button>
    </header>
    <div class="body">
      {@render children()}
    </div>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: var(--_overlay);
    backdrop-filter: blur(3px);
    display: grid;
    place-items: center;
    padding: 16px;
  }
  .dialog {
    max-width: 92vw;
    max-height: calc(100vh - 32px);
    overflow-x: hidden;
    overflow-y: auto;
    background: var(--_bg);
    color: var(--_ink);
    border: 1px solid var(--_line);
    border-radius: var(--_radius);
    box-shadow: var(--_shadow);
  }
  header {
    padding: 18px 22px 12px;
    border-bottom: 1px solid var(--_line);
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .titles {
    flex: 1;
    min-width: 0;
  }
  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
  .titles p {
    margin-top: 3px;
  }
  .body {
    padding: 16px 22px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
</style>
