import { expect, test } from '@playwright/test';

test('legacy disclosure owners receive dismissal before their native state closes', async ({ page }) => {
  await page.goto('/popup-scroll-owner/');
  await expect(page.locator('.ps-shell')).toHaveAttribute('data-ps-popups-enhanced', '');
  // A legacy adapter supplies its own state and keyboard handler instead of Popup.
  await page.evaluate(() => {
    const details = document.createElement('details');
    details.id = 'legacy-disclosure';
    details.style.cssText = 'position:fixed;top:360px;left:24px';
    const summary = document.createElement('summary');
    summary.textContent = 'Legacy panel';
    const panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.style.cssText = 'position:absolute;width:180px;padding:16px';
    panel.textContent = 'Legacy content';
    details.append(summary, panel);
    document.querySelector('.ps-shell')!.append(details);
    document.body.dataset.legacyState = 'ready';
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && details.open) document.body.dataset.legacyState = 'dismissed';
    });
  });
  await page.locator('#legacy-disclosure summary').click();
  await expect(page.locator('#legacy-disclosure .settings-panel')).toHaveAttribute('popover', 'manual');
  await page.evaluate(() => scrollBy(0, 150));
  await expect(page.locator('body')).toHaveAttribute('data-legacy-state', 'dismissed');
  await expect(page.locator('#legacy-disclosure')).not.toHaveAttribute('open', '');
});

for (const native of [true, false]) test(`Popup owns document scrolling with native popovers ${native}`, async ({ page }) => {
  if (!native) await page.addInitScript(() => { Reflect.deleteProperty(HTMLElement.prototype, 'showPopover'); });
  await page.goto('/popup-scroll-owner/');
  const trigger = page.getByRole('button', { name: 'Standalone popup' });
  const popup = page.locator('.ps-popup').filter({ hasText: 'Scrollable content' });
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  if (!native) await expect(popup).not.toHaveAttribute('popover');
  await popup.evaluate(el => { el.scrollTop = 100; });
  await expect.poll(() => popup.evaluate(el => el.scrollTop)).toBe(100);
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.evaluate(() => document.dispatchEvent(new Event('scroll')));
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const focus = await page.evaluate(() => document.activeElement?.textContent);
  await page.evaluate(() => scrollBy(0, 150));
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(popup).toBeHidden();
  await expect(page.getByLabel('Dismissals')).toHaveText('1');
  expect(await page.evaluate(() => scrollY)).toBe(150);
  expect(await page.evaluate(() => document.activeElement?.textContent)).toBe(focus);
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.evaluate(() => scrollBy(0, 50));
  await expect(page.getByLabel('Dismissals')).toHaveText('2');
});

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
