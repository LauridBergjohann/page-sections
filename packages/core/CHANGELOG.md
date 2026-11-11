# @page-sections/core

## 0.4.0

### Minor Changes

- Add the responsive ContentPage sidebar frame, automatic active content menu, hierarchical page-link navigation and shared navigation/geometry resolvers. The documentation uses one navigation tree, linked chapter pages, Lucide icons and previous/next reading links. Replace the former sectionNavigation option with showContentMenu and leftSidebar.

- Add reusable CodeBlock and CodeSection components with serializable source models, optional server-side syntax highlighting, copy feedback, line numbers, line emphasis and responsive grid composition. The optional Shiki adapter is available through the separate `@page-sections/svelte/highlight` entry; ordinary components do not load a highlighting engine.

  Move public documentation into the repository's Svelte website with interactive layout examples, executable code and complete API references. Separate the public website, minimal demo and regression application, and remove the build-time dependency on a separate GitHub Wiki checkout.

## 0.3.0

### Minor Changes

- caaae41: Add theme-aware standard/muted card surfaces through Card.tone and collection cardTone, matching the existing panel tone API. Export the shared SurfaceTone type and forward tone through data renderers and custom card snippets.

  Restore navigation elevation with the configurable --ps-navigation-shadow token and use neutral navigation link colors. Give hero eyebrows accent styling and explicit heading, introduction and action spacing that survives host CSS resets.

## 0.2.0

### Minor Changes

- 480f843: Unify page, navigation, grid, breadcrumb and catalog-card geometry with the canonical layout tokens. Navigation now supports responsive item menus, route-driven dismissal and static, delayed or fixed scrolling. Add page/menu geometry resolvers and detail-context surface normalization.

  Catalog cards now use uniform heights with independent media and text areas. Set collection mediaAspect to 3/2 (default), 4/3 or 1/1, and mediaFit to contain or cover. S/M titles reserve two lines, L three; optional eyebrows add their own aligned row. S uses two columns and 12px titles, M uses 14px titles. Grid rows share the tallest card height. Add stable element attachment/cleanup hooks, media/surface snippets and native-carousel selection callbacks for host enhancements.

  Add editorial cards with responsive spans, full descriptions, footers and actions; structured rich text with addresses, inline links, lists and panels; standalone panels; artwork heroes; narrow page bodies and inherited heading levels. These models render complete portfolio and legal-page structures without custom section renderers.

  Migration from 0.1.1: use cardVariant="editorial" for long-form cards and item snippets; remove CardItem.size and set collection cardSize instead. Remove PageTheme.contentMax and legacy grid/card width overrides; geometry is canonical, while narrowMax controls reading widths. Review inherited headings, grid-based spacing and XL/detail surface corners. See the 0.2 migration guide in the Wiki.

## 0.1.1

### Patch Changes

- db4827a: Support h1, h2 and h3 section and hero headings. Allow ContentPage headers to be replaced or hidden, delegate document titles to the host, and forward main landmark attributes with accessible labeling defaults.

  Refresh package documentation and branding, migrate the demo to SvelteKit, and retain independent plain Svelte and SvelteKit package verification.
