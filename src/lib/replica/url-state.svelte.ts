// Reading and writing UI state in the query string, safely.
//
// Modal, tab and panel states live in the query string so each is a linkable,
// commentable surface. Two hazards come with that, and both bit hard:
//
//  1. Every prototype URL is prerendered, and SvelteKit forbids touching
//     `url.searchParams` while prerendering. So reads are gated on `browser`;
//     the server renders the base state and the client applies the param on
//     hydration.
//
//  2. Melt's Dialog fires `onOpenChange(false)` while it initialises, before
//     SvelteKit's router exists. Calling `replaceState` then throws — and an
//     unhandled throw during hydration aborts the effect flush for the whole
//     tree, which leaves every screen painted and nothing working. Guarding on
//     "would this actually change the URL" avoids the call, and also stops the
//     write → param → state → write cycle that replaces the crash with a hang.
//
//  3. SvelteKit's replaceState is shallow routing: it rewrites the address bar
//     and page.state, and deliberately leaves page.url alone. Reading params off
//     page.url therefore never saw a single write this module made. A tab click
//     changed the address bar and nothing else; a modal closed through the URL
//     reopened on the next click. So every write goes through replaceUrl below,
//     which records the search it wrote against the page.url it was written
//     over, and every read takes that record while page.url is still the same
//     object. A real navigation replaces page.url, and the record lapses.

import { untrack } from 'svelte';
import { browser } from '$app/environment';
import { page } from '$app/state';
import { replaceState } from '$app/navigation';

/** The search this module last wrote, and the page.url it was written over. */
let shallow = $state.raw<{ over: URL; search: string } | null>(null);

if (browser) {
  // Back and forward between shallow entries do not navigate either.
  addEventListener('popstate', () => {
    shallow = { over: page.url, search: location.search };
  });
}

/**
 * Drop the shallow record after every completed navigation. Keying the record
 * on page.url alone is not enough: a link to the URL page.url already holds
 * (say ?profile=1, after a Cancel shallow-wrote it away) is a navigation that
 * leaves page.url untouched, because SvelteKit only swaps it when the href
 * differs. Mounted from the prototype's root layout through afterNavigate.
 */
export function resetShallowUrl(): void {
  shallow = null;
}

/** The URL the address bar shows: page.url plus any shallow write over it.
 *  Always a fresh copy, so a caller may edit it. */
export function currentUrl(): URL {
  const over = page.url;
  const url = new URL(over);
  if (shallow && shallow.over === over) url.search = shallow.search;
  return url;
}

/** Shallow-replace the URL and make the change visible to urlParam readers. */
export function replaceUrl(url: URL): void {
  if (!browser) return;
  const over = page.url;
  replaceState(url, {});
  shallow = { over, search: url.search };
}

/**
 * One derived per param name, so an effect that reads `?modal=` re-runs when
 * `?modal=` changes and not when `?profile=` does. The app's equivalents are
 * separate local $state variables; reading the whole URL would re-run every
 * URL-opened modal's effect on any write and reopen what the agent had closed.
 *
 * They are created here, at module evaluation, and never lazily. Svelte does not
 * track a $derived that is created inside the reaction reading it (it lands in
 * the reaction's current_sources), so a derived first created inside, say,
 * NdoView's paramTab would leave paramTab blind to the tab for the component's
 * whole life. That is exactly how tab clicks came to do nothing.
 */
class Param {
  name: string;
  value = $derived.by(() => currentUrl().searchParams.get(this.name));
  constructor(name: string) {
    this.name = name;
  }
}
/** Every param a replica component reads. A name missing here still works, it
 *  just re-runs its readers on any URL change instead of on its own. */
const PARAM_NAMES = [
  'state',
  'tab',
  'modal',
  'join',
  'profile',
  'editProfile',
  'openCreateGroup',
  'openJoinGroup',
  'group',
  'createNdo',
  'groupProfile'
];
const params = new Map<string, Param>(PARAM_NAMES.map((n) => [n, new Param(n)]));

export function urlParam(name: string): string | null {
  if (!browser) return null;
  const p = params.get(name);
  return p ? p.value : currentUrl().searchParams.get(name);
}

export function urlFlag(name: string, value = '1'): boolean {
  return urlParam(name) === value;
}

/**
 * Set or clear a query param, but only when it would actually change the URL.
 * Idempotent by construction: calling it with the value already in the URL is
 * a no-op, so it can be wired to a handler that fires spuriously.
 */
export function setUrlParam(name: string, value: string | null): void {
  if (!browser) return;
  const url = currentUrl();
  if (url.searchParams.get(name) === value) return;
  if (value === null) url.searchParams.delete(name);
  else url.searchParams.set(name, value);
  replaceUrl(url);
}

export function setUrlFlag(name: string, on: boolean): void {
  setUrlParam(name, on ? '1' : null);
}

/**
 * Clear a param only while it still holds `value`. For modals that a key opens
 * from the URL but the app closes through local state: when the local flag goes
 * false the URL must follow, or the next replaceState (a tab click) re-runs the
 * opening effect and the modal comes back. `alsoSet` lands in the same write:
 * a modal key selects its tab implicitly, so closing it has to name that tab or
 * the view falls back to Resources underneath the agent.
 */
export function clearUrlParamIf(
  name: string,
  value: string,
  alsoSet: Record<string, string | null> = {}
): void {
  if (!browser || urlParam(name) !== value) return;
  const url = currentUrl();
  url.searchParams.delete(name);
  for (const [k, v] of Object.entries(alsoSet)) {
    if (v === null) url.searchParams.delete(k);
    else url.searchParams.set(k, v);
  }
  replaceUrl(url);
}

/**
 * Two-way wiring between a modal flag the app keeps in local state and one value
 * of a URL param the replica adds so a key can address it. Call it during
 * component init. The flag opens when the param takes the value and, if the URL
 * is what opened it, closes when the param moves on (a client navigation to the
 * next key must not leave the last key's modal on screen); and when the flag
 * goes false, however it got there, the param is cleared so the next write to
 * the URL does not reopen it. A flag the agent opened by clicking is left alone.
 */
export function bindUrlModal(
  name: string,
  value: string,
  flag: { get: () => boolean; set: (open: boolean) => void },
  alsoSet: Record<string, string | null> = {}
): void {
  let fromUrl = false;
  let wasOpen = false;
  $effect(() => {
    if (urlParam(name) === value) {
      fromUrl = true;
      untrack(() => flag.set(true));
    } else if (fromUrl) {
      fromUrl = false;
      untrack(() => flag.set(false));
    }
  });
  $effect(() => {
    const open = flag.get();
    if (wasOpen && !open) untrack(() => clearUrlParamIf(name, value, alsoSet));
    wasOpen = open;
  });
}
