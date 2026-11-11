import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
export default {
  preprocess: vitePreprocess(),
  kit: {
    // The repository-root vercel.json deploys this workspace's build directory.
    // Keep it explicit so VERCEL does not switch to .vercel/output/static.
    adapter: adapter({ pages: 'build', assets: 'build' }),
    paths: { base: process.env.BASE_PATH ?? '' }
  }
};
