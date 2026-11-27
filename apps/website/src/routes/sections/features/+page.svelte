<script module lang="ts">
  export const examples = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { FeatureSection, type FeatureItem } from '@page-sections/svelte';
  const list: FeatureItem[] = [
    { id: 'layout', icon: 'laptop', title: 'One responsive system', description: 'Shared widths and spacing, at every size.', href: '/docs/' },
    { id: 'compose', icon: 'layers', title: 'Composable sections', description: 'Build a page from familiar blocks.' }
  ];
<\/script>

<FeatureSection
  section={{ id: 'benefits', title: 'Benefits', headline: 'A consistent foundation.', background: { color: 'standard' } }}
  {list} featureSize="l" iconTone="muted"
/>`
    },
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { FeatureSection } from '@page-sections/svelte';
  const list = [{ id: 'brand', icon: 'brand', title: 'Your identity', description: 'Supply your own decorative SVG.' }];
<\/script>

<FeatureSection section={{ id: 'custom-icons', title: 'Custom icons' }} {list} iconTone="primary">
  {#snippet icon(item)}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="m12 3 9 9-9 9-9-9z" />
    </svg>
  {/snippet}
</FeatureSection>`
    }
  ];
</script>

<script lang="ts">
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';
  import WebsitePage from '#lib/WebsitePage.svelte';
  import FeaturePlayground from '#lib/FeaturePlayground.svelte';
  import { base } from '#lib/paths.js';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<WebsitePage page={{ title: 'Features', pageTitle: 'Features · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Features',
      headline: 'Features',
      headingLevel: 1,
      introduction: 'Centered icons and concise benefits, using the shared card grid.'
    }}
  />
  <Section section={{ id: 'playground', title: 'Try it yourself', headline: 'Try it yourself' }}>
    <FeaturePlayground />
  </Section>
  <Section section={{ id: 'usage', title: 'Usage', headline: 'Usage', variant: 'content' }}>
    <div class="prose">
      <p>
        FeatureSection is available from the root package and the organisms entry point. Features
        are a semantic list. Text and icons are always centered; every incomplete row is centered as
        a group, including the final row after wrapping.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div>
  </Section>
  <Section
    section={{
      id: 'props',
      title: 'Props and data',
      headline: 'Props and data',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        Required <code>section</code> uses
        <a href={base + '/docs/reference/types/#section-definition'}>SectionDefinition</a>. Required
        <code>list</code>
        contains <a href={base + '/docs/reference/types/#feature-item'}>FeatureItem</a> records: id, icon,
        title and description, plus optional href and itemKey. Use itemKey when the same record occurs
        more than once.
      </p>
      <ul>
        <li>
          <code>featureSize</code>:
          <a href={base + '/docs/reference/types/#card-size'}>CardSize</a>, s/m/l; defaults to m.
        </li>
        <li>
          <code>iconTone</code>:
          <a href={base + '/docs/reference/types/#feature-icon-tone'}>FeatureIconTone</a>,
          standard/muted/primary; defaults to muted.
        </li>
        <li>
          <code>icon(item)</code>: optional Svelte snippet for a custom decorative icon. The generic
          item type preserves your application fields.
        </li>
      </ul>
      <p>
        For JSON content, use <a href={base + '/docs/reference/types/#feature-section-data'}>
          FeatureSectionData
        </a>
        with <code>type: 'features'</code> and pass it to Sections. All layout and palette options work
        without JavaScript. Use a custom renderer in Sections when JSON icon keys need an application-specific
        snippet.
      </p>
      <p>
        Built-in icon keys include laptop, layers, database, file-code, palette, puzzle, code,
        rocket, heart, sprout, award, book-open, briefcase, graduation-cap, bike and
        git-pull-request. Unknown keys fall back to layers. Custom snippets receive the entire item
        and should use currentColor; the surrounding circle hides decorative SVGs from assistive
        technology.
      </p>
      <CodeBlock {...examples[1]} highlighted={data.highlights[1]} />
    </div>
  </Section>
  <Section
    section={{
      id: 'layout',
      title: 'Layout and colors',
      headline: 'Layout and colors',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        Feature widths use exactly the CardGrid spans. These are content-container breakpoints, not
        viewport breakpoints. The icon circles are 72/104/144px for S/M/L, shrinking only when their
        slot is narrower. Text grows naturally without truncation.
      </p>
      <table>
        <thead>
          <tr>
            <th>Feature size</th><th>XS · 4 columns</th><th>S · 6 columns</th><th>
              M · 8 columns
            </th><th>L · 12 columns</th>
          </tr>
        </thead><tbody>
          <tr><td>S</td><td>2</td><td>2</td><td>2</td><td>2</td></tr><tr>
            <td>M</td><td>2</td><td>2</td><td>2</td><td>3</td>
          </tr><tr><td>L</td><td>4</td><td>3</td><td>4</td><td>4</td></tr>
        </tbody>
      </table>
      <p>
        The circle color is independent of the section background. Standard and muted reuse their
        section-surface tokens with accent-colored icons. Primary uses the exact primary-button
        background and foreground tokens. No new palette colors are introduced. Standard works on
        transparent or muted sections; muted works on transparent or standard sections.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'links',
      title: 'Links and accessibility',
      headline: 'Links and accessibility',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        A valid href turns the complete feature into one native link, including the icon, title and
        description. Its circle uses the card border, changing to the accent border on hover or
        keyboard focus. The keyboard focus outline covers the whole feature. Unlinked features have
        no visible circle border and do not add a tab stop. Unsafe URLs do not create links. Heading
        levels follow the enclosing section; descriptions remain readable with larger text and
        without JavaScript. Reduced-motion preferences disable the border transition.
      </p>
    </div>
  </Section>
</WebsitePage>
