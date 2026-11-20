<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { safeHref, type FooterLink, type FooterMenuGroup } from '@page-sections/core';
  import type { FooterSocialLink } from './footer.js';
  import './styles.css';

  type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    brand?: Snippet;
    social?: readonly FooterSocialLink[];
    /** At most four groups. More groups throw rather than silently dropping links. */
    menu?: readonly FooterMenuGroup[];
    footnote: string | Snippet;
    links: readonly FooterLink[];
    socialLabel?: string;
    menuLabel?: string;
    linksLabel?: string;
  };
  let {
    brand, social = [], menu = [], footnote, links,
    socialLabel = 'Social media', menuLabel = 'Footer navigation', linksLabel = 'Important links',
    class: className = '', ...rest
  }: Props = $props();
  const groups = $derived.by(() => {
    if (menu.length > 4) throw new Error('Footer supports at most four menu groups.');
    return menu;
  });
  const hasIdentity = $derived(Boolean(brand || social.length));
</script>

<footer {...rest} class={['ps-footer', className].filter(Boolean).join(' ')} data-has-identity={hasIdentity} data-has-menu={groups.length > 0}>
  {#if hasIdentity || groups.length}
    <div class="ps-footer-main ps-content-width ps-content-container">
      <div class="ps-footer-grid ps-grid-scope">
        {#if hasIdentity}
          <div class="ps-footer-identity">
            {#if brand}<div class="ps-footer-brand">{@render brand()}</div>{/if}
            {#if social.length}
              <nav class="ps-footer-social" aria-label={socialLabel}>
                <ul>
                  {#each social as item}
                    <li><a href={safeHref(item.href)}><span class="ps-footer-icon" aria-hidden="true">{@render item.icon()}</span><span>{item.label}</span></a></li>
                  {/each}
                </ul>
              </nav>
            {/if}
          </div>
        {/if}
        {#if groups.length}
          <nav class="ps-footer-menu" aria-label={menuLabel}>
            {#each groups as group}
              <div class="ps-footer-group">
                <div class="ps-footer-group-label">
                  {#if safeHref(group.href)}<a href={safeHref(group.href)}>{group.label}</a>{:else}{group.label}{/if}
                </div>
                <ul>{#each group.links as item}<li><a href={safeHref(item.href)}>{item.label}</a></li>{/each}</ul>
              </div>
            {/each}
          </nav>
        {/if}
      </div>
    </div>
  {/if}
  <div class="ps-footer-bar">
    <div class="ps-footer-bar-content ps-content-width">
      <div class="ps-footer-footnote">{#if typeof footnote === 'string'}{footnote}{:else}{@render footnote()}{/if}</div>
      <nav class="ps-footer-links" aria-label={linksLabel}>
        <ul>{#each links as item}<li><a href={safeHref(item.href)}>{item.label}</a></li>{/each}</ul>
      </nav>
    </div>
  </div>
</footer>

<style>
  .ps-footer { font-family: var(--ps-font-family); font-size: 0.875rem; line-height: 1.5; overflow-wrap: anywhere; }
  .ps-footer, .ps-footer :global(*) { box-sizing: border-box; }
  .ps-footer-main, .ps-footer-bar-content { max-width: calc(100% - 16px); }
  .ps-footer[data-has-identity='true'] { background: linear-gradient(to bottom, transparent 40px, var(--ps-footer-bar-background, var(--ps-section-muted)) 40px); }
  .ps-footer-main { background: var(--ps-footer-background, #163570); color: var(--ps-footer-ink, #fff); border-radius: var(--ps-footer-radius, var(--ps-radius)); box-shadow: var(--ps-footer-shadow, var(--ps-surface-shadow)); }
  .ps-footer-grid { display: grid; grid-template-columns: repeat(var(--ps-grid-columns), minmax(0, 1fr)); gap: var(--ps-grid-gap); padding: 24px var(--ps-grid-gap); }
  .ps-footer-identity { grid-column: 1 / -1; display: grid; gap: 20px; min-width: 0; align-content: start; }
  .ps-footer-brand :global(> :first-child) { margin-top: 0; }
  .ps-footer-brand :global(> :last-child) { margin-bottom: 0; }
  :where(.ps-footer) :global(:where(a)) { color: inherit; text-decoration: none; text-underline-offset: 0.2em; }
  :where(.ps-footer) :global(a:hover) { text-decoration: underline; }
  :where(.ps-footer) :global(a:focus-visible) { outline: 2px solid currentColor; outline-offset: 4px; }
  ul { list-style: none; padding: 0; margin: 0; }
  .ps-footer-social ul { display: grid; width: calc(100% + 12px); grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px 0; }
  .ps-footer-social a { display: flex; align-items: center; gap: 8px; min-height: 28px; }
  .ps-footer-icon { display: inline-flex; flex: 0 0 24px; align-items: center; justify-content: center; }
  .ps-footer-icon :global(svg), .ps-footer-icon :global(img) { width: 24px; height: 24px; }
  .ps-footer-menu { display: none; }
  .ps-footer-group { min-width: 0; }
  .ps-footer-group-label { font-weight: 600; margin-bottom: 16px; }
  .ps-footer-group li + li { margin-top: 4px; }
  .ps-footer-bar { background: var(--ps-footer-bar-background, var(--ps-section-muted)); color: var(--ps-footer-bar-ink, var(--ps-body)); }
  .ps-footer-bar-content { min-height: 40px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 24px; padding-block: 8px; }
  .ps-footer-footnote { min-width: 0; padding-inline-start: 8px; }
  .ps-footer-footnote :global(p) { margin: 0; }
  .ps-footer-links { margin-inline-start: auto; min-width: 0; padding-inline-end: 8px; }
  .ps-footer-links ul { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 4px 0; }
  .ps-footer-links li { display: flex; align-items: center; }
  .ps-footer-links li + li::before { content: ''; height: 1em; border-inline-start: 1px solid currentColor; opacity: 0.3; margin-inline: 8px; }
  @media (max-width: 359.98px) {
    .ps-footer-social ul { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 1599.98px) {
    .ps-footer[data-has-identity='false'] .ps-footer-main { display: none; }
  }
  @media (min-width: 1200px) and (max-width: 1599.98px) {
    .ps-footer-identity { grid-template-columns: subgrid; column-gap: var(--ps-grid-gap); align-items: start; }
    .ps-footer-brand { grid-column: span calc(var(--ps-grid-columns) / 2); }
    .ps-footer-social { grid-column: calc(var(--ps-grid-columns) / 2 + 1) / -1; align-self: start; }
    .ps-footer-social:first-child { grid-column: 1 / -1; }
    .ps-footer-social ul { direction: rtl; margin-left: -12px; }
    .ps-footer-social li { direction: ltr; }
    .ps-footer-social a { justify-content: flex-end; }
  }
  @media (min-width: 1600px) {
    .ps-footer[data-has-menu='true'] { background: linear-gradient(to bottom, transparent 40px, var(--ps-footer-bar-background, var(--ps-section-muted)) 40px); }
    .ps-footer-identity { grid-column: span 4; }
    .ps-footer-social ul { width: calc(100% + var(--ps-grid-gap)); grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .ps-footer-social li:nth-child(3n + 1) { grid-column: 1; }
    .ps-footer-menu { display: grid; grid-column: 5 / -1; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--ps-grid-gap); }
    .ps-footer-menu:first-child { grid-column: 1 / -1; }
  }
</style>
