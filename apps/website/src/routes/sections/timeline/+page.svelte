<script module lang="ts">
  export const examples = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { TimelineSection, type TimelineSectionData } from '@page-sections/svelte';
  const section: TimelineSectionData = {
    type: 'timeline', id: 'journey', title: 'My Journey', headline: 'My Journey',
    background: { color: 'standard' },
    referenceDate: '2026-01-01',
    direction: 'ascending', // Use 'descending' for newest-first changelogs.
    categories: [
      { id: 'education', title: 'Education', color: '#169b63', icon: 'graduation-cap', events: [
        { id: 'degree', type: 'period', title: 'Computer Science', icon: 'graduation-cap', start: '2014', end: '2018',
          image: { src: '/timeline-campus.svg', alt: 'University campus', width: 640, height: 360, aspect: '16/9' } },
        { id: 'graduation', type: 'point', title: 'Graduation', icon: 'award', date: '2018-07-12' }
      ] },
      { id: 'work', title: 'Work', color: '#168d91', events: [
        { id: 'architect', type: 'period', title: 'Software Architect', icon: 'layers', start: '2022',
          description: { body: 'Designing **accessible** platforms.' }, tags: ['Architecture'],
          action: { label: 'View project', href: '/projects/platform/', variant: 'primary' } },
        { id: 'open-source', type: 'period', title: 'Open Source', icon: 'git-pull-request', start: '2024', end: '2025' }
      ] },
      { id: 'hobby', title: 'Hobby', color: '#69a52d', events: [
        { id: 'cycling', type: 'period', title: 'Cycling', icon: 'bike', start: '2015' },
        { id: 'first-tour', type: 'point', title: 'First cycling tour', icon: 'bike', date: '2016-08' }
      ] }
    ]
  };
<\/script>

