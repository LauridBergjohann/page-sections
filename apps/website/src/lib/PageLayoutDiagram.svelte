<script lang="ts">
  let {
    kind
  }: { kind: 'header' | 'breadcrumbs' | 'content-page' | 'headings-and-anchors' | 'footer' } =
    $props();
  const descriptions = {
    header:
      'The header holds the brand and main navigation. Optional satellites sit alongside it when space permits and move into a settings disclosure on smaller screens.',
    breadcrumbs:
      'Breadcrumbs describe the route through the site to this page. The page title starts the content; it is separate from that navigation path.',
    'content-page':
      'The main landmark contains the page content. Optional sidebars link to other pages on the left and to topics within this page on the right.',
    'headings-and-anchors':
      'One h1 names the page. Sections use h2, and their subsections use h3. Stable section IDs let readers link directly to each topic.',
    footer:
      'The site footer follows the main landmark. Optional groups hold related links; the bottom bar holds the footnote and legal links.'
  };
</script>

<figure class="layout-diagram" aria-label="Page anatomy">
  <div class="frame">
    <div class:highlight={kind === 'header'} class="header">
      <span>Brand</span><strong>Header · main navigation</strong><span>Tools</span>
    </div>
    <div class:highlight={kind === 'breadcrumbs'} class="crumbs">
      Guides <span aria-hidden="true">›</span> Garden <span aria-hidden="true">›</span> Planting
    </div>
    <div class:highlight={kind === 'content-page'} class="main">
      <div class="rail">Other pages<br /><small>Left sidebar</small></div>
      <div class="content" class:highlight={kind === 'headings-and-anchors'}>
        <strong>h1 · Planting</strong><span>Main content</span>
        <div>h2 · Prepare the soil <small>#preparation</small></div>
        <div class="nested">h3 · Choose a spot <small>#location</small></div>
        <div>h2 · Sow the seeds <small>#planting</small></div>
      </div>
      <div class="rail">On this page<br /><small>Topic links</small></div>
    </div>
    <div class:highlight={kind === 'footer'} class="footer">
      <span>Footer · related links</span><small>Footnote · legal links</small>
    </div>
  </div>
  <figcaption>
    {descriptions[kind]} This schematic shows the wide layout; the live example below adapts to its available
    viewport.
  </figcaption>
</figure>

<style>
  figure {
    margin: 0;
  }
  .frame {
    border: 1px solid var(--ps-border);
    border-radius: 12px;
    padding: 12px;
    background: var(--ps-section-muted);
    display: grid;
    gap: 10px;
    color: var(--ps-ink);
    font-size: 13px;
  }
  .header,
  .footer {
    display: flex;
    gap: 12px;
    justify-content: space-between;
    align-items: center;
    padding: 14px;
    border: 1px solid var(--ps-border);
    background: var(--ps-section-standard);
    border-radius: 6px;
  }
  .crumbs {
    padding: 10px 14px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .main {
    display: grid;
    grid-template-columns: minmax(60px, 1fr) minmax(0, 3fr) minmax(60px, 1fr);
    gap: 10px;
    padding: 10px;
    border-radius: 6px;
  }
  .rail {
    background: var(--ps-section-standard);
    padding: 12px 8px;
    border: 1px dashed var(--ps-border);
    border-radius: 6px;
  }
  .content {
    display: grid;
    gap: 12px;
    padding: 16px;
    background: var(--ps-section-standard);
    border-radius: 6px;
  }
  .content div {
    padding-top: 10px;
    border-top: 1px solid var(--ps-border);
  }
  .content small {
    display: block;
    color: var(--ps-body);
  }
  .nested {
    margin-left: 16px;
  }
  .highlight {
    outline: 2px solid var(--ps-accent);
    outline-offset: -2px;
    background: color-mix(in srgb, var(--ps-accent) 10%, var(--ps-section-standard));
  }
  figcaption {
    margin-top: 16px;
    color: var(--ps-body);
    line-height: 1.7;
  }
  @media (max-width: 599px) {
    .main {
      grid-template-columns: 1fr;
    }
    .rail {
      padding: 8px;
    }
    .header,
    .footer {
      flex-wrap: wrap;
    }
    .frame {
      padding: 8px;
    }
  }
</style>
