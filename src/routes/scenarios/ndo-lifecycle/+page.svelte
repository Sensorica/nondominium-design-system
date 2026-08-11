<script lang="ts">
  // The transition table, rendered from the same map the app's modal uses.
  import { paths } from '$lib/paths';
  import LifecycleTransitionModal from '$lib/replica/ndo/LifecycleTransitionModal.svelte';
  import { INITIAL_NDOS } from '$lib/replica/mock';

  const stages = [
    'Ideation', 'Specification', 'Development', 'Prototype', 'Stable',
    'Distributed', 'Active', 'Hibernating', 'Deprecated', 'EndOfLife'
  ];

  const transitions: Record<string, string[]> = {
    Ideation: ['Specification', 'Deprecated', 'EndOfLife'],
    Specification: ['Development', 'Deprecated', 'EndOfLife'],
    Development: ['Prototype', 'Deprecated', 'EndOfLife'],
    Prototype: ['Stable', 'Deprecated', 'EndOfLife'],
    Stable: ['Distributed', 'Deprecated', 'EndOfLife'],
    Distributed: ['Active', 'Deprecated', 'EndOfLife'],
    Active: ['Hibernating', 'Deprecated', 'EndOfLife'],
    Hibernating: ['Deprecated', 'EndOfLife'],
    Deprecated: ['EndOfLife'],
    EndOfLife: []
  };

  const identityStage: Record<string, string> = {
    Ideation: 'bg-gray-100 text-gray-600',
    Specification: 'bg-blue-50 text-blue-600',
    Development: 'bg-indigo-100 text-indigo-700',
    Prototype: 'bg-amber-100 text-amber-700',
    Stable: 'bg-green-100 text-green-700',
    Distributed: 'bg-teal-100 text-teal-700',
    Active: 'bg-emerald-100 text-emerald-700',
    Hibernating: 'bg-yellow-100 text-yellow-700',
    Deprecated: 'bg-orange-100 text-orange-700',
    EndOfLife: 'bg-red-100 text-red-700'
  };

  const hibernating = INITIAL_NDOS.find((n) => n.lifecycle_stage === 'Hibernating')!;
  let show = $state(false);
</script>

<div class="p-6">
  <header class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">NDO lifecycle</h1>
    <p class="mt-2 max-w-2xl text-sm text-gray-600">
      Ten stages, one forward chain, two escapes available from anywhere, and one stage that
      remembers where it came from. This table mirrors the Rust integrity zome: offering a
      transition the zome rejects would let a review approve a flow that cannot ship.
    </p>
  </header>

  <section class="rounded-lg border border-gray-200 bg-white shadow-sm">
    <div class="border-b border-gray-100 px-4 py-3">
      <h2 class="text-base font-semibold text-gray-900">The table</h2>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <thead class="bg-gray-50 text-gray-600">
          <tr><th class="px-3 py-2">From</th><th class="px-3 py-2">Accepts</th></tr>
        </thead>
        <tbody>
          {#each stages as s (s)}
            <tr class="border-t border-gray-100">
              <td class="px-3 py-2">
                <span class="rounded px-2 py-0.5 text-xs font-semibold {identityStage[s]}">{s}</span>
              </td>
              <td class="px-3 py-2">
                {#if transitions[s].length === 0}
                  <span class="text-gray-400 italic">nothing — terminal</span>
                {:else}
                  <span class="flex flex-wrap gap-1.5">
                    {#each transitions[s] as t (t)}
                      <span class="rounded px-2 py-0.5 text-xs font-semibold {identityStage[t]}">{t}</span>
                    {/each}
                    {#if s === 'Hibernating'}
                      <span class="rounded border border-dashed border-gray-400 px-2 py-0.5 text-xs text-gray-600">
                        + its hibernation_origin
                      </span>
                    {/if}
                  </span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <h2 class="text-base font-semibold text-gray-900">Two special cases</h2>
    <div class="mt-2 space-y-2 text-sm text-gray-600">
      <p>
        <strong>Deprecated needs a successor.</strong> The modal will not submit without one, because
        deprecating an object without naming what replaces it strands everything that depends on it.
      </p>
      <p>
        <strong>Hibernating records its origin.</strong> A kiln pausing from Active resumes to Active,
        not to the top of the ladder. That origin appears as a fourth option in the modal, above the
        two escapes.
      </p>
    </div>
  </section>

  <section class="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
    <h2 class="text-sm font-semibold text-amber-800">Open questions</h2>
    <ul class="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-700">
      <li>The modal is titled "Advance lifecycle stage" while three of its options retire the object.</li>
      <li>EndOfLife sits in a plain radio list beside Specification. Nothing marks it terminal, and there is no confirmation step.</li>
      <li>The successor picker needs two characters before it searches, with no hint that it will.</li>
    </ul>
  </section>

  <div class="mt-6 flex items-center gap-3">
    <button
      type="button"
      onclick={() => (show = true)}
      class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Open it on a Hibernating NDO
    </button>
    <a class="text-sm text-blue-600 hover:underline" href={paths.ndoDetail(hibernating.hash)}>
      See that NDO's identity bar
    </a>
  </div>
</div>

{#if show}
  <LifecycleTransitionModal
    descriptor={hibernating}
    onclose={() => (show = false)}
    onadvanced={() => {}}
  />
{/if}
