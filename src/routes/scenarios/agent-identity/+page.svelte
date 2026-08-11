<script lang="ts">
  // The three-level identity ladder, as the app implements it.
  import { paths } from '$lib/paths';

  const rungs = [
    {
      level: 'Level 0',
      title: 'Anonymous',
      where: 'nothing stored',
      cost: 'None. Browse the lobby, open any NDO.',
      surface: 'The lobby renders in full with no profile at all.'
    },
    {
      level: 'Level 1',
      title: 'LobbyUserProfile',
      where: 'localStorage',
      cost: 'A nickname. Reversible, local to this browser, never gossiped.',
      surface: 'ProfileSetupModal on first launch; it cannot be dismissed until a nickname exists.'
    },
    {
      level: 'Level 2',
      title: 'GroupMemberProfile',
      where: 'localStorage, per group',
      cost: 'A disclosure choice per group. Membership itself is a DHT entry on the group cell.',
      surface: 'GroupProfileModal on first entry to each group.'
    },
    {
      level: 'Level 3',
      title: 'Person entry',
      where: 'zome_person, public DHT',
      cost: 'Permanent. Person entries cannot be deleted.',
      surface: 'No screen. It is committed as a side effect of acting.'
    }
  ];
</script>

<div class="p-6">
  <header class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Agent identity</h1>
    <p class="mt-2 max-w-2xl text-sm text-gray-600">
      Most applications ask for an account before showing anything. Nondominium inverts that: the
      whole lobby reads with no identity, and each rung is climbed only when an action needs it.
    </p>
  </header>

  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {#each rungs as rung (rung.level)}
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p class="text-xs font-semibold tracking-wide text-gray-400 uppercase">{rung.level}</p>
        <h2 class="mt-1 text-lg font-semibold text-gray-900">{rung.title}</h2>
        <p class="mt-1 font-mono text-xs text-gray-400">{rung.where}</p>
        <p class="mt-2 text-sm text-gray-600">{rung.cost}</p>
        <p class="mt-2 text-xs text-gray-500">{rung.surface}</p>
      </div>
    {/each}
  </div>

  <section class="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <h2 class="text-base font-semibold text-gray-900">Where the ladder shows in the UI</h2>
    <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
      <li>The sidebar's bottom row reads <em>Set up profile</em> at level 0 and <em>nickname · Edit profile</em> from level 1.</li>
      <li>The lobby's top strip reads <em>No Lobby profile yet</em> or <em>Signed in as …</em>, duplicating that state two hundred pixels away.</li>
      <li>The lobby header adds <em>Agent: name</em> only once a Person entry exists — the only level-3 indicator anywhere.</li>
      <li>An NDO's initiator renders as a linked name if a Person exists, and as a truncated key if not.</li>
    </ul>
  </section>

  <section class="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
    <h2 class="text-sm font-semibold text-amber-800">Open questions</h2>
    <ul class="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-700">
      <li>Three different places tell you who you are, and none of them tells you which level you are on.</li>
      <li>Nothing warns before the level-3 write. A Person entry is permanent and is created as a side effect.</li>
      <li>The initiator link points at <code class="font-mono text-xs">/agent/&lt;key&gt;</code>, a route the app does not have.</li>
    </ul>
  </section>

  <p class="mt-4 text-sm text-gray-500">
    Live:
    <a class="text-blue-600 hover:underline" href={paths.lobbyProfileSetup()}>level 1</a>,
    <a class="text-blue-600 hover:underline" href={paths.groupProfile('sensorica-lab-7f3a')}>level 2</a>,
    <a class="text-blue-600 hover:underline" href={paths.agentProfile('uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2')}>the missing agent route</a>.
  </p>
</div>
