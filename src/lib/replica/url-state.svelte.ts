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
import { browser } from '$app/environment';
import { page } from '$app/state';
import { replaceState } from '$app/navigation';

export function urlParam(name: string): string | null {
  return browser ? page.url.searchParams.get(name) : null;
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
  const current = page.url.searchParams.get(name);
  if (current === value) return;
  const url = new URL(page.url);
  if (value === null) url.searchParams.delete(name);
  else url.searchParams.set(name, value);
  replaceState(url, {});
}

export function setUrlFlag(name: string, on: boolean): void {
  setUrlParam(name, on ? '1' : null);
}
