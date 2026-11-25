<script module lang="ts">
  export const examples = [
    {
      language: 'svelte',
      code: '<script lang="ts">\n  import { TimelineSection, type TimelineSectionData } from \'@page-sections/svelte\';\n  const section: TimelineSectionData = {\n  "type": "timeline",\n  "id": "morgenhafen-timeline",\n  "title": "Morgenhafen — an open urban lab",\n  "introduction": "Morgenhafen is an entirely fictional urban lab.",\n  "direction": "descending",\n  "axisPosition": "bottom",\n  "stageWidth": "contained",\n  "locale": "en-GB",\n  "referenceDate": "2026-11-25",\n  "initialScale": 0.6,\n  "categories": [\n    {\n      "id": "projects",\n      "title": "Projects & prototypes",\n      "icon": "layers",\n      "color": "#16835D",\n      "events": [\n        {\n          "id": "mh-projects-data-platform",\n          "type": "period",\n          "start": "2024-05",\n          "label": "The shared data platform",\n          "title": "A shared data platform for maps, measurements and workshop documentation",\n          "description": {\n            "body": "The platform connects previously separate archives through **reusable interfaces**. Groups can add their data gradually and document it themselves.\\n\\nThe shared core includes:\\n\\n- Maps and measurements with traceable origins\\n- Workshop notes that state their date precision clearly\\n- Documented limitations and open questions\\n\\nEach group remains responsible for its own contributions."\n          },\n          "icon": "layers",\n          "image": {\n            "src": "/timeline-creative.svg",\n            "alt": "Schematic interface with an illustration, lines of text and two content cards",\n            "width": 640,\n            "height": 360,\n            "aspect": "16/9"\n          },\n          "tags": [\n            "Open data",\n            "Interfaces"\n          ],\n          "action": {\n            "label": "Back to the timeline",\n            "href": "#morgenhafen-timeline",\n            "variant": "secondary"\n          }\n        }\n      ]\n    }\n  ]\n};\n<\/script>\n\n<TimelineSection {section} />'
    }
  ];
</script>

<script lang="ts">
  import {
    HeadingSection,
    Section,
    TimelineSection,
    CodeBlock,
    ButtonGroup
  } from '@page-sections/svelte';
  import ContentPage from '#lib/WebsitePage.svelte';
  import { timelineExampleFor } from '#lib/timelineExample.js';
  import { base } from '#lib/paths.js';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
  let direction = $state<'ascending' | 'descending'>('descending');
  let axisPosition = $state<'top' | 'bottom'>('bottom');
  let stageWidth = $state<'full' | 'contained'>('contained');
</script>

