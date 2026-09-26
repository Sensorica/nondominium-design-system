<script lang="ts">
  // Signal strength: five bars, `n` of them lit, in the lane's colour.
  let { n }: { n: number } = $props();
</script>

<span class="str" role="img" aria-label="Signal strength {n} of 5">
  {#each [0, 1, 2, 3, 4] as i (i)}<i class:on={i < n}></i>{/each}
</span>

<style>
  .str {
    display: inline-flex;
    gap: 2px;
    color: rgb(var(--lane, var(--ndo-gray-500)));
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
