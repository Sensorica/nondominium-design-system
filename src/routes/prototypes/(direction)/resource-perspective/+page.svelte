<script lang="ts">
  // Lobby, then a group as a Perspective host (Resource + Agent), then one
  // NDO. State lives in the module singleton so edits survive navigation.
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import {
    advanceStage,
    applyPatch,
    associate,
    clearFilters,
    clearTrail,
    createGroup,
    createNdo,
    createSpecification,
    groupIdFromInvite,
    hasGroup,
    historyFor,
    initiatorName,
    joinNdo,
    MOCK_NDOS,
    MY_KEY,
    OPERATIONAL,
    popTrail,
    pushTrail,
    rp,
    saveProfile,
    setFilters,
    specsFor,
    trailTop,
    updateSpecification
  } from '$lib/prototypes/resource-perspective/state.svelte';
  import {
    AppShell,
    Breadcrumb,
    agentIdFromName,
    getAssociatedGroupIds,
    getMockAgent,
    getMockGroupMembers,
    getMockInitiatorName,
    MOCK_AGENT_NAMES,
    GroupPerspectivesView,
    NdoBrowser,
    NdoButton,
    ResourceNdoView,
    UserProfileForm,
    applyNdoFilters,
    type GroupMember,
    type NdoInput,
    type PerspectiveId,
    type ResourceSpecificationInput
  } from '@nondominium/ndo-ui';

  let profileOpen = $state(false);

  const here = paths.protoResource();
  const lobbyUrl = here;
  const groupUrl = (
    id: string,
    opts?: { perspective?: 'resource' | 'agent'; agent?: string | null }
  ) => paths.protoResourceGroup(id, opts);
  const ndoUrl = (
    hash: string,
    id?: string | null,
    opts?: { tab?: 'overview' | 'resources' }
  ) => paths.protoResourceNdo(hash, id, opts);
  const createUrl = (id: string) => paths.protoResourceCreate(id);
  const absolute = (path: string) => `${page.url.origin}${path}`;

  const allNdos = $derived([...MOCK_NDOS, ...rp.created].map(applyPatch));
  const groupId = $derived(page.url.searchParams.get('group'));
  const ndoHash = $derived(page.url.searchParams.get('ndo'));
  const view = $derived(page.url.searchParams.get('view'));
  const perspectiveParam = $derived(page.url.searchParams.get('perspective'));
  const agentParam = $derived(page.url.searchParams.get('agent'));
  const tabParam = $derived(page.url.searchParams.get('tab'));
  const activePerspective = $derived<PerspectiveId>(
    perspectiveParam === 'agent' ? 'agent' : 'resource'
  );
  const group = $derived(rp.groups.find((g) => g.id === groupId) ?? null);
  const descriptor = $derived(
    view === 'ndo' ? (allNdos.find((d) => d.hash === ndoHash) ?? null) : null
  );
  const ndoSpecs = $derived(descriptor ? specsFor(descriptor.hash) : []);
  const groupNdos = $derived(allNdos.filter((d) => group?.ndoHashes?.includes(d.hash)));
  const lobbyNdos = $derived(
    applyNdoFilters(
      allNdos.filter((d) => rp.groups.some((g) => g.ndoHashes?.includes(d.hash))),
      rp.filters
    )
  );

  const SEEDED_GROUPS = new Set(['grp_sensorica', 'grp_opensourceecology', 'grp_waterfrance']);

  function membersOf(id: string, createdBy?: string) {
    if (!SEEDED_GROUPS.has(id)) {
      return [{ id: 'lynn', name: createdBy ?? MOCK_AGENT_NAMES.lynn, role: 'Creator' }];
    }
    return getMockGroupMembers(id, createdBy);
  }

  const agentLabel = $derived(
    agentParam ? (getMockAgent(agentParam)?.name ?? agentParam) : null
  );
  const navBack = $derived(trailTop());

  const groupBreadcrumb = $derived(
    group
      ? [
          { label: 'Lobby', href: lobbyUrl },
          { label: group.name, href: groupUrl(group.id) },
          ...(activePerspective === 'agent'
            ? [
                {
                  label: 'Agent',
                  href: agentParam
                    ? groupUrl(group.id, { perspective: 'agent' })
                    : undefined
                },
                ...(agentLabel ? [{ label: agentLabel }] : [])
              ]
            : [{ label: 'Resource' }])
        ]
      : []
  );
  const ndoBreadcrumb = $derived(
    descriptor
      ? [
          { label: 'Lobby', href: lobbyUrl },
          ...(group ? [{ label: group.name, href: groupUrl(group.id) }] : []),
          { label: 'Resource', href: group ? groupUrl(group.id) : lobbyUrl },
          { label: descriptor.name }
        ]
      : []
  );

  function currentHref(): string {
    return `${page.url.pathname}${page.url.search}`;
  }

  function currentLabel(): string {
    if (descriptor) return descriptor.name;
    if (agentLabel) return agentLabel;
    if (activePerspective === 'agent') return 'Agent';
    if (group) return group.name;
    return 'Lobby';
  }

  function jumpToAgent(agentId: string, inGroupId?: string | null) {
    const gid = inGroupId ?? groupId;
    if (!gid) return;
    pushTrail({ label: currentLabel(), href: currentHref() });
    goto(groupUrl(gid, { perspective: 'agent', agent: agentId }));
  }

  function handlePerspectiveSelect(id: PerspectiveId) {
    if (!group) return;
    clearTrail();
    if (id === 'agent') {
      goto(groupUrl(group.id, { perspective: 'agent' }));
    } else {
      goto(groupUrl(group.id));
    }
  }

  function handleSelectAgent(id: string) {
    if (!group) return;
    if (agentParam) {
      pushTrail({ label: currentLabel(), href: currentHref() });
    }
    goto(groupUrl(group.id, { perspective: 'agent', agent: id }));
  }

  function handleSelectGroup(id: string) {
    clearTrail();
    goto(groupUrl(id, { perspective: 'agent' }));
  }

  function handleResources(id: string) {
    clearTrail();
    goto(groupUrl(id));
  }

  function handleClearAgent() {
    if (!group) return;
    goto(groupUrl(group.id, { perspective: 'agent' }));
  }

  function handleBack() {
    const top = popTrail();
    if (top) goto(top.href);
    else handleClearAgent();
  }

  function handleMemberJump(m: GroupMember) {
    jumpToAgent(m.id, groupId);
  }

  function handleInitiatorJump(name: string) {
    const id = agentIdFromName(name);
    if (!id) return;
    jumpToAgent(id, groupId);
  }

  function handleCreate(input: NdoInput) {
    if (!group) return;
    const hash = createNdo(group.id, input);
    goto(ndoUrl(hash, group.id));
  }

  async function handleCreateGroup(name: string) {
    const id = createGroup(name);
    await goto(groupUrl(id));
  }

  async function handleJoinGroup(code: string) {
    const id = groupIdFromInvite(code);
    if (!id || !hasGroup(id)) throw new Error('Unknown group');
    await goto(groupUrl(id));
  }

  const agentNdoHref = (hash: string, tab?: 'resources') =>
    ndoUrl(hash, groupId, tab === 'resources' ? { tab: 'resources' } : undefined);

  function handleSelectNdo(hash: string, tab?: 'resources') {
    pushTrail({ label: currentLabel(), href: currentHref() });
    goto(ndoUrl(hash, groupId, tab === 'resources' ? { tab: 'resources' } : undefined));
  }
