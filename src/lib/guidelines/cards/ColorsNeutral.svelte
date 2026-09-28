<!-- Replica of docs/prototypes/original/ds/guidelines/colors-neutral.html -->
<script lang="ts"></script>

<div class="sw">
  {#each ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as step}
    <div class="s">
      <div class="c" style="background:rgb(var(--ndo-gray-{step}))"></div>
      <div class="n">gray-{step}</div>
      <div class="v">--ndo-gray-{step}</div>
    </div>
  {/each}
</div>

<style>
  .sw { display: flex; gap: 8px; flex-wrap: wrap; }
  .s { width: 78px; }
  .c { height: 48px; border-radius: 6px; border: 1px solid rgb(0 0 0 / 0.06); }
  .n { font-size: 11px; font-weight: 600; margin-top: 4px; color: rgb(var(--ndo-gray-800)); }
  .v { font: 10px var(--ndo-font-mono); color: rgb(var(--ndo-gray-500)); }
</style>
