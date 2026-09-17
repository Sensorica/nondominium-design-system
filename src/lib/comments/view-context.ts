/**
 * The conditions a comment was written under, appended to its body.
 *
 * A report saying "this chip is unreadable" is unactionable without knowing
 * what it was read at. GitHub Discussions has no custom metadata, so the body
 * is the only place this can live.
 *
 * Deliberately NOT part of the comment key: keying on viewing conditions would
 * fork every surface into two threads and split one conversation in half.
 *
 * The format is fixed so it stays greppable — searching Discussions for
 * `Viewed: dark` returns the dark reports as a set. ASCII only, same reason.
 *
 * Ported 2026-09-17 from requests-offers-design-system, branch
 * feat/comments-unread-and-replies, src/lib/comments/view-context.ts.
 *
 * ONE DIVERGENCE, and it is the honest one. The reference reads its own theme
 * store. This kit has no theme: it is a replica of the Nondominium app, which
 * is light-only UnoCSS, and inventing a theme value here would record a
 * condition the kit cannot actually be viewed in. So this reads the browser's
 * colour-scheme preference instead, which is a real fact about the reviewer's
 * screen. The day the app gains a theme, this reads the replica's store and the
 * recorded strings stay the same shape.
 */

function scheme(): string {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'unknown';
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'unknown';
  }
}

export function viewContext(): string {
  const size = typeof window === 'undefined' ? 'unknown' : `${window.innerWidth}x${window.innerHeight}`;
  return `\n\n---\nViewed: ${scheme()} · ${size}`;
}
