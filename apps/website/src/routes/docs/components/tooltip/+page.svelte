<script module lang="ts">
  export const examples = [
    {
      language: 'svelte',
      code: '<script>\n  import { Tooltip } from \'@page-sections/svelte\';\n<\/script>\n<Tooltip text="Download the original file">\n  <button type="button">Download</button>\n</Tooltip>'
    }
  ];
</script>

<script lang="ts">
  import {
    HeadingSection,
    Section,
    Tooltip,
    SecondaryButton,
    CodeBlock
  } from '@page-sections/svelte';
  import WebsitePage from '#lib/WebsitePage.svelte';
</script>

<WebsitePage page={{ title: 'Tooltip', pageTitle: 'Tooltip · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'heading',
      title: 'Tooltip',
      headingLevel: 1,
      introduction: 'Short, accessible hints that stand apart from page content.'
    }}
  />
  <Section section={{ id: 'example', title: 'Try it', headline: 'Try it' }}>
    <Tooltip text="Download the original file"><SecondaryButton>Download</SecondaryButton></Tooltip>
    <p>
      Hover or focus the button. Escape dismisses the hint without moving focus. You can move the
      pointer onto the tooltip to keep it visible.
    </p>
    <CodeBlock code={examples[0].code} language="svelte" />
  </Section>
  <Section
    section={{ id: 'usage', title: 'Usage and appearance', headline: 'Usage and appearance' }}
  >
    <p>
      <code>text</code> is a plain string. Supply one focusable element as <code>children</code>;
      the wrapper uses display: contents and adds no layout box. For native controls, the exported
      <code>tooltip</code>
      action also supports <code>use:tooltip={'{text}'}</code>.
    </p>
    <p>
      IconButton and icon-only ButtonGroup options use these tooltips automatically. Button title
      values become custom hints. Keep an accessible label on icon controls and put essential
      instructions in visible content, since touch users do not hover.
    </p>
    <p>
      Hints appear after 350 ms of pointer hover or immediately on focus. They fit the viewport,
      inherit the theme, and use the browser top layer where available. Reduced motion disables
      their short fade.
    </p>
    <p>
      Customize <code>--ps-tooltip-background</code>, <code>--ps-tooltip-ink</code> and
      <code>--ps-tooltip-border</code>. Defaults invert the text and surface colors for clear
      separation in light and dark themes.
    </p>
  </Section>
</WebsitePage>
