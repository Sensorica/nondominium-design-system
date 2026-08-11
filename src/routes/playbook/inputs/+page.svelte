<script lang="ts">
  import Field from '$lib/components/shared/Field.svelte';
  import Specimen from '$lib/components/shared/Specimen.svelte';

  let text = $state('Community Solar Array');
  let choice = $state('Nondominium');
  let note = $state('');
</script>

<header>
  <h1 class="ndo-h1">✏️ Inputs</h1>
  <p class="ndo-p mt-2" style="max-width:60ch">
    Every control is wrapped in a field, so the label, the hint and the error always sit in the same
    place. The focus ring is one token, defined once, and applies to every focusable element.
  </p>
</header>

<Specimen
  title="Field"
  note="Label above, control, then either a hint or an error — never both. The error replaces the hint rather than stacking, because a reader with an error does not need the hint any more."
  code={`<Field label="Name" required hint="Permanent. This is how the network refers to it.">
  {#snippet control()}
    <input class="ndo-input" bind:value={name} />
  {/snippet}
</Field>`}
>
  {#snippet demo()}
    <div style="width:100%;max-width:420px;display:flex;flex-direction:column;gap:16px">
      <Field label="Name" required hint="Permanent. This is how the network refers to it.">
        {#snippet control()}<input class="ndo-input" bind:value={text} />{/snippet}
      </Field>
      <Field label="Name" required error="Another NDO already uses this name. Allowed, but confusing.">
        {#snippet control()}<input class="ndo-input" value="Community Solar Array" />{/snippet}
      </Field>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Controls"
  note="Input, select and textarea share the same border, radius, padding and focus treatment."
  code={`<input class="ndo-input" />
<select class="ndo-select">…</select>
<textarea class="ndo-textarea"></textarea>`}
>
  {#snippet demo()}
    <div style="width:100%;max-width:420px;display:flex;flex-direction:column;gap:12px">
      <input class="ndo-input" placeholder="Text input" />
      <select class="ndo-select" bind:value={choice}>
        <option>Private</option>
        <option>Commons</option>
        <option>Nondominium</option>
        <option>CommonPool</option>
      </select>
      <textarea class="ndo-textarea" bind:value={note} placeholder="Textarea, vertically resizable"></textarea>
    </div>
  {/snippet}
</Specimen>

<Specimen
  title="Disabled fieldset"
  note="Level 2 disclosure uses this: choosing to stay pseudonymous disables the field list rather than hiding it, so the reader can see what they are declining."
  code={`<fieldset class="fields" disabled={anonymous}>…</fieldset>`}
>
  {#snippet demo()}
    <fieldset style="border:none;margin:0;padding:0;opacity:.5;display:flex;flex-direction:column;gap:8px" disabled>
      <label style="display:flex;gap:8px"><input type="checkbox" /> <span class="ndo-small">Real name</span></label>
      <label style="display:flex;gap:8px"><input type="checkbox" /> <span class="ndo-small">Email</span></label>
    </fieldset>
  {/snippet}
</Specimen>
