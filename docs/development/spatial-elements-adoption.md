# Spatial Elements adoption after 0.2

This records the agreed integration contract. Publish Page Sections 0.2.0 and migrate bergjohann-com first; then integrate the same packages into Spatial Elements. Do not port the previous Beta.8 square-card geometry back into Page Sections.

## Card presentation

- Use catalog cards, initially with `mediaAspect="1/1"` and `mediaFit="contain"` for spatial objects. The other supported media formats are `3/2` (the package default) and `4/3`. Choose one format for the collection.
- The media frame owns its aspect ratio. Add the independent text height below it; the complete card is no longer square and has no 75/25 split.
- S/M use two title lines, L three. M/L eyebrows get an additional line reserved across the collection if any item has a nonblank eyebrow. Missing labels do not move titles upward. S hides labels, spans two columns and uses 12px titles; M uses 14px titles. L retains its three-column exception on the six-column S grid.
- Keep equal card heights throughout a collection, including all grid rows. Text padding is 12px; contained media has an 8px inset. Cropped photographs may use cover without an inset.
- The collection determines size, aspect, fit and eyebrow reservation. Preserve that context for virtualized items, including items currently outside the mounted window. Filtering that changes eyebrow reservation must invalidate row measurements.

## Measurement and rendering

Use `resolveCardLayout(containerWidth, cardSize, { mediaAspect, mediaFit, reserveEyebrow })` for default catalog geometry, including virtual row height and scroll offsets. Its width input includes the section's outer gutters. Add the current grid gap between rows. Recalculate when the container, format, card size or label reservation changes.

`mediaFrame` is the outer media box; `media` is the inner poster/geometry fit rectangle. They differ in contain mode. Keep poster and 3D model fitting in the same inner rectangle. Measure `CardElements.media` and observe its size when attaching the actual renderer; the numeric helper does not account for arbitrary host CSS overrides. Update camera fitting, hover bounds, transition destinations and clipping to use the relevant measured rectangle rather than a percentage of card height.

Attach via `oncardready`/`onready` and retain the returned cleanup boundary. Format changes resize existing elements and do not reattach the adapter; use a ResizeObserver for geometry updates and disconnect it on cleanup. Preserve itemKey occurrence identity when items move or appear more than once.

The host continues to own the stage, GPU rendering, spatial selection, virtual scrolling and camera interactions. Keep server-rendered posters, native links, readable labels and keyboard focus usable before enhancement. Custom snippets inside a linked catalog card must not contain interactive descendants.

## Migration acceptance

Update Spatial Elements' square-card appearance fixtures and numeric expectations deliberately. Compare native poster and enhanced geometry at 320, 600, 720, 840, 1200 and wide layouts, including nested containers. Cover all three media ratios, short/long titles, missing labels, repeated items, filtering, resizing, format changes, keyboard navigation and reduced motion. Verify virtual-scroll row offsets and transitions after each layout change.

Use the Page Sections `/examples/cards/` format comparison and `/examples/integration/` attachment example as references. Keep these expectations shared rather than adding another set of card dimensions in the host.
