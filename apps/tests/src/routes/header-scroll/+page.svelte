<script lang="ts">
  import {
    PageShell,
    Header,
    ContentPage,
    HeadingSection,
    Section,
    SidebarNavigation,
    ButtonGroup
  } from '@page-sections/svelte';
  let scrollBehavior = $state<'static' | 'delayed' | 'fixed'>('fixed');
  let appearance = $state('light');
  const chapters = Array.from({ length: 24 }, (_, i) => ({
    id: `chapter-${i + 1}`,
    label: `Chapter ${i + 1}`,
    href: `#chapter-${i + 1}`
  }));
</script>

<PageShell theme={{ radius: '12px' }}>
  <Header {scrollBehavior} items={[{ id: 'first', label: 'First chapter', href: '#chapter-1' }]}>
    {#snippet brand()}<a href="/header-scroll/">Header example</a>{/snippet}
    {#snippet left()}<a href="#chapter-1">Left satellite</a>{/snippet}
    {#snippet right()}
      <div class="appearance-controls">
        <ButtonGroup
          label="Appearance"
          iconOnly
          items={[
            { id: 'light', label: 'Light', selected: appearance === 'light' },
            { id: 'dark', label: 'Dark', selected: appearance === 'dark' }
          ]}
          onselect={(item) => (appearance = item.id)}
        >
          {#snippet icon(item)}<span>{item.id === 'light' ? '☀' : '☾'}</span>{/snippet}
        </ButtonGroup>
      </div>
    {/snippet}
  </Header>
  <ContentPage
    page={{ title: 'Header scrolling', breadcrumbs: [{ label: 'Header scrolling' }] }}
    showContentMenu
  >
    {#snippet leftSidebar()}<SidebarNavigation items={chapters} />{/snippet}
    <HeadingSection
      section={{
        id: 'page-heading',
        title: 'Header scrolling',
        headingLevel: 1,
        background: { color: 'standard' }
      }}
    />
    {#each chapters as chapter}
      <Section
        section={{
          id: chapter.id,
          title: chapter.label,
          headline: chapter.label,
          background: { color: 'standard' }
        }}
      >
        <p>
          Long page content keeps the header and both sidebars in view while testing their
          independent docking positions.
        </p>
      </Section>
    {/each}
  </ContentPage>
  <label class="test-controls">
    Header scroll behavior
    <select bind:value={scrollBehavior}>
      <option value="fixed">Fixed</option><option value="delayed">Delayed</option><option
        value="static"
      >
        Static
      </option>
    </select>
  </label>
</PageShell>

<style>
  .test-controls {
    position: fixed;
    bottom: 12px;
    left: 12px;
    z-index: 30;
    padding: 8px;
    background: var(--ps-section-muted);
    color: var(--ps-ink);
  }
</style>