<TimelineSection {section} />`
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
  import ArrowDown from '@lucide/svelte/icons/arrow-down';
  import ArrowUp from '@lucide/svelte/icons/arrow-up';
  import ContentPage from '#lib/WebsitePage.svelte';
  import { timelineExampleFor } from '#lib/timelineExample.js';
  import { base } from '#lib/paths.js';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
  let direction = $state<'ascending' | 'descending'>('ascending');
</script>

<ContentPage page={{ title: 'Timeline', pageTitle: 'Timeline · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Timeline',
      headingLevel: 1,
      introduction:
        'Compare parallel journeys, project phases and milestones on one shared calendar.'
    }}
  />
  <div class="example">
    <ButtonGroup
      label="Time direction"
      items={[
        { id: 'ascending', label: 'Oldest first', selected: direction === 'ascending' },
        { id: 'descending', label: 'Newest first', selected: direction === 'descending' }
      ]}
      onselect={(item) => (direction = item.id as typeof direction)}
    >
      {#snippet icon(item)}{#if item.id === 'ascending'}<ArrowDown size={18} />{:else}<ArrowUp
            size={18}
          />{/if}{/snippet}
    </ButtonGroup>
    <p class="image-hint">
      Open ?B.Sc. Computer Science? for a campus image, or ?Creative Side Projects? for a project
      illustration. Both images appear in the event details.
    </p>
    <TimelineSection section={{ ...timelineExampleFor(base), direction }} />
  </div>
  <Section
    section={{ id: 'usage', title: 'Usage', headline: 'A complete example', variant: 'content' }}
  >
    <div class="prose">
      <p>
        The example above is fictional. Import <code>TimelineSection</code> from the root package or
        <code>@page-sections/svelte/organisms</code>. Pass <code>section</code> directly, or put the
        same data in <code>Sections</code> with <code>type: 'timeline'</code>. Section registration,
        navigation, headings and backgrounds follow the shared Section contract.
      </p>
    </div>
    <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
  </Section>
  <Section
    section={{
      id: 'data',
      title: 'Data and dates',
      headline: 'Data and dates',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        <a href={base + '/docs/reference/types/#timeline-section-data'}>TimelineSectionData</a>
        contains categories with unique IDs, titles, CSS colors, optional Lucide icon keys, and events.
        Built-in keys are <code>graduation-cap</code>, <code>briefcase</code> and <code>bike</code>.
        An optional <code>icon</code> snippet receives the category and can resolve other keys to Lucide
        components from your application. Unknown keys render no icon. The library adds no icon package
        dependency. Event IDs must be unique within each category.
      </p>
      <p>
        Events can also have an <code>icon</code> key. Their labels support the Lucide keys
        <code>graduation-cap</code>, <code>briefcase</code>, <code>bike</code>, <code>award</code>,
        <code>book-open</code>, <code>code</code>, <code>layers</code>, <code>heart</code>,
        <code>sprout</code>, <code>palette</code>, <code>rocket</code> and
        <code>git-pull-request</code>. Use the optional <code>eventIcon(event)</code> snippet to render
        additional Lucide components. Decorative icons do not duplicate accessible event titles.
      </p>
      <p>
        Set <code>direction: 'ascending'</code> (the default) for oldest-first histories, or
        <code>direction: 'descending'</code> for newest-first changelogs. The date axis and periods reverse
        together; start and end retain their chronological meaning. In descending order, a period's later
        end is at the top. Labels and keyboard order follow the visual order, including ongoing periods
        and clipped date ranges. Interval lanes stay consistent.
      </p>
      <p>
        <a href={base + '/docs/reference/types/#timeline-event'}>TimelineEvent</a> is a point with
        <code>date</code>, or a period with <code>start</code> and optional <code>end</code>. Dates
        are strictly <code>YYYY</code>, <code>YYYY-MM</code> or <code>YYYY-MM-DD</code>, years
        0001–9999. Missing month/day means January/the first day. Periods use start-inclusive,
        end-exclusive boundaries; a period ending in 2022 frees its lane for one starting in 2022.
        Labels preserve supplied precision, using UTC and the explicit <code>locale</code> (default en-GB).
      </p>
      <p>
        Omit an event's end for an ongoing period. Its visual end is section <code>end</code>, then
        <code>referenceDate</code>, then the UTC date of the SSR render. The rendered date is reused
        during hydration, including cached pages. Set referenceDate in your serialized content for
        reproducible builds; regenerate static pages to advance “today”. <code>presentLabel</code> defaults
        to Present.
      </p>
      <p>
        The default window spans complete years covering all valid events. Section start/end
        override it; intersecting periods are clipped and wholly outside events are omitted. Filters
        retain the original scale. Invalid dates, reversed periods, duplicate IDs and invalid
        windows yield no corresponding events rather than throwing. An empty category remains
        filterable. <code>emptyLabel</code> customizes the empty-state message.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'layout',
      title: 'Layout and interaction',
      headline: 'Parallel events, compact details',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        Events are sorted by start, descending end and stable ID. Each takes the first free lane,
        using the minimum number of simultaneous interval lanes. Points reserve one day. Labels use
        separate collision columns when there is enough horizontal space. With less room they stack
        vertically within the category, with connectors preserving their exact date position. Long
        titles wrap in full. ResizeObserver measures the available width and label heights,
        including resized text. Narrow categories hide labels while retaining every event marker.
      </p>
      <p>
        Category headers are pressed filter buttons. Hidden categories release their column and
        remain available as labeled restore buttons in the same header row, without shifting the
        chart vertically. Hovering a marker or its label highlights both; the highlight also follows
        keyboard focus and an open popup. Markers use a colored border without a white halo. Hiding
        a category closes details. Selecting an event toggles its locally anchored Popup; selecting
        another replaces it. Escape, outside click, the close button and scrolling dismiss it.
        Escape and the close button return focus to the event. Popup side placement flips and clamps
        to the viewport.
      </p>
      <p>
        Optional description accepts plain text or <a
          href={base + '/docs/reference/types/#rich-text-content-data'}
        >
          RichTextContentData
        </a>. Optional <a href={base + '/docs/reference/types/#image-data'}>ImageData</a> uses the
        shared Image component, including srcDark, dimensions, aspect, objectFit and lazy loading.
        The default 16:9 frame and 180px height limit reserve space without dominating the popup.
        Tags render only when present. Optional
        <a href={base + '/docs/reference/types/#content-action'}>ContentAction</a> renders a native link;
        routing belongs to your application.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'accessibility',
      title: 'Responsive and accessible',
      headline: 'Responsive and accessible',
      variant: 'content'
    }}
  >
    <div class="prose">
      <p>
        The timeline fills its container width and grows naturally with its date range and labels.
        It has no internal scrollbars or height limit. Category headers follow page scrolling; all
        columns retain a shared date scale. On narrow screens or with many categories, labels
        disappear and marker lanes compress to fit. Markers still open complete details by mouse,
        touch or keyboard, and every event retains its accessible title and date.
      </p>
      <p>
        Set <code>--ps-timeline-sticky-offset</code> on an ancestor to reserve room for your sticky navigation
        (default 0px). No application header height is assumed. Only the category buttons stick; the Date
        caption scrolls away. The header and date axis remain transparent, so the shared Section background
        covers the whole timeline. Category rails align with the center of their button icon. When the
        category chips reach the sticky edge, they dock flush with square upper corners; scrolling back
        restores their rounded shape. Category colors tint markers and surfaces; text, borders, focus
        and popups use the shared theme in light and dark mode. Reduced motion follows the shared Popup
        and button behavior.
      </p>
      <p>
        SSR includes every visible event and optional detail. Before JavaScript, categories contain
        chronological native details/summary lists with readable full titles, images and links.
        Filter and close buttons appear only after enhancement. Enter or Space opens event details;
        color is supplemented by category names, dates and distinct point/period shapes.
      </p>
    </div>
  </Section>
</ContentPage>
