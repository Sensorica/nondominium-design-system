<script lang="ts">
  // F's own tiny agent chip: an 18×18 rounded square carrying the first
  // letter of the agent's name, coloured by conductor key ('a' blue, 'b'
  // amber). Ported verbatim from the original's AG_COL/agSt() — F never used
  // the shared $lib/prototypes/ui Avatar (that draws a circle, hashing an
  // arbitrary id into one of eight hues), so this is not a hue substitute for
  // it, it is the original's own shape.
  import { tok } from './model';

  interface Props {
    /** The conductor key ('a' | 'b'); any other value falls back to grey. */
    agent: string;
    name: string;
  }
  let { agent, name }: Props = $props();

  const AG_COL: Record<string, [string, string]> = { a: ['blue-100', 'blue-700'], b: ['amber-100', 'amber-800'] };
  const bg = $derived(tok((AG_COL[agent] ?? ['gray-100', 'gray-700'])[0]));
  const fg = $derived(tok((AG_COL[agent] ?? ['gray-100', 'gray-700'])[1]));
  const initial = $derived((name || '?').slice(0, 1));
</script>

<span class="avatar" style:background={bg} style:color={fg} aria-hidden="true">{initial}</span>

<style>
  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    font-family: var(--ndo-font-sans);
    font-size: 11px;
    font-weight: var(--ndo-weight-bold);
    flex-shrink: 0;
  }
</style>
