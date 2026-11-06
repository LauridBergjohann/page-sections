<img src="https://raw.githubusercontent.com/LauridBergjohann/page-sections/main/assets/page-sections-logo.svg" alt="Page Sections logo" width="64" height="64" />

# @page-sections/svelte

Svelte 5 components for building content-driven websites from reusable sections and layouts. Combine pages, responsive grids, text, media and card collections without introducing a separate page-building framework.

The library uses Svelte 5's typed props and snippets for composition. It works in plain Svelte with a Svelte-aware build tool and in SvelteKit. It does not require Tailwind, a router or a rendering engine.

## Installation and styles

In an existing Svelte application:

```bash
npm install @page-sections/svelte
```

The peer dependency is **Svelte `^5.56.4`**. Core and markdown-it are dependencies. The declared Node requirement is `>=22.12.0`; repository development uses Node 24 and npm 11.

Import components from `@page-sections/svelte`. PageShell, ContentPage, Navigation and Section load shared styles; content sections use Section internally. When using only low-level components such as Card, Image or ButtonGroup, load the complete stylesheet once:

```ts
import '@page-sections/svelte/styles.css';
```

The root export also re-exports core's **types**. Runtime utilities are imported from `@page-sections/core`. See [Installation](https://github.com/LauridBergjohann/page-sections/wiki/Installation) for application setup.

## Pages and layout

A **page** owns the document title, main heading and optional section index. A **section** groups meaningful content with an anchor, spacing and background. A **ContentBlock** spans columns inside ContentGrid; it does not create a heading or navigation entry.

- `PageShell` optionally shares a theme and explicit light/dark mode.
- `ContentPage` renders main content and establishes a section registry.
- `Section` wraps arbitrary content: `title` labels navigation, `headline` creates a visible heading.
- `ContentGrid` arranges explicit blocks using a container-responsive grid.
- `ContentBlock` selects a column span at each grid size.

This complete component works as `App.svelte` or a SvelteKit `+page.svelte`:

```svelte
<script lang="ts">
  import { PageShell, ContentPage, RichTextSection, Section, ContentGrid, ContentBlock } from '@page-sections/svelte';
</script>
<PageShell theme={{ accent: '#286449', radius: '12px' }}>
  <ContentPage page={{ title: 'The community garden', intro: 'A shared place to grow.' }} sectionNavigation>
    <RichTextSection section={{ id: 'welcome', title: 'Welcome', headline: 'Everyone can take part',
      body: 'Bring your curiosity. We provide the **tools and seeds**.' }} />
    <Section section={{ id: 'visit', title: 'Visit', headline: 'Plan your visit', background: { color: 'muted' } }}>
      <ContentGrid>
        <ContentBlock span={{ xs: 4, s: 3, m: 5, l: 8 }}>
          <h3>Open every Saturday</h3><p>Join us between 10 am and 2 pm.</p>
        </ContentBlock>
        <ContentBlock span={{ xs: 4, s: 3, m: 3, l: 4 }}>
          <h3>Find us</h3><p>42 Garden Lane</p>
        </ContentBlock>
      </ContentGrid>
    </Section>
  </ContentPage>
</PageShell>
```

