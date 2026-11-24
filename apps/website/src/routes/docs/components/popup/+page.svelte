<script module lang="ts">
  export const examples = [
    {
      language: 'svelte',
      code: '<script>\n  import { IconButton, Popup } from \'@page-sections/svelte\';\n  import Settings from \'@lucide/svelte/icons/settings\';\n  let open = $state(false);\n  let anchor = $state();\n<\/script>\n<div style="position: relative; width: fit-content">\n  <IconButton label="Settings" bind:element={anchor} active={open}\n    aria-expanded={open} aria-controls="settings-example" onclick={() => open = !open}>\n    <Settings size={20} aria-hidden="true" />\n  </IconButton>\n  <Popup id="settings-example" title="Settings" closable bind:open {anchor}>\n    <p>Your settings controls go here.</p>\n  </Popup>\n</div>'
    }
  ];
</script>

<script lang="ts">
  import { base } from '#lib/paths.js';
  import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';
  import WebsitePage from '#lib/WebsitePage.svelte';
  import AtomicPreview from '#lib/AtomicPreview.svelte';
</script>

<WebsitePage page={{ title: 'Popup', pageTitle: 'Popup · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Popup',
      introduction: 'A shared surface, title and dismissal behavior for floating panels.',
      headingLevel: 1,
      headingSize: 'l',
      background: { color: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'behavior',
      title: 'One popup foundation',
      headline: 'One popup foundation',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Popup is the molecule used by header navigation, Settings, search suggestions and On this
        page. It shares panel borders, background, radius, shadow and title typography. Set
        <code>closable</code> to add the shared Lucide close button. The website enables it for
        floating panels except search, the titleless hamburger menu and hover-open main-menu
        submenus. Pass the heading through <code>title</code> so it shares a vertically centered row with
        the close button. Clicking outside, pressing Escape, scrolling the document or resizing closes
        a floating popup. Escape and the close button return focus to its anchor.
      </p>
      <p>
        Document-scroll dismissal is owned by Popup itself, including standalone compositions and
        browsers without native popovers. It closes without moving focus or scrolling back to the
        trigger. Scrolling inside the popup leaves it open; queued notifications without an actual
        change in document position are ignored. Inline content is unaffected.
      </p>
      <p>
        Native popovers place open surfaces above page content. One shared blur backdrop exists only
        while a popup is open or briefly fading out. The panel scales from its trigger over 360 ms
        and closes over 260 ms, without changing its final position. Only opacity and scale animate;
        the blur radius stays fixed. Reduced motion skips these animations. The page remains
        non-modal: a popup is neither a focus-trapped dialog nor an ARIA menu by default. Search and
        navigation provide their own correct semantics inside it.
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
    <div class="prose"><AtomicPreview kind="popup" /></div>
  </Section><Section
    section={{
      id: 'props',
      title: 'Popup properties',
      headline: 'Popup properties',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Overflowing property tables need keyboard scrolling.) -->
      <div class="table-scroll" tabindex="0" role="region" aria-label="Popup properties">
        <table>
          <thead><tr><th>Field</th><th>Type / default</th><th>Purpose</th></tr></thead><tbody>
            <tr>
              <td>title</td><td>string, optional</td><td>
                Shared heading and accessible label for the surface.
              </td>
            </tr><tr>
              <td>children</td><td>Svelte Snippet</td><td>
                Panel content; keep the appropriate navigation, list or form semantics.
              </td>
            </tr><tr>
              <td>open</td><td>boolean, bindable; true</td><td>
                Visibility. Bind it so outside dismissal also updates your trigger.
              </td>
            </tr><tr>
              <td>closable</td><td>boolean; false</td><td>
                Show a shared Lucide X button on floating surfaces. Inline content omits it.
              </td>
            </tr><tr>
              <td>closeLabel</td><td>string; Close popup</td><td>
                Accessible label for the close button; provide a localized label as needed.
              </td>
            </tr><tr>
              <td>placement</td><td>'default' | 'side'; default</td><td>
                Side placement uses the anchor, flips left/right and clamps to the viewport.
                Scrolling an anchor container closes native disclosures.
              </td>
            </tr><tr>
              <td>anchorPoint</td><td>Optional object with x and y numbers</td><td>
                Viewport coordinates within a large anchor, for example the clicked point on a long
                timeline bar. Used by side placement; focus still returns to the anchor or its
                closest focusable parent.
              </td>
            </tr><tr>
              <td>anchor</td><td>HTMLElement, optional</td><td>
                Excludes trigger clicks from outside dismissal and receives focus after Escape.
              </td>
            </tr><tr>
              <td>onclose</td><td>() =&gt; void, optional</td><td>
                Notifies the parent when dismissal occurs.
              </td>
            </tr><tr>
              <td>disclosure</td><td>boolean, false</td><td>
                For internal/native details composition: a direct parent details controls
                visibility; its summary is the trigger.
              </td>
            </tr><tr>
              <td>inline</td><td>boolean, false</td><td>
                Shares title typography in an existing panel without a new floating surface, border,
                blur or dismissal.
              </td>
            </tr><tr>
              <td>element</td><td>HTMLDivElement, bindable</td><td>
                Read the surface element for integration.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Native div attributes are forwarded, including id, class, style and aria-label for a popup
        without a title. Position the containing element relatively. By default the popup aligns to
        its right edge, 8px below it; a header popup aligns directly to the header. Geometry can be
        customized with class/style. The native top-layer enhancement clamps the floating surface
        within the viewport.
      </p>
    </div>
  </Section><Section
    section={{
      id: 'example',
      title: 'Connect a trigger',
      headline: 'Connect a trigger',
      background: { color: 'standard' }
    }}
  >
    <div class="prose"><CodeBlock language="svelte" code={examples[0].code} /></div>
  </Section><Section
    section={{
      id: 'theme',
      title: 'Theme the surface',
      headline: 'Theme the surface',
      background: { color: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Use <code>--ps-panel-border</code>, <code>--ps-radius</code>,
        <code>--ps-section-standard</code>
        and <a href={base + '/docs/reference/tokens/#shadows'}>the shared shadow controls</a>. A
        trigger uses the
        <a href={base + '/docs/components/buttons/#props'}>IconButton properties</a> active state and
        the shared selection color. The desktop On this page panel uses the same title typography while
        its surrounding sticky layout owns docking and scrolling.
      </p>
    </div>
  </Section>
</WebsitePage>
