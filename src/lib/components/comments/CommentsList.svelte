<script lang="ts">
  // Thread render: comments, one level of replies, reaction chips.
  // `bodyHTML` is rendered by GitHub server-side from a private repo, so it is a
  // trusted source for {@html}.
  import type { Snippet } from 'svelte';
  import type { Comment, ReactionContent } from '$lib/comments/comments-types';
  import { toggleReaction } from '$lib/comments/github-client';
  import { TIME_MARKER, decodeTime, seekTo } from '$lib/comments/timecode';
  import { ABOUT_MARKER, decodeAbout, showAbout } from '$lib/comments/about';

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

  /**
   * Upgrade a meeting comment's pointer lines into buttons once GitHub's HTML is
   * in the DOM: "⏱ at 62:00" shows the paragraph covering that minute, and
   * "📍 on ..." scrolls to the paragraph. An action, not a handler in the markup,
   * because nothing inside {@html} can carry a Svelte listener. The page does the
   * showing (it listens for SEEK_EVENT and ABOUT_EVENT); off a meeting page the
   * events go unheard and the line stays inert.
   */
  function revealLink(node: HTMLElement, comment: Comment) {
    let current = comment;

    function wire() {
      for (const p of Array.from(node.querySelectorAll('p'))) {
        if (p.dataset.dsReveal !== undefined) continue;
        const text = p.textContent?.trimStart() ?? '';
        const isTime = text.startsWith(TIME_MARKER);
        if (!isTime && !text.startsWith(ABOUT_MARKER)) continue;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = p.textContent?.trim() ?? '';
        btn.addEventListener('click', () => {
          if (isTime) {
            const t = decodeTime(current.body);
            if (t !== null) seekTo(t);
          } else {
            const a = decodeAbout(current.body);
            if (a) showAbout(a.id);
          }
        });
        p.dataset.dsReveal = '';
        p.classList.add('points-at');
        p.replaceChildren(btn);
      }
    }

    // Immediately, and again after the current tick, since {@html} content can land
    // either side of the action running. Re-entry is a no-op: the dataset marks it.
    wire();
    queueMicrotask(wire);

    return {
      update(next: Comment) {
        current = next;
        queueMicrotask(wire);
      }
    };
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
          <div class="html" use:revealLink={c}>{@html c.bodyHTML}</div>
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
  .html :global(p.points-at button) {
    font: inherit;
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-primary-700));
    background: rgb(var(--ndo-primary-50));
    border: 1px solid rgb(var(--ndo-primary-200));
    border-radius: var(--ndo-radius-pill);
    padding: 1px 8px;
    cursor: pointer;
    text-align: left;
  }
  .html :global(p.points-at button:hover) { background: rgb(var(--ndo-primary-100)); }
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
