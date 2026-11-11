<script lang="ts">
  import { HeadingSection, Section } from '@page-sections/svelte';

  import { base } from '$app/paths';
  import ContentPage from '$lib/WebsitePage.svelte';
</script>

<ContentPage page={{ title: 'About Page Sections' }} showContentMenu>
  <HeadingSection
    section={{
      id: 'page-heading',
      title: 'About Page Sections',
      introduction:
        'A shared foundation for content, from a personal website to spatial experiences.',
      headingLevel: 1,
      headingSize: 'l'
    }}
  />
  <Section
    section={{
      id: 'motivation',
      title: 'Motivation',
      headline: 'Build the content once. Let it grow.',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        Page Sections grew out of my work on Spatial Elements and my own website. Both needed the
        same foundations: readable content, responsive layouts and reusable sections, with a
        consistent design across screen sizes.
      </p>
      <p>
        I extracted that foundation into an independent library. It keeps content in ordinary HTML
        or serializable data, works without a spatial rendering engine and leaves room for richer
        experiences later. This website uses the same components it documents.
      </p>
      <p>
        My aim is to spend less time rebuilding page layouts and more time on the content and ideas
        they present. You can <a href={base + '/getting-started/'}>try the package</a>, explore its
        source on <a href="https://github.com/LauridBergjohann/page-sections">GitHub</a>, or visit
        <a href="https://bergjohann.com">my personal website</a>.
      </p>
    </div>
  </Section>
  <Section
    section={{
      id: 'impressum',
      title: 'Imprint',
      headline: 'Imprint / Impressum',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose">
      <p>Publisher and contact for this Page Sections website:</p>
      <address>
        Laurid Bergjohann<br />Geschwister-Scholl-Straße 6<br />42897 Remscheid<br />Germany
      </address>
      <p>Email: <a href="mailto:info@bergjohann.com">info@bergjohann.com</a></p>
      <p>Responsible for editorial content: Laurid Bergjohann, at the address above.</p>
    </div>
  </Section>
  <Section
    section={{
      id: 'datenschutz',
      title: 'Privacy',
      headline: 'Privacy / Datenschutz',
      background: { color: 'standard', size: 'standard' }
    }}
  >
    <div class="prose">
      <p>
        This notice describes processing on this documentation website. The controller is Laurid
        Bergjohann; contact details are in the <a href="#impressum">imprint above</a>.
      </p>
      <h3>Hosting</h3>
      <p>
        The website is hosted by Vercel Inc., USA. Delivering pages and protecting the service can
        involve processing your IP address, requested URL, request time, browser and device
        information, and technical logs. The purpose is reliable and secure operation, based on the
        legitimate interest in providing this website (Article 6(1)(f) GDPR).
      </p>
      <p>
        Vercel may process data outside the EU, including in the USA. Its <a
          href="https://vercel.com/legal/dpa">data processing addendum</a
        >
        describes the applicable transfer safeguards. See also
        <a href="https://vercel.com/legal/privacy-notice">Vercel's privacy notice</a>. Technical
        data is retained for operational and security purposes and applicable legal obligations; the
        duration depends on the provider's service and logging configuration.
      </p>
      <h3>Local preferences and search</h3>
      <p>
        Your light/dark choice is saved in your browser's local storage under <code
          >page-sections-theme</code
        > until you clear the site's browser data. It is used only to restore your chosen appearance.
        Search queries are processed in your browser against the documentation index; there is no search
        service receiving them. Playground settings are held in page memory.
      </p>
      <p>
        The application includes no analytics or advertising services and sets no tracking cookies.
        Saving the appearance you request serves that preference, not tracking.
      </p>
      <h3>External media and links</h3>
      <p>
        The component showcase includes a video from Mozilla's MDN media host. Loading that video
        can send your IP address and request information to the host, even before playback when
        metadata is fetched. It is used to demonstrate the video component (Article 6(1)(f) GDPR).
        See <a href="https://www.mozilla.org/privacy/websites/">Mozilla's website privacy notice</a
        >. Other external links, such as GitHub, lead to services with their own privacy notices.
      </p>
      <h3>Email contact</h3>
      <p>
        If you email me, I use your message and contact details to respond. The basis is Article
        6(1)(f) GDPR for general enquiries, or Article 6(1)(b) for contractual enquiries. Messages
        are deleted when no longer needed, unless legal retention duties apply.
      </p>
      <h3>Your rights</h3>
      <p>
        Under the applicable GDPR conditions, you may request access, correction, deletion,
        restriction and data portability, and object to processing based on legitimate interests.
        You can also complain to a data protection supervisory authority, including the <a
          href="https://www.ldi.nrw.de/">authority in North Rhine-Westphalia</a
        >. Contact me using the email above to exercise your rights.
      </p>
      <p>
        Last updated: November 2026. This notice will be updated when the website's processing
        changes.
      </p>
    </div>
  </Section>
</ContentPage>
