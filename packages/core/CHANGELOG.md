# @page-sections/core

## 0.9.0

### Minor Changes

- Replace the vertical timeline with a proportional horizontal calendar, shared priority-ordered tracks, viewport-bound bar labels, fit-limited slider and pinch zoom, independent category filters and category-local clusters with standard popup list/detail navigation with outside-click dismissal. Keep sidebars visible above full stages, use standalone content menus on pages with full timelines, and place zoom controls beside the chosen axis. Add optional event labels, axis position, stage width, initial scale and configurable control labels while preserving date normalization, native no-JavaScript details and existing rich content.

  This pre-1.0 minor release changes the timeline's visual layout and removes the former vertical rail, connector and sticky-header styling contract. Existing event data remains valid. Both packages move together to 0.9.0; consumers should review timeline styling. Stage width defaults to contained; opting into full also sets background.size to full while preserving its color.

## 0.8.0

### Minor Changes

- Add a serializable TimelineSection model and SSR-first timeline organism with shared date scales, automatic overlap lanes, category filters, accessible native disclosures, optional images/actions, and responsive anchored detail popups. Extend Popup with opt-in side placement, viewport flipping and container-scroll dismissal.

## 0.7.0

### Minor Changes

- Add themed, keyboard-accessible Tooltip components and native tooltip actions. Introduce brief trigger-oriented popup transitions, a softly fading blur backdrop, immediate button and navigation hover feedback, subtle card elevation, ButtonGroup separators, and an independent footer border theme color. Respect reduced motion and close header settings after selecting a preference.

## 0.6.0

### Patch Changes

- de4a878: Add independent border and panelBorder theme colors for controls and surfaces. Icon buttons and ButtonGroups share the card border; panels and navigation use the panel border, with bottom-only edges on docked headers. Transparent colors disable edges without changing layout.

## 0.5.1

### Patch Changes

- Align the menu scroll threshold with Spatial Elements: keep the header still for the first 32 scroll pixels, then scroll it out with the page.

## 0.5.0

### Minor Changes

- Unify cards into one presentation: remove CardVariant, Card.variant and collection cardVariant options. Descriptions render when supplied; use itemSpan for custom grid widths. Add optional cardShadow to collections (shadow on Card), with animated accent borders and hover shadows. The whole card links to its target while additional actions remain independent.

- Raise XS/S breadcrumb text to 12px, matching M.
- Add a site-level Footer with optional brand, social links and up to four menu groups, required footnote and important links, responsive content-grid alignment, and independent theme settings for its main surface and bottom bar.

## 0.4.1

### Patch Changes

- Update package READMEs with feature summaries and links to the published documentation website.

## 0.4.0

### Minor Changes

- Add HeadingSize and HeadingSectionData, independent headingSize on sections, and heading-level metadata for hierarchical content menus. Page titles are ordinary heading or hero records within the sections array.

- Update responsive sidebar geometry to 248px panels with 12/28px gaps and 300px panels at 3XL. Support freestanding content-menu rectangles through contentMenuDetached.

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
