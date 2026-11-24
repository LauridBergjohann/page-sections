import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
import { waitForPublishedVersion, retryRegistryOperation } from './registry-readiness.mjs';
const root = resolve(import.meta.dirname, '..');
const npm = process.env.npm_execpath;
if (!npm) throw new Error('Run this verifier through npm run verify:packages.');
function execute(args, cwd = root) {
  return spawnSync(process.execPath, [npm, ...args], { cwd, encoding: 'utf8', env: { ...process.env, npm_config_cache: cache }, maxBuffer: 16 * 1024 * 1024 });
}
function run(args, cwd = root) {
  const result = execute(args, cwd);
  if (result.status !== 0) throw new Error(`${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result.stdout.trim();
}
const published = process.argv.includes('--published');
// A fresh cache prevents a previous local download from hiding CDN propagation delays.
const cache = published ? mkdtempSync(join(tmpdir(), 'page-sections-registry-cache-')) : join(root, '.npm-cache');
if (!published) run(['run', 'build']);
const artifacts = join(root, '.artifacts/packages'); mkdirSync(artifacts, { recursive: true });
const specs = [];
const registryOptions = published ? ['--prefer-online', '--fetch-retries=0', '--fetch-timeout=15000', '--registry=https://registry.npmjs.org/'] : [];
// Resolve consumer tooling from the lockfile so package tests use the reviewed toolchain.
const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
const dependency = name => {
  const version = (lock.packages['node_modules/' + name] ?? lock.packages['apps/website/node_modules/' + name])?.version;
  assert(version, 'Missing locked consumer dependency: ' + name);
  return name + '@' + version;
};
async function install(args, cwd) {
  if (published) await retryRegistryOperation('Registry consumer installation', () => execute(args, cwd));
  else run(args, cwd);
}
for (const name of ['core', 'svelte']) {
  const pkg = JSON.parse(readFileSync(join(root, `packages/${name}/package.json`), 'utf8'));
  assert.equal(pkg.private, undefined); assert.equal(pkg.license, 'MPL-2.0');
  for (const dependency of Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies })) {
    assert(!/spatial-elements|three|@sveltejs\/kit|lucide/.test(dependency), `Forbidden runtime dependency: ${dependency}`);
    if (name === 'core') assert(!/svelte/.test(dependency));
  }
  if (published) {
    const spec = await waitForPublishedVersion(pkg.name, pkg.version, spec => execute([
      'view', spec, 'version', '--json', ...registryOptions
    ]));
    // Metadata can precede the tarball. Download it before attempting either consumer build.
    const downloaded = await retryRegistryOperation(spec + ' tarball download', () => execute([
      'pack', spec, '--ignore-scripts', '--json', '--pack-destination', artifacts, ...registryOptions
    ]));
    const [pack] = JSON.parse(downloaded.stdout);
    assert.equal(pack.name, pkg.name);
    assert.equal(pack.version, pkg.version);
    assert(existsSync(join(artifacts, pack.filename)), 'Missing downloaded published tarball');
    specs.push(spec);
  } else {
    const [pack] = JSON.parse(run(['pack', '--ignore-scripts', '--json', '--pack-destination', artifacts], join(root, `packages/${name}`)));
    assert(pack.files.some(f => f.path === 'dist/index.js')); assert(pack.files.some(f => f.path === 'dist/index.d.ts'));
    assert(pack.files.some(f => f.path === 'LICENSE')); assert(pack.files.some(f => f.path === 'NOTICE'));
    assert(!pack.files.some(f => /node_modules|\.reference|\.test\./.test(f.path)));
    specs.push(join(artifacts, pack.filename));
  }
}
// os.tmpdir is deliberately outside every workspace: no alias, symlink or parent node_modules.
const consumer = mkdtempSync(join(tmpdir(), 'page-sections-consumer-'));
writeFileSync(join(consumer, 'package.json'), JSON.stringify({ name: 'page-sections-artifact-consumer', private: true, type: 'module', scripts: { build: 'vite build && vite build --ssr src/entry-server.ts --outDir dist/server && node prerender.mjs', check: 'svelte-check --tsconfig tsconfig.json' } }, null, 2));
await install(['install', ...specs, ...['svelte', '@sveltejs/vite-plugin-svelte', 'vite', 'typescript', 'svelte-check', '@types/node'].map(dependency), '--ignore-scripts', '--no-audit', '--no-fund', ...registryOptions], consumer);
for (const file of ['src', 'index.html', 'vite.config.ts', 'prerender.mjs']) cpSync(join(root, 'tests/fixtures/plain-svelte', file), join(consumer, file), { recursive: true });
writeFileSync(join(consumer, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', strict: true, skipLibCheck: true, allowJs: true, resolveJsonModule: true }, include: ['src/**/*'] }));
run(['run', 'check'], consumer); run(['run', 'build'], consumer);
const html = readFileSync(join(consumer, 'dist/index.html'), 'utf8');
for (const text of ['href="#browse"', 'data-ps-section="collection"', 'data-ps-section="browse"', 'aria-label="On this page"', 'Independent studio', 'mailto:hello@example.com', 'Readable copy']) assert(html.includes(text), `Consumer SSR missing ${text}`);
assert(existsSync(join(consumer, 'node_modules/@page-sections/core/dist/index.js')));
assert(html.includes('const independent = true;'), 'Consumer SSR missing code section');
assert(html.includes('data-event="launch"') && html.includes('Independent timeline'), 'Consumer SSR missing timeline section');
assert(!existsSync(join(consumer, 'node_modules/shiki')), 'Plain code must not require the optional highlighting engine');
// Verify the same installed artifacts in a genuine SvelteKit production build as well.
const kit = join(consumer, 'kit'); mkdirSync(join(kit, 'src/routes'), { recursive: true });
writeFileSync(join(kit, 'package.json'), JSON.stringify({ name: 'page-sections-kit-consumer', private: true, type: 'module', scripts: { build: 'svelte-kit sync && vite build' } }));
await install(['install', ...specs, ...['svelte', '@sveltejs/kit', '@sveltejs/adapter-static', '@sveltejs/vite-plugin-svelte', 'vite', 'typescript'].map(dependency), '--ignore-scripts', '--no-audit', '--no-fund', ...registryOptions], kit);
writeFileSync(join(kit, 'vite.config.js'), "import adapter from '@sveltejs/adapter-static'; import { sveltekit } from '@sveltejs/kit/vite'; export default { plugins: [sveltekit({ adapter: adapter() })] };\n");
writeFileSync(join(kit, 'src/app.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8">%sveltekit.head%</head><body><div>%sveltekit.body%</div></body></html>');
writeFileSync(join(kit, 'src/routes/+page.js'), 'export const prerender = true;');
writeFileSync(join(kit, 'src/routes/+page.svelte'), `<script>import { ContentPage, HeadingSection, CarouselSection } from '@page-sections/svelte';</script><ContentPage page={{ title: 'Kit consumer' }} showContentMenu><HeadingSection section={{ id: 'kit-title', title: 'Kit consumer', headingLevel: 1 }} /><CarouselSection section={{ id: 'kit-cards', title: 'Kit cards', headline: 'Kit cards' }} list={[{ id: 'one', title: 'Kit One', href: '/' }]} /></ContentPage>`);
run(['run', 'build'], kit);
const kitHtml = readFileSync(join(kit, '.svelte-kit/output/prerendered/pages/index.html'), 'utf8');
assert(kitHtml.includes('href="/"')); assert(kitHtml.includes('href="#kit-cards"'));
const report = { source: published ? 'npm registry' : 'npm tarballs', specs, consumer, checked: ['package contents', 'runtime dependencies', 'independent installation', 'consumer TypeScript/Svelte', 'client build', 'SSR build', 'prerendered content', 'independent SvelteKit build and prerender'], verifiedAt: new Date().toISOString() };
writeFileSync(join(root, '.artifacts', published ? 'published-consumer.json' : 'packed-consumer.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
