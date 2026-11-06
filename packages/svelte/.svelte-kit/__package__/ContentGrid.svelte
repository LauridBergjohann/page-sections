<!-- Extracted from Spatial Elements Beta.8; see NOTICE. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import './layout.generated.css';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Explicit ContentBlock children; the enclosing Section owns the grid's outer padding. */
		children?: Snippet;
	};
	let { children, class: className = '', ...rest }: Props = $props();
</script>

<div {...rest} class={['ps-content-grid', 'ps-grid-scope', className].filter(Boolean).join(' ')}>
	{@render children?.()}
</div>

<style>
	.ps-content-grid {
		display: grid;
		grid-template-columns: repeat(var(--ps-grid-columns), minmax(0, 1fr));
		grid-auto-flow: row;
		gap: var(--ps-grid-gap);
		min-width: 0;
		align-items: start;
		font-size: var(--ps-grid-body-size);
		line-height: var(--ps-grid-body-line-height);
	}
</style>
