<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
  const steps = [
    { href: '/getting-started/installation/', title: 'Install the package' },
    { href: '/getting-started/first-page/', title: 'Build your first page' },
    { href: '/getting-started/pages-and-sections/', title: 'Understand the building blocks' }
  ];
</script>

{@render children()}
{#if page.url.pathname !== base + '/getting-started/'}
  <nav class="learning-path" aria-label="Getting started steps">
    <a href={base + '/getting-started/'}>Getting started</a>
    <ol>
      {#each steps as step}
        <li>
          <a
            href={base + step.href}
            aria-current={page.url.pathname === base + step.href ? 'page' : undefined}
            >{step.title}</a
          >
        </li>
      {/each}
    </ol>
    <a href={base + '/docs/'}>Continue to the documentation →</a>
  </nav>
{/if}

<style>
  .learning-path {
    max-width: 68ch;
    margin: 2rem auto;
    padding: 1.5rem;
    border-top: 1px solid var(--ps-border);
    line-height: 1.8;
  }
  a {
    color: var(--ps-accent);
    text-underline-offset: 0.2em;
  }
  [aria-current='page'] {
    color: var(--ps-ink);
    font-weight: 650;
  }
</style>
