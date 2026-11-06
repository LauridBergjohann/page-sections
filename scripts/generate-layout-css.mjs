import { readFileSync, writeFileSync } from 'node:fs';
const tokens = JSON.parse(readFileSync(new URL('../packages/core/src/layoutTokens.json', import.meta.url), 'utf8'));
const destination = new URL('../packages/svelte/src/layout.generated.css', import.meta.url);
const properties = { columns: ['columns', ''], gap: ['gap', 'px'], headlineSize: ['headline-size', 'px'], headlineLineHeight: ['headline-line-height', 'px'], bodySize: ['body-size', 'px'], bodyLineHeight: ['body-line-height', 'px'], headlineGap: ['headline-gap', 'px'] };
const rules = (name, grid) => `.ps-grid-scope {\n${Object.entries(properties).map(([key, [property, unit]]) => `  --ps-grid-${property}: var(--ps-${name}-${property}, ${grid[key]}${unit});`).join('\n')}\n}\n.ps-content-block { --ps-content-block-span: var(--ps-content-block-span-${name}); }`;
const css = [
  '/* Generated from core layoutTokens.json; extracted from Beta.8. Do not edit. */',
  `.ps-content-width { width: min(100%, var(--ps-content-max, ${tokens.contentMax}px)); margin-inline: auto; }`,
  '.ps-content-container { container: ps-content / inline-size; min-width: 0; }',
  `@media (min-width: ${tokens.layoutMinWidths.xl}px) { .ps-content-width { width: min(var(--ps-content-max, ${tokens.contentMax}px), max(0px, calc(100% - ${tokens.xlContentInset * 2}px))); } }`,
  `@media (min-width: ${tokens.layoutMinWidths['2xl']}px) { .ps-content-width { width: min(100%, var(--ps-content-max, ${tokens.contentMax}px)); } }`,
  ...Object.entries(tokens.grid).map(([name, grid]) => grid.minWidth ? `@container ps-content (min-width: ${grid.minWidth}px) {\n${rules(name, grid)}\n}` : rules(name, grid)),
  '.ps-section-surface { border-radius: var(--ps-section-top-radius, 0px) var(--ps-section-top-radius, 0px) var(--ps-section-bottom-radius, 0px) var(--ps-section-bottom-radius, 0px); }'
].join('\n\n') + '\n';
if (process.argv.includes('--check')) { if (readFileSync(destination, 'utf8') !== css) throw new Error('Run npm run layout:generate.'); }
else writeFileSync(destination, css);
