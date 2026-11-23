<script lang="ts">
  import { base } from '#lib/paths.js';
  import { HeadingSection, Section } from '@page-sections/svelte';
  import WebsitePage from '#lib/WebsitePage.svelte';
</script>

<WebsitePage page={{ title: 'Reference', pageTitle: 'Reference · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Reference',
      introduction:
        'Find exact object fields, component exports, runtime utilities and visual tokens.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'how-to-read',
      title: 'Read a property type',
      headline: 'Read a property type',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        A type describes the values a property accepts. string, number and boolean are simple
        values. A name such as <a href={base + '/docs/reference/types/#content-action'}>
          ContentAction
        </a> describes an object with its own fields; click that name to inspect them. A suffix [] means
        an array, and a question mark marks an optional field. A union separated by | offers alternatives.
      </p>
      <p>
        Omit&lt;<a href={base + '/docs/reference/types/#hero-section-data'}>HeroSectionData</a>,
        'type'&gt; means the Hero data fields without the type discriminator. Direct component usage
        already selects the renderer, so it does not need that discriminator; a data-driven section
        array does.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'references',
      title: 'Choose a reference',
      headline: 'Choose a reference',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <ul>
        <li>
          <a href={base + '/docs/reference/types/'}>Data types</a> — Objects, fields, required and optional
          values, union variants and nested types.
        </li>
        <li>
          <a href={base + '/docs/reference/svelte-api/'}>Svelte API</a> — Public components and links
          to their usage guides.
        </li>
        <li>
          <a href={base + '/docs/reference/core-api/'}>Core API</a> — Framework-independent functions,
          registries and exported types.
        </li>
        <li>
          <a href={base + '/docs/reference/tokens/'}>CSS variables and tokens</a> — Theme properties,
          breakpoints, dimensions and component variables.
        </li>
      </ul>
    </div>
  </Section>
  <Section
    section={{
      id: 'common-lookups',
      title: 'Common object properties',
      headline: 'Common object properties',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        <a href={base + '/docs/reference/types/#content-action'}>ContentAction</a> describes a link
        action. <a href={base + '/docs/reference/types/#image-data'}>ImageData</a> describes an
        image. <a href={base + '/docs/reference/types/#section-background'}>SectionBackground</a>
        describes a surface. <a href={base + '/docs/reference/types/#menu-item'}>MenuItem</a> describes
        one navigation entry and its children.
      </p>
    </div>
  </Section>
</WebsitePage>
