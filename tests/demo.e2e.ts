import { expect, test } from '@playwright/test';
for (const width of [375, 840, 1600]) {
  test(`without JavaScript at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    const page = await context.newPage(); await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Browse' })).toBeVisible();
    await expect(page.locator('#collection a')).toHaveCount(3);
    await expect(page.locator('#browse a')).toHaveCount(5);
    await expect(page.locator('#browse-track')).toHaveCSS('scroll-snap-type', 'x mandatory');
    await page.locator('#browse-track').focus(); await page.keyboard.press('ArrowRight');
    await expect.poll(() => page.locator('#browse-track').evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
    await page.getByText('Examples', { exact: true }).click();
    await expect(page.getByRole('link', { name: 'Cards', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width >= 1600) {
      const left = await page.getByRole('group', { name: 'Language' }).boundingBox();
      const right = await page.getByRole('group', { name: 'Theme' }).boundingBox();
      const menu = await page.getByRole('link', { name: 'Page Sections', exact: true }).boundingBox();
      expect(left!.x + left!.width).toBeLessThan(menu!.x);
      expect(right!.x).toBeGreaterThan(menu!.x + menu!.width);
    }
    await page.screenshot({ path: `.artifacts/demo-no-js-${width}.png`, fullPage: true });
    if (width >= 840) {
      await page.locator('#layout').evaluate(el => el.style.width = '590px');
      const columns = await page.locator('#layout .ps-content-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
      expect(columns).toBe(4);
    }
    await context.close();
  });
}
test('hydrates without errors and works without WebGPU', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'warning' || m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(() => Object.defineProperty(navigator, 'gpu', { value: undefined }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  await expect(page.locator('[data-ps-theme]')).toHaveAttribute('data-ps-theme', 'dark');
  await page.getByRole('button', { name: 'Next cards' }).click();
  await expect.poll(() => page.locator('#browse-track').evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  expect(errors.filter(e => !e.includes('ERR_') && !e.includes('Failed to load resource'))).toEqual([]);
});
