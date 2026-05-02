import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: { customElement: true },
      // CRITICAL: only process registry Svelte files as custom elements.
      // SvelteKit route files must NOT be compiled with customElement: true.
      include: ['registry/**/*.svelte']
    })
  ],
  build: {
    lib: {
      entry: 'registry/index.ts',
      formats: ['es'],
      fileName: 'bundle'
    },
    outDir: 'static/registry',
    emptyOutDir: false
  }
});
