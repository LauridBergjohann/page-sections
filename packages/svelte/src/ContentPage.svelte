<script lang="ts">
  import { setContext, onMount, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { SECTION_CONTEXT, type ReadSectionContext } from './sectionContext.js';
  import {
    SECTION_REGISTRY,
    SectionRegistry,
    themeStyle,
    type ContentPageData,
    type PageTheme
  } from '@page-sections/core';
  import SectionSurfaceGroup from './SectionSurfaceGroup.svelte';
  import Breadcrumbs from './Breadcrumbs.svelte';
  import ContentMenu from './ContentMenu.svelte';
  import HeroSection from './HeroSection.svelte';
  import './styles.css';
  let {
    page,
    children,
    header,
    showHeader = true,
    manageDocumentTitle = true,
    leftSidebar,
    footer,
    showContentMenu = false,
    contentMenuLabel,
    theme,
    class: className = '',
    ...rest
  }: Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'style'> & {
    page: ContentPageData;
    children?: Snippet;
    leftSidebar?: Snippet;
    footer?: Snippet;
    showContentMenu?: boolean;
    contentMenuLabel?: string;
    theme?: PageTheme;
    class?: string;
    header?: Snippet<[ContentPageData, string]>;
    showHeader?: boolean;
    manageDocumentTitle?: boolean;
  } = $props();
  let revision = $state(0);
  let host = $state<HTMLElement>();
  const titleId = $props.id();
  const labelId = $derived(!header && page.hero ? `${page.hero.id}-title` : titleId);
  setContext<ReadSectionContext>(SECTION_CONTEXT, () => ({
    pageKind: 'content',
    headingLevel: 2,
    nested: false
  }));
  const registry = new SectionRegistry(() => {
    revision += 1;
  });
  setContext(SECTION_REGISTRY, registry);
  function sections() {
    void revision;
    return registry.sections;
  }
  onMount(() => {
    const reorder = () =>
      registry.order(
        [...host!.querySelectorAll<HTMLElement>('[data-ps-section]')].map((el) => el.id)
      );
    const observer = new MutationObserver(reorder);
    observer.observe(host!, { childList: true, subtree: true });
    reorder();
    return () => observer.disconnect();
  });
</script>

<svelte:head
  >{#if manageDocumentTitle}<title>{page.pageTitle ?? page.title}</title>{/if}</svelte:head
>
<main
  {...rest}
  bind:this={host}
  class={['ps-page', className]}
  style={themeStyle(theme)}
  aria-labelledby={rest['aria-labelledby'] ??
    (showHeader && !rest['aria-label'] ? labelId : undefined)}
  aria-label={rest['aria-label'] ??
    (!showHeader && !rest['aria-labelledby'] ? page.title : undefined)}
>
  <div class="ps-page-frame">
    <div class="breadcrumbs">
      <Breadcrumbs items={page.breadcrumbs ?? []} />
    </div>
    {#if leftSidebar}<aside class="ps-left-sidebar">
        <div class="sidebar-panel">{@render leftSidebar()}</div>
      </aside>{/if}
    <div class="ps-page-content">
      {#if showHeader}
        {#if header}{@render header(page, titleId)}{:else if page.hero}<HeroSection
            section={{ ...page.hero, headingLevel: 1 }}
          />{:else}
          <div class="ps-content-container">
            <header class="ps-grid-scope">
              {#if page.eyebrow}<p class="eyebrow">{page.eyebrow}</p>{/if}
              <h1 id={titleId}>{page.title}</h1>
              {#if page.intro}<p class="intro">{page.intro}</p>{/if}
            </header>
          </div>
        {/if}
      {/if}
      <div class="page-body">
        <div
          class="sections ps-grid-scope"
          data-body-layout={page.bodyLayout ?? 'wide'}
          data-spacing={page.bodySpacing ?? 'none'}
        >
          <SectionSurfaceGroup>{@render children?.()}</SectionSurfaceGroup>
        </div>
      </div>
      {@render footer?.()}
    </div>
    <!-- After sections register, including during SSR. -->
    {#if showContentMenu && sections().length}<aside class="ps-content-menu-slot">
        <ContentMenu items={sections()} {host} label={contentMenuLabel} />
      </aside>{/if}
  </div>
</main>

<style>
  main {
    container: ps-content / inline-size;
    overflow-x: clip;
    isolation: isolate;
    padding-bottom: 4rem;
    min-height: 60vh;
  }
  header {
    padding: calc(var(--ps-grid-gap) * 2) var(--ps-grid-gap);
  }
  h1 {
    font-size: clamp(2rem, 5vw, 4.5rem);
    line-height: 1.08;
    letter-spacing: -0.04em;
    margin: 0.5rem 0;
  }
  .eyebrow {
    color: var(--ps-accent);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .intro {
    max-width: 64ch;
    color: var(--ps-body);
    line-height: 1.6;
  }
  .page-body {
    min-width: 0;
  }
  .sections {
    min-width: 0;
    width: 100%;
    padding-block: calc(var(--ps-grid-gap) * var(--ps-spacing-factor));
  }
  [data-body-layout='narrow'] {
    max-width: var(--ps-narrow-max);
    margin-inline: auto;
  }
  .ps-page-content {
    grid-column: 2;
    grid-row: 2;
    min-width: 0;
  }
  .breadcrumbs {
    min-height: var(--ps-breadcrumb-height);
    grid-column: 2;
    grid-row: 1;
    padding-inline: var(--ps-grid-gap, 24px);
  }
  .ps-left-sidebar {
    display: none;
  }
  .ps-content-menu-slot {
    grid-column: 2;
    grid-row: 2;
    position: sticky;
    top: var(--ps-sidebar-sticky-top);
    align-self: start;
    justify-self: end;
    height: 0;
    z-index: 5;
  }
  @media (min-width: 1600px) {
    .ps-left-sidebar {
      display: block;
      grid-column: 1;
      grid-row: 2;
      width: var(--ps-sidebar-left-width);
      justify-self: end;
      margin-inline-end: var(--ps-sidebar-gap);
      min-height: 0;
      position: relative;
      z-index: 2;
    }
    .sidebar-panel {
      position: sticky;
      top: var(--ps-sidebar-sticky-top);
      max-height: calc(100dvh - 2 * var(--ps-sidebar-sticky-top));
      overflow: auto;
      overscroll-behavior: contain;
      padding-block: 0.75rem;
      background: var(--ps-section-standard);
      border-radius: var(--ps-radius);
      box-shadow: var(--ps-surface-shadow);
    }
    .ps-content-menu-slot {
      grid-column: 3;
      position: relative;
      top: auto;
      align-self: stretch;
      justify-self: start;
      width: var(--ps-sidebar-right-width);
      height: auto;
      padding-top: var(--ps-content-menu-offset);
      z-index: 0;
    }
  }
</style>
