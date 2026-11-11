<script lang="ts">
  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';
  import { Section, CardGridSection } from '@page-sections/svelte';
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
        'A Svelte 5 component library for content-driven websites. Build portfolios, product pages and documentation from reusable sections that share one responsive layout system.',
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
  <Section
    section={{
      id: 'what-is-page-sections',
      title: 'What is Page Sections?',
      headline: 'From content to a complete page.',
      layout: 'narrow',
      spacing: 'loose'
    }}
  >
    <div class="prose">
      <p>
        Page Sections brings the structure of a website into a small set of composable components: a
        page contains sections, sections arrange text, images, cards and code. Navigation, spacing,
        surfaces and responsive grids follow the same layout rules.
      </p>
      <p>
        Write your content directly in Svelte and HTML, or pass structured data from JSON files and
        your own CMS. Use it in Svelte or SvelteKit, from a single landing page to a growing
        publication. You choose the content and visual identity; the components handle the layout.
      </p>
    </div>
  </Section>
  <CardGridSection
    section={{
      id: 'features',
      title: 'Why Page Sections?',
      headline: 'The common work, already connected.',
      introduction: 'A consistent foundation with room for your own design.',
      spacing: 'loose'
    }}
    cardVariant="editorial"
    cardTone="muted"
    list={[
      {
        id: 'layout',
        title: 'One responsive layout system',
        description:
          'Pages, grids and cards share content widths and spacing. Layouts adapt to their containers, including narrow columns on wide screens.',
        href: base + '/docs/responsive-layout/'
      },
      {
        id: 'sections',
        title: 'Sections that work together',
        description:
          'Compose heroes, rich text, panels, images, video, card grids, carousels and code examples. Combine them without rebuilding the page structure.',
        href: base + '/docs/svelte-api/'
      },
      {
        id: 'content',
        title: 'Your content, your source',
        description:
          'Start with ordinary Svelte and HTML. Use serializable models when your content comes from JSON or a CMS, and add custom sections when you need them.',
        href: base + '/docs/data-and-custom-sections/'
      },
      {
        id: 'html',
        title: 'Content before JavaScript',
        description:
          'With SSR or prerendering, text, links and native navigation arrive as HTML. JavaScript adds interactions to an already readable page.',
        href: base + '/docs/ssr/'
      },
      {
        id: 'theme',
        title: 'A foundation for your brand',
        description:
          'Use light and dark themes, standard and muted surfaces, and shared CSS variables to make the same components feel at home in your design.',
        href: base + '/docs/themes/'
      },
      {
        id: 'independent',
        title: 'Bring your own application',
        description:
          'Use the library in plain Svelte or SvelteKit. No required CSS framework, CMS or router; syntax highlighting is an optional addition.',
        href: base + '/getting-started/installation/'
      }
    ]}
  />
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
