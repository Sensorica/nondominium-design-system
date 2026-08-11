<script lang="ts">
  // The create form is the app's only teaching surface: every select carries a
  // sentence that changes with the selection. This scenario puts the real modal
  // beside the reason it matters.
  import { paths } from '$lib/paths';
  import NdoCreateModal from '$lib/replica/group/NdoCreateModal.svelte';

  let show = $state(false);
</script>

<div class="p-6">
  <header class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">NDO creation</h1>
    <p class="mt-2 max-w-2xl text-sm text-gray-600">
      Creating an NDO commits the Layer 0 identity anchor. Three of its four choices are permanent,
      and the form is the only place a participant is told what they mean.
    </p>
  </header>

  <section class="rounded-lg border border-gray-200 bg-white shadow-sm">
    <div class="border-b border-gray-100 px-4 py-3">
      <h2 class="text-base font-semibold text-gray-900">Why creation is group-scoped</h2>
    </div>
    <div class="space-y-3 px-4 py-4 text-sm text-gray-600">
      <p>
        The hierarchy is Lobby → Group → NDO. A group is a cloned DNA cell with its own DHT; an NDO
        created inside one is soft-linked from that cell. A global create flow would have nowhere to
        put the result.
      </p>
      <p>
        So <code class="font-mono text-xs">/ndo/new</code> exists only to redirect: if a group is
        selected it bounces there, and otherwise it explains. In production the explanation is
        almost never seen, which is why the prototype always renders it.
      </p>
    </div>
  </section>

  <section class="mt-6 rounded-lg border border-gray-200 bg-white shadow-sm">
    <div class="border-b border-gray-100 px-4 py-3">
      <h2 class="text-base font-semibold text-gray-900">Permanent versus mutable</h2>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <thead class="bg-gray-50 text-gray-600">
          <tr><th class="px-3 py-2">Field</th><th class="px-3 py-2">After creation</th><th class="px-3 py-2">Why</th></tr>
        </thead>
        <tbody>
          <tr class="border-t border-gray-100"><td class="px-3 py-2 font-medium">Name</td><td class="px-3 py-2">permanent</td><td class="px-3 py-2">It is how the network refers to the object.</td></tr>
          <tr class="border-t border-gray-100"><td class="px-3 py-2 font-medium">Property regime</td><td class="px-3 py-2">permanent</td><td class="px-3 py-2">It constrains which governance rules are valid at all.</td></tr>
          <tr class="border-t border-gray-100"><td class="px-3 py-2 font-medium">Resource nature</td><td class="px-3 py-2">permanent</td><td class="px-3 py-2">Rivalry and governance defaults follow from it.</td></tr>
          <tr class="border-t border-gray-100"><td class="px-3 py-2 font-medium">Lifecycle stage</td><td class="px-3 py-2">transitions</td><td class="px-3 py-2">The only field the object is meant to move through.</td></tr>
          <tr class="border-t border-gray-100"><td class="px-3 py-2 font-medium">Description</td><td class="px-3 py-2">editable</td><td class="px-3 py-2">Prose, not identity.</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
    <h2 class="text-sm font-semibold text-amber-800">Open question</h2>
    <p class="mt-1 text-sm text-amber-700">
      Nothing in the form says the first three fields are permanent. The regime hint explains what
      Commons means, not that you cannot change your mind. A duplicate name is a warning; an
      irreversible regime is silent.
    </p>
  </section>

  <div class="mt-6 flex items-center gap-3">
    <button
      type="button"
      onclick={() => (show = true)}
      class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Open the real create modal
    </button>
    <a class="text-sm text-blue-600 hover:underline" href={paths.ndoNew()}>See the no-group dead end</a>
  </div>
</div>

{#if show}
  <NdoCreateModal groupId="sensorica-lab-7f3a" onclose={() => (show = false)} />
{/if}
