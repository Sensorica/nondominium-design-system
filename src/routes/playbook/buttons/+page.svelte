<script lang="ts">
  import Specimen from '$lib/components/shared/Specimen.svelte';
</script>

<header>
  <h1 class="ndo-h1">🔘 Buttons</h1>
  <p class="ndo-p mt-2" style="max-width:60ch">
    Three intents and two sizes. Radius is 8px, not pill — Nondominium is a rectangular system, and
    the pill is reserved for badges and dots so a badge is never mistaken for a control.
  </p>
</header>

<Specimen
  title="Intents"
  note="Primary for the one action the screen exists for. Ghost for everything else. Destructive only for transitions that cannot be undone."
  code={`<button class="ndo-btn ndo-btn--primary">Create NDO</button>
<button class="ndo-btn ndo-btn--ghost">Cancel</button>
<button class="ndo-btn ndo-btn--destructive">Declare end of life</button>`}
>
  {#snippet demo()}
    <button class="ndo-btn ndo-btn--primary">Create NDO</button>
    <button class="ndo-btn ndo-btn--ghost">Cancel</button>
    <button class="ndo-btn ndo-btn--destructive">Declare end of life</button>
  {/snippet}
</Specimen>

<Specimen
  title="Sizes"
  note="The small size is for inline actions inside a row or a panel header."
  code={`<button class="ndo-btn ndo-btn--primary">Default</button>
<button class="ndo-btn ndo-btn--primary ndo-btn--sm">Small</button>`}
>
  {#snippet demo()}
    <button class="ndo-btn ndo-btn--primary">Default</button>
    <button class="ndo-btn ndo-btn--primary ndo-btn--sm">Small</button>
  {/snippet}
</Specimen>

<Specimen
  title="With an icon"
  note="Emoji are the icon system. They sit before the label with the button's own gap; no wrapper needed."
  code={`<button class="ndo-btn ndo-btn--primary">➕ New NDO</button>`}
>
  {#snippet demo()}
    <button class="ndo-btn ndo-btn--primary">➕ New NDO</button>
    <button class="ndo-btn ndo-btn--ghost">🔄 Transition</button>
    <button class="ndo-btn ndo-btn--ghost">🍴 Fork</button>
  {/snippet}
</Specimen>

<Specimen
  title="Disabled"
  note="Half opacity and not-allowed. Never hide a disabled action — a reader needs to see what would become possible."
  code={`<button class="ndo-btn ndo-btn--primary" disabled>Create NDO</button>`}
>
  {#snippet demo()}
    <button class="ndo-btn ndo-btn--primary" disabled>Create NDO</button>
    <button class="ndo-btn ndo-btn--ghost" disabled>Cancel</button>
  {/snippet}
</Specimen>

<Specimen
  title="Custom element"
  note="The embeddable form. Same tokens, shadow DOM, no framework required."
  code={`<ndo-button variant="primary">Create NDO</ndo-button>
<ndo-button variant="ghost">Cancel</ndo-button>
<ndo-button variant="destructive">Delete</ndo-button>`}
>
  {#snippet demo()}
    <ndo-button variant="primary">Create NDO</ndo-button>
    <ndo-button variant="ghost">Cancel</ndo-button>
    <ndo-button variant="destructive">Delete</ndo-button>
  {/snippet}
</Specimen>
