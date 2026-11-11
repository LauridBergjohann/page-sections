import { readFileSync, writeFileSync } from 'node:fs';
const tokens = JSON.parse(readFileSync(new URL('../packages/core/src/layoutTokens.json', import.meta.url), 'utf8'));
const destination = new URL('../packages/svelte/src/layout.generated.css', import.meta.url);
const properties = { columns: ['columns', ''], gap: ['gap', 'px'], headlineSize: ['headline-size', 'px'], headlineLineHeight: ['headline-line-height', 'px'], bodySize: ['body-size', 'px'], bodyLineHeight: ['body-line-height', 'px'], headlineGap: ['headline-gap', 'px'] };
const rules = (name, grid) => `.ps-grid-scope {\n${Object.entries(properties).map(([key, [property, unit]]) => `  --ps-grid-${property}: ${grid[key]}${unit};`).join('\n')}\n  --ps-card-large-span: ${name === 's' ? tokens.cards.l.gridSSpan : tokens.cards.l.span};\n}\n.ps-content-block { --ps-content-block-span: var(--ps-content-block-span-${name}); }`;
const css = [
  '/* Generated from core layoutTokens.json; extracted from Beta.8. Do not edit. */',
  `:root { --ps-content-max: ${tokens.contentMax}px; --ps-menu-height: ${tokens.menu.height}px; --ps-menu-top: 0px; --ps-nav-height: ${tokens.menu.height}px; --ps-sticky-range: ${tokens.menu.scrollThreshold}px; --ps-satellite-width: ${tokens.satellite.width}px; --ps-satellite-height: ${tokens.satellite.height}px; --ps-satellite-inset: ${tokens.satellite.inset}px; --ps-satellite-top: ${tokens.satellite.top}px; }`,
  `.ps-content-width { width: min(100%, ${tokens.contentMax}px); margin-inline: auto; }`,
  `:root { --ps-sidebar-gap: ${tokens.sidebars.gap}px; --ps-sidebar-sticky-top: ${tokens.sidebars.stickyTop}px; --ps-content-menu-offset: ${tokens.sidebars.contentMenuOffset}px; }
.ps-page-frame { display: grid; grid-template-columns: max(0px, calc((100% - ${tokens.contentMax}px) / 2)) minmax(0, 1fr) max(0px, calc((100% - ${tokens.contentMax}px) / 2)); }
@media (min-width: ${tokens.layoutMinWidths.xl}px) {
  .ps-page-frame { --ps-frame-left: ${tokens.xlContentInset}px; --ps-frame-right: ${tokens.xlContentInset}px; --ps-sidebar-left-width: ${tokens.sidebars.xl.leftWidth}px; --ps-sidebar-right-width: ${tokens.sidebars.xl.rightWidth}px; grid-template-columns: var(--ps-frame-left) minmax(0, 1fr) var(--ps-frame-right); }
  .ps-page-frame:has(> .ps-left-sidebar) { --ps-frame-left: ${tokens.sidebars.xl.outer + tokens.sidebars.xl.leftWidth + tokens.sidebars.gap}px; }
  .ps-page-frame:has(> .ps-content-menu-slot) { --ps-frame-right: ${tokens.sidebars.xl.outer + tokens.sidebars.xl.rightWidth}px; }
}
@media (min-width: ${tokens.layoutMinWidths['2xl']}px) {
  .ps-page-frame { --ps-frame-left: max(0px, calc((100% - ${tokens.contentMax}px) / 2)); --ps-frame-right: max(0px, calc((100% - ${tokens.contentMax}px) / 2)); --ps-sidebar-left-width: ${tokens.sidebars.wide.leftWidth}px; --ps-sidebar-right-width: ${tokens.sidebars.wide.rightWidth}px; }
  .ps-page-frame:has(> .ps-left-sidebar) { --ps-frame-left: max(${tokens.sidebars.wide.outer + tokens.sidebars.wide.leftWidth + tokens.sidebars.gap}px, calc((100% - ${tokens.contentMax}px) / 2)); }
  .ps-page-frame:has(> .ps-content-menu-slot) { --ps-frame-right: max(${tokens.sidebars.wide.outer + tokens.sidebars.wide.rightWidth}px, calc((100% - ${tokens.contentMax}px) / 2)); }
}
@media (min-width: ${tokens.layoutMinWidths['3xl']}px) {
  .ps-page-frame:has(> .ps-left-sidebar) { --ps-frame-left: calc((100% - ${tokens.contentMax}px) / 2); }
  .ps-page-frame:has(> .ps-content-menu-slot) { --ps-frame-right: calc((100% - ${tokens.contentMax}px) / 2); }
}`,
  '.ps-content-container { container: ps-content / inline-size; min-width: 0; }',
  `@media (min-width: ${tokens.layoutMinWidths.xl}px) { :root { --ps-menu-height: ${tokens.menu.wideHeight}px; --ps-menu-top: ${tokens.menu.wideTop}px; --ps-nav-height: ${tokens.menu.wideHeight + tokens.menu.wideTop}px; } .ps-content-width { width: min(${tokens.contentMax}px, max(0px, calc(100% - ${tokens.xlContentInset * 2}px))); } }`,
  `@media (min-width: ${tokens.layoutMinWidths['2xl']}px) { .ps-content-width { width: min(100%, ${tokens.contentMax}px); } }`,
  ...Object.entries(tokens.breadcrumb).map(([name, value]) => {
    const rule = `:root { --ps-breadcrumb-font-size: ${value.fontSize}px; --ps-breadcrumb-height: ${value.height}px; }`;
    return tokens.layoutMinWidths[name] ? `@media (min-width: ${tokens.layoutMinWidths[name]}px) { ${rule} }` : rule;
  }),
  ...Object.entries(tokens.grid).map(([name, grid]) => grid.minWidth ? `@container ps-content (min-width: ${grid.minWidth}px) {\n${rules(name, grid)}\n}` : rules(name, grid)),
  ...Object.entries(tokens.cards).map(([name, card]) => `[data-ps-card-size='${name}'] { --ps-card-span: ${name === 'l' ? 'var(--ps-card-large-span)' : card.span}; --ps-card-title-size: ${card.titleSize}px; --ps-card-title-weight: ${card.titleWeight}; --ps-card-eyebrow-size: ${card.eyebrowSize}px; --ps-card-eyebrow-weight: ${card.eyebrowWeight}; --ps-card-line-height: ${card.lineHeight}px; --ps-card-text-rows: ${card.rows}; }`),
  `:root { --ps-card-text-inset-inline: ${tokens.cardTextInset.inline}px; --ps-card-text-inset-block: ${tokens.cardTextInset.block}px; --ps-card-media-inset: ${tokens.cardMediaInset}px; }`,
  ...Object.entries({ none: 0, tight: .5, normal: 1, loose: 2, spacious: 4 }).map(([name, factor]) => `[data-spacing='${name}'] { --ps-spacing-factor: ${factor}; }`),
  '.ps-section-surface { border-radius: var(--ps-section-top-radius, 0px) var(--ps-section-top-radius, 0px) var(--ps-section-bottom-radius, 0px) var(--ps-section-bottom-radius, 0px); }'
].join('\n\n') + '\n';
if (process.argv.includes('--check')) { if (readFileSync(destination, 'utf8').replaceAll('\r\n', '\n') !== css) throw new Error('Run npm run layout:generate.'); }
else writeFileSync(destination, css);
