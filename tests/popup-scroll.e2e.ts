import { expect, test } from '@playwright/test';

for (const kind of ['settings', 'submenu'] as const) {
  test(`${kind} ignores queued viewport notifications but closes on subsequent movement`, async ({ page }) => {
    await page.setViewportSize({ width: kind === 'settings' ? 1280 : 1920, height: 900 });
    await page.goto(kind === 'settings' ? '/components/' : '/examples/integration/');
    await expect(page.locator('.ps-shell')).toHaveAttribute('data-ps-popups-enhanced', '');
    const header = kind === 'settings'
      ? page.locator('.ps-header').first()
      : page.locator('header').filter({ has: page.getByRole('navigation', { name: 'Nested menu example' }) });
    const popup = header.locator(kind === 'settings' ? '.settings-panel' : '.ps-submenu');
    const trigger = kind === 'settings'
      ? header.locator('.settings > summary')
      : header.getByRole('link', { name: 'More pages', exact: true });
    await trigger.scrollIntoViewIfNeeded();
    // Open after scrolling, then wait only for the actual popup state.
    if (kind === 'settings') await trigger.click();
    else await trigger.hover();
    await expect(popup).toBeVisible();
    await expect(popup).toHaveJSProperty('popover', 'manual');
    await expect(page.locator('[data-ps-popup-backdrop]:popover-open')).toHaveCount(1);

    // A scroll/resize notification can arrive after opening even though its geometry
    // was already used to position the popup. It must not dismiss the new popup.
    await page.evaluate(() => {
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('resize'));
    });
    await expect(popup).toBeVisible();
    await expect(page.locator('[data-ps-popup-backdrop]:popover-open')).toHaveCount(1);
    if (kind === 'settings') await expect(header.locator('.settings')).toHaveAttribute('open', '');
    else await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // Real movement still dismisses it immediately; no grace-period timer is used.
    await page.evaluate(() => scrollBy(0, scrollY > 0 ? -80 : 80));
    await expect(popup).toBeHidden();
    await expect(page.locator('[data-ps-popup-backdrop]')).toHaveCount(0);

    if (kind === 'settings') await trigger.click();
    else await trigger.hover();
    await expect(popup).toBeVisible();
    await page.setViewportSize({ width: kind === 'settings' ? 1280 : 1920, height: 850 });
    await expect(popup).toBeHidden();
    await expect(page.locator('[data-ps-popup-backdrop]')).toHaveCount(0);
  });
}
