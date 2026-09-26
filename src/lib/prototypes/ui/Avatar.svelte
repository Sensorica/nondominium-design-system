<script lang="ts">
  // An agent's face: the https avatar URL when there is one, otherwise
  // initials on one of eight hues hashed from the agent id. Store-agnostic, so
  // F uses it with its own agents; A to E use AgentAvatar, which looks the
  // name and URL up in the shared store.
  import './proto.css';
  import { avatarColor, initials, isHttpsUrl } from './avatar';

  interface Props {
    /** Agent key or id: the colour seed. */
    id: string;
    /** Display name, for the initials and the tooltip. Defaults to the id. */
    name?: string;
    /** https image URL; anything else is ignored. */
    url?: string | null;
    size?: number;
    /** A ring in the avatar's own hue, separated by the panel background. */
    ring?: boolean;
    title?: string;
  }

  let { id, name, url = null, size = 24, ring = false, title }: Props = $props();

  // An image that fails to load falls back to initials, until the URL changes.
  let failedUrl = $state<string | null>(null);
  const hue = $derived(avatarColor(id));
  const src = $derived(isHttpsUrl(url) && url !== failedUrl ? url : null);
</script>

<span
  class="pu avatar"
  class:avatar--ring={ring}
  title={title ?? name ?? id}
  style:--avatar-hue={hue}
  style:width="{size}px"
  style:height="{size}px"
  style:font-size="{Math.round(size * 0.4)}px"
>
  {#if src}
    <img {src} alt="" onerror={() => (failedUrl = src)} />
  {:else}
    {initials(name ?? id)}
  {/if}
</span>

<style>
  .avatar {
    border-radius: 50%;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: rgb(255 255 255);
    background: var(--avatar-hue);
    overflow: hidden;
    vertical-align: middle;
    line-height: 1;
  }
  .avatar--ring {
    box-shadow: 0 0 0 2px var(--_bg), 0 0 0 3px var(--avatar-hue);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
