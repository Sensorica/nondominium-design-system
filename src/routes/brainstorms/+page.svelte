<script lang="ts">
  // Every published brainstorm board. The list itself is shared with /architecture
  // ($lib/brainstorms/BoardList.svelte).
  import { paths } from '$lib/paths';
  import BoardList from '$lib/brainstorms/BoardList.svelte';

  let { data } = $props();
</script>

<BoardList
  boards={data.brainstorms}
  surface="brainstorms"
  heading="Brainstorms"
  lede="The boards where Nondominium's design is worked out, from the first brainstorm down the V to deployment. Open one to read it, answer its decision cards, and comment for the team."
  href={paths.brainstorm}
/>
