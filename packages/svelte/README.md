# @page-sections/svelte

Svelte 5 pages, sections, content grids, cards, scroll-snap carousels and standalone navigation. Works with plain Svelte/Vite and SvelteKit. Core is installed as a normal dependency; Svelte is a peer.

```svelte
<script>
  import { ContentPage, CardGridSection } from '@page-sections/svelte';
</script>
<ContentPage page={{ title: 'Work' }} sectionNavigation>
  <CardGridSection section={{ id: 'projects', title: 'Projects', headline: 'Projects' }}
    list={[{ id: 'one', title: 'Project One', href: '/one' }]} />
</ContentPage>
```

Components load their CSS. Explicit stylesheet export: `@page-sections/svelte/styles.css`. SSR or prerender your application to provide content without JavaScript. No SvelteKit, Tailwind or WebGPU runtime dependency.

See [documentation and demo source](https://github.com/LauridBergjohann/page-sections). MPL-2.0; see NOTICE.
