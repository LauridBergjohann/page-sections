import { test, expect } from '@playwright/test';

for (const [width, spans, columns, gap] of [[390, [2, 2, 4], 4, 12], [720, [2, 2, 3], 6, 16], [1000, [2, 2, 4], 8, 16], [1440, [2, 3, 4], 12, 24]] as const) {
  test('overlay grid and carousel use the requested spans at ' + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/card-overlay/');
    for (const [index, size] of (['s', 'm', 'l'] as const).entries()) {
      for (const kind of ['cardGrid', 'carousel']) {
        const section = page.locator('#' + kind.toLowerCase() + '-' + size);
        const card = section.locator('.ps-card').first();
        const sectionWidth = (await section.boundingBox())!.width;
        const expected = ((sectionWidth - (columns + 1) * gap) / columns) * spans[index] + (spans[index] - 1) * gap;
        const box = (await card.boundingBox())!;
        expect(box.width).toBeCloseTo(expected, 1);
        expect(box.height).toBeCloseTo(box.width, 1);
        await expect(card).toHaveAttribute('data-media-fit', 'cover');
        await expect(card).toHaveAttribute('data-media-hover-zoom', 'false');
        await expect(card.locator('img')).toHaveCSS('object-fit', 'cover');
        const media = (await card.locator('.media-frame').boundingBox())!;
        expect(media.height).toBeCloseTo(box.height, 1);
        const copy = (await card.locator('.text').boundingBox())!;
        expect(copy.y).toBeGreaterThanOrEqual(box.y - .1);
        expect(copy.y + copy.height).toBeLessThanOrEqual(box.y + box.height + .1);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.screenshot({ path: '.artifacts/card-overlay-' + width + '.png', fullPage: true });
  });
}

test('overlay colors, independent links and long copy work across themes', async ({ page }) => {
  await page.goto('/card-overlay/');
  const card = page.locator('#cardgrid-m .ps-card').first();
  for (const theme of ['Dark', 'Light']) {
    await page.locator('.settings > summary').click();
    await page.getByRole('button', { name: theme, exact: true }).click();
    await page.keyboard.press('Escape');
    await expect(card.locator('.title')).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(page.locator('#custom .title')).toHaveCSS('color', 'rgb(17, 17, 17)');
    await expect(page.locator('#custom .ps-prose p')).toHaveCSS('color', 'rgb(17, 17, 17)');
    await expect(page.locator('#custom .ps-prose h3')).toHaveCSS('color', 'rgb(17, 17, 17)');
  }
  const custom = (await page.locator('#custom .ps-card').boundingBox())!;
  await expect(page.locator('#custom .ps-card')).toHaveAttribute('data-media-hover-zoom', 'false');
  expect(custom.width / custom.height).toBeCloseTo(4 / 3, 2);
  const long = page.locator('#long .ps-card');
  expect((await long.boundingBox())!.height).toBeCloseTo(160, 1);
  const copy = long.locator('.text');
  await copy.focus();
  await page.keyboard.press('End');
  await expect.poll(() => copy.evaluate(el => el.scrollTop)).toBeGreaterThan(100);
  await long.getByRole('link', { name: 'Independent action' }).click();
  await expect(page).toHaveURL(/#action$/);
  await card.locator('.media-link').click({ position: { x: 10, y: 10 } });
  await expect(page).toHaveURL(/#destination$/);
  const selected = await long.locator('.description').evaluate(el => { const range = document.createRange(); range.selectNodeContents(el); const selection = window.getSelection()!; selection.removeAllRanges(); selection.addRange(range); return selection.toString(); });
  expect(selected).toContain('Long copy remains selectable');
  expect((await page.locator('#missing .ps-card').boundingBox())!.height).toBeCloseTo(160, 1);
});

test('overlay dimensions and keyboard scrolling need no JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('/card-overlay/');
  const card = page.locator('#cardgrid-m .ps-card').first();
  const box = (await card.boundingBox())!;
  expect(box.width).toBeCloseTo(330, 1);
  expect(box.height).toBeCloseTo(box.width, 1);
  // Both the text and the transparent gradient padding follow native links without hydration.
  await card.locator('.description').click();
  await expect(page).toHaveURL(/#destination$/);
  await page.goto('/card-overlay/');
  await card.scrollIntoViewIfNeeded();
  const text = (await card.locator('.text').boundingBox())!;
  await page.mouse.click(text.x + 4, text.y + 4);
  await expect(page).toHaveURL(/#destination$/);
  const copy = page.locator('#long .text');
  await copy.focus();
  await page.keyboard.press('End');
  await expect.poll(() => copy.evaluate(el => el.scrollTop)).toBeGreaterThan(100);
  await page.locator('#long').getByRole('link', { name: 'Independent action' }).click();
  await expect(page).toHaveURL(/#action$/);
  await context.close();
});