</script>

<svelte:head>
  <title>Resource Perspective · Nondominium prototypes</title>
  <style>
    :root {
      --proto-exit-left: 224px;
    }
  </style>
</svelte:head>

<div class="rp">
  <AppShell
    groups={rp.groups}
    activePath={group ? groupUrl(group.id) : lobbyUrl}
    profileNickname={rp.profile.nickname}
    browseHref={lobbyUrl}
    groupHref={(id) => groupUrl(id)}
    oncreategroup={handleCreateGroup}
    onjoingroup={handleJoinGroup}
    onprofileclick={() => (profileOpen = true)}
  >
    {#if descriptor}
      <div class="rp-ndo">
        {#if navBack}
          <div class="rp-ndo__back">
            <NdoButton variant="ghost" class="px-0 text-sm" onclick={handleBack}>
              ← Back to {navBack.label}
            </NdoButton>
          </div>
        {/if}
        <ResourceNdoView
          {descriptor}
          breadcrumb={ndoBreadcrumb}
          initiatorName={initiatorName(descriptor, getMockInitiatorName(descriptor.hash))}
          isInitiator={descriptor.initiator === MY_KEY}
          members={rp.members[descriptor.hash] ?? []}
          joined={rp.joined.includes(descriptor.hash)}
          onjoin={() => joinNdo(descriptor.hash)}
          groups={rp.groups}
          associatedGroupIds={getAssociatedGroupIds(rp.groups, descriptor.hash)}
          onassociate={(ids) => associate(descriptor.hash, ids)}
          onlifecycleconfirm={(payload) => advanceStage(descriptor.hash, descriptor, payload)}
          candidateNdos={allNdos}
          ndoLink={absolute(ndoUrl(descriptor.hash, groupId))}
          operationalState={OPERATIONAL[descriptor.hash] ?? null}
          transitionHistory={historyFor(descriptor.hash)}
          oncreatendo={group ? () => goto(createUrl(group.id)) : undefined}
          specifications={ndoSpecs}
          oncreatespec={(input: ResourceSpecificationInput) => {
            createSpecification(descriptor, input);
          }}
          onupdatespec={(actionHash, input) => {
            updateSpecification(
              descriptor.hash,
              actionHash,
              input,
              descriptor.property_regime,
              descriptor.resource_nature,
              descriptor.ndo_archetype === 'source_ndo' || !!descriptor.source_profile
            );
          }}
          initialTab={tabParam === 'resources' ? 'resources' : 'overview'}
          oninitiatorjump={handleInitiatorJump}
          onmemberjump={handleMemberJump}
        />
      </div>
    {:else if view === 'ndo'}
      <div class="rp-missing">
        <Breadcrumb
          items={[
            { label: 'Lobby', href: lobbyUrl },
            ...(group ? [{ label: group.name, href: groupUrl(group.id) }] : []),
            { label: 'Unknown NDO' }
          ]}
        />
        <h1>This NDO is not in the session</h1>
        <p>
          No resource matches this link.
          {#if group}
            <a href={groupUrl(group.id)}>Back to {group.name}</a>.
          {:else}
            <a href={lobbyUrl}>Back to the lobby</a>.
          {/if}
        </p>
      </div>
    {:else if view === 'group' && group}
      <GroupPerspectivesView
        {group}
        groupId={group.id}
        ndos={groupNdos}
        members={membersOf(group.id, group.createdBy)}
        myAgentKey={MY_KEY}
        joinedHashes={rp.joined}
        allNdosForDuplicateCheck={allNdos}
        breadcrumb={groupBreadcrumb}
        autoOpenCreateModal={page.url.searchParams.get('createNdo') === '1'}
        ndoHref={(hash) => ndoUrl(hash, group.id)}
        ndoLink={(hash) => absolute(ndoUrl(hash, group.id))}
        oncreatendo={handleCreate}
        {activePerspective}
        agentId={agentParam}
        allGroups={rp.groups}
        {allNdos}
        membersByGroup={membersOf}
        membersByNdo={rp.members}
        specsByNdo={rp.specs}
        currentAgentId="lynn"
        trailTop={navBack}
        {agentNdoHref}
        onselectndo={handleSelectNdo}
        onactive={handlePerspectiveSelect}
        onselectagent={handleSelectAgent}
        onselectgroup={handleSelectGroup}
        onresources={handleResources}
        onclearagent={handleClearAgent}
        onback={handleBack}
        onmemberjump={handleMemberJump}
      />
    {:else if view === 'group'}
      <div class="rp-missing">
        <Breadcrumb items={[{ label: 'Lobby', href: lobbyUrl }, { label: 'Unknown group' }]} />
        <h1>This group is not in the session</h1>
        <p>The invite does not match a group loaded here. <a href={lobbyUrl}>Back to the lobby</a>.</p>
      </div>
    {:else}
      <div class="rp-lobby">
        <div class="rp-lobby__crumb"><Breadcrumb items={[{ label: 'Lobby' }]} /></div>
        <h1>Lobby</h1>
        <NdoBrowser
          descriptors={lobbyNdos}
          activeFilters={rp.filters}
          ndoHref={(hash) => ndoUrl(hash)}
          onfilterchange={(f) => setFilters(f)}
          onclearfilters={clearFilters}
        />
      </div>
    {/if}
  </AppShell>

  {#if profileOpen}
    <UserProfileForm
      profile={rp.profile}
      onclose={() => (profileOpen = false)}
      onsave={(profile) => {
        saveProfile(profile);
        profileOpen = false;
      }}
    />
  {/if}
</div>

<style>
  .rp {
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }
  .rp :global(.min-h-screen) {
    height: 100%;
    min-height: 0;
  }
  .rp-lobby {
    padding: 24px;
  }
  .rp-lobby__crumb {
    margin-bottom: 12px;
  }
  .rp-lobby h1 {
    margin: 0 0 16px;
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
  }
  .rp-missing {
    padding: 24px;
  }
  .rp-missing h1 {
    margin: 12px 0 8px;
    font-size: 1.25rem;
    color: #111827;
  }
  .rp-missing p {
    margin: 0;
    font-size: 0.875rem;
    color: #4b5563;
  }
  .rp-ndo__back {
    padding: 16px 24px 0;
  }
</style>
