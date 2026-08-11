<script lang="ts">
  // Status is rendered as an emoji, not a coloured circle. Nondominium's icon
  // system is emoji (see the brand brief); a status dot is the smallest place
  // that rule shows up, so it is the place it is easiest to break.
  import { STATUS_VOCAB, type StatusKey } from '$lib/ndo-ui';

  let { status = 'pending', label = '' }: { status?: StatusKey; label?: string } = $props();
  const vocab = $derived(STATUS_VOCAB[status] ?? STATUS_VOCAB.pending);
</script>

<span class="ndo-status">
  <span aria-hidden="true">{vocab.icon}</span>
  <span>{label || vocab.label}</span>
</span>
