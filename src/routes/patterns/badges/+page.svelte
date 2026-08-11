<script lang="ts">
  // The badge sheet is the strongest case for this design system existing: the
  // same three colour maps are written out in three separate files, and they do
  // not agree.
  import Specimen from '$lib/components/shared/Specimen.svelte';

  // From NdoBrowser.svelte — filter chips, with a border.
  const filterStage: Record<string, string> = {
    Ideation: 'bg-gray-100 text-gray-600 border-gray-300',
    Specification: 'bg-blue-50 text-blue-600 border-blue-300',
    Development: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    Prototype: 'bg-amber-100 text-amber-700 border-amber-300',
    Stable: 'bg-green-100 text-green-700 border-green-300',
    Distributed: 'bg-teal-100 text-teal-700 border-teal-300',
    Active: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    Hibernating: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    Deprecated: 'bg-orange-100 text-orange-700 border-orange-300',
    EndOfLife: 'bg-red-100 text-red-700 border-red-300'
  };

  // From NdoIdentityLayer.svelte — the same stages, no border.
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

  const nature: Record<string, string> = {
    Physical: 'bg-blue-100 text-blue-700',
    Digital: 'bg-purple-100 text-purple-700',
    Service: 'bg-orange-100 text-orange-700',
    Hybrid: 'bg-teal-100 text-teal-700',
    Information: 'bg-indigo-100 text-indigo-700'
  };

  const regime: Record<string, string> = {
    Private: 'bg-gray-100 text-gray-600',
    Commons: 'bg-cyan-100 text-cyan-700',
    Nondominium: 'bg-emerald-100 text-emerald-700',
    CommonPool: 'bg-rose-100 text-rose-700'
  };

  const stages = Object.keys(filterStage);
  const cardActive = new Set(['Active', 'Stable', 'Distributed', 'Development', 'Prototype']);
</script>

<header>
  <h1 class="text-2xl font-bold text-gray-900">Badges</h1>
  <p class="mt-2 max-w-2xl text-sm text-gray-600">
    Lifecycle stage, resource nature and property regime each get a colour. The maps live in
    <code class="font-mono text-xs">NdoBrowser.svelte</code> and
    <code class="font-mono text-xs">NdoIdentityLayer.svelte</code>, and a third, coarser one lives in
    <code class="font-mono text-xs">NdoCard.svelte</code>.
  </p>
</header>

<Specimen
  title="Identity bar badges — NdoIdentityLayer.svelte"
  note="The full ten-stage map. Cool for early stages, warm for late, red for terminal."
  code={`<span class="rounded px-2 py-0.5 text-xs font-semibold {stageClass}">{stage}</span>`}
>
  {#snippet demo()}
    {#each stages as s (s)}
      <span class="rounded px-2 py-0.5 text-xs font-semibold {identityStage[s]}">{s}</span>
    {/each}
  {/snippet}
</Specimen>

<Specimen
  title="Filter chips — NdoBrowser.svelte"
  note="Same colours plus a matching border, at 60% opacity until selected. The selected state is a ring in the chip's own colour: ring-2 ring-offset-1 ring-current."
  code={`class="rounded border px-2 py-0.5 text-xs font-medium transition-opacity {stageColors[s]}
  {selected ? 'ring-2 ring-offset-1 ring-current' : 'opacity-60 hover:opacity-100'}"`}
>
  {#snippet demo()}
    {#each stages.slice(0, 5) as s, i (s)}
      <button
        class="rounded border px-2 py-0.5 text-xs font-medium transition-opacity {filterStage[s]} {i === 2
          ? 'ring-2 ring-offset-1 ring-current'
          : 'opacity-60 hover:opacity-100'}"
      >
        {s}
      </button>
    {/each}
  {/snippet}
</Specimen>

<Specimen
  title="Card badges — NdoCard.svelte"
  note="Here the ten stages collapse to two colours: green for Active, Stable, Distributed, Development and Prototype, grey for everything else. A card and the identity bar of the same NDO therefore show different colours for the same stage."
  code={`const activeStages = new Set(['Active', 'Stable', 'Distributed', 'Development', 'Prototype']);
const lifecycleClass = activeStages.has(stage) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600';`}
>
  {#snippet demo()}
    {#each stages as s (s)}
      <span class="rounded px-2 py-0.5 text-xs font-medium {cardActive.has(s) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">{s}</span>
    {/each}
  {/snippet}
</Specimen>

<Specimen
  title="Resource nature"
  note="Five natures, identical in NdoCard and NdoIdentityLayer. The one map in the app that does not disagree with itself."
  code={`class="rounded px-2 py-0.5 text-xs font-medium {natureClass}"`}
>
  {#snippet demo()}
    {#each Object.keys(nature) as n (n)}
      <span class="rounded px-2 py-0.5 text-xs font-medium {nature[n]}">{n}</span>
    {/each}
  {/snippet}
</Specimen>

<Specimen
  title="Property regime"
  note="A dashed border marks the regime, in both the card and the identity bar — the app's convention for something declarative rather than observed. The card ignores the colour map and renders every regime grey; the identity bar colours them."
  code={`<!-- NdoCard: no colour -->
<span class="rounded border border-dashed border-gray-400 px-2 py-0.5 text-xs text-gray-700">{regime}</span>

<!-- NdoIdentityLayer: coloured -->
<span class="rounded border border-dashed px-2 py-0.5 text-xs font-medium {regimeClass}">{regime}</span>`}
>
  {#snippet demo()}
    {#each Object.keys(regime) as r (r)}
      <span class="rounded border border-dashed border-gray-400 px-2 py-0.5 text-xs text-gray-700">{r}</span>
    {/each}
    <span class="w-full"></span>
    {#each Object.keys(regime) as r (r)}
      <span class="rounded border border-dashed px-2 py-0.5 text-xs font-medium {regime[r]}">{r}</span>
    {/each}
  {/snippet}
</Specimen>

<section class="rounded-lg border border-amber-200 bg-amber-50 p-4">
  <h2 class="text-sm font-semibold text-amber-800">Drift worth fixing</h2>
  <ul class="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-700">
    <li>Three stage colour maps in three files; the card's collapses ten stages into two colours.</li>
    <li>Regime is coloured in the identity bar and grey on the card.</li>
    <li>Weight differs: <code class="font-mono text-xs">font-semibold</code> in the identity bar, <code class="font-mono text-xs">font-medium</code> on the card.</li>
    <li>Specification is <code class="font-mono text-xs">blue-50/blue-600</code> while every other stage uses a 100/700 pair.</li>
  </ul>
</section>
