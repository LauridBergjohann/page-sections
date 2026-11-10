<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    { language: 'bash', code: `npm install @page-sections/svelte` },
    { language: 'ts', code: `import '@page-sections/svelte/styles.css';` },
    { language: 'bash', code: `npm install @page-sections/core` },
    {
      language: 'ts',
      code: `import type { PageData, CardItem } from '@page-sections/svelte';
import { resolveContentGrid } from '@page-sections/core';
const cards: CardItem[] = [];
const page: PageData = { title: 'Library', sections: [] };
console.log(page.title, cards, resolveContentGrid(840));`
    }
  ];
</script>

<script lang="ts">
  import { base } from '$app/paths';
  import { ContentPage, Section, CodeBlock } from '@page-sections/svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{ title: 'Installation', pageTitle: 'Installation · Page Sections' }}
  sectionNavigation
>
  <Section section={{ id: 'overview', title: 'Overview', spacing: 'tight' }}
    ><div class="prose">
      <p>
        Choose <code>@page-sections/svelte</code> for a Svelte website, or
        <code>@page-sections/core</code> for framework-independent data and calculations.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'svelte-and-sveltekit',
      title: 'Svelte and SvelteKit',
      headline: 'Svelte and SvelteKit',
      variant: 'content'
    }}
    ><div class="prose">
      <p>Run this in an existing application:</p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
      <p>
        The peer dependency is <code>svelte: ^5.56.4</code>. The matching Core version and
        markdown-it are installed as package dependencies; no SvelteKit or Tailwind peer is
        required. Both packages are ESM and declare Node <code>&gt;=22.12.0</code>. The repository
        uses Node 24/npm 11 for development.
      </p>
      <p>
        In plain Svelte, put the <a href={base + '/getting-started/first-page/'}>Quick Start</a>
        component in <code>App.svelte</code> and use your existing Svelte-aware bundler. In
        SvelteKit, use it in <code>src/routes/+page.svelte</code>; shared navigation can live in
        your application layout. No library-specific routing configuration is needed.
      </p>
      <p>
        The package exports Svelte source components for your build tool to compile. It is not a
        prebuilt browser script. Only <code>@page-sections/svelte</code> and
        <code>@page-sections/svelte/styles.css</code> are public entry points.
      </p>
    </div></Section
  >
  <Section section={{ id: 'styling', title: 'Styling', headline: 'Styling', variant: 'content' }}
    ><div class="prose">
      <p>
        PageShell, ContentPage, Navigation, Section and Breadcrumbs import the shared stylesheet.
        ContentGrid imports the generated grid rules only. Low-level Card, Image, ButtonGroup,
        MainMenu, SectionNavigation, ContentBlock, SectionSurfaceGroup, ContentPanel, Actions,
        RichTextContent and InlineTextContent do not independently load the full theme defaults.
      </p>
      <p>
        Import the full stylesheet once in your application entry/layout when using low-level
        components independently:
      </p>
      <CodeBlock {...examples[1]} highlighted={data.highlights[1]} />
      <p>
        The stylesheet declares theme defaults on <code>:root</code> and component-scoped utility
        classes. Override variables on a local ancestor or through PageShell; see
        <a href={base + '/docs/themes/'}>Themes and Styling</a>.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'core-utilities',
      title: 'Core utilities',
      headline: 'Core utilities',
      variant: 'content'
    }}
    ><div class="prose">
      <CodeBlock {...examples[2]} highlighted={data.highlights[2]} />
      <p>
        Core has no runtime dependencies. Declare it directly if application code imports its
        runtime exports. Svelte consumers can import the shared types from either package:
      </p>
      <CodeBlock {...examples[3]} highlighted={data.highlights[3]} />
    </div></Section
  >
  <Section
    section={{
      id: 'example-conventions',
      title: 'Example conventions',
      headline: 'Example conventions',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Svelte examples include their imports and data. Media URLs such as <code
          >/images/garden.jpg</code
        >
        and <code>/media/tour.mp4</code> are application assets: supply those files in Vite's
        <code>public/</code>
        or SvelteKit's <code>static/</code>, or replace the URLs. Example links refer to application
        routes that you provide. These examples demonstrate component usage, not a bundled CMS or
        router.
      </p>
      <p>
        SSR and prerendering belong to the application. A client-only Vite app still requires
        JavaScript to show content. The <a
          href="https://github.com/LauridBergjohann/page-sections/tree/main/apps/demo">demo</a
        >
        demonstrates SvelteKit prerendering with adapter-static; see
        <a href={base + '/docs/ssr/'}>SSR and Progressive Enhancement</a>.
      </p>
    </div></Section
  >
</ContentPage>
