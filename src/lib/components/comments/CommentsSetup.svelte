<script lang="ts">
  // Locked-state setup card: a reviewer's first-run experience. "Sign in with
  // GitHub" is the primary route where the site has Functions (signInAvailable);
  // pasting a token stays available behind a link, so tokens issued before
  // sign-in existed keep working, and is the only route on the GitHub Pages copy.
  import { comments, setToken, clearToken } from '$lib/comments/comments.svelte';
  import { validateToken, DISCUSSION_CONFIG } from '$lib/comments/github-client';
  import { signInWithGitHub, signInAvailable } from '$lib/comments/auth';

  let draft = $state('');
  let busy = $state(false);
  let showPaste = $state(false);
  let result = $state<{ ok: true; login: string } | { ok: false; message: string } | null>(null);

  /** Confirm whatever token is now in state, and capture the login. */
  async function confirmSession(): Promise<boolean> {
    const v = await validateToken(comments.token);
    if (v.ok) {
      comments.viewerLogin = v.value;
      comments.enabled = true;
      result = { ok: true, login: v.value };
      return true;
    }
    clearToken();
    result = {
      ok: false,
      message:
        v.error.kind === 'auth'
          ? `GitHub accepted the sign-in, but this account cannot reach the review repo. Ask an admin of the ${DISCUSSION_CONFIG.owner} org to add you.`
          : v.error.kind === 'no-token'
            ? 'No token was stored. Try again.'
            : `${v.error.kind}: ${v.error.message}`,
    };
    return false;
  }

  async function signIn() {
    busy = true;
    result = null;
    const r = await signInWithGitHub();
    if (!r.ok) {
      result = { ok: false, message: messageForAuthError(r.error) };
      busy = false;
      return;
    }
    await confirmSession();
    busy = false;
  }

  function messageForAuthError(code: string): string {
    switch (code) {
      case 'popup_blocked':
        return 'Your browser blocked the sign-in window. Allow pop-ups for this site and try again.';
      case 'cancelled':
        return 'Sign-in was cancelled.';
      case 'no_token_returned':
        return 'GitHub authorised the app but returned no token. Try again.';
      case 'sign_in_unavailable':
        return 'Sign-in is not available on this copy of the site. Use a personal access token.';
      case 'server_missing_client_secret':
        return 'The site is missing its GitHub credentials. This one is for the site admins, not you.';
      default:
        return `Sign-in failed (${code}).`;
    }
  }

  async function connectPasted() {
    if (!draft.trim()) return;
    busy = true;
    result = null;
    const v = await validateToken(draft.trim());
    if (v.ok) {
      setToken(draft.trim());
      comments.viewerLogin = v.value;
      result = { ok: true, login: v.value };
      draft = '';
    } else {
      result = {
        ok: false,
        message:
          v.error.kind === 'auth'
            ? `Token rejected. Are you a member of the ${DISCUSSION_CONFIG.owner} org with access to the review repo?`
            : v.error.kind === 'no-token'
              ? 'Paste a token first.'
              : `${v.error.kind}: ${v.error.message}`,
      };
    }
    busy = false;
  }

  function disconnect() {
    clearToken();
    result = null;
    draft = '';
    showPaste = false;
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
      <button class="ndo-btn ndo-btn--ghost ndo-btn--sm" onclick={disconnect}>Sign out</button>
    </div>
  {:else}
    <h3 class="ndo-h3">💬 Sign in to comment</h3>
    <p class="ndo-small">
      Comments live in a <strong>private</strong> GitHub repository owned by the
      {DISCUSSION_CONFIG.owner} organisation.
      {#if signInAvailable}
        Signing in confirms you can reach it. You will see nothing if you cannot, which is how the privacy works.
      {:else}
        You need a personal access token from a member of that org to read or post.
      {/if}
    </p>

    {#if signInAvailable}
      <button class="ndo-btn ndo-btn--primary" onclick={signIn} disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in with GitHub'}
      </button>
    {/if}

    {#if result}
      <p class="ndo-small" style="color:rgb(var({result.ok ? '--ndo-emerald-700' : '--ndo-red-600'}))">
        {result.ok ? `✅ Signed in as ${result.login}` : `⚠️ ${result.message}`}
      </p>
    {/if}

    {#if signInAvailable}
      <p class="ndo-small" style="color:var(--ndo-color-text-muted)">
        A window opens on GitHub and closes itself. The token it returns is stored only in this
        browser, expires after eight hours, and renews quietly while you are using the site.
      </p>
    {/if}

    {#if signInAvailable && !showPaste}
      <button class="linkish ndo-small" onclick={() => (showPaste = true)}>
        Use a personal access token instead
      </button>
    {:else}
      <div class="paste" class:paste--secondary={signInAvailable}>
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
          onkeydown={(e) => e.key === 'Enter' && connectPasted()}
        />
        <button
          class="ndo-btn"
          class:ndo-btn--primary={!signInAvailable}
          onclick={connectPasted}
          disabled={busy || !draft.trim()}
        >
          {busy ? 'Connecting…' : 'Connect'}
        </button>
        {#if !signInAvailable}
          <p class="ndo-small" style="color:var(--ndo-color-text-muted)">
            The token is stored only in this browser and sent directly to GitHub. Clearing it
            locks the overlay immediately.
          </p>
        {/if}
      </div>
    {/if}
  {/if}
</div>

<style>
  .setup { display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  .steps { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; }
  .connected { display: flex; align-items: center; justify-content: space-between; gap: var(--ndo-spacing-3); }
  .row { display: flex; align-items: center; gap: var(--ndo-spacing-2); }
  .linkish {
    align-self: flex-start; background: none; border: 0; padding: 0;
    color: var(--ndo-color-text-muted); text-decoration: underline;
    text-underline-offset: 3px; cursor: pointer;
  }
  .paste { display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  .paste--secondary { padding-top: var(--ndo-spacing-3); border-top: 1px dashed currentColor; }
  code { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); }
</style>
