import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// GitHub Pages serves this site at a sub-path:
//   https://sensorica.github.io/nondominium-design-system/
// SvelteKit needs `paths.base` set to that segment so the router, the generated
// assets, and every authored link resolve under the repo path instead of the
// domain root (which 404s on a deep-link reload). Enabled only in the deployed
// build; DEV=true keeps `vite dev` at the domain root.
const dev = process.env.DEV === 'true';
const base = dev ? '' : (process.env.BASE_PATH ?? '/nondominium-design-system');

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      // SPA fallback: the /app subtree is client-rendered (ssr = false) and has
      // dynamic [id] routes that adapter-static cannot enumerate. The fallback
      // serves the app shell for those. It must be 404.html, because GitHub
      // Pages only honours a custom 404 page as its fallback and ignores
      // 200.html. Statically prerenderable pages (hub, tokens, playbook,
      // scenarios) still prerender as before.
      fallback: '404.html',
      precompress: false,
      strict: false
    }),
    paths: { base }
  }
};
