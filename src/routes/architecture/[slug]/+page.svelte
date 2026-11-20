<script lang="ts">
  // One architecture board inside the site chrome; the frame is shared with
  // /brainstorms/<slug> ($lib/brainstorms/BoardFrame.svelte).
  import { paths } from '$lib/paths';
  import BoardFrame from '$lib/brainstorms/BoardFrame.svelte';

  let { data } = $props();
</script>

<BoardFrame board={data.board} surfaceLabel="Architecture" indexHref={paths.architecture()} />
