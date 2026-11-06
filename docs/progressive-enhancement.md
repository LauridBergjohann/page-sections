# Progressive enhancement contract

CardGridSection and CarouselSection render normal articles, images and anchors on the server. CarouselSection uses overflow and CSS scroll snap; its focusable region supports native keyboard scrolling. Touch and trackpad gestures need no script. Optional arrow buttons appear only after hydration, preventing inert controls in no-JavaScript HTML. Reduced motion disables smooth programmatic scrolling.

The demo prerenders via `svelte/server` and hydrates the same component tree. A plain Vite client-only starter would not satisfy the no-JavaScript requirement: applications must SSR or prerender their pages as demonstrated in `apps/demo`.

Future Spatial integration should reuse the same `list` and the `media(item)` snippet to attach a geometry presentation to each existing card. `itemContent(item)` supplies additional application content. Keep the ordinary anchor and textual content as the semantic owner; do not render a second list just for fallback.

The Spatial runtime owns capability detection, GPU initialization, first-frame readiness and failure recovery. Keep native media visible until a verified 3D frame is ready. On GPU initialization failure, retain the native representation and focused element. Reserve media dimensions before enhancement; do not move the card's links into a replacement tree. No such integration is implemented in Phase 1.

Tests cover SSR content, no-JavaScript layouts at 375/840/1600px, native carousel scrolling, working nested menus and a hydrated page with `navigator.gpu` unavailable. GPU failure regression tests belong to Phase 2 once the actual runtime integration exists.
