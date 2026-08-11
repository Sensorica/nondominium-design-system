<script lang="ts">
  // Mirrors ui/src/routes/group/[id]/+page.svelte.
  import GroupView from '$lib/replica/group/GroupView.svelte';
  import { page } from '$app/state';
  import { urlFlag } from '$lib/replica/url-state.svelte';

  const groupId = $derived(page.params.id ?? '');
  const autoCreate = $derived(urlFlag('createNdo'));
</script>

<GroupView {groupId} autoOpenCreateModal={autoCreate} />
