<script lang="ts">
  // Scenario: a group from one member to four. The claim under review is that
  // membership over a gossiping DHT is eventually consistent, and that the UI
  // has to reconcile rather than assume.
  import { paths } from '$lib/paths';
  import { INITIAL_AGENTS, INITIAL_GROUPS, INITIAL_NDOS, INITIAL_WORK_LOG } from '$lib/mock';
  import NdoCard from '$lib/components/shared/NdoCard.svelte';

  const group = INITIAL_GROUPS[0];
  const members = group.memberIds.map((id) => INITIAL_AGENTS.find((a) => a.id === id)!);
  const ndos = INITIAL_NDOS.filter((n) => n.groupIds.includes(group.id)).slice(0, 3);
  const log = INITIAL_WORK_LOG.filter((w) => w.groupId === group.id);

  const steps = [
    { icon: '➕', title: 'Create', body: 'A clone cell is provisioned with a fresh network seed, a GroupProfile is committed to it, and the group is announced on the Lobby DNA.' },
    { icon: '🔗', title: 'Invite', body: 'The invite link is a base64 payload of seed, DNA hash and name. Anyone holding it can provision the same-seed clone.' },
    { icon: '🕶️', title: 'Disclose', body: 'On first entry each member chooses what their lobby profile shows to this group. The choice is per group and stays local.' },
    { icon: '📓', title: 'Contribute', body: 'Work is logged on the group cell, then validated into contributions against specific NDOs.' },
  ];
</script>

<div class="ndo-shell__content">
  <header>
    <h1 class="ndo-h1">👥 Group collaboration</h1>
    <p class="ndo-p mt-2" style="max-width:64ch">
      A group is not a row in a table. It is a cloned DNA cell with its own DHT, which makes every
      membership operation an eventually-consistent one.
    </p>
  </header>

  <div class="steps">
    {#each steps as step (step.title)}
      <div class="ndo-card">
        <span style="font-size:1.4rem" aria-hidden="true">{step.icon}</span>
        <h2 class="ndo-h3 mt-2">{step.title}</h2>
        <p class="ndo-small mt-1">{step.body}</p>
      </div>
    {/each}
  </div>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">Why the UI reconciles on every open</h2></div>
    <div class="ndo-panel__body flex flex-col gap-3">
      <p class="ndo-small">
        Joining commits a membership entry best-effort. If that commit lands late, or the gossip has
        not reached a peer, the joining agent is missing from someone else's member list — and the
        list is not wrong, it is just early.
      </p>
      <p class="ndo-small">
        So opening a group resolves the group hash, checks membership, and joins if it is missing.
        Idempotent, cheap, and it means a member never has to be told to reload. Cross-member
        visibility still arrives on gossip: the MVP pulls on focus and on a gentle poll, and a
        signal-based push is the documented next step.
      </p>
    </div>
  </section>

  <section class="ndo-panel">
    <div class="ndo-panel__head">
      <h2 class="ndo-h3">{group.name}</h2>
      <span class="ndo-mono">{group.networkSeed}</span>
    </div>
    <div class="ndo-panel__body flex flex-col gap-4">
      <div>
        <p class="ndo-label mb-2">{members.length} members</p>
        <div class="flex flex-wrap gap-3">
          {#each members as member (member.id)}
            <span class="member">
              <span class="avatar" aria-hidden="true">{member.person ? member.person.name[0] : '🔑'}</span>
              <span class="ndo-small">{member.person?.name ?? member.pubKey}</span>
            </span>
          {/each}
        </div>
      </div>
      <div>
        <p class="ndo-label mb-2">Recent work</p>
        <ul class="log">
          {#each log as entry (entry.id)}
            <li>
              <span class="ndo-small">{entry.summary}</span>
              <span class="ndo-field__hint">{entry.at} · {entry.hours}h</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </section>

  <div class="grid">
    {#each ndos as ndo (ndo.id)}
      <NdoCard {ndo} />
    {/each}
  </div>

  <p class="ndo-small">Live version: <a href={paths.groupDetail('gr1')}>the group view</a>.</p>
</div>

<style>
  .steps { display: grid; gap: var(--ndo-spacing-4); grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
  .grid { display: grid; gap: var(--ndo-spacing-4); grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
  .member { display: inline-flex; align-items: center; gap: 8px; }
  .avatar {
    width: 32px; height: 32px; border-radius: var(--ndo-radius-pill);
    background: rgb(var(--ndo-primary-100)); color: rgb(var(--ndo-primary-700));
    display: grid; place-items: center; font-weight: var(--ndo-weight-bold);
  }
  .log { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .log li { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  a { color: var(--ndo-color-link); }
</style>
