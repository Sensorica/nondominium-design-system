<script lang="ts">
  // Level 2 of the identity ladder: how much of the lobby profile this group's
  // members may see. Per group, stored locally, changeable at any time. The
  // group DHT holds membership; it does not hold this choice.
  import { page } from '$app/state';
  import { groupById, setGroupMemberProfile, showToast, appState } from '$lib/state.svelte';
  import type { GroupMemberProfile, LobbyUserProfile } from '$lib/types';

  const id = $derived(page.params.id ?? '');
  const group = $derived(groupById(id));

  const FIELDS: (keyof Omit<LobbyUserProfile, 'nickname'>)[] = ['realName', 'bio', 'email', 'phone', 'address'];
  const FIELD_LABEL: Record<string, string> = {
    realName: 'Real name',
    bio: 'Bio',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
  };

  let anonymous = $state(group?.memberProfile?.isAnonymous ?? false);
  let shown = $state<string[]>([...(group?.memberProfile?.shownFields ?? [])]);

  function toggle(field: string) {
    shown = shown.includes(field) ? shown.filter((f) => f !== field) : [...shown, field];
  }

  function save() {
    const profile: GroupMemberProfile = {
      isAnonymous: anonymous,
      shownFields: anonymous ? [] : (shown as GroupMemberProfile['shownFields']),
    };
    setGroupMemberProfile(id, profile);
    showToast('success', 'Disclosure updated');
  }
</script>

<section class="ndo-panel">
  <div class="ndo-panel__head"><h2 class="ndo-h3">🕶️ What this group sees</h2></div>
  <div class="ndo-panel__body flex flex-col gap-4">
    <p class="ndo-small">
      Your nickname is always visible to members. Everything else is a deliberate choice, made once
      per group. Nothing here is written to a DHT.
    </p>

    <label class="toggle">
      <input type="checkbox" bind:checked={anonymous} />
      <span>
        <strong class="ndo-small">Stay pseudonymous</strong>
        <span class="ndo-field__hint block">Members see <code>{appState.profile?.nickname ?? 'your nickname'}</code> and nothing more.</span>
      </span>
    </label>

    <fieldset class="fields" disabled={anonymous}>
      <legend class="ndo-label">Share with {group?.name ?? 'this group'}</legend>
      {#each FIELDS as field (field)}
        <label class="toggle">
          <input type="checkbox" checked={shown.includes(field)} onchange={() => toggle(field)} />
          <span>
            <strong class="ndo-small">{FIELD_LABEL[field]}</strong>
            <span class="ndo-field__hint block">
              {appState.profile?.[field] ? String(appState.profile[field]) : 'not set in your lobby profile'}
            </span>
          </span>
        </label>
      {/each}
    </fieldset>
  </div>
  <div class="ndo-modal__foot">
    <button class="ndo-btn ndo-btn--primary" onclick={save}>Save disclosure</button>
  </div>
</section>

<style>
  .toggle { display: flex; align-items: flex-start; gap: var(--ndo-spacing-3); cursor: pointer; }
  .fields { border: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  .fields[disabled] { opacity: 0.5; }
  .block { display: block; }
  code { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); }
</style>
