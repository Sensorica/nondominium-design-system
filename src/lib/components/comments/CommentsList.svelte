<script lang="ts">
  // Thread render: comments, one level of replies, reaction chips.
  // `bodyHTML` is rendered by GitHub server-side from a private repo, so it is a
  // trusted source for {@html}.
  import type { Snippet } from 'svelte';
  import type { Comment, ReactionContent } from '$lib/comments/comments-types';
  import { toggleReaction } from '$lib/comments/github-client';

  let {
    comments: list,
    token,
    replyForm,
  }: {
    comments: Comment[];
    token: string;
    replyForm?: Snippet<[{ parentId: string }]>;
  } = $props();

  let replyingTo = $state<string | null>(null);

  const REACTIONS: { content: ReactionContent; emoji: string }[] = [
    { content: 'THUMBS_UP', emoji: '👍' },
    { content: 'HEART', emoji: '❤️' },
    { content: 'HOORAY', emoji: '🎉' },
    { content: 'ROCKET', emoji: '🚀' },
    { content: 'EYES', emoji: '👀' },
  ];

  async function react(commentId: string, content: ReactionContent, already: boolean) {
    const r = await toggleReaction(commentId, content, token, already);
    if (!r.ok) return;
    const c = list.find((x) => x.id === commentId);
    if (!c) return;
    const existing = c.reactions.find((rr) => rr.content === content);
    if (existing) {
      existing.count += already ? -1 : 1;
      existing.viewerReacted = !already;
      if (existing.count <= 0) c.reactions = c.reactions.filter((rr) => rr.content !== content);
    } else if (!already) {
      c.reactions = [...c.reactions, { content, count: 1, viewerReacted: true }];
    }
  }

  function timeAgo(iso: string): string {
    const d = new Date(iso);
    const hours = Math.floor((Date.now() - d.getTime()) / 36e5);
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return days < 30 ? `${days}d ago` : d.toLocaleDateString();
  }
</script>

{#if list.length === 0}
  <p class="ndo-small" style="color:var(--ndo-color-text-muted)">
    No comments on this surface yet. Be the first.
  </p>
{:else}
  <ul class="thread">
    {#each list as c (c.id)}
      <li class="comment">
        {#if c.author.avatarUrl}<img class="avatar" src={c.author.avatarUrl} alt="" />{/if}
        <div class="body">
          <div class="meta">
            <a href={c.author.url} target="_blank" rel="noreferrer" class="login">@{c.author.login}</a>
            <span class="ndo-field__hint">{timeAgo(c.createdAt)}</span>
          </div>
          <div class="html">{@html c.bodyHTML}</div>
          <div class="reactions">
            {#each c.reactions as r (r.content)}
              <button
                class="react"
                class:react--mine={r.viewerReacted}
                onclick={() => react(c.id, r.content as ReactionContent, r.viewerReacted)}
              >
                {REACTIONS.find((re) => re.content === r.content)?.emoji ?? '🔘'} {r.count}
              </button>
            {/each}
            <button
              class="react"
              onclick={() => react(c.id, 'THUMBS_UP', c.reactions.some((r) => r.content === 'THUMBS_UP' && r.viewerReacted))}
            >+ 👍</button>
          </div>
          <button class="reply" onclick={() => (replyingTo = replyingTo === c.id ? null : c.id)}>
            {replyingTo === c.id ? 'Cancel reply' : '↩ Reply'}
          </button>
          {#if replyingTo === c.id && replyForm}{@render replyForm({ parentId: c.id })}{/if}
        </div>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .thread { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-4); }
  .comment { display: flex; gap: var(--ndo-spacing-2); }
  .avatar { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; }
  .body { flex: 1; min-width: 0; }
  .meta { display: flex; align-items: center; gap: var(--ndo-spacing-2); margin-bottom: 2px; }
  .login {
    font-size: var(--ndo-text-sm);
    font-weight: var(--ndo-weight-semibold);
    color: rgb(var(--ndo-primary-700));
    text-decoration: none;
  }
  .login:hover { text-decoration: underline; }
  .html :global(p) {
    margin: 0 0 var(--ndo-spacing-2);
    font-size: var(--ndo-text-sm);
    line-height: var(--ndo-lh-base);
    color: var(--ndo-color-text-primary);
    overflow-wrap: break-word;
  }
  .html :global(p:last-child) { margin-bottom: 0; }
  .html :global(code) {
    font-family: var(--ndo-font-mono);
    font-size: var(--ndo-text-xs);
    background: var(--ndo-color-surface);
    padding: 1px 4px;
    border-radius: var(--ndo-radius-sm);
  }
  .reactions { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .react {
    border: 1px solid var(--ndo-color-border);
    background: rgb(var(--ndo-color-card-bg));
    border-radius: var(--ndo-radius-pill);
    padding: 2px 8px;
    font: inherit;
    font-size: var(--ndo-text-xs);
    cursor: pointer;
  }
  .react:hover { background: var(--ndo-color-surface); }
  .react--mine {
    background: rgb(var(--ndo-primary-50));
    border-color: rgb(var(--ndo-primary-300));
    color: rgb(var(--ndo-primary-700));
  }
  .reply {
    background: none;
    border: none;
    padding: 4px 0 0;
    font: inherit;
    font-size: var(--ndo-text-xs);
    color: var(--ndo-color-text-muted);
    cursor: pointer;
  }
  .reply:hover { color: rgb(var(--ndo-primary-600)); }
</style>
