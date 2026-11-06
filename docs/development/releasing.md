# Releases

Both packages are published on npm. Release verification is based on exact registry versions and independent consumer builds, not on the existence of local tarballs.

## Versioning

The npm workspaces are `@page-sections/core` and `@page-sections/svelte`; the demo is private. Changesets versions both public packages together through its fixed group.

```bash
npm run changeset
```

Add a changeset for a publishable package change, including a package README change when it should appear in a new npm artifact. `release:version` runs changeset version and updates the lockfile. Package READMEs in already published versions do not change merely because GitHub Markdown changes.

## Existing release workflow

`.github/workflows/release.yml` runs on main pushes or manual dispatch on main. The version job installs dependencies and uses changesets/action to create/update a release PR. It uses RELEASE_PR_TOKEN when configured, otherwise github.token. PRs created with the default token may need checks triggered separately before merging.

When no changesets remain, the publish job runs in the `npm` environment. It checks `NPM_TRUSTED_PUBLISHING_ENABLED`, installs npm 11, runs verification and browser tests, publishes missing exact versions with provenance, then runs `verify:published`. Already published exact versions are skipped; registry responses other than success/404 abort publication.

## Trusted-publisher configuration

Maintain the following npm trusted publisher for each package:

| Setting | Value |
| --- | --- |
| GitHub owner | LauridBergjohann |
| Repository | page-sections |
| Workflow filename | release.yml |
| Environment | npm |
| Allowed publishing action | Direct npm publish |

GitHub uses a hosted Ubuntu runner, Node 24, npm 11 and id-token: write. Keep the npm environment restricted to the intended branch and the repository variable NPM_TRUSTED_PUBLISHING_ENABLED consistent with actual configuration. Allow Actions to create release PRs. Routine publishing uses OIDC rather than a committed npm token.

See [npm's trusted-publisher documentation](https://docs.npmjs.com/trusted-publishers/) for current provider requirements. No credentials belong in source or documentation.

## Verification and recovery

```bash
npm run verify
npm run test:e2e
npm run verify:published
```

verify:packages packs the actual outputs and installs both together outside the monorepo. verify:published instead queries npm for package.json's exact versions and installs those registry artifacts. Both validate plain Svelte types/client/SSR/prerender output and a separate SvelteKit build. Reports are saved under .artifacts.

If one package publishes and the other fails, fix the external cause and rerun the workflow; the script skips the published version. Do not claim successful release solely from a publish command: retain the registry consumer report. Wiki publishing is separate and is described in [wiki.md](wiki.md).
