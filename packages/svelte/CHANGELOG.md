# @page-sections/svelte

## 0.9.1

### Patch Changes

- Apply the scoped theme mode to native scrollbars and form controls, including floating panels.

- Support independent panel tint opacity and backdrop blur for headers, satellites, sidebars and floating popups through --ps-panel-tint-opacity and --ps-panel-backdrop-blur. Keep text and controls opaque, preserve existing defaults and leave inline/content surfaces unchanged.

- Keep focused popup inputs open when the mobile keyboard changes viewport height, constrain floating surfaces to the visual viewport, and preserve width-change and scroll dismissal. Align ButtonGroup selection backgrounds with text controls inside animated popups. Add PageTheme.panelBackground and --ps-panel-background for header, satellite, sidebar and popup surfaces, with the existing standard surface as the fallback.
- Updated dependencies
  - @page-sections/core@0.9.1

## 0.9.0

### Minor Changes

- Support section.headingAlign and standalone Heading align with left, center and right values. Move the readable-width introduction with the headline and eyebrow, without changing body content or nested sections. HeroSection ignores headingAlign.

- Extend fixed-header corner flattening to 64px of scroll after docking, and apply the satellite contour to button-group outlines, hover backgrounds and selection surfaces.

- Make fixed headers dock independently from their satellites on XL–3XL layouts using native CSS sticky positioning. Flatten upper corners with scroll progress, reserve the docked header above both sidebars, and update sidebar space when the reactive scrollBehavior prop changes. Compact fixed headers and delayed/static modes retain their behavior.

- Prepend an accessible icon-only Home link in Breadcrumbs, including single-page trails. Hide Home-only trails, reuse an existing Home entry, and expose site-root and label overrides through Breadcrumbs and ContentPage. Scale the icon with the text; use body-colored links without underlines, accent on hover/keyboard focus, and translucent separators and unlinked entries.

- Add mediaHoverZoom (default true) to cards, grids and carousels. Refine overlay gradients to a translucent fade within the copy area and make descriptions and gradient padding follow the native card link while actions keep their own destinations.

- Add FeatureSection with centered incomplete rows, shared S/M/L card spans, decorative icons, standard/muted/primary circle colors and native whole-feature links. Support serializable feature data and custom icon snippets.

- Add below/overlay card content placement with fixed media aspect, theme-independent light/dark copy gradients, accessible overflow and collection support. Use three-column medium cards on the twelve-column L grid in both grids and carousels; other card spans stay unchanged.

- Replace the vertical timeline with a proportional horizontal calendar, shared priority-ordered tracks, viewport-bound bar labels, fit-limited slider and pinch zoom, independent category filters and category-local clusters with standard popup list/detail navigation with outside-click dismissal. Keep sidebars visible above full stages, use standalone content menus on pages with full timelines, and place zoom controls beside the chosen axis. Add optional event labels, axis position, stage width, initial scale and configurable control labels while preserving date normalization, native no-JavaScript details and existing rich content.

  This pre-1.0 minor release changes the timeline's visual layout and removes the former vertical rail, connector and sticky-header styling contract. Existing event data remains valid. Both packages move together to 0.9.0; consumers should review timeline styling. Stage width defaults to contained; opting into full also sets background.size to full while preserving its color.

### Patch Changes

- Use the shared body token consistently for section copy, rich text and panels. Keep headings and navigation on ink, including Markdown and custom section headings, in both color modes.

- Clip both card media modes to their rounded frame during hover and keep the card border visible above images. Align contained media with the 12px text inset.

- Updated dependencies
  - @page-sections/core@0.9.0

## 0.8.0

### Minor Changes

- Add the reusable Chip atom with consistent selected/inactive geometry, leading and trailing icons, native button semantics and Timeline integration. Enlarge only card images on hover, filling the media area without cropping contain images and applying a stronger clipped cover zoom. Keep the card surface and text geometry stable while highlighting the border and shadow. Align timeline rails to category icons and dock chips flush with square upper corners.

