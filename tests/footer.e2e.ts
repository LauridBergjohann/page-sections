import { expect, test } from '@playwright/test';

test('footer follows the content grid across all viewport layouts', async ({ page }) => {
  await page.goto('/footer/');
  const footer = page.locator('.footer-fixture .ps-footer');
  for (const width of [320, 599, 600, 839, 840, 1199, 1200, 1536, 1540, 1551, 1552, 1599, 1600, 1808, 1809, 2300, 2600]) {
    await page.setViewportSize({ width, height: 900 });
    const main = (await footer.locator('.ps-footer-main').boundingBox())!;
    const bar = (await footer.locator('.ps-footer-bar-content').boundingBox())!;
    const expectedWidth = width < 1600 ? Math.min(width - 16, 1536) : width < 1809 ? width - 272 : 1536;
    expect(main.width).toBeCloseTo(expectedWidth, 0);
    expect(main.x).toBeCloseTo((width - expectedWidth) / 2, 0);
    expect(main.x).toBeGreaterThanOrEqual(8);
    expect(width - main.x - main.width).toBeGreaterThanOrEqual(8);
    expect(bar.x).toBeCloseTo(main.x, 0);
    expect(bar.width).toBeCloseTo(main.width, 0);
    expect(bar.height).toBeGreaterThanOrEqual(40);
    await expect(footer.locator('.ps-footer-grid')).toHaveCSS('padding-top', '24px');
    await expect(footer.locator('.ps-footer-grid')).toHaveCSS('padding-bottom', '24px');
    await expect(footer.locator('.ps-footer-footnote')).toHaveCSS('padding-inline-start', '8px');
    await expect(footer.locator('.ps-footer-links')).toHaveCSS('padding-inline-end', '8px');
    const links = (await footer.locator('.ps-footer-links ul').boundingBox())!;
    expect(main.x + main.width - links.x - links.width).toBeCloseTo(8, 0);
    const menu = footer.getByRole('navigation', { name: 'Footer navigation', includeHidden: true });
    if (width >= 1600) await expect(menu).toBeVisible();
    else await expect(menu).toBeHidden();
    const brand = (await footer.locator('.ps-footer-brand').boundingBox())!;
    const social = (await footer.locator('.ps-footer-social').boundingBox())!;
    if (width >= 1200 && width < 1600) {
      expect(social.x).toBeGreaterThan(brand.x + brand.width - 1);
      expect(social.width).toBeCloseTo(brand.width, 0);
      expect(social.y).toBeCloseTo(brand.y, 0);
      const first = (await footer.locator('.ps-footer-social li').nth(0).boundingBox())!;
      const second = (await footer.locator('.ps-footer-social li').nth(1).boundingBox())!;
      expect(first.x).toBeGreaterThan(second.x);
      expect(first.x + first.width).toBeCloseTo(social.x + social.width, 0);
    }
    else expect(social.y).toBeGreaterThanOrEqual(brand.y + brand.height);
    if (width >= 1600) {
      const first = (await footer.locator('.ps-footer-social li').nth(0).boundingBox())!;
      const second = (await footer.locator('.ps-footer-social li').nth(1).boundingBox())!;
      expect(second.x - first.x).toBeCloseTo((main.width - 24) / 12, 0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if ([320, 840, 1200, 1600, 1809, 2600].includes(width)) await footer.screenshot({ path: test.info().outputPath(`footer-${width}.png`) });
  }
});

test('optional regions collapse and the bar supports wrapping and custom themes', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/footer/');
  const footer = page.locator('.footer-fixture .ps-footer');
  await page.getByLabel('Brand and social').uncheck();
  await expect(footer.locator('.ps-footer-main')).toBeVisible();
  await page.setViewportSize({ width: 840, height: 900 });
  await expect(footer.locator('.ps-footer-main')).toBeHidden();
  await page.getByLabel('Menu', { exact: true }).uncheck();
  await expect(footer.locator('.ps-footer-main')).toHaveCount(0);
  expect((await footer.boundingBox())!.height).toBeGreaterThanOrEqual(40);
  await page.getByLabel('Brand and social').check();
  await page.getByLabel('Dark footer').check();
  await expect(footer.locator('.ps-footer-bar')).toHaveCSS('background-color', 'rgb(40, 56, 74)');
  await page.getByLabel('Custom footer theme').check();
  await expect(footer.locator('.ps-footer-brand a')).toHaveCSS('color', 'rgb(255, 204, 0)');
  await expect(footer.locator('.ps-footer-brand a')).toHaveCSS('text-decoration-line', 'underline');
  await expect(footer.locator('.ps-footer-main')).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await expect(footer.locator('.ps-footer-main')).toHaveCSS('color', 'rgb(254, 220, 186)');
  await expect(footer.locator('.ps-footer-main')).toHaveCSS('border-radius', '4px');
  await expect(footer.locator('.ps-footer-main')).toHaveCSS('box-shadow', 'none');
  await expect(footer.locator('.ps-footer-bar')).toHaveCSS('background-color', 'rgb(101, 67, 33)');
  await expect(footer.locator('.ps-footer-bar')).toHaveCSS('color', 'rgb(171, 205, 239)');
  const separator = await footer.locator('.ps-footer-links li').nth(1).evaluate(el => {
    const css = getComputedStyle(el, '::before');
    return { color: css.borderInlineStartColor, opacity: css.opacity };
  });
  expect(separator).toEqual({ color: 'rgb(171, 205, 239)', opacity: '0.3' });
  await page.setViewportSize({ width: 320, height: 900 });
  await footer.locator('.ps-footer-footnote').evaluate(el => el.textContent = 'A much longer copyright notice that must wrap across several lines without clipping.');
  expect((await footer.locator('.ps-footer-bar').boundingBox())!.height).toBeGreaterThan(40);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('social, menu and legal links remain usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1920, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:' + (process.env.PAGE_SECTIONS_TEST_PORT ?? 4175) + '/footer/');
  const footer = page.locator('.footer-fixture .ps-footer');
  await expect(footer.getByRole('link', { name: 'GitHub' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Product 1' })).toHaveAttribute('href', '/examples/');
  await footer.getByRole('link', { name: 'Privacy', exact: true }).click();
  await expect(page).toHaveURL(/\/examples\/legal\//);
  await context.close();
});
