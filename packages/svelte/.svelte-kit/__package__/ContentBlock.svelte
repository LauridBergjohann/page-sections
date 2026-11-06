<!-- Extracted from Spatial Elements Beta.8; see NOTICE. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import {
		contentGridSizes,
		resolveContentSpan,
		layoutTokens,
		type ContentSpan
	} from '@page-sections/core';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Column count, or mobile-first counts by content grid size. Omitted values fill the row. */
		span?: ContentSpan;
		children?: Snippet;
	};
	let { span, children, class: className = '', ...rest }: Props = $props();
	const warned = new Set<string>();
	$effect(() => {
		if (span === undefined) return;
		let requested: number | undefined = typeof span === 'number' ? span : undefined;
		for (const grid of contentGridSizes) {
			if (typeof span === 'object' && span[grid] !== undefined) requested = span[grid];
			if (requested === undefined) continue;
			const columns = layoutTokens.grid[grid].columns;
			if (Number.isInteger(requested) && requested > 0 && requested <= columns) continue;
			const message = `ContentBlock span ${requested} resolves to ${resolveContentSpan(span, grid)} columns in grid ${grid}. Use a positive integer no greater than ${columns}.`;
			if (!warned.has(message)) {
				warned.add(message);
				console.warn(message);
			}
		}
	});
</script>

<div
	{...rest}
	class={['ps-content-block', className].filter(Boolean).join(' ')}
	style:--ps-content-block-span-xs={resolveContentSpan(span, 'xs')}
	style:--ps-content-block-span-s={resolveContentSpan(span, 's')}
	style:--ps-content-block-span-m={resolveContentSpan(span, 'm')}
	style:--ps-content-block-span-l={resolveContentSpan(span, 'l')}
>
	{@render children?.()}
</div>

<style>
	.ps-content-block {
		grid-column: span var(--ps-content-block-span);
		min-width: 0;
		overflow-wrap: anywhere;
	}
</style>
