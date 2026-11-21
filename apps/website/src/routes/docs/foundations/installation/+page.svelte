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
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';

  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';

  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{ title: 'Installation', pageTitle: 'Installation · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Installation',
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
        Choose <code>@page-sections/svelte</code> for a Svelte website, or
        <code>@page-sections/core</code> for framework-independent data and calculations.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'svelte-and-sveltekit',
      title: 'Svelte and SvelteKit',
      headline: 'Svelte and SvelteKit',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Start with an existing Svelte 5 or SvelteKit application. Run the installation command in
        its project directory:
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
      <p>
        The peer dependency is <code>svelte: ^5.56.4</code>. The matching Core version and
        markdown-it are installed as package dependencies; no SvelteKit or Tailwind peer is
        required. Both packages are ESM and declare Node <code>&gt;=22.12.0</code>. The repository
        uses Node 24/npm 11 for development.
      </p>
      <p>
        In plain Svelte, put the <a href={base + '/docs/foundations/first-page/'}>Quick Start</a>
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
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'styling',
      title: 'Styling',
      headline: 'Styling',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Import the shared stylesheet once in your application entry or layout. It provides the theme
        defaults and layout rules used throughout the examples.
      </p>
      <p>
        Import the full stylesheet once in your application entry/layout when using low-level
        components independently:
      </p>
      <CodeBlock {...examples[1]} highlighted={data.highlights[1]} />
      <p>
        The stylesheet declares theme defaults on <code>:root</code> and component-scoped utility
        classes. Override variables on a local ancestor or through the shared theme wrapper
        introduced in
        <a href={base + '/docs/foundations/themes/'}>Themes and Styling</a>.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'core-utilities',
      title: 'Core utilities',
      headline: 'Core utilities',
      variant: 'content'
    }}
    ><div class="prose">
      <CodeBlock {...examples[2]} highlighted={data.highlights[2]} />
      <p>
        Core is the framework-independent package for data shapes and layout calculations. It has no
        runtime dependencies. Declare it directly if application code imports its runtime exports.
        The optional example below uses CardItem (one card?s data), PageData (page metadata and its
        sections) and resolveContentGrid (a helper calculating columns from a container width).
        These are covered later in the type reference; you can skip this example for your first
        Svelte page:
      </p>
      <CodeBlock {...examples[3]} highlighted={data.highlights[3]} />
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
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
        <a href={base + '/docs/advanced/ssr/'}>SSR and Progressive Enhancement</a>.
      </p>
    </div></Section
  >
  <Section
    section={{
      id: 'next-step',
      title: 'Next step',
      headline: 'Next: understand sections',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        The package is installed. Continue with <a
          href={base + '/docs/foundations/pages-and-sections/'}>What are sections?</a
        > before building your first page.
      </p>
    </div></Section
  >
</ContentPage>
