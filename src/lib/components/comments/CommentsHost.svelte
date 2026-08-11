<script lang="ts">
  // The comments overlay: a right-side drawer plus a floating trigger.
  // Mounted ONCE at the true root so it covers the prototype app, the
  // scenarios, and the playbook alike. Scenarios carry no uniform chrome, so
  // the floating button is the single entry point; there is no per-page wiring.
  import { page } from '$app/state';
  import { comments, clearToken } from '$lib/comments/comments.svelte';
  import { findDiscussion, validateToken } from '$lib/comments/github-client';
  import { surfaceKeyForPath, labelForKey } from '$lib/surface-keys';
  import CommentsSetup from './CommentsSetup.svelte';
  import CommentsList from './CommentsList.svelte';
  import CommentsCompose from './CommentsCompose.svelte';
  import type { Comment } from '$lib/comments/comments-types';

  const currentKey = $derived(surfaceKeyForPath(page.url.pathname));
  const label = $derived(currentKey ? labelForKey(currentKey) : '');
  const count = $derived(comments.thread?.comments.length ?? 0);

  // Validate a stored token on mount, so a returning reviewer never sees the
  // setup card twice.
  $effect(() => {
    const token = comments.token;
    if (!token || comments.enabled) return;
    let cancelled = false;
    validateToken(token).then((r) => {
      if (cancelled) return;
      if (r.ok) {
        comments.viewerLogin = r.value;
        comments.enabled = true;
      } else if (r.error.kind === 'auth') {
        comments.enabled = false;
      }
    });
    return () => { cancelled = true; };
  });

  // Load the thread whenever the surface changes.
  let lastLoadedKey = '';
  $effect(() => {
    const key = currentKey;
    const token = comments.token;
    if (!key || !token || !comments.enabled) {
      comments.thread = null;
      lastLoadedKey = '';
      return;
    }
    if (key === lastLoadedKey) return;
    lastLoadedKey = key;
    let cancelled = false;
    comments.loading = true;
    comments.error = null;
    findDiscussion(key, token).then((r) => {
      if (cancelled) return;
      comments.loading = false;
      if (r.ok) {
        comments.thread = r.value;
      } else {
        comments.error = r.error;
        if (r.error.kind === 'auth') {
          comments.enabled = false;
          comments.thread = null;
        }
      }
    });
    return () => { cancelled = true; };
  });

  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'c' || e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag && ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    comments.open = !comments.open;
  }

  function appendComment(c: Comment) {
    if (comments.thread) {
      comments.thread = { ...comments.thread, comments: [...comments.thread.comments, c] };
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<button
  class="fab"
  class:fab--on={comments.open}
  title="Comments (c)"
  aria-label="Comments"
  onclick={() => (comments.open = !comments.open)}
>
  💬
  {#if count > 0}<span class="fab__badge">{count}</span>{/if}
</button>

{#if comments.open}
  <div class="drawer" role="dialog" aria-label="Comments" aria-modal="false">
    <header class="drawer__head">
      <div>
        <h3 class="ndo-h3">💬 Comments</h3>
        <p class="ndo-small">{label || 'No commentable surface here'}</p>
      </div>
      <div class="drawer__actions">
        {#if comments.enabled}
          <button class="ndo-btn ndo-btn--ghost ndo-btn--sm" onclick={clearToken}>Log out</button>
        {/if}
        <button class="ndo-btn ndo-btn--ghost ndo-btn--sm" onclick={() => (comments.open = false)} aria-label="Close">✕</button>
      </div>
    </header>

    <div class="drawer__body">
      {#if !comments.token || !comments.enabled}
        <CommentsSetup />
      {:else if !currentKey}
        <p class="ndo-small" style="color:var(--ndo-color-text-muted)">
          This page has no surface key. Open an app screen or a scenario.
        </p>
      {:else if comments.loading}
        <p class="ndo-small">⏳ Loading…</p>
      {:else if comments.error}
        <p class="ndo-field__error">
          ⚠️ {comments.error.kind === 'auth'
            ? 'Token rejected.'
            : 'message' in comments.error
              ? comments.error.message
              : comments.error.kind}
        </p>
        <CommentsSetup />
      {:else}
        <CommentsList comments={comments.thread?.comments ?? []} token={comments.token}>
          {#snippet replyForm({ parentId })}
            <CommentsCompose
              surfaceKey={currentKey}
              {label}
              token={comments.token}
              {parentId}
              onPosted={appendComment}
            />
          {/snippet}
        </CommentsList>

        <div class="drawer__compose">
          <CommentsCompose surfaceKey={currentKey} {label} token={comments.token} onPosted={appendComment} />
        </div>

        {#if comments.thread}
          <a class="gh" href={comments.thread.url} target="_blank" rel="noreferrer">
            View or moderate on GitHub →
          </a>
        {/if}
      {/if}
    </div>
  </div>
{/if}

<style>
  .fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 60;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 22px;
    line-height: 1;
    background: rgb(var(--ndo-primary-600));
    color: #fff;
    box-shadow: var(--ndo-shadow-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--ndo-duration-base), background var(--ndo-duration-base);
  }
  .fab:hover { background: rgb(var(--ndo-primary-700)); transform: scale(1.05); }
  .fab--on { background: rgb(var(--ndo-primary-800)); }
  .fab__badge {
    position: absolute;
    top: -2px;
    right: -2px;
    min-width: 20px;
    height: 20px;
    border-radius: var(--ndo-radius-pill);
    background: rgb(var(--ndo-red-600));
    color: #fff;
    font-size: 11px;
    line-height: 20px;
    font-weight: var(--ndo-weight-bold);
    text-align: center;
    padding: 0 4px;
  }

  .drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 70;
    width: 380px;
    max-width: 92vw;
    background: rgb(var(--ndo-color-card-bg));
    border-left: 1px solid var(--ndo-color-border);
    box-shadow: -8px 0 24px rgb(0 0 0 / 0.12);
    display: flex;
    flex-direction: column;
  }
  .drawer__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--ndo-spacing-3);
    padding: var(--ndo-spacing-4);
    border-bottom: 1px solid var(--ndo-color-border-subtle);
    flex-shrink: 0;
  }
  .drawer__actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
  .drawer__body {
    flex: 1;
    overflow-y: auto;
    padding: var(--ndo-spacing-4);
    display: flex;
    flex-direction: column;
    gap: var(--ndo-spacing-4);
  }
  .drawer__compose { padding-top: var(--ndo-spacing-2); border-top: 1px solid var(--ndo-color-border-subtle); }
  .gh {
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-primary-600));
    text-decoration: none;
    align-self: center;
  }
  .gh:hover { text-decoration: underline; }
</style>
