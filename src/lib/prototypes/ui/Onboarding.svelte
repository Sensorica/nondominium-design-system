<script lang="ts">
  // First-run flow, identical in every direction. It shows while there is no
  // profile or no group, in three steps:
  //   1 Profile   zome_person::create_person → lobby::upsert_lobby_agent_profile
  //   2 Network   join the example network, start a blank group, or paste an invite
  //   3 First NDO optional: zome_resource::create_ndo → zome_group::create_ndo_anchor
  import './proto.css';
  import Field from './Field.svelte';
  import Choice from './Choice.svelte';
  import Call from './Call.svelte';
  import ErrorNote from './ErrorNote.svelte';
  import Avatar from './Avatar.svelte';
  import { focusOnMount } from './attach';
  import { isHttpsUrl } from './avatar';
  import { proto } from '../store/store.svelte';
  import { ENUM, type PropertyRegime, type ResourceNature } from '../store/logic';

  interface Props {
    /** Called with the id of the first NDO, once declared. */
    onndo?: (ndoId: string) => void;
    /** Called with a group id when one is created or joined. */
    ongroup?: (groupId: string) => void;
  }

  let { onndo, ongroup }: Props = $props();

  let step = $state<'ndo' | null>(null);
  let error = $state<string | null>(null);

  let pName = $state('');
  let pHandle = $state('');
  let pBio = $state('');
  let pAvatar = $state('');

  let gName = $state('');
  let gDesc = $state('');
  let code = $state('');

  let nName = $state('');
  let nDesc = $state('');
  let nNature = $state<ResourceNature>('Physical');
  let nRegime = $state<PropertyRegime>('Nondominium');
  let nGroup = $state<string | undefined>(undefined);

  const current = $derived(!proto.s.profile ? 'profile' : !proto.s.groups.length ? 'start' : step);
  const index = $derived(current === 'profile' ? 0 : current === 'start' ? 1 : 2);
  const newest = $derived(proto.s.groups[proto.s.groups.length - 1]);

  function createProfile() {
    const r = proto.actions.updateProfile({ name: pName, handle: pHandle, bio: pBio, avatar: pAvatar, roles: ['SimpleAgent'] });
    error = r.ok ? null : r.error;
  }

  function joinExample() {
    proto.actions.joinDemo();
    ongroup?.('sen');
  }

  function createGroup() {
    const r = proto.actions.createGroup({ name: gName, desc: gDesc });
    if (!r.ok) {
      error = r.error;
      return;
    }
    error = null;
    ongroup?.(r.value.id);
    nGroup = r.value.id;
    step = 'ndo';
  }

  function joinInvite() {
    const r = proto.actions.joinGroup(code);
    if (!r.ok) {
      error = r.error;
      return;
    }
    error = null;
    ongroup?.(r.value.id);
  }

  function declare() {
    const r = proto.actions.createNdo({ name: nName, desc: nDesc, nature: nNature, regime: nRegime, group: nGroup ?? newest?.id });
    if (!r.ok) {
      error = r.error;
      return;
    }
    step = null;
    onndo?.(r.value);
  }
</script>

