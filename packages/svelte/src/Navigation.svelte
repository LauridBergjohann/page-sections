<script lang="ts">
  import type { Snippet } from 'svelte';
  import './styles.css';
  let { menu, left, right, label = 'Main navigation' }: { menu?: Snippet; left?: Snippet; right?: Snippet; label?: string } = $props();
</script>
<nav class="ps-navigation" aria-label={label}>
  {#if left}<div class="satellite left">{@render left()}</div>{/if}
  <div class="menu">{@render menu?.()}</div>
  {#if right}<div class="satellite right">{@render right()}</div>{/if}
</nav>
<style>
  nav { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: .75rem; padding: 1rem; align-items: start; background: var(--ps-background); }
  .menu, .satellite { background: var(--ps-section-standard); border: 1px solid var(--ps-border); border-radius: var(--ps-radius); padding: .5rem; min-width: 0; }
  .menu { grid-row: 1; grid-column: 1 / -1; } .left { justify-self: start; grid-column: 1; } .right { justify-self: end; grid-column: 2; }
  @media (min-width: 1600px) { nav { grid-template-columns: minmax(8rem, 1fr) minmax(0, var(--ps-content-max)) minmax(8rem, 1fr); } .menu { grid-column: 2; } .satellite { grid-row: 1; } .right { grid-column: 3; } }
</style>
