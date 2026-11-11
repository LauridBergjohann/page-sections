<script lang="ts">
  import { HeadingSection, ContentPage, Section, CardGridSection } from '@page-sections/svelte';
</script>

<ContentPage page={{ title: 'Field notes' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Field notes',
      introduction: 'A minimal Page Sections application.',
      headingLevel: 1,
      headingSize: 'l'
    }}
  />
  <Section section={{ id: 'about', title: 'About', headline: 'A place to begin' }}>
    <p>Compose ordinary HTML and reusable sections. This entire example lives in one page.</p>
  </Section>
  <CardGridSection
    section={{ id: 'projects', title: 'Projects', headline: 'Selected projects' }}
    cardVariant="editorial"
    cardTone="muted"
    list={[
      {
        id: 'garden',
        title: 'A community garden',
        description: 'An idea that grew together.',
        href: '#about'
      },
      {
        id: 'journal',
        title: 'A walking journal',
        description: 'Notes from a slower journey.',
        href: '#about'
      }
    ]}
  />
</ContentPage>
