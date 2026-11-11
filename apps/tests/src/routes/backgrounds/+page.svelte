<script lang="ts">
  import { HeadingSection, ContentPage, Section, SectionSurfaceGroup } from '@page-sections/svelte';

  import type { SectionBackgroundColor } from '@page-sections/core';
  const solids = ['transparent', 'standard', 'muted'] as const;
  const sizes = ['standard', 'full'] as const;
  const transitions: { color: SectionBackgroundColor; title: string }[] = [
    { color: 'transparentToStandard', title: 'Transparent → Standard' },
    { color: 'standardToMuted', title: 'Standard → Muted' },
    { color: 'mutedToTransparent', title: 'Muted → Transparent' },
    { color: 'transparentToMuted', title: 'Transparent → Muted' },
    { color: 'mutedToStandard', title: 'Muted → Standard' },
    { color: 'standardToTransparent', title: 'Standard → Transparent' }
  ];
</script>

<ContentPage
  page={{
    title: 'A sense of continuity.',
    pageTitle: 'Backgrounds — Page Sections',
    breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Backgrounds' }]
  }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'A sense of continuity.',
      eyebrow: '02 / Backgrounds & surfaces',
      introduction:
        'Solid surfaces, full-width transitions and corners that know their neighbours. Use Light and Dark above to compare the same configuration in both themes.',
      headingLevel: 1,
      headingSize: 'l'
    }}
  />
  <Section
    section={{
      id: 'solids',
      title: 'Solid backgrounds',
      headline: 'Three tones. Two widths.',
      layout: 'narrow',
      spacing: 'loose'
    }}
    ><p class="demo-copy">
      Standard backgrounds stay inside the page column. Full backgrounds extend to the viewport
      edges while their content stays aligned. Transparent lets the page background show through.
    </p></Section
  >
  {#each sizes as size}
    {#each solids as color}
      <Section
        section={{
          id: `${size}-${color}`,
          title: `${size}: ${color}`,
          headline: `${color[0].toUpperCase() + color.slice(1)} / ${size}`,
          background: { color, size },
          spacing: 'loose'
        }}
        ><p class="demo-copy">
          {size === 'full'
            ? 'The surface reaches both edges of the viewport.'
            : 'The surface follows the content column.'}
          {color === 'transparent'
            ? 'The page colour remains visible.'
            : 'Its colour comes directly from the active Page Sections theme.'}
        </p>
        <code class="demo-label">background: {'{'} color: '{color}', size: '{size}' {'}'}</code
        ></Section
      >
    {/each}
  {/each}
  <Section
    section={{
      id: 'gradients',
      title: 'Gradients',
      headline: 'Let one surface flow into another',
      layout: 'narrow',
      spacing: 'spacious'
    }}
    ><p class="demo-copy">
      All six supported gradients are shown below. Gradients require a full-width background. These
      consecutive sections use matching endpoints to form a continuous sequence.
    </p></Section
  >
  {#each transitions as transition}
    <Section
      section={{
        id: transition.color.toLowerCase(),
        title: transition.title,
        headline: transition.title,
        background: { color: transition.color, size: 'full' },
        spacing: 'spacious'
      }}
      ><p class="demo-copy">
        A native Page Sections gradient, with readable content aligned to the page.
      </p>
      <code class="demo-label"
        >background: {'{'} color: '{transition.color}', size: 'full' {'}'}</code
      ></Section
    >
  {/each}
  <Section
    section={{
      id: 'grouping',
      title: 'Surface grouping',
      headline: 'Separate sections. One shared surface.',
      layout: 'narrow',
      spacing: 'spacious'
    }}
    ><p class="demo-copy">
      The next three sections belong to an explicit SectionSurfaceGroup. Adjacent opaque surfaces
      connect even when their colours differ: the first keeps its top corners, the last keeps its
      bottom corners, and the middle joins both. A transparent section separates the next surface.
    </p></Section
  >
  <SectionSurfaceGroup>
    <Section
      section={{
        id: 'group-first',
        title: 'Group: beginning',
        headline: '01 / An opening',
        background: { color: 'standard' },
        spacing: 'loose'
      }}><p class="demo-copy">Rounded above, connected below.</p></Section
    >
    <Section
      section={{
        id: 'group-middle',
        title: 'Group: middle',
        headline: '02 / A continuation',
        background: { color: 'muted' },
        spacing: 'loose'
      }}><p class="demo-copy">A different opaque colour, with no rounded seam.</p></Section
    >
    <Section
      section={{
        id: 'group-last',
        title: 'Group: ending',
        headline: '03 / A conclusion',
        background: { color: 'standard' },
        spacing: 'loose'
      }}><p class="demo-copy">Connected above, rounded below.</p></Section
    >
    <Section
      section={{
        id: 'group-separator',
        title: 'Group: separation',
        background: { color: 'transparent' }
      }}><p class="demo-copy">A transparent pause separates the two surfaces.</p></Section
    >
    <Section
      section={{
        id: 'group-change',
        title: 'Group: new colour',
        headline: '04 / A new chapter',
        background: { color: 'muted' },
        spacing: 'loose'
      }}
      ><p class="demo-copy">
        After the transparent pause, this section has its own rounded surface.
      </p></Section
    >
  </SectionSurfaceGroup>
</ContentPage>
