# Pages and layout

`ContentPage` receives `page` (`title`, optional `pageTitle`, `eyebrow`, `intro`, `breadcrumbs`), children, optional `theme`, `class`, `sectionNavigation` and `navigationLabel`. The main menu is a separate `Navigation`. Breadcrumbs are native links in a labelled navigation landmark; the last item marks the current page.

`Section` receives `{ id, title, headline?, background?, ... }`. Beta.8 distinguishes the navigation/accessibility `title` from the visible `headline`; setting only `title` does not create an extra visible heading. IDs are unique page-local lowercase anchors. Sections can also render standalone without a page context.

`sectionNavigation={true}` (or `'horizontal'` / `'sidebar'`) derives links from registered children. Links are included in the first server render. The navigation renders after children register and is placed above/beside them with CSS; assistive-technology reading order follows the DOM. Do not rely on visual order for a skip link: supply your application's skip link before the page.

## Responsive content grid

These values are extracted from Beta.8. Width is the unpadded content container, in CSS pixels. Outer padding belongs to Section, exactly once. ContentGrid adds only the inner gaps.

| Container | Columns | Padding/gap | Heading size/line | Body size/line |
| --- | --- | --- | --- | --- |
| <600px | 4 | 12px | 18/28px | 14/20px |
| 600–839px | 6 | 16px | 18/28px | 14/20px |
| 840–1199px | 8 | 16px | 20/32px | 14/20px |
| 1200px+ | 12 | 24px | 24/40px | 16/24px |

Content is capped at 1536px by default. Viewports from 1600 through 1808px reserve 136px on each side, matching Beta.8's navigation satellites. The content cap is configurable with `--ps-content-max`.

```svelte
<Section section={{ id: 'details', title: 'Details', headline: 'Details' }}>
  <ContentGrid>
    <ContentBlock span={{ xs: 4, s: 3, m: 5, l: 8 }}>Main content</ContentBlock>
    <ContentBlock span={{ xs: 4, s: 3, m: 3, l: 4 }}>Related content</ContentBlock>
  </ContentGrid>
</Section>
```

Spans inherit mobile-first. Missing or invalid spans fill a row; oversized spans clamp. No dense packing changes keyboard order. For embedded independent containers, wrap the grid/sections with `.ps-content-container`. This CSS container must include the width before the section's padding. `resolveContentGrid`, `resolveContentSpan` and `contentSpanWidth` expose the matching calculations.

## Backgrounds and surfaces

`background: { color, size? }` accepts `transparent`, `standard`, `muted`, and the six directional pairs such as `standardToMuted`. Gradients require `size: 'full'`; otherwise normalization returns the end color and a diagnostic. Full-width backgrounds expand independently of content width. Use these on centered page sections; embedded off-center layouts should use standard backgrounds.

ContentPage automatically supplies SectionSurfaceGroup. Adjacent opaque standard surfaces share the outer corner treatment; transparent/full surfaces split the group. The group works during SSR, updates when sections change and reconciles keyed reordering.

```svelte
<Section section={{ id: 'transition', title: 'Transition',
  background: { color: 'standardToMuted', size: 'full' } }}>...</Section>
```

Additional section options: `layout` (`full`, `wide`, `narrow`, `inherit`), `spacing` (`none`, `tight`, `normal`, `loose`, `spacious`), `divider` (`none`, `top`, `bottom`, `both`), `headingLevel` (2/3), `eyebrow`, `introduction`, `variant` (styling hook), and `style.width/color`. Full layout bleeds to the viewport; narrow layout uses `--ps-narrow-max`. Host CSS can customize the variant attribute.
