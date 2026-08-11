<script lang="ts">
  import Specimen from '$lib/components/shared/Specimen.svelte';
</script>

<header>
  <h1 class="text-2xl font-bold text-gray-900">Status</h1>
  <p class="mt-2 max-w-2xl text-sm text-gray-600">
    Loading, error, empty and not-yet-built. The app is unusually honest about the last one, and
    that honesty is worth preserving as a house style rather than tidying away.
  </p>
</header>

<Specimen
  title="Loading"
  note="A bordered circle with one blue quadrant, spun. There is no skeleton system; NdoView uses a single animate-pulse bar for its title and nothing else."
  code={`<span class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></span>
Loading NDOs…`}
>
  {#snippet demo()}
    <div class="flex items-center justify-center py-4 text-sm text-gray-500">
      <span class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" aria-hidden="true"></span>
      Loading NDOs…
    </div>
    <div class="h-6 w-40 animate-pulse rounded bg-gray-200"></div>
  {/snippet}
</Specimen>

<Specimen
  title="Error with a retry"
  note="Red-50 on red-200, with the retry as a white bordered button inside the alert. The NDO view's variant is a plain underlined link instead, which is the same idea at a different weight."
  code={`<div role="alert" class="mb-3 flex items-center justify-between gap-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
  <span>{errorMessage}</span>
  <button class="shrink-0 rounded border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100">Retry</button>
</div>`}
>
  {#snippet demo()}
    <div class="w-full space-y-3">
      <div role="alert" class="flex items-center justify-between gap-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
        <span>Failed to load NDOs from the Lobby.</span>
        <button class="shrink-0 rounded border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100">Retry</button>
      </div>
      <div class="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Could not refresh NDO details from the chain. Data shown may be cached.
        <button class="ml-3 underline hover:text-red-900">Retry</button>
      </div>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Not built yet"
  note="An amber chip on a dashed card, and an amber paragraph that cites the documentation section where the gap is tracked. The app tells you which file to read; keep that."
  code={`<span class="mb-3 inline-block rounded bg-amber-50 px-2 py-0.5 text-xs text-amber-600">Coming soon</span>
<p class="mt-2 text-xs text-amber-700">
  NDO member listing is not yet implemented on the DHT.
  See documentation/zomes/resource_zome.md § NDO membership (planned).
</p>`}
>
  {#snippet demo()}
    <div class="w-full space-y-3">
      <div class="rounded-lg border border-dashed border-gray-400 bg-white p-6">
        <span class="mb-3 inline-block rounded bg-amber-50 px-2 py-0.5 text-xs text-amber-600">Coming soon</span>
        <p class="text-sm text-gray-700">
          Composition view (NdoHardLink graph and D3) is not wired yet.
        </p>
      </div>
      <p class="text-xs text-amber-700">
        NDO member listing is not yet implemented on the DHT. See
        documentation/zomes/resource_zome.md § NDO membership (planned).
      </p>
      <button class="rounded bg-amber-100 px-3 py-1.5 text-xs text-amber-800" disabled>
        AccountableAgent (governance-gated)
      </button>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Conditional state rows — NdoIdentityLayer.svelte"
  note="Hibernating and Deprecated each get a tinted strip under the badges, in their own hue, naming what happens next. The best pattern in the app: state that carries a consequence gets a sentence, not just a colour."
  code={`<div class="mt-2 flex items-center gap-2 rounded bg-yellow-50 px-3 py-1.5 text-xs text-yellow-700">
  <span class="font-medium">Hibernating</span>
  <span class="text-yellow-500">·</span>
  <span>Will resume from: <span class="font-semibold">Active</span></span>
</div>`}
>
  {#snippet demo()}
    <div class="w-full space-y-2">
      <div class="flex items-center gap-2 rounded bg-yellow-50 px-3 py-1.5 text-xs text-yellow-700">
        <span class="font-medium">Hibernating</span>
        <span class="text-yellow-500">·</span>
        <span>Will resume from: <span class="font-semibold">Active</span></span>
      </div>
      <div class="flex items-center gap-2 rounded bg-orange-50 px-3 py-1.5 text-xs text-orange-700">
        <span class="font-medium">Deprecated</span>
        <span class="text-orange-400">·</span>
        <span>Succeeded by: <span class="font-mono underline">uhC0kTr4h1dJ…</span></span>
      </div>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Empty"
  note="Three shapes, all in use: an italic grey line, a dashed box, and a blue onboarding card with two actions. The blue one appears only when the agent has no groups at all."
  code={`<p class="text-sm text-gray-500">No NDOs yet. Create one inside a group to see it here.</p>
<p class="mb-2 text-xs text-gray-400 italic">No groups yet.</p>`}
>
  {#snippet demo()}
    <div class="w-full space-y-3">
      <p class="text-sm text-gray-500">No NDOs yet. Create one inside a group to see it here.</p>
      <p class="text-xs text-gray-400 italic">No groups yet.</p>
      <div class="rounded-lg border border-dashed border-blue-200 bg-blue-50 p-6 text-center">
        <p class="text-sm font-medium text-gray-800">Create or join a group to see NDOs</p>
        <p class="mt-1 text-sm text-gray-500">NDOs are scoped to groups. Start by creating a group or pasting an invite link.</p>
        <div class="mt-4 flex justify-center gap-2">
          <button class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Create group</button>
          <button class="rounded border border-blue-300 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">Join group</button>
        </div>
      </div>
    </div>
  {/snippet}
</Specimen>
