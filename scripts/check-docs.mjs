import { readFileSync, readdirSync, existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join, relative, extname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import MarkdownIt from 'markdown-it';
import ts from 'typescript';
import { compile } from 'svelte/compiler';

const root = resolve(import.meta.dirname, '..');
const wikiIndex = process.argv.indexOf('--wiki');
const wiki = resolve(wikiIndex < 0 ? join(root, '../page-sections.wiki') : process.argv[wikiIndex + 1] ?? '');
if (!existsSync(join(wiki, 'Home.md'))) throw new Error('Wiki checkout missing. Clone page-sections.wiki beside the main repository, or pass --wiki PATH.');
const require = createRequire(import.meta.url);
const markdown = new MarkdownIt();
const wikiBase = 'https://github.com/LauridBergjohann/page-sections/wiki';
const repoBase = 'https://github.com/LauridBergjohann/page-sections/';
const read = path => readFileSync(path, 'utf8');
function mdFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? mdFiles(join(directory, entry.name)) : entry.name.endsWith('.md') ? [join(directory, entry.name)] : []);
}
const wikiFiles = readdirSync(wiki).filter(name => name.endsWith('.md')).map(name => join(wiki, name));
const files = [join(root, 'README.md'), join(root, 'packages/core/README.md'), join(root, 'packages/svelte/README.md'), ...mdFiles(join(root, 'docs')), join(root, '.changeset/README.md'), ...wikiFiles];
let links = 0;
const headings = new Map();
function slugs(file) {
  if (headings.has(file)) return headings.get(file);
  const tokens = markdown.parse(read(file), {});
  const result = new Set(); const counts = new Map();
  for (let i = 0; i < tokens.length; i++) if (tokens[i].type === 'heading_open') {
    const base = tokens[i + 1].content.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu, '').replace(/ /g, '-');
    const count = counts.get(base) ?? 0; counts.set(base, count + 1);
    result.add(count ? `${base}-${count}` : base);
  }
  headings.set(file, result); return result;
}
function checkLink(href, source) {
  let target; let anchor;
  const decoded = decodeURIComponent(href);
  if (decoded === wikiBase || decoded.startsWith(wikiBase + '/') || decoded.startsWith(wikiBase + '#')) {
    const [slug, hash] = decoded.slice(wikiBase.length).replace(/^\//, '').split('#');
    target = join(wiki, `${slug || 'Home'}.md`); anchor = hash;
  } else if (decoded.startsWith(repoBase + 'blob/main/') || decoded.startsWith(repoBase + 'tree/main/')) {
    const [path, hash] = decoded.replace(repoBase, '').replace(/^(blob|tree)\/main\//, '').split('#');
    target = resolve(root, path); anchor = hash;
  } else if (!/^[a-z][a-z\d+.-]*:/i.test(decoded) && !decoded.startsWith('//')) {
    const [path, hash] = decoded.split('#');
    target = path ? resolve(dirname(source), path) : source; anchor = hash;
  }
  if (!target) return; // External URL availability is a separate online review.
  if (!existsSync(target)) throw new Error(`${relative(root, source)}: missing link target ${href}`);
  if (anchor && extname(target) === '.md' && !slugs(target).has(anchor)) throw new Error(`${source}: missing heading ${href}`);
  links++;
}
const fences = [];
for (const file of files) {
  const tokens = markdown.parse(read(file), {});
  let index = 0;
  for (const token of tokens) {
    for (const child of token.children ?? []) if (child.type === 'link_open') checkLink(child.attrGet('href'), file);
    if (token.type === 'fence') fences.push({ file, index: index++, info: token.info.trim(), content: token.content });
  }
}
const sidebar = read(join(wiki, '_Sidebar.md'));
for (const file of wikiFiles) {
  const name = file.slice(wiki.length + 1, -3);
  if (!name.startsWith('_') && !sidebar.includes(`${wikiBase}/${name}`)) throw new Error(`Sidebar is missing ${name}.`);
}
const componentExports = [...read(join(root, 'packages/svelte/src/index.ts')).matchAll(/default as (\w+)/g)].map(match => match[1]);
const svelteApi = read(join(wiki, 'Svelte-API.md'));
for (const name of componentExports) if (!svelteApi.includes('`' + name + '`')) throw new Error(`Undocumented Svelte export: ${name}`);
const coreIndex = join(root, 'packages/core/src/index.ts');
const program = ts.createProgram([coreIndex], { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, resolveJsonModule: true, skipLibCheck: true });
const checker = program.getTypeChecker();
const symbol = checker.getSymbolAtLocation(program.getSourceFile(coreIndex));
const coreExports = checker.getExportsOfModule(symbol).map(value => value.name);
const coreApi = read(join(wiki, 'Core-API.md'));
for (const name of coreExports) if (!new RegExp(`\\b${name}\\b`).test(coreApi)) throw new Error(`Undocumented core export: ${name}`);

const tokenReference = read(join(wiki, 'CSS-Variables-and-Layout-Tokens.md'));
const tokens = JSON.parse(read(join(root, 'packages/core/src/layoutTokens.json')));
for (const [name, grid] of Object.entries(tokens.grid)) {
  const fields = ['minWidth', 'columns', 'gap', 'headlineSize', 'headlineLineHeight', 'bodySize', 'bodyLineHeight', 'headlineGap'];
  const row = `| ${name} | ${fields.map(field => grid[field]).join(' | ')} |`;
  if (!tokenReference.includes(row)) throw new Error(`Grid token documentation is stale: ${name}`);
}
for (const [name, card] of Object.entries(tokens.cards)) {
  const fields = ['span', 'titleSize', 'titleWeight', 'eyebrowSize', 'eyebrowWeight', 'lineHeight', 'rows'];
  const row = `| ${name} | ${fields.map(field => card[field]).join(' | ')} | ${card.gridSSpan ?? 'Absent'} |`;
  if (!tokenReference.includes(row)) throw new Error(`Card token documentation is stale: ${name}`);
}
for (const [name, value] of Object.entries(tokens.breadcrumb)) {
  if (!tokenReference.includes(`| ${name} | ${value.fontSize} | ${value.height} |`)) throw new Error(`Breadcrumb token documentation is stale: ${name}`);
}
for (const [name, value] of Object.entries(tokens.layoutMinWidths)) {
  if (!tokenReference.includes(`${name}=${value}`)) throw new Error(`Viewport token documentation is stale: ${name}`);
}
const styleFiles = readdirSync(join(root, 'packages/svelte/src')).filter(file => /\.(svelte|css)$/.test(file));
const variables = new Set(styleFiles.flatMap(file => [...read(join(root, 'packages/svelte/src', file)).matchAll(/--ps-[\w-]+/g)].map(match => match[0])));
const expandedReference = tokenReference + ['xs', 's', 'm', 'l'].map(size => tokenReference.replaceAll('{size}', size)).join('\n');
for (const variable of variables) if (!expandedReference.includes(variable)) throw new Error(`Undocumented CSS variable: ${variable}`);

const artifacts = join(root, '.artifacts/docs-examples'); mkdirSync(artifacts, { recursive: true });
const output = mkdtempSync(join(artifacts, 'run-'));
const manifest = []; let css = 0;
for (const fence of fences) {
  const [language] = fence.info.split(/\s+/);
  if (language === 'css') { compile(`<style>${fence.content}</style>`, { generate: false }); css++; continue; }
  if (!['svelte', 'ts', 'typescript'].includes(language)) continue;
  const group = /\bgroup=([\w-]+)/.exec(fence.info)?.[1] ?? `example-${fence.index}`;
  const fileName = /\bfile=([\w.-]+)/.exec(fence.info)?.[1] ?? (language === 'svelte' ? 'Example.svelte' : 'example.ts');
  const documentName = relative(root, fence.file).replace(/[^\w-]/g, '_');
  const directory = join(output, documentName, group); mkdirSync(directory, { recursive: true });
  const target = join(directory, fileName);
  if (existsSync(target)) throw new Error(`Duplicate example file: ${target}`);
  writeFileSync(target, fence.content + (language !== 'svelte' ? '\nexport {};\n' : ''));
  manifest.push({ document: relative(root, fence.file), fence: fence.index + 1, example: relative(root, target) });
}
writeFileSync(join(output, 'env.d.ts'), "declare module '*.css';\n");
writeFileSync(join(output, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', strict: true, allowJs: true, checkJs: false, resolveJsonModule: true, esModuleInterop: true, skipLibCheck: true, verbatimModuleSyntax: true, noEmit: true, lib: ['ES2022', 'DOM', 'DOM.Iterable'] }, include: ['**/*.ts', '**/*.svelte'] }, null, 2));
writeFileSync(join(output, 'manifest.json'), JSON.stringify(manifest, null, 2));
const cli = join(dirname(require.resolve('svelte-check/package.json')), 'bin/svelte-check');
const result = spawnSync(process.execPath, [cli, '--workspace', output, '--tsconfig', join(output, 'tsconfig.json'), '--fail-on-warnings'], { cwd: root, stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status ?? 1);
const report = { wiki, documents: files.length, wikiPages: wikiFiles.filter(file => !file.split(/[\\/]/).pop().startsWith('_')).length, links, svelteExports: componentExports.length, coreExports: coreExports.length, cssVariables: variables.size, examples: manifest.length, cssExamples: css, generatedExamples: output, checkedAt: new Date().toISOString() };
writeFileSync(join(root, '.artifacts/docs-verification.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
