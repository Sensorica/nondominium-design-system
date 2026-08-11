// The prototype subtree is a client-only SPA: it runs on module-level $state
// singletons, guard machines, and a status-to-URL redirect effect, all of which
// are browser-only. Prerendering would freeze the wrong initial state, and the
// dynamic [id] routes cannot be enumerated at build time — the static adapter's
// 404.html fallback serves them instead.
export const ssr = false;
export const prerender = false;
