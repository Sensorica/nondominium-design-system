<svelte:head><title>Browse (Lobby) — UI Kit</title></svelte:head>

<script lang="ts">
  import { base } from '$app/paths';
  import {
    AppShell,
    LobbyView,
    UserProfileForm,
    MOCK_GROUPS,
    MOCK_NDOS,
    MOCK_LOBBY_PROFILE,
    applyNdoFilters,
    EMPTY_FILTERS,
    type ActiveFilters,
    type LobbyUserProfile
  } from '@nondominium/ndo-ui';

  let groups = $state([...MOCK_GROUPS]);
  let profile = $state<LobbyUserProfile | null>(MOCK_LOBBY_PROFILE);
  let activeFilters = $state<ActiveFilters>({ ...EMPTY_FILTERS });
  let showProfileModal = $state(false);

  const filteredNdos = $derived(applyNdoFilters(MOCK_NDOS, activeFilters));
</script>

{#if showProfileModal}
  <UserProfileForm
    mode="modal"
    profile={profile}
    onclose={() => { showProfileModal = false; }}
    onsave={(p) => { profile = p; showProfileModal = false; }}
  />
{/if}

<AppShell
  {groups}
  activePath={`${base}/ui-kit/browse`}
  profileNickname={profile?.nickname ?? null}
  browseHref={`${base}/ui-kit/browse`}
  groupHref={(id) => `${base}/ui-kit/group?id=${id}`}
  oncreategroup={(name) => {
    groups = [...groups, { id: `grp_${Date.now()}`, name, createdBy: profile?.nickname }];
  }}
  onjoingroup={() => {}}
  onprofileclick={() => { showProfileModal = true; }}
>
  <LobbyView
    descriptors={filteredNdos}
    {activeFilters}
    agentName={profile?.nickname ?? null}
    ndoHref={(hash) => `${base}/ui-kit/ndo-detail?hash=${encodeURIComponent(hash)}`}
    onfilterchange={(f) => { activeFilters = { ...activeFilters, ...f }; }}
    onclearfilters={() => { activeFilters = { ...EMPTY_FILTERS }; }}
  />
</AppShell>
