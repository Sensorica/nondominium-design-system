<script lang="ts">
  // Level 1 of the identity ladder: a nickname, held in localStorage, that never
  // touches the DHT. This is the cheapest possible identity and it is enough to
  // browse and to join a group.
  import { goto } from '$app/navigation';
  import { paths } from '$lib/paths';
  import { appState } from '$lib/state.svelte';
  import { joining } from '$lib/guards/joining.svelte';
  import Field from '$lib/components/shared/Field.svelte';

  let nickname = $state(appState.profile?.nickname ?? '');
  let realName = $state(appState.profile?.realName ?? '');
  let bio = $state(appState.profile?.bio ?? '');

  function save() {
    if (!nickname.trim()) return;
    appState.profile = { nickname: nickname.trim(), realName: realName.trim() || undefined, bio: bio.trim() || undefined };
    joining.to('browsing');
    goto(paths.appHome());
  }
</script>

<header>
  <h1 class="ndo-h2">👋 Set up your lobby profile</h1>
  <p class="ndo-small mt-2">
    Level 1 of three. This stays in your browser — no DHT write, no permanence, no cost. A nickname
    is all that is required.
  </p>
</header>

<div class="flex flex-col gap-4">
  <Field label="Nickname" required hint="How other agents see you before you commit an identity.">
    {#snippet control()}
      <input class="ndo-input" bind:value={nickname} placeholder="riverstone" />
    {/snippet}
  </Field>
  <Field label="Real name" hint="Optional. You choose per group whether to reveal it.">
    {#snippet control()}
      <input class="ndo-input" bind:value={realName} placeholder="Ada Riverstone" />
    {/snippet}
  </Field>
  <Field label="Bio" hint="Optional. One line is plenty.">
    {#snippet control()}
      <textarea class="ndo-textarea" bind:value={bio} placeholder="Fabrication and open hardware."></textarea>
    {/snippet}
  </Field>
</div>

<div class="flex items-center justify-between gap-3">
  <a class="ndo-small" href={paths.appHome()}>Browse anonymously instead</a>
  <button class="ndo-btn ndo-btn--primary" onclick={save} disabled={!nickname.trim()}>Save and continue</button>
</div>
