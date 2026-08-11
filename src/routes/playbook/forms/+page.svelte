<svelte:head><title>Forms — Playbook</title></svelte:head>

<script lang="ts">
  import { UserProfileForm, MOCK_LOBBY_PROFILE, type LobbyUserProfile } from '@nondominium/ndo-ui';

  let saved = $state<LobbyUserProfile | null>(null);
</script>

<h1 class="text-xl font-bold text-gray-900 mb-1">Forms</h1>
<p class="text-sm text-gray-600 mb-6">
  Lobby profile form — hApp <code class="font-mono">UserProfileForm.svelte</code>.
  Supports <code class="font-mono">mode="modal"</code> and <code class="font-mono">mode="page"</code>.
</p>

<section class="specimen-section">
  <h2 class="specimen-heading">Page mode</h2>
  <div class="max-w-lg">
    <UserProfileForm
      mode="page"
      profile={MOCK_LOBBY_PROFILE}
      onsave={(p) => { saved = p; }}
    />
  </div>
  {#if saved}
    <p class="mt-3 text-sm text-emerald-700">Saved nickname: {saved.nickname}</p>
  {/if}
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">Related patterns</h2>
  <ul class="text-sm text-gray-600 list-disc pl-5 space-y-1">
    <li><code class="font-mono">NdoCreateModal</code> — NDO creation with regime/nature tooltips</li>
    <li><code class="font-mono">GroupProfileModal</code> — Level-2 group disclosure</li>
    <li><code class="font-mono">LifecycleTransitionModal</code> — stage transition + successor hash</li>
  </ul>
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
