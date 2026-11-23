<script module lang="ts">
  export const examples = [
    {
      language: 'svelte',
      code: "<script>\n  import { PrimaryButton, SecondaryButton } from '@page-sections/svelte';\n<\/script>\n<PrimaryButton href=\"/getting-started/\">Get started</PrimaryButton>\n<SecondaryButton onclick={() => alert('Saved')}>Save draft</SecondaryButton>"
    }
  ];
</script>

<script lang="ts">
  import { base } from '#lib/paths.js';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';
  import WebsitePage from '#lib/WebsitePage.svelte';
  import AtomicPreview from '#lib/AtomicPreview.svelte';
</script>

<WebsitePage page={{ title: 'Buttons', pageTitle: 'Buttons · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Buttons',
      introduction: 'Use primary, secondary and icon actions with the same native HTML behavior.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'choose',
      title: 'Choose an action',
      headline: 'Choose an action',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        <strong>PrimaryButton</strong> highlights the main action. <strong>SecondaryButton</strong>
        offers an alternative. <strong>IconButton</strong> is a compact control with an accessible text
        label. A supplied href renders a link; without href these components render a native button. The
        button type defaults to button, so an incidental click does not submit a form.
      </p>
      <p>
        Use <a href={base + '/docs/components/button-group/'}>ButtonGroup</a> for a set of related
        choices, and <a href={base + '/docs/components/popup/'}>Popup</a> when a control reveals a panel.
      </p>
    </div>
  </Section><Section
    section={{
      id: 'try-it-yourself',
      title: 'Try it yourself',
      headline: 'Try it yourself',
      background: { color: 'standard' }
    }}
  >
    <div class="prose"><AtomicPreview kind="buttons" /></div>
  </Section><Section
    section={{
      id: 'props',
      title: 'ButtonProps and IconButtonProps',
      headline: 'ButtonProps and IconButtonProps',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        <code>ButtonProps</code> is the shared object accepted by PrimaryButton and SecondaryButton.
        <code>IconButtonProps</code> adds the required label. These types are exported from the package
        root.
      </p>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing property tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Button properties">
        <table>
          <thead><tr><th>Field</th><th>Type / default</th><th>Purpose</th></tr></thead><tbody>
            <tr>
              <td>children</td><td>Svelte Snippet</td><td>Visible text or icon markup.</td>
            </tr><tr>
              <td>href</td><td>string, optional</td><td>
                A safe link destination; omit for a button.
              </td>
            </tr><tr>
              <td>label</td><td>string, required for IconButton</td><td>
                Accessible name and default tooltip; translate this in your application.
              </td>
            </tr><tr>
              <td>active</td><td>boolean, false</td><td>
                Accent text and selection background. Pair with aria-expanded or aria-pressed
                according to the interaction.
              </td>
            </tr><tr>
              <td>disabled</td><td>boolean, false</td><td>
                Disables activation, including for links.
              </td>
            </tr><tr>
              <td>borderless</td><td>boolean, false</td><td>
                Hides the control edge; used for header tools.
              </td>
            </tr><tr>
              <td>element</td><td>HTMLButtonElement | HTMLAnchorElement, bindable</td><td>
                The actual DOM node for focus or a popup anchor.
              </td>
            </tr><tr>
              <td>target / rel</td><td>string, optional</td><td>
                Link attributes. A new tab defaults to noopener noreferrer.
              </td>
            </tr><tr>
              <td>type</td><td>button | submit | reset; button</td><td>Native button type.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Native HTML attributes and handlers, including class, style, onclick, aria-*, form, name and
        value, are forwarded. Disabled links leave the tab order. Focus remains visible;
        reduced-motion preferences disable color transitions.
      </p>
    </div>
  </Section><Section
    section={{
      id: 'example',
      title: 'Use buttons in your own content',
      headline: 'Use buttons in your own content',
      background: { color: 'standard' }
    }}
  >
    <div class="prose"><CodeBlock language="svelte" code={examples[0].code} /></div>
  </Section>
</WebsitePage>
