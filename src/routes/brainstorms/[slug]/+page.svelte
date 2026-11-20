<script lang="ts">
  // One brainstorm board inside the site chrome; the frame is shared with
  // /architecture/<slug> ($lib/brainstorms/BoardFrame.svelte).
  import { paths } from '$lib/paths';
  import BoardFrame from '$lib/brainstorms/BoardFrame.svelte';

  let { data } = $props();
</script>

<BoardFrame board={data.brainstorm} surfaceLabel="Brainstorms" indexHref={paths.brainstorms()} />
