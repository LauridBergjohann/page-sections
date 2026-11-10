import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Validate the versioned files that must already be included in the feature PR. */
export function checkRelease(root) {
  const pending = readdirSync(resolve(root, '.changeset'))
    .filter(name => name.endsWith('.md') && name !== 'README.md');
  assert.equal(pending.length, 0,
    `Unconsumed changesets: ${pending.join(', ')}. Run npm run release:version and commit the result in this PR.`);

  const json = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  const core = json('packages/core/package.json');
  const svelte = json('packages/svelte/package.json');
  const lock = json('package-lock.json');
  assert.equal(core.version, svelte.version, 'Both public packages must use the same release version.');
  assert.equal(svelte.dependencies[core.name], core.version,
    'The Svelte package must depend on the current core version.');

  for (const [directory, pkg] of [['core', core], ['svelte', svelte]]) {
    const entry = lock.packages[`packages/${directory}`];
    assert.equal(entry?.version, pkg.version,
      `Update package-lock.json for ${pkg.name} with npm run release:version.`);
    if (directory === 'svelte') {
      assert.equal(entry.dependencies[core.name], core.version,
        'The lockfile must use the current core dependency.');
    }
    const changelog = readFileSync(resolve(root, `packages/${directory}/CHANGELOG.md`), 'utf8');
    assert(changelog.split(/\r?\n/).includes(`## ${pkg.version}`),
      `Missing changelog entry for ${pkg.name}@${pkg.version}.`);
  }
  return core.version;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  console.log(`Release files are ready for ${checkRelease(resolve(import.meta.dirname, '..'))}.`);
}
