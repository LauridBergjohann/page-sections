<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '#lib/paths.js';
  let { kind }: { kind: string } = $props();
  let width = $state(0);
  let available = $state(800);
  let host = $state<HTMLDivElement>();
  let enabled = $state(true);
  let ready = $state(false);
  const optionLabel = $derived(
    (
      {
        header: 'Show satellites',
        breadcrumbs: 'Show full breadcrumb path',
        'content-page': 'Show sidebars',
        'headings-and-anchors': 'Show nested heading',
        footer: 'Show footer groups'
      } as Record<string, string>
    )[kind]
  );
  const src = $derived(`${base}/examples/page-layout/?kind=${kind}&enabled=${enabled}`);
  const frameWidth = $derived(width || available);
  const scale = $derived(Math.min(1, available / frameWidth));
  onMount(() => {
    ready = true;
    const observer = new ResizeObserver(([entry]) => {
      available = entry.contentRect.width;
    });
    if (host) observer.observe(host);
    return () => observer.disconnect();
  });
</script>

<div class="playground-controls">
  <label>
    Preview viewport<select bind:value={width} disabled={!ready}>
      <option value={0}>Fit available space</option><option value={390}>
        Phone · 390px
      </option><option value={768}>Tablet · 768px</option><option value={1280}>
        Laptop · 1280px
      </option><option value={1920}>Desktop · 1920px</option><option value={2560}>
        Wide desktop · 2560px
      </option>
    </select>
  </label>
  <label class="toggle">
    <input type="checkbox" bind:checked={enabled} disabled={!ready} />
    {optionLabel}
  </label>
</div>
<p class="hint">
  This is a real page in its own viewport. Wide views are scaled to fit here; use the separate tab
  to inspect them at full size. Follow the topic links or open the menus to try their behavior.
  {#if kind === 'header'}Choose Desktop or Wide desktop to see the satellites beside the header; in
    smaller windows they appear inside Settings.{:else if kind === 'footer'}Choose Desktop or Wide
    desktop to see the footer link groups. Scroll inside the preview to reach the footer.{/if}
</p>
<div class="preview-host" bind:this={host} style:height={`${680 * scale}px`}>
  <iframe
    title={`Interactive ${kind} example`}
    {src}
    style:width={width ? `${width}px` : '100%'}
    style:height="680px"
    style:transform={`scale(${scale})`}
  ></iframe>
</div>
<p><a href={src} target="_blank" rel="noopener">Open the example in a separate tab ↗</a></p>

<style>
  .playground-controls .toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
  }
  .hint {
    color: var(--ps-body);
    line-height: 1.7;
  }
  .preview-host {
    position: relative;
    width: 100%;
    overflow: hidden;
    border: 1px solid var(--ps-border);
    border-radius: 8px;
    background: var(--ps-section-muted);
  }
  iframe {
    display: block;
    border: 0;
    transform-origin: top left;
  }
</style>
