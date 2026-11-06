<script>
  import { Section, SectionSurfaceGroup } from '../packages/svelte/src/index.js';
</script>
<SectionSurfaceGroup>
  <Section section={{ id: 'outer', title: 'Outer', background: { color: 'standard' } }}>
    <SectionSurfaceGroup>
      <Section section={{ id: 'inner', title: 'Inner', background: { color: 'standard' } }}>Nested</Section>
    </SectionSurfaceGroup>
  </Section>
  <Section section={{ id: 'sibling', title: 'Sibling', background: { color: 'muted' } }}>Sibling</Section>
</SectionSurfaceGroup>