Section supplies outer gutters once; ContentGrid adds internal gaps. Spans inherit from smaller container sizes and blocks retain DOM order. See [Pages and Sections](https://github.com/LauridBergjohann/page-sections/wiki/Pages-and-Sections) and [Section and ContentGrid](https://github.com/LauridBergjohann/page-sections/wiki/Section-and-ContentGrid).

## Content sections

Each example below is an independent Svelte component. Put its section inside ContentPage to include it in automatic navigation, or render it alone. Replace sample media paths with assets in your application's public/static directory.

### Custom page headers and host metadata

ContentPage keeps its default title area unless `showHeader={false}` is set or a `header` snippet replaces it. The snippet receives `(page, titleId)`; assign `titleId` to its heading to label main. `showHeader={false}` also suppresses a supplied header snippet. Use `manageDocumentTitle={false}` when the host route manages its document title. Standard HTML attributes such as `id`, `lang`, `aria-label` and `aria-labelledby` are forwarded to main; styling remains controlled through `theme` and `class`.

```svelte
<script>
  import { ContentPage, HeroSection } from '@page-sections/svelte';
</script>
<svelte:head><title>Our garden | Journal</title></svelte:head>
<ContentPage page={{ title: 'Our garden' }} showHeader={false} manageDocumentTitle={false}
  id="content" lang="en" aria-labelledby="welcome-title">
  <HeroSection section={{ id: 'welcome', title: 'Our garden', headingLevel: 1 }} />
</ContentPage>
```

Hero headings use the ID `${section.id}-title`. Without a visible page header or explicit accessible label, ContentPage labels main with `page.title`. Provide exactly one page-level h1 in your own header or content. Section navigation remains available in all header modes.

### HeroSection

Introduce a page area with a headline, optional image, supporting copy and actions. The hero defaults to `h2`. Set `section.headingLevel` to `1`, `2` or `3`; use `1` when the hero owns the page heading.

```svelte
<script>
  import { HeroSection } from '@page-sections/svelte';
</script>
<HeroSection section={{ id: 'join', title: 'Join us', headline: 'Grow something together',
  introduction: 'Small plots. Shared knowledge.', size: 'm',
  actions: [{ label: 'Plan a visit', href: '/visit' }] }} />
```

Use `section.image` for an ImageData object and `textBackground: false` to remove the translucent panel. [HeroSection reference](https://github.com/LauridBergjohann/page-sections/wiki/HeroSection).

### RichTextSection

Render Markdown by default, or use `format: 'text'` for plain text with preserved line breaks. Raw HTML in Markdown is escaped.

```svelte
<script>
  import { RichTextSection } from '@page-sections/svelte';
</script>
<RichTextSection section={{ id: 'story', title: 'Our story', headline: 'How it began',
  body: 'Neighbours planted **the first seeds**.\n\nNow everyone is welcome.' }} />
```

[RichTextSection reference](https://github.com/LauridBergjohann/page-sections/wiki/RichTextSection).

### ImageSection

Show an image alone or beside text. ImageData supports alt text, intrinsic dimensions, aspect ratio, fit and responsive sources.

```svelte
<script>
  import { ImageSection } from '@page-sections/svelte';
</script>
<ImageSection section={{ id: 'garden', title: 'The garden', headline: 'A place to share',
  image: { src: '/images/garden.jpg', alt: 'Raised beds beside a potting table', width: 1200, height: 900, aspect: '4/3' },
  description: 'Each bed is cared for by a small group of neighbours.', imageSide: 'right' }} />
```

[ImageSection reference](https://github.com/LauridBergjohann/page-sections/wiki/ImageSection).

### VideoSection

Use native HTML5 video with controls and optional caption tracks, or a YouTube ID/URL. Text can appear beside the player.

```svelte
<script>
  import { VideoSection } from '@page-sections/svelte';
</script>
<VideoSection section={{ id: 'tour', title: 'Video tour', headline: 'Take a look around',
  video: { provider: 'html5', src: '/media/tour.mp4', poster: '/images/tour.jpg',
    captions: [{ src: '/media/tour-en.vtt', language: 'en', label: 'English' }] },
  description: 'Meet the people who look after the garden.' }} />
```

[VideoSection reference](https://github.com/LauridBergjohann/page-sections/wiki/VideoSection).

### CardGridSection

Choose editorial cards for descriptions, footers and independent actions. The default catalog variant is a square full-card link with canonical S/M/L geometry.

```svelte
<script lang="ts">
  import { CardGridSection, type CardItem } from '@page-sections/svelte';
  const list: CardItem[] = [
    { id: 'beginners', title: 'Getting started', href: '/guides/beginners', description: 'Your first season.' },
    { id: 'seeds', title: 'Choosing seeds', href: '/guides/seeds', description: 'Find the right plants.' },
    { id: 'tools', title: 'Useful tools', href: '/guides/tools' }
  ];
</script>
<CardGridSection section={{ id: 'guides', title: 'Guides', headline: 'Practical guides' }} {list} cardVariant="editorial" itemSpan={{ xs: 4, s: 3, m: 4, l: 4 }} />
```

`cardSize` accepts `s`, `m` or `l`. `media(item)` and `itemContent(item)` snippets customize cards. [CardGridSection reference](https://github.com/LauridBergjohann/page-sections/wiki/CardGridSection).

### CarouselSection

Use the same CardItem model for a horizontal collection. Native overflow and scroll snap support touch, trackpad and keyboard scrolling. Optional arrows appear after hydration.

```svelte
<script>
  import { CarouselSection } from '@page-sections/svelte';
</script>
<CarouselSection section={{ id: 'seasons', title: 'Seasons', headline: 'A year in the garden' }}
  list={[
    { id: 'spring', title: 'Spring', href: '/seasons/spring' },
    { id: 'summer', title: 'Summer', href: '/seasons/summer' },
    { id: 'autumn', title: 'Autumn', href: '/seasons/autumn' }
  ]} controls={true} />
```

[CarouselSection reference](https://github.com/LauridBergjohann/page-sections/wiki/CarouselSection).

### Section for your own content

Use the general wrapper when content does not fit a predefined section. It has the same background, spacing and navigation model.

```svelte
<script>
  import { Section } from '@page-sections/svelte';
</script>
<Section section={{ id: 'contact', title: 'Contact', headline: 'Say hello', spacing: 'loose' }}>
  <p>Questions about joining? <a href="mailto:hello@example.com">Email the team</a>.</p>
</Section>
```

There are seven specialized content-section components plus the general Section wrapper. The data renderer also supports a `grid` discriminator; there is no exported `GridSection` component.

## Structured website content

RichTextSection accepts either Markdown/plain body or structured blocks: paragraphs, addresses, inline links, lists and nested panels. PanelSection supplies a standalone panel. ContentPage accepts page.hero for an automatic h1 artwork hero and bodyLayout="narrow" for complete documents. Combine these through Sections and grid data to build portfolio, biography and legal content without custom renderers.

See [structured text](https://github.com/LauridBergjohann/page-sections/wiki/RichTextSection), [panels](https://github.com/LauridBergjohann/page-sections/wiki/PanelSection) and [migration](https://github.com/LauridBergjohann/page-sections/wiki/Migrating-to-0.2).

## Navigation

Navigation is independent of ContentPage. Pass items for a built-in responsive menu, or use the menu snippet for a custom menu; `left` and `right` hold optional satellites, such as language links and theme buttons. Below 1600px, the controls are available through the Settings disclosure in the header. At XL and above they appear as outside satellites. Add a `brand` snippet for your logo and a `settingsIcon` snippet for an application-supplied icon; no icon library is required.

```svelte
<script lang="ts">
  import { PageShell, Navigation, MainMenu, ButtonGroup } from '@page-sections/svelte';
  let mode = $state<'light' | 'dark'>('light');
</script>
<PageShell {mode}>
  <Navigation label="Main navigation">
    {#snippet menu()}
      <MainMenu items={[{ id: 'home', label: 'Home', href: '/', current: true },
        { id: 'visit', label: 'Visit', href: '/visit' }]} />
    {/snippet}
    {#snippet left()}
      <ButtonGroup label="Language" items={[{ id: 'en', label: 'EN', href: '/en', selected: true },
        { id: 'de', label: 'DE', href: '/de' }]} />
    {/snippet}
    {#snippet right()}
      <ButtonGroup label="Theme" items={[{ id: 'light', label: 'Light', selected: mode === 'light' },
        { id: 'dark', label: 'Dark', selected: mode === 'dark' }]}
        onselect={item => { mode = item.id === 'dark' ? 'dark' : 'light'; }} />
    {/snippet}
  </Navigation>
</PageShell>
```

MainMenu supports nested groups through native details/summary. ButtonGroup renders links or buttons; the application owns selection, language routing and persistence. See [Navigation and Satellites](https://github.com/LauridBergjohann/page-sections/wiki/Navigation-and-Satellites).

Breadcrumbs describe a page's place in the site. Set `page.breadcrumbs` to render them automatically, or use Breadcrumbs directly. SectionNavigation links to the current page's anchors; ContentPage generates it when `sectionNavigation` is enabled. See [Breadcrumbs and Section Navigation](https://github.com/LauridBergjohann/page-sections/wiki/Breadcrumbs-and-Section-Navigation).

Bind Navigation.closeKey to the host route to close disclosures on programmatic navigation. scrollBehavior selects static, delayed (112px threshold) or fixed behavior. The wide header is 1536px at 2XL, including padding and borders.

## Data-driven pages

Use serializable models for CMS or database content. Sections chooses a renderer using each section's `type`.

```svelte
<script lang="ts">
  import { ContentPage, Sections, type PageData } from '@page-sections/svelte';
  const page: PageData = {
    title: 'Garden updates',
    sections: [
      { type: 'richText', id: 'news', title: 'News', headline: 'This month', body: 'The seedlings are ready.' },
      { type: 'carousel', id: 'reading', title: 'Reading', list: [
        { id: 'care', title: 'Seedling care', href: '/guides/care' }
      ] }
    ]
  };
</script>
<ContentPage {page} sectionNavigation><Sections sections={page.sections} /></ContentPage>
```

ContentPage does not automatically render `page.sections`: include Sections explicitly. Extend SectionTypeMap and pass `renderers` for your own types. See [Data Models and Custom Sections](https://github.com/LauridBergjohann/page-sections/wiki/Data-Models-and-Custom-Sections).

## Styling and themes

Use PageShell's `theme` prop for shared colors, fonts, radii and reading widths, or set CSS variables on an ancestor. `mode="dark"` enables the built-in dark palette; the host decides when to change it.

```css
.garden-theme {
  --ps-accent: #286449;
  --ps-section-muted: #eef3ed;
  --ps-radius: 12px;
  --ps-font-family: Georgia, serif;
  --ps-narrow-max: 720px;
}
```

SectionSurfaceGroup, automatically provided by ContentPage, joins adjacent backgrounds. Card and Image are available as standalone building blocks. See [Themes and Styling](https://github.com/LauridBergjohann/page-sections/wiki/Themes-and-Styling) and the [CSS/token reference](https://github.com/LauridBergjohann/page-sections/wiki/CSS-Variables-and-Layout-Tokens).

## SSR and progressive enhancement

Text, card links, native video and carousel overflow can be present in the initial HTML when the host uses SSR or prerendering. Theme buttons and carousel arrows require JavaScript; native links and scrolling do not. Carousel buttons respect reduced-motion preferences.

The [repository demo](https://github.com/LauridBergjohann/page-sections/tree/main/apps/demo) builds browser/server bundles, prerenders HTML and hydrates it. See [SSR and Progressive Enhancement](https://github.com/LauridBergjohann/page-sections/wiki/SSR-and-Progressive-Enhancement).

## Further reading

- [Wiki home](https://github.com/LauridBergjohann/page-sections/wiki)
- [Svelte API](https://github.com/LauridBergjohann/page-sections/wiki/Svelte-API)
- [Responsive Layout and Breakpoints](https://github.com/LauridBergjohann/page-sections/wiki/Responsive-Layout-and-Breakpoints)
- [Core API](https://github.com/LauridBergjohann/page-sections/wiki/Core-API)

Licensed under MPL-2.0. See the package's LICENSE and NOTICE files.
