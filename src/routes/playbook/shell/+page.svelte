<svelte:head><title>Shell — Playbook</title></svelte:head>

<script lang="ts">
  import { base } from '$app/paths';
  import { AppShell, MOCK_GROUPS, MOCK_LOBBY_PROFILE, NdoCard, MOCK_NDOS } from '@nondominium/ndo-ui';
</script>

<h1 class="text-xl font-bold text-gray-900 mb-1">App shell</h1>
<p class="text-sm text-gray-600 mb-6">
  <code class="font-mono text-blue-600">AppShell</code> + <code class="font-mono">Sidebar</code>
  from <code class="font-mono">@nondominium/ndo-ui</code> — not a custom element.
  hApp sources: <code class="font-mono">shell/AppShell.svelte</code>, <code class="font-mono">shell/Sidebar.svelte</code>.
</p>

<section class="specimen-section">
  <h2 class="specimen-heading">Live preview</h2>
  <div class="h-80 rounded-lg border border-gray-200 overflow-hidden">
    <AppShell
      groups={MOCK_GROUPS}
      activePath={`${base}/ui-kit/browse`}
      profileNickname={MOCK_LOBBY_PROFILE.nickname}
      browseHref={`${base}/ui-kit/browse`}
      groupHref={(id) => `${base}/ui-kit/group?id=${id}`}
      onprofileclick={() => {}}
    >
      <div class="p-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-3">Lobby content</h2>
        <div class="flex flex-wrap gap-3">
          {#each MOCK_NDOS.slice(0, 2) as d (d.hash)}
            <NdoCard descriptor={d} href="#" />
          {/each}
        </div>
      </div>
    </AppShell>
  </div>
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">Layout recipe</h2>
  <pre class="code-block">{`<!-- Svelte 5 -->
<AppShell groups={groups} activePath={path} profileNickname={nickname} ...>
  <LobbyView ... />
</AppShell>

/* Sidebar width: w-52 (13rem) */
/* Shell: flex min-h-screen bg-gray-100 */`}</pre>
</section>

<style>
  .specimen-section { margin-bottom: 2rem; }
  .specimen-heading {
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgb(var(--ndo-gray-500));
    margin: 0 0 0.75rem;
  }
  .code-block {
    background: rgb(var(--ndo-gray-50));
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: 0.5rem;
    padding: 1rem;
    font-size: 0.8125rem;
    font-family: var(--ndo-font-mono);
    overflow-x: auto;
    white-space: pre;
  }
</style>
