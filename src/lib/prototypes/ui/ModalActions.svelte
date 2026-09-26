<script lang="ts">
  // Cancel plus the primary action (ui.jsx PActs).
  import './proto.css';

  interface Props {
    onclose: () => void;
    onok: () => void;
    label: string;
    disabled?: boolean;
  }

  let { onclose, onok, label, disabled = false }: Props = $props();
</script>

<div class="pu pu-row pu-row--end">
  <button type="button" class="pu-btn pu-btn--ghost" onclick={onclose}>Cancel</button>
  <button type="button" class="pu-btn" {disabled} onclick={onok}>{label}</button>
</div>