- Add a serializable TimelineSection model and SSR-first timeline organism with shared date scales, automatic overlap lanes, category filters, accessible native disclosures, optional images/actions, and responsive anchored detail popups. Extend Popup with opt-in side placement, viewport flipping and container-scroll dismissal.
- Keep timelines in the natural page flow with uncapped height, width-aware label stacking and compact marker-only views. Use the shared Section background throughout, connect rails to transparent sticky category headers, and keep labeled restore controls in the header row, use Lucide icons without a new dependency, and add optional shared Popup close buttons with focus restoration.
- Support ascending and descending timeline axes, decorative Lucide event icons, shared marker/label interaction states, and colored marker borders without white halos. Make document-scroll dismissal part of Popup, including fallback browsers, without moving focus or dismissing on internal scrolling.

### Patch Changes

- Keep tooltips visible when queued scroll or resize notifications arrive after opening; dismiss only on actual viewport or anchor movement. Preserve focus-triggered tooltips after automatic scrolling.

- Align popup titles and close buttons in one shared header row. Remove the nested On this page popup and omit the close button and reserved space in the titleless hamburger menu.

- Updated dependencies
  - @page-sections/core@0.8.0

## 0.7.0

### Minor Changes

- Add themed, keyboard-accessible Tooltip components and native tooltip actions. Introduce brief trigger-oriented popup transitions, a softly fading blur backdrop, immediate button and navigation hover feedback, subtle card elevation, ButtonGroup separators, and an independent footer border theme color. Respect reduced motion and close header settings after selecting a preference.

### Patch Changes

- Updated dependencies
  - @page-sections/core@0.7.0

## 0.6.0

### Minor Changes

- 6a43f3c: Expose PrimaryButton, SecondaryButton, IconButton and Popup and grouped atoms, molecules, organisms and layouts entry points. Reuse Popup across header navigation, settings, content navigation and website search, including shared heading typography and dismissal. Keep all existing root imports compatible. Center compact header controls and document the atomic design learning path with live examples and updated device illustrations.

### Patch Changes

- Keep newly opened popups visible when an earlier scroll notification arrives after opening. Dismiss them only when viewport geometry changes after positioning. Run local browser tests with the same Playwright Chromium revision as CI.

- 57d7105: Add shared CSS controls for shadow color, size and intensity, popup and card-hover shadow overrides, and scalable section shadow clipping. Complete role tokens remain supported as overrides; their defaults now resolve at each surface, so ancestor and local theme controls work consistently.
- 223f28a: Attach header popups without a pointer gap. Outline connected standard-width section surfaces with the panel border, omit internal seams and the attached content-menu edge, and preserve separate borders for floating menus.
- 87f0ff4: Unify header and content-menu popups with an on-demand page blur, active disclosure triggers and native top-layer placement. Repair reopening a mobile menu after outside dismissal, preserve native disclosure behavior without JavaScript, and prevent desktop menu labels from wrapping.

  Constrain the content menu to the sections, excluding pageEnd navigation. Attached menus preserve matching 16px top/bottom insets; detached menus end flush, and compact controls also scroll away with the content.

  Use the responsive grid inset for content-page breadcrumbs: 12px at XS and 16px at S and M.

- 6e15aa7: Use consistent popup spacing, radius, border and shadow. Reset native popover borders and omit the redundant content-menu close button. Keep header icon triggers borderless while preserving keyboard focus indicators.
- 76b7755: Preserve the section edge and shadow in front of docked content menus. Contain sidebar navigation highlights within the panel border and clarify settings heading hierarchy.
- de4a878: Add independent border and panelBorder theme colors for controls and surfaces. Icon buttons and ButtonGroups share the card border; panels and navigation use the panel border, with bottom-only edges on docked headers. Transparent colors disable edges without changing layout.
- Update markdown-it to 15.0.3 and refresh the development toolchain. Migrate the example, test and documentation apps to SvelteKit 3. Verify published package downloads and retry transient registry installation failures during propagation.
- Updated dependencies [de4a878]
  - @page-sections/core@0.6.0

