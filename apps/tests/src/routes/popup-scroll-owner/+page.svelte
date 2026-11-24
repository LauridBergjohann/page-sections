<script lang="ts">
  import { Popup } from '@page-sections/svelte';
  let open = $state(false);
  let anchor = $state<HTMLButtonElement>();
  let closed = $state(0);
</script>

<main style="min-height: 250vh; padding: 8rem 2rem">
  <h1>Popup document-scroll ownership</h1>
  <div style="position: fixed; top: 200px; left: 24px; width: 320px">
    <button bind:this={anchor} type="button" aria-expanded={open} onclick={() => (open = !open)}>
      Standalone popup
    </button>
    <Popup
      bind:open
      {anchor}
      title="Scrollable content"
      style="max-height: 150px"
      onclose={() => closed++}
    >
      <div style="height: 1600px">Long popup content</div>
    </Popup>
  </div>
  <output aria-label="Dismissals">{closed}</output>
</main>
