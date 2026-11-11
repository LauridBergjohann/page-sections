import { afterEach, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkRelease } from '../scripts/check-release.mjs';

const directories: string[] = [];
afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'page-sections-release-test-'));
  directories.push(root);
  for (const directory of ['.changeset', 'packages/core', 'packages/svelte']) {
    mkdirSync(join(root, directory), { recursive: true });
  }
  const core = { name: '@page-sections/core', version: '0.4.0' };
  const svelte = {
    name: '@page-sections/svelte', version: '0.4.0', dependencies: { [core.name]: core.version }
  };
  const lock = { packages: { 'packages/core': structuredClone(core), 'packages/svelte': structuredClone(svelte) } };
  const write = () => {
    for (const [path, value] of [
      ['packages/core/package.json', core], ['packages/svelte/package.json', svelte],
      ['package-lock.json', lock]
    ] as const) writeFileSync(join(root, path), JSON.stringify(value));
  };
  write();
  writeFileSync(join(root, '.changeset/README.md'), '# Instructions');
  for (const name of ['core', 'svelte']) {
    writeFileSync(join(root, `packages/${name}/CHANGELOG.md`), '## 0.4.0\r\n\r\nRelease notes.\r\n');
  }
  return { root, core, svelte, lock, write };
}

it('accepts a fully prepared release without requiring another version PR', () => {
  expect(checkRelease(fixture().root)).toBe('0.4.0');
});

it('rejects pending changesets with an actionable preparation command', () => {
  const { root } = fixture();
  writeFileSync(join(root, '.changeset/new-feature.md'), 'Unconsumed change');
  expect(() => checkRelease(root)).toThrow('npm run release:version');
});

it('rejects mismatched public versions', () => {
  const state = fixture(); state.core.version = '0.5.0'; state.write();
  expect(() => checkRelease(state.root)).toThrow('same release version');
});

it('rejects an outdated internal dependency', () => {
  const state = fixture(); state.svelte.dependencies['@page-sections/core'] = '0.3.0'; state.write();
  expect(() => checkRelease(state.root)).toThrow('current core version');
});

it('rejects a stale package lock', () => {
  const state = fixture(); state.lock.packages['packages/core'].version = '0.3.0'; state.write();
  expect(() => checkRelease(state.root)).toThrow('Update package-lock.json');
});

it('rejects a stale internal dependency in the lockfile', () => {
  const state = fixture();
  state.lock.packages['packages/svelte'].dependencies['@page-sections/core'] = '0.3.0';
  state.write();
  expect(() => checkRelease(state.root)).toThrow('lockfile must use the current core dependency');
});

it('rejects a missing changelog for the selected version', () => {
  const { root } = fixture();
  writeFileSync(join(root, 'packages/svelte/CHANGELOG.md'), '## 0.3.0\n');
  expect(() => checkRelease(root)).toThrow('Missing changelog entry');
});
