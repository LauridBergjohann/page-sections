# API observations for maintainers

These observations were found while documenting 0.1.0. They describe the current implementation and possible follow-up work, not changes made by the documentation update. Public references state the actual behavior.

| Area | Observation |
| --- | --- |
| Hero heading | HeroSection accepts the shared headingLevel field but always renders h2. |
| Section variants | default/content/feature produce a data attribute only; there are no preset variant styles. |
| Section navigation | Generated navigation follows content in DOM order while CSS places it before/beside content. |
| Nested themes | A light PageShell inside a dark ancestor does not reset inherited palette variables. Image mode selection and CSS palette selection can therefore differ unless explicit values are supplied. |
| Border inheritance | The default border variable is defined on :root using ink; descendant ink changes should not be advertised as automatically recomputing it. |
| Card sizes | Per-item size only affects large grid spans; carousel ignores it. s/l sizing variables are assigned locally, limiting ancestor-only overrides. |
| Layout token consumers | Core square-card and breadcrumb numeric tokens are not equivalent to the current Svelte component geometry. Navigation follows the reference menu/satellite dimensions in CSS, but does not react to numeric-token changes. |
| CSS/numeric parity | CSS width/gap/column overrides do not update core calculations; ContentBlock still clamps to canonical columns. |
| Span diagnostics | ContentBlock warnings run in a client effect without a development-only guard. |
| Background diagnostics | With no pageKind, a diagnostic message may include undefined; Section does not report the diagnostic itself. |
| Renderer typing | renderers is Record<string, Component<any>>; key-to-prop correspondence is not checked by the map type. |
| Breadcrumb label | ContentPage does not forward a custom Breadcrumbs label. Standalone Breadcrumbs does support one. |
| Controls | Carousel buttons are not disabled at endpoints. ButtonGroup does not update selected state or invoke onselect for links. |

Any implementation change should be a separate, tested task with the associated public API and behavior documentation updated together.
