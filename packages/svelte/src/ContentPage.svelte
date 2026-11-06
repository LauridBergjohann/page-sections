<script lang="ts">
  import { setContext, onMount, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { SECTION_CONTEXT, type ReadSectionContext } from './sectionContext.js';
  import { SECTION_REGISTRY, SectionRegistry, themeStyle, type ContentPageData, type PageTheme } from '@page-sections/core';
  import SectionSurfaceGroup from './SectionSurfaceGroup.svelte';
  import Breadcrumbs from './Breadcrumbs.svelte';
  import SectionNavigation from './SectionNavigation.svelte';
  import HeroSection from './HeroSection.svelte';
  import './styles.css';
  let { page, children, header, showHeader = true, manageDocumentTitle = true, sectionNavigation = false, navigationLabel, theme, class: className = '', ...rest }: Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'style'> & {
    page: ContentPageData; children?: Snippet; sectionNavigation?: boolean | 'horizontal' | 'sidebar'; navigationLabel?: string; theme?: PageTheme; class?: string;
    header?: Snippet<[ContentPageData, string]>; showHeader?: boolean; manageDocumentTitle?: boolean;
  } = $props();
  let revision = $state(0);
  let host: HTMLElement;
  const titleId = $props.id();
  const labelId = $derived(!header && page.hero ? `${page.hero.id}-title` : titleId);
  setContext<ReadSectionContext>(SECTION_CONTEXT, () => ({ pageKind: 'content', headingLevel: 2, nested: false }));
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
<svelte:head>{#if manageDocumentTitle}<title>{page.pageTitle ?? page.title}</title>{/if}</svelte:head>
<main {...rest} bind:this={host} class={['ps-page', className]} style={themeStyle(theme)}
  aria-labelledby={rest['aria-labelledby'] ?? (showHeader && !rest['aria-label'] ? labelId : undefined)}
  aria-label={rest['aria-label'] ?? (!showHeader && !rest['aria-labelledby'] ? page.title : undefined)}>
  <div class="ps-content-width ps-content-container">
    {#if showHeader}
    {#if header}{@render header(page, titleId)}{:else if page.hero}<HeroSection section={{ ...page.hero, headingLevel: 1 }} />{:else}
    <header class="ps-grid-scope">
      {#if page.breadcrumbs?.length}<Breadcrumbs items={page.breadcrumbs} />{/if}
      {#if page.eyebrow}<p class="eyebrow">{page.eyebrow}</p>{/if}
      <h1 id={titleId}>{page.title}</h1>
      {#if page.intro}<p class="intro">{page.intro}</p>{/if}
    </header>
    {/if}
    {/if}
    <div class="page-body" class:with-sidebar={sectionNavigation === 'sidebar'}>
      <div class="sections ps-content-container ps-grid-scope" data-body-layout={page.bodyLayout ?? 'wide'} data-spacing={page.bodySpacing ?? 'none'}><SectionSurfaceGroup>{@render children?.()}</SectionSurfaceGroup></div>
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
  .page-body { display: grid; } .sections { min-width: 0; grid-row: 2; width: 100%; padding-block: calc(var(--ps-grid-gap) * var(--ps-spacing-factor)); } .section-navigation { grid-row: 1; }
  [data-body-layout='narrow'] { max-width: var(--ps-narrow-max); margin-inline: auto; }
  @media (min-width: 1200px) { .with-sidebar { grid-template-columns: 14rem minmax(0, 1fr); } .with-sidebar .sections { grid-column: 2; grid-row: 1; } .with-sidebar .section-navigation { grid-column: 1; grid-row: 1; } }
</style>
