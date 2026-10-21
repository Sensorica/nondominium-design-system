<script lang="ts">
  // Compose box. Posts a top-level comment (lazily creating the discussion) or a
  // reply. The discussion is created on first post, never on first view, so
  // browsing a surface leaves no trace in the review repo.
  import { comments } from '$lib/comments/comments.svelte';
  import { viewContext } from '$lib/comments/view-context';
  import { addComment, addReply, ensureDiscussion } from '$lib/comments/github-client';
  import type { Comment } from '$lib/comments/comments-types';
  import { encodeAbout, type About } from '$lib/comments/about';
  import { encodeTime, fmtTime } from '$lib/comments/timecode';

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
  let about = $state<About | null>(null);
  let at = $state<number | null>(null);
  let quote = $state<string | null>(null);
  let textarea: HTMLTextAreaElement | undefined = $state();

  // A page asked for a comment on one of its paragraphs (a meeting's 💬 button):
  // take the pointer and the minute, once, into the top-level box. Replies answer
  // a comment, so they never take it.
  $effect(() => {
    if (parentId) return;
    const a = comments.about;
    const s = comments.stamp;
    if (!a && !s) return;
    comments.about = null;
    comments.stamp = null;
    if (a) about = a;
    if (s) {
      at = s.t;
      quote = s.quote ?? null;
    }
    textarea?.focus();
  });

  async function post() {
    const text = body.trim();
    if (!text) return;
    busy = true;
    error = '';
    try {
      const disc = await ensureDiscussion(surfaceKey, label, token);
      if (!disc.ok) throw new Error('message' in disc.error ? disc.error.message : disc.error.kind);
      // Every comment carries the conditions it was written under. A report about
      // legibility is unactionable without them, and the body is the only place
      // GitHub Discussions lets this live. See src/lib/comments/view-context.ts.
      const pointed = (about ? text + encodeAbout(about) : text) + (at !== null ? encodeTime(at, quote ?? undefined) : '');
      const withContext = pointed + viewContext();
      const result = parentId
        ? await addReply(disc.value.id, parentId, withContext, token)
        : await addComment(disc.value.id, withContext, token);
      if (!comments.thread) comments.thread = { ...disc.value, comments: [] };
      if (!result.ok) throw new Error('message' in result.error ? result.error.message : result.error.kind);
      onPosted(result.value);
      body = '';
      about = null;
      at = null;
      quote = null;
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
    bind:this={textarea}
    onkeydown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') post(); }}
  ></textarea>
  {#if about}
    <div class="chip">
      <span class="chip__text" title={about.q}>about "{about.q}"</span>
      <button class="chip__x" onclick={() => (about = null)} aria-label="Remove pointer">✕</button>
    </div>
  {/if}
  {#if at !== null}
    <div class="chip">
      <span class="chip__text" title={quote ?? undefined}>at {fmtTime(at)}</span>
      <button class="chip__x" onclick={() => { at = null; quote = null; }} aria-label="Remove timestamp">✕</button>
    </div>
  {/if}
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
  .chip {
    display: flex;
    align-items: center;
    gap: var(--ndo-spacing-2);
    align-self: flex-start;
    max-width: 100%;
    padding: 2px 4px 2px 10px;
    border-radius: var(--ndo-radius-pill);
    background: rgb(var(--ndo-primary-50));
    border: 1px solid rgb(var(--ndo-primary-200));
  }
  .chip__text {
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-primary-700));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .chip__x { background: none; border: 0; cursor: pointer; font: inherit; font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); }
  .chip__x:hover { color: rgb(var(--ndo-red-600)); }
  .row { display: flex; align-items: center; justify-content: space-between; gap: var(--ndo-spacing-2); }
</style>
