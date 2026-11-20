<script>
  import { Section, SectionSurfaceGroup } from '../packages/svelte/src/index.js';
</script>
<SectionSurfaceGroup>
  <Section section={{ id: 'heading', title: 'Heading', background: { color: 'standard' } }} />
  {#each ['first', 'middle', 'last'] as id, index}
    <Section section={{ id, title: id, background: { color: index % 2 ? 'standard' : 'muted' } }}>
      <Section section={{ id: `${id}-example`, title: 'Example', background: { color: 'transparent' } }}>Example content</Section>
    </Section>
  {/each}
</SectionSurfaceGroup>
