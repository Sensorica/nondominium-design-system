<script lang="ts">
  // Every branch on the repo and the Cloudflare preview it deploys to. Read
  // from GitHub in the browser, so a branch appears here as soon as it is
  // pushed, with no list to maintain. See docs/PREVIEWS.md.
  import { onMount } from 'svelte';
  import { loadPreviews, REPO, type BranchPreview } from '$lib/previews';

  let rows = $state<BranchPreview[] | null>(null);
  let error = $state('');

  async function load() {
    error = '';
    rows = null;
    try {
      rows = await loadPreviews();
    } catch (e) {
      error = e instanceof Error ? e.message : 'GitHub could not be reached.';
    }
  }

  onMount(load);

  const host = (url: string) => url.replace(/^https:\/\//, '');
  const ago = (iso: string) => {
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
    return days <= 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`;
  };
</script>

<svelte:head><title>Branch previews — Nondominium Design System</title></svelte:head>

<main class="previews">
  <header>
    <h1 class="ndo-h1">Branch previews</h1>
    <p class="lede">
      Every branch pushed to <a href="https://github.com/{REPO}">{REPO}</a> is built and published on its own address, so work in progress can be opened and compared before it is merged. Push a branch and it shows up here once its deploy finishes, usually within two minutes.
    </p>
  </header>

  {#if error}
    <div class="empty" role="alert">
      <p>{error}</p>
      <button onclick={load}>Try again</button>
    </div>
  {:else if rows === null}
    <p class="empty" aria-busy="true">Reading the branches from GitHub…</p>
  {:else}
    <ul class="list">
      {#each rows as r (r.name)}
        <li class="item" class:prod={r.production} class:pr={!!r.pr}>
          <div class="top">
            <code class="branch">{r.name}</code>
            {#if r.production}<span class="badge">production</span>{/if}
            {#if r.pr?.draft}<span class="badge muted">draft</span>{/if}
            <a class="sha" href="https://github.com/{REPO}/commit/{r.sha}">{r.sha.slice(0, 7)}</a>
          </div>
          {#if r.pr}
            <p class="title"><a href={r.pr.url}>#{r.pr.number} {r.pr.title}</a></p>
            <p class="meta">{r.pr.author} · updated {ago(r.pr.updatedAt)}</p>
          {:else if !r.production}
            <p class="meta">No open pull request.</p>
          {/if}
          <a class="open" href={r.url}>{host(r.url)} ↗</a>
        </li>
      {/each}
    </ul>
    <p class="note">
      A branch pushed before branch previews existed has no preview until its next push. A pull request from a fork has no preview, because its branch lives on the fork.
    </p>
  {/if}
</main>

<style>
  .previews { max-width: 860px; margin: 0 auto; padding: var(--ndo-spacing-8) var(--ndo-spacing-6) 5rem; color: var(--ndo-color-text-primary); font-size: var(--ndo-text-base); line-height: var(--ndo-lh-base); }
  .lede { color: var(--ndo-color-text-secondary); max-width: 640px; margin: var(--ndo-spacing-1) 0 var(--ndo-spacing-6); }
  a { color: var(--ndo-color-link); }
  .empty { margin-top: var(--ndo-spacing-6); padding: var(--ndo-spacing-5); border: 1px dashed var(--ndo-color-border-strong); border-radius: var(--ndo-radius-lg); color: var(--ndo-color-text-secondary); }
  .empty p { margin: 0 0 var(--ndo-spacing-3); }
  .empty button { font: inherit; font-size: var(--ndo-text-sm); color: var(--ndo-color-text-primary); background: rgb(var(--ndo-color-card-bg)); border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-pill); padding: 3px 14px; cursor: pointer; }
  .list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  .item { padding: var(--ndo-spacing-4) var(--ndo-spacing-5); background: rgb(var(--ndo-color-card-bg)); border: 1px solid var(--ndo-color-border); border-left: 4px solid var(--ndo-color-border-strong); border-radius: var(--ndo-radius-lg); }
  .item.pr { border-left-color: rgb(var(--ndo-primary-500)); }
  .item.prod { border-left-color: rgb(var(--ndo-green-600)); }
  .top { display: flex; flex-wrap: wrap; gap: var(--ndo-spacing-3); align-items: center; }
  .branch { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-semibold); }
  .badge { font-size: var(--ndo-text-xs); font-weight: var(--ndo-weight-bold); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ndo-color-link); }
  .badge.muted { color: var(--ndo-color-text-muted); }
  .sha { margin-left: auto; font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); }
  .title { font-size: var(--ndo-text-lg); line-height: var(--ndo-lh-lg); font-weight: var(--ndo-weight-bold); margin: var(--ndo-spacing-1) 0 0; }
  .title a { color: inherit; text-decoration: none; }
  .title a:hover { text-decoration: underline; }
  .meta { margin: 2px 0 0; font-size: var(--ndo-text-sm); color: var(--ndo-color-text-secondary); }
  .open { display: inline-block; margin-top: var(--ndo-spacing-2); font-family: var(--ndo-font-mono); font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-semibold); }
  .note { margin-top: var(--ndo-spacing-6); font-size: var(--ndo-text-sm); color: var(--ndo-color-text-muted); }
</style>
