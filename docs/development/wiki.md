# Editing and publishing the Wiki

User documentation lives in the separate Git repository `https://github.com/LauridBergjohann/page-sections.wiki.git`. The normal local layout is sibling checkouts named page-sections and page-sections.wiki. There is no automatic synchronization or duplicate Wiki source in the main repository.

If needed, clone it from the parent directory:

```bash
git clone https://github.com/LauridBergjohann/page-sections.wiki.git
```

Home.md is the landing page; _Sidebar.md contains the navigation; _Footer.md provides repository links. Inside the Wiki, use relative Markdown links with file extensions, such as `[Quick Start](Quick-Start.md)` or `[Layout](Section-and-ContentGrid.md#layout)`, and relative asset paths such as `assets/page-sections-logo.svg`. This makes the checkout readable in local editors and portable to another location. Links from npm READMEs to the Wiki still use full Wiki URLs; links to external websites or the separate project repository remain absolute. Keep the sidebar and related-page links current when renaming files.

## Review the prepared changes

From the main repository:

```bash
npm run check:docs
git diff -- README.md packages/core/README.md packages/svelte/README.md docs
git -C ../page-sections.wiki status --short
git -C ../page-sections.wiki diff
```

New Wiki files are untracked until added, so git diff alone does not show their contents. Open them for review or stage them and inspect git diff --cached before committing. Check the live Wiki links after publication; before the push, the documentation checker resolves their targets against local files.

## Publish after review

Run these yourself after approving the complete local Wiki changes:

```bash
git -C ../page-sections.wiki add -- '*.md'
git -C ../page-sections.wiki diff --cached --check
git -C ../page-sections.wiki diff --cached
git -C ../page-sections.wiki commit -m "docs: add complete Page Sections user guide"
git -C ../page-sections.wiki push origin HEAD
```

Commit/push the main repository documentation separately through its normal review process. Publishing the Wiki does not update npm package READMEs; those ship with the next package release. Preserve the Wiki as the canonical detailed reference and keep READMEs focused on onboarding.
