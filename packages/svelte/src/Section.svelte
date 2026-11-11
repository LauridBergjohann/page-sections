<script lang="ts">
  import { getContext, setContext, onDestroy, untrack, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { SECTION_REGISTRY, SECTION_SURFACES, normalizeSectionBackground, createSectionBackgroundNormalizer, type SectionBackgroundDiagnostic, type SectionDefinition, type SectionRegistry, type SectionSurfaceRegistry } from '@page-sections/core';
  import './styles.css';
  import { SURFACE_SCOPE } from './surfaceContext.js';
  import { SECTION_CONTEXT, defaultSectionContext, nextHeading, type ReadSectionContext } from './sectionContext.js';
  type Props = Omit<HTMLAttributes<HTMLElement>, 'children' | 'id'> & { section: SectionDefinition; children?: Snippet; renderHeader?: boolean; inset?: boolean; onDiagnostic?: (diagnostic: SectionBackgroundDiagnostic) => void };
  let { section, children, renderHeader = true, inset, onDiagnostic, class: className = '', ...rest }: Props = $props();
  const readContext = getContext<ReadSectionContext | undefined>(SECTION_CONTEXT);
  const context = $derived(readContext?.() ?? defaultSectionContext);
  const heading = $derived(section.headingLevel ?? context.headingLevel);
  setContext<ReadSectionContext>(SECTION_CONTEXT, () => ({ ...context, nested: true, headingLevel: section.headline ? nextHeading(heading) : heading }));
  const report = createSectionBackgroundNormalizer(diagnostic => untrack(() => onDiagnostic?.(diagnostic)));
  const registry = getContext<SectionRegistry | undefined>(SECTION_REGISTRY);
  const surfaces = getContext<SectionSurfaceRegistry | undefined>(SECTION_SURFACES);
  const surfaceScope = getContext<string | undefined>(SURFACE_SCOPE);
  const background = $derived(normalizeSectionBackground(section.background, { pageKind: context.pageKind }));
  $effect(() => { report(section.background, { pageKind: context.pageKind }); });
  function register() { return registry?.register(section); }
  function registerSurface() { return surfaces?.register(background); }
  const registration = register();
  const surface = registerSurface();
  $effect(() => { registration?.update(section); surface?.update(background); });
  onDestroy(() => { registration?.unregister(); surface?.unregister(); });
</script>
<section {...rest} id={section.id} class={['ps-section', className]} data-ps-section={section.id}
  data-ps-section-surface={surface?.id} data-ps-surface-owner={surfaceScope} data-background-color={background.color} data-background-size={background.size} data-layout={section.layout ?? 'inherit'}
  data-spacing={section.spacing ?? (context.nested ? 'none' : 'normal')} data-divider={section.divider ?? 'none'} data-variant={section.variant} data-inset={inset ?? !context.nested} data-nested={context.nested}
  aria-labelledby={section.headline ? `${section.id}-title` : undefined} aria-label={section.headline ? undefined : section.title}
  style:--ps-section-width={section.style?.width} style:color={section.style?.color}>
  <span class="ps-section-surface" style:background={background.cssBackground} aria-hidden="true"></span>
  <div class="ps-section-content ps-grid-scope">
  {#if renderHeader}
  {#if section.eyebrow}<p class="eyebrow">{section.eyebrow}</p>{/if}
  {#if section.headline}<svelte:element this={`h${heading}`} id={`${section.id}-title`} class="headline">{section.headline}</svelte:element>{/if}
  {#if section.introduction}<p class="introduction">{section.introduction}</p>{/if}
  {/if}
  {@render children?.()}
  </div>
</section>
<style>
  .ps-section { container: ps-content / inline-size; position: relative; isolation: isolate; width: min(var(--ps-section-width, 100%), 100%); margin-inline: auto; min-width: 0; box-sizing: border-box; color: var(--ps-ink); scroll-margin-top: var(--ps-scroll-offset, 1rem); }
  .ps-section-content { max-width: 1536px; margin-inline: auto; padding: calc(var(--ps-grid-gap) * var(--ps-spacing-factor, 1)) var(--ps-grid-gap); font: var(--ps-grid-body-size)/var(--ps-grid-body-line-height) var(--ps-font-family); }
  [data-inset='false'] > .ps-section-content { padding-inline: 0; }
  .ps-section-surface { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
  [data-background-size='standard']:is([data-background-color='standard'], [data-background-color='muted']) { z-index: 1; }
  [data-background-size='standard']:is([data-background-color='standard'], [data-background-color='muted']) > .ps-section-surface { box-shadow: var(--ps-surface-shadow); clip-path: inset(var(--ps-shadow-top-clip, -12px) -12px var(--ps-shadow-bottom-clip, -12px) -12px); }
  [data-background-size='full'] > .ps-section-surface { left: 50%; right: auto; width: 100vw; transform: translateX(-50%); border-radius: 0; }
  [data-layout='narrow'] { max-width: min(100%, var(--ps-narrow-max)); } [data-layout='wide'] { max-width: 1536px; }
  [data-layout='full'] { width: 100vw; margin-inline: calc(50% - 50vw); }
  [data-divider='top'], [data-divider='both'] { border-top: 1px solid var(--ps-border); } [data-divider='bottom'], [data-divider='both'] { border-bottom: 1px solid var(--ps-border); }
  .headline { margin: 0 0 var(--ps-grid-headline-gap); font-size: var(--ps-grid-headline-size); line-height: var(--ps-grid-headline-line-height); font-weight: 600; }
  .eyebrow { color: var(--ps-accent); text-transform: uppercase; letter-spacing: .08em; }
  .introduction { max-width: 64ch; color: var(--ps-body); }
  [data-variant='content'] > .ps-section-content > .headline { font-size: clamp(1.25rem, 3cqw, 1.5rem); line-height: 1.35; }
  [data-variant='feature'] > .ps-section-content > .headline { font-size: clamp(1.875rem, 3cqw, 2.25rem); line-height: 1.2; letter-spacing: -.025em; }
</style>
