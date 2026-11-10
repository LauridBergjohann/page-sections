# Tests and verification

| Command | Scope |
| --- | --- |
| npm run check | Package builds and all Svelte/TypeScript checks |
| npm run check:layout | Generated CSS matches canonical tokens |
| npm run check:format | Readable source formatting across all apps |
| npm test | Core and SSR regressions, including code presentation |
| npm run check:docs | Website routes, API/token coverage and executable snippets |
| npm run test:e2e | Existing regressions against apps/tests on port 4175 |
| npm run test:website | Production website and minimal demo on ports 4174/4173 |
| npm run verify:packages | Independent plain-Svelte and SvelteKit tarball consumers |
| npm run verify | All non-browser release checks and application builds |
| npm run verify:published | Exact registry versions in independent consumers |

Install Chromium with npx playwright install chromium. CI uses the installed Chromium; local tests use Chrome. PAGE_SECTIONS_TEST_PORT can override the regression app port. Test servers do not reuse unrelated local servers. Run build-producing suites sequentially.

Documentation examples are literal exports named examples in their owning Svelte page. The checker parses them without executing them, writes temporary files in .artifacts/docs-examples and runs svelte-check. Optional group and filename fields keep multi-file examples together. CSS examples are parsed by the Svelte compiler. Shell commands are displayed but not executed.

The checker compares API indexes and CSS-variable/token tables against the packages. It checks internal documentation links and chapter navigation. No sibling Wiki repository is required. Public browser checks exercise settings, synchronized code, copy, mobile layout, dark mode, chapter search and content without JavaScript.

Reports and screenshots live under .artifacts; failures also retain traces under test-results. CI builds all apps, verifies package consumers and runs both browser suites.
