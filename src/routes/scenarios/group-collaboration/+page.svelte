<script lang="ts">
  // A group from one member to four, and the consistency problem underneath it.
  import { paths } from '$lib/paths';
  import MemberList from '$lib/replica/group/MemberList.svelte';
  import GroupProfileModal from '$lib/replica/group/GroupProfileModal.svelte';
  import { INITIAL_GROUP_MEMBERS } from '$lib/replica/mock';

  let show = $state(false);
  const members = INITIAL_GROUP_MEMBERS['sensorica-lab-7f3a'];

  const steps = [
    { title: 'Create', body: 'A clone cell is provisioned with a fresh network seed, a GroupProfile is committed to it, and the group is announced on the Lobby DNA.' },
    { title: 'Invite', body: 'The invite link is a base64 payload of seed, DNA hash and name. The button that copies it is invisible until you hover the group row.' },
    { title: 'Disclose', body: 'On first entry each member chooses what their Lobby profile shows to this group. The choice is per group and stays in localStorage.' },
    { title: 'Work', body: 'Members appear in the list only once their membership entry has gossiped to you.' }
  ];
</script>

<div class="p-6">
  <header class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Group collaboration</h1>
    <p class="mt-2 max-w-2xl text-sm text-gray-600">
      A group is not a row in a table. It is a cloned DNA cell with its own DHT, which makes every
      membership operation eventually consistent — and that is a UI problem, not just a backend one.
    </p>
  </header>

  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {#each steps as step (step.title)}
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-900">{step.title}</h2>
        <p class="mt-1 text-sm text-gray-600">{step.body}</p>
      </div>
    {/each}
  </div>

  <section class="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <h2 class="text-base font-semibold text-gray-900">Why the group view polls itself</h2>
    <p class="mt-2 text-sm text-gray-600">
      Joining commits a membership entry best-effort. If that commit lands late, or gossip has not
      reached a peer, the joining agent is missing from someone else's member list — and the list is
      not wrong, it is early. So <code class="font-mono text-xs">GroupView.svelte</code> refreshes on
      window focus, on visibility change, and on an eight-second interval.
    </p>
    <p class="mt-2 text-sm text-gray-600">
      Nothing in the interface says any of this. A member who does not see a colleague has no way to
      tell "not joined" from "not yet arrived", and no affordance to check.
    </p>
  </section>

  <div class="mt-6 max-w-md">
    <MemberList {members} />
  </div>

  <section class="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
    <h2 class="text-sm font-semibold text-amber-800">Open questions</h2>
    <ul class="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-700">
      <li>No freshness indicator. A silent eight-second poll and a stale list look identical.</li>
      <li>The member list shows a name and an optional role; there is no way to see who is the initiator.</li>
      <li>The disclosure modal opens once per group and is dismissible with Skip, after which there is no obvious route back to it.</li>
    </ul>
  </section>

  <div class="mt-6 flex items-center gap-3">
    <button
      type="button"
      onclick={() => (show = true)}
      class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Open the disclosure modal
    </button>
    <a class="text-sm text-blue-600 hover:underline" href={paths.groupDetail('sensorica-lab-7f3a')}>
      Open the group in the prototype
    </a>
  </div>
</div>

{#if show}
  <GroupProfileModal
    groupId="sensorica-lab-7f3a"
    onclose={() => (show = false)}
    onsave={() => (show = false)}
  />
{/if}
