<script lang="ts">
  // Your profile. First time: zome_person::create_person +
  // lobby::upsert_lobby_agent_profile; later update_person. Roles via
  // assign_person_role; private data via store_private_person_data.
  import Modal from './Modal.svelte';
  import Field from './Field.svelte';
  import Call from './Call.svelte';
  import ErrorNote from './ErrorNote.svelte';
  import ModalActions from './ModalActions.svelte';
  import AgentAvatar from './AgentAvatar.svelte';
  import { isHttpsUrl } from './avatar';
  import { proto } from '../store/store.svelte';
  import { ENUM, type RoleType } from '../store/logic';
  import { plain, developer } from '../plain';

  let { onclose }: { onclose: () => void } = $props();

  const pr = proto.s.profile;
  let name = $state(pr?.name ?? '');
  let handle = $state(pr?.handle ?? '');
  let bio = $state(pr?.bio ?? '');
  let avatar = $state(pr?.avatar ?? '');
  let email = $state(pr?.private.email ?? '');
  let location = $state(pr?.private.location ?? '');
  let timeZone = $state(pr?.private.time_zone ?? '');
  let roles = $state<RoleType[]>([...proto.me.roles]);
  let error = $state<string | null>(null);

  const rep = $derived(proto.q.reputation());

  function toggle(r: RoleType) {
    roles = roles.includes(r) ? roles.filter((x) => x !== r) : [...roles, r];
  }

  function submit() {
    const r = proto.actions.updateProfile({ name, handle, bio, avatar, email, location, time_zone: timeZone, roles });
    if (!r.ok) error = r.error;
    else onclose();
  }
</script>

<Modal
  title="Your profile"
  sub="Your name and picture are visible to your groups. Contact details stay private unless you choose to share them."
  {onclose}
  width={560}
>
  <div class="pu-row head">
    <AgentAvatar id={proto.me.id} size={64} url={isHttpsUrl(avatar) ? avatar : null} ring />
    <div class="who">
      <strong>{name || '?'}</strong>
      <p class="pu-muted">@{handle || name.toLowerCase().replace(/\s+/g, '')} · {proto.me.roles.map((r) => plain(r)).join(', ')}</p>
      {#if $developer}<p class="pu-muted pu-mono small">agent uhCAkT1b3r1usK9x… · roles {proto.me.roles.join(', ')}</p>{/if}
    </div>
  </div>
  <div class="pu-grid two">
    <Field label="Name *"><input class="pu-input" bind:value={name} /></Field>
    <Field label="Lobby handle"><input class="pu-input" bind:value={handle} placeholder="max 64 characters" /></Field>
  </div>
  <Field label="Bio"><input class="pu-input" bind:value={bio} /></Field>
  <Field label="Picture URL" hint="Optional, must start with https://. Without it, your initials are shown.">
    <input class="pu-input" bind:value={avatar} placeholder="https://…" />
  </Field>
  <p class="pu-sec">Private details{$developer ? ' · store_private_person_data' : ''}</p>
  <div class="pu-grid three">
    <Field label="Email"><input class="pu-input" bind:value={email} /></Field>
    <Field label="Location"><input class="pu-input" bind:value={location} /></Field>
    <Field label="Time zone"><input class="pu-input" bind:value={timeZone} /></Field>
  </div>
  <p class="pu-muted">
    Shared only when you allow it{$developer ? ' (grant_private_data_access)' : ''}, for example with the next
    person to hold an item you hand over.
  </p>
  <Field
    label="Roles"
    hint={$developer
      ? 'assign_person_role · Accountable roles need peer validation (request_role_promotion)'
      : 'Trusted roles are confirmed by other members.'}
  >
    <div class="pu-row">
      {#each ENUM.role as r (r)}
        <button
          type="button"
          class="pu-btn pu-btn--ghost pu-btn--sm"
          class:is-on={roles.includes(r)}
          aria-pressed={roles.includes(r)}
          title={r}
          onclick={() => toggle(r)}>{plain(r)}</button
        >
      {/each}
    </div>
  </Field>
  <p class="pu-sec">Reputation{$developer ? ' · derive_reputation_summary' : ''}</p>
  <p class="pu-muted">
    {rep.total_claims} receipts · {rep.custody_claims} hand-overs · {rep.service_claims} services · {rep.creation_claims} created
  </p>
  <Call c="zome_person::update_person · assign_person_role" />
  <ErrorNote {error} />
  <ModalActions {onclose} onok={submit} label="Save profile" />
</Modal>

<style>
  .head {
    gap: 14px;
    flex-wrap: nowrap;
  }
  .who {
    min-width: 0;
  }
  .who strong {
    font-size: 18px;
  }
  .small {
    font-size: 11px;
  }
  .two {
    grid-template-columns: 1fr 1fr;
  }
  .three {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 560px) {
    .two,
    .three {
      grid-template-columns: 1fr;
    }
  }
</style>
