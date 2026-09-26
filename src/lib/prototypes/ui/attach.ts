// Attachments shared by the kit (Svelte 5 `{@attach ...}`).

/** Focus the element once it is in the document. Used instead of the
 *  `autofocus` attribute, which fires only on page load. */
export function focusOnMount(node: HTMLElement): void {
  queueMicrotask(() => node.focus());
}
