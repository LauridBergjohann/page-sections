# bergjohann.com migration assessment

Assessment of the supplied `bergjohann-com/src/lib` implementation. The website has not been modified.

| Existing feature/source | Replacement | Application adapter |
| --- | --- | --- |
| components/sections/base/Section.svelte | Section | Map optional title to a required navigation label and set headline for visible headings; map normal background to standard |
| sections/hero/Hero.svelte | HeroSection | Map `heroImage` → `hero`, `sm/md/lg` → `s/m/l`; preserve actions/snippet content and theme-aware image sources |
| sections/text/Richtext.svelte | RichTextSection | Existing body and format transfer; actual Markdown rendering replaces the website's current TODO/plain source rendering |
| sections/image/Image.svelte | ImageSection | Image source, srcDark, alt, aspect, objectFit, description and imageSide transfer |
| sections/video/Video.svelte | VideoSection | HTML5/YouTube, poster, description and videoSide transfer; optional caption tracks improve spoken content accessibility |
| sections/list/List.svelte + Card.svelte | CardGridSection + Card | `cards` → `list`; cardSize aliases; string image → ImageData; `imageCover` → objectFit; subtitle transfers |
| components/content/ContentPage.svelte | ContentPage + Sections + custom renderers | Map page hero/intro/metadata; keep topics/projects/about/prose domain-specific compositions as renderers |
| ui/Container.svelte and content width tokens | ContentPage / ContentGrid / ContentBlock | Map narrow/wide and brand CSS variables; opt into blocks rather than distributing arbitrary HTML |
| header/Header.svelte | Navigation + menu/left/right snippets | Move application search, logo and navigation data into snippets; adapt route-close callbacks where custom popovers are retained |
| header/DesktopMenu + MobileMenu | MainMenu or application menu snippet | Recursive navigation entries map to MenuItem; native details gives no-JavaScript nested navigation; preserve special mega-menu presentation in a snippet if required |
| ui/ThemeSwitch + LanguageSwitch | ButtonGroup in satellites | Retain locale URL resolution, persistence, system-theme tracking and translated labels in the application |
| Breadcrumbs | Breadcrumbs or ContentPage.page.breadcrumbs | Map route metadata to label/href array |
| Paragraph, InfoPanel, TextLink, address/contact blocks | Section children / custom renderer | Application content semantics and branded typography remain local; no new framework primitive required |

Example list adapter (type names refer to the website's existing interfaces):

```ts
import type { CardItem, CardSize, SectionDefinition } from '@page-sections/core';
const sizes = { sm: 's', md: 'm', lg: 'l' } as const;
const list: CardItem[] = oldSection.cards.map(card => ({
  id: card.id, href: card.href, title: card.title, subtitle: card.subtitle,
  image: card.image ? { src: card.image, alt: '', objectFit: card.imageCover ? 'cover' : 'contain' } : undefined
}));
const cardSize: CardSize = sizes[oldSection.cardSize ?? 'md'];
const section: SectionDefinition = {
  ...oldSection, title: oldSection.title ?? 'Related content', headline: oldSection.title,
  background: { color: oldSection.background === 'muted' ? 'muted' : oldSection.background === 'transparent' ? 'transparent' : 'standard' }
};
```

The general content/layout functionality is representable with the implemented primitives. No additional routing, i18n, search or CMS framework is needed or intended. This is a source-level migration assessment, not proof of a completed migration or pixel-identical replacement. Preserve the site's custom header presentation through snippets if desired; the library's default responsive menu intentionally uses native disclosure/flow behavior.

Before migrating, run the site's existing image/video/hero/list/theme/language tests against its adapters, review the actual Markdown output, and verify locale routes and search/popover behavior. npm publication and a registry consumer remain mandatory before Phase 2.
