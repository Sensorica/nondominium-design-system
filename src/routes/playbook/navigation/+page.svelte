<script lang="ts">
  import Specimen from '$lib/components/shared/Specimen.svelte';
</script>

<header>
  <h1 class="text-2xl font-bold text-gray-900">Navigation</h1>
  <p class="mt-2 max-w-2xl text-sm text-gray-600">
    Three surfaces: the sidebar rail, the group rows inside it, and the folder-style tab bar on an
    NDO. The app has no top bar and no breadcrumbs.
  </p>
</header>

<Specimen
  title="Sidebar item — Sidebar.svelte"
  note="Active is white on the grey rail with a small shadow, which reads as a raised tab rather than a highlight. Inactive is grey text with a white hover."
  code={`class="mb-3 block rounded px-2 py-1.5 text-sm font-medium transition-colors
  {isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-900'}"`}
>
  {#snippet demo()}
    <nav class="flex w-52 flex-col rounded border border-gray-200 bg-gray-50 p-3">
      <span class="mb-3 block rounded bg-white px-2 py-1.5 text-sm font-medium text-gray-900 shadow-sm">Browse NDOs</span>
      <div class="mb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">Groups</div>
      <span class="block rounded px-2 py-1 text-sm text-gray-700 hover:bg-white hover:text-gray-900">Sensorica Lab</span>
    </nav>
  {/snippet}
</Specimen>

<Specimen
  title="Group row with hover action"
  note="The copy-invite button is invisible until the row is hovered: opacity-0 with group-hover:opacity-100. A discoverability trade — it keeps the rail quiet, and a first-time user will not know the button is there."
  code={`<li class="group flex items-center gap-0.5">
  <a class="block min-w-0 flex-1 truncate rounded px-2 py-1 text-sm …">{name}</a>
  <button class="shrink-0 rounded px-1.5 py-0.5 text-xs text-gray-400 opacity-0
    transition-opacity group-hover:opacity-100 hover:bg-white hover:text-blue-600">⎘</button>
</li>`}
>
  {#snippet demo()}
    <nav class="flex w-52 flex-col rounded border border-gray-200 bg-gray-50 p-3">
      <ul class="space-y-0.5">
        <li class="group flex items-center gap-0.5">
          <span class="block min-w-0 flex-1 truncate rounded bg-white px-2 py-1 text-sm font-medium text-gray-900 shadow-sm">Sensorica Lab</span>
          <button class="shrink-0 rounded px-1.5 py-0.5 text-xs text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white hover:text-blue-600">⎘</button>
        </li>
        <li class="group flex items-center gap-0.5">
          <span class="block min-w-0 flex-1 truncate rounded px-2 py-1 text-sm text-gray-700">Watershed Commons</span>
          <button class="shrink-0 rounded px-1.5 py-0.5 text-xs text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white hover:text-blue-600">⎘</button>
        </li>
      </ul>
    </nav>
  {/snippet}
</Specimen>

<Specimen
  title="Tab bar — NdoView.svelte"
  note="Folder tabs: a border on three sides with border-b-0, so the active tab merges into the panel beneath it. Active is gray-50 with a visible border; inactive is transparent."
  code={`class="rounded-t border border-b-0 px-3 py-2 text-sm font-medium transition-colors
  {active ? 'border-gray-200 bg-gray-50 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-800'}"`}
>
  {#snippet demo()}
    <div class="w-full border-b border-gray-200 bg-white px-6 pt-4">
      <nav class="flex gap-2">
        <button class="rounded-t border border-b-0 border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900">Resources</button>
        <button class="rounded-t border border-b-0 border-transparent px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-800">Governance</button>
        <button class="rounded-t border border-b-0 border-transparent px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-800">Composition</button>
        <button class="rounded-t border border-b-0 border-transparent px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-800">Activity</button>
      </nav>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Disclosure — TransitionHistoryPanel.svelte"
  note="A native details/summary, the app's only collapsible. The summary carries a live count."
  code={`<details class="mt-3 rounded border border-gray-200 bg-gray-50">
  <summary class="cursor-pointer select-none px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900">
    Lifecycle history · 6 transitions
  </summary>
  <div class="border-t border-gray-200 px-3 py-2">…</div>
</details>`}
>
  {#snippet demo()}
    <details class="w-full max-w-md rounded border border-gray-200 bg-gray-50">
      <summary class="cursor-pointer select-none px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900">
        Lifecycle history · 6 transitions
      </summary>
      <div class="border-t border-gray-200 px-3 py-2">
        <p class="text-xs text-gray-400 italic">Open me.</p>
      </div>
    </details>
  {/snippet}
</Specimen>

<section class="rounded-lg border border-amber-200 bg-amber-50 p-4">
  <h2 class="text-sm font-semibold text-amber-800">Drift worth fixing</h2>
  <p class="mt-1 text-sm text-amber-700">
    Two sidebars exist: <code class="font-mono text-xs">shell/Sidebar.svelte</code>
    (<code class="font-mono text-xs">w-52</code>, <code class="font-mono text-xs">bg-gray-50</code>,
    white hover) and <code class="font-mono text-xs">lobby/GroupSidebar.svelte</code>
    (<code class="font-mono text-xs">w-56</code>, <code class="font-mono text-xs">bg-white</code>,
    gray-50 hover). Only the first is mounted; the second is unreferenced.
  </p>
</section>
