<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: "<script>\n  import { PageShell, Header, ContentPage, Section, Footer } from '@page-sections/svelte';\n<\/script>\n\n<PageShell>\n  <Header items={[{ id: 'home', label: 'Home', href: '/' }]}>\n    {#snippet brand()}<a href=\"/\">The garden</a>{/snippet}\n  </Header>\n  <ContentPage page={{ title: 'Visit the garden' }}>\n    <h1>Visit the garden</h1>\n    <Section section={{ id: 'hours', title: 'Hours', headline: 'Opening hours' }}>\n      <p>Saturday, 10:00–16:00.</p>\n    </Section>\n  </ContentPage>\n  <Footer footnote=\"© The garden\" links={[{ label: 'Contact', href: '/contact/' }]} />\n</PageShell>"
    }
  ];
</script>

<script lang="ts">
  import { base } from '#lib/paths.js';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';
  import WebsitePage from '#lib/WebsitePage.svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<WebsitePage
  page={{ title: 'Page layout', pageTitle: 'Page layout · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Page layout',
      introduction:
        'Give your content a semantic HTML structure that readers and assistive technology can navigate.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'landmarks',
      title: 'Start with the HTML document',
      headline: 'Start with the HTML document',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        The body contains the visible document. Inside it, a site-level header introduces the site
        and its navigation, main contains this page’s unique content, and a site-level footer closes
        the page with shared information and links. Use one main landmark for the current page. A
        nav identifies a collection of navigation links.
      </p>
      <pre><code
          >body
  header — site identity and navigation
  main — the content of this page
    h1 — page heading
    section — first topic
    section — next topic
  footer — shared links and information</code
        ></pre>
      <p>
        Sections organize topics within main. Header and footer landmarks belong alongside main.
        HTML also permits a footer inside an article for attribution; that is different from the
        site footer.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'library-mapping',
      title: 'Use the same structure in Svelte',
      headline: 'Use the same structure in Svelte',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        You already know ContentPage and Section. Header renders the site header, and Footer renders
        the site footer. PageShell is an optional div wrapper: it shares a theme and color mode
        across its children without adding another landmark. Your application supplies the document
        body.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div>
  </Section>
  <Section
    section={{
      id: 'chapters',
      title: 'Build the page from top to bottom',
      headline: 'Build the page from top to bottom',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <ol>
        <li>
          <a href={base + '/docs/page-layout/header/'}>Header and satellites</a>: Add site identity,
          menus and optional tools beside the header.
        </li>
        <li>
          <a href={base + '/docs/page-layout/breadcrumbs/'}>Breadcrumbs</a>: Show where the current
          page sits in the site hierarchy.
        </li>
        <li>
          <a href={base + '/docs/page-layout/content-page/'}>ContentPage and sidebars</a>: Separate
          page content, site navigation and the on-page index.
        </li>
        <li>
          <a href={base + '/docs/page-layout/headings-and-anchors/'}>
            Heading levels and anchor links
          </a>: Keep the document outline and section destinations predictable.
        </li>
        <li>
          <a href={base + '/docs/page-layout/footer/'}>Footer</a>: Finish the document with shared
          links and attribution.
        </li>
      </ol>
    </div>
  </Section>
</WebsitePage>
