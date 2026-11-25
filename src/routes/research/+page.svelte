<script lang="ts">
  // Every published research board. The list itself is shared with
  // /brainstorms ($lib/brainstorms/BoardList.svelte).
  import { paths } from '$lib/paths';
  import BoardList from '$lib/brainstorms/BoardList.svelte';

  let { data } = $props();
</script>

<BoardList
  boards={data.boards}
  surface="research"
  heading="Research"
  lede="What we learned from outside Nondominium: other systems, protocols and projects compared with ours, every finding sourced. Open one to read it and comment for the team."
  href={paths.researchBoard}
/>
