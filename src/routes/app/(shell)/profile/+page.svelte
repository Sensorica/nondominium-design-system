<script lang="ts">
  // The agent's own three-level identity, laid out as a ladder so it is obvious
  // which rung they are on and what the next one costs.
  import { paths } from '$lib/paths';
  import { appState, ME_ID, agentById } from '$lib/state.svelte';
  import { joining } from '$lib/guards/joining.svelte';
  import NdoBadge from '$lib/components/shared/NdoBadge.svelte';

  const me = $derived(agentById(ME_ID));
  const myGroups = $derived(appState.groups.filter((g) => g.memberIds.includes(ME_ID)));
  const myNdos = $derived(appState.ndos.filter((n) => n.initiator === ME_ID));
</script>

<header class="flex items-start justify-between gap-4">
  <div>
    <h1 class="ndo-h1">🪪 My identity</h1>
    <p class="ndo-p mt-2">Three levels, each committed only when it is needed.</p>
  </div>
  <a class="ndo-btn ndo-btn--ghost" href={paths.profileEdit()}>Edit</a>
</header>

<section class="ndo-panel">
  <div class="ndo-panel__head"><h2 class="ndo-h3">Level 1 — Lobby profile</h2></div>
  <div class="ndo-panel__body">
    {#if appState.profile}
      <dl class="rows">
        <div><dt>Nickname</dt><dd>{appState.profile.nickname}</dd></div>
        {#if appState.profile.realName}<div><dt>Real name</dt><dd>{appState.profile.realName}</dd></div>{/if}
        {#if appState.profile.bio}<div><dt>Bio</dt><dd>{appState.profile.bio}</dd></div>{/if}
        {#if appState.profile.email}<div><dt>Email</dt><dd>{appState.profile.email}</dd></div>{/if}
      </dl>
      <p class="ndo-field__hint mt-3">Stored in this browser only. Never written to the DHT.</p>
    {:else}
      <p class="ndo-small">No lobby profile. <a href={paths.profileSetup()}>Set one up</a>.</p>
    {/if}
  </div>
</section>

<section class="ndo-panel">
  <div class="ndo-panel__head"><h2 class="ndo-h3">Level 2 — Group disclosure</h2></div>
  <div class="ndo-panel__body flex flex-col gap-3">
    {#each myGroups as group (group.id)}
      <div class="flex items-center justify-between gap-3">
        <span class="ndo-small"><strong>{group.name}</strong></span>
        <span class="flex items-center gap-2">
          {#if group.memberProfile}
            <span class="ndo-badge ndo-badge--neutral">
              {group.memberProfile.isAnonymous ? '🕶️ Anonymous' : `👁️ ${group.memberProfile.shownFields.length} field(s) shared`}
            </span>
          {:else}
            <span class="ndo-badge ndo-badge--coming-soon">Not chosen</span>
          {/if}
          <a class="ndo-small" href={paths.groupProfile(group.id)}>Change</a>
        </span>
      </div>
    {/each}
  </div>
</section>

<section class="ndo-panel">
  <div class="ndo-panel__head"><h2 class="ndo-h3">Level 3 — Person entry</h2></div>
  <div class="ndo-panel__body">
    {#if me?.person}
      <dl class="rows">
        <div><dt>Name</dt><dd>{me.person.name}</dd></div>
        <div><dt>Agent key</dt><dd class="ndo-mono">{me.pubKey}</dd></div>
        <div>
          <dt>Roles</dt>
          <dd class="flex flex-wrap gap-1.5">
            {#each me.roles as role (role)}
              <NdoBadge variant="neutral" label={role} icon={false} />
            {/each}
          </dd>
        </div>
        <div><dt>Joined</dt><dd>{me.joinedAt}</dd></div>
      </dl>
      <p class="ndo-field__hint mt-3">
        Public, discoverable, and permanent. Person entries cannot be deleted — contribution history
        is not retroactively erasable.
      </p>
    {:else}
      <p class="ndo-small">
        No Person entry yet. One is committed the first time you write to the DHT.
        <a href={paths.profileGuard()}>See what that involves</a>.
      </p>
    {/if}
  </div>
</section>

<section class="ndo-panel">
  <div class="ndo-panel__head"><h2 class="ndo-h3">NDOs I initiated</h2></div>
  <div class="ndo-panel__body">
    {#if myNdos.length === 0}
      <p class="ndo-small">None yet.</p>
    {:else}
      <ul class="list">
        {#each myNdos as ndo (ndo.id)}
          <li>
            <a href={paths.ndoDetail(ndo.id)}>{ndo.name}</a>
            <NdoBadge stage={ndo.lifecycle_stage} />
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>

<style>
  .rows { margin: 0; display: flex; flex-direction: column; gap: 8px; }
  .rows > div { display: grid; grid-template-columns: 140px 1fr; gap: var(--ndo-spacing-3); align-items: baseline; }
  dt { font-size: var(--ndo-text-xs); color: var(--ndo-color-text-muted); }
  dd { margin: 0; font-size: var(--ndo-text-sm); color: var(--ndo-color-text-primary); }
  .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .list li { display: flex; align-items: center; justify-content: space-between; gap: var(--ndo-spacing-3); }
  a { color: var(--ndo-color-link); }
</style>
