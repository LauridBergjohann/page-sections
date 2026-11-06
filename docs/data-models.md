# Data-driven pages and extension

`PageData` extends ContentPageData with `sections: SectionData[]`. The discriminated union includes hero, richText, image, video, cardGrid, carousel and grid. All built-in data is JSON serializable. Renderers and event handlers are separate runtime inputs.

```svelte
<script lang="ts">
  import { ContentPage, Sections } from '@page-sections/svelte';
  import type { PageData } from '@page-sections/core';
  const page: PageData = { title: 'Notes', sections: [
    { type: 'richText', id: 'intro', title: 'Introduction', body: '**Hello** from a serializable page.' }
  ] };
</script>
<ContentPage {page} sectionNavigation><Sections sections={page.sections} /></ContentPage>
```

Extend the union through module augmentation. Renderers receive a `section` prop and should wrap their content in Section to participate in navigation and backgrounds.

```ts
import type { SectionDefinition } from '@page-sections/core';
export interface QuoteSection extends SectionDefinition { type: 'quote'; quote: string }
declare module '@page-sections/core' {
  interface SectionTypeMap { quote: QuoteSection }
}
```

```svelte
<!-- Quote.svelte -->
<script lang="ts">
  import { Section } from '@page-sections/svelte';
  import type { QuoteSection } from './quote';
  let { section }: { section: QuoteSection } = $props();
</script>
<Section {section}><blockquote>{section.quote}</blockquote></Section>
```

Then pass `renderers={{ quote: Quote }}` to Sections. The renderer map can also override built-in renderers. Unknown types throw an explicit error rather than silently dropping content. Validate externally supplied JSON at your application's boundary; TypeScript does not validate runtime CMS responses.

Spatial models can extend CardItem with optional geometry, camera and pose metadata. Generic card components preserve the item's concrete type in their snippets. No Spatial-specific field is required by the ordinary card renderer.
