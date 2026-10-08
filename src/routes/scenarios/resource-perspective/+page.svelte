<script lang="ts">
  // The Group page as a Perspective host, and the Resource Perspective as its one live Perspective.
  // Layer 0 cut: Lobby outermost, Groups second, Perspectives in the middle. Everything that is not
  // Layer 0 is visible and explained ("Coming next"), never hidden and never half-working.
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { paths } from '$lib/paths';
  import {
    AppShell,
    Breadcrumb,
    GroupPerspectivesView,
    ResourceNdoView,
    NdoBrowser,
    MOCK_NDOS,
    MOCK_LOBBY_PROFILE,
    MOCK_AGENT_NAMES,
    getMockGroups,
    getMockGroupMembers,
    getMockInitiatorName,
    associateNdoWithGroups,
    getAssociatedGroupIds,
    applyNdoFilters,
    EMPTY_FILTERS,
    type ActiveFilters,
    type GroupMember,
    type NdoDescriptor,
    type NdoInput,
    type OperationalStateLabel
  } from '@nondominium/ndo-ui';

  /** The demo agent is Lynn. Her key is the initiator of "Neighborhood Tool Library (planned)". */
  const MY_KEY = 'uhCAk5vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVe';

  let groups = $state(getMockGroups());
  let created = $state<NdoDescriptor[]>([]);
  /** NDOs the demo agent has joined. */
  let joined = $state<string[]>(['uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy']);
  let ndoMembers = $state<Record<string, GroupMember[]>>({
    uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy: [
      { id: 'bob', name: MOCK_AGENT_NAMES.bob, role: 'Member' },
      { id: 'lynn', name: MOCK_AGENT_NAMES.lynn, role: 'Member' }
    ]
  });
  let lobbyFilters = $state<ActiveFilters>({ ...EMPTY_FILTERS });

  /** Read-only, shown only where the data exists. */
  const OPERATIONAL: Record<string, OperationalStateLabel> = {
    uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy: 'InUse',
    uhC0k1234abcdefghijklmnopqrstuvwx: 'InStorage',
    uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJkLm: 'Available'
  };

  const allNdos = $derived([...MOCK_NDOS, ...created]);
  const groupId = $derived(page.url.searchParams.get('group'));
  const ndoHash = $derived(page.url.searchParams.get('ndo'));
  const group = $derived(groups.find((g) => g.id === groupId) ?? null);
  const descriptor = $derived(allNdos.find((d) => d.hash === ndoHash) ?? null);
  const groupNdos = $derived(allNdos.filter((d) => group?.ndoHashes?.includes(d.hash)));
  const lobbyNdos = $derived(
    applyNdoFilters(
      allNdos.filter((d) => groups.some((g) => g.ndoHashes?.includes(d.hash))),
      lobbyFilters
    )
  );

  const here = paths.scenarioResourcePerspective();
  const lobbyUrl = here;
  const groupUrl = (id: string) => `${here}?group=${encodeURIComponent(id)}`;
  const ndoUrl = (hash: string, id?: string | null) =>
    `${here}?${id ? `group=${encodeURIComponent(id)}&` : ''}ndo=${encodeURIComponent(hash)}`;
  const absolute = (path: string) => `${page.url.origin}${path}`;

  const groupBreadcrumb = $derived(
    group
      ? [
          { label: 'Lobby', href: lobbyUrl },
          { label: group.name, href: groupUrl(group.id) },
          { label: 'Resource' }
        ]
      : []
  );
  const ndoBreadcrumb = $derived(
    descriptor
      ? [
          { label: 'Lobby', href: lobbyUrl },
          ...(groupId && group ? [{ label: group.name, href: groupUrl(group.id) }] : []),
          { label: 'Resource', href: groupId ? groupUrl(groupId) : lobbyUrl },
          { label: descriptor.name }
        ]
      : []
  );

  function handleCreate(input: NdoInput) {
    if (!group) return;
    const d: NdoDescriptor = {
      hash: `uhC0kNew${created.length + 1}Layer0DemoAbcdefghijklmn`,
      name: input.name,
      description: input.description ?? null,
      lifecycle_stage: input.lifecycle_stage,
      property_regime: input.property_regime,
      resource_nature: input.resource_nature,
      initiator: MY_KEY,
      created_at: Date.now() * 1000,
      successor_ndo_hash: null,
      hibernation_origin: null
    };
    created = [...created, d];
    groups = associateNdoWithGroups(groups, d.hash, [group.id]);
  }

  function handleJoin(hash: string) {
    if (!joined.includes(hash)) joined = [...joined, hash];
    const current = ndoMembers[hash] ?? [];
    if (!current.some((m) => m.id === 'lynn')) {
      ndoMembers = {
        ...ndoMembers,
        [hash]: [...current, { id: 'lynn', name: MOCK_AGENT_NAMES.lynn, role: 'Member' }]
      };
    }
  }

  const decisions = [
    {
      title: 'Perspectives live inside the Group',
      body: 'Lobby stays the outer shell and Groups the second layer. The middle layer is a Perspective host: Resource, Agent, Intelligence, Work. At Layer 0 each one is scoped to the current group.'
    },
    {
      title: 'One live, three explained',
      body: 'Resource is the only live Perspective. The other three are visible with a “Soon” badge; clicking one explains it and keeps you where you are.'
    },
    {
      title: 'Layer 1/2 is visible, not hidden',
      body: 'Tabs, access actions (use, borrow, transfer…) and service processes (transport, store, repair) are shown with a “Soon” badge and open the same popup.'
    },
    {
      title: 'Jump points rehearse the future',
      body: 'Click an agent’s name: the popup describes the jump to the Agent Perspective and the way back. The breadcrumb is real; the cross-Perspective trail is not built yet.'
    }
  ];
