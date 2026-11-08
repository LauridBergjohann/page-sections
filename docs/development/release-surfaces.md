# Navigation, hero and surface follow-up

The changeset prepares a minor release (0.3.0 from the current 0.2.0 packages). Package manifests remain at the published version until the normal Changesets version step. No packages have been published by this work.

## Changes

- `SurfaceTone` unifies the standard/muted choice. Card uses `tone`; CardGridSection and CarouselSection use `cardTone`, including JSON data and custom card snippet options. The default remains standard. Existing panel `tone` defaults to muted.
- Navigation uses neutral link text and a shared `--ps-navigation-shadow` token. Setting it to `none` retains the satellite outline. Canonical dimensions are unchanged.
- Hero eyebrows use accent color and uppercase lettering. Explicit margins separate eyebrow, heading, introduction and actions even with a host CSS reset.

## Consumer handoff: bergjohann-com

The website was checked with the locally built packages and `cardTone: "muted"` on both homepage collections. The installed 0.2.0 files and existing homepage JSON were then restored. This keeps the checked-in dependency lock and content validator usable before publication. Existing user changes to page colors and the hero gradient were preserved.

The website's own preference groups receive the shared shadow on their painted surface; the satellite wrapper stays transparent and has no outline. Language controls use neutral theme text. The dark link/accent palette uses a lighter teal so the new small hero eyebrow remains readable. The imprint publisher panel explicitly selects `tone: "muted"`, which already works with 0.2.0.

After both new packages are published, run in the website checkout:

```sh
npm install --save-exact @page-sections/core@0.3.0 @page-sections/svelte@0.3.0
git apply --check ../page-sections/docs/development/bergjohann-card-tones.patch
git apply ../page-sections/docs/development/bergjohann-card-tones.patch
npm run check
npm run build:preview
```

The [prepared JSON patch](bergjohann-card-tones.patch) only adds `cardTone: "muted"` to the two homepage grids. Update this patch against any intervening content edits before applying it. Commit the resulting package manifests, lockfile and JSON together. Header elevation and hero presentation then come directly from the new package.

## Validation

Package Svelte checks, 65 unit/SSR tests, 36 browser tests, documentation examples and independent tarball installs/builds in plain Svelte and SvelteKit pass. The final shadow-disable behavior is also covered in the presentation browser tests.

With the candidate packages, the website passes content/Svelte checks, 32 unit/component tests and 65 browser tests. Light/dark visual checks at 390px and 1920px confirm distinct card surfaces, neutral preference text, explicit hero spacing and a 1536px desktop header without horizontal overflow.
