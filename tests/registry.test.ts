import { expect, it, vi } from 'vitest';
import { waitForPublishedVersion, retryRegistryOperation } from '../scripts/registry-readiness.mjs';

const available = { status: 0, stdout: '"0.2.0"', stderr: '' };
const failure = (code: string) => ({ status: 1, stdout: JSON.stringify({ error: { code, summary: 'Registry response' } }), stderr: '' });
const options = () => ({ attempts: 3, delayMs: 15_000, sleep: vi.fn().mockResolvedValue(undefined), log: vi.fn() });

it('accepts the exact published version without sleeping', async () => {
  const query = vi.fn().mockReturnValue(available);
  const config = options();
  await expect(waitForPublishedVersion('@page-sections/core', '0.2.0', query, config)).resolves.toBe('@page-sections/core@0.2.0');
  expect(query).toHaveBeenCalledExactlyOnceWith('@page-sections/core@0.2.0');
  expect(config.sleep).not.toHaveBeenCalled();
});

it.each(['E404', 'ETARGET', 'E429', 'E503', 'ETIMEDOUT'])('waits for registry readiness after %s', async code => {
  const query = vi.fn().mockReturnValueOnce(failure(code)).mockReturnValueOnce(failure(code)).mockReturnValue(available);
  const config = options();
  await expect(waitForPublishedVersion('@page-sections/core', '0.2.0', query, config)).resolves.toBe('@page-sections/core@0.2.0');
  expect(query).toHaveBeenCalledTimes(3);
  expect(config.sleep.mock.calls).toEqual([[15_000], [15_000]]);
});

it('fails after the bounded retry window when a version never appears', async () => {
  const query = vi.fn().mockReturnValue(failure('E404'));
  const config = options();
  await expect(waitForPublishedVersion('@page-sections/core', '0.2.0', query, config)).rejects.toThrow(/still unavailable after 3 registry queries/);
  expect(query).toHaveBeenCalledTimes(3);
  expect(config.sleep).toHaveBeenCalledTimes(2);
});

it.each(['E401', 'E403', 'EUNKNOWN'])('does not hide a permanent %s failure', async code => {
  const query = vi.fn().mockReturnValue(failure(code));
  const config = options();
  await expect(waitForPublishedVersion('@page-sections/core', '0.2.0', query, config)).rejects.toThrow(`(${code})`);
  expect(query).toHaveBeenCalledTimes(1);
  expect(config.sleep).not.toHaveBeenCalled();
});

it('handles stderr-only transient errors', async () => {
  const query = vi.fn().mockReturnValueOnce({ status: 1, stdout: '', stderr: 'npm error code ECONNRESET' }).mockReturnValue(available);
  await expect(waitForPublishedVersion('@page-sections/core', '0.2.0', query, options())).resolves.toBe('@page-sections/core@0.2.0');
});

it('rejects a mismatched version and process launch failures immediately', async () => {
  const config = options();
  await expect(waitForPublishedVersion('@page-sections/core', '0.2.0', () => ({ ...available, stdout: '"0.1.1"' }), config)).rejects.toThrow(/version mismatch/);
  await expect(waitForPublishedVersion('@page-sections/core', '0.2.0', () => ({ error: new Error('npm failed to start') }), config)).rejects.toThrow('npm failed to start');
  expect(config.sleep).not.toHaveBeenCalled();
});

// Reproduce the release race: metadata is visible while the tarball CDN still returns 404.
it('waits for the tarball after metadata succeeds, then retries a transient consumer install', async () => {
  const config = options();
  const metadata = vi.fn().mockReturnValue(available);
  const download = vi.fn().mockReturnValueOnce(failure('E404')).mockReturnValue({ status: 0, stdout: 'downloaded' });
  const install = vi.fn().mockReturnValueOnce(failure('E404')).mockReturnValue({ status: 0, stdout: 'installed' });
  await waitForPublishedVersion('@page-sections/svelte', '0.2.0', metadata, config);
  await expect(retryRegistryOperation('tarball download', download, config)).resolves.toMatchObject({ stdout: 'downloaded' });
  await expect(retryRegistryOperation('consumer install', install, config)).resolves.toMatchObject({ stdout: 'installed' });
  expect(metadata).toHaveBeenCalledTimes(1);
  expect(download).toHaveBeenCalledTimes(2);
  expect(install).toHaveBeenCalledTimes(2);
  expect(config.sleep).toHaveBeenCalledTimes(2);
});

it.each(['E401', 'E403', 'ERESOLVE', 'EINTEGRITY', 'ELIFECYCLE'])('does not retry permanent installation failure %s', async code => {
  const operation = vi.fn().mockReturnValue(failure(code));
  const config = options();
  await expect(retryRegistryOperation('consumer install', operation, config)).rejects.toThrow(code);
  expect(operation).toHaveBeenCalledTimes(1);
  expect(config.sleep).not.toHaveBeenCalled();
});

it('allows ten minutes of propagation pauses by default and still fails at the limit', async () => {
  const config = { sleep: vi.fn().mockResolvedValue(undefined), log: vi.fn() };
  const download = vi.fn().mockReturnValue(failure('E404'));
  await expect(retryRegistryOperation('tarball download', download, config)).rejects.toThrow('after 41 registry queries');
  expect(download).toHaveBeenCalledTimes(41);
  expect(config.sleep).toHaveBeenCalledTimes(40);
  expect(config.sleep).toHaveBeenLastCalledWith(15_000);
});
