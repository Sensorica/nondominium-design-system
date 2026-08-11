<script lang="ts">
  import Specimen from '$lib/components/shared/Specimen.svelte';
  import { paths } from '$lib/paths';
</script>

<header>
  <h1 class="text-2xl font-bold text-gray-900">Shell</h1>
  <p class="mt-2 max-w-2xl text-sm text-gray-600">
    A two-column frame, a page padding of <code class="font-mono text-xs">p-6</code>, and one modal
    envelope shared by every dialog.
  </p>
</header>

<Specimen
  title="Frame — AppShell.svelte"
  note="Four classes and one component. The rail is a fixed 208px; the main column takes the rest and owns its own scroll. min-w-0 on the main is what stops a wide table from pushing the rail off screen."
  code={`<div class="flex min-h-screen bg-gray-100">
  <Sidebar />
  <main class="min-w-0 flex-1 overflow-auto">{@render children?.()}</main>
</div>`}
>
  {#snippet demo()}
    <div class="flex h-40 w-full overflow-hidden rounded border border-gray-200 bg-gray-100">
      <div class="flex w-52 shrink-0 items-center justify-center border-r border-gray-200 bg-gray-50 text-xs text-gray-500">
        w-52 · bg-gray-50
      </div>
      <div class="flex min-w-0 flex-1 items-center justify-center text-xs text-gray-500">
        min-w-0 flex-1 overflow-auto
      </div>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Page header"
  note="Title left, actions right, bottom margin 6. Group and Lobby both use it; the NDO view uses a white bar with a bottom border instead, because its tabs hang off the bottom edge."
  code={`<div class="mb-6 flex items-start justify-between">
  <div>
    <h1 class="text-2xl font-bold text-gray-900">{name}</h1>
    <p class="mt-1 font-mono text-sm text-gray-400">{id}</p>
  </div>
  <div class="flex items-center gap-2"><!-- actions --></div>
</div>`}
>
  {#snippet demo()}
    <div class="w-full">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Sensorica Lab</h1>
          <p class="mt-1 font-mono text-sm text-gray-400">sensorica-lab-7f3a</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Copy invite link</button>
          <button class="flex items-center gap-1.5 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <span class="text-base leading-none">+</span> Create NDO
          </button>
        </div>
      </div>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Profile bar — LobbyProfileBar.svelte"
  note="A white strip above the lobby content, outside its p-6, so it spans the full width of the main column."
  code={`<div class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-2">
  <span class="text-sm text-gray-700">Signed in as <span class="font-semibold text-gray-900">{nickname}</span></span>
  <button class="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">Edit</button>
</div>`}
>
  {#snippet demo()}
    <div class="w-full">
      <div class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-2">
        <span class="text-sm text-gray-700">Signed in as <span class="font-semibold text-gray-900">riverstone</span></span>
        <button class="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">Edit</button>
      </div>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Modal envelope"
  note="Every dialog in the app shares this: a blurred 40% black backdrop, a 12px-radius white card, a hairline-divided header and footer. Only max-w varies — sm for a choice, md for a form, lg for the NDO create form."
  code={`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
  <div class="relative w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl" role="dialog" aria-modal="true">
    <div class="border-b border-gray-100 px-6 py-4"><!-- title + subtitle --></div>
    <div class="max-h-[70vh] overflow-y-auto px-6 py-4 space-y-4"><!-- body --></div>
    <div class="flex justify-end gap-2 border-t border-gray-100 px-6 py-4"><!-- cancel + primary --></div>
  </div>
</div>`}
>
  {#snippet demo()}
    <div class="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl">
      <div class="border-b border-gray-100 px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-900">Create NDO</h2>
        <p class="mt-1 text-sm text-gray-500">Register a new NondominiumIdentity Layer 0 within this group.</p>
      </div>
      <div class="px-6 py-4">
        <p class="text-sm text-gray-600">Body scrolls at max-h-[70vh].</p>
      </div>
      <div class="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
        <button class="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
        <button class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Create NDO</button>
      </div>
    </div>
  {/snippet}
</Specimen>

<section class="rounded-lg border border-amber-200 bg-amber-50 p-4">
  <h2 class="text-sm font-semibold text-amber-800">Drift worth fixing</h2>
  <p class="mt-1 text-sm text-amber-700">
    The lobby profile modal is a native <code class="font-mono text-xs">&lt;dialog&gt;</code> driven
    by a Melt builder, with its backdrop in a <code class="font-mono text-xs">::backdrop</code> rule.
    Every other modal is a fixed div with a <code class="font-mono text-xs">bg-black/40</code>
    overlay. They look nearly identical and behave differently: only the dialog traps focus and
    closes on Escape.
    <a class="underline" href={paths.appHome() + '?profile=1'}>Compare them in the prototype.</a>
  </p>
</section>
