# Horizontal timeline implementation

The 0.9 timeline replaces the vertical renderer. Dates remain strict UTC calendar values; normalization retains original intervals before clipping. A single reference day is serialized into SSR markup and reused during hydration.

`timeline.ts` separates normalization, projection/inverse projection, bounded category-local clustering, strict priority DAG track assignment, visible label geometry and tick selection. Panning changes only label geometry and the visible date readout. It does not rebuild the layout or cluster membership. The priority DAG can require more tracks than temporal concurrency. Original event duration determines priority even for clipped bars; cluster priority uses its longest actual member duration.

Compact markers are 32px; clusters are 40px; collision geometry includes 44px hit targets and an 8px gap. Cluster entry/exit distances are 40/48px with a 96px maximum span and two-member minimum. These are internal defaults, not public fixture-adapter options. Optional point labels are intentionally omitted; focus tooltips and details expose their names.

`TimelineSection` owns category visibility, logarithmic zoom, explicit fit mode, the time anchor and one controlled Popup. The cluster list remains mounted while details are shown. Back/Escape restores its scroll and selected row; closing restores the original marker. Frame scrolling closes the entire interaction; internal list scrolling does not. Modal behavior and circle-to-window animation extend the existing Popup/popupLayer infrastructure.

`Section.stage` places content outside the heading/content wrapper. On enhancement it measures the owning section's viewport offset so asymmetric page sidebars do not constrain or miscenter the stage. ResizeObserver runs only on the client. Other sections do not use this slot and retain their widths/backgrounds. Desktop sidebars become invisible while a full stage is in view so they cannot cover its controls or events; their grid space remains stable and header navigation remains available. IntersectionObserver owns this client-only visibility signal. A contained timeline uses ordinary Section children.

The canonical English fixture is `apps/website/src/lib/timelineShowcase.ts`, checked directly against TimelineSectionData. The overview selection JSON contains references only; `timelineExampleFor` derives instances without mutation and rewrites asset base paths and internal action anchors. Literal documentation examples remain compatible with check:docs.

## Acceptance coverage

The supplied 18-case contract is retained in `tests/fixtures/timeline/edge-cases.json`. Cases 1–16 each have a named unit test in `tests/timeline.test.ts`. Cases 17–18 have SSR assertions there and browser tests in `tests/timeline.e2e.ts`. Browser coverage also exercises the interaction aspects of cases 5–9 and 13–15: list navigation, filters/removal, focus, viewport anchors, SSR clock, native details, touch, light/dark themes, reduced motion and widths 320/390/768/1440/1536/2560/3440. A deterministic 400-event dataset checks complete representation and every collision priority edge.

Screenshots and traces use the existing Playwright output under `test-results/library`. Release verification runs sequential builds and packed artifact consumers, followed by the library and website browser suites.

## Migration

Both packages advance from 0.8 to 0.9 because the layout and previous vertical styling contract change during the pre-1.0 series. The optional data additions preserve existing models. Defaults are ascending direction, bottom axis, full stage, 0.6 CSS pixels/day and enabled clustering. Existing locale, presentLabel, emptyLabel, RichText, images, actions and icon snippets remain supported.

After publication, bergjohann.com should update both package versions, add useful short labels and choose its axis/stage options, remove vertical styling overrides and verify its personal data against the same cases. No consumer repository is part of this change.
