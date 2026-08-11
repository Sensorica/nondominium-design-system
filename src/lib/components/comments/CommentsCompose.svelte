<script lang="ts">
  // Compose box. Posts a top-level comment (lazily creating the discussion) or a
  // reply. The discussion is created on first post, never on first view, so
  // browsing a surface leaves no trace in the review repo.
  import { comments } from '$lib/comments/comments.svelte';
  import { addComment, addReply, ensureDiscussion } from '$lib/comments/github-client';
  import type { Comment } from '$lib/comments/comments-types';

  let {
    surfaceKey,
    label,
    token,
    parentId = null,
    onPosted = (_c: Comment) => {},
  }: {
    surfaceKey: string;
    label: string;
    token: string;
    parentId?: string | null;
    onPosted?: (c: Comment) => void;
  } = $props();

  let body = $state('');
  let busy = $state(false);
  let error = $state('');

  async function post() {
    const text = body.trim();
    if (!text) return;
    busy = true;
    error = '';
    try {
      const disc = await ensureDiscussion(surfaceKey, label, token);
      if (!disc.ok) throw new Error('message' in disc.error ? disc.error.message : disc.error.kind);
      const result = parentId
        ? await addReply(disc.value.id, parentId, text, token)
        : await addComment(disc.value.id, text, token);
      if (!comments.thread) comments.thread = { ...disc.value, comments: [] };
      if (!result.ok) throw new Error('message' in result.error ? result.error.message : result.error.kind);
      onPosted(result.value);
      body = '';
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    } finally {
      busy = false;
    }
  }
</script>

<div class="compose">
  <textarea
    class="ndo-textarea"
    rows="3"
    placeholder={parentId ? 'Write a reply… (markdown)' : 'Write a comment… (markdown)'}
    bind:value={body}
    onkeydown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') post(); }}
  ></textarea>
  {#if error}<p class="ndo-field__error">⚠️ {error}</p>{/if}
  <div class="row">
    <span class="ndo-field__hint">⌘/Ctrl+Enter to post</span>
    <button class="ndo-btn ndo-btn--primary ndo-btn--sm" onclick={post} disabled={busy || !body.trim()}>
      {busy ? 'Posting…' : parentId ? 'Reply' : 'Post comment'}
    </button>
  </div>
</div>

<style>
  .compose { display: flex; flex-direction: column; gap: var(--ndo-spacing-2); }
  .row { display: flex; align-items: center; justify-content: space-between; gap: var(--ndo-spacing-2); }
</style>
