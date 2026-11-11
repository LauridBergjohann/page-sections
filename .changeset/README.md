<img src="../assets/page-sections-logo.svg" alt="Page Sections logo" width="64" height="64" />

# Changesets

For public package changes, run `npm run changeset` and then `npm run release:version` on the feature branch. Commit the generated package versions, changelogs and lockfile in the same PR. Both packages version together; merging into main verifies and publishes them without a second PR. See the [release guide](../docs/development/releasing.md).
