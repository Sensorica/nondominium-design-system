<script lang="ts">
  // A filter chip. Multi-select within a dimension, so it is a toggle button
  // with aria-pressed, never a link or a radio (REQ-UI-LOBBY-01).
  let {
    label,
    icon = '',
    hint = '',
    pressed = false,
    onclick,
  }: {
    label: string;
    icon?: string;
    hint?: string;
    pressed?: boolean;
    onclick?: () => void;
  } = $props();
</script>

<button type="button" class="ndo-chip" aria-pressed={pressed} title={hint} {onclick}>
  {#if icon}<span aria-hidden="true">{icon}</span>{/if}{label}
</button>
