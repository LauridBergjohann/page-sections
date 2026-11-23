import { base } from '#lib/paths.js';

export const technologies = [
  {
    id: 'page-sections',
    title: 'Made with Page Sections',
    href: 'https://page-sections.bergjohann.com/',
    icon: '/page-sections-logo.svg'
  },
  {
    id: 'npm',
    title: 'Available on NPM',
    href: 'https://www.npmjs.com/package/@page-sections/svelte'
  },
  {
    id: 'github',
    title: 'Source available on GitHub',
    href: 'https://github.com/LauridBergjohann/page-sections',
    monochrome: true
  },
  { id: 'vercel', title: 'Hosted on Vercel', href: 'https://vercel.com/', monochrome: true },
  { id: 'svelte', title: 'Made for Svelte', href: 'https://svelte.dev/' },
  { id: 'bergjohann', title: 'Developed by Laurid Bergjohann', href: 'https://bergjohann.com/' },
  { id: 'vscode', title: 'Created in VS Code', href: 'https://code.visualstudio.com/' },
  { id: 'codex', title: 'Supported by Codex', href: 'https://chatgpt.com/codex', monochrome: true }
].map(({ icon, monochrome, ...item }) => ({
  ...item,
  image: {
    src: base + (icon ?? `/technology/${item.id}.svg`),
    srcDark: monochrome ? base + `/technology/${item.id}-dark.svg` : undefined,
    alt: '',
    width: 128,
    height: 128
  }
}));
