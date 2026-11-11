# Development guide

Public documentation is maintained only as Svelte pages in [apps/website](../../apps/website). This directory contains contributor and maintainer instructions, not another user guide.

Use Node 24 and npm 11, matching CI and hosting. On PowerShell with script restrictions, use npm.cmd.

| Path | Responsibility |
| --- | --- |
| packages/core | Serializable models and pure layout utilities |
| packages/svelte | DOM components, CSS and optional highlighting adapter |
| apps/website | Public showcase and interactive documentation |
| apps/demo | Minimal one-page consumer |
| apps/tests | Browser regression application |
| tests | Core, SSR, browser and artifact-consumer checks |
| scripts | Generation, documentation checks and release verification |

- [Architecture and package boundaries](architecture.md)
- [Tests and verification](testing.md)
- [Application development](demo.md)
- [Documentation authoring and hosting](documentation.md)
- [Versioning and releases](releasing.md)
- [Spatial Elements integration contract](spatial-elements-adoption.md)
- [API observations](api-notes.md)

Build-producing commands run sequentially because package output is shared. Keep LICENSE and NOTICE attribution intact. Generated dist/build outputs are ignored; commit package source, generated layout CSS and lockfile changes.
