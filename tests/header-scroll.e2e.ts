import { expect, test, type Page } from '@playwright/test';

async function scrollTo(page: Page, y: number) {
  // Native input also advances CSS scroll timelines when scripting is disabled.
  const current = await page.evaluate(() => window.scrollY);
  await page.mouse.move(page.viewportSize()!.width / 2, 500);
  if (current !== y) await page.mouse.wheel(0, y - current);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(y);
}

test('reduced motion keeps native docking without the corner animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.goto('/header-scroll/');
  await scrollTo(page, 300);
  const header = page.locator('.ps-header .header');
  await expect.poll(async () => (await header.boundingBox())!.y).toBe(0);
  await expect(header).toHaveCSS('animation-name', 'none');
  await expect(header).toHaveCSS('border-top-left-radius', '12px');
});

for (const javaScriptEnabled of [false, true]) {
  test(`fixed header and satellites dock independently with JavaScript ${javaScriptEnabled}`, async ({ browser, baseURL }) => {
    test.setTimeout(60000);
    const context = await browser.newContext({ baseURL, javaScriptEnabled });
    const page = await context.newPage();
    for (const width of [1600, 1920, 2560]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/header-scroll/');
      const header = page.locator('.ps-header .header');
      const satellites = page.locator('.ps-header .satellite');
      const panels = page.locator('.ps-left-sidebar .sidebar-panel, .ps-content-menu-slot .desktop');
      const initialPanels = await panels.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top));
      const contentTop = (await page.locator('main').boundingBox())!.y;
      expect(contentTop).toBe(80);
      for (const y of [0, 8, 16, 22, 28, 34, 40, 300, 22, 8, 0]) {
        await scrollTo(page, y);
        await expect.poll(async () => (await header.boundingBox())!.y).toBe(Math.max(0, 16 - y));
        await expect.poll(() => satellites.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top))).toEqual([Math.max(0, 28 - y), Math.max(0, 28 - y)]);
        await expect(header).toHaveCSS('border-top-left-radius', `${Math.max(0, Math.min(12, 28 - y))}px`);
        await expect(header).toHaveCSS('border-top-right-radius', `${Math.max(0, Math.min(12, 28 - y))}px`);
        await expect(header).toHaveCSS('border-bottom-left-radius', '12px');
        for (const satellite of await satellites.all()) {
          await expect(satellite).toHaveCSS('border-top-left-radius', `${Math.max(0, Math.min(12, 40 - y))}px`);
          await expect(satellite).toHaveCSS('border-bottom-left-radius', '12px');
        }
        await expect.poll(() => panels.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top))).toEqual(initialPanels.map(top => Math.max(80, top - y)));
        expect((await page.locator('main').boundingBox())!.y + y).toBe(contentTop);
        for (const panel of await panels.all()) {
          const bounds = (await panel.boundingBox())!;
          expect(bounds.y + bounds.height).toBeLessThanOrEqual(884.1);
        }
        if (javaScriptEnabled && width === 1920 && [0, 22, 300].includes(y)) {
          await page.screenshot({ path: test.info().outputPath(`header-${y}.png`) });
        }
      }
      // The extra sticky track must not cover links in the breadcrumb row.
      await page.getByRole('navigation', { name: 'Breadcrumb', exact: true }).getByRole('link', { name: 'Home', exact: true }).click();
      await expect(page).toHaveURL(baseURL + '/');
    }
    await context.close();
  });
}

test('reactive page overrides restore header modes and sidebar space without moving content', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.goto('/header-scroll/');
  const header = page.locator('.ps-header .header');
  const panels = page.locator('.ps-left-sidebar .sidebar-panel, .ps-content-menu-slot .desktop');
  await scrollTo(page, 300);
  for (const [mode, top, inset] of [['delayed', -252, 16], ['fixed', 0, 80], ['static', -284, 16], ['fixed', 0, 80]] as const) {
    await page.getByLabel('Header scroll behavior').selectOption(mode);
    await expect(page.locator('.ps-header')).toHaveAttribute('data-scroll', mode);
    await expect.poll(async () => (await header.boundingBox())!.y).toBe(top);
    await expect.poll(() => panels.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top))).toEqual([inset, inset]);
    expect(await page.evaluate(() => scrollY)).toBe(300);
    expect((await page.locator('main').boundingBox())!.y + 300).toBe(80);
    for (const panel of await panels.all()) {
      await expect.poll(() => panel.evaluate(node => node.getBoundingClientRect().bottom)).toBeCloseTo(884, 0);
    }
  }
  await page.locator('.ps-shell').evaluate(node => (node as HTMLElement).style.setProperty('--ps-radius', '24px'));
  await scrollTo(page, 28);
  await expect(header).toHaveCSS('border-top-left-radius', '12px');
  await scrollTo(page, 40);
  await expect(header).toHaveCSS('border-top-left-radius', '0px');
  await scrollTo(page, 0);
  await expect(header).toHaveCSS('border-top-left-radius', '24px');
});

for (const javaScriptEnabled of [false, true]) {
  test(`fixed compact header has no docking gap with JavaScript ${javaScriptEnabled}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled });
    const page = await context.newPage();
    await page.goto('/header-scroll/');
    for (const width of [390, 1599, 1920, 840]) {
      await page.setViewportSize({ width, height: 900 });
      await scrollTo(page, 300);
      const header = page.locator('.ps-header .header');
      await expect.poll(async () => (await header.boundingBox())!.y).toBe(0);
      await expect(header).toHaveCSS('border-top-left-radius', '0px');
      if (width < 1600) {
        await expect(page.locator('.ps-header .satellite').first()).toBeHidden();
        await expect.poll(async () => (await page.locator('.ps-content-menu-slot .mobile').boundingBox())!.y).toBe(78);
        expect((await page.locator('main').boundingBox())!.y + 300).toBe(66);
      }
    }
    await context.close();
  });
}
