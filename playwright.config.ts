import { defineConfig } from '@playwright/test';
const port = Number(process.env.PAGE_SECTIONS_TEST_PORT ?? 4175);
export default defineConfig({
  outputDir: 'test-results/library', testDir: 'tests', testMatch: '*.e2e.ts', testIgnore: 'website.e2e.ts', workers: 1,
  use: { baseURL: 'http://127.0.0.1:' + port, trace: 'retain-on-failure',
    ...(process.env.CI ? {} : { channel: 'chrome' }) },
  webServer: { command: (process.env.PAGE_SECTIONS_USE_BUILD ? '' : 'npm run build:tests && ') + 'npm run preview -w @page-sections/tests -- --port ' + port,
    url: 'http://127.0.0.1:' + port, timeout: 180000, reuseExistingServer: false }
});
