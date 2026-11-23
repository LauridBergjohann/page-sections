<script lang="ts">
  import { base } from '#lib/paths.js';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';
  import WebsitePage from '#lib/WebsitePage.svelte';
</script>

<WebsitePage
  page={{ title: 'Components', pageTitle: 'Components · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Components',
      introduction: 'Every public component, organized from atoms to page composition.',
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
  >
    <div class="prose">
      <p>
        The <a href={base + '/docs/design-system/atomic-design/'}>atomic design chapter</a>
        introduced atoms, molecules and organisms. Here is the complete component catalog. Import any
        component from <code>@page-sections/svelte</code>, or use the layer entry points. These are
        organizational groups, not restrictions: you can use a single button, compose a custom card
        or render a complete section.
      </p>
    </div>
  </Section><Section
    section={{ id: 'atoms', title: 'Atoms', headline: 'Atoms', background: { color: 'standard' } }}
  >
    <div class="prose">
      <ul>
        <li><a href={base + '/docs/components/buttons/'}>PrimaryButton</a></li>
        <li><a href={base + '/docs/components/buttons/'}>SecondaryButton</a></li>
        <li><a href={base + '/docs/components/buttons/'}>IconButton</a></li>
        <li><a href={base + '/docs/page-layout/headings-and-anchors/'}>Heading</a></li>
        <li><a href={base + '/docs/components/image/'}>Image</a></li>
        <li><a href={base + '/docs/reference/svelte-api/'}>InlineTextContent</a></li>
      </ul>
    </div>
  </Section><Section
    section={{
      id: 'molecules',
      title: 'Molecules',
      headline: 'Molecules',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <ul>
        <li><a href={base + '/docs/components/button-group/'}>ButtonGroup</a></li>
        <li><a href={base + '/docs/components/card/'}>Card</a></li>
        <li><a href={base + '/docs/components/popup/'}>Popup</a></li>
        <li><a href={base + '/docs/reference/svelte-api/'}>Actions</a></li>
        <li><a href={base + '/docs/page-layout/breadcrumbs/'}>Breadcrumbs</a></li>
        <li><a href={base + '/docs/reference/svelte-api/'}>CodeBlock</a></li>
        <li><a href={base + '/docs/reference/svelte-api/'}>RichTextContent</a></li>
        <li><a href={base + '/docs/reference/svelte-api/'}>ContentPanel</a></li>
        <li><a href={base + '/docs/page-layout/header/'}>MainMenu</a></li>
        <li><a href={base + '/docs/page-layout/header/'}>SidebarNavigation</a></li>
        <li><a href={base + '/docs/reference/svelte-api/'}>SectionNavigation</a></li>
      </ul>
    </div>
  </Section><Section
    section={{
      id: 'organisms',
      title: 'Organisms',
      headline: 'Organisms',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <ul>
        <li><a href={base + '/docs/page-layout/header/'}>Header</a></li>
        <li>
          <a href={base + '/docs/page-layout/header/'}>Navigation</a> — deprecated alias of Header; use
          Header for new code.
        </li>
        <li><a href={base + '/docs/page-layout/footer/'}>Footer</a></li>
        <li><a href={base + '/docs/components/section/'}>Section</a></li>
        <li><a href={base + '/sections/'}>HeadingSection</a></li>
        <li><a href={base + '/sections/'}>HeroSection</a></li>
        <li><a href={base + '/sections/'}>RichTextSection</a></li>
        <li><a href={base + '/sections/'}>PanelSection</a></li>
        <li><a href={base + '/sections/'}>ImageSection</a></li>
        <li><a href={base + '/sections/'}>VideoSection</a></li>
        <li><a href={base + '/sections/'}>CardGridSection</a></li>
        <li><a href={base + '/sections/'}>CarouselSection</a></li>
        <li><a href={base + '/sections/'}>CodeSection</a></li>
        <li><a href={base + '/sections/'}>Sections</a></li>
      </ul>
    </div>
  </Section><Section
    section={{
      id: 'layouts',
      title: 'Page composition',
      headline: 'Page composition',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <ul>
        <li><a href={base + '/docs/reference/svelte-api/'}>PageShell</a></li>
        <li><a href={base + '/docs/reference/svelte-api/'}>ContentPage</a></li>
        <li><a href={base + '/docs/components/grids/'}>ContentGrid</a></li>
        <li><a href={base + '/docs/components/grids/'}>ContentBlock</a></li>
        <li><a href={base + '/docs/reference/svelte-api/'}>SectionSurfaceGroup</a></li>
      </ul>
    </div>
  </Section><Section
    section={{
      id: 'data',
      title: 'Data and properties',
      headline: 'Data and properties',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Props that contain objects link to the <a href={base + '/docs/reference/types/'}>
          data type reference
        </a>. Start with the button, popup and card guides, or consult the
        <a href={base + '/docs/reference/svelte-api/'}>complete Svelte API index</a>.
        <a href={base + '/sections/'}>The section gallery</a> includes live controls for every ready-made
        section.
      </p>
    </div>
  </Section>
</WebsitePage>
