<script lang="ts">
  // A ```mermaid block from a meeting journal, as a framed, numbered, captioned
  // figure that opens in a zoomable view.
  //
  // Mermaid is the npm package, imported on demand so the journals' text never
  // waits on it and a meeting without a diagram never loads it. It draws in the
  // browser only: until it has (and when it cannot), the figure shows the diagram
  // source, which is also what a reader without JavaScript gets.
  //
  // Colours come from the --ndo-* palette tokens, resolved at draw time, and it
  // redraws when <html data-theme> flips, so the diagram follows the site's theme.
  import { onMount } from 'svelte';

  let { id, n, source, caption }: { id: string; n: number; source: string; caption: string } = $props();

  let svg = $state('');
  let failed = $state('');
  let open = $state(false);
  let scale = $state(1);
  let dark = $state(false);

  /** A `--ndo-*` RGB triplet ("219 234 254") as #rrggbb, the form mermaid's colour parser takes. */
  function tok(name: string, fallback: string): string {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(`--ndo-${name}`).trim();
    const parts = raw.split(/[\s,]+/).map(Number);
    if (parts.length < 3 || parts.some((p) => Number.isNaN(p))) return fallback;
    return '#' + parts.slice(0, 3).map((p) => p.toString(16).padStart(2, '0')).join('');
  }

  async function draw() {
    try {
      const { default: mermaid } = await import('mermaid');
      const d = document.documentElement.dataset.theme === 'dark';
      dark = d;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--ndo-font-sans') || 'sans-serif',
        themeVariables: d
          ? {
              background: tok('gray-900', '#111827'),
              primaryColor: tok('primary-900', '#1e3a8a'),
              primaryBorderColor: tok('primary-400', '#60a5fa'),
              primaryTextColor: tok('gray-50', '#f9fafb'),
              secondaryColor: tok('gray-800', '#1f2937'),
              tertiaryColor: tok('gray-800', '#1f2937'),
              lineColor: tok('gray-400', '#9ca3af'),
              textColor: tok('gray-50', '#f9fafb'),
              noteBkgColor: tok('gray-800', '#1f2937'),
              noteTextColor: tok('gray-50', '#f9fafb'),
              mainBkg: tok('primary-900', '#1e3a8a'),
              nodeBorder: tok('primary-400', '#60a5fa'),
              clusterBkg: tok('gray-800', '#1f2937'),
              edgeLabelBackground: tok('gray-900', '#111827'),
            }
          : {
              background: '#ffffff',
              primaryColor: tok('primary-100', '#dbeafe'),
              primaryBorderColor: tok('primary-600', '#2563eb'),
              primaryTextColor: tok('gray-900', '#111827'),
              secondaryColor: tok('gray-100', '#f3f4f6'),
              tertiaryColor: tok('gray-50', '#f9fafb'),
              lineColor: tok('gray-500', '#6b7280'),
              textColor: tok('gray-900', '#111827'),
              noteBkgColor: tok('amber-100', '#fef3c7'),
              noteTextColor: tok('gray-900', '#111827'),
              mainBkg: tok('primary-100', '#dbeafe'),
              nodeBorder: tok('primary-600', '#2563eb'),
              clusterBkg: tok('gray-50', '#f9fafb'),
              edgeLabelBackground: '#ffffff',
            },
      });
      const out = await mermaid.render(`mmd-${id}-${Date.now().toString(36)}`, source);
      svg = out.svg;
      failed = '';
    } catch (e) {
      failed = e instanceof Error ? e.message : String(e);
    }
  }

  onMount(() => {
    draw();
    const watch = new MutationObserver(() => draw());
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => watch.disconnect();
  });

  const clamp = (v: number) => Math.min(6, Math.max(0.5, Math.round(v * 100) / 100));
  function openZoom() {
    if (!svg) return;
    scale = 1;
    open = true;
  }
  function onKey(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape') open = false;
    else if (e.key === '+' || e.key === '=') scale = clamp(scale * 1.25);
    else if (e.key === '-') scale = clamp(scale / 1.25);
    else if (e.key === '0') scale = 1;
  }
  function onWheel(e: WheelEvent) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    scale = clamp(scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1));
  }
