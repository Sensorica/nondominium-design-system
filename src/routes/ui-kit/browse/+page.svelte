<svelte:head><title>Browse (Lobby) — UI Kit</title></svelte:head>

<script lang="ts">
  import { base } from '$app/paths';
  import {
    AppShell,
    LobbyView,
    UserProfileForm,
    MOCK_NDOS,
    MOCK_LOBBY_PROFILE,
    applyNdoFilters,
    EMPTY_FILTERS,
    getMockGroups,
    type ActiveFilters,
    type LobbyUserProfile
  } from '@nondominium/ndo-ui';

  let groups = $state(getMockGroups());
  let profile = $state<LobbyUserProfile | null>(MOCK_LOBBY_PROFILE);
  let activeFilters = $state<ActiveFilters>({ ...EMPTY_FILTERS });
  let showProfileModal = $state(false);

  const lobbyNdos = $derived(
    MOCK_NDOS.filter((d) => groups.some((g) => g.ndoHashes?.includes(d.hash)))
  );
  const visibleNdos = $derived(applyNdoFilters(lobbyNdos, activeFilters));
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
    descriptors={visibleNdos}
    {activeFilters}
    agentName={profile?.nickname ?? null}
    ndoHref={(hash) => `${base}/ui-kit/ndo-detail?hash=${encodeURIComponent(hash)}`}
    onfilterchange={(f) => { activeFilters = { ...activeFilters, ...f }; }}
    onclearfilters={() => { activeFilters = { ...EMPTY_FILTERS }; }}
  />
</AppShell>
