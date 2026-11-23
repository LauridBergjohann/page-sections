<script module lang="ts">
  export const examples = [
    {
      language: 'svelte',
      code: "<script>\n  import '@page-sections/svelte/styles.css';\n  import { IconButton } from '@page-sections/svelte/atoms';\n  import { Popup } from '@page-sections/svelte/molecules';\n  import { Header } from '@page-sections/svelte/organisms';\n  import { ContentPage } from '@page-sections/svelte/layouts';\n<\/script>"
    }
  ];
</script>

<script lang="ts">
  import { base } from '$app/paths';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';
  import WebsitePage from '$lib/WebsitePage.svelte';
</script>

<WebsitePage
  page={{ title: 'Atomic design', pageTitle: 'Atomic design · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Atomic design',
      introduction: 'Build consistent interfaces by composing small, reusable pieces.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'levels',
      title: 'From atoms to complete pages',
      headline: 'From atoms to complete pages',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Atomic design describes composition, not visual size. An <strong>atom</strong> does one
        small job, such as showing an image or offering a button. A <strong>molecule</strong>
        combines these jobs into a reusable interaction, such as a group of choices or a popup. An
        <strong>organism</strong> brings these pieces together into a complete region, such as a header,
        footer or content section.
      </p>
      <ol>
        <li>
          <strong>Atoms:</strong> PrimaryButton, SecondaryButton, IconButton, Heading, Image and InlineTextContent.
        </li>
        <li>
          <strong>Molecules:</strong> ButtonGroup, Card, Popup, actions, text blocks and navigation lists.
        </li>
        <li>
          <strong>Organisms:</strong> Header, Footer and Sections, including ready-made hero, text, media
          and collection sections.
        </li>
        <li>
          <strong>Page composition:</strong> PageShell, ContentPage and the grid components arrange those
          pieces into a page. These correspond to templates in atomic design; the actual page content
          belongs to your application.
        </li>
      </ol>
    </div></Section
  ><Section
    section={{
      id: 'composition',
      title: 'One interaction, shared building blocks',
      headline: 'One interaction, shared building blocks',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <figure class="composition">
        <div>IconButton<br /><small>Trigger / atom</small></div>
        <span aria-hidden="true">→</span>
        <div>Popup + ButtonGroup<br /><small>Settings / molecules</small></div>
        <span aria-hidden="true">→</span>
        <div>Header<br /><small>Site navigation / organism</small></div>
        <figcaption>
          The header composes smaller components. Changing the shared popup heading updates Settings
          and On this page together.
        </figcaption>
      </figure>
      <p>
        A popup owns its surface, title and dismissal. Its parent owns the meaning of the action:
        navigation, search or settings. A card combines an image, text and a destination. The
        ready-made card grid arranges cards inside a section. You can use any level directly.
      </p>
    </div></Section
  ><Section
    section={{
      id: 'shared-rules',
      title: 'Shared rules at every level',
      headline: 'Shared rules at every level',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        All levels read the same theme variables. Controls and cards use <code>--ps-border</code>;
        panels and popups use <code>--ps-panel-border</code>. Selection uses
        <code>--ps-selection</code>, with the accent color for active text. Popup titles have one
        shared size and weight.
        <a href={base + '/docs/reference/tokens/#shadows'}>Shadow variables</a> control the same surfaces
        without component-specific overrides.
      </p>
      <p>
        Continue with <a href={base + '/docs/design-system/responsive-layout/'}>responsive layout</a
        >
        and <a href={base + '/docs/design-system/backgrounds/'}>backgrounds</a>. Then the
        <a href={base + '/docs/components/'}>component catalog</a> shows the concrete APIs and live examples.
      </p>
    </div></Section
  ><Section
    section={{
      id: 'imports',
      title: 'Choose the level you need',
      headline: 'Choose the level you need',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Import from the package root, or from the optional atoms, molecules, organisms and layouts
        entry points. Both paths refer to the same components; existing root imports keep working.
        Import the shared stylesheet once in your root layout.
      </p>
      <CodeBlock language="svelte" code={examples[0].code} />
    </div></Section
  >
</WebsitePage>

<style>
  .composition {
    margin: 0;
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }
  .composition div {
    padding: 1rem;
    border: 1px solid var(--ps-border);
    border-radius: var(--ps-radius);
  }
  .composition figcaption {
    flex-basis: 100%;
    color: var(--ps-body);
  }
  .composition small {
    color: var(--ps-body);
  }
</style>
