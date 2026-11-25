# Horizontal timeline implementation

The 0.9 timeline replaces the vertical renderer. Dates remain strict UTC calendar values; normalization retains original intervals before clipping. A single reference day is serialized into SSR markup and reused during hydration.

`timeline.ts` separates normalization, projection/inverse projection, bounded category-local clustering, strict priority DAG track assignment, visible label geometry and tick selection. Panning changes only label geometry and the visible date readout. It does not rebuild the layout or cluster membership. The priority DAG can require more tracks than temporal concurrency. Original event duration determines priority even for clipped bars; cluster priority uses its longest actual member duration.

Compact markers are 32px; clusters are 40px; collision geometry includes 44px hit targets and an 8px gap. Cluster entry/exit distances are 40/48px with a 96px maximum span and two-member minimum. These are internal defaults, not public fixture-adapter options. Optional point labels are intentionally omitted; focus tooltips and details expose their names.

`TimelineSection` owns category visibility, logarithmic zoom, a fit-to-domain zoom minimum, the time anchor and one controlled Popup. The cluster list remains mounted while details are shown. Clicking the active cluster marker restores its list/panel scroll and selected row; closing restores the original marker. Frame scrolling closes the entire interaction; internal list scrolling does not. The standard non-modal Popup supports outside-click dismissal, selectable text and the shared transition. Side placement falls back above or below the trigger on narrow screens; the trigger stays usable even when detail content grows. Escape closes the popup. Trackpad control-wheel and two-finger touchscreen pinches zoom around their center; native one-finger panning and vertical scrolling remain available. Initial scale and all gestures are clamped to the fit minimum and maximum scale.

`Section.stage` places content outside the heading/content wrapper. On enhancement it measures the owning section's viewport offset so asymmetric page sidebars do not constrain or miscenter the stage. ResizeObserver runs only on the client. Other sections do not use this slot and retain their widths/backgrounds. Sidebars always remain visible above page content. CSS detects any full-width timeline in the page, including SSR/no-JS markup, and switches the right menu to the existing standalone presentation. Full stage width is recommended only without side navigation. A contained timeline uses ordinary Section children and is the default. Explicit `stageWidth: 'full'` also sets `background.size` to `full`, preserving the configured color without mutating the input. Switching back to contained restores the configured background size.

The canonical English fixture is `apps/website/src/lib/timelineShowcase.ts`, checked directly against TimelineSectionData. The overview selection JSON contains references only; `timelineExampleFor` derives instances without mutation and rewrites asset base paths and internal action anchors. Literal documentation examples remain compatible with check:docs.

## Acceptance coverage

The supplied 18-case contract is retained in `tests/fixtures/timeline/edge-cases.json`. Cases 1–16 each have a named unit test in `tests/timeline.test.ts`. Cases 17–18 have SSR assertions there and browser tests in `tests/timeline.e2e.ts`. Browser coverage also exercises the interaction aspects of cases 5–9 and 13–15: list navigation, filters/removal, focus, viewport anchors, SSR clock, native details, touch, light/dark themes, reduced motion and widths 320/390/768/1440/1536/2560/3440. A deterministic 400-event dataset checks complete representation and every collision priority edge.

Screenshots and traces use the existing Playwright output under `test-results/library`. Release verification runs sequential builds and packed artifact consumers, followed by the library and website browser suites.

## Migration

Both packages advance from 0.8 to 0.9 because the layout and previous vertical styling contract change during the pre-1.0 series. The optional data additions preserve existing models. Defaults are ascending direction, bottom axis, contained stage, 0.6 CSS pixels/day (clamped to fit) and enabled clustering. The slider minimum fits the complete timeline; zoom controls and date range follow the axis, with categories opposite. Existing locale, presentLabel, emptyLabel, RichText, images, actions and icon snippets remain supported.

After publication, bergjohann.com should update both package versions, add useful short labels and choose its axis/stage options, remove vertical styling overrides and verify its personal data against the same cases. No consumer repository is part of this change.