## 0.5.1

### Patch Changes

- Let the compact content-menu button scroll with the page before docking 12px below the viewport edge. Reserve header space only for fixed headers. Use the accent and selection colors while the popup is open, restoring the normal appearance when closed.

- Default Header to delayed scrolling: the header and satellites stay in place for the first 32 scroll pixels, then leave together. Enable this on the website using native CSS sticky positioning, including without JavaScript. The delay remains configurable through --ps-sticky-range; static and fixed modes remain available.

- Remove the outer borders from the main header and satellites. Keep breadcrumbs on one line with ellipsis and inset the compact content-menu button 12px from the first section.

  Animate the main menu's active background and accent line together. Give ButtonGroup one sliding selection surface with rounded outer edges, transitioning text/icon colors, optional icon snippets and accessible icon-only controls. Preserve native links, server-rendered selections and reduced-motion behavior.
  - @page-sections/core@0.5.1

## 0.5.0

### Minor Changes

- Unify cards into one presentation: remove CardVariant, Card.variant and collection cardVariant options. Descriptions render when supplied; use itemSpan for custom grid widths. Add optional cardShadow to collections (shadow on Card), with animated accent borders and hover shadows. The whole card links to its target while additional actions remain independent.

- Keep footer social labels on one line by extending items into the next grid gutter; use two social columns on very narrow phones to prevent overlap. Promote the website's Sections catalog with illustrated cards and interactive demos, and retain redirects from the previous documentation URLs.
- Animate desktop dropdown and mobile menu backdrop blur, respecting reduced motion. Align sidebar child links with a 2rem inset and slightly smaller type. Right-align social links in L and keep at least 8px footer outer gutters across all layouts.
- Add Header as the site-level header landmark with menus inside nav and brand/tools outside. Navigation remains a deprecated export of Header. Add ContentPage.pageEnd with footer as a deprecated fallback. Document the recommended PageShell/Header/ContentPage/Footer composition and allow local snippet styles to override link defaults.
- Use 24px vertical footer-grid padding and 8px outer insets for the footnote and important links at every breakpoint.
- Add a site-level Footer with optional brand, social links and up to four menu groups, required footnote and important links, responsive content-grid alignment, and independent theme settings for its main surface and bottom bar.

### Patch Changes

- Keep cards equally tall with different description lengths. Place descriptions close to the actual title, scale their text with the card size, and cap it at the title size.
- Remove hover underlines in main menus and submenus. Open footer social links in a new tab.

- Render configured icons before top-level menu labels in desktop and mobile layouts, and keep a desktop parent highlighted while its submenu is open.
- Isolate nested section surfaces so transparent examples do not interrupt the rounded surface run of their parent sections. Allocate footer social grid cells the full column-and-gutter width.
- Updated dependencies
  - @page-sections/core@0.5.0

## 0.4.1

### Patch Changes

- Update package READMEs with feature summaries and links to the published documentation website.
- Updated dependencies
  - @page-sections/core@0.4.1

## 0.4.0

### Minor Changes

- Add shared Heading and HeadingSection components, use them for section and page headings, and compose page titles as ordinary content sections. Content menus include h2/h3, with indented h3 entries. Compact code tools into the top-right corner. Nest documentation URLs under their chapters and apply the website's green-teal theme and Lucide disclosure icons. Use down/up disclosure chevrons, keep sidebar scrolling inside the initial viewport, and place the mobile menu before the logo.

- Add the responsive ContentPage sidebar frame, automatic active content menu, hierarchical page-link navigation and shared navigation/geometry resolvers. The documentation uses one navigation tree, linked chapter pages, Lucide icons and previous/next reading links. Replace the former sectionNavigation option with showContentMenu and leftSidebar.

