# Browser test application

This private SvelteKit app retains the reference routes used by the regression suite. It is not the public documentation or a starter template.

Run `npm run test:e2e` from the repository root. Playwright builds and serves this app on port 4175, then checks geometry, SSR, navigation, surfaces and content behavior. Set `PAGE_SECTIONS_TEST_PORT` to choose another port.

For interactive inspection, use `npm run dev:tests` (port 5175). Website and minimal-demo checks run separately through `npm run test:website`.
