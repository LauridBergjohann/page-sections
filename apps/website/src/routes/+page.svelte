<script lang="ts">
  import { base } from '$app/paths';
  import { ContentPage, Section, CardGridSection } from '@page-sections/svelte';
</script>

<svelte:head
  ><meta
    name="description"
    content="Build content-driven websites with Page Sections. Explore live examples, learn the basics and try every layout."
  /></svelte:head
>
<ContentPage
  page={{
    title: 'Give your ideas a place.',
    hero: {
      type: 'hero',
      id: 'welcome',
      title: 'Page Sections',
      headline: 'Give your ideas a place.',
      eyebrow: 'Page Sections · Svelte 5',
      composition: 'artwork',
      size: 'l',
      introduction:
        'A thoughtful set of building blocks for content-driven websites. Compose a page, try a layout, make it your own.',
      image: {
        src: base + '/landscape.svg',
        alt: 'Layered green hills beneath a quiet sky',
        width: 1200,
        height: 750
      },
      actions: [
        { label: 'Get started', href: base + '/getting-started/', variant: 'primary' },
        { label: 'Explore the showcase', href: base + '/showcase/', variant: 'text' }
      ]
    }
  }}
>
  <CardGridSection
    section={{
      id: 'explore',
      title: 'Explore',
      headline: 'See it. Try it. Build it.',
      spacing: 'loose'
    }}
    cardVariant="editorial"
    cardTone="muted"
    list={[
      {
        id: 'cards',
        eyebrow: '01 / Try a layout',
        title: 'Make room for your content',
        description:
          'Change card sizes, surfaces and image proportions. See the result and the code together.',
        href: base + '/docs/card-grid/'
      },
      {
        id: 'code',
        eyebrow: '02 / Explain an idea',
        title: 'Code belongs in the story',
        description: 'Present readable, highlighted examples on their own or alongside text.',
        href: base + '/docs/code/'
      },
      {
        id: 'data',
        eyebrow: '03 / Compose freely',
        title: 'Start with HTML. Grow with data.',
        description: 'Use components directly or render serializable content from your own CMS.',
        href: base + '/docs/data-and-custom-sections/'
      }
    ]}
  />
  <Section
    section={{
      id: 'built-with',
      title: 'Built with Page Sections',
      headline: 'The documentation is a working example.',
      layout: 'narrow',
      spacing: 'loose'
    }}
  >
    <div class="prose">
      <p>
        Every page on this website uses the same components you install. Navigation, reading
        layouts, cards and code examples all come from Page Sections.
      </p>
      <p>
        No special renderer, router or CSS framework is required. Content and links are available
        before JavaScript; interactions enhance them when it loads.
      </p>
    </div>
  </Section>
</ContentPage>
