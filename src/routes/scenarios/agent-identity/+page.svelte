<script lang="ts">
  // Scenario: the identity ladder. Three levels, each with a cost and a
  // capability. The point of the page is that the costs are asymmetric — level 1
  // is free and reversible, level 3 is permanent — and the UI should make that
  // asymmetry visible rather than smoothing it over.
  import { paths } from '$lib/paths';
  import { capabilitiesFor, type JoiningStatus } from '$lib/guards/useJoiningGuard.svelte';

  const rungs: { status: JoiningStatus; level: string; title: string; where: string; cost: string }[] = [
    {
      status: 'no-lobby-profile',
      level: 'Level 0',
      title: 'Anonymous',
      where: 'nothing stored',
      cost: 'None. Browse the lobby, read every NDO.',
    },
    {
      status: 'browsing',
      level: 'Level 1',
      title: 'LobbyUserProfile',
      where: 'localStorage',
      cost: 'A nickname. Reversible, private to this browser, never gossiped.',
    },
    {
      status: 'member',
      level: 'Level 2',
      title: 'GroupMemberProfile',
      where: 'localStorage, per group',
      cost: 'A disclosure choice per group. Membership itself is a DHT entry on that group cell.',
    },
    {
      status: 'active',
      level: 'Level 3',
      title: 'Person entry',
      where: 'zome_person, public DHT',
      cost: 'Permanent. Person entries cannot be deleted — contribution history is not erasable.',
    },
  ];

  let selected = $state<JoiningStatus>('browsing');
  const can = $derived(capabilitiesFor(selected));
</script>

<div class="ndo-shell__content">
  <header>
    <h1 class="ndo-h1">🪪 Agent identity</h1>
    <p class="ndo-p mt-2" style="max-width:64ch">
      Most applications ask for an account before they show anything. Nondominium inverts that: the
      whole lobby is readable with no identity, and each rung of the ladder is climbed only when an
      action actually needs it. The last rung is the expensive one, so it is the last one.
    </p>
  </header>

  <div class="rungs">
    {#each rungs as rung (rung.status)}
      <button
        class="rung"
        class:rung--on={selected === rung.status}
        onclick={() => (selected = rung.status)}
      >
        <span class="ndo-label">{rung.level}</span>
        <strong class="ndo-h3">{rung.title}</strong>
        <span class="ndo-mono">{rung.where}</span>
        <span class="ndo-small">{rung.cost}</span>
      </button>
    {/each}
  </div>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">What that rung permits</h2></div>
    <div class="ndo-panel__body">
      <ul class="caps">
        <li class={can.canBrowse ? 'yes' : 'no'}>Browse the lobby</li>
        <li class={can.canJoinGroup ? 'yes' : 'no'}>Join or create a group</li>
        <li class={can.canWriteToDht ? 'yes' : 'no'}>Create an NDO, accept a commitment</li>
        <li class={can.canParticipateInGovernance ? 'yes' : 'no'}>Participate in governance</li>
      </ul>
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Why the gate is late, not early</h2></div>
    <div class="ndo-panel__body flex flex-col gap-3">
      <p class="ndo-small">
        Asking for identity up front is a high-information-cost solution applied to a
        low-information-need situation. Reading a public commons register needs no credential, the
        same way boarding a bus needs a ticket rather than a passport.
      </p>
      <p class="ndo-small">
        Deferring it also keeps the permanent record honest. A Person entry that exists because
        somebody wanted to look around is noise in a structure whose whole value is that its
        contribution history cannot be rewritten.
      </p>
    </div>
  </section>

  <p class="ndo-small">
    Live version: <a href={paths.profileSetup()}>level 1</a>,
    <a href={paths.groupProfile('gr1')}>level 2</a>,
    <a href={paths.profileGuard()}>level 3</a>.
  </p>
</div>

<style>
  .rungs { display: grid; gap: var(--ndo-spacing-3); grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
  .rung {
    display: flex; flex-direction: column; gap: 4px; text-align: left;
    padding: var(--ndo-spacing-4); border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-lg); background: rgb(var(--ndo-color-card-bg));
    font: inherit; cursor: pointer; transition: var(--ndo-transition-colors);
  }
  .rung:hover { border-color: rgb(var(--ndo-primary-300)); }
  .rung--on { border-color: rgb(var(--ndo-primary-500)); background: rgb(var(--ndo-primary-50)); }
  .caps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; font-size: var(--ndo-text-sm); }
  .caps li::before { margin-right: 8px; }
  .yes::before { content: '✅'; }
  .no::before { content: '⬜'; }
  .no { color: var(--ndo-color-text-muted); }
  a { color: var(--ndo-color-link); }
</style>
