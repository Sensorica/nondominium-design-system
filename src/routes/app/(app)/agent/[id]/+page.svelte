<script lang="ts">
  // This route does not exist in the app.
  //
  // NdoIdentityLayer links the initiator's name to /agent/{key} whenever a
  // Person entry resolves, but ui/src/routes has no agent directory — so that
  // link 404s in production today. The replica keeps the link (removing it
  // would hide the defect) and renders this instead, so the gap is visible in
  // review rather than only in a browser console.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';

  const agentKey = $derived(decodeURIComponent(page.params.id ?? ''));
</script>

<div class="p-6 max-w-lg">
  <h1 class="text-2xl font-bold text-gray-900">Agent profile</h1>
  <p class="mt-2 font-mono text-xs text-gray-400">{agentKey}</p>

  <div class="mt-6 rounded-lg border border-dashed border-amber-300 bg-amber-50 px-6 py-8">
    <p class="text-sm font-medium text-amber-800">This route is not implemented in the app.</p>
    <p class="mt-2 text-sm text-amber-700">
      <code class="font-mono">NdoIdentityLayer.svelte</code> links an initiator's name to
      <code class="font-mono">/agent/&lt;key&gt;</code>, but
      <code class="font-mono">ui/src/routes</code> has no <code class="font-mono">agent</code>
      directory. The link 404s today. The prototype keeps it so the gap stays visible.
    </p>
    <a
      href={paths.appHome()}
      class="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Back to Lobby
    </a>
  </div>
</div>
