<script lang="ts">
  // Locked-state setup card: a reviewer's first-run experience. Token paste,
  // validated against the viewer query before it is stored.
  import { comments, setToken, clearToken } from '$lib/comments/comments.svelte';
  import { validateToken, DISCUSSION_CONFIG } from '$lib/comments/github-client';

  let draft = $state('');
  let busy = $state(false);
  let result = $state<{ ok: true; login: string } | { ok: false; message: string } | null>(null);

  async function connect() {
    if (!draft.trim()) return;
    busy = true;
    result = null;
    const r = await validateToken(draft.trim());
    if (r.ok) {
      setToken(draft.trim());
      comments.viewerLogin = r.value;
      result = { ok: true, login: r.value };
      draft = '';
    } else {
      result = {
        ok: false,
        message:
          r.error.kind === 'auth'
            ? `Token rejected. Are you a member of the ${DISCUSSION_CONFIG.owner} org with access to the review repo?`
            : r.error.kind === 'no-token'
              ? 'Paste a token first.'
              : `${r.error.kind}: ${r.error.message}`,
      };
    }
    busy = false;
  }

  function disconnect() {
    clearToken();
    result = null;
    draft = '';
  }
</script>

<div class="setup">
  {#if comments.enabled}
    <div class="connected">
      <div class="row">
        <span aria-hidden="true">🟢</span>
        <div>
          <div class="ndo-field__label">Connected</div>
          <div class="ndo-small">Signed in as <strong>{comments.viewerLogin || '(unknown)'}</strong></div>
        </div>
      </div>
      <button class="ndo-btn ndo-btn--ghost ndo-btn--sm" onclick={disconnect}>Disconnect</button>
    </div>
  {:else}
    <h3 class="ndo-h3">💬 Sign in to comment</h3>
    <p class="ndo-small">
      Comments live in a <strong>private</strong> GitHub repository owned by the
      {DISCUSSION_CONFIG.owner} organisation. You need a personal access token from a member of
      that org to read or post.
    </p>
    <ol class="steps ndo-small">
      <li>GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens.</li>
      <li>Scope it to <code>{DISCUSSION_CONFIG.owner}/{DISCUSSION_CONFIG.name}</code> with <strong>Discussions: Read and write</strong>.</li>
      <li>Paste it below.</li>
    </ol>
    <input
      type="password"
      class="ndo-input"
      placeholder="github_pat_… or ghp_…"
      bind:value={draft}
      onkeydown={(e) => e.key === 'Enter' && connect()}
    />
    <button class="ndo-btn ndo-btn--primary" onclick={connect} disabled={busy || !draft.trim()}>
      {busy ? 'Connecting…' : 'Connect'}
    </button>
    {#if result}
      <p class="ndo-small" style="color:rgb(var({result.ok ? '--ndo-emerald-700' : '--ndo-red-600'}))">
        {result.ok ? `✅ Connected as ${result.login}` : `⚠️ ${result.message}`}
      </p>
    {/if}
    <p class="ndo-small" style="color:var(--ndo-color-text-muted)">
      The token is stored only in this browser and sent directly to GitHub. It never touches a
      server, because this site does not have one. Clearing it locks the overlay immediately.
    </p>
  {/if}
</div>

<style>
  .setup { display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  .steps { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; }
  .connected { display: flex; align-items: center; justify-content: space-between; gap: var(--ndo-spacing-3); }
  .row { display: flex; align-items: center; gap: var(--ndo-spacing-2); }
  code { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); }
</style>
