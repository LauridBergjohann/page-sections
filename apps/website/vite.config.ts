import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ command }) => ({
  plugins: [sveltekit()],
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
