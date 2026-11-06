# Components and themes

All sections accept the common SectionDefinition. Declarative section data can omit the `type` discriminator; `Sections` requires it.

| Component | Additional data / props |
| --- | --- |
| HeroSection | `section.image`, `size: s/m/l`, `textBackground`, `actions`; optional children |
| RichTextSection | `section.body`, `format: markdown/text`; Markdown escapes raw HTML and rejects unsafe protocols |
| ImageSection | `section.image`, `description`, `imageSide: left/right`; optional children |
| VideoSection | `section.video`, `description`, `videoSide: left/right`; optional children |
| CardGridSection | `section`, `list`, `cardSize: s/m/l`, `media(item)` and `itemContent(item)` snippets |
| CarouselSection | Same list/snippets; `controls`, `previousLabel`, `nextLabel` |

ImageData requires `src` and `alt`; optional `width/height` reserve intrinsic dimensions, `aspect` accepts `none`, `4/3`, `16/9`, `2/1`, `square`, `objectFit` accepts contain/cover. `srcset/sizes` support responsive assets. `srcDark` follows PageShell's explicit mode, otherwise the operating system's color preference. Set meaningful alt text or an empty string for decorative content.

VideoData supports native HTML5 sources and validated YouTube IDs/URLs. Native video includes controls and optional `{ src, language, label }` caption tracks. YouTube embeds use the nocookie domain; consent policy belongs to the host. Supply caption tracks for speech. No autoplay is enabled.

CardItem requires `id/title`; optional fields are `itemKey`, `href`, `eyebrow`, `description`, `subtitle`, `image` and `size`. `itemKey` distinguishes repeated identities. `size: 'l'` permits an item to span two grid cells when space allows. Collection `cardSize` controls default minimum widths; `--ps-card-min` and `--ps-carousel-card-width` are presentation hooks. Cards deliberately grow with text rather than truncating information to match 3D geometry.

```svelte
<CardGridSection {section} {list}>
  {#snippet itemContent(item)}<p>{item.description}</p>{/snippet}
</CardGridSection>
```

## Independent navigation

```svelte
<Navigation label="Hauptnavigation">
  {#snippet menu()}<MainMenu items={navigation} />{/snippet}
  {#snippet left()}<ButtonGroup label="Sprache" items={languages} />{/snippet}
  {#snippet right()}<ButtonGroup label="Darstellung" items={themes} onselect={selectTheme} />{/snippet}
</Navigation>
```

Navigation has no dependency on ContentPage or PageShell. Satellites are single DOM instances: beside the menu on wide screens, below it on compact screens. They remain visible and operable without JavaScript. MainMenu uses ordinary links and native details/summary for nested groups, including keyboard/touch interaction without hydration. It is a document navigation list, not an ARIA application menubar. Supply arbitrary snippets for custom mobile/popover designs.

MenuItem: `id`, `label`, optional `href`, `current`, `children`. ButtonGroupItem: `id`, `label`, optional `href`, `selected`, `disabled`. Links work without JavaScript; button actions require the host's `onselect`. Routing, locale resolution and theme persistence remain application responsibilities.

## Themes

The package supplies defaults without a Tailwind dependency. Wrap navigation and page in optional `PageShell` to share a theme and explicit `mode: light/dark`, or set the CSS variables on any ancestor.

```svelte
<PageShell theme={{ accent: '#8b4135', radius: '8px', contentMax: '1200px', fontFamily: 'Georgia, serif' }} mode="light">
  <Navigation>...</Navigation>
  <ContentPage {page}>...</ContentPage>
</PageShell>
```

General variables include `--ps-background`, `--ps-ink`, `--ps-body`, `--ps-accent`, `--ps-section-standard`, `--ps-section-muted`, `--ps-radius`, `--ps-border`, `--ps-font-family`, `--ps-content-max`, `--ps-narrow-max`, and `--ps-scroll-offset`. Generated grids expose size-specific overrides such as `--ps-m-gap` and `--ps-l-body-size`. Do not override column counts without adjusting span constraints in core.
