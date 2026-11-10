<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { documents } from './catalog';
  let { children }: { children: Snippet } = $props();
  let query = $state('');
  let ready = $state(false);
  let expanded = $state(true);
  onMount(() => {
    ready = true;
    const desktop = matchMedia('(min-width: 1000px)');
    const update = () => {
      expanded = desktop.matches;
    };
    update();
    desktop.addEventListener('change', update);
    return () => desktop.removeEventListener('change', update);
  });
  const groups = ['Getting started', 'Guides', 'Reference'];
  const matches = $derived(
    documents.filter((item) =>
      `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase())
    )
  );
</script>

<div class="docs-frame">
  <aside>
    <details bind:open={expanded}>
      <summary>Browse documentation</summary>
      <nav aria-label="Documentation chapters">
        <label class="search"
          >Find a topic<input
            type="search"
            bind:value={query}
            disabled={!ready}
            placeholder="Cards, themes, SSR…"
          /></label
        >
        <div class="chapters">
          {#each groups as group}
            {@const items = matches.filter((item) => item.group === group)}
            {#if items.length}
              <p class="group-label">{group}</p>
              <ul>
                {#each items as item}<li>
                    <a
                      href={base + item.href}
                      aria-current={page.url.pathname === base + item.href ? 'page' : undefined}
                      >{item.title}</a
                    >
                  </li>{/each}
              </ul>
            {/if}
          {/each}
          {#if !matches.length}<p role="status">No matching topics.</p>{/if}
        </div>
      </nav>
    </details>
  </aside>
  <div class="doc-content">{@render children()}</div>
</div>

<style>
  .docs-frame {
    max-width: 1536px;
    margin-inline: auto;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }
  aside {
    padding: 1.5rem;
    border-bottom: 1px solid var(--ps-border);
  }
  nav {
    font-size: 0.875rem;
  }
  summary {
    cursor: pointer;
    padding-block: 0.5rem;
    font-weight: 600;
  }
  .search {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-weight: 600;
  }
  input {
    min-width: 0;
    width: 100%;
    font: inherit;
    padding: 0.65rem;
    border: 1px solid var(--ps-border);
    border-radius: 0.4rem;
    background: var(--ps-section-standard);
    color: var(--ps-ink);
  }
  .chapters {
    max-height: 14rem;
    overflow: auto;
    margin-top: 1rem;
  }
  .group-label {
    margin: 1.5rem 0 0.5rem;
    font-size: 0.75rem;
    font-weight: 650;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ps-body);
  }
  .group-label:first-child {
    margin-top: 0;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  a {
    display: block;
    color: var(--ps-ink);
    text-decoration: none;
    border-radius: 0.35rem;
    padding: 0.4rem 0.6rem;
  }
  a:hover {
    background: var(--ps-section-muted);
  }
  a[aria-current='page'] {
    background: var(--ps-section-muted);
    color: var(--ps-accent);
    font-weight: 650;
  }
  .doc-content {
    min-width: 0;
  }
  @media (min-width: 1000px) {
    summary {
      display: none;
    }
    .docs-frame {
      grid-template-columns: 245px minmax(0, 1fr);
    }
    aside {
      border-bottom: 0;
      border-inline-end: 1px solid var(--ps-border);
    }
    details {
      position: sticky;
      top: 6rem;
    }
    .chapters {
      max-height: calc(100vh - 13rem);
    }
  }
</style>
