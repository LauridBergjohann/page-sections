import { expect, test } from '@playwright/test';
import { resolveContentPageLayout } from '../packages/core/src/index.js';

for (const width of [390, 1599, 1600, 1808, 1809, 2299, 2300, 2800]) {
  test(`sidebar geometry and scrolling at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/sidebars/');
    const root = page.locator('#sidebar-fixture');
    for (const leftSidebar of [true, false])
      for (const showContentMenu of [true, false]) {
        await page.getByLabel('Left sidebar', { exact: true }).setChecked(leftSidebar);
        await page.getByLabel('Content menu', { exact: true }).setChecked(showContentMenu);
        const viewport = await page.evaluate(() => ({
          width: innerWidth,
          height: innerHeight,
          scrollbarWidth: innerWidth - document.documentElement.clientWidth
        }));
        const expected = resolveContentPageLayout({ ...viewport, leftSidebar, showContentMenu });
        const content = await root.locator('.ps-page-content').boundingBox();
        expect(content!.x).toBeCloseTo(expected.content.x, 0);
        expect(content!.width).toBeCloseTo(expected.content.width, 0);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
          width
        );
      }
    await page.getByLabel('Left sidebar', { exact: true }).check();
    await page.getByLabel('Content menu', { exact: true }).check();
    await page.evaluate(() => scrollTo(0, 1000));
    if (width >= 1600) {
      const panel = root.locator('.sidebar-panel');
      await expect(panel.locator('a').first()).toHaveCSS(
        'color',
        await root.evaluate((el) => getComputedStyle(el).color)
      );
      await expect.poll(async () => (await panel.boundingBox())!.y).toBeCloseTo(16, 0);
      expect(await panel.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
      await expect(
        root.locator('.ps-content-menu-slot .desktop a[aria-current="location"]')
      ).toHaveText('Chapter 2');
    } else {
      await expect(root.locator('.ps-left-sidebar')).toBeHidden();
      const button = root.getByRole('button', { name: 'On this page', exact: true });
      await button.click();
      await expect(root.locator('.popup')).toBeVisible();
      await root.locator('.popup a').last().click();
      await expect(root.locator('.popup')).toBeHidden();
      await expect(page).toHaveURL(/#section-2$/);
      await button.click();
      await page.keyboard.press('Escape');
      await expect(button).toBeFocused();
      await page.setViewportSize({ width, height: 250 });
      await button.click();
      const popup = root.locator('.popup');
      const popupBox = await popup.boundingBox();
      expect(popupBox!.y + popupBox!.height).toBeLessThanOrEqual(250);
      await page.keyboard.press('Escape');
      await expect(root.locator('.popup')).toBeHidden();
    }
  });
}
