# Application development

See the [application index](../../apps/README.md) for commands and ports. All apps use SvelteKit and adapter-static; neither published package depends on SvelteKit.

The website is the public product and documentation. The demo stays deliberately small. The test app holds stable geometry and interaction fixtures and is not deployed publicly.

Run npm ci, then npm run dev:website, npm run dev:demo or npm run dev:tests. Each first builds shared packages. Start these commands sequentially. Changes to application files use HMR; rebuild package sources when changing the libraries.

npm run build:apps builds all three static applications. Production previews serve their existing build directories. Server-rendered HTML includes content and native links; hydration adds copy buttons, interactive examples and appearance controls.

The two SVG illustrations are local. The video example uses an external MDN-hosted clip; its poster and surrounding content remain available offline. Use a stable local fixture for tests that must validate playback itself.
