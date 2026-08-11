<script lang="ts">
  import Specimen from '$lib/components/shared/Specimen.svelte';
</script>

<header>
  <h1 class="text-2xl font-bold text-gray-900">Inputs</h1>
  <p class="mt-2 max-w-2xl text-sm text-gray-600">
    The app has two input treatments, and the thing that distinguishes them is whether the field is
    required. Required fields get a <code class="font-mono text-xs">gray-300</code> border and a
    <code class="font-mono text-xs">font-medium</code> label; optional ones get
    <code class="font-mono text-xs">gray-200</code> and a lighter label. It is subtle and it is
    consistent across UserProfileForm and NdoCreateModal.
  </p>
</header>

<Specimen
  title="Required field"
  note="From UserProfileForm.svelte. The asterisk is a red span, and the error is xs red text below."
  code={`<label class="mb-1 block text-sm font-medium text-gray-700">
  Nickname <span class="text-red-500">*</span>
</label>
<input class="w-full rounded border border-gray-300 px-3 py-2 text-sm
  focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
<p class="mt-1 text-xs text-red-600">{error}</p>`}
>
  {#snippet demo()}
    <div class="w-full max-w-sm">
      <label class="mb-1 block text-sm font-medium text-gray-700" for="pb-req">
        Nickname <span class="text-red-500">*</span>
      </label>
      <input
        id="pb-req"
        class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="How you appear in the Lobby"
      />
      <p class="mt-1 text-xs text-red-600">Nickname is required.</p>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Optional field"
  note="Lighter border, lighter label. The section is introduced by an uppercase grey rule rather than a heading."
  code={`<p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Optional fields</p>
<label class="mb-1 block text-sm text-gray-600">Real name</label>
<input class="w-full rounded border border-gray-200 px-3 py-2 text-sm …" />`}
>
  {#snippet demo()}
    <div class="w-full max-w-sm space-y-3">
      <p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Optional fields</p>
      <div>
        <label class="mb-1 block text-sm text-gray-600" for="pb-opt">Real name</label>
        <input id="pb-opt" class="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Your full name (optional)" />
      </div>
      <div>
        <label class="mb-1 block text-sm text-gray-600" for="pb-bio">Bio</label>
        <textarea id="pb-bio" rows="2" class="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Short bio (optional)"></textarea>
      </div>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Select with a hint"
  note="From NdoCreateModal.svelte. Every select is followed by a one-line explanation of the chosen value, which changes as you change the selection. It is the only place in the app that teaches while you fill a form."
  code={`<select class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">…</select>
<p class="mt-1 text-xs text-gray-500">{tooltips[value]}</p>`}
>
  {#snippet demo()}
    <div class="w-full max-w-sm">
      <label class="mb-1 block text-sm font-medium text-gray-700" for="pb-sel">Property Regime</label>
      <select id="pb-sel" class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
        <option>Private</option>
        <option selected>Commons</option>
        <option>Nondominium</option>
        <option>CommonPool</option>
      </select>
      <p class="mt-1 text-xs text-gray-500">Shared, self-governed resource open to a defined community.</p>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Checkbox and radio"
  note="Bare 4×4 inputs with a gap-3 label. GroupProfileModal uses checkboxes for disclosure; LifecycleTransitionModal uses radios for the target stage."
  code={`<label class="flex items-center gap-3 cursor-pointer">
  <input type="checkbox" class="h-4 w-4 rounded" />
  <span class="text-sm text-gray-700">Appear anonymously (pseudonym only)</span>
</label>`}
>
  {#snippet demo()}
    <div class="w-full max-w-sm space-y-2">
      <label class="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" class="h-4 w-4 rounded" checked />
        <span class="text-sm text-gray-700">Appear anonymously (pseudonym only)</span>
      </label>
      <label class="flex items-center gap-3 cursor-pointer">
        <input type="radio" name="pb-radio" class="h-4 w-4" checked />
        <span class="text-sm text-gray-700">Stable</span>
      </label>
      <label class="flex items-center gap-3 cursor-pointer">
        <input type="radio" name="pb-radio" class="h-4 w-4" />
        <span class="text-sm text-gray-700">Deprecated</span>
      </label>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Sidebar input"
  note="Extra small, no focus ring, only a border change. Different from every other input in the app."
  code={`class="mb-1.5 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"`}
>
  {#snippet demo()}
    <div class="w-52 rounded bg-gray-50 p-3">
      <div class="rounded border border-gray-200 bg-white p-2">
        <p class="mb-1.5 text-xs font-medium text-gray-700">New group</p>
        <input class="mb-1.5 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none" placeholder="Group name" />
        <div class="flex gap-1">
          <button class="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700">Create</button>
          <button class="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">Cancel</button>
        </div>
      </div>
    </div>
  {/snippet}
</Specimen>
