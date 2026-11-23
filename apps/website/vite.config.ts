import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ command }) => ({
  plugins: [sveltekit({ preprocess: vitePreprocess(), adapter: adapter({ pages: 'build', assets: 'build' }), paths: { base: (process.env.BASE_PATH ?? '') as '' | `/${string}`, relative: false } })],
  // Develop against the workspace sources. Production still consumes the built package.
  resolve:
    command === 'serve'
      ? {
          alias: [
            {
              find: /^@page-sections\/svelte$/,
              replacement: fileURLToPath(
                new URL('../../packages/svelte/src/index.ts', import.meta.url)
              )
            },
            {
              find: /^@page-sections\/svelte\/styles\.css$/,
              replacement: fileURLToPath(
                new URL('../../packages/svelte/src/styles.css', import.meta.url)
              )
            },
            {
              find: /^@page-sections\/svelte\/highlight$/,
              replacement: fileURLToPath(
                new URL('../../packages/svelte/src/highlight.ts', import.meta.url)
              )
            }
          ]
        }
      : undefined,
  optimizeDeps: { exclude: ['@page-sections/svelte', '@page-sections/core'] }
}));
