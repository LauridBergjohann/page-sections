<script module lang="ts">
  export const examples = [
    {
      language: 'svelte',
      code: "<script>\n  import { ButtonGroup } from '@page-sections/svelte';\n  let mode = $state('light');\n<\/script>\n<ButtonGroup label=\"Appearance\"\n  items={[{ id: 'light', label: 'Light', selected: mode === 'light' },\n          { id: 'dark', label: 'Dark', selected: mode === 'dark' }]}\n  onselect={(item) => mode = item.id} />"
    }
  ];
</script>

<script lang="ts">
  import { base } from '$app/paths';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';
  import WebsitePage from '$lib/WebsitePage.svelte';
  import AtomicPreview from '$lib/AtomicPreview.svelte';
</script>

<WebsitePage
  page={{ title: 'ButtonGroup', pageTitle: 'ButtonGroup · Page Sections' }}
  showContentMenu
>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'ButtonGroup',
      introduction: 'Combine related actions or choices without repeating their presentation.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'choices',
      title: 'Related choices',
      headline: 'Related choices',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        A ButtonGroup is a molecule: it combines a list of controls, shared borders and an animated
        selection indicator. Your application owns the selected value. Give the group a label and
        pass <a href={base + '/docs/reference/types/#button-group-item'}>ButtonGroupItem</a> objects through
        items. Each item defines id, label, optional href, selected and disabled. Follow that link for
        the complete data fields.
      </p>
      <p>
        <code>onselect(item)</code> runs when a button is activated. Update the selected fields to move
        the indicator. Items with href are links. The optional icon snippet receives the same item; iconOnly
        hides the visible label but keeps its accessible name.
      </p>
    </div></Section
  ><Section
    section={{
      id: 'try-it-yourself',
      title: 'Try it yourself',
      headline: 'Try it yourself',
      background: { color: 'standard' }
    }}><div class="prose"><AtomicPreview kind="group" /></div></Section
  ><Section
    section={{
      id: 'example',
      title: 'Keep the selection in application state',
      headline: 'Keep the selection in application state',
      background: { color: 'standard' }
    }}><div class="prose"><CodeBlock language="svelte" code={examples[0].code} /></div></Section
  ><Section
    section={{
      id: 'behavior',
      title: 'Focus and appearance',
      headline: 'Focus and appearance',
      background: { color: 'standard' }
    }}
    ><div class="prose">
      <p>
        Tab moves between native controls and Space activates a button. Disabled items cannot be
        activated. The selected background follows the first and last corner shapes, with no inner
        rounding. Its short motion respects reduced-motion preferences. ButtonGroup does not
        implement a tab panel or radio group: use a suitable semantic control if that is the
        interaction you need.
      </p>
      <p>
        Use <a href={base + '/docs/components/popup/'}>Popup</a> to place choices in a floating settings
        panel.
      </p>
    </div></Section
  >
</WebsitePage>
