# Releases and first-time setup

Both packages start at 0.1.0 and version together through Changesets. CI validates types, core/SSR tests, generated CSS, tarballs installed in an independent consumer, and browser behavior. Package exports point only to `dist`; no workspace/source aliases are shipped.

## Current publication blocker

On 2026-11-06, a read-only npm check returned **E401 Unauthorized** for `npm whoami`. Public registry queries for both `@page-sections/core` and `@page-sections/svelte` returned **E404**. No successful publication is claimed. The locally tested tarballs are not registry releases. Work stops before Phase 2 until authentication/setup and registry verification succeed.

## One-time GitHub/npm configuration

1. Push the reviewed Page Sections implementation to `LauridBergjohann/page-sections`. Enable Actions and allow GitHub Actions to create pull requests. Protect `main` with CI as appropriate.
2. Ensure an authenticated npm organization maintainer can create public packages in the `page-sections` scope. Authenticate interactively with `npm login`; do not commit credentials. If first-time package creation is unavailable through the npm trusted-publisher UI, bootstrap both packages from the validated working tree using `npm publish -w @page-sections/core --access public` followed by `npm publish -w @page-sections/svelte --access public`, completing the account's required MFA. This is the explicit first-publication step; subsequent releases use OIDC.
3. For **each package**, configure an npm GitHub Actions trusted publisher: owner `LauridBergjohann`, repository `page-sections`, workflow filename **release.yml**, environment **npm**. Enable permission to publish directly with `npm publish` if the UI asks for allowed actions. Package `repository.url` must match the GitHub repository.
4. Create the GitHub environment `npm`, restrict it to `main`, and set repository variable `NPM_TRUSTED_PUBLISHING_ENABLED=true` only after setup is complete. This variable is a setup acknowledgement, not authentication.
5. If release-PR checks must run automatically, configure a narrowly scoped `RELEASE_PR_TOKEN` (or equivalent GitHub App setup) with repository contents/PR permissions. PRs created with the default GITHUB_TOKEN may not trigger other workflows; otherwise trigger/check CI manually before merging. No npm token is needed for routine OIDC publishing.
6. Run the release workflow. After both exact versions exist, run `npm run verify:published`. It queries npm and installs the registry versions into temporary applications outside the workspaces, then checks Svelte types, client build, SSR build, initial HTML and a separate SvelteKit production/prerender build. Keep `.artifacts/published-consumer.json` as the phase gate evidence.

Trusted publishing requires a matching supported CI identity and a sufficiently recent Node/npm CLI; this workflow uses GitHub-hosted Ubuntu, Node 24, npm 11 and `id-token: write`. See the [official npm trusted-publisher documentation](https://docs.npmjs.com/trusted-publishers/) for current setup fields and requirements.

## Subsequent releases

Add a changeset with `npm run changeset`. Merging the implementation into main creates/updates a release PR. Its version step updates both package versions, internal dependency and lockfile. After merging the version PR, the workflow verifies the artifacts again and publishes missing exact versions with provenance. Registry errors other than a genuine 404 abort publishing. Already published versions are skipped, allowing recovery from a partial two-package release.

`verify:published` is mandatory even when the publish command succeeds. Phase 2 must use those published exact versions, never local directories. If publication or registry-consumer checks fail, record the failure and remain in Phase 1.
