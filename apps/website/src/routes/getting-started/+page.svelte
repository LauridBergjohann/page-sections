<script lang="ts">
  import { base } from '$app/paths';
  import { ContentPage, Section } from '@page-sections/svelte';
</script>

<ContentPage
  page={{
    title: 'Getting started',
    intro: 'Start with one package and one page. You only need a Svelte 5 or SvelteKit application.'
  }}
>
  <Section section={{ id: 'start', title: 'Start here', headline: 'Three small steps' }}>
    <div class="prose">
      <p>
        New to Page Sections? Follow these three steps in order. Start with the Svelte package; you
        can explore the layout options and data models after your first page is running.
      </p>
      <ol>
        <li>
          <a href={base + '/getting-started/installation/'}>Install the package</a> in a Svelte 5 or SvelteKit
          application.
        </li>
        <li>
          <a href={base + '/getting-started/first-page/'}>Build your first page</a> with ordinary HTML
          and a collection.
        </li>
        <li>
          <a href={base + '/getting-started/pages-and-sections/'}
            >Understand pages, sections and grids</a
          > before adding more content.
        </li>
      </ol>
      <p>
        The <a href="https://github.com/LauridBergjohann/page-sections/tree/main/apps/demo"
          >minimal demo</a
        > is a complete application with a single page. Copy it as a starting point.
      </p>
    </div>
  </Section>
</ContentPage>
