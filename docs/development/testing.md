# Tests and verification

| Command | Scope |
| --- | --- |
| npm run check | Package builds and all Svelte/TypeScript checks |
| npm run check:ci | Pinned Playwright dependency, lockfile and both CI container images agree |
| npm run check:layout | Generated CSS matches canonical tokens |
| npm run check:format | Readable source formatting across all apps |
| npm test | Core and SSR regressions, including code presentation |
| npm run check:docs | Website routes, API/token coverage and executable snippets |
| npm run test:e2e | Existing regressions against apps/tests on port 4175 |
| npm run test:website | Production website and minimal demo on ports 4174/4173 |
| npm run verify:packages | Independent plain-Svelte and SvelteKit tarball consumers |
| npm run verify | All non-browser release checks and application builds |
| npm run verify:published | Exact registry versions in independent consumers |

Local browser tests use Chrome. CI and release jobs run inside the official Playwright Noble container, which already contains Chromium and its OS dependencies; no apt/browser installation step is needed. Node 24 is configured separately by setup-node. When updating Playwright, update the exact @playwright/test version, lockfile and both workflow image tags together; check:ci catches mismatches before building. See [Playwright containers](https://playwright.dev/docs/docker). PAGE_SECTIONS_TEST_PORT can override the regression app port. Test servers do not reuse unrelated local servers. Run build-producing suites sequentially.

Documentation examples are literal exports named examples in their owning Svelte page. The checker parses them without executing them, writes temporary files in .artifacts/docs-examples and runs svelte-check. Optional group and filename fields keep multi-file examples together. CSS examples are parsed by the Svelte compiler. Shell commands are displayed but not executed.

The checker compares API indexes and CSS-variable/token tables against the packages. It checks internal documentation links and chapter navigation. No sibling Wiki repository is required. Public browser checks exercise settings, synchronized code, copy, mobile layout, dark mode, chapter search and content without JavaScript.

Reports and screenshots live under .artifacts; failures also retain traces under test-results. CI builds all apps, verifies package consumers and runs both browser suites.

Workflow uploads include only .artifacts/*-consumer.json and test-results/, with hidden-file support enabled. Temporary documentation consumers and their dependencies are not uploaded. If a job fails before producing any report, the upload step is skipped; the job log remains available.
