import { base } from '#lib/paths.js';

export const technologies = [
  {
    id: 'page-sections',
    title: 'Page Sections',
    description: 'Composable page layouts',
    href: 'https://page-sections.bergjohann.com/',
    icon: '/page-sections-logo.svg'
  },
  {
    id: 'npm',
    title: 'npm',
    description: 'Packages and releases',
    href: 'https://www.npmjs.com/package/@page-sections/svelte'
  },
  {
    id: 'github',
    title: 'GitHub',
    description: 'Source and collaboration',
    href: 'https://github.com/LauridBergjohann/page-sections',
    monochrome: true
  },
  {
    id: 'vercel',
    title: 'Vercel',
    description: 'Hosting and deployments',
    href: 'https://vercel.com/',
    monochrome: true
  },
  {
    id: 'svelte',
    title: 'Svelte',
    description: 'Reactive components',
    href: 'https://svelte.dev/'
  },
  {
    id: 'bergjohann',
    title: 'Laurid Bergjohann',
    description: 'Design and development',
    href: 'https://bergjohann.com/'
  },
  {
    id: 'vscode',
    title: 'VS Code',
    description: 'Code editing',
    href: 'https://code.visualstudio.com/'
  },
  {
    id: 'codex',
    title: 'Codex',
    description: 'AI-assisted development',
    href: 'https://chatgpt.com/codex',
    monochrome: true
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
