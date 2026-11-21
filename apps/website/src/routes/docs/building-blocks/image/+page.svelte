<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: "<script>\n  import { Section, Image } from '@page-sections/svelte';\n<\/script>\n\n<Section section={{ id: 'garden', title: 'Garden', headline: 'A place to grow' }}>\n  <Image image={{ src: '/images/garden.jpg', alt: 'Raised beds beside a greenhouse', width: 1200, height: 800, aspect: '4/3', objectFit: 'cover' }} />\n</Section>"
    }
  ];
</script>

<script lang="ts">
  import ComponentPlayground from '$lib/ComponentPlayground.svelte';
  import { base } from '$app/paths';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';
  import WebsitePage from '$lib/WebsitePage.svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<WebsitePage page={{ title: 'Image', pageTitle: 'Image · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Image',
      introduction:
        'Render a single accessible image with optional responsive sources and a dark-mode alternative.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'playground',
      title: 'Try it yourself',
      headline: 'Try it yourself',
      background: { color: 'standard' }
    }}
  >
    <ComponentPlayground kind="image" />
  </Section>
  <Section
    section={{
      id: 'single-image',
      title: 'An image inside your content',
      headline: 'An image inside your content',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Image renders a picture and img using an <a
          href={base + '/docs/reference/types/#image-data'}>ImageData</a
        > object. The src and alt fields are required. Describe the image’s purpose in alt, or use an
        empty string for a purely decorative image.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      id: 'image-props-and-complete-imagedata-model',
      title: 'Props and image fields',
      headline: 'Props and image fields',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        The image prop is required. eager is an optional boolean, default false, which switches
        loading from lazy to eager. The component has no children or general HTML attribute
        forwarding.
      </p>
      <p>
        Use width and height for the intrinsic dimensions to reduce layout shifts. aspect selects
        none, 4/3, 16/9, 2/1 or square. objectFit defaults to cover; contain preserves the whole
        image within the frame. srcset and sizes are forwarded to the fallback img; provide your own
        image assets and responsive variants.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'color-mode',
      title: 'Light and dark sources',
      headline: 'Light and dark sources',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        srcDark supplies an alternative for dark mode. An ancestor PageShell provides an explicit
        light or dark mode; without that context the image follows the browser color preference.
        Setting a CSS theme attribute alone does not provide this Svelte context.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'choose',
      title: 'Image or ImageSection?',
      headline: 'Image or ImageSection?',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Use Image inside your own markup or a card. Use <a href={base + '/sections/image/'}
          >ImageSection</a
        >
        for a complete page region with a heading and optional accompanying text. When composing standalone
        low-level components, import the shared stylesheet once as explained in
        <a href={base + '/docs/foundations/installation/'}>Installation</a>.
      </p>
    </div></Section
  >
</WebsitePage>
