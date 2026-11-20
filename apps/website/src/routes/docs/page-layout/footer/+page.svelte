<script module lang="ts">
  export const examples = [
    {
      language: 'svelte',
      code: `<script lang="ts">
  import { PageShell, Header, ContentPage, Footer } from '@page-sections/svelte';
  const links = [{ label: 'Privacy', href: '/privacy/' }];
<\/script>

{#snippet socialIcon()}
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M4 4h16v12H8l-4 4V4Z" />
  </svg>
{/snippet}
<PageShell mode="light" theme={{ footerBackground: '#163570', footerInk: '#fff' }}>
  <Header items={[{ id: 'home', label: 'Home', href: '/' }]}>
    {#snippet brand()}<a href="/">My Website</a>{/snippet}
  </Header>
  <ContentPage page={{ title: 'Welcome' }}><p>Page content</p></ContentPage>
  <Footer
    footnote="© 2026 My Website"
    {links}
    social={[{ label: 'Community', href: '/community/', icon: socialIcon }]}
    menu={[{ label: 'Explore', href: '/explore/', links: [
      { label: 'About', href: '/about/' },
      { label: 'Contact', href: '/contact/' }
    ] }]}
  >
    {#snippet brand()}
      <a href="/">My Website</a>
      <p>A short description of the website.</p>
    {/snippet}
  </Footer>
</PageShell>`
    },
    {
      language: 'svelte',
      code: `<script>
  import { Footer } from '@page-sections/svelte';
<\/script>

<Footer links={[{ label: 'Privacy', href: '/privacy/' }]}>
  {#snippet footnote()}<span>© 2026 <a href="/">My Website</a></span>{/snippet}
</Footer>`
    }
  ];
</script>

<script lang="ts">
  import { Footer, HeadingSection, Section, CodeBlock } from '@page-sections/svelte';
  import { base } from '$app/paths';
  import WebsitePage from '$lib/WebsitePage.svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<WebsitePage page={{ title: 'Footer', pageTitle: 'Footer · Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'Footer',
      headingLevel: 1,
      headingSize: 'l',
      introduction: 'A site-level building block alongside Header and ContentPage.',
      background: { color: 'standard', size: 'standard' }
    }}
  />
  <Section
    section={{
      id: 'composition',
      title: 'Site-level composition',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Place Footer after ContentPage inside PageShell to share the site theme. It renders a native
        footer landmark, needs no JavaScript for navigation and works without a SvelteKit host. The
        footer at the bottom of this website is a live example.
      </p>
      <CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
    </div>
  </Section>
  <Section
    section={{
      id: 'regions',
      title: 'Five regions',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose">
      <ul>
        <li><code>brand?: Snippet</code>: your logo, home link and short description.</li>
        <li>
          <code
            >social?: readonly <a href={base + '/docs/reference/types/#footer-social-link'}
              >FooterSocialLink</a
            >[]</code
          >: each entry requires <code>label</code>,
          <code>href</code>
          and an <code>icon: Snippet</code>. Icons are decorative; the visible label names the link.
          Supply icons from your own library.
        </li>
        <li>
          <code
            >menu?: readonly <a href={base + '/docs/reference/types/#footer-menu-group'}
              >FooterMenuGroup</a
            >[]</code
          >: at most four groups, each with a label, optional href and any number of links. Each
          link needs label and href. More than four groups throws an error instead of silently
          hiding content.
        </li>
        <li><code>footnote: string | Snippet</code>: required copyright or other short text.</li>
        <li>
          <code
            >links: readonly <a href={base + '/docs/reference/types/#footer-link'}>FooterLink</a
            >[]</code
          >: required list of important links, available at every viewport size.
        </li>
      </ul>
      <p>
        Empty optional arrays behave like omitted props. Customize navigation landmark names with <code
          >socialLabel</code
        >
        (Social media), <code>menuLabel</code> (Footer navigation) and <code>linksLabel</code> (Important
        links). Standard HTML attributes such as id, class and lang are forwarded to the footer. Links
        use the shared safeHref policy.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'responsive-layout',
      title: 'Responsive layout',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        The main box always keeps at least 8px outer gutters on both sides, up to a maximum width of
        1536px. It uses 136px insets at XL (1600–1808px), and stays centered from 2XL. The bottom
        bar spans the viewport, with its footnote and links aligned to the main box, inset 8px from
        its left and right edges respectively at every breakpoint. The main grid has 24px top and
        bottom padding; horizontal padding follows the content-grid gap.
      </p>
      <p>
        Brand and social stack on XS–M and sit beside each other on L, where social links start at
        the top right and fill toward the left. From XL, they occupy four of the twelve content-grid
        columns; the menu uses the remaining eight, two per group. The menu is hidden below XL.
        Essential links therefore belong in the bottom bar. Longer footnotes and link lists wrap
        naturally.
      </p>
      <p>
        Without brand, social or menu, only the bottom bar remains, at least 40px high. A menu-only
        footer also collapses to this bar below XL. Above the bar, its background starts 40px below
        the top of the main box.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'minimal-footer',
      title: 'Only the bottom bar',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose"><CodeBlock {...examples[1]} highlighted={data.highlights[1]} /></div>
    <div class="footer-preview">
      <Footer
        footnote="© 2026 Page Sections"
        links={[
          { label: 'Imprint', href: base + '/about/#impressum' },
          { label: 'Privacy', href: base + '/about/#datenschutz' }
        ]}
      />
    </div>
  </Section>
  <Section
    section={{
      id: 'theme',
      title: 'Footer theme',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Set these optional CSS strings through PageShell.theme or the corresponding variables on a
        footer ancestor. The default main box is blue with white text; the bottom bar follows the
        current theme's muted surface and body text, including dark mode.
      </p>
      <ul>
        <li>
          <code>footerBackground</code> → <code>--ps-footer-background</code> (default #163570).
        </li>
        <li><code>footerInk</code> → <code>--ps-footer-ink</code> (default #fff).</li>
        <li>
          <code>footerRadius</code> → <code>--ps-footer-radius</code> (falls back to --ps-radius).
        </li>
        <li>
          <code>footerShadow</code> → <code>--ps-footer-shadow</code> (falls back to --ps-surface-shadow;
          use none to disable).
        </li>
        <li>
          <code>footerBarBackground</code> → <code>--ps-footer-bar-background</code> (falls back to --ps-section-muted).
        </li>
        <li>
          <code>footerBarInk</code> → <code>--ps-footer-bar-ink</code> (falls back to --ps-body).
        </li>
      </ul>
      <p>
        Bottom-bar separators inherit the text color at 30% opacity. Footer links and their focus
        outlines inherit the relevant region's text color. See the <a
          href={base + '/docs/foundations/themes/'}>complete theme mapping</a
        >.
      </p>
    </div>
  </Section>
</WebsitePage>

<style>
  .footer-preview {
    margin-top: 24px;
  }
</style>
