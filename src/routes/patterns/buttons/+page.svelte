<script lang="ts">
  import Specimen from '$lib/components/shared/Specimen.svelte';
</script>

<header>
  <h1 class="text-2xl font-bold text-gray-900">Buttons</h1>
  <p class="mt-2 max-w-2xl text-sm text-gray-600">
    Five treatments, written inline wherever they appear. Radius is <code class="font-mono text-xs">rounded</code>
    (4px) almost everywhere; the app never uses a pill.
  </p>
</header>

<Specimen
  title="Primary"
  note="Blue 600, white label, 4px radius. Used for the one action a screen exists for: Create NDO, Save, Join, Confirm. Lifted from GroupView.svelte and every modal footer."
  code={`class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"`}
>
  {#snippet demo()}
    <button class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Create NDO</button>
    <button class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50" disabled>Creating…</button>
  {/snippet}
</Specimen>

<Specimen
  title="Bordered"
  note="A grey or blue outline on white. The secondary action: Copy invite link, Join NDO, Associate with a group, Fork this NDO. Note the smaller padding — bordered buttons in the NDO header are px-3 py-1.5 text-xs, not px-4 py-2 text-sm."
  code={`class="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
class="rounded border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"`}
>
  {#snippet demo()}
    <button class="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Copy invite link</button>
    <button class="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">Join NDO</button>
    <button class="rounded border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">Associate with a group</button>
  {/snippet}
</Specimen>

<Specimen
  title="Ghost"
  note="No border, grey label, grey hover. Always the dismissive action, always to the left of the primary one in a modal footer."
  code={`class="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"`}
>
  {#snippet demo()}
    <button class="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
    <button class="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">Skip</button>
    <button class="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">Close</button>
  {/snippet}
</Specimen>

<Specimen
  title="Sidebar"
  note="Extra-small, full width, white hover instead of grey — because the rail is already grey. From Sidebar.svelte."
  code={`class="mb-1 flex w-full items-center gap-1 rounded px-2 py-1.5 text-xs text-blue-600 hover:bg-white"`}
>
  {#snippet demo()}
    <div class="w-52 rounded bg-gray-50 p-3">
      <button class="mb-1 flex w-full items-center gap-1 rounded px-2 py-1.5 text-xs text-blue-600 hover:bg-white">
        <span class="font-bold">+</span> New Group
      </button>
      <button class="flex w-full items-center gap-1 rounded px-2 py-1.5 text-xs text-gray-600 hover:bg-white">
        <span class="font-bold">→</span> Join Group
      </button>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Inline compact"
  note="The smallest one, inside a form row or a group list item. Two sizes coexist here — px-2 py-1 in the sidebar forms, px-3 py-1.5 in the associate modal — and nothing distinguishes them but where they were written."
  code={`class="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"`}
>
  {#snippet demo()}
    <button class="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700">Create</button>
    <button class="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">Cancel</button>
    <button class="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">Add to 2 groups</button>
  {/snippet}
</Specimen>

<section class="rounded-lg border border-amber-200 bg-amber-50 p-4">
  <h2 class="text-sm font-semibold text-amber-800">Drift worth fixing</h2>
  <p class="mt-1 text-sm text-amber-700">
    Disabled state is <code class="font-mono text-xs">disabled:opacity-50</code> on most buttons and
    absent on some. Padding pairs (<code class="font-mono text-xs">px-4 py-2</code>,
    <code class="font-mono text-xs">px-3 py-1.5</code>, <code class="font-mono text-xs">px-2 py-1</code>)
    are chosen per site rather than per role.
  </p>
</section>
