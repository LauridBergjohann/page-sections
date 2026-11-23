---
'@page-sections/svelte': patch
---

Unify header and content-menu popups with an on-demand page blur, active disclosure triggers and native top-layer placement. Repair reopening a mobile menu after outside dismissal, preserve native disclosure behavior without JavaScript, and prevent desktop menu labels from wrapping.

Constrain the content menu to the sections, excluding pageEnd navigation. Attached menus preserve matching 16px top/bottom insets; detached menus end flush, and compact controls also scroll away with the content.

Use the responsive grid inset for content-page breadcrumbs: 12px at XS and 16px at S and M.
