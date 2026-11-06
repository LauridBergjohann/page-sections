import { defineConfig } from '@playwright/test';
const port = process.env.PAGE_SECTIONS_TEST_PORT ?? '4173';
export default defineConfig({
  testDir: 'tests',
  testMatch: '*.e2e.ts',
  use: { baseURL: 'http://127.0.0.1:' + port },
  webServer: {
    command: process.env.PAGE_SECTIONS_TEST_PORT
      ? 'npm run build:demo && npm run preview -w @page-sections/demo -- --port ' + port
      : 'npm run demo',
    url: 'http://127.0.0.1:' + port,
    timeout: 120000,
    reuseExistingServer: !process.env.CI && !process.env.PAGE_SECTIONS_TEST_PORT
  }
});
