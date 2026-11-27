<script lang="ts">
  import {
    ContentPage,
    FeatureSection,
    Sections,
    PrimaryButton,
    type FeatureItem,
    type SectionData
  } from '@page-sections/svelte';
  const list: FeatureItem[] = Array.from({ length: 7 }, (_, index) => ({
    id: 'feature-' + index,
    icon: ['laptop', 'layers', 'database', 'file-code', 'palette', 'puzzle', 'custom'][index],
    title: 'Feature ' + (index + 1),
    description:
      index === 1
        ? 'A longer description stays readable and wraps without changing the shared column width.'
        : 'Shared layout and centered content.',
    href: index === 0 ? '#destination' : undefined
  }));
  const sections: SectionData[] = (['s', 'm', 'l'] as const).map((featureSize) => ({
    type: 'features',
    id: 'features-' + featureSize,
    title: 'Features ' + featureSize,
    headline: 'Features ' + featureSize,
    featureSize,
    list
  }));
</script>

<ContentPage page={{ title: 'Feature layouts' }}>
  <Sections {sections} />
  {#each ['standard', 'muted', 'primary'] as const as iconTone}
    <FeatureSection
      section={{ id: 'tone-' + iconTone, title: iconTone }}
      list={list.slice(0, 2)}
      {iconTone}
    />
  {/each}
  <div class="ps-content-container" style="width: min(100%, 500px)">
    <FeatureSection section={{ id: 'nested', title: 'Nested features' }} {list} featureSize="m">
      {#snippet icon(item)}<svg data-custom-icon={item.id} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2 22 22H2Z" />
        </svg>{/snippet}
    </FeatureSection>
  </div>
  <FeatureSection
    section={{ id: 'unsafe', title: 'Unsafe link' }}
    list={[{ ...list[0], href: 'javascript:alert(1)' }]}
  />
  <PrimaryButton href="#destination">Primary reference</PrimaryButton>
  <div id="destination">Feature destination</div>
</ContentPage>
