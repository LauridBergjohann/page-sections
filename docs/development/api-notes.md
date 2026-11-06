# API observations for maintainers

Current contracts after the 0.2 layout/content work:

| Area | Contract or remaining boundary |
| --- | --- |
| Page headings | Sections, cards and panels inherit levels through h6. page.hero supplies the single h1; explicit headingLevel and custom headers remain available. |
| Section variants | default/content/feature have built-in heading styles. Nested typography is scoped to its own section. |
| Section navigation | Generated navigation follows content in DOM order while CSS places it before/beside content. |
| Nested themes | A light PageShell does not reset inherited dark palette values automatically. |
| Border inheritance | The root border color is computed from root ink; set border explicitly for descendant palette overrides if necessary. |
| Card sizes | Catalog sizes and media/text rectangles match core; editorial cards use responsive spans and natural text height. |
| Layout tokens | Generated grid/card/menu/satellite/breadcrumb metrics share layoutTokens. Geometry overrides are unsupported; narrowMax controls reading width. |
| Span diagnostics | ContentBlock warnings run in a client effect. |
| Background diagnostics | Section forwards inherited pageKind and optionally reports deduplicated normalization diagnostics. |
| Renderer typing | renderers is Record<string, Component<any>>; applications validate external data and type each renderer. |
| Breadcrumb labels | ContentPage's default header does not forward a custom breadcrumb label; standalone Breadcrumbs does. |
| Controls | Native-carousel arrows remain enabled at endpoints. Selection reports the nearest leading occurrence after scrollend; this is not Spatial Elements' selection engine. |
| Host ownership | Routing, localization, SEO policy, persistence, virtual scrolling, stage/camera state and GPU rendering stay in consuming applications. |

See [release preparation](release-0.2.md) and the Wiki migration guide for changed public behavior.