</script>

<svelte:window onkeydown={onKey} />

<figure class="fig" {id} class:dark>
  <div class="frame">
    {#if svg}
      <button class="diagram" onclick={openZoom} title="Open zoomable view" aria-label="Figure {n}: open zoomable view">{@html svg}</button>
    {:else}
      <pre class="src">{source}</pre>
      {#if failed}<p class="err">The diagram could not be drawn: {failed}</p>{/if}
    {/if}
  </div>
  <figcaption>
    <b>Figure {n}.</b>
    {caption || 'Diagram'}
    {#if svg}<button class="zoom" onclick={openZoom}>⤢ zoom</button>{/if}
  </figcaption>
</figure>

{#if open}
  <div class="modal" role="dialog" aria-modal="true" aria-label="Figure {n}, zoomed">
    <div class="tools">
      <b>Figure {n}.</b>
      <span class="cap">{caption}</span>
      <button onclick={() => (scale = clamp(scale / 1.25))} aria-label="Zoom out">−</button>
      <span class="pct">{Math.round(scale * 100)}%</span>
      <button onclick={() => (scale = clamp(scale * 1.25))} aria-label="Zoom in">+</button>
      <button onclick={() => (scale = 1)}>reset</button>
      <button onclick={() => (open = false)} aria-label="Close">✕</button>
    </div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="stage" onwheel={onWheel}>
      <div class="canvas" style="width:{scale * 100}%">{@html svg}</div>
    </div>
  </div>
{/if}

<style>
  .fig { margin: var(--ndo-spacing-6) 0; padding: 0; border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-lg); background: rgb(var(--ndo-color-card-bg)); overflow: hidden; }
  .frame { padding: var(--ndo-spacing-4); overflow-x: auto; }
  .diagram { display: block; width: 100%; background: none; border: 0; padding: 0; cursor: zoom-in; }
  .diagram :global(svg) { display: block; margin: 0 auto; max-width: 100%; height: auto; }
  .src { margin: 0; font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); line-height: var(--ndo-lh-xs); color: var(--ndo-color-text-secondary); white-space: pre-wrap; }
  .err { margin: var(--ndo-spacing-2) 0 0; font-size: var(--ndo-text-xs); color: rgb(var(--ndo-red-600)); }
  figcaption { display: flex; flex-wrap: wrap; gap: var(--ndo-spacing-2); align-items: baseline; padding: var(--ndo-spacing-2) var(--ndo-spacing-4); border-top: 1px solid var(--ndo-color-border-subtle); background: var(--ndo-color-surface); font-size: var(--ndo-text-sm); line-height: var(--ndo-lh-sm); color: var(--ndo-color-text-secondary); }
  figcaption b { color: var(--ndo-color-text-primary); }
  .zoom { margin-left: auto; font: inherit; font-size: var(--ndo-text-xs); color: var(--ndo-color-link); background: none; border: 0; cursor: pointer; }
  .zoom:hover { text-decoration: underline; }

  .modal { position: fixed; inset: 0; z-index: 80; display: flex; flex-direction: column; background: rgb(var(--ndo-color-card-bg)); }
  .tools { display: flex; align-items: center; gap: var(--ndo-spacing-2); padding: var(--ndo-spacing-2) var(--ndo-spacing-4); border-bottom: 1px solid var(--ndo-color-border); font-size: var(--ndo-text-sm); color: var(--ndo-color-text-primary); }
  .tools .cap { flex: 1; color: var(--ndo-color-text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .tools button { font: inherit; color: var(--ndo-color-text-primary); background: var(--ndo-color-surface); border: 1px solid var(--ndo-color-border); border-radius: var(--ndo-radius-md); padding: 2px 10px; cursor: pointer; }
  .pct { min-width: 3.5em; text-align: center; font-family: var(--ndo-font-mono); font-size: var(--ndo-text-xs); }
  .stage { flex: 1; overflow: auto; padding: var(--ndo-spacing-6); }
  .canvas { margin: 0 auto; }
  .canvas :global(svg) { display: block; width: 100%; max-width: none !important; height: auto; }
</style>