{#if current}
  <div class="pu onboarding">
    <div class="column">
      <ol class="steps">
        {#each ['Profile', 'Network', 'First resource'] as l, i (l)}
          <li class:done={i <= index} class:now={i === index}><span></span>{i + 1} · {l}</li>
        {/each}
      </ol>

      {#if current === 'profile'}
        <header>
          <h1>Set up your profile</h1>
          <p class="pu-muted">Your name and picture are visible to the groups you join. Private details stay on your device.</p>
        </header>
        <Call c="zome_person::create_person → lobby::upsert_lobby_agent_profile" />
        <div class="pu-row preview">
          <Avatar id={pName || 'new'} name={pName || '?'} url={isHttpsUrl(pAvatar) ? pAvatar : null} size={72} ring />
          <p class="pu-muted">Without a picture, your initials show on a colour that is always the same for you.<br />Paste an https:// image link below to use your own.</p>
        </div>
        <div class="pu-grid two">
          <Field label="Name *"><input class="pu-input" bind:value={pName} placeholder="e.g. Marco" {@attach focusOnMount} /></Field>
          <Field label="Handle"><input class="pu-input" bind:value={pHandle} placeholder="e.g. marco-fablab" /></Field>
        </div>
        <Field label="Bio"><input class="pu-input" bind:value={pBio} placeholder="What you do, where" /></Field>
        <Field label="Picture URL (optional)"><input class="pu-input" bind:value={pAvatar} placeholder="https://…" /></Field>
        <p class="pu-muted">You start as a member. Trusted roles come later, when other members confirm them.</p>
        <ErrorNote {error} />
        <div class="pu-row pu-row--between">
          <button type="button" class="pu-link" onclick={() => proto.actions.reset()}>Skip, open the example network</button>
          <button type="button" class="pu-btn" disabled={!pName.trim()} onclick={createProfile}>Create profile</button>
        </div>
      {:else if current === 'start'}
        <header>
          <h1>Welcome, {proto.s.profile?.name}</h1>
          <p class="pu-muted">Resources live in groups. Start from the example network, from a blank group, or with an invite link.</p>
        </header>
        <div class="cards">
          <div class="pu-card card">
            <strong>Example network</strong>
            <p class="pu-muted grow">
              Join Sensorica and the Open Value Network: a shared CNC machine, a cryo-EM, an artwork on tour, a light sculpture and a
              sensor design, from the documented user stories.
            </p>
            <Call c="join_group × 2" />
            <button type="button" class="pu-btn" onclick={joinExample}>Join the example network</button>
          </div>
          <div class="pu-card card">
            <strong>Blank group</strong>
            <p class="pu-muted">Create a new, empty group. You'll add its first resource next.</p>
            <input class="pu-input" bind:value={gName} placeholder="Group name *" aria-label="Group name" />
            <input class="pu-input" bind:value={gDesc} placeholder="Description" aria-label="Group description" />
            <Call c="zome_group::create_group" />
            <button type="button" class="pu-btn" disabled={!gName.trim()} onclick={createGroup}>Create group</button>
          </div>
          <div class="pu-card card">
            <strong>Invite link</strong>
            <p class="pu-muted grow">
              Paste a link someone shared with you. Try the food basket network: <span class="pu-mono">ndo-invite:food-7k2p</span>
            </p>
            <input class="pu-input pu-mono" bind:value={code} placeholder="ndo-invite:…" aria-label="Invite link" />
            <Call c="zome_group::join_group" />
            <button type="button" class="pu-btn" disabled={!code.trim()} onclick={joinInvite}>Join group</button>
          </div>
        </div>
        <ErrorNote {error} />
      {:else}
        <header>
          <h1>Add your first shared resource</h1>
          <p class="pu-muted">
            {newest ? newest.name + ' is ready. ' : ''}A resource starts as an idea. You started it, so only you can move it through its
            stages.
          </p>
        </header>
        <Call c="zome_resource::create_ndo → zome_group::create_ndo_anchor" />
        <Field label="Name *"><input class="pu-input" bind:value={nName} placeholder="e.g. Shared 3D printer" {@attach focusOnMount} /></Field>
        <Field label="Description"><input class="pu-input" bind:value={nDesc} /></Field>
        <Field label="Type"><Choice options={ENUM.nature} value={nNature} onchange={(v) => (nNature = v as ResourceNature)} /></Field>
        <Field label="Ownership" hint={nRegime === 'Nondominium' ? 'Uncapturable: no agent can take unilateral control.' : null}>
          <Choice options={ENUM.regime} value={nRegime} onchange={(v) => (nRegime = v as PropertyRegime)} />
        </Field>
        <ErrorNote {error} />
        <div class="pu-row pu-row--between">
          <button type="button" class="pu-link" onclick={() => (step = null)}>Skip for now</button>
          <button type="button" class="pu-btn" disabled={!nName.trim()} onclick={declare}>Add resource</button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .onboarding {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: var(--_bg);
    color: var(--_ink);
    overflow: auto;
    display: flex;
    justify-content: center;
    padding: 48px 24px;
  }
  .column {
    width: 100%;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .steps {
    display: flex;
    gap: 6px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .steps li {
    flex: 1;
    font-size: 11px;
    color: var(--_muted);
  }
  .steps li span {
    display: block;
    height: 3px;
    border-radius: 2px;
    background: var(--_line);
    margin-bottom: 6px;
  }
  .steps li.done span {
    background: var(--_accent);
  }
  .steps li.now {
    color: var(--_ink);
  }
  h1 {
    margin: 0 0 4px;
    font-size: 26px;
    font-weight: 700;
  }
  .preview {
    gap: 16px;
    flex-wrap: nowrap;
  }
  .two {
    grid-template-columns: 1fr 1fr;
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }
  .card {
    border-radius: var(--_radius);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .card strong {
    font-size: 15px;
  }
  .grow {
    flex: 1;
  }
  @media (max-width: 560px) {
    .two {
      grid-template-columns: 1fr;
    }
  }
</style>
