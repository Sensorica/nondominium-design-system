<script lang="ts">
  // Verbatim copy of ui/src/routes/ndo/new/+page.svelte, minus the redirect:
  // production bounces straight to the selected group, which means this screen
  // is almost never seen. Here it always renders, because "the dead end a user
  // hits with no group selected" is exactly the kind of screen a design review
  // needs to be able to look at.
  import { paths } from '$lib/paths';
</script>

<div class="p-6 max-w-lg">
  <h1 class="text-2xl font-bold text-gray-900">New NDO</h1>
  <p class="mt-2 text-sm text-gray-600">
    NDOs are created from within a <strong>Group</strong>. Groups are the organizational context
    for NDO creation in Nondominium.
  </p>

  <div class="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center">
    <p class="text-sm text-gray-500">
      Please create or join a Group from the Lobby first, then use the
      <span class="font-medium text-blue-600">+ Create NDO</span> button inside the group.
    </p>
    <a
      href={paths.appHome()}
      class="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Go to Lobby
    </a>
  </div>
</div>
