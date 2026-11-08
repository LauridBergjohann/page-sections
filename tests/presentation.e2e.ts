import { expect, test } from '@playwright/test';

for (const width of [375, 1920]) {
  test(`navigation, hero and independent surfaces in both themes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const mode of ['light', 'dark'] as const) {
      await page.goto('/examples/');
      await page.locator('[data-ps-theme]').evaluate((element, mode) => element.setAttribute('data-ps-theme', mode), mode);
      // Simulate a host reset: the hero must define its own paragraph spacing.
      await page.addStyleTag({ content: ':where(p, h1, h2, h3) { margin: 0; }' });
      const ink = mode === 'light' ? 'rgb(23, 35, 48)' : 'rgb(242, 245, 250)';
      const accent = mode === 'light' ? 'rgb(18, 92, 176)' : 'rgb(145, 186, 255)';
      const muted = mode === 'light' ? 'rgb(232, 237, 243)' : 'rgb(40, 56, 74)';
      const standard = mode === 'light' ? 'rgb(255, 255, 255)' : 'rgb(32, 45, 59)';
      const nav = page.locator('.ps-navigation');
      await expect(nav.locator('.header')).not.toHaveCSS('box-shadow', 'none');
      await expect(nav.locator('.header')).toHaveCSS('background-color', standard);
      await expect(nav.locator('.desktop-menu a').first()).toHaveCSS('color', ink);
      if (width >= 1600) await expect(nav.locator('.satellite').first()).toHaveCSS('box-shadow', /8px/);
      await expect(page.locator('#welcome .eyebrow')).toHaveCSS('color', accent);
      await expect(page.locator('#welcome .eyebrow')).toHaveCSS('margin-bottom', '24px');
      await expect(page.locator('#welcome .introduction')).toHaveCSS('margin-top', '28px');
      await expect(page.locator('#welcome .ps-actions')).toHaveCSS('margin-top', '32px');
      await expect(page.locator('#projects [data-ps-card-part="surface"]').first()).toHaveCSS('background-color', muted);
      await expect(page.locator('#continue .ps-panel')).toHaveCSS('background-color', standard);
      await expect(page.locator('#profile .ps-panel')).toHaveCSS('background-color', muted);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.screenshot({ path: `.artifacts/presentation-${mode}-${width}.png`, fullPage: true });
      await nav.evaluate(element => (element as HTMLElement).style.setProperty('--ps-navigation-shadow', 'none'));
      await expect(nav.locator('.header')).toHaveCSS('box-shadow', 'none');
      if (width >= 1600) {
        await expect(nav.locator('.satellite').first()).toHaveCSS('box-shadow', 'none');
        await expect(nav.locator('.satellite').first()).toHaveCSS('outline-width', '1px');
      }
    }
  });
}
