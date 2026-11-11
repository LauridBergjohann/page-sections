import { readFileSync, readdirSync, existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { compile } from 'svelte/compiler';
import { examplesFrom } from './documentation-examples.mjs';

const root = resolve(import.meta.dirname, '..');
const routes = join(root, 'apps/website/src/routes');
const read = file => readFileSync(file, 'utf8');
const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
const pages = walk(routes).filter(file => file.endsWith('+page.svelte'));
const routeOf = file => '/' + relative(routes, dirname(file)).replaceAll('\\', '/') + (dirname(file) === routes ? '' : '/');
const routeSources = new Map(pages.map(file => [routeOf(file), read(file)]));
const catalog = read(join(root, 'apps/website/src/lib/catalog.ts'));
const allDocs = pages.filter(file => /[\\/](docs|getting-started)[\\/]/.test(file));
let links = 0;
for (const [route, source] of routeSources) {
  if (/^\/(docs|getting-started)\/.+/.test(route) && !catalog.includes(route)) throw new Error(`Missing navigation entry: ${route}`);
  if (source.includes('github.com/LauridBergjohann/page-sections/wiki')) throw new Error(`Old Wiki link in ${route}`);
  for (const match of source.matchAll(/href=\{base\s*\+\s*['"]([^'"]+)['"]\}/g)) {
    const [path, hash] = match[1].split('#');
    const target = routeSources.get(path || route);
    if (!target) throw new Error(`${route}: missing route ${match[1]}`);
    if (hash && !new RegExp(`(?:id:\\s*['"]|id=['"])${hash}['"]`).test(target)) throw new Error(`${route}: missing anchor ${match[1]}`);
    links++;
  }
}

const svelteIndex = read(join(root, 'packages/svelte/src/index.ts'));
const svelteReference = routeSources.get('/docs/reference/svelte-api/');
const components = [...svelteIndex.matchAll(/default as (\w+)/g)].map(match => match[1]);
for (const name of components) if (!svelteReference.includes(`<code>${name}</code>`)) throw new Error(`Undocumented Svelte export: ${name}`);
const coreIndex = join(root, 'packages/core/src/index.ts');
const program = ts.createProgram([coreIndex], { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, resolveJsonModule: true, skipLibCheck: true });
const checker = program.getTypeChecker();
const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(program.getSourceFile(coreIndex))).map(value => value.name);
const coreReference = routeSources.get('/docs/reference/core-api/');
for (const name of exports) if (!new RegExp(`\\b${name}\\b`).test(coreReference)) throw new Error(`Undocumented core export: ${name}`);

const tokenReference = routeSources.get('/docs/reference/tokens/');
const rows = [...tokenReference.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(match => [...match[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(cell => cell[1].replace(/<[^>]+>/g, '').trim()).join('|'));
const tokens = JSON.parse(read(join(root, 'packages/core/src/layoutTokens.json')));
for (const [name, grid] of Object.entries(tokens.grid)) {
  const fields = ['minWidth', 'columns', 'gap', 'headlineSize', 'headlineLineHeight', 'bodySize', 'bodyLineHeight', 'headlineGap'];
  if (!rows.includes([name, ...fields.map(field => grid[field])].join('|'))) throw new Error(`Stale grid tokens: ${name}`);
}
for (const [name, card] of Object.entries(tokens.cards)) {
  const fields = ['span', 'titleSize', 'titleWeight', 'eyebrowSize', 'eyebrowWeight', 'lineHeight', 'rows'];
  if (!rows.includes([name, ...fields.map(field => card[field]), card.gridSSpan ?? 'Absent'].join('|'))) throw new Error(`Stale card tokens: ${name}`);
}
for (const [name, value] of Object.entries(tokens.breadcrumb)) if (!rows.includes(`${name}|${value.fontSize}|${value.height}`)) throw new Error(`Stale breadcrumb tokens: ${name}`);
for (const [name, value] of Object.entries(tokens.layoutMinWidths)) if (!tokenReference.includes(`${name}=${value}`)) throw new Error(`Stale viewport tokens: ${name}`);
const styleFiles = readdirSync(join(root, 'packages/svelte/src')).filter(file => /\.(svelte|css)$/.test(file));
const variables = new Set(styleFiles.flatMap(file => [...read(join(root, 'packages/svelte/src', file)).matchAll(/--ps-[\w-]+/g)].map(match => match[0])));
const expanded = tokenReference + ['xs', 's', 'm', 'l'].map(size => tokenReference.replaceAll('&#123;size&#125;', size)).join('\n');
for (const variable of variables) if (!expanded.includes(variable)) throw new Error(`Undocumented CSS variable: ${variable}`);

const artifacts = join(root, '.artifacts/docs-examples'); mkdirSync(artifacts, { recursive: true });
const output = mkdtempSync(join(artifacts, 'run-')); const manifest = [];
for (const file of allDocs) {
  const examples = examplesFrom(read(file), file);
  for (const [index, example] of examples.entries()) {
    if (example.language === 'css') { compile(`<style>${example.code}</style>`, { generate: false }); continue; }
    if (!['svelte', 'ts', 'typescript'].includes(example.language)) continue;
    const group = example.group ?? `example-${index}`;
    const filename = example.filename ?? (example.language === 'svelte' ? 'Example.svelte' : 'example.ts');
    if (!/^[\w-]+$/.test(group) || !/^[\w.-]+$/.test(filename)) throw new Error(`Invalid example path in ${file}`);
    const directory = join(output, relative(routes, dirname(file)), group); mkdirSync(directory, { recursive: true });
    const target = join(directory, filename);
    if (existsSync(target)) throw new Error(`Duplicate example: ${target}`);
    writeFileSync(target, example.code + (example.language !== 'svelte' ? '\nexport {};\n' : ''));
    manifest.push({ page: routeOf(file), example: filename });
  }
}
writeFileSync(join(output, 'env.d.ts'), "declare module '*.css';\n");
writeFileSync(join(output, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', strict: true, allowJs: true, checkJs: false, resolveJsonModule: true, esModuleInterop: true, skipLibCheck: true, verbatimModuleSyntax: true, noEmit: true, lib: ['ES2022', 'DOM', 'DOM.Iterable'] }, include: ['**/*.ts', '**/*.svelte'] }, null, 2));
const require = createRequire(import.meta.url);
const cli = join(dirname(require.resolve('svelte-check/package.json')), 'bin/svelte-check');
const result = spawnSync(process.execPath, [cli, '--workspace', output, '--tsconfig', join(output, 'tsconfig.json'), '--fail-on-warnings'], { cwd: root, stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status ?? 1);
const report = { pages: pages.length, documentationPages: allDocs.length, links, components: components.length, coreExports: exports.length, cssVariables: variables.size, examples: manifest.length, manifest };
writeFileSync(join(root, '.artifacts/docs-verification.json'), JSON.stringify(report, null, 2));
console.log(`Checked ${report.documentationPages} documentation pages, ${links} links, ${manifest.length} executable examples and public API/token coverage.`);
