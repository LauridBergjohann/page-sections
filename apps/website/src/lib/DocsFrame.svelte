<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { chapterGroups, documents } from './catalog';
  let { children }: { children: Snippet } = $props();
  let expanded = $state(true);
  onMount(() => {
    const desktop = matchMedia('(min-width: 1000px)');
    const update = () => {
      expanded = desktop.matches;
    };
    update();
    desktop.addEventListener('change', update);
    return () => desktop.removeEventListener('change', update);
  });
</script>

<div class="docs-frame">
  <aside>
    <details bind:open={expanded}>
      <summary>Browse documentation</summary>
      <nav aria-label="Documentation chapters">
        <div class="chapters">
          {#each chapterGroups as group}
            {@const items = documents.filter((item) => item.group === group)}
            <p class="group-label">{group}</p>
            <ul>
              {#each [...new Set(items.map((item) => item.category))] as category}
                <li>
                  {#if category}<p class="category-label">{category}</p>{/if}
                  <ul class:subchapters={!!category}>
                    {#each items.filter((item) => item.category === category) as item}<li>
                        <a
                          href={base + item.href}
                          aria-current={page.url.pathname === base + item.href ? 'page' : undefined}
                          >{item.title}</a
                        >
                      </li>{/each}
                  </ul>
                </li>
              {/each}
            </ul>
          {/each}
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
  .category-label {
    margin: 0.8rem 0 0.2rem;
    padding-inline: 0.6rem;
    font-weight: 600;
  }
  .subchapters {
    margin-inline-start: 0.7rem;
    border-inline-start: 1px solid var(--ps-border);
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
      max-height: calc(100dvh - 8rem);
    }
  }
</style>
