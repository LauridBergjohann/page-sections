import { setTimeout as delay } from 'node:timers/promises';

const retryableCodes = new Set(['E404', 'ETARGET', 'E429', 'E500', 'E502', 'E503', 'E504', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'ECONNRESET', 'EAI_AGAIN']);

/** Retry only registry propagation/network failures, never auth, integrity or build failures. */
export async function retryRegistryOperation(label, operation, { attempts = 41, delayMs = 15_000, sleep = delay, log = console.log } = {}) {
  if (!Number.isInteger(attempts) || attempts < 1 || !Number.isFinite(delayMs) || delayMs < 0) {
    throw new Error('Registry retry attempts must be positive and delayMs must be non-negative.');
  }
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const result = await operation();
    if (result.error) throw result.error;
    if (result.status === 0) return result;
    let code;
    try { code = JSON.parse(result.stdout).error?.code; } catch { /* Some npm network errors only include stderr. */ }
    code ??= /npm (?:error|ERR!) code (\S+)/.exec(result.stderr ?? '')?.[1];
    const detail = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim();
    if (!retryableCodes.has(code)) throw new Error(`${label} failed (${code ?? result.status}).\n${detail}`);
    if (attempt === attempts) throw new Error(`${label} is still unavailable after ${attempts} registry queries (${code}).\n${detail}`);
    log(`${label}: registry returned ${code}; retry ${attempt + 1}/${attempts} in ${delayMs / 1000}s.`);
    await sleep(delayMs);
  }
}

/** Metadata readiness alone does not guarantee that npm's tarball CDN is ready. */
export async function waitForPublishedVersion(name, version, query, options = {}) {
  const spec = `${name}@${version}`;
  const result = await retryRegistryOperation(spec, () => query(spec), options);
  const actual = JSON.parse(result.stdout);
  if (actual !== version) throw new Error(`Registry version mismatch for ${spec}: ${JSON.stringify(actual)}`);
  (options.log ?? console.log)(`${spec} metadata is available in the npm registry.`);
  return spec;
}
