import { resolve } from '$app/paths';

// Absolute paths keep shared navigation and asset data independent of the current route.
// The website config sets paths.relative to false for both SSR and client rendering.
export const base = resolve('/').replace(/\/$/, '');
