<script lang="ts">
  // Signal strength: five bars, `n` of them lit. `color` is the original
  // lane colour (a CSS value or var() reference); the card passes its own
  // muted colour when it is cold.
  let { n, color = 'currentColor' }: { n: number; color?: string } = $props();
</script>

<span class="str" style:color role="img" aria-label="Signal strength {n} of 5">
  {#each [0, 1, 2, 3, 4] as i (i)}<i class:on={i < n}></i>{/each}
</span>

<style>
  .str {
    display: inline-flex;
    gap: 2px;
  }
  i {
    width: 5px;
    height: 14px;
    border-radius: 2px;
    background: currentColor;
    opacity: 0.25;
  }
  i.on {
    opacity: 1;
  }
</style>