<ContentPage page={{ title: 'Timeline', pageTitle: 'Timeline · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Timeline',
      headingLevel: 1,
      introduction: 'Explore parallel projects and releases on a proportional horizontal calendar.'
    }}
  />
  <Section section={{ id: 'options', title: 'Example options', spacing: 'tight' }}>
    <div class="options">
      <ButtonGroup
        label="Time direction"
        items={[
          { id: 'ascending', label: 'Oldest on the left', selected: direction === 'ascending' },
          { id: 'descending', label: 'Newest on the left', selected: direction === 'descending' }
        ]}
        onselect={(item) => (direction = item.id as typeof direction)}
      />
      <ButtonGroup
        label="Axis position"
        items={[
          { id: 'top', label: 'Axis above', selected: axisPosition === 'top' },
          { id: 'bottom', label: 'Axis below', selected: axisPosition === 'bottom' }
        ]}
        onselect={(item) => (axisPosition = item.id as typeof axisPosition)}
      />
      <ButtonGroup
        label="Stage width"
        items={[
          { id: 'full', label: 'Full page width', selected: stageWidth === 'full' },
          { id: 'contained', label: 'Contained width', selected: stageWidth === 'contained' }
        ]}
        onselect={(item) => (stageWidth = item.id as typeof stageWidth)}
      />
    </div>
    <p>
      Open <strong>The shared data platform</strong> in Projects &amp; prototypes (from May 2024) to see
      an image, rich text, tags and an action link. Move the zoom slider to its left edge to see every
      year.
    </p>
  </Section>
  <TimelineSection section={{ ...timelineExampleFor(base), direction, axisPosition, stageWidth }} />
  <Section
    section={{
      id: 'usage',
      title: 'Usage',
      headline: 'One calendar, shared tracks',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        Import TimelineSection from the root package or <code>
          @page-sections/svelte/organisms
        </code>. The same serializable data works in <code>Sections</code> with
        <code>type: 'timeline'</code>. The full example above and the compact sections overview
        share one fictional source; the overview selects 18 of its 56 events.
      </p>
    </div>
    <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
  </Section>
  <Section
    section={{
      id: 'data',
      title: 'Data and dates',
      headline: 'Precise dates, concise labels',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        <a href={base + '/docs/reference/types/#timeline-section-data'}>TimelineSectionData</a>
        contains categories in priority order. Each category has a stable ID, title, color and events.
        Event IDs must be unique within their category. Optional <code>label</code> supplies a
        compact name for the overview, tooltip and cluster list; an absent or blank label uses
        <code>title</code>. Details always show the complete title.
      </p>
      <p>
        Points have <code>date</code>; periods have <code>start</code> and optional
        <code>end</code>. Strict UTC dates accept YYYY, YYYY-MM and YYYY-MM-DD, including years
        0001–9999. Missing components mean the start of that calendar period. Display preserves the
        supplied precision using <code>locale</code>, default en-GB. Periods are start-inclusive and
        end-exclusive. Zero-duration periods remain valid.
      </p>
      <p>
        Omit end for ongoing work. Its effective end is section <code>end</code>, then
        <code>referenceDate</code>, then the shared UTC SSR day reused during hydration. Do not use
        null. A future open period before its effective end is available is invalid; explicit future
        dates remain valid. Static builds keep their reference day until regenerated. The showcase
        fixes referenceDate to 2026-11-25 and intentionally omits section.end.
      </p>
      <p>
        Section start/end clip the visible domain without rewriting original dates or duration
        priority. The default domain covers complete years from all valid source events. Invalid
        dates, reversed periods, duplicate IDs and invalid windows omit their affected events.
        Category filters preserve this domain, even when the earliest or latest category is hidden.
      </p>
      <p>
        Details retain RichText descriptions, tags, images with srcDark and alt text, and native
        action links. Open the hall opening for the light/dark building illustration, or the common
        data platform for the image, rich description and internal action. Built-in icons include x,
        check, plus, graduation-cap, briefcase, bike, award, book-open, code, layers, heart, sprout,
        palette, rocket and git-pull-request. The <code>icon(category)</code> and
        <code>eventIcon(event)</code> snippets support custom icons without a runtime icon dependency.
        Unknown overview icons use a category or neutral fallback.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'layout',
      title: 'Layout and interaction',
      headline: 'Tracks follow priority, labels follow the viewport',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        All categories share one pool of tracks. For every colliding pair, the higher-priority event
        sits nearer the axis: category array order, then longer original duration, then earlier
        normalized start, then stable composite identity. Points have zero duration priority. Tracks
        are constant across the full event. A priority chain can require three tracks even when only
        two events coincide. Panning never changes tracks, clusters or section height.
      </p>
      <p>
        <code>direction</code> defaults to ascending, with older dates on the left; descending puts
        newer dates on the left. <code>axisPosition</code> independently defaults to bottom. Track zero
        is nearest either axis. Zoom and the visible date range sit beside the axis. The legend sits on
        the opposite side, wraps on narrow screens and independently toggles categories. Colors remain
        tied to category IDs.
      </p>
      <p>
        Bars use true proportional start/end positions. Their icon and ellipsized label follow the
        intersection of the bar and viewport, shrinking and disappearing near the end. Points and
        very short periods use compact circles with 44px hit targets; they do not imply a longer
        duration. Full names are available on keyboard focus and selection. Optional point labels
        are omitted to preserve density.
      </p>
      <p>
        <code>initialScale</code> defaults to 0.6 CSS pixels per day. The logarithmic zoom slider preserves
        the visible time at the center. Its left edge fits the entire timeline and is the minimum zoom,
        overriding a smaller initialScale. Resizing preserves scale until the full timeline fits; at minimum
        zoom it follows the frame width. Pinch on the timeline with a touchscreen or trackpad to zoom
        around the gesture center, within the same limits. Ticks adapt to the scale. Native horizontal
        scrolling and one-finger panning leave normal vertical page scrolling available.
      </p>
      <p>
        <code>clustering</code> defaults to true. Nearby points and genuinely short periods group within
        their category before track allocation. Long bars stay visible. Internal thresholds use a 40px
        join distance, 48px split distance and 96px maximum center span; hysteresis prevents flicker.
        A cluster uses the longest actual member duration for priority. Identical dates remain individually
        accessible in the list at every zoom.
      </p>
      <p>
        A cluster circle opens the standard Popup with an event list. Rows follow start/date
        chronology, newest first for descending, with stable identity ties. Selecting a row shows
        full details; clicking the same cluster circle again restores the list, scroll position and
        row focus. Escape, the close button or an outside click closes the popup. The shared Popup
        provides one top layer and backdrop. Frame scrolling closes its dialog; scrolling the list
        keeps it open. Removed triggers close their dialog and focus a surviving control.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'accessibility',
      title: 'Responsive and accessible',
      headline: 'A wide stage with accessible details',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        <code>stageWidth</code> defaults to <code>contained</code>, keeping the timeline within the
        content width. Choosing <code>full</code> uses the page width with outer spacing and
        automatically sets <code>background.size</code> to <code>full</code>, preserving the
        background color. Its introduction stays within 1536px. Full width is recommended only for
        pages without side navigation: sidebars always remain above the stage. A page containing any
        full-width timeline uses a standalone right content menu instead of docking it. Use
        contained for embedded layouts and pages with side navigation; it respects the configured
        background size. The shared Section <code>stage</code> snippet renders outside its constrained
        content wrapper. Only the timeline frame scrolls horizontally; text and icons keep their size
        on ultrawide displays.
      </p>
      <p>
        Without JavaScript every valid visible event remains a native details/summary disclosure.
        Hydration enables filters, zoom and clustering. Mouse, keyboard and touch open complete
        details without depending on hover. Popup text is selectable. Closing restores focus to the
        trigger. Reduced motion preserves all actions while omitting the standard popup transition.
        Theme tokens govern text, borders and surfaces in light and dark mode.
      </p>
      <p>
        English control defaults can be replaced through zoomLabel, categoriesLabel, eventsLabel and
        closeLabel. Existing presentLabel and emptyLabel remain supported. No language runtime is
        required.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'migration',
      title: 'Migration',
      headline: 'Updating an existing timeline',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        Version 0.9 replaces the vertical category columns with a horizontal shared-track view.
        Existing event data, actions, images, locales and custom icons remain valid. Remove
        overrides that target vertical rails, label connectors or the former
        --ps-timeline-sticky-offset. Choose stageWidth, axisPosition and optional short labels for
        the new layout. After publication, consumers such as bergjohann.com can update both packages
        together and verify their own data against the date, priority, cluster and accessibility
        cases. This release does not modify consumer repositories.
      </p>
    </div>
  </Section>
</ContentPage>

<style>
  .options {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
</style>
