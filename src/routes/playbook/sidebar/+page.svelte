<svelte:head><title>Sidebar — Playbook</title></svelte:head>

<script lang="ts">
  import { base } from '$app/paths';
  import { Sidebar, MOCK_GROUPS, MOCK_LOBBY_PROFILE } from '@nondominium/ndo-ui';
</script>

<h1 class="text-xl font-bold text-gray-900 mb-1">Sidebar</h1>
<p class="text-sm text-gray-600 mb-6">
  Primary nav from hApp <code class="font-mono">Sidebar.svelte</code>:
  Browse link, group list, inline create/join, profile CTA at bottom (<code class="font-mono">w-52</code>).
</p>

<section class="specimen-section">
  <h2 class="specimen-heading">Live component</h2>
  <div class="flex h-96 rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
    <Sidebar
      groups={MOCK_GROUPS}
      activePath={`${base}/ui-kit/browse`}
      profileNickname={MOCK_LOBBY_PROFILE.nickname}
      browseHref={`${base}/ui-kit/browse`}
      groupHref={(id) => `${base}/ui-kit/group?id=${id}`}
      oncreategroup={async () => {}}
      onjoingroup={async () => {}}
      onprofileclick={() => {}}
    />
    <main class="flex flex-1 items-center justify-center text-sm text-gray-500">Main content area</main>
  </div>
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
</style>
