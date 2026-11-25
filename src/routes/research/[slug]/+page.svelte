<script lang="ts">
  // One research board inside the site chrome; the frame is shared with
  // /brainstorms/<slug> ($lib/brainstorms/BoardFrame.svelte).
  import { paths } from '$lib/paths';
  import BoardFrame from '$lib/brainstorms/BoardFrame.svelte';

  let { data } = $props();
</script>

<BoardFrame board={data.board} surfaceLabel="Research" indexHref={paths.research()} />
