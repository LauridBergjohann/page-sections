import { base } from '#lib/paths.js';

export const technologies = [
  {
    id: 'npm',
    title: 'npm',
    description: 'install the Packages',
    href: 'https://www.npmjs.com/package/@page-sections/svelte'
  },
  {
    id: 'github',
    title: 'GitHub',
    description: 'check out the source',
    href: 'https://github.com/LauridBergjohann/page-sections',
    monochrome: true
  },
  {
    id: 'vercel',
    title: 'Vercel',
    description: 'is used to host these pages',
    href: 'https://vercel.com/',
    monochrome: true
  },
  {
    id: 'svelte',
    title: 'Svelte',
    description: "without Svelte we wouldn't be here",
    href: 'https://svelte.dev/'
  },
  {
    id: 'vscode',
    title: 'VS Code',
    description: 'used for Code editing',
    href: 'https://code.visualstudio.com/'
  },
  {
    id: 'codex',
    title: 'Codex',
    description: 'used for AI-assisted development',
    href: 'https://chatgpt.com/codex',
    monochrome: true
  },
  {
    id: 'bergjohann',
    title: 'Laurid Bergjohann',
    description: 'check out my other projects',
    href: 'https://bergjohann.com/'
  },
  {
    id: 'page-sections',
    title: 'Page Sections',
    description: 'these pages are created with Page Sections',
    href: 'https://page-sections.bergjohann.com/',
    icon: '/page-sections-logo.svg'
  }
].map(({ icon, monochrome, ...item }) => ({
  ...item,
  icon: item.id,
  image: {
    src: base + (icon ?? `/technology/${item.id}.svg`),
    srcDark: monochrome ? base + `/technology/${item.id}-dark.svg` : undefined,
    alt: '',
    width: 128,
    height: 128
  }
}));
