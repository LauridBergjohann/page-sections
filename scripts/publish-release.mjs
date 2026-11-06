import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const npm = process.env.npm_execpath;
if (!npm) throw new Error('Use npm run release:publish.');
if (!process.env.ACTIONS_ID_TOKEN_REQUEST_URL) throw new Error('Publishing requires the configured GitHub Actions OIDC environment. See docs/releasing.md.');
for (const name of ['core', 'svelte']) {
  const cwd = resolve(root, 'packages', name);
  const pkg = JSON.parse(readFileSync(resolve(cwd, 'package.json'), 'utf8'));
  const response = await fetch(`https://registry.npmjs.org/${pkg.name.replace('/', '%2f')}/${pkg.version}`);
  if (response.ok) { console.log(`${pkg.name}@${pkg.version} already published.`); continue; }
  if (response.status !== 404) throw new Error(`Registry returned ${response.status}; refusing to interpret this as an unpublished package.`);
  const result = spawnSync(process.execPath, [npm, 'publish', '--access', 'public', '--provenance'], { cwd, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
