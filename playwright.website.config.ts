import { defineConfig } from '@playwright/test';
export default defineConfig({
  outputDir: 'test-results/website', testDir: 'tests', testMatch: 'website.e2e.ts', workers: 1,
  use: { baseURL: 'http://127.0.0.1:4174', trace: 'retain-on-failure',
    ...(process.env.CI ? {} : { channel: 'chrome' }) },
  webServer: [
    { command: (process.env.PAGE_SECTIONS_USE_BUILD ? '' : 'npm run build:website && ') + 'npm run preview:website', url: 'http://127.0.0.1:4174', timeout: 180000, reuseExistingServer: false },
    { command: (process.env.PAGE_SECTIONS_USE_BUILD ? '' : 'npm run build -w @page-sections/demo && ') + 'npm run preview -w @page-sections/demo', url: 'http://127.0.0.1:4173', timeout: 120000, reuseExistingServer: false }
  ]
});
