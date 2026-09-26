<script lang="ts">
  // Avatar plus name, inline.
  import AgentAvatar from './AgentAvatar.svelte';
  import { proto } from '../store/store.svelte';

  let { id, size = 18 }: { id: string; size?: number } = $props();
</script>

<span class="chip"><AgentAvatar {id} {size} /><span>{proto.q.agent(id)}</span></span>

<style>
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
</style>
