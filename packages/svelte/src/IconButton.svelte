<script lang="ts">
  import Button from './Button.svelte';
  import type { IconButtonProps } from './button.js';
  let { label, element = $bindable(), ...props }: IconButtonProps = $props();
</script>
<Button {...props} bind:element variant="icon" aria-label={label} title={props.title ?? label} />
