import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
export default defineConfig({ plugins: [svelte()], resolve: { conditions: ['node'] }, test: { include: ['tests/**/*.test.ts'], environment: 'node' } });
