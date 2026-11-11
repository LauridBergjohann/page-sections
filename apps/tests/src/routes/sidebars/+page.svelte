<script lang="ts">
  import { ContentPage, HeadingSection, Section, SidebarNavigation } from '@page-sections/svelte';
  let left = $state(true);
  let right = $state(true);
  let full = $state(false);
  let transparent = $state(false);
  let transparentHeader = $state(false);
  const items = Array.from({ length: 35 }, (_, i) => ({
    id: `page-${i}`,
    label: `Page ${i + 1}`,
    href: `/sidebars/#section-${i % 3}`,
    current: i === 2
  }));
</script>

<fieldset>
  <legend>Sidebar layout</legend>
  <label><input type="checkbox" bind:checked={left} /> Left sidebar</label>
  <label><input type="checkbox" bind:checked={right} /> Content menu</label>
  <label><input type="checkbox" bind:checked={full} /> Full background</label>
  <label><input type="checkbox" bind:checked={transparent} /> Transparent section</label>
  <label><input type="checkbox" bind:checked={transparentHeader} /> Transparent heading</label>
</fieldset>
{#snippet navigation()}<SidebarNavigation {items} />{/snippet}
<ContentPage
  id="sidebar-fixture"
  page={{
    title: 'Sidebar layout',
    breadcrumbs: [{ label: 'Examples', href: '/examples/' }, { label: 'Sidebar layout' }]
  }}
  leftSidebar={left ? navigation : undefined}
  showContentMenu={right}
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Sidebar layout',
      headingLevel: 1,
      background: { color: transparentHeader ? 'transparent' : 'standard', size: 'standard' }
    }}
  />
  {#each [0, 1, 2] as index}
    <Section
      section={{
        id: `section-${index}`,
        title: `Chapter ${index + 1}`,
        headline: `Chapter ${index + 1}`,
        background: {
          color: index === 1 ? (transparent ? 'transparent' : 'muted') : 'standard',
          size: full ? 'full' : 'standard'
        }
      }}
    >
      <div class="long-section">
        <p>Content remains readable while the two sidebars stay within the viewport.</p>
      </div>
    </Section>
  {/each}
</ContentPage>

<style>
  fieldset {
    margin: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .long-section {
    min-height: 650px;
  }
</style>
