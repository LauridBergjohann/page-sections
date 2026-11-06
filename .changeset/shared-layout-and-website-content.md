---
"@page-sections/core": minor
"@page-sections/svelte": minor
---

Unify page, navigation, grid, breadcrumb and catalog-card geometry with the canonical layout tokens. Navigation now supports responsive item menus, route-driven dismissal and static, delayed or fixed scrolling. Add page/menu geometry resolvers and detail-context surface normalization.

Catalog cards now use square S/M/L slots, fixed column spans, canonical title/eyebrow rows and contained 4:3 media. Add stable element attachment/cleanup hooks, media/surface snippets and native-carousel selection callbacks for host enhancements.

Add editorial cards with responsive spans, full descriptions, footers and actions; structured rich text with addresses, inline links, lists and panels; standalone panels; artwork heroes; narrow page bodies and inherited heading levels. These models render complete portfolio and legal-page structures without custom section renderers.

Migration from 0.1.1: use cardVariant="editorial" for long-form cards and item snippets; remove CardItem.size and set collection cardSize instead. Remove PageTheme.contentMax and legacy grid/card width overrides; geometry is canonical, while narrowMax controls reading widths. Review inherited headings, grid-based spacing and XL/detail surface corners. See the 0.2 migration guide in the Wiki.
