<!-- Extracted from Spatial Elements Beta.8; see NOTICE. -->
<script lang="ts">
	import { getContext, onMount, setContext, type Snippet } from 'svelte';
	import { SECTION_SURFACES, SectionSurfaceRegistry, layoutTokens, type PageKind } from '@page-sections/core';
	import { SURFACE_SCOPE } from './surfaceContext.js';
	import { SECTION_CONTEXT, defaultSectionContext, type ReadSectionContext } from './sectionContext.js';
	let { children, pageKind }: { children?: Snippet; pageKind?: PageKind } = $props();
	const parent = getContext<ReadSectionContext | undefined>(SECTION_CONTEXT);
	const context = $derived(parent?.() ?? defaultSectionContext);
	setContext<ReadSectionContext>(SECTION_CONTEXT, () => ({ ...context, pageKind: pageKind ?? context.pageKind }));
	const componentId = $props.id();
	const scope = componentId.replace(/[^a-zA-Z0-9_-]/g, '_');
	let host: HTMLDivElement;
	let revision = $state(0);
	const surfaces = new SectionSurfaceRegistry(() => { revision += 1; });
	setContext(SECTION_SURFACES, surfaces);
	setContext(SURFACE_SCOPE, scope);
	onMount(() => {
		const reorder = () => surfaces.order(Array.from(host.querySelectorAll<HTMLElement>('[data-ps-section-surface]'))
			.filter(element => element.closest('[data-ps-section-group]') === host)
			.map(element => Number(element.dataset.psSectionSurface)));
		const observer = new MutationObserver(reorder);
		observer.observe(host, { childList: true, subtree: true });
		reorder();
		return () => observer.disconnect();
	});
	const rules = $derived.by(() => {
		void revision;
		const corners = surfaces.corners.map(({ id, top, bottom }) =>
			`[data-ps-surface-owner="${scope}"][data-ps-section-surface="${id}"] {` +
			`--ps-section-top-radius:${top ? 'var(--ps-radius)' : '0px'};` +
			`--ps-section-bottom-radius:${bottom ? 'var(--ps-radius)' : '0px'};}`
		).join('\n');
		return `@media (min-width:${layoutTokens.layoutMinWidths.xl}px) {${corners}}` +
			((pageKind ?? context.pageKind) === 'detail' ? `@media (min-width:${layoutTokens.layoutMinWidths['3xl']}px) { [data-ps-surface-owner="${scope}"][data-ps-section-surface] { --ps-section-top-radius:0px; --ps-section-bottom-radius:0px; } }` : '');
	});
</script>

<div bind:this={host} data-ps-section-group={scope} style="display: contents">
	{@render children?.()}
	<!-- Evaluate after children register during SSR; helper DOM cannot split surface groups. -->
	<svelte:element this={'style'}>{rules}</svelte:element>
</div>
