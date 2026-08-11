<script lang="ts">
  import Specimen from '$lib/components/shared/Specimen.svelte';
  import NdoCard from '$lib/replica/lobby/NdoCard.svelte';
  import MemberList from '$lib/replica/group/MemberList.svelte';
  import { INITIAL_NDOS } from '$lib/replica/mock';
</script>

<header>
  <h1 class="text-2xl font-bold text-gray-900">Cards</h1>
  <p class="mt-2 max-w-2xl text-sm text-gray-600">
    Three containers carry the whole app: the NDO card, the section panel, and a dashed box that
    means "nothing here yet, or nothing built yet".
  </p>
</header>

<Specimen
  title="NDO card — NdoCard.svelte"
  note="Badges first, then the name, then a two-line clamped description, then the truncated hash. Badges above the title is unusual and it is the app's actual order."
  code={`<a class="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
  <div class="mb-2 flex flex-wrap items-center gap-2"><!-- badges --></div>
  <h3 class="text-lg font-semibold text-gray-900">{name}</h3>
  <p class="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
  <p class="mt-1 font-mono text-xs text-gray-400">#{hash.slice(0, 12)}…</p>
</a>`}
>
  {#snippet demo()}
    <div class="w-80"><NdoCard descriptor={INITIAL_NDOS[0]} /></div>
    <div class="w-80"><NdoCard descriptor={INITIAL_NDOS[8]} /></div>
  {/snippet}
</Specimen>

<Specimen
  title="Section panel — NdoBrowser.svelte"
  note="The same border and radius as a card, with a hairline-divided header. The browser's filter bar and its grid are two regions of one panel."
  code={`<section class="rounded-lg border border-gray-200 bg-white shadow-sm">
  <div class="border-b border-gray-100 px-4 py-3"><!-- filters --></div>
  <div class="p-4"><!-- content --></div>
</section>`}
>
  {#snippet demo()}
    <section class="w-full rounded-lg border border-gray-200 bg-white shadow-sm">
      <div class="border-b border-gray-100 px-4 py-3">
        <span class="mr-1 text-xs font-semibold text-gray-500 uppercase">Stage:</span>
      </div>
      <div class="p-4">
        <h2 class="text-lg font-semibold text-gray-900">NDO browser</h2>
      </div>
    </section>
  {/snippet}
</Specimen>

<Specimen
  title="List row — MemberList.svelte"
  note="Name left, role pill right. The only rounded-full in the app is this role pill."
  code={`<li class="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-sm">
  <span class="font-medium text-gray-800">{name}</span>
  <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{role}</span>
</li>`}
>
  {#snippet demo()}
    <div class="w-full max-w-md -mt-8">
      <MemberList members={[
        { id: '1', name: 'Ada Riverstone', role: 'Member' },
        { id: '2', name: 'Kesse Nyarko' }
      ]} />
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Dashed placeholder"
  note="A dashed border means one of two things: an empty collection, or a feature that is not built. Both read the same, which is a problem worth naming — an empty group and an unimplemented Composition tab look alike."
  code={`<p class="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-400 italic">No members yet.</p>
<div class="rounded-lg border border-dashed border-gray-400 bg-white p-6"><!-- coming soon --></div>`}
>
  {#snippet demo()}
    <div class="w-full space-y-3">
      <p class="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-400 italic">No members yet.</p>
      <div class="rounded-lg border border-dashed border-gray-400 bg-white p-6">
        <span class="mb-3 inline-block rounded bg-amber-50 px-2 py-0.5 text-xs text-amber-600">Coming soon</span>
        <p class="text-sm text-gray-700">Composition view is not wired yet.</p>
      </div>
      <div class="rounded-lg border border-dashed border-blue-200 bg-blue-50 p-6 text-center">
        <p class="text-sm font-medium text-gray-800">Create or join a group to see NDOs</p>
        <p class="mt-1 text-sm text-gray-500">NDOs are scoped to groups.</p>
      </div>
    </div>
  {/snippet}
</Specimen>
