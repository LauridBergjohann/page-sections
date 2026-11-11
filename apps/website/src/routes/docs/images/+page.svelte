<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script>
  import { ImageSection } from '@page-sections/svelte';
<\/script>

<ImageSection
  section={{
    id: 'place',
    title: 'Our place',
    headline: 'A garden for everyone',
    image: {
      src: '/images/garden.jpg',
      alt: 'Raised garden beds and an accessible path',
      width: 1200,
      height: 900,
      aspect: '4/3',
      objectFit: 'cover'
    },
    description: 'Wide paths connect the shared growing beds.',
    imageSide: 'right'
  }}
>
  <p><a href="/access">Read our access information</a>.</p>
</ImageSection>`
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

<ContentPage page={{ title: 'Images', pageTitle: 'Images · Page Sections' }} showContentMenu>
  <Section section={{ id: 'overview', title: 'Overview', spacing: 'tight' }}
    ><div class="prose">
      <p>
        Use ImageSection for an image on its own or paired with explanatory text. Children provide
        richer accompanying content without storing markup in the image data.
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
              <td><code>Omit&lt;ImageSectionData, 'type'&gt;</code></td>
              <td>Required</td>
            </tr>
            <tr>
              <td><code>children</code></td>
              <td><code>Snippet</code></td>
              <td>Optional; rendered beside/after media, after description</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Alongside <a href={base + '/docs/content-grid/'}>SectionDefinition</a>:</p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>image</code></td>
              <td><code>ImageData</code>, required</td>
              <td>See full fields in Card and Image</td>
            </tr>
            <tr>
              <td><code>description</code></td>
              <td><code>string</code></td>
              <td>Optional plain text paragraph</td>
            </tr>
            <tr>
              <td><code>imageSide</code></td>
              <td><code>'left'</code> or <code>'right'</code></td>
              <td>Left unless right is supplied</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The data discriminator is <code>image</code>. There is no caption-specific prop: use
        children for a caption or accompanying text. The section headline is above the media/text
        pair.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'responsive-layout-and-ssr',
      title: 'Responsive layout and SSR',
      headline: 'Responsive layout and SSR',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Without description or children, media fills the section's content width. With accompanying
        content, it stacks below 600px container width. At 600px and above, the media/text ratio is
        1.7:1; right places the image visually after the text. DOM reading order remains image then
        text. <code>srcDark</code>, dimensions, ratios and fit are implemented by Image, described
        in <a href={base + '/docs/card-and-image/'}>Card and Image</a>.
      </p>
      <p>
        Images are lazy-loaded and decoded asynchronously. Supply intrinsic width/height to reserve
        space, and meaningful alt text or an empty string for decoration. Layout and native image
        selection work without application JavaScript. The host supplies and optimizes the actual
        assets.
      </p>
      <p>
        Related: <a href={base + '/docs/video/'}>VideoSection</a>,
        <a href={base + '/docs/themes/'}>Themes and Styling</a>.
      </p>
    </div></Section
  >
</ContentPage>
