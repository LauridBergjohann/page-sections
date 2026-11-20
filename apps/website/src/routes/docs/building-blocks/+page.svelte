<script lang="ts">
  import { base } from '$app/paths';
  import { HeadingSection, Section } from '@page-sections/svelte';
  import WebsitePage from '$lib/WebsitePage.svelte';
</script>

<WebsitePage
  page={{ title: 'Components', pageTitle: 'Components · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Components',
      introduction: 'Understand the small reusable pieces behind the ready-made sections.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'choose-a-component',
      title: 'Choose the level you need',
      headline: 'Choose the level you need',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        You have composed sections inside a semantic page. Components let you control the contents
        more precisely: Section provides the region, Card presents one item, Image renders one
        image, and ContentGrid arranges content in columns.
      </p>
      <p>
        A base component usually belongs inside a section. A ready-made section already combines a
        region with its content layout. For example, Image is a media component; ImageSection adds a
        section heading and optional accompanying text.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'chapters',
      title: 'Build up from the base Section',
      headline: 'Build up from the base Section',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <ul>
        <li>
          <a href={base + '/docs/building-blocks/section/'}>Section</a> — The shared container, heading,
          spacing and background.
        </li>
        <li>
          <a href={base + '/docs/building-blocks/card/'}>Card</a> — A single linked item with catalog
          or editorial presentation.
        </li>
        <li>
          <a href={base + '/docs/building-blocks/image/'}>Image</a> — Alternative text, responsive sources
          and light/dark variants.
        </li>
        <li>
          <a href={base + '/docs/building-blocks/grids/'}>ContentGrid and ContentBlock</a> — Arrange arbitrary
          content using responsive column spans.
        </li>
      </ul>
    </div></Section
  >
  <Section
    section={{
      id: 'more-components',
      title: 'Text, actions and complete sections',
      headline: 'Text, actions and complete sections',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        RichTextContent renders structured paragraphs and lists; InlineTextContent renders inline
        formatting; Actions renders a list of link actions. Their inputs are described by <a
          href={base + '/docs/reference/types/#rich-text-content-data'}>RichTextContentData</a
        >, <a href={base + '/docs/reference/types/#inline-text'}>InlineText</a> and
        <a href={base + '/docs/reference/types/#content-action'}>ContentAction</a>. The
        <a href={base + '/docs/reference/svelte-api/'}>Svelte API index</a> lists all available components
        and their guides.
      </p>
      <p>
        Browse the <a href={base + '/sections/'}>section gallery</a> for complete hero, text, image, video
        and collection layouts.
      </p>
    </div></Section
  >
</WebsitePage>
