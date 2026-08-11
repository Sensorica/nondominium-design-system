<script lang="ts">
  import { STATUS_VOCAB, type StatusKey } from '$lib/ndo-ui';
  import Chip from '$lib/components/shared/Chip.svelte';
  import StatusDot from '$lib/components/shared/StatusDot.svelte';
  import Specimen from '$lib/components/shared/Specimen.svelte';

  const keys = Object.keys(STATUS_VOCAB) as StatusKey[];
  let pressed = $state<string[]>(['Active']);
  function toggle(v: string) {
    pressed = pressed.includes(v) ? pressed.filter((p) => p !== v) : [...pressed, v];
  }
</script>

<header>
  <h1 class="ndo-h1">🟢 Status</h1>
  <p class="ndo-p mt-2" style="max-width:60ch">
    Status is an emoji, not a coloured circle. That is not a shortcut — emoji are this system's icon
    vocabulary, they carry meaning to a screen reader, and they survive being copied into an issue.
  </p>
</header>

<Specimen
  title="Status dot"
  note="Five states. Connection status, custody state and validation state all use the same five."
  code={`<StatusDot status="active" />
<StatusDot status="pending" label="Awaiting validation" />`}
>
  {#snippet demo()}
    {#each keys as key (key)}
      <StatusDot status={key} />
    {/each}
  {/snippet}
</Specimen>

<Specimen
  title="With a domain label"
  note="The label overrides the default, so an economic resource state maps onto the nearest dot without inventing a sixth."
  code={`<StatusDot status="pending" label="PendingValidation" />`}
>
  {#snippet demo()}
    <StatusDot status="active" label="Active" />
    <StatusDot status="pending" label="Reserved" />
    <StatusDot status="pending" label="Maintenance" />
    <StatusDot status="pending" label="PendingValidation" />
    <StatusDot status="inactive" label="Retired" />
  {/snippet}
</Specimen>

<Specimen
  title="Filter chip"
  note="Multi-select toggles, so aria-pressed rather than a radio or a link. Inside a dimension the chips OR together; across dimensions they AND."
  code={`<Chip label="Active" icon="⚡" pressed={true} onclick={toggle} />`}
>
  {#snippet demo()}
    {#each ['Ideation', 'Prototype', 'Active', 'Hibernating'] as value (value)}
      <Chip label={value} pressed={pressed.includes(value)} onclick={() => toggle(value)} />
    {/each}
  {/snippet}
</Specimen>

<Specimen
  title="Custom element"
  code={`<ndo-status-dot status="active" label="Active"></ndo-status-dot>`}
>
  {#snippet demo()}
    <ndo-status-dot status="active" label="Active"></ndo-status-dot>
    <ndo-status-dot status="pending" label="Pending"></ndo-status-dot>
    <ndo-status-dot status="inactive" label="Inactive"></ndo-status-dot>
    <ndo-status-dot status="coming-soon" label="Coming soon"></ndo-status-dot>
  {/snippet}
</Specimen>
