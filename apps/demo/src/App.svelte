<script lang="ts">
  import { PageShell, Navigation, MainMenu, ButtonGroup, ContentPage, Sections, Section, ContentGrid, ContentBlock } from '@page-sections/svelte';
  import type { CardItem, PageData } from '@page-sections/core';
  let mode = $state<'light' | 'dark'>('light');
  const cards: CardItem[] = ['Architecture', 'Photography', 'Open source', 'Experiments', 'Writing'].map((title, i) => ({ id: `card-${i}`, title, href: '#layout', description: 'One content model. Native links, accessible HTML and room for your own presentation.', image: { src: '/landscape.svg', alt: 'Illustrated mountain landscape', width: 1200, height: 750, aspect: '16/9' } }));
  const page: PageData = {
    title: 'Space for your ideas.', eyebrow: 'Page Sections / 01', pageTitle: 'Page Sections · Layout collection',
    intro: 'A small, composable foundation for content. Built on native HTML, responsive grids and the layout system of Spatial Elements Beta.8.',
    breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Layout collection' }],
    sections: [
      { type: 'hero', id: 'welcome', title: 'Welcome', headline: 'Good content. A clear structure.', introduction: 'Compose pages that work from the first HTML response. Add interactions when you need them.', image: { src: '/landscape.svg', alt: 'Abstract mountain landscape', width: 1200, height: 750 }, actions: [{ label: 'Explore the collection', href: '#collection' }], background: { color: 'standard' } },
      { type: 'richText', id: 'story', title: 'The approach', headline: 'Start with the content', body: '## Native by default\n\nSections keep **content and presentation** separate. Layout responds to the width of its container, not only the viewport.\n\n- Server-rendered text and links\n- Shared tokens for CSS and TypeScript\n- No rendering engine required\n\n[See the responsive grid](#layout).', background: { color: 'standard' } },
      { type: 'cardGrid', id: 'collection', title: 'Collection', headline: 'A collection of possibilities', list: cards.slice(0, 3), background: { color: 'muted' }, spacing: 'loose' },
      { type: 'carousel', id: 'browse', title: 'Browse', headline: 'Keep exploring', list: cards, background: { color: 'standard' }, spacing: 'loose' },
      { type: 'image', id: 'image', title: 'Image & text', headline: 'Room for a different perspective', image: { src: '/landscape.svg', alt: 'Layered green mountain shapes', aspect: '4/3', width: 1200, height: 750 }, description: 'Images support aspect ratios, contain or cover, captions through snippets and a dark-mode source.', imageSide: 'right', background: { color: 'muted' } },
      { type: 'video', id: 'video', title: 'Video', headline: 'Motion, when it helps', video: { provider: 'html5', src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster: '/landscape.svg' }, description: 'Native video controls remain available without the application JavaScript. Supply caption tracks for spoken content.', background: { color: 'standard' } }
    ]
  };
</script>
<PageShell {mode}>
  <Navigation>
    {#snippet menu()}<MainMenu items={[{ id: 'home', label: 'Page Sections', href: '/', current: true }, { id: 'examples', label: 'Examples', children: [{ id: 'cards', label: 'Cards', href: '#collection' }, { id: 'grid', label: 'Grid', href: '#layout' }] }, { id: 'source', label: 'Source ↗', href: 'https://github.com/LauridBergjohann/page-sections' }]} />{/snippet}
    {#snippet left()}<ButtonGroup label="Language" items={[{ id: 'en', label: 'EN', href: '#welcome', selected: true }, { id: 'de', label: 'DE', href: '#welcome' }]} />{/snippet}
    {#snippet right()}<ButtonGroup label="Theme" items={[{ id: 'light', label: 'Light', selected: mode === 'light' }, { id: 'dark', label: 'Dark', selected: mode === 'dark' }]} onselect={item => mode = item.id as 'light' | 'dark'} />{/snippet}
  </Navigation>
  <ContentPage {page} sectionNavigation>
    <Sections sections={page.sections} />
    <Section section={{ id: 'layout', title: 'Responsive grid', headline: 'One grid. Different rhythms.', background: { color: 'muted' } }}>
      <ContentGrid><ContentBlock span={{ xs: 4, s: 3, m: 5, l: 8 }}><div class="sample"><h3>The main story</h3><p>Four, six, eight or twelve columns. These blocks use the original Beta.8 span rules.</p></div></ContentBlock><ContentBlock span={{ xs: 4, s: 3, m: 3, l: 4 }}><div class="sample"><h3>A related thought</h3><p>Resize the window to see the composition adapt.</p></div></ContentBlock></ContentGrid>
    </Section>
  </ContentPage>
</PageShell>
<style>.sample { border: 1px dashed var(--ps-accent); padding: 1.5rem; min-height: 10rem; border-radius: var(--ps-radius); } h3 { margin-top: 0; } p { line-height: 1.7; }</style>
