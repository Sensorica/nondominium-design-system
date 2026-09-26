// Reading and writing a direction's view in the URL.
//
// A view is a query-param state of its direction route, so it is a surface a
// reviewer can link to and comment on (see surface-keys.ts). Two rules carried
// over from the replica's url-state helper, for the same reasons:
//   - every page prerenders, and SvelteKit forbids `url.searchParams` while
//     prerendering, so reads are gated on `browser`;
//   - never write the URL unless it would change, so a handler that fires
//     spuriously cannot loop or throw before the router exists.
import { browser } from '$app/environment';
import { page } from '$app/state';
import { goto, replaceState } from '$app/navigation';
import { paths } from '$lib/paths';
import { directionBySlug, type DirectionSlug, type ViewOf } from './directions';

/** The view in the URL, or the direction's default when the param is absent
 *  or names no view of this direction. Reactive inside components. */
export function currentView<S extends DirectionSlug>(slug: S): ViewOf<S> {
  const views = directionBySlug(slug)!.views;
  const v = browser ? page.url.searchParams.get('view') : null;
  return (views.some((x) => x.id === v) ? v : views[0].id) as ViewOf<S>;
}

/** The record a view is pinned to (`?group=`, `?ndo=`), if any. */
export function currentRecord(): { group: string | null; ndo: string | null } {
  if (!browser) return { group: null, ndo: null };
  return { group: page.url.searchParams.get('group'), ndo: page.url.searchParams.get('ndo') };
}

/** Go to a view. Pushes a history entry by default, so Back returns to the
 *  previous view; pass `replace` for changes that should not stack. */
export function goView<S extends DirectionSlug>(
  slug: S,
  view: ViewOf<S>,
  record?: { group?: string; ndo?: string },
  opts: { replace?: boolean } = {}
): void {
  if (!browser) return;
  const url = paths.protoView(slug, view, record);
  if (page.url.pathname + page.url.search === url) return;
  goto(url, { noScroll: true, keepFocus: true, replaceState: opts.replace ?? false });
}

/** Remove query params without navigating, e.g. `fresh` once it has been
 *  honoured, so a reload does not start over again. On the first load the
 *  router is not initialised yet even in afterNavigate (SvelteKit throws
 *  "Cannot call replaceState(...) before router is initialized"), so the
 *  write is deferred a tick and retried a few times. */
export function dropParams(names: string[], attempt = 0): void {
  if (!browser) return;
  setTimeout(() => {
    const url = new URL(page.url);
    let changed = false;
    for (const n of names) {
      if (url.searchParams.has(n)) {
        url.searchParams.delete(n);
        changed = true;
      }
    }
    if (!changed) return;
    try {
      replaceState(url, {});
    } catch {
      // Still not ready: try again, then give up. A flag left in the URL only
      // means a reload honours it again.
      if (attempt < 5) dropParams(names, attempt + 1);
    }
  }, 0);
}
