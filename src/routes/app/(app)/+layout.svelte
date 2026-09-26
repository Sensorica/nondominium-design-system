<script lang="ts">
  // Mirrors ui/src/routes/+layout.svelte: the app shell wraps every page, and the
  // first-launch profile modal is mounted here, above it.
  //
  // The app opens that modal by itself once the conductor has connected and
  // loadLobby has run, whenever no Level 1 profile exists (REQ-UI-ID-01). The
  // same check runs here, against the mock. Two differences, both wiring:
  //   - the app runs the check once per session. Here a change of `?state=` is a
  //     different agent on a different conductor, so the check re-arms on it and
  //     starts closed, which is what makes `/app?state=no-profile` open the modal
  //     on client navigation as well as on a hard load. The mock lobby's filter
  //     state is reset at the same moment, for the same reason.
  //   - the app also resolves its agent key here. The mock's appContext derives
  //     the key from `?state=`, so there is nothing to resolve.
  //
  // LobbyView mounts a second instance of the same modal for its profile bar, as
  // in the app. An earlier note here said two Melt dialogs on one page fight over
  // the open state. They do not: what kept the LobbyView one shut was a
  // replaceState thrown during hydration (see LobbyView.svelte).
  import { untrack, type Snippet } from 'svelte';
  import AppShell from '$lib/replica/shell/AppShell.svelte';
  import ProfileSetupModal from '$lib/replica/lobby/ProfileSetupModal.svelte';
  import { appContext, lobbyStore } from '$lib/replica/stores.svelte';
  import { urlParam } from '$lib/replica/url-state.svelte';

  let { children }: { children: Snippet } = $props();

  let showProfileModal = $state(false);

  $effect(() => {
    urlParam('state');
    untrack(() => {
      lobbyStore.resetForNewState();
      showProfileModal = false;
      void (async () => {
        await lobbyStore.loadLobby();
        if (!appContext.lobbyUserProfile) {
          showProfileModal = true;
        }
      })();
    });
  });
</script>

<ProfileSetupModal bind:open={showProfileModal} />
<AppShell>
  {@render children()}
</AppShell>
