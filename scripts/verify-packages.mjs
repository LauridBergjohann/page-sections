import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
import { waitForPublishedVersion } from './registry-readiness.mjs';
const root = resolve(import.meta.dirname, '..');
const npm = process.env.npm_execpath;
if (!npm) throw new Error('Run this verifier through npm run verify:packages.');
function execute(args, cwd = root) {
  return spawnSync(process.execPath, [npm, ...args], { cwd, encoding: 'utf8', env: { ...process.env, npm_config_cache: join(root, '.npm-cache') }, maxBuffer: 16 * 1024 * 1024 });
}
function run(args, cwd = root) {
  const result = execute(args, cwd);
  if (result.status !== 0) throw new Error(`${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result.stdout.trim();
}
const published = process.argv.includes('--published');
if (!published) run(['run', 'build']);
const artifacts = join(root, '.artifacts/packages'); mkdirSync(artifacts, { recursive: true });
const specs = [];
for (const name of ['core', 'svelte']) {
  const pkg = JSON.parse(readFileSync(join(root, `packages/${name}/package.json`), 'utf8'));
  assert.equal(pkg.private, undefined); assert.equal(pkg.license, 'MPL-2.0');
  for (const dependency of Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies })) {
    assert(!/spatial-elements|three|@sveltejs\/kit|lucide/.test(dependency), `Forbidden runtime dependency: ${dependency}`);
    if (name === 'core') assert(!/svelte/.test(dependency));
  }
  if (published) {
    specs.push(await waitForPublishedVersion(pkg.name, pkg.version, spec => execute([
      'view', spec, 'version', '--json', '--prefer-online', '--fetch-retries=0', '--fetch-timeout=15000', '--registry=https://registry.npmjs.org/'
    ])));
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
const registryOptions = published ? ['--prefer-online', '--registry=https://registry.npmjs.org/'] : [];
run(['install', ...specs, 'svelte@5.56.4', '@sveltejs/vite-plugin-svelte@7.2.0', 'vite@8.1.4', 'typescript@6.0.3', 'svelte-check@4.7.2', '@types/node@24', '--ignore-scripts', '--no-audit', '--no-fund', ...registryOptions], consumer);
for (const file of ['src', 'index.html', 'vite.config.ts', 'prerender.mjs']) cpSync(join(root, 'tests/fixtures/plain-svelte', file), join(consumer, file), { recursive: true });
writeFileSync(join(consumer, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', strict: true, skipLibCheck: true, allowJs: true, resolveJsonModule: true }, include: ['src/**/*'] }));
run(['run', 'check'], consumer); run(['run', 'build'], consumer);
const html = readFileSync(join(consumer, 'dist/index.html'), 'utf8');
for (const text of ['href="#browse"', 'data-ps-section="collection"', 'data-ps-section="browse"', 'aria-label="On this page"', 'Independent studio', 'mailto:hello@example.com', 'data-card-variant="editorial"']) assert(html.includes(text), `Consumer SSR missing ${text}`);
assert(existsSync(join(consumer, 'node_modules/@page-sections/core/dist/index.js')));
assert(html.includes('const independent = true;'), 'Consumer SSR missing code section');
assert(!existsSync(join(consumer, 'node_modules/shiki')), 'Plain code must not require the optional highlighting engine');
// Verify the same installed artifacts in a genuine SvelteKit production build as well.
const kit = join(consumer, 'kit'); mkdirSync(join(kit, 'src/routes'), { recursive: true });
writeFileSync(join(kit, 'package.json'), JSON.stringify({ name: 'page-sections-kit-consumer', private: true, type: 'module', scripts: { build: 'svelte-kit sync && vite build' } }));
run(['install', ...specs, 'svelte@5.56.4', '@sveltejs/kit@2.70.3', '@sveltejs/adapter-auto@7.0.1', '@sveltejs/vite-plugin-svelte@7.2.0', 'vite@8.1.4', '--ignore-scripts', '--no-audit', '--no-fund', ...registryOptions], kit);
writeFileSync(join(kit, 'svelte.config.js'), "import adapter from '@sveltejs/adapter-auto'; export default { kit: { adapter: adapter() } };\n");
writeFileSync(join(kit, 'vite.config.js'), "import { sveltekit } from '@sveltejs/kit/vite'; export default { plugins: [sveltekit()] };\n");
writeFileSync(join(kit, 'src/app.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8">%sveltekit.head%</head><body><div>%sveltekit.body%</div></body></html>');
writeFileSync(join(kit, 'src/routes/+page.js'), 'export const prerender = true;');
writeFileSync(join(kit, 'src/routes/+page.svelte'), `<script>import { ContentPage, CarouselSection } from '@page-sections/svelte';</script><ContentPage page={{ title: 'Kit consumer' }} showContentMenu><CarouselSection section={{ id: 'kit-cards', title: 'Kit cards' }} list={[{ id: 'one', title: 'Kit One', href: '/' }]} /></ContentPage>`);
run(['run', 'build'], kit);
const kitHtml = readFileSync(join(kit, '.svelte-kit/output/prerendered/pages/index.html'), 'utf8');
assert(kitHtml.includes('href="/"')); assert(kitHtml.includes('href="#kit-cards"'));
const report = { source: published ? 'npm registry' : 'npm tarballs', specs, consumer, checked: ['package contents', 'runtime dependencies', 'independent installation', 'consumer TypeScript/Svelte', 'client build', 'SSR build', 'prerendered content', 'independent SvelteKit build and prerender'], verifiedAt: new Date().toISOString() };
writeFileSync(join(root, '.artifacts', published ? 'published-consumer.json' : 'packed-consumer.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
