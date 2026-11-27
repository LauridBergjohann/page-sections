<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Sections,
    type CardSize,
    type HeadingAlign,
    type FeatureIconTone,
    type FeatureSectionData,
    type SectionBackgroundColor
  } from '@page-sections/svelte';
  import { featureExample } from './featureExample.js';
  import LiveCode from './LiveCode.svelte';
  let ready = $state(false);
  let featureSize = $state<CardSize>('l');
  let headingAlign = $state<HeadingAlign>('left');
  let iconTone = $state<FeatureIconTone>('muted');
  let background = $state<SectionBackgroundColor>('standard');
  let count = $state(6);
  let links = $state(false);
  onMount(() => {
    ready = true;
  });
  const definition = $derived<FeatureSectionData>({
    type: 'features',
    id: 'feature-preview',
    title: 'Feature preview',
    headline: 'A consistent foundation',
    introduction: 'Reusable sections, shared layouts and room for your own ideas.',
    headingAlign,
    featureSize,
    iconTone,
    background: { color: background },
    list: Array.from({ length: count }, (_, index) => ({
      ...featureExample[index % featureExample.length],
      itemKey: 'feature-' + index,
      href: links ? featureExample[index % featureExample.length].href : undefined
    }))
  });
  const source = $derived(
    `<script lang="ts">\n  import { Sections, type FeatureSectionData } from '@page-sections/svelte';\n  const features: FeatureSectionData = ${JSON.stringify(definition, null, 2)};\n<\/script>\n\n<Sections sections={[features]} />`
  );
  function reset() {
    featureSize = 'l';
    headingAlign = 'left';
    iconTone = 'muted';
    background = 'standard';
    count = 6;
    links = false;
  }
</script>

<div class="playground-controls">
  <label>
    Heading alignment<select bind:value={headingAlign} disabled={!ready}>
      <option value="left">Left</option><option value="center">Center</option><option value="right">
        Right
      </option>
    </select>
  </label>
  <label>
    Feature size<select bind:value={featureSize} disabled={!ready}>
      <option value="s">Small</option><option value="m">Medium</option><option value="l">
        Large
      </option>
    </select>
  </label>
  <label>
    Icon tone<select bind:value={iconTone} disabled={!ready}>
      <option>standard</option><option>muted</option><option>primary</option>
    </select>
  </label>
  <label>
    Section background<select bind:value={background} disabled={!ready}>
      <option>transparent</option><option>standard</option><option>muted</option>
    </select>
  </label>
  <label>
    Feature count<select bind:value={count} disabled={!ready}>
      {#each [1, 2, 3, 4, 5, 6, 7, 8] as value}<option {value}>{value}</option>{/each}
    </select>
  </label>
  <label><input type="checkbox" bind:checked={links} disabled={!ready} /> Link features</label>
  <button type="button" onclick={reset} disabled={!ready}>Reset example</button>
</div>
<p>
  Change the count to see each incomplete row stay centered. Linked icons have the same outline as
  cards; the icon, title and description share one destination.
</p>
<div data-feature-preview><Sections sections={[definition]} /></div>
<LiveCode code={source} />
