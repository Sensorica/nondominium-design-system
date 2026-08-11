<script lang="ts">
  // Scenario index. A scenario is a composed page that answers a question about
  // how the system behaves, not a component demo. Each one is commentable under
  // its own key, so a reviewer can argue with the flow rather than the widget.
  import { paths } from '$lib/paths';

  const scenarios = [
    {
      href: paths.scenarioLobbyBrowse(),
      icon: '🏛️',
      title: 'Lobby browse',
      body: 'Filtering across three orthogonal dimensions, and what an empty result should say.',
    },
    {
      href: paths.scenarioNdoCreation(),
      icon: '➕',
      title: 'NDO creation',
      body: 'Why creation is group-scoped, and which of the four choices are permanent.',
    },
    {
      href: paths.scenarioNdoLifecycle(),
      icon: '🔄',
      title: 'NDO lifecycle',
      body: 'The ten-stage ladder end to end, including hibernation and the two terminal stages.',
    },
    {
      href: paths.scenarioGroupCollaboration(),
      icon: '👥',
      title: 'Group collaboration',
      body: 'Invite, join, disclose, contribute — a group from one member to four.',
    },
    {
      href: paths.scenarioAgentIdentity(),
      icon: '🪪',
      title: 'Agent identity',
      body: 'The three-level ladder, and what each rung costs.',
    },
    {
      href: paths.scenarioGovernanceReview(),
      icon: '⚖️',
      title: 'Governance review',
      body: 'Contributions, validation, and benefit redistribution on a mature NDO.',
    },
  ];
</script>

<div class="ndo-shell__content">
  <header>
    <h1 class="ndo-h1">🖼️ Scenarios</h1>
    <p class="ndo-p mt-2" style="max-width:62ch">
      Six composed pages. Where the playbook shows a component in isolation, a scenario shows what
      happens when several of them have to agree with each other.
    </p>
  </header>

  <div class="grid">
    {#each scenarios as scenario (scenario.href)}
      <a class="ndo-card ndo-card--interactive" href={scenario.href}>
        <span style="font-size:1.5rem" aria-hidden="true">{scenario.icon}</span>
        <h2 class="ndo-h3 mt-2">{scenario.title}</h2>
        <p class="ndo-small mt-1">{scenario.body}</p>
      </a>
    {/each}
  </div>
</div>

<style>
  .grid { display: grid; gap: var(--ndo-spacing-4); grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
</style>
