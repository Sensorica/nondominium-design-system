// Every prototype URL is prerendered.
//
// The obvious setup for a mock SPA is `ssr = false` plus the static adapter's
// 404.html fallback. It does not work here: a fallback-served page cannot
// hydrate — the markup in 404.html belongs to a different route — so SvelteKit
// client-renders instead and no `$effect` in the tree is ever scheduled. Every
// screen still paints, because `$derived` and the render tree do not need
// effects, which makes the failure quiet: modals never open, tabs never switch,
// stores never load.
//
// Since the prototype runs on fixed mock data, its URLs are enumerable. Each
// dynamic route exports `entries()`, so every one becomes a real prerendered
// page that hydrates normally. Deep links stop depending on the fallback too.
export const prerender = true;
