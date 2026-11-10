<script lang="ts">
  import {
    ContentPage,
    HeroSection,
    RichTextSection,
    CardGridSection
  } from '@page-sections/svelte';
  import { landscape } from '$lib/content';
</script>

<svelte:head
  ><meta
    name="description"
    content="Explore Page Sections: reusable sections, responsive layouts and data-driven content for Svelte and SvelteKit."
  /></svelte:head
>
<ContentPage
  page={{
    title: 'Space for your ideas.',
    pageTitle: 'Page Sections — A place for your content',
    eyebrow: 'Simple pieces. Thoughtful pages.',
    intro: 'A composable toolkit for content-driven websites, built with Svelte 5.'
  }}
>
  <HeroSection
    section={{
      id: 'welcome',
      title: 'Welcome',
      headline: 'Good content deserves a clear structure.',
      introduction:
        'Reusable sections. Flexible page layouts. Responsive grids. Start with a story and give it room to grow.',
      background: { color: 'standard' },
      image: landscape,
      size: 'l',
      actions: [
        { label: 'Explore components', href: '/components/' },
        { label: 'Discover backgrounds', href: '/backgrounds/' }
      ]
    }}
  />
  <RichTextSection
    section={{
      id: 'approach',
      title: 'The approach',
      headline: 'Start small. Compose freely.',
      layout: 'narrow',
      spacing: 'spacious',
      body: 'Build a portfolio, a publication or a product page from sections that work together. Compose them directly in Svelte, or render the same layouts from serializable content supplied by a CMS.\n\nPage Sections works in ordinary **Svelte and SvelteKit** applications. This reference uses SvelteKit to deliver complete HTML for every page, with interactions added after hydration.'
    }}
  />
  <CardGridSection
    section={{
      id: 'explore',
      title: 'Explore the library',
      headline: 'Two ways to explore',
      background: { color: 'muted' },
      spacing: 'loose'
    }}
    list={[
      {
        id: 'components',
        eyebrow: '01 / The building blocks',
        title: 'From a single image to a complete page',
        description: 'Explore sections, grids, cards, carousels and a data-driven story.',
        href: '/components/',
        image: landscape
      },
      {
        id: 'backgrounds',
        eyebrow: '02 / The atmosphere',
        title: 'Surfaces that belong together',
        description: 'Compare solid backgrounds, flowing gradients and automatic surface grouping.',
        href: '/backgrounds/',
        image: { ...landscape, src: '/coast.svg', alt: 'Sunlit sandstone cliffs beside the sea' }
      }
    ]}
    cardVariant="editorial"
    itemSpan={{ xs: 4, s: 3, m: 4, l: 6 }}
  />
</ContentPage>
