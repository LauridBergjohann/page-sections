import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';
import { format, resolveConfig } from 'prettier';

// Generate field tables from the public source declarations, never from a second schema.
const root = resolve(import.meta.dirname, '..');
const core = resolve(root, 'packages/core/src/index.ts');
const extras = ['footer', 'card'].map(name => resolve(root, `packages/svelte/src/${name}.ts`));
const program = ts.createProgram([core, ...extras], {
  target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext, resolveJsonModule: true, skipLibCheck: true
});
const checker = program.getTypeChecker();
const symbols = [core, ...extras].flatMap(path => checker.getExportsOfModule(checker.getSymbolAtLocation(program.getSourceFile(path))));
const entries = symbols.flatMap(symbol => {
  const node = symbol.declarations?.find(node => ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node));
  return node ? [{ name: symbol.name, symbol, node }] : [];
}).sort((a, b) => a.name.localeCompare(b.name));
const names = new Set(entries.map(entry => entry.name));
const anchor = name => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('{', '&#123;').replaceAll('}', '&#125;');
const linked = value => escape(value).replace(/\b[A-Z]\w*\b/g, name => names.has(name) ? `<a href={base + '/docs/reference/types/#${anchor(name)}'}>${name}</a>` : name);
const descriptions = {
  FeatureIconTone: 'Icon-circle palette: standard and muted reuse section surfaces with accent icons; primary uses primary-button accent and on-accent colors. Muted is the default.',
  FeatureItem: 'A centered benefit with a required icon key, title and description. Optional href makes the whole feature a native link. itemKey distinguishes repeated occurrences. Unknown built-in icon keys fall back to layers; a custom icon snippet can render application keys.',
  FeatureSectionData: 'A centered feature collection. featureSize defaults to m and follows the CardGrid spans; every incomplete row is centered. iconTone defaults to muted and is independent of the section background.',
  TimelineDate: 'Strict UTC calendar date: YYYY, YYYY-MM or YYYY-MM-DD, years 0001?9999. Missing parts mean the start of that period; labels preserve input precision.',
  TimelineSectionData: 'Shared section metadata plus categories on a horizontal proportional date scale with a shared priority-ordered track pool, zoom, filters and category-local clusters. Direction defaults to ascending, axisPosition to bottom and stageWidth to contained. Full stage width also sets background.size to full while preserving its color, and is recommended only without side navigation. Initial scale is clamped to the full-timeline fit minimum. Open-ended periods use end, referenceDate, or the SSR render date reused during hydration.',
  TimelineCategory: 'A named, colored time strand. IDs must be unique. Icon is a built-in Lucide key or an application key resolved to a Lucide component by the optional Svelte icon snippet.',
  TimelineEvent: 'A point with date or a period with start and optional end. Event IDs must be unique within their category.',
  TimelineEventBase: 'Shared serializable event details. Optional label supplies a compact overview name; blank labels use title. Details retain the full title. An optional Lucide icon appears in the label. Optional image, rich description, tags and action appear only in the disclosure/popup.',
  TimelinePointEvent: 'A calendar milestone rendered as a circular marker.',
  TimelinePeriodEvent: 'A start-inclusive, end-exclusive interval rendered as a rounded bar. Omit end to mark it as ongoing.',
  ContentAction: 'A link styled as an action, used by HeroSection, panels and cards. Every action requires a visible label and a destination. It renders a native link, not a JavaScript callback.',
  SectionDefinition: 'Shared metadata for the base Section and every ready-made section. The ID is its anchor; title labels the region and navigation; headline controls its visible heading.',
  SectionBackground: 'The visual surface behind a section. Color and painted width are independent of the content layout. Gradient colors require a full background.',
  ContentPageData: 'Metadata for ContentPage, the main content container. A browser document title is distinct from the visible h1, which you supply as content.',
  PageData: 'A data-driven page: ContentPageData plus an array of section models. Pass sections to the plural Sections component explicitly; ContentPage does not render this array itself.',
  ImageData: 'One image and its optional variants. Supply your own assets; the library does not resize images or generate srcset files.',
  CardContentPlacement: 'below (default) adds copy under the media. overlay places copy over a gradient, forces cover and uses mediaAspect for the entire fixed card shape. Long copy scrolls within the card.',
  CardTextTone: 'Overlay copy colors, independent of the page theme: light (default) is white on a dark gradient; dark is dark text on a light gradient. Ignored in below mode.',
  CardItem: 'The content of a single card. A supplied description appears below its title. The main link covers the card; additional actions and footer links remain independent.',
  VideoData: 'A native HTML video source or a YouTube source. Captions are an array of objects: src is the track URL, language is its language code, and label is its visible name.',
  MenuItem: 'One site-navigation entry. Children use the same shape recursively. IDs must be unique in the tree. resolveNavigation derives current and active states from the current location.',
  Breadcrumb: 'One step in the current page’s site hierarchy. The label is required; the destination is optional. The final item represents the current page.',
  PageTheme: 'Optional CSS values applied to a shared ancestor. Include units for lengths, such as 12px for radius. Omitted properties retain inherited values or library defaults.',
  InlineText: 'Either a plain string or an array of InlineRun objects for inline formatting and links. Choose runs when one line contains differently formatted parts.',
  InlineRun: 'One inline text fragment. The type discriminator selects text, strong, emphasis, code, link or a line break. Each alternative below shows its own required fields.',
  RichTextBlock: 'One structured paragraph, address, list or panel. The type discriminator selects the variant. A panel can contain more blocks and link actions.',
  RichTextContentData: 'Exactly one content source: body with optional markdown/text format, or structured blocks. Fields typed never must be omitted in that variant. Markdown keeps raw HTML disabled.',
  RichTextSectionData: 'Shared section metadata combined with exactly one rich-text source. Use either body and optional format, or blocks; do not mix the two alternatives.',
  SectionData: 'The union of registered section models. The type field selects a renderer in the plural Sections component. Each variant inherits the shared section fields.',
  SectionTypeMap: 'Maps data discriminators to section models. Extend this interface through module augmentation when registering a custom data-driven section.',
  SectionNavigationItem: 'The fields needed for a section link: id for the destination, title for its label, and an optional heading level for hierarchy.',
  ContentSpan: 'A column count, or an object assigning counts to container sizes xs, s, m and l. For example, { xs: 4, s: 3 } spans four columns in the smallest grid and three from s onward.',
  FooterLink: 'A native link in the site footer. Both its visible label and destination are required.',
  FooterMenuGroup: 'A labeled group of footer links. The group heading can optionally have its own destination.',
  FooterSocialLink: 'A footer link with a caller-supplied icon snippet. Social links open in a new tab with noopener and noreferrer. Snippet is a Svelte fragment of markup, not serializable content data. Import this type from @page-sections/svelte.',
  CardElements: 'DOM parts passed to Card’s onready callback after mounting. T is your CardItem subtype. HTMLElement values are live browser elements used for measurement or enhancement, not serializable content data. Import from @page-sections/svelte.',
  CodeData: 'Plain source code and presentation options. Syntax highlighting is optional derived data, supplied separately as HighlightedCode.',
  HighlightedCode: 'Derived syntax highlighting. lines contains an array of CodeToken objects for each source line; plain code remains the source of truth.',
  CodeToken: 'One syntax token, including optional light and dark text colors and a font-style bit mask.',
  NavigationLocation: 'The current navigation location. Supply pathname for route matching or currentId to select an entry explicitly.',
  ResponsiveLayoutInput: 'Browser layout dimensions in CSS pixels, with optional reserved scrollbar width and safe-area insets.',
  LayoutInsets: 'Top, right, bottom and left insets in CSS pixels.',
  LayoutRect: 'A rectangle expressed as position and dimensions in CSS pixels.',
  SectionBackgroundDiagnostic: 'Explains a background request that was normalized, such as a gradient requested on a contained surface.',
  ResolvedSectionBackground: 'The effective color, size and CSS background returned by background normalization.',
};
const notes = {
  'ContentAction.label': 'Visible, descriptive link text, for example “Plan your visit”.',
  'ContentAction.href': 'Link destination, for example /visit/ or #opening-hours.',
  'ContentAction.variant': 'Visual treatment; omitted values use the text action style.',
  'SectionDefinition.id': 'Stable, page-unique anchor matching ^[a-z][a-z0-9-]*$.',
  'SectionDefinition.title': 'Short navigation and accessibility label; does not by itself show a base Section heading.',
  'SectionDefinition.headline': 'Visible heading. Omit it for a region without a displayed heading.',
  'SectionDefinition.headingLevel': 'HTML heading level; inherits the surrounding context when omitted.',
  'SectionDefinition.headingSize': 'Visual heading size, independent of the HTML level.',
  'SectionDefinition.headingAlign': 'Left (default), center or right alignment for the headline, eyebrow and introduction. Does not change body content; ignored by HeroSection.',
  'SectionDefinition.background': 'Surface color and width; follow the linked type for its fields.',
  'SectionDefinition.style': 'Optional width and text color as CSS strings. Other layout settings have dedicated fields.',
  'SectionDefinition.spacing': 'Vertical spacing: normal for top-level sections and none for nested sections by default.',
  'SectionBackground.size': 'Defaults to standard. Full paints across the viewport without changing the reading width.',
  'ImageData.alt': 'Text alternative describing the image’s purpose; an empty string marks a decorative image.',
  'ImageData.width': 'Intrinsic source width in pixels, used with height to reserve space.',
  'ImageData.height': 'Intrinsic source height in pixels, used with width to reserve space.',
  'ImageData.srcDark': 'Optional alternative source for dark mode.',
  'ImageData.objectFit': 'Defaults to cover. Use contain to preserve the complete image in its frame.',
  'ImageData.srcset': 'Browser source candidates with their width or density descriptors.',
  'ImageData.sizes': 'Browser sizing hints for width-based srcset candidates.',
  'CardItem.itemKey': 'Optional occurrence identity; collections use itemKey before id.',
  'CardItem.subtitle': 'Fallback when description is nullish; an empty description suppresses it.',
  'ContentPageData.title': 'Required page name; also the fallback document title.',
  'ContentPageData.pageTitle': 'Optional browser document title overriding title.',
  'ContentPageData.breadcrumbs': 'Ordered hierarchy from a broad site category to the current page.',
  'ContentPageData.bodyLayout': 'Wide or narrow reading layout; defaults to wide.',
  'VideoData.captions': 'Each caption needs src, language and label. Supply a browser-supported text track such as WebVTT.',
  'MenuItem.children': 'Nested entries with the same MenuItem shape.',
  'CardElements.item': 'The card’s current data object with your generic T fields.',
  'CardElements.root': 'The root card element.',
  'CardElements.surface': 'The surface element behind the card contents.',
  'CardElements.media': 'The inner media fitting rectangle, not the outer aspect-ratio frame.',
  'CardElements.copy': 'The card text container.',
  'CardElements.title': 'The card heading element.',
};
const commonNotes = {
  id: 'Stable identity for this entry.', type: 'Discriminator selecting this content variant.',
  label: 'Visible label.', href: 'Link destination.', title: 'Human-readable title.',
  image: 'Image content; follow ImageData for all fields.', actions: 'Link actions in display order.',
  blocks: 'Ordered content blocks.', list: 'Card items in display order.',
  eyebrow: 'Short text displayed above the heading.', introduction: 'Supporting text beneath the heading.',
  src: 'Media source URL.', text: 'Text content or structured inline runs.',
  tone: 'Standard or muted surface treatment.', icon: 'Caller-supplied icon or icon identifier, as shown by the type.',
  description: 'Optional accompanying text.', ordered: 'Use an ordered list when true.',
};
const sourceText = node => node.getText(node.getSourceFile());
function rows(type, owner) {
  return checker.getPropertiesOfType(type).map(symbol => {
    const node = symbol.valueDeclaration ?? symbol.declarations?.[0];
    if (!node || program.isSourceFileDefaultLibrary(node.getSourceFile()) || (!ts.isPropertySignature(node) && !ts.isMethodSignature(node))) return '';
    const parent = node.parent.name?.getText() ?? '';
    if (owner && parent && parent !== owner) return '';
    const typeText = node.type ? sourceText(node.type) : checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, node));
    const comment = ts.displayPartsToString(symbol.getDocumentationComment(checker));
    const note = notes[`${parent}.${symbol.name}`] ?? comment ?? '';
    return `<tr><td><code>${escape(symbol.name)}</code></td><td><code>${linked(typeText)}</code></td><td>${symbol.flags & ts.SymbolFlags.Optional ? 'Optional' : 'Required'}</td><td>${escape(note || commonNotes[symbol.name] || 'See the declared value shape and the linked types.')}</td></tr>`;
  }).join('\n');
}
const table = body => body ? `<!-- svelte-ignore a11y_no_noninteractive_tabindex (Reference tables need keyboard scrolling.) --><div class="table-scroll" tabindex="0" role="region" aria-label="Type fields"><table><thead><tr><th>Field</th><th>Type</th><th>Presence</th><th>Meaning</th></tr></thead><tbody>${body}</tbody></table></div>` : '';
const sections = entries.map(({ name, symbol, node }) => {
  const type = checker.getDeclaredTypeOfSymbol(symbol);
  const definition = ts.isTypeAliasDeclaration(node) ? sourceText(node.type) : sourceText(node).replace(/^export\s+/, '');
  const variants = ts.isTypeAliasDeclaration(node) && type.isUnion() && type.types.some(t => t.flags & ts.TypeFlags.Object) ? type.types : [type];
  const fields = name === 'SectionData' ? '' : variants.map((variant, index) => {
    const body = rows(variant, ts.isInterfaceDeclaration(node) ? name : undefined);
    return body ? (variants.length > 1 ? `<h3>Alternative ${index + 1}</h3>` : '') + table(body) : '';
  }).join('\n');
  const bases = node.heritageClauses?.flatMap(clause => clause.types.map(type => sourceText(type))) ?? [];
  const inherited = bases.length ? `<p>Also includes the fields of ${bases.map(base => `<code>${linked(base)}</code>`).join(' and ')}. Follow these links for inherited fields.</p>` : '';
  const description = descriptions[name] ?? (ts.displayPartsToString(symbol.getDocumentationComment(checker)) || `${name} is a public ${ts.isInterfaceDeclaration(node) ? 'object shape' : 'type'}. Follow linked field types to inspect nested values.`);
  return `<Section section={{ id: '${anchor(name)}', title: '${name}', headline: '${name}', headingSize: 'm', background: { color: 'standard' } }}><div class="prose"><p>${escape(description)}</p>${inherited}<details><summary>Type declaration</summary><pre><code>${linked(definition)}</code></pre></details>${fields}</div></Section>`;
}).join('\n');
const example = `import type { ContentAction } from '@page-sections/core';\n\nconst visit: ContentAction = {\n  label: 'Plan your visit',\n  href: '/visit/',\n  variant: 'primary'\n};\n\n// HeroSection's actions field is an array of these objects.\nconst actions: ContentAction[] = [visit];`;
const output = resolve(root, 'apps/website/src/routes/docs/reference/types/+page.svelte');
const source = `<!-- Generated by scripts/generate-type-reference.mjs. Edit source declarations or generator explanations. -->
<script module lang="ts">export const examples = [{ language: 'ts', code: ${JSON.stringify(example)} }];</script>
<script lang="ts">
import { base } from '#lib/paths.js';
import { HeadingSection, Section, CodeBlock } from '@page-sections/svelte';
import WebsitePage from '#lib/WebsitePage.svelte';
import type { PageData } from './$types';
let { data }: { data: PageData } = $props();
</script>
<WebsitePage page={{ title: 'Data types', pageTitle: 'Data types · Page Sections' }} showContentMenu>
<HeadingSection section={{ id: 'page-heading', title: 'Data types', introduction: 'Inspect the objects used by component properties, including their required fields and nested types.', headingLevel: 1, headingSize: 'l', background: { color: 'standard' } }} />
<Section section={{ id: 'reading-types', title: 'Reading types', headline: 'Read a type before using it', background: { color: 'standard' } }}><div class="prose">
<p>These tables follow the public TypeScript declarations and link to inherited fields. Required means the object must supply the field; Optional means it may be omitted. A question mark in a declaration also marks an optional field. Click any named library type to inspect it.</p>
<p><code>[]</code> means an array; <code>|</code> separates alternatives. A literal such as <code>'primary'</code> is an exact allowed value. <code>Omit&lt;T, 'type'&gt;</code> keeps the fields of T except type; <code>Partial&lt;T&gt;</code> makes its fields optional; <code>Record&lt;K, V&gt;</code> maps keys K to values V. A field typed <code>never</code> must be omitted for that alternative.</p>
<p>Types describe data shapes; defaults belong to the consuming component. Most types are exported by @page-sections/core and re-exported as types by @page-sections/svelte. FooterSocialLink and CardElements come from the Svelte package. Svelte's Snippet and Component represent markup and component constructors; HTMLElement represents a browser element. They are rendering values, not JSON data.</p>
<p>For example, a HeroSection action is a ContentAction object. Its actions property accepts an array of these objects:</p>
<CodeBlock {...examples[0]} highlighted={data.highlights[0]} />
<nav aria-label="Data type index"><ul class="type-index">${entries.map(({ name }) => `<li><a href={base + '/docs/reference/types/#${anchor(name)}'}>${name}</a></li>`).join('\n')}</ul></nav>
</div></Section>
${sections}
</WebsitePage>
<style>.type-index { columns: 3 15rem; } .type-index li { break-inside: avoid; } pre { white-space: pre-wrap; overflow-wrap: anywhere; } :global(.prose td code) { overflow-wrap: anywhere; }</style>
`;
const formatted = await format(source, { ...await resolveConfig(output), filepath: output });
const searchOutput = resolve(root, 'apps/website/src/lib/typeCatalog.ts');
const searchSource = await format('// Generated by scripts/generate-type-reference.mjs.\nexport const typeDocuments = ' + JSON.stringify(entries.map(({ name }) => ({
  title: name, href: `/docs/reference/types/#${anchor(name)}`, group: 'Data types',
  description: descriptions[name] ?? `Fields and declaration of ${name}.`
}))) + ';\n', { ...await resolveConfig(searchOutput), filepath: searchOutput });
if (process.argv.includes('--check')) {
  if (readFileSync(output, 'utf8').replaceAll('\r\n', '\n') !== formatted.replaceAll('\r\n', '\n')) throw new Error('Stale type reference. Run npm run docs:types.');
  if (readFileSync(searchOutput, 'utf8').replaceAll('\r\n', '\n') !== searchSource.replaceAll('\r\n', '\n')) throw new Error('Stale type search catalog. Run npm run docs:types.');
} else {
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, formatted);
  writeFileSync(searchOutput, searchSource);
  writeFileSync(resolve(dirname(output), '+page.server.ts'), readFileSync(resolve(root, 'apps/website/src/routes/docs/foundations/first-page/+page.server.ts')));
}
console.log(`Verified ${entries.length} public type definitions and their fields.`);
