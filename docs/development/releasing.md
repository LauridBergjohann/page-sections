# Releases

Both packages are published on npm. Release verification is based on exact registry versions and independent consumer builds, not on the existence of local tarballs.

## One pull request per release

The npm workspaces are `@page-sections/core` and `@page-sections/svelte`; all three applications are private. Changesets versions both public packages together through its fixed group.

```bash
npm run changeset
npm run release:version
npm run verify
```

Prepare the release on the feature branch before merging its pull request. Add a changeset for a publishable package change, including a package README change when it should appear in a new npm artifact. `release:version` consumes the changesets, updates both package versions and changelogs, and updates the lockfile. Commit these generated changes in the same PR as the implementation. The reviewed version is exactly the version published after merge; no bot commit or second PR is needed. Package READMEs in already published versions do not change merely because GitHub Markdown changes.

`npm run check:release`, included in `verify`, rejects unconsumed changesets, mismatched package versions/dependencies, stale lockfile versions and missing changelog entries. Make the CI `verify` job a required check for main. The check validates the prepared files; it does not infer whether an arbitrary source change needs a version bump. For package changes, prepare a new version; for website-only or tooling changes, keep the existing package versions. If main advances while a release PR is open, reconcile the version and changelog before merging.

## Merge and publish

`.github/workflows/release.yml` runs directly on [pushes to main](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#push), including PR merges, or manual dispatch on main. It does not create pull requests or write commits. The single publish job runs in the existing `npm` environment: it checks `NPM_TRUSTED_PUBLISHING_ENABLED`, installs npm 11, runs verification and both browser suites, publishes missing exact versions with provenance, then runs `verify:published`. Failed checks stop publication. Already published exact versions are skipped; registry responses other than success/404 abort publication. Reports and browser failure artifacts are uploaded even when the job fails.

Vercel independently deploys the website from main once the repository is connected. Its PR previews and production deployment do not require a second PR, but npm and Vercel are separate jobs: one can succeed while the other fails. See [documentation hosting](documentation.md). This workflow publishes npm packages; it does not create a GitHub Release or tag.

## Trusted-publisher configuration

Maintain the following npm trusted publisher for each package:

| Setting | Value |
| --- | --- |
| GitHub owner | LauridBergjohann |
| Repository | page-sections |
| Workflow filename | release.yml |
| Environment | npm |
| Allowed publishing action | Direct npm publish |

GitHub uses a hosted Ubuntu runner, Node 24, npm 11 and id-token: write. Keep the npm environment restricted to main and the repository variable NPM_TRUSTED_PUBLISHING_ENABLED consistent with actual configuration. The workflow filename and environment remain unchanged, so the existing trusted-publisher registration continues to apply. RELEASE_PR_TOKEN and permission for Actions to create PRs are no longer needed. Routine publishing uses OIDC rather than a committed npm token. If the npm environment has required reviewers, GitHub still pauses for their approval; fully automatic publishing requires environment rules without a manual approval step.

See [npm's trusted-publisher documentation](https://docs.npmjs.com/trusted-publishers/) for current provider requirements. No credentials belong in source or documentation.

## Verification and recovery

```bash
npm run verify
npm run test:e2e
npm run test:website
npm run verify:published
```

verify:packages packs the actual outputs and installs both together outside the monorepo. verify:published instead queries npm for package.json's exact versions and installs those registry artifacts. Both validate plain Svelte types/client/SSR/prerender output and a separate SvelteKit build. Reports are saved under .artifacts.

npm may accept a publish while the version is still being processed. The published verifier therefore queries exact-version metadata up to 21 times, with 15-second pauses and fresh registry revalidation. Each query has a 15-second fetch timeout and no nested npm retries. Only missing-version, throttling and selected temporary server/network failures are retried; authentication errors, mismatched versions and consumer build failures still fail immediately. Registry installs also prefer fresh metadata. A successful publish command alone is not proof that the package is ready for installation.

If verification failed immediately after npm reported processing, first run `npm run verify:published` again once the versions are available. No new version is needed for that verification. After confirming availability, the failed GitHub publish job can also be rerun: the publisher skips versions already present in npm and then verifies them. Do not bump a package version solely to recover from delayed registry visibility.

If one package publishes and the other fails, fix the external cause and rerun the workflow; the script skips the published version. Do not claim successful release solely from a publish command: retain the registry consumer report. Website deployment is separate from npm publishing; see [documentation hosting](documentation.md).
