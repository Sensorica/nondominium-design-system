<script lang="ts">
  // Every published architecture board. The list itself is shared with
  // /brainstorms ($lib/brainstorms/BoardList.svelte).
  import { paths } from '$lib/paths';
  import BoardList from '$lib/brainstorms/BoardList.svelte';

  let { data } = $props();
</script>

<BoardList
  boards={data.boards}
  surface="architecture"
  heading="Architecture"
  lede="How Nondominium is built: the structure of the system as it runs and as it is planned, drawn board by board. Open one to read it, answer its decision cards, and comment for the team."
  href={paths.architectureBoard}
/>
