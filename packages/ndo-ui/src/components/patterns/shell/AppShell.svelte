<script lang="ts">
  import type { Snippet } from 'svelte';
  import Sidebar from './Sidebar.svelte';
  import type { GroupDescriptor, LobbyUserProfile } from '../../../domain/types.js';

  interface Props {
    groups: GroupDescriptor[];
    activePath?: string;
    profileNickname?: string | null;
    browseHref?: string;
    groupHref?: (id: string) => string;
    oncreategroup?: (name: string) => void | Promise<void>;
    onjoingroup?: (inviteCode: string) => void | Promise<void>;
    onprofileclick?: () => void;
    children?: Snippet;
  }

  let {
    groups,
    activePath = '/',
    profileNickname = null,
    browseHref = '/',
    groupHref = (id) => `/group/${id}`,
    oncreategroup,
    onjoingroup,
    onprofileclick,
    children
  }: Props = $props();
</script>

<div class="flex min-h-screen bg-gray-100">
  <Sidebar
    {groups}
    {activePath}
    {profileNickname}
    {browseHref}
    {groupHref}
    {oncreategroup}
    {onjoingroup}
    {onprofileclick}
  />
  <main class="min-w-0 flex-1 overflow-auto">
    {@render children?.()}
  </main>
</div>
