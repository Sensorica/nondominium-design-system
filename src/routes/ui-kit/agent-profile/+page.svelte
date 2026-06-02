<svelte:head><title>Agent Profile — UI Kit</title></svelte:head>

<script lang="ts">
  import { base } from '$app/paths';
  import { AppShell, UserProfileForm, MOCK_GROUPS, MOCK_LOBBY_PROFILE, type LobbyUserProfile } from '@nondominium/ndo-ui';

  let profile = $state<LobbyUserProfile>({ ...MOCK_LOBBY_PROFILE });
  let saved = $state(false);
</script>

<AppShell
  groups={MOCK_GROUPS}
  activePath={`${base}/ui-kit/agent-profile`}
  profileNickname={profile.nickname}
  browseHref={`${base}/ui-kit/browse`}
  groupHref={(id) => `${base}/ui-kit/group?id=${id}`}
  onprofileclick={() => {}}
>
  <div class="p-6">
    <nav class="mb-4 text-sm text-gray-500">
      <a href="{base}/ui-kit/browse" class="hover:text-gray-800">← Browse</a>
    </nav>
    <UserProfileForm
      mode="page"
      {profile}
      onsave={(p) => {
        profile = p;
        saved = true;
      }}
    />
    {#if saved}
      <p class="mt-4 text-sm text-emerald-700">Profile saved (mock local state).</p>
    {/if}
  </div>
</AppShell>