</script>

<div class="p-6">
  <header class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Resource Perspective (Layer 0)</h1>
    <p class="mt-2 max-w-2xl text-sm text-gray-600">
      The middle of the app, Lobby › Group › <strong>Perspective</strong>. What is live is only what
      Layer 0 can honestly do: browse, create, join, associate, fork, and the creator’s lifecycle
      transition. What exists in the backend but is not Layer 0 is shown and explained.
    </p>
  </header>

  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {#each decisions as d (d.title)}
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 class="text-base font-semibold text-gray-900">{d.title}</h2>
        <p class="mt-1 text-sm text-gray-600">{d.body}</p>
      </div>
    {/each}
  </div>

  <section class="mt-6 flex flex-wrap items-center gap-3 text-sm">
    <span class="font-medium text-gray-700">Try:</span>
    <a class="text-blue-600 hover:underline" href={lobbyUrl}>Lobby</a>
    <a class="text-blue-600 hover:underline" href={groupUrl('grp_sensorica')}>Sensorica group</a>
    <a class="text-blue-600 hover:underline" href={groupUrl('grp_opensourceecology')}
      >OpenSourceEcology (Lynn created an NDO here)</a
    >
    <a
      class="text-blue-600 hover:underline"
      href={ndoUrl('uhC0kIdeationOnlyHashExample00001', 'grp_opensourceecology')}
      >NDO you created (transition enabled)</a
    >
    <a
      class="text-blue-600 hover:underline"
      href={ndoUrl('uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy', 'grp_sensorica')}
      >NDO by Bob (transition locked)</a
    >
  </section>

  <div class="mt-4 overflow-hidden rounded-lg border border-gray-300 shadow-sm" style="height: 820px">
    <div class="h-full overflow-auto">
      <AppShell
        {groups}
        activePath={descriptor || !group ? lobbyUrl : groupUrl(group.id)}
        profileNickname={MOCK_LOBBY_PROFILE.nickname}
        browseHref={lobbyUrl}
        groupHref={groupUrl}
        onprofileclick={() => {}}
      >
        {#if descriptor}
          <ResourceNdoView
            {descriptor}
            breadcrumb={ndoBreadcrumb}
            initiatorName={getMockInitiatorName(descriptor.hash)}
            isInitiator={descriptor.initiator === MY_KEY}
            members={ndoMembers[descriptor.hash] ?? []}
            joined={joined.includes(descriptor.hash)}
            onjoin={() => handleJoin(descriptor.hash)}
            {groups}
            associatedGroupIds={getAssociatedGroupIds(groups, descriptor.hash)}
            onassociate={(ids) => {
              groups = associateNdoWithGroups(groups, descriptor.hash, ids);
            }}
            candidateNdos={allNdos}
            ndoLink={absolute(ndoUrl(descriptor.hash, groupId))}
            operationalState={OPERATIONAL[descriptor.hash] ?? null}
            transitionHistory={descriptor.lifecycle_stage === 'Active'
              ? [
                  {
                    from_stage: 'Stable',
                    to_stage: 'Active',
                    agent: MOCK_AGENT_NAMES.tibi,
                    timestamp: 1711000000000000,
                    event_hash: 'uhC0keventHashExample001'
                  }
                ]
              : []}
            oncreatendo={group ? () => goto(`${groupUrl(group.id)}&createNdo=1`) : undefined}
          />
        {:else if group}
          <GroupPerspectivesView
            {group}
            groupId={group.id}
            ndos={groupNdos}
            members={getMockGroupMembers(group.id, group.createdBy)}
            myAgentKey={MY_KEY}
            joinedHashes={joined}
            allNdosForDuplicateCheck={allNdos}
            breadcrumb={groupBreadcrumb}
            autoOpenCreateModal={page.url.searchParams.get('createNdo') === '1'}
            ndoHref={(hash) => ndoUrl(hash, group.id)}
            ndoLink={(hash) => absolute(ndoUrl(hash, group.id))}
            oncreatendo={handleCreate}
          />
        {:else}
          <div class="p-6">
            <div class="mb-3"><Breadcrumb items={[{ label: 'Lobby' }]} /></div>
            <h1 class="mb-4 text-2xl font-bold text-gray-900">Lobby</h1>
            <NdoBrowser
              descriptors={lobbyNdos}
              activeFilters={lobbyFilters}
              ndoHref={(hash) => ndoUrl(hash)}
              onfilterchange={(f) => (lobbyFilters = { ...lobbyFilters, ...f })}
              onclearfilters={() => (lobbyFilters = { ...EMPTY_FILTERS })}
            />
          </div>
        {/if}
      </AppShell>
    </div>
  </div>

  <section class="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
    <h2 class="text-sm font-semibold text-amber-800">Open questions</h2>
    <ul class="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-700">
      <li>Popup on click versus an inline explainer inside each tab. The popup is what is shown here.</li>
      <li>The Overview tab is added so the tab bar has a live entry; the app has no such tab today.</li>
      <li>
        Offer opens a popup with a shortcut to Create NDO. Whether Offer should go straight to the
        creation form is undecided.
      </li>
      <li>Whether Layer 1/2 forms stay reachable behind a dev flag for internal testing.</li>
    </ul>
  </section>
</div>
