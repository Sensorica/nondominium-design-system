<script lang="ts">
  // Editing level 1. Everything here is optional except the nickname, and every
  // optional field carries a note about where it can end up — disclosure is a
  // per-group choice, made later.
  import { goto } from '$app/navigation';
  import { paths } from '$lib/paths';
  import { appState, showToast } from '$lib/state.svelte';
  import Field from '$lib/components/shared/Field.svelte';

  let nickname = $state(appState.profile?.nickname ?? '');
  let realName = $state(appState.profile?.realName ?? '');
  let bio = $state(appState.profile?.bio ?? '');
  let email = $state(appState.profile?.email ?? '');
  let phone = $state(appState.profile?.phone ?? '');
  let address = $state(appState.profile?.address ?? '');

  function save() {
    if (!nickname.trim()) return;
    appState.profile = {
      nickname: nickname.trim(),
      realName: realName.trim() || undefined,
      bio: bio.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
    };
    showToast('success', 'Lobby profile saved');
    goto(paths.profile());
  }
</script>

<header>
  <h1 class="ndo-h1">✏️ Edit lobby profile</h1>
  <p class="ndo-p mt-2">Stored in this browser. Nothing here is written to the DHT.</p>
</header>

<section class="ndo-panel">
  <div class="ndo-panel__body flex flex-col gap-4">
    <Field label="Nickname" required>
      {#snippet control()}<input class="ndo-input" bind:value={nickname} />{/snippet}
    </Field>
    <Field label="Real name" hint="Shared per group, only if you choose to.">
      {#snippet control()}<input class="ndo-input" bind:value={realName} />{/snippet}
    </Field>
    <Field label="Bio">
      {#snippet control()}<textarea class="ndo-textarea" bind:value={bio}></textarea>{/snippet}
    </Field>
    <Field label="Email" hint="Never shared by default.">
      {#snippet control()}<input class="ndo-input" type="email" bind:value={email} />{/snippet}
    </Field>
    <Field label="Phone" hint="Never shared by default.">
      {#snippet control()}<input class="ndo-input" bind:value={phone} />{/snippet}
    </Field>
    <Field label="Address" hint="Never shared by default.">
      {#snippet control()}<input class="ndo-input" bind:value={address} />{/snippet}
    </Field>
  </div>
  <div class="ndo-modal__foot">
    <a class="ndo-btn ndo-btn--ghost" href={paths.profile()}>Cancel</a>
    <button class="ndo-btn ndo-btn--primary" onclick={save} disabled={!nickname.trim()}>Save</button>
  </div>
</section>
