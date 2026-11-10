import { expect, test } from '@playwright/test';

for (const width of [390, 1600]) {
  test(`documentation is readable and linked without JavaScript at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const route of ['/docs/card-grid/', '/docs/code/', '/docs/core-api/', '/getting-started/installation/']) {
      const response = await page.goto('http://127.0.0.1:4174' + route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.getByRole('navigation', { name: 'Documentation chapters' })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const code = page.locator('.ps-code-block');
      expect(await code.count()).toBeGreaterThan(0);
      await expect(code.first().getByRole('button', { name: 'Copy code' })).toBeDisabled();
      await expect(page.locator('[style*="--ps-code-light"]').first()).toBeAttached();
    }
    await page.screenshot({ path: `.artifacts/website-no-js-${width}.png`, fullPage: true });
    await context.close();
  });
}

test('card settings update the preview and the copyable source together', async ({ page, context }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/docs/card-grid/');
  await page.getByRole('combobox', { name: 'Card variant', exact: true }).selectOption('catalog');
  await page.getByRole('combobox', { name: 'Card tone', exact: true }).selectOption('standard');
  await page.getByRole('combobox', { name: 'Card size', exact: true }).selectOption('l');
  await page.getByRole('combobox', { name: 'Media aspect', exact: true }).selectOption('1/1');
  const preview = page.locator('[data-preview]');
  await expect(preview.locator('[data-card-variant="catalog"]')).toHaveCount(4);
  await expect(preview.locator('.ps-card').first()).toHaveAttribute('data-tone', 'standard');
  await expect(preview.locator('.ps-card').first()).toHaveAttribute('data-ps-card-size', 'l');
  const code = page.locator('#playground .ps-code-block').first();
  await expect(code).toContainText('cardTone="standard"');
  await expect(code).toContainText('cardSize="l"');
  await expect(code).toContainText('mediaAspect="1/1"');
  await code.getByRole('button', { name: 'Copy code' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('mediaAspect="1/1"');
  await page.getByRole('button', { name: 'Reset example' }).click();
  await expect(code).toContainText('cardTone="muted"');
  await page.screenshot({ path: '.artifacts/website-card-grid.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('code composition supports languages, side order, wrapping and dark mode', async ({ page }) => {
  await page.goto('/docs/code/');
  await page.getByRole('combobox', { name: 'Language', exact: true }).selectOption('json');
  await page.getByRole('combobox', { name: 'Code position', exact: true }).selectOption('left');
  await page.getByLabel('Wrap long lines', { exact: true }).check();
  const preview = page.locator('[data-code-preview]');
  await expect(preview.locator('.ps-code-block')).toHaveAttribute('data-wrap', 'true');
  await expect(preview.locator('.ps-content-block').first()).toContainText('"type": "code"');
  await expect(preview.locator('[style*="--ps-code-light"]').first()).toBeAttached();
  await page.setViewportSize({ width: 1700, height: 1000 });
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  await expect(preview.locator('.ps-code-block')).toHaveAttribute('data-code-mode', 'dark');
  await page.screenshot({ path: '.artifacts/website-code-dark.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  const blocks = preview.locator('.ps-content-block');
  const first = await blocks.nth(0).boundingBox(), second = await blocks.nth(1).boundingBox();
  expect(second!.y).toBeGreaterThanOrEqual(first!.y + first!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('chapter search and public navigation discover the examples', async ({ page }) => {
  await page.goto('/docs/');
  await page.getByLabel('Find a topic', { exact: true }).fill('CodeBlock');
  const chapters = page.getByRole('navigation', { name: 'Documentation chapters' });
  await expect(chapters.getByRole('link', { name: 'Code', exact: true })).toBeVisible();
  await chapters.getByRole('link', { name: 'Code', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/code\/$/);
  await page.getByLabel('Find a topic', { exact: true }).fill('');
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Showcase', exact: true }).click();
  await expect(page.getByRole('link', { name: 'A personal portfolio', exact: true })).toBeVisible();
});

test('minimal demo renders a complete page without documentation infrastructure', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.getByRole('heading', { name: 'Field notes', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'A community garden', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Documentation chapters' })).toHaveCount(0);
  await context.close();
});
