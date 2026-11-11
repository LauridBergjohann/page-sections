<script module lang="ts">
  export const examples: { language: string; code: string; filename?: string; group?: string }[] = [
    {
      language: 'svelte',
      code: `<script>
  import { Section, SectionSurfaceGroup } from '@page-sections/svelte';
<\/script>

<SectionSurfaceGroup>
  <Section
    section={{
      id: 'first',
      title: 'First',
      headline: 'A shared surface',
      background: { color: 'standard' }
    }}
  >
    <p>These adjacent sections share their outer corner treatment.</p>
  </Section>
  <Section section={{ id: 'second', title: 'Second', background: { color: 'muted' } }}>
    <p>A different opaque color still belongs to the same surface group.</p>
  </Section>
</SectionSurfaceGroup>`
    },
    {
      language: 'ts',
      code: `import { normalizeSectionBackground } from '@page-sections/core';
const full = normalizeSectionBackground({ color: 'standardToMuted', size: 'full' });
const contained = normalizeSectionBackground({ color: 'standardToMuted' });
console.log(full.gradient); // true
console.log(contained.color, contained.diagnostic?.code); // muted, gradient-requires-full-background`
    }
  ];
</script>

<script lang="ts">
  import SurfacePlayground from '$lib/SurfacePlayground.svelte';
  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';
  import { Section, CodeBlock } from '@page-sections/svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<ContentPage
  page={{ title: 'Backgrounds and groups', pageTitle: 'Backgrounds and groups · Page Sections' }}
  showContentMenu
>
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'playground',
      title: 'Try it',
      headline: 'Try it yourself',
      variant: 'content'
    }}><SurfacePlayground /></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'overview',
      title: 'Overview',
      spacing: 'tight'
    }}
    ><div class="prose">
      <p>
        Backgrounds separate a section's content layout from its visual surface. Use a standard
        background for a contained panel and a full background for a page-wide transition.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'sectionbackground',
      title: 'SectionBackground',
      headline: 'SectionBackground',
      variant: 'content'
    }}
    ><div class="prose">
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
              <td><code>color</code></td>
              <td><code>SectionBackgroundColor</code>, required when the object is supplied</td>
              <td>Omitting the entire object means transparent</td>
            </tr>
            <tr>
              <td><code>size</code></td>
              <td><code>'standard'</code> or <code>'full'</code></td>
              <td>standard</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Colors: <code>transparent</code>, <code>standard</code>, <code>muted</code>,
        <code>transparentToStandard</code>, <code>transparentToMuted</code>,
        <code>standardToTransparent</code>, <code>standardToMuted</code>,
        <code>mutedToTransparent</code>, <code>mutedToStandard</code>.
      </p>
      <p>
        Gradients run top to bottom and require full size. With standard size, normalization uses
        the gradient's end color and returns a diagnostic. Section uses that normalized color but
        does not log the diagnostic itself. Full surfaces expand to <code>100vw</code> without changing
        the content width and have square corners. This assumes centered content; an off-center embedded
        section should use standard size.
      </p>
      <CodeBlock {...examples[1]} highlighted={data.highlights[1]} />
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'sectionsurfacegroup',
      title: 'SectionSurfaceGroup',
      headline: 'SectionSurfaceGroup',
      variant: 'content'
    }}
    ><div class="prose">
      <p>
        Props are optional <code>children: Snippet</code> and <code>pageKind: PageKind</code>
        (content/detail, inherited by default). A detail context forces standard backgrounds, so gradients
        fall back to their end color. ContentPage already supplies a group; use an explicit group for
        standalone or nested compositions. The wrapper uses
        <code>display: contents</code>, so it adds no box or landmark.
      </p>
      <p>
        Adjacent standard-size, nontransparent surfaces share corners even if their colors differ.
        Transparent or full-size surfaces separate groups. Outer corners appear from viewport XL
        (1600px), using <code>--ps-radius</code>; detail groups return to square corners at 3XL
        (2300px); ungrouped Section surfaces default to square corners. Group membership concerns
        registered sections, not arbitrary divs inserted between them.
      </p>
      <p>
        Rules are emitted after registration during SSR, and nested groups have isolated scopes.
        Client updates and keyed DOM moves are reconciled by the registry/MutationObserver. The core <code
          >SectionSurfaceRegistry</code
        >
        exposes equivalent ordering and corner data for another renderer; see
        <a href={base + '/docs/reference/core-api/'}>Core API</a>.
      </p>
      <p>
        Related: <a href={base + '/docs/foundations/content-grid/'}>Section and ContentGrid</a>,
        <a href={base + '/docs/foundations/themes/'}>Themes and Styling</a>.
      </p>
    </div></Section
  >
  <Section
    section={{
      background: { color: 'standard', size: 'standard' },
      id: 'surface-shadows',
      title: 'Contained surface shadows',
      headline: 'Contained surface shadows'
    }}
    ><div class="prose">
      <p>
        Standard-width sections with standard or muted backgrounds receive a subtle shadow, whether
        or not the page has sidebars. Joined surfaces clip internal shadow edges. Transparent and
        full-width backgrounds do not receive this shadow. Full backgrounds still paint across the
        viewport when a sidebar makes the content column asymmetric.
      </p>
    </div></Section
  >
</ContentPage>
