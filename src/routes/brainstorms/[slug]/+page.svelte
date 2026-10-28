<script lang="ts">
  // One brainstorm board inside the site chrome. The board is the compiled
  // Niceboard page from static/brainstorms/boards/, framed; its comments go to the
  // site's drawer, one thread per board (`brainstorm:<slug>`, surface-keys.ts).
  import { paths } from '$lib/paths';
  import { comments } from '$lib/comments/comments.svelte';
  import { STAGE_LABEL, STATUS_LABEL, LANG_LABEL } from '$lib/brainstorms/labels';

  let { data } = $props();
  const b = $derived(data.brainstorm);
</script>

<svelte:head><title>{b.title} — Brainstorms — Nondominium Design System</title></svelte:head>

<div class="page">
  <div class="bar">
    <a class="back" href={paths.brainstorms()}>← Brainstorms</a>
    <div class="meta">
      <span class="badge">{STAGE_LABEL[b.lifecycle] ?? b.lifecycle}</span>
      <span class="status status-{b.status}">{STATUS_LABEL[b.status] ?? b.status}</span>
      <span class="date">{b.date}</span>
      {#if b.lang !== 'en'}<span class="lang">{LANG_LABEL[b.lang] ?? b.lang}</span>{/if}
    </div>
    <div class="actions">
      <button type="button" onclick={() => (comments.open = true)} title="Comment on this board (c)">💬 Comments</button>
      <a href={b.board} target="_blank" rel="noopener">Open full page ↗</a>
    </div>
  </div>
  <h1 class="sr">{b.title}</h1>
  <iframe src={b.board} title={b.title} lang={b.lang}></iframe>
</div>

<style>
  .page { display: flex; flex-direction: column; height: 100dvh; min-height: 520px; }
  /* Under 860px the layout's rail becomes a sticky top bar (brand + hamburger, ~52px). */
  @media (max-width: 860px) { .page { height: calc(100dvh - 52px); } }
  .bar { display: flex; flex-wrap: wrap; align-items: center; gap: var(--ndo-spacing-2) var(--ndo-spacing-4); padding: var(--ndo-spacing-2) var(--ndo-spacing-4); border-bottom: 1px solid var(--ndo-color-border); background: rgb(var(--ndo-color-card-bg)); color: var(--ndo-color-text-primary); font-size: var(--ndo-text-sm); }
  .back { color: var(--ndo-color-link); text-decoration: none; font-weight: var(--ndo-weight-medium); }
  .meta { display: flex; flex-wrap: wrap; align-items: center; gap: var(--ndo-spacing-3); flex: 1; min-width: 0; }
  .badge { font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-bold); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ndo-color-link); }
  .status { font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-semibold); border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-pill); padding: 1px 8px; }
  .status-decided { border-color: rgb(var(--ndo-green-600)); color: rgb(var(--ndo-green-600)); }
  .status-archived { color: var(--ndo-color-text-muted); }
  .date, .lang { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); }
  .actions { display: flex; gap: var(--ndo-spacing-2); }
  .actions button, .actions a { font: inherit; font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-medium); color: var(--ndo-color-text-primary); background: transparent; border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-pill); padding: 3px 12px; cursor: pointer; text-decoration: none; white-space: nowrap; }
  .actions button:hover, .actions a:hover { border-color: rgb(var(--ndo-primary-600)); }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  iframe { flex: 1; width: 100%; border: 0; background: rgb(var(--ndo-color-card-bg)); }
</style>
