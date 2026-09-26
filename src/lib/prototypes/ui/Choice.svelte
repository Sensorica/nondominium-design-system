<script lang="ts">
  // A row of toggle buttons for picking one enum value (ui.jsx PChoice). The
  // buttons show plain words; the tooltip carries the enum.
  import './proto.css';
  import { plain } from '../plain';

  interface Props {
    options: readonly string[];
    value: string;
    onchange: (v: string) => void;
    /** How an option is shown. Defaults to its plain word. */
    format?: (o: string) => string;
  }

  let { options, value, onchange, format = (o) => plain(o) }: Props = $props();
</script>

<div class="pu pu-row" role="radiogroup">
  {#each options as o (o)}
    <button
      type="button"
      role="radio"
      aria-checked={o === value}
      title={o}
      class="pu-btn pu-btn--ghost pu-btn--sm"
      class:is-on={o === value}
      onclick={() => onchange(o)}>{format(o)}</button
    >
  {/each}
</div>
