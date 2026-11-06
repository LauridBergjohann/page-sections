<script lang="ts">
  import { setContext, onMount, type Snippet } from 'svelte';
  import { SECTION_REGISTRY, SectionRegistry, themeStyle, type ContentPageData, type PageTheme } from '@page-sections/core';
  import SectionSurfaceGroup from './SectionSurfaceGroup.svelte';
  import Breadcrumbs from './Breadcrumbs.svelte';
  import SectionNavigation from './SectionNavigation.svelte';
  import './styles.css';
  let { page, children, sectionNavigation = false, navigationLabel, theme, class: className = '' }: {
    page: ContentPageData; children?: Snippet; sectionNavigation?: boolean | 'horizontal' | 'sidebar'; navigationLabel?: string; theme?: PageTheme; class?: string;
  } = $props();
  let revision = $state(0);
  let host: HTMLElement;
  const titleId = $props.id();
  const registry = new SectionRegistry(() => { revision += 1; });
  setContext(SECTION_REGISTRY, registry);
  function sections() { void revision; return registry.sections; }
  onMount(() => {
    const reorder = () => registry.order([...host.querySelectorAll<HTMLElement>('[data-ps-section]')].map(el => el.id));
    const observer = new MutationObserver(reorder);
    observer.observe(host, { childList: true, subtree: true }); reorder();
    return () => observer.disconnect();
  });
</script>
<svelte:head><title>{page.pageTitle ?? page.title}</title></svelte:head>
<main bind:this={host} class={['ps-page', className]} style={themeStyle(theme)} aria-labelledby={titleId}>
  <div class="ps-content-width ps-content-container">
    <header class="ps-grid-scope">
      {#if page.breadcrumbs?.length}<Breadcrumbs items={page.breadcrumbs} />{/if}
      {#if page.eyebrow}<p class="eyebrow">{page.eyebrow}</p>{/if}
      <h1 id={titleId}>{page.title}</h1>
      {#if page.intro}<p class="intro">{page.intro}</p>{/if}
    </header>
    <div class:with-sidebar={sectionNavigation === 'sidebar'}>
      <div class="sections"><SectionSurfaceGroup>{@render children?.()}</SectionSurfaceGroup></div>
      <!-- Render after registration on the server; CSS places navigation before the sections. -->
      {#if sectionNavigation}<div class="section-navigation"><SectionNavigation items={sections()} label={navigationLabel} variant={sectionNavigation === 'sidebar' ? 'sidebar' : 'horizontal'} /></div>{/if}
    </div>
  </div>
</main>
<style>
  main { overflow-x: clip; padding-bottom: 4rem; min-height: 60vh; }
  header { padding: calc(var(--ps-grid-gap) * 2) var(--ps-grid-gap); }
  h1 { font-size: clamp(2rem, 5vw, 4.5rem); line-height: 1.08; letter-spacing: -.04em; margin: .5rem 0; }
  .eyebrow { color: var(--ps-accent); text-transform: uppercase; letter-spacing: .12em; }
  .intro { max-width: 64ch; color: var(--ps-body); line-height: 1.6; }
  header + div { display: grid; } .sections { min-width: 0; grid-row: 2; } .section-navigation { grid-row: 1; }
  @media (min-width: 1000px) { .with-sidebar { grid-template-columns: 14rem minmax(0, 1fr); } .with-sidebar .sections { grid-column: 2; grid-row: 1; container: ps-content / inline-size; } .with-sidebar .section-navigation { grid-column: 1; grid-row: 1; } }
</style>
