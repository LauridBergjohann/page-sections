<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script>
  import { ContentPage, HeroSection } from '@page-sections/svelte';
<\/script>

<ContentPage page={{ title: 'The garden project' }}>
  <HeroSection
    section={{
      id: 'welcome',
      title: 'Welcome',
      eyebrow: 'Open to everyone',
      headline: 'Grow something together',
      introduction: 'A shared space for small beginnings.',
      size: 'm',
      textBackground: true,
      image: {
        src: '/images/garden.jpg',
        alt: 'Neighbours working in a garden',
        width: 1200,
        height: 800
      },
      actions: [{ label: 'Plan your visit', href: '/visit' }]
    }}
  >
    <p>No experience needed.</p>
  </HeroSection>
</ContentPage>`
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

<ContentPage page={{ title: 'Hero', pageTitle: 'Hero · Page Sections' }} showContentMenu>
  <Section section={{ id: 'overview', title: 'Overview', spacing: 'tight' }}
    ><div class="prose">
      <p>
        Use HeroSection for a prominent introduction or call to action. It combines an optional
        image with a readable copy area; omit the image for a text-led hero.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      id: 'props-and-configuration',
      title: 'Props and configuration',
      headline: 'Props and configuration',
      variant: 'content'
    }}
    ><div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>section</code></td>
              <td><code>Omit&lt;HeroSectionData, 'type'&gt;</code></td>
              <td>Required</td>
            </tr>
            <tr>
              <td><code>children</code></td>
              <td><code>Snippet</code></td>
              <td>Optional extra content below actions</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Section accepts all <a href={base + '/docs/content-grid/'}>SectionDefinition fields</a>,
        with these additions and specific behaviors:
      </p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Default / behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>image</code></td>
              <td><code>ImageData</code></td>
              <td>Optional; loaded eagerly</td>
            </tr>
            <tr>
              <td><code>size</code></td>
              <td><code>'s'</code>, <code>'m'</code>, <code>'l'</code></td>
              <td>m; minimum height 18rem, 28rem, 36rem respectively</td>
            </tr>
            <tr>
              <td><code>textBackground</code></td>
              <td><code>boolean</code></td>
              <td>true unless explicitly false</td>
            </tr>
            <tr>
              <td><code>actions</code></td>
              <td><code>ContentAction[]</code></td>
              <td>Optional native primary/secondary/text links</td>
            </tr>
            <tr>
              <td><code>composition</code></td>
              <td>overlay/artwork</td>
              <td>overlay; artwork separates text and contained media</td>
            </tr>
            <tr>
              <td><code>imageSide</code></td>
              <td>left/right</td>
              <td>right for artwork; ignored for overlay</td>
            </tr>
            <tr>
              <td><code>headline</code></td>
              <td><code>string</code></td>
              <td>Falls back to title</td>
            </tr>
            <tr>
              <td><code>eyebrow</code>, <code>introduction</code></td>
              <td><code>string</code></td>
              <td>Rendered in the hero copy</td>
            </tr>
            <tr>
              <td><code>headingLevel</code></td>
              <td><code>HeadingLevel</code> (1-6)</td>
              <td>Inherits the surrounding level; standalone h2; page.hero supplies h1</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The outer Section suppresses its duplicate header and references the hero heading for its
        accessible label. The data-driven discriminator is <code>type: 'hero'</code>.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'styling-responsive-behavior-and-accessibility',
      title: 'Styling, responsive behavior and accessibility',
      headline: 'Styling, responsive behavior and accessibility',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Copy uses responsive padding/margins and a maximum width of 44rem. The heading scales from
        2rem to 4.5rem. The optional panel mixes <code>--ps-section-standard</code> with
        transparency; corners use <code>--ps-radius</code>. The image fills the hero's background
        area, respecting ImageData's fit choice. Content can grow beyond the minimum height.
      </p>
      <p>
        Provide appropriate image alt text, or <code>alt: ''</code> for decorative imagery. Actions
        remain native links in SSR HTML. The heading ID is
        <code>$&#123;section.id&#125;-title</code>. There is no slideshow, autoplay or special
        client initialization.
      </p>
      <p>
        Related: <a href={base + '/docs/card-and-image/'}>Card and Image</a>,
        <a href={base + '/docs/page-shell/'}>ContentPage and PageShell</a>.
      </p>
      <p>
        Artwork composition stacks text and media below an 840px container, then uses two columns.
        The image is contained rather than used as a background. Use page.hero to produce the single
        page-level h1 without a custom header snippet.
      </p>
      <p>
        Hero eyebrows use accent color, uppercase lettering and 24px space before the heading.
        Introductions start 28px below the heading, with a responsive 16-20px font and 1.75 line
        height. Actions start 32px below the preceding text. These margins are defined by the
        component and survive host CSS resets.
      </p>
    </div></Section
  >
</ContentPage>
