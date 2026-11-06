<script lang="ts">
  import { getContext, onDestroy, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { SECTION_REGISTRY, SECTION_SURFACES, normalizeSectionBackground, type SectionDefinition, type SectionRegistry, type SectionSurfaceRegistry } from '@page-sections/core';
  import './styles.css';
  import { SURFACE_SCOPE } from './surfaceContext.js';
  type Props = Omit<HTMLAttributes<HTMLElement>, 'children' | 'id'> & { section: SectionDefinition; children?: Snippet };
  let { section, children, class: className = '', ...rest }: Props = $props();
  const registry = getContext<SectionRegistry | undefined>(SECTION_REGISTRY);
  const surfaces = getContext<SectionSurfaceRegistry | undefined>(SECTION_SURFACES);
  const surfaceScope = getContext<string | undefined>(SURFACE_SCOPE);
  const background = $derived(normalizeSectionBackground(section.background));
  function register() { return registry?.register(section); }
  function registerSurface() { return surfaces?.register(background); }
  const registration = register();
  const surface = registerSurface();
  $effect(() => { registration?.update(section); surface?.update(background); });
  onDestroy(() => { registration?.unregister(); surface?.unregister(); });
</script>
<section {...rest} id={section.id} class={['ps-section', className]} data-ps-section={section.id}
  data-ps-section-surface={surface?.id} data-ps-surface-owner={surfaceScope} data-background-size={background.size} data-layout={section.layout ?? 'inherit'}
  data-spacing={section.spacing ?? 'normal'} data-divider={section.divider ?? 'none'} data-variant={section.variant}
  aria-labelledby={section.headline ? `${section.id}-title` : undefined} aria-label={section.headline ? undefined : section.title}
  style:--ps-section-width={section.style?.width} style:color={section.style?.color}>
  <span class="ps-section-surface" style:background={background.cssBackground} aria-hidden="true"></span>
  <div class="ps-section-content ps-grid-scope">
  {#if section.eyebrow}<p class="eyebrow">{section.eyebrow}</p>{/if}
  {#if section.headline}<svelte:element this={section.headingLevel === 3 ? 'h3' : 'h2'} id={`${section.id}-title`} class="headline">{section.headline}</svelte:element>{/if}
  {#if section.introduction}<p class="introduction">{section.introduction}</p>{/if}
  {@render children?.()}
  </div>
</section>
<style>
  .ps-section { container: ps-content / inline-size; position: relative; isolation: isolate; width: min(var(--ps-section-width, 100%), 100%); margin-inline: auto; min-width: 0; box-sizing: border-box; color: var(--ps-ink); scroll-margin-top: var(--ps-scroll-offset, 1rem); }
  .ps-section-content { padding: var(--ps-grid-gap); font: var(--ps-grid-body-size)/var(--ps-grid-body-line-height) var(--ps-font-family); }
  .ps-section-surface { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
  [data-background-size='full'] > .ps-section-surface { left: 50%; right: auto; width: 100vw; transform: translateX(-50%); border-radius: 0; }
  [data-layout='narrow'] { max-width: var(--ps-narrow-max); } [data-layout='wide'] { max-width: var(--ps-content-max); }
  [data-layout='full'] { width: 100vw; margin-inline: calc(50% - 50vw); }
  [data-spacing='none'] > .ps-section-content { padding-block: 0; } [data-spacing='tight'] > .ps-section-content { padding-block: calc(var(--ps-grid-gap) / 2); }
  [data-spacing='loose'] > .ps-section-content { padding-block: calc(var(--ps-grid-gap) * 2); } [data-spacing='spacious'] > .ps-section-content { padding-block: calc(var(--ps-grid-gap) * 4); }
  [data-divider='top'], [data-divider='both'] { border-top: 1px solid var(--ps-border); } [data-divider='bottom'], [data-divider='both'] { border-bottom: 1px solid var(--ps-border); }
  .headline { margin: 0 0 var(--ps-grid-headline-gap); font-size: var(--ps-grid-headline-size); line-height: var(--ps-grid-headline-line-height); font-weight: 600; }
  .eyebrow { color: var(--ps-accent); text-transform: uppercase; letter-spacing: .08em; }
  .introduction { max-width: 64ch; color: var(--ps-body); }
</style>
