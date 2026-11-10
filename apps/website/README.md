<img src="../../assets/page-sections-logo.svg" width="48" height="48" alt="Page Sections logo" />

# Page Sections website

The public product website combines a showcase, getting started and interactive reference. Its Svelte pages are the single source of public documentation. No Wiki checkout or Markdown content loader is needed.

```sh
npm ci
npm run dev:website
```

Open http://127.0.0.1:5174. `npm run build:website` creates static HTML in `apps/website/build`; `npm run preview:website` serves it on port 4174.

Routes:

- `/showcase/`: composed pages and focused examples.
- `/getting-started/`: installation, a first page and the content model.
- `/docs/`: interactive guides and complete API references.

See [documentation authoring](../../docs/development/documentation.md) for adding pages, executable snippets and navigation entries. Hosting setup is documented there too.
