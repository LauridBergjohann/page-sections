import { test, expect } from '@playwright/test';

for (const [width, columns, gap, spans] of [[390, 4, 12, [2, 2, 4]], [720, 6, 16, [2, 2, 3]], [1000, 8, 16, [2, 2, 4]], [1440, 12, 24, [2, 3, 4]]] as const) {
  test('features use card spans and center every row at ' + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/features/');
    for (const [index, size] of (['s', 'm', 'l'] as const).entries()) {
      const section = page.locator('#features-' + size);
      const bounds = (await section.boundingBox())!;
      const expected = (bounds.width - (columns + 1) * gap) / columns * spans[index] + (spans[index] - 1) * gap;
      const slots = await section.locator('.feature-slot').evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width }; }));
      const rows = new Map<number, typeof slots>();
      for (const slot of slots) {
        expect(slot.width).toBeCloseTo(expected, 1);
        const y = Math.round(slot.y);
        rows.set(y, [...(rows.get(y) ?? []), slot]);
      }
      for (const row of rows.values()) {
        expect(row.length).toBeLessThanOrEqual(columns / spans[index]);
        expect((row[0].x + row.at(-1)!.x + row.at(-1)!.width) / 2).toBeCloseTo(bounds.x + bounds.width / 2, 1);
      }
      await expect(section.getByRole('heading', { name: 'Feature 1', exact: true })).toHaveJSProperty('tagName', 'H3');
      await expect(section.locator('.ps-feature').first()).toHaveCSS('text-align', 'center');
    }
    const nested = page.locator('#nested .feature-slot').first();
    expect((await nested.boundingBox())!.width).toBeCloseTo((Math.min(width, 500) - 36) / 2, 1);
    await expect(page.locator('#nested [data-custom-icon]')).toHaveCount(7);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.locator('#features-l').screenshot({ path: '.artifacts/features-' + width + '.png' });
  });
}

test('feature links cover icons and copy, reuse theme colors and expose keyboard focus', async ({ page }) => {
  await page.goto('/features/');
  const link = page.locator('#features-m').getByRole('link', { name: 'Feature 1', exact: true });
  await expect(link).toHaveAccessibleDescription('Shared layout and centered content.');
  await link.locator('.icon-circle').click();
  await expect(page).toHaveURL(/#destination$/);
  await page.goto('/features/');
  await link.locator('.description').click();
  await expect(page).toHaveURL(/#destination$/);
  await link.focus();
  await expect(link).toHaveCSS('outline-width', '3px');
  await expect(page.locator('#unsafe a')).toHaveCount(0);
  await expect(page.locator('#features-m .ps-feature').nth(1).locator('.icon-circle')).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
  for (const mode of ['Dark', 'Light']) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('.settings > summary').click();
    await page.getByRole('button', { name: mode, exact: true }).click();
    await page.keyboard.press('Escape');
    // Primary buttons animate theme colors; compare once both reach the same palette.
    await expect.poll(() => page.evaluate(() => {
      const button = getComputedStyle(document.querySelector('.ps-button[data-variant=primary]')!);
      const circle = getComputedStyle(document.querySelector('#tone-primary .icon-circle')!);
      return button.backgroundColor === circle.backgroundColor && button.color === circle.color;
    })).toBe(true);
  }
});

test('features center before hydration and respect reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto('/features/');
  const final = page.locator('#features-m .feature-slot').last();
  const section = (await page.locator('#features-m').boundingBox())!;
  const row = await page.locator('#features-m .feature-slot').evaluateAll(nodes => nodes.slice(4).map(n => n.getBoundingClientRect().toJSON()));
  expect((row[0].x + row[2].right) / 2).toBeCloseTo(section.x + section.width / 2, 1);
  await expect(final.locator('svg')).toHaveCount(1);
  await expect(final.locator('.icon-circle')).toHaveCSS('transition-duration', '0s');
  await page.locator('#features-m a').click();
  await expect(page).toHaveURL(/#destination$/);
  await context.close();
});
