import { setTimeout as delay } from 'node:timers/promises';

const retryableCodes = new Set(['E404', 'ETARGET', 'E429', 'E500', 'E502', 'E503', 'E504', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'ECONNRESET', 'EAI_AGAIN']);

/** Wait for npm's exact-version metadata, without retrying authentication or consumer-build failures. */
export async function waitForPublishedVersion(name, version, query, { attempts = 21, delayMs = 15_000, sleep = delay, log = console.log } = {}) {
  const spec = `${name}@${version}`;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const result = await query(spec);
    if (result.error) throw result.error;
    if (result.status === 0) {
      const actual = JSON.parse(result.stdout);
      if (actual !== version) throw new Error(`Registry version mismatch for ${spec}: ${JSON.stringify(actual)}`);
      log(`${spec} is available in the npm registry.`);
      return spec;
    }
    let code;
    try { code = JSON.parse(result.stdout).error?.code; } catch { /* Some npm network errors only include stderr. */ }
    code ??= /npm (?:error|ERR!) code (\S+)/.exec(result.stderr ?? '')?.[1];
    const detail = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim();
    if (!retryableCodes.has(code)) throw new Error(`Registry query failed for ${spec} (${code ?? result.status}).\n${detail}`);
    if (attempt === attempts) throw new Error(`${spec} is still unavailable after ${attempts} registry queries (${code}).\n${detail}`);
    log(`${spec}: registry returned ${code}; retry ${attempt + 1}/${attempts} in ${delayMs / 1000}s.`);
    await sleep(delayMs);
  }
}
