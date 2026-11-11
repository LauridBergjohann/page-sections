# Applications

All three applications consume the workspace packages by name. They are private and are never published to npm.

| Application | Purpose | Development | Preview |
| --- | --- | --- | --- |
| [Website](website) | Public showcase, getting started and interactive documentation | `npm run dev:website` (5174) | `npm run preview:website` (4174) |
| [Demo](demo) | Minimal, copyable single-page consumer | `npm run dev:demo` (5173) | `npm run demo` (4173, builds first) |
| [Tests](tests) | Stable browser regression fixtures | `npm run dev:tests` (5175) | `npm run preview -w @page-sections/tests` (4175) |

Run commands from the repository root after `npm ci`, using Node 24. `npm run build:apps` builds all packages and applications. Keep build-producing commands sequential because they replace the same package output.

Public documentation lives only in the website's Svelte pages. See the [authoring and migration record](../docs/development/documentation.md). The test app retains the old reference routes so existing geometry and behavior checks stay meaningful while the public website evolves.
