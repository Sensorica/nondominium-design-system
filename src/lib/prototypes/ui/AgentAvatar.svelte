<script lang="ts">
  // Avatar for an agent of the shared A to E store: name from the store, and
  // the profile picture for the prototype's own agent.
  import Avatar from './Avatar.svelte';
  import { proto } from '../store/store.svelte';

  interface Props {
    id: string;
    size?: number;
    ring?: boolean;
    /** Overrides the stored picture (the profile form previews with it). */
    url?: string | null;
  }

  let { id, size = 24, ring = false, url }: Props = $props();

  const name = $derived(proto.q.agent(id));
  const src = $derived(url !== undefined ? url : id === proto.me.id ? proto.me.avatar : null);
</script>

<Avatar {id} {name} url={src} {size} {ring} />
