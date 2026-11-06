# Architecture and extraction record

Phase 1 changes Page Sections only. Spatial Elements and bergjohann.com remain reference projects.

The supplied Spatial Elements checkout was at `9d9fcb9`, before the layout components existed. Extraction used an isolated, ignored reference checkout of upstream `main` at **c20fcd9a82daa8cce7a87de4cd0815f5a9985233**, whose packages identify as **1.0.0-beta.8**. No update or edit was made to the supplied Spatial Elements checkout.

| Upstream source | Page Sections destination | Treatment |
| --- | --- | --- |
| core/spatial-element/responsiveLayout.ts | core/responsiveLayout.ts | Retained viewport classification, content-grid/span and card-slot calculations; removed detail, carousel-stage, camera, dock and zoom placement |
| core/spatial-element/layoutTokens.json | core/layoutTokens.json | Retained general content/grid/card/menu/breadcrumb values; excluded hero-stage, pane and stage-control tokens |
| core/spatial-element/sectionBackground.ts | core/sectionBackground.ts | Retained gradient normalization and diagnostics; renamed CSS variables |
| core/spatial-element/SectionSurfaceRegistry.ts | core/SectionSurfaceRegistry.ts | Retained grouping and keyed reorder logic |
| core/spatial-element/spatialElementSectionRegistry.ts | core/SectionRegistry.ts | Preserved lifecycle and uniqueness checks; added ordering, detached snapshots and no resurrection after unregister |
| ContentGrid / ContentBlock | Svelte components of the same name | Retained grid CSS, spans and DOM order; removed `$app/environment` |
| SectionSurfaceGroup | SectionSurfaceGroup | Retained SSR rules after registration, context isolation and MutationObserver ordering |
| generate-layout-css.mjs | script of the same name | Retained general container-grid generation; removed stage/detail/carousel rules; added configurable token fallbacks |
| ContentPage / Section | components of the same name | Reused metadata, registry, backgrounds and grid structure; omitted HDR, stage context, transition attributes and culling |
| SpatialNavigationShell | Navigation | Retained independent menu/left/right snippet composition; native CSS surfaces replace GPU Panel; no router or scroll-clock coupling |

The core package has no framework, rendering or DOM dependencies. The Svelte package depends on core and markdown-it and has one peer dependency: Svelte. markdown-it fills the existing website's Markdown TODO with HTML-disabled Markdown rendering.

CSS and numeric layout calculations share the same JSON tokens. `check:layout` detects stale generated CSS. CSS custom overrides are presentation overrides; applications requiring pixel-exact geometry must use the same canonical tokens or provide equivalent geometry themselves.

Registries belong to each page/group, never module-level shared request state. Section content stays normal Svelte markup. Serialization contains data only; components and snippets are supplied separately.

No upstream implementation is removed in Phase 1. Removal and integration are explicitly deferred until npm publication and independent registry-consumer verification succeed.
