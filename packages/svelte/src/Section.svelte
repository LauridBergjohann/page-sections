<script lang="ts">
  import { getContext, setContext, onDestroy, untrack, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { SECTION_REGISTRY, SECTION_SURFACES, normalizeSectionBackground, createSectionBackgroundNormalizer, type SectionBackgroundDiagnostic, type SectionDefinition, type SectionRegistry, type SectionSurfaceRegistry } from '@page-sections/core';
  import './styles.css';
  import Heading from './Heading.svelte';
  import SectionSurfaceGroup from './SectionSurfaceGroup.svelte';
  import { SURFACE_SCOPE } from './surfaceContext.js';
  import { SECTION_CONTEXT, defaultSectionContext, nextHeading, type ReadSectionContext } from './sectionContext.js';
  type Props = Omit<HTMLAttributes<HTMLElement>, 'children' | 'id'> & { section: SectionDefinition; children?: Snippet; stage?: Snippet; renderHeader?: boolean; inset?: boolean; onDiagnostic?: (diagnostic: SectionBackgroundDiagnostic) => void };
  let { section, children, stage, renderHeader = true, inset, onDiagnostic, class: className = '', ...rest }: Props = $props();
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
  function register() { return registry?.register({ ...section, headingLevel: section.headline ? heading : undefined }); }
  function registerSurface() { return surfaces?.register(background); }
  const registration = register();
  const surface = registerSurface();
  $effect(() => { registration?.update({ ...section, headingLevel: section.headline ? heading : undefined }); surface?.update(background); });
  onDestroy(() => { registration?.unregister(); surface?.unregister(); });
  function expandStage(node: HTMLElement) {
    const update = () => {
      // A page can have asymmetric sidebars. Measure the owning section rather
      // than assuming that its content column is centered in the viewport.
      const left = node.parentElement!.getBoundingClientRect().left;
      node.style.width = `${document.documentElement.clientWidth}px`;
      node.style.marginLeft = `${-left}px`;
    };
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    observer.observe(node.parentElement!);
    update();
    return { destroy: () => observer.disconnect() };
  }
</script>
<section {...rest} id={section.id} class={['ps-section', className]} data-ps-section={section.id}
  data-ps-section-surface={surface?.id} data-ps-surface-owner={surfaceScope} data-background-color={background.color} data-background-size={background.size} data-layout={section.layout ?? 'inherit'}
  data-spacing={section.spacing ?? (context.nested ? 'none' : 'normal')} data-divider={section.divider ?? 'none'} data-variant={section.variant} data-inset={inset ?? !context.nested} data-nested={context.nested}
  aria-labelledby={section.headline ? `${section.id}-title` : undefined} aria-label={section.headline ? undefined : section.title}
  style:--ps-section-width={section.style?.width} style:color={section.style?.color}>
  <span class="ps-section-surface ps-shadow-surface" style:background={background.cssBackground} aria-hidden="true"></span>
  <div class="ps-section-content ps-grid-scope">
  {#if renderHeader && (section.headline || section.eyebrow || section.introduction)}
    <div class="section-heading" class:with-content={!!children}>
      <Heading text={section.headline} level={heading} size={section.headingSize ?? (section.variant === 'content' ? 'm' : 'l')} id={`${section.id}-title`} eyebrow={section.eyebrow} introduction={section.introduction} />
    </div>
  {/if}
  {#if children}
    <!-- Nested sections form their own surface run; they cannot split this section's siblings. -->
    <SectionSurfaceGroup>{@render children()}</SectionSurfaceGroup>
  {/if}
  </div>
  {#if stage}<div class="ps-section-stage" use:expandStage>{@render stage()}</div>{/if}
</section>
<style>
  .ps-section-stage { position: relative; z-index: 3; padding: 0 var(--ps-grid-gap) calc(var(--ps-grid-gap) * var(--ps-spacing-factor, 1)); min-width: 0; box-sizing: border-box; }
  .ps-section { container: ps-content / inline-size; position: relative; isolation: isolate; width: min(var(--ps-section-width, 100%), 100%); margin-inline: auto; min-width: 0; box-sizing: border-box; color: var(--ps-body); scroll-margin-top: var(--ps-scroll-offset, 1rem); }
  .ps-section-content { max-width: 1536px; margin-inline: auto; padding: calc(var(--ps-grid-gap) * var(--ps-spacing-factor, 1)) var(--ps-grid-gap); font: var(--ps-grid-body-size)/var(--ps-grid-body-line-height) var(--ps-font-family); }
  [data-inset='false'] > .ps-section-content { padding-inline: 0; }
  .ps-section-surface { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
  [data-background-size='standard']:is([data-background-color='standard'], [data-background-color='muted']) { z-index: 1; }
  [data-background-size='standard']:is([data-background-color='standard'], [data-background-color='muted']) > .ps-section-surface { bottom: calc(-1 * var(--ps-section-surface-overlap, 0px)); border: solid var(--ps-panel-border); border-width: var(--ps-section-border-top, 1px) 1px var(--ps-section-border-bottom, 1px); box-shadow: var(--ps-surface-shadow, var(--ps-default-surface-shadow)); clip-path: inset(var(--ps-shadow-top-clip, calc(-1 * var(--ps-surface-shadow-extent, calc(12px * max(1, var(--ps-shadow-size, 1)))))) calc(-1 * var(--ps-surface-shadow-extent, calc(12px * max(1, var(--ps-shadow-size, 1))))) var(--ps-shadow-bottom-clip, calc(-1 * var(--ps-surface-shadow-extent, calc(12px * max(1, var(--ps-shadow-size, 1)))))) calc(-1 * var(--ps-surface-shadow-extent, calc(12px * max(1, var(--ps-shadow-size, 1)))))); }
  [data-background-size='full'] > .ps-section-surface { left: 50%; right: auto; width: 100vw; transform: translateX(-50%); border-radius: 0; }
  [data-layout='narrow'] { max-width: min(100%, var(--ps-narrow-max)); } [data-layout='wide'] { max-width: 1536px; }
  [data-layout='full'] { width: 100vw; margin-inline: calc(50% - 50vw); }
  [data-divider='top'], [data-divider='both'] { border-top: 1px solid var(--ps-border); } [data-divider='bottom'], [data-divider='both'] { border-bottom: 1px solid var(--ps-border); }
  .section-heading.with-content { margin-bottom: var(--ps-grid-headline-gap); }
</style>
