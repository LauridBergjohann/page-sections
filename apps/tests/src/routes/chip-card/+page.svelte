<script lang="ts">
  import { ContentPage, Section, Chip, Card } from '@page-sections/svelte';
  import Plus from '@lucide/svelte/icons/plus';
  import Briefcase from '@lucide/svelte/icons/briefcase';
  let selected = $state(false);
  const item = {
    id: 'sample',
    title: 'Sharp, stationary text',
    description: 'The image stays within its own frame.',
    href: '#cards',
    image: { src: '/timeline-creative.svg', alt: 'Creative project', width: 640, height: 360 }
  };
</script>

<ContentPage page={{ title: 'Chip and card motion' }}>
  <Section section={{ id: 'controls', title: 'Controls', background: { color: 'standard' } }}>
    <Chip label="Work" {selected} onclick={() => (selected = !selected)}>
      {#snippet icon()}{#if selected}<Briefcase size={20} />{:else}<Plus size={20} />{/if}{/snippet}
    </Chip>
    <Chip label="Unavailable" disabled />
  </Section>
  <Section section={{ id: 'cards', title: 'Cards' }}>
    <div class="cards">
      <Card {item} mediaFit="contain" />
      <Card item={{ ...item, id: 'cover' }} mediaFit="cover" />
    </div>
  </Section>
</ContentPage>

<style>
  .cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 300px));
    gap: 2rem;
  }
</style>