- Add reusable CodeBlock and CodeSection components with serializable source models, optional server-side syntax highlighting, copy feedback, line numbers, line emphasis and responsive grid composition. The optional Shiki adapter is available through the separate `@page-sections/svelte/highlight` entry; ordinary components do not load a highlighting engine.

  Move public documentation into the repository's Svelte website with interactive layout examples, executable code and complete API references. Separate the public website, minimal demo and regression application, and remove the build-time dependency on a separate GitHub Wiki checkout.

### Patch Changes

- Automatically detach content menus beside transparent or full-width page surfaces, including page headers; harmonize panel widths and gaps with the updated layout reference. Align current-page and ancestor navigation states. Consolidate Getting started, add the About/imprint/privacy page and label the component showcase.

- Anchor desktop submenus directly beneath their parent links, keep active navigation backgrounds visible, reopen the current sidebar branch on navigation and reserve breadcrumb space on every content page. Use accent-colored selected button groups and standard surfaces for content menus and website documentation sections.

- Updated dependencies
  - @page-sections/core@0.4.0

## 0.3.0

### Minor Changes

- caaae41: Add theme-aware standard/muted card surfaces through Card.tone and collection cardTone, matching the existing panel tone API. Export the shared SurfaceTone type and forward tone through data renderers and custom card snippets.

  Restore navigation elevation with the configurable --ps-navigation-shadow token and use neutral navigation link colors. Give hero eyebrows accent styling and explicit heading, introduction and action spacing that survives host CSS resets.

### Patch Changes

- Updated dependencies [caaae41]
  - @page-sections/core@0.3.0

## 0.2.0

### Minor Changes

- 480f843: Unify page, navigation, grid, breadcrumb and catalog-card geometry with the canonical layout tokens. Navigation now supports responsive item menus, route-driven dismissal and static, delayed or fixed scrolling. Add page/menu geometry resolvers and detail-context surface normalization.

  Catalog cards now use uniform heights with independent media and text areas. Set collection mediaAspect to 3/2 (default), 4/3 or 1/1, and mediaFit to contain or cover. S/M titles reserve two lines, L three; optional eyebrows add their own aligned row. S uses two columns and 12px titles, M uses 14px titles. Grid rows share the tallest card height. Add stable element attachment/cleanup hooks, media/surface snippets and native-carousel selection callbacks for host enhancements.

  Add editorial cards with responsive spans, full descriptions, footers and actions; structured rich text with addresses, inline links, lists and panels; standalone panels; artwork heroes; narrow page bodies and inherited heading levels. These models render complete portfolio and legal-page structures without custom section renderers.

  Migration from 0.1.1: use cardVariant="editorial" for long-form cards and item snippets; remove CardItem.size and set collection cardSize instead. Remove PageTheme.contentMax and legacy grid/card width overrides; geometry is canonical, while narrowMax controls reading widths. Review inherited headings, grid-based spacing and XL/detail surface corners. See the 0.2 migration guide in the Wiki.

### Patch Changes

- Updated dependencies [480f843]
  - @page-sections/core@0.2.0

## 0.1.1

### Patch Changes

- 81ea8ac: Integrate an optional brand into the navigation header and expose compact satellites through a native Settings disclosure below 1600px. Add optional settingsIcon and settingsLabel props, keyboard dismissal, and reference-aligned wide navigation geometry. No icon or router dependency is added to the package.
- db4827a: Support h1, h2 and h3 section and hero headings. Allow ContentPage headers to be replaced or hidden, delegate document titles to the host, and forward main landmark attributes with accessible labeling defaults.

  Refresh package documentation and branding, migrate the demo to SvelteKit, and retain independent plain Svelte and SvelteKit package verification.

- Updated dependencies [db4827a]
  - @page-sections/core@0.1.1
