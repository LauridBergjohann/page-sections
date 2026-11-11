<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'ts',
      code: `// src/routes/+page.ts in a SvelteKit application
export const prerender = true;`
    }
  ];
</script>

<script lang="ts">
  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';
  import { Section, CodeBlock } from '@page-sections/svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{ title: 'SSR and enhancement', pageTitle: 'SSR and enhancement · Page Sections' }}
  showContentMenu
>
  <Section section={{ id: 'overview', title: 'Overview', spacing: 'tight' }}
    ><div class="prose">
      <p>
        Page Sections components can render meaningful HTML on the server. The host application must
        enable SSR or prerendering; importing the library into a client-only application does not
        provide either automatically.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'what-works-without-application-javascript',
      title: 'What works without application JavaScript?',
      headline: 'What works without application JavaScript?',
      variant: 'content'
    }}
    ><div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Initial HTML / CSS behavior</th>
              <th>Client enhancement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pages, sections, grids</td>
              <td>Text, headings, backgrounds and responsive layout</td>
              <td>Reactive updates</td>
            </tr>
            <tr>
              <td>CardGridSection</td>
              <td>One set of articles, images and native title links</td>
              <td>Optional application snippets</td>
            </tr>
            <tr>
              <td>CarouselSection</td>
              <td>Same content model; focusable native overflow with scroll snap</td>
              <td>Optional previous/next buttons after mount</td>
            </tr>
            <tr>
              <td>MainMenu</td>
              <td>Native links and details/summary disclosures</td>
              <td>No additional menu engine</td>
            </tr>
            <tr>
              <td>ButtonGroup</td>
              <td>Native links; rendered buttons</td>
              <td>Button callbacks require JavaScript</td>
            </tr>
            <tr>
              <td>Breadcrumbs / SectionNavigation</td>
              <td>Native links, including generated page anchors</td>
              <td>Registration changes and keyed reorder updates</td>
            </tr>
            <tr>
              <td>Image</td>
              <td>Native picture, alt text and dimensions</td>
              <td>Explicit shell mode changes can update source selection</td>
            </tr>
            <tr>
              <td>HTML5 video</td>
              <td>Native controls and caption tracks</td>
              <td>Browser media behavior</td>
            </tr>
            <tr>
              <td>YouTube</td>
              <td>Embed element</td>
              <td>Provider playback may require its own scripts/network</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Carousel scrolling supports touch/trackpad and native arrow-key behavior when the track has
        focus. Links remain normal Tab stops. Buttons scroll by 85% of track width, respect RTL and
        avoid smooth movement when reduced motion is requested. No alternate copy of the cards is
        created for SSR or failure fallback.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'host-responsibilities',
      title: 'Host responsibilities',
      headline: 'Host responsibilities',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Use SvelteKit's normal server rendering or prerendering, or supply a server-render/prerender
        pipeline for plain Svelte. Ensure your initial data is available at render time and use the
        same data for hydration. Select persisted themes in the host if you need to avoid a theme
        flash. Supply image dimensions, routes, media files, consent handling and appropriate text
        alternatives.
      </p>
      <p>
        In SvelteKit, a page can opt into prerendering when its content is available at build time:
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
      <p>This export is a host configuration, not a Page Sections prop.</p>
    </div></Section
  >
  <Section
    section={{
      id: 'demo-reference',
      title: 'Demo reference',
      headline: 'Demo reference',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        The SvelteKit 2 demo in <code>apps/demo</code> uses adapter-static and
        <code>prerender = true</code>
        in its root layout. The website, minimal demo and regression application all produce complete
        HTML and hydrate it in the browser. <code>npm run dev:website</code> serves the
        documentation at http://127.0.0.1:5174. <code>npm run demo</code> builds and previews the minimal
        consumer at http://127.0.0.1:4173. SvelteKit is an application dependency only.
      </p>
      <p>
        Inspect page source and test with JavaScript disabled. The repository's browser tests cover
        375/840/1600px widths, native carousel keyboard scrolling and a hydrated environment without
        WebGPU. The package has no WebGPU dependency or GPU detection behavior.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'accessibility-limits',
      title: 'Accessibility limits',
      headline: 'Accessibility limits',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        ContentPage's generated navigation comes after sections in DOM order and is moved visually
        with CSS. Native scrolling is not a live-region slideshow. The library does not
        automatically choose heading levels in arbitrary Markdown/snippets, announce slide changes,
        or implement application-level focus restoration. Review those decisions in your actual page
        composition.
      </p>
      <p>
        Related: <a href={base + '/docs/carousel/'}>CarouselSection</a>,
        <a href={base + '/getting-started/installation/'}>Installation</a>,
        <a
          href="https://github.com/LauridBergjohann/page-sections/blob/main/docs/development/demo.md"
          >demo development guide</a
        >.
      </p>
    </div></Section
  >
</ContentPage>
