<script lang="ts">
  import { HeroSection, ImageSection, CardGridSection } from '@page-sections/svelte';

  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';
  import { technologies } from '$lib/technologies';
  const illustration = (name: string, alt: string) => ({
    src: base + `/illustrations/${name}.svg`,
    alt,
    width: 800,
    height: 500
  });
</script>

<svelte:head
  ><meta
    name="description"
    content="Build content-driven websites with Page Sections. Explore live examples, learn the basics and try every layout."
  /></svelte:head
>
<ContentPage page={{ title: 'Give your ideas a place.' }}>
  <HeroSection
    section={{
      ...{
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
          src: base + '/hero-light.webp',
          srcDark: base + '/hero-dark.webp',
          alt: 'Layered page layouts with a hero, cards and a shared content grid',
          width: 1499,
          height: 1049
        },
        imageSide: 'left',
        actions: [
          { label: 'Get started', href: base + '/getting-started/', variant: 'primary' },
          { label: 'Explore sections', href: base + '/sections/', variant: 'secondary' }
        ]
      },
      headingLevel: 1
    }}
  />
  <ImageSection
    section={{
      id: 'what-is-page-sections',
      title: 'What is Page Sections?',
      headline: 'From content to a complete page.',
      image: {
        src: base + '/hero.png',
        alt: 'Content sources, page sections and theme settings connected in one website',
        width: 1536,
        height: 1024,
        aspect: '16/9',
        objectFit: 'contain'
      },
      imageSide: 'right',
      spacing: 'loose',
      background: { color: 'standard', size: 'full' }
    }}
  >
    <div class="prose">
      <p>
        Page Sections brings the structure of a website into a small set of composable components: a
        page contains sections, sections arrange text, images, cards and code. Header, spacing,
        surfaces and responsive grids follow the same layout rules.
      </p>
      <p>
        Write your content directly in Svelte and HTML, or pass structured data from JSON files and
        your own CMS. Use it in Svelte or SvelteKit, from a single landing page to a growing
        publication. You choose the content and visual identity; the components handle the layout.
      </p>
    </div>
  </ImageSection>
  <CardGridSection
    section={{
      id: 'features',
      title: 'Why Page Sections?',
      headline: 'Features',
      introduction: 'A consistent foundation with room for your own design.',
      spacing: 'loose',
      background: { color: 'muted', size: 'full' }
    }}
    cardVariant="editorial"
    cardTone="standard"
    list={[
      {
        id: 'layout',
        image: illustration('feature-layout', 'One content grid adapts from desktop to mobile'),
        title: 'One responsive layout system',
        description:
          'Pages, grids and cards share content widths and spacing. Layouts adapt to their containers, including narrow columns on wide screens.',
        href: base + '/docs/design-system/responsive-layout/'
      },
      {
        id: 'sections',
        image: illustration('feature-sections', 'Different sections combine into a coherent page'),
        title: 'Sections that work together',
        description:
          'Compose heroes, rich text, panels, images, video, card grids, carousels and code examples. Combine them without rebuilding the page structure.',
        href: base + '/docs/reference/svelte-api/'
      },
      {
        id: 'content',
        image: illustration('feature-content', 'Structured content becomes a visual page'),
        title: 'Your content, your source',
        description:
          'Start with ordinary Svelte and HTML. Use serializable models when your content comes from JSON or a CMS, and add custom sections when you need them.',
        href: base + '/docs/advanced/data-and-custom-sections/'
      },
      {
        id: 'html',
        image: illustration('feature-html', 'Readable content arrives as a complete document'),
        title: 'Content before JavaScript',
        description:
          'With SSR or prerendering, text, links and native navigation arrive as HTML. JavaScript adds interactions to an already readable page.',
        href: base + '/docs/advanced/ssr/'
      },
      {
        id: 'theme',
        image: illustration('feature-theme', 'A shared palette connects light and dark themes'),
        title: 'A foundation for your brand',
        description:
          'Use light and dark themes, standard and muted surfaces, and shared CSS variables to make the same components feel at home in your design.',
        href: base + '/docs/foundations/themes/'
      },
      {
        id: 'independent',
        image: illustration(
          'feature-independent',
          'A section library connects to different applications'
        ),
        title: 'Bring your own application',
        description:
          'Use the library in plain Svelte or SvelteKit. No required CSS framework, CMS or router; syntax highlighting is an optional addition.',
        href: base + '/docs/foundations/installation/'
      }
    ]}
  />
  <CardGridSection
    section={{
      id: 'explore',
      title: 'Explore',
      headline: 'See it. Try it. Build it.',
      spacing: 'loose',
      background: { color: 'standard', size: 'full' }
    }}
    cardVariant="editorial"
    cardTone="standard"
    list={[
      {
        id: 'start',
        title: 'Install it or try it in the playground',
        description:
          'Start your first page locally or experiment with a working example in your browser.',
        href: base + '/getting-started/',
        image: illustration('explore-start', 'An installation command beside a live page preview')
      },
      {
        id: 'sections',
        title: 'Explore available sections',
        description:
          'Find the right building blocks and try their layouts in interactive examples.',
        href: base + '/sections/',
        image: illustration('explore-sections', 'A catalog of different section layouts')
      },
      {
        id: 'theme',
        title: 'Make it yours — create a custom theme',
        description: 'Adapt colors, typography and surfaces to your own visual identity.',
        href: base + '/docs/foundations/themes/',
        image: illustration('explore-theme', 'Color swatches bring a personal identity to a page')
      }
    ]}
  />
  <CardGridSection
    section={{ id: 'built-with', title: 'Built with', headline: 'Built with', spacing: 'loose' }}
    list={technologies}
    cardSize="m"
    cardTone="muted"
    mediaAspect="4/3"
    mediaFit="contain"
    textAlign="center"
    cardVariant="catalog"
  />
</ContentPage>
