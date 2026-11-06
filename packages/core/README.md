# @page-sections/core

Framework-independent models, content-grid calculations and section registries extracted from Spatial Elements Beta.8. No Svelte, DOM, Three.js or GPU dependency.

```ts
import { resolveContentGrid, resolveContentSpan, SectionRegistry } from '@page-sections/core';
const grid = resolveContentGrid(840); // eight columns, 16px gap
const columns = resolveContentSpan({ xs: 4, m: 5 }, grid.size);
```

See the [documentation](https://github.com/LauridBergjohann/page-sections/tree/main/docs) for models, layouts and extension. MPL-2.0; see NOTICE.
