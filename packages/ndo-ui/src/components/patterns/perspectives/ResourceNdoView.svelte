<script lang="ts">
  import type {
    GroupDescriptor,
    GroupMember,
    NdoDescriptor,
    NdoTransitionHistoryEvent
  } from '../../../domain/types.js';
  import { getComingNext, type OperationalStateLabel } from '../../../domain/coming-next.js';
  import { formatDate, truncateHash } from '../../../domain/format.js';
  import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb.svelte';
  import NdoActionRow from './NdoActionRow.svelte';
  import NdoIdentityPanel from '../ndo/NdoIdentityPanel.svelte';
  import ForkNdoModal from '../ndo/ForkNdoModal.svelte';
  import AssociateNdoModal from '../ndo/AssociateNdoModal.svelte';
  import LifecycleTransitionModal from '../ndo/LifecycleTransitionModal.svelte';
  import MemberList from '../group/MemberList.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';
  import ComingNextPopup from '../../primitives/ComingNextPopup.svelte';
  import SoonBadge from '../../primitives/SoonBadge.svelte';

  type TabId = 'overview' | 'resources' | 'governance' | 'composition' | 'activity';

  interface Props {
    descriptor: NdoDescriptor | null;
    breadcrumb?: BreadcrumbItem[];
    initiatorName?: string | null;
    /** True when the current agent created this NDO: the only one who can advance the stage. */
    isInitiator?: boolean;
    transitionHistory?: NdoTransitionHistoryEvent[];
    /** NDO members (agents who joined). */
    members?: GroupMember[];
    /** Whether the current agent has joined. */
    joined?: boolean;
    onjoin?: () => void | Promise<void>;
    groups?: GroupDescriptor[];
    associatedGroupIds?: string[];
    onassociate?: (groupIds: string[]) => void | Promise<void>;
    onlifecycleconfirm?: (payload: { newStage: string; successorHash?: string }) => void | Promise<void>;
    candidateNdos?: NdoDescriptor[];
    /** Absolute deep link copied by "Copy NDO link". */
    ndoLink?: string;
    /** Read-only operational state, shown only when the data exists. */
    operationalState?: OperationalStateLabel | null;
    /** The Create NDO shortcut offered from the Offer popup. */
    oncreatendo?: () => void;
  }

  let {
    descriptor,
    breadcrumb = [],
    initiatorName = null,
    isInitiator = false,
    transitionHistory = [],
    members = [],
    joined = false,
    onjoin,
    groups = [],
    associatedGroupIds = [],
    onassociate,
    onlifecycleconfirm,
    candidateNdos = [],
    ndoLink,
    operationalState = null,
    oncreatendo
  }: Props = $props();

  let tab = $state<TabId>('overview');
  let showFork = $state(false);
  let showAssociate = $state(false);
  let showTransition = $state(false);
  let showJoinPanel = $state(false);
  let soonId = $state<string | null>(null);
  let linkCopied = $state(false);
  let joining = $state(false);

  const tabs: { id: TabId; label: string; soonId?: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'resources', label: 'Resources', soonId: 'tab-resources' },
    { id: 'governance', label: 'Governance', soonId: 'tab-governance' },
    { id: 'composition', label: 'Composition', soonId: 'tab-composition' },
    { id: 'activity', label: 'Activity', soonId: 'tab-activity' }
  ];

  const OPERATIONAL_LABEL: Record<OperationalStateLabel, string> = {
    Available: 'Available',
    Reserved: 'Reserved',
    InTransit: 'In transit',
    InStorage: 'In storage',
    InMaintenance: 'In maintenance',
    InUse: 'In use'
  };

  function chooseTab(t: (typeof tabs)[number]) {
    if (t.soonId) {
      // Layer 1/2 content is not live: explain it, stay where we are.
      soonId = t.soonId;
      return;
    }
    tab = t.id;
  }

  async function copyLink() {
    if (!ndoLink) return;
    try {
      await navigator.clipboard.writeText(ndoLink);
      linkCopied = true;
      setTimeout(() => (linkCopied = false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  async function handleJoin() {
    joining = true;
    try {
      await onjoin?.();
    } finally {
      joining = false;
    }
  }

  const canAssociate = $derived(Boolean(descriptor && onassociate && groups.length > 0));
  const allAssociated = $derived(
    groups.length > 0 && groups.every((g) => associatedGroupIds.includes(g.id))
  );
</script>

{#if soonId}
  <ComingNextPopup featureId={soonId} onclose={() => (soonId = null)} />
{/if}

{#if showFork && descriptor}
  <ForkNdoModal {descriptor} onclose={() => (showFork = false)} />
{/if}

{#if showAssociate && descriptor && onassociate}
  <AssociateNdoModal
    ndoName={descriptor.name}
    {groups}
    {associatedGroupIds}
    onclose={() => (showAssociate = false)}
    onconfirm={async (groupIds) => {
      await onassociate(groupIds);
    }}
  />
{/if}

{#if showTransition && descriptor}
  <LifecycleTransitionModal
    {descriptor}
    {candidateNdos}
    onclose={() => (showTransition = false)}
    onconfirm={async (payload) => {
      await onlifecycleconfirm?.(payload);
      showTransition = false;
    }}
  />
{/if}

<div data-testid="resource-ndo-view">
  <div class="border-b border-gray-200 bg-white px-6 pt-4">
    {#if breadcrumb.length > 0}
      <div class="mb-3"><Breadcrumb items={breadcrumb} /></div>
    {/if}

    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900">{descriptor?.name ?? 'NDO'}</h1>
        {#if descriptor?.hash}
          <p class="mt-1 font-mono text-xs text-gray-400">{truncateHash(descriptor.hash, 20)}</p>
        {/if}
      </div>
      <div class="ml-4 flex shrink-0 flex-wrap items-center justify-end gap-2">
        <NdoButton
          variant="ghost"
          class="px-3 py-1.5 text-xs"
          onclick={() => (showJoinPanel = !showJoinPanel)}
        >
          {joined ? 'Joined ✓' : 'Join NDO'}
        </NdoButton>
        <NdoButton
          variant="ghost"
          class="border-blue-300 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50"
          disabled={!canAssociate || allAssociated}
          onclick={() => (showAssociate = true)}
        >
          Associate with a group
        </NdoButton>
        {#if descriptor}
          <NdoButton variant="ghost" class="px-3 py-1.5 text-xs" onclick={() => (showFork = true)}>
            Fork this NDO
          </NdoButton>
        {/if}
        {#if ndoLink}
          <NdoButton variant="ghost" class="px-3 py-1.5 text-xs" onclick={copyLink}>
            {linkCopied ? 'Link copied' : '🔗 Copy NDO link'}
          </NdoButton>
        {/if}
      </div>
    </div>

    <nav class="mt-4 flex gap-2" aria-label="NDO sections">
      {#each tabs as t (t.id)}
        <button
          type="button"
          data-tab={t.id}
          title={t.soonId ? getComingNext(t.soonId)?.tooltip : undefined}
          class="flex items-center gap-1.5 rounded-t border border-b-0 px-3 py-2 text-sm font-medium transition-colors {tab ===
          t.id
            ? 'border-gray-200 bg-gray-50 text-gray-900'
            : 'border-transparent text-gray-500 hover:text-gray-800'}"
          onclick={() => chooseTab(t)}
        >
          {t.label}
          {#if t.soonId}<SoonBadge />{/if}
        </button>
      {/each}
    </nav>
  </div>

  {#if descriptor}
    <div class="mx-6 mt-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {#if descriptor.description}
          <div class="sm:col-span-2">
            <p class="text-xs font-semibold tracking-wide text-gray-400 uppercase">Description</p>
            <p class="mt-1 text-sm text-gray-800">{descriptor.description}</p>
          </div>
        {/if}
        <div>
          <p class="text-xs font-semibold tracking-wide text-gray-400 uppercase">Property regime</p>
          <p class="mt-1 text-sm font-medium text-gray-800">{descriptor.property_regime ?? '—'}</p>
        </div>
        <div>
          <p class="text-xs font-semibold tracking-wide text-gray-400 uppercase">Resource nature</p>
          <p class="mt-1 text-sm font-medium text-gray-800">{descriptor.resource_nature ?? '—'}</p>
        </div>
        <div>
          <p class="text-xs font-semibold tracking-wide text-gray-400 uppercase">Lifecycle stage</p>
          <p class="mt-1 text-sm font-medium text-gray-800">{descriptor.lifecycle_stage ?? '—'}</p>
        </div>
        {#if descriptor.created_at}
          <div>
            <p class="text-xs font-semibold tracking-wide text-gray-400 uppercase">Created</p>
            <p class="mt-1 text-sm text-gray-600">{formatDate(descriptor.created_at)}</p>
          </div>
        {/if}
        {#if operationalState}
          <div>
            <p class="text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Operational state
            </p>
            <p data-testid="operational-state" class="mt-1 text-sm font-medium text-gray-800">
              {OPERATIONAL_LABEL[operationalState]}
            </p>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if showJoinPanel}
    <div class="mx-6 mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4" data-testid="join-panel">
      <h2 class="text-sm font-semibold text-gray-800">NDO membership</h2>
      <p class="mt-1 text-xs text-gray-500">
        Joining an NDO records your participation. This is distinct from associating the NDO with a
        group (a curated short list for group members).
      </p>
      <div class="mt-3">
        <NdoButton class="px-3 py-1.5 text-xs" disabled={joined || joining} onclick={handleJoin}>
          {joined ? 'You have joined this NDO' : joining ? 'Joining…' : 'Join this NDO'}
        </NdoButton>
      </div>
      <MemberList
        {members}
        onmemberclick={() => {
          soonId = 'jump-agent';
        }}
      />
    </div>
  {/if}

  <NdoIdentityPanel
    {descriptor}
    {initiatorName}
    {transitionHistory}
    {isInitiator}
    lockedTransition
    ontransitionclick={() => (showTransition = true)}
    onlockedtransitionclick={() => (soonId = 'governed-transitions')}
    oninitiatorclick={() => (soonId = 'jump-agent')}
  />

  <div class="p-6">
    <NdoActionRow {oncreatendo} />
  </div>
</div>
