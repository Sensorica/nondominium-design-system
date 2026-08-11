<script lang="ts">
  import { paths } from '$lib/paths';
  import Specimen from '$lib/components/shared/Specimen.svelte';
  import TabNav from '$lib/components/shared/TabNav.svelte';
</script>

<header>
  <h1 class="ndo-h1">🧭 Navigation</h1>
  <p class="ndo-p mt-2" style="max-width:62ch">
    Three navigation surfaces: the tab bar inside an object, the sidebar rail across the app, and
    the screen map over everything. All three take their URLs from the paths module — no component
    in this system writes a route segment.
  </p>
</header>

<Specimen
  title="Tabs"
  note="Tabs are routes, not in-page state. That is what makes every NDO section deep-linkable and independently commentable."
  code={`<TabNav tabs={[
  { href: paths.ndoDetail(id), label: 'Identity', icon: '🧿' },
  { href: paths.ndoActivity(id), label: 'Activity', icon: '📈' },
]} />`}
>
  {#snippet demo()}
    <div style="width:100%">
      <TabNav
        tabs={[
          { href: paths.playbookNavigation(), label: 'Identity', icon: '🧿' },
          { href: paths.playbookButtons(), label: 'Activity', icon: '📈' },
          { href: paths.playbookBadges(), label: 'Governance', icon: '⚖️' },
        ]}
      />
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Sidebar item"
  note="Dark rail, emoji at a fixed 18px column so labels align regardless of glyph width."
  code={`<a class="item" href={paths.appHome()}>
  <span aria-hidden="true">🏛️</span> Lobby
</a>`}
>
  {#snippet demo()}
    <div class="rail">
      <a class="item item--on" href={paths.playbookNavigation()}><span class="ic">🏛️</span> Lobby</a>
      <a class="item" href={paths.playbookNavigation()}><span class="ic">👤</span> Agents</a>
      <a class="item" href={paths.playbookNavigation()}><span class="ic">➕</span> New NDO</a>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Screen map entry"
  note="Every keyed screen appears here. The label is human, the key is stable, and the key is what a comment thread is filed under."
  code={`<button class="entry">
  <span class="entry__label">NDO identity panel</span>
  <span class="ndo-mono">ndo-detail</span>
</button>`}
>
  {#snippet demo()}
    <div class="entry">
      <span class="entry__label">NDO identity panel</span>
      <span class="ndo-mono">ndo-detail</span>
    </div>
    <div class="entry entry--current">
      <span class="entry__label">Lobby — NDO browser</span>
      <span class="ndo-mono">lobby</span>
    </div>
  {/snippet}
</Specimen>

<style>
  .rail { background: rgb(var(--ndo-gray-900)); padding: 12px; border-radius: var(--ndo-radius-lg); display: flex; flex-direction: column; gap: 2px; width: 220px; }
  .item {
    display: flex; align-items: center; gap: 8px; padding: 6px 10px;
    border-radius: var(--ndo-radius-md); font-size: var(--ndo-text-sm);
    color: rgb(255 255 255 / 0.68); text-decoration: none;
  }
  .item--on { background: rgb(255 255 255 / 0.13); color: #fff; }
  .ic { width: 18px; text-align: center; }
  .entry {
    display: flex; flex-direction: column; gap: 2px; padding: 8px 12px;
    border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-lg);
    background: rgb(var(--ndo-color-card-bg)); width: 220px;
  }
  .entry--current { background: rgb(var(--ndo-primary-50)); border-color: rgb(var(--ndo-primary-400)); }
  .entry__label { font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-medium); }
</style>
