<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script>
  import { VideoSection } from '@page-sections/svelte';
<\/script>

<VideoSection
  section={{
    id: 'tour',
    title: 'Tour',
    headline: 'Meet the garden team',
    video: {
      provider: 'html5',
      src: '/media/tour.mp4',
      poster: '/images/tour.jpg',
      captions: [{ src: '/media/tour-en.vtt', language: 'en', label: 'English' }]
    },
    description: 'A short tour of the shared spaces.',
    videoSide: 'left'
  }}
>
  <p><a href="/tour-transcript">Read the transcript</a>.</p>
</VideoSection>`
    }
  ];
</script>

<script lang="ts">
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage page={{ title: 'Video', pageTitle: 'Video · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Video',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard', size: 'standard' }
    }}
  />
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'overview',
      title: 'Overview',
      spacing: 'tight'
    }}
    ><div class="prose">
      <p>
        Use VideoSection for a native video player or YouTube embed, optionally paired with text.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
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
              <td><code>Omit&lt;VideoSectionData, 'type'&gt;</code></td>
              <td>Required</td>
            </tr>
            <tr>
              <td><code>children</code></td>
              <td><code>Snippet</code></td>
              <td>Optional accompanying content after description</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Alongside <a href={base + '/docs/foundations/content-grid/'}>SectionDefinition</a>:</p>
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
              <td><code>video</code></td>
              <td><code>VideoData</code>, required</td>
              <td>No default</td>
            </tr>
            <tr>
              <td><code>description</code></td>
              <td><code>string</code></td>
              <td>Optional plain text</td>
            </tr>
            <tr>
              <td><code>videoSide</code></td>
              <td><code>'left'</code> or <code>'right'</code></td>
              <td>Left unless right is supplied</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Complete VideoData:</p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing reference tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>src</code></td>
              <td><code>string</code>, required</td>
              <td>Media URL, or YouTube ID/URL</td>
            </tr>
            <tr>
              <td><code>provider</code></td>
              <td><code>'html5'</code> or <code>'youtube'</code>, required</td>
              <td>Selects rendering</td>
            </tr>
            <tr>
              <td><code>poster</code></td>
              <td><code>string</code></td>
              <td>Optional native-video poster; ignored by YouTube renderer</td>
            </tr>
            <tr>
              <td><code>captions</code></td>
              <td><code>&#123; src: string; language: string; label: string &#125;[]</code></td>
              <td>Optional native caption tracks; ignored by YouTube renderer</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The data discriminator is <code>video</code>. Native video has controls, playsinline and
        <code>preload=&quot;metadata&quot;</code>. There are no autoplay, loop, muted, arbitrary
        iframe attributes or custom-control props.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'youtube',
      title: 'YouTube',
      headline: 'YouTube',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        The source accepts an 11-character ID, a youtu.be URL, or a URL on
        youtube.com/www.youtube.com/youtube-nocookie.com/www.youtube-nocookie.com. The parser takes
        the <code>v</code> query value or final path segment and requires an 11-character ID. Valid
        sources become <code>https://www.youtube-nocookie.com/embed/ID</code>; invalid sources show
        a plain error paragraph.
      </p>
      <p>
        The iframe is lazy-loaded, uses <code>strict-origin-when-cross-origin</code>, allows
        fullscreen and takes its title from headline or title. Provider playback and privacy/consent
        behavior belong to the provider and host application; the library does not supply a consent
        manager.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'layout-and-accessibility',
      title: 'Layout and accessibility',
      headline: 'Layout and accessibility',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        The player uses a 16:9 box and <code>--ps-radius</code>. Media/text stack below 600px
        container width and use a 1.7:1 split above it. Right changes visual order, not DOM order.
        Native controls and tracks are in SSR HTML. Provide captions for spoken content and a
        transcript where appropriate; browser/provider playback requirements still apply.
      </p>
      <p>
        Related: <a href={base + '/docs/sections/images/'}>ImageSection</a>,
        <a href={base + '/docs/advanced/ssr/'}>SSR and Progressive Enhancement</a>.
      </p>
    </div></Section
  >
</ContentPage>
