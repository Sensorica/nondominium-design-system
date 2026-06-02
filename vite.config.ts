import { sveltekit } from '@sveltejs/kit/vite';
import path from 'node:path';
import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import extractorSvelte from '@unocss/extractor-svelte';

export default defineConfig({
  plugins: [UnoCSS({ extractors: [extractorSvelte()] }), sveltekit()],
  resolve: {
    alias: {
      '@nondominium/ndo-ui': path.resolve('./packages/ndo-ui/src')
    }
  }
});
