<script lang="ts">
  import { base } from '#lib/paths.js';
  import { HeadingSection, Section } from '@page-sections/svelte';
  import WebsitePage from '#lib/WebsitePage.svelte';
</script>

<WebsitePage page={{ title: 'Advanced', pageTitle: 'Advanced · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Advanced',
      introduction:
        'Extend the components you know, connect content data and deliver useful HTML before JavaScript runs.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'before-you-start',
      title: 'Build on the base components',
      headline: 'Build on the base components',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        These guides assume you have used <a href={base + '/docs/components/section/'}>Section</a> inside
        ContentPage and understand its shared fields. Start with a small custom Svelte component; introduce
        a data model when your content needs to come from files or a CMS.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'choose-a-guide',
      title: 'Choose your next step',
      headline: 'Choose your next step',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <ol>
        <li>
          <a href={base + '/docs/advanced/create-your-own-section/'}>Create your own section</a> — Wrap
          Section around a reusable content pattern and keep its headings, surfaces and anchors.
        </li>
        <li>
          <a href={base + '/docs/advanced/data-and-custom-sections/'}>Data and custom renderers</a> —
          Store plain content data, render it with the plural Sections component and register your own
          type.
        </li>
        <li>
          <a href={base + '/docs/advanced/ssr/'}>SSR and enhancement</a> — Render on the server, then
          enhance navigation and interactions in the browser.
        </li>
      </ol>
    </div>
  </Section>
  <Section
    section={{
      id: 'boundaries',
      title: 'Keep content and rendering separate',
      headline: 'Keep content and rendering separate',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Content data contains text, URLs and layout choices. Component constructors, snippets and
        callbacks belong to your application’s rendering layer. Your custom component can continue
        using the same headings, anchors and themes as built-in sections.
      </p>
      <p>
        External data still needs application-level validation before rendering; TypeScript types
        describe the expected shape but do not validate a network response.
      </p>
    </div>
  </Section>
</WebsitePage>
