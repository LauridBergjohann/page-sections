import { expect, test, type Locator } from '@playwright/test';

const route = '/docs/design-system/responsive-layout/';
const blur = (page: import('@playwright/test').Page) =>
  page.locator('[data-ps-popup-backdrop]:popover-open');
async function topmost(target: Locator) {
  await expect
    .poll(() =>
      target.evaluate((node) => {
        const r = node.getBoundingClientRect();
        const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        return hit === node || node.contains(hit);
      })
    )
    .toBe(true);
}

for (const width of [390, 1250, 1700])
  test(`popup lifecycle and active triggers at ${width}px`, async ({ page }, info) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'gpu', { value: undefined }));
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route);
    await expect(page.locator('.mobile-search')).toBeAttached();
    const outside = () => page.mouse.click(5, 850);
    for (const kind of width < 1200
      ? ['mobile-menu', 'settings']
      : width < 1600
        ? ['settings']
        : []) {
      const trigger = page.locator(`.${kind} > summary`);
      const initialColor = await trigger.evaluate((node) => getComputedStyle(node).color);
      for (const dismissal of ['outside', 'toggle', 'escape', 'outside']) {
        await trigger.click();
        await expect(blur(page)).toHaveCount(1);
        await expect(blur(page)).toHaveCSS('backdrop-filter', 'blur(3px)');
        await expect(trigger).not.toHaveCSS('color', initialColor);
        await topmost(trigger);
        await expect(page.locator(`.${kind} > :popover-open`)).toBeVisible();
        if (dismissal === 'toggle') await trigger.click();
        else if (dismissal === 'escape') await page.keyboard.press('Escape');
        else await outside();
        await expect(blur(page)).toHaveCount(0);
        await expect(trigger).toHaveCSS('color', initialColor);
      }
    }
    const search = page.getByRole('button', { name: 'Open search', exact: true });
    const input = page.getByRole('combobox', { name: 'Search documentation' });
    const compact = width < 800 || (width >= 1200 && width < 1600);
    for (const dismissal of compact ? ['toggle', 'outside', 'escape'] : ['outside', 'escape']) {
      if (compact) await search.click();
      else await input.click();
      await input.fill('theme');
      await expect(blur(page)).toHaveCount(1);
      await topmost(input);
      await topmost(page.getByRole('option').first());
      if (compact) {
        await expect(search).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('.search-surface:popover-open')).toBeVisible();
        await expect(page.locator('.search-panel:popover-open')).toHaveCount(0);
      }
      await page.screenshot({ path: info.outputPath(`search-${dismissal}.png`) });
      if (dismissal === 'toggle') await search.click();
      else if (dismissal === 'escape') await input.press('Escape');
      else await outside();
      await expect(blur(page)).toHaveCount(0);
      if (compact) await expect(search).toHaveAttribute('aria-expanded', 'false');
    }
    if (width < 1600) {
      // Switching popup owners must leave one backdrop and reset the previous trigger.
      await search.click();
      const settings = page.locator('.settings > summary');
      await settings.click();
      await expect(search).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('.settings[open]')).toHaveCount(1);
      await expect(blur(page)).toHaveCount(1);
      await page.keyboard.press('Escape');
      await expect(blur(page)).toHaveCount(0);
    }
    if (width < 1600) {
      const content = page.getByRole('button', { name: 'On this page', exact: true });
      await content.click();
      await expect(blur(page)).toHaveCount(1);
      await topmost(content);
      await topmost(page.locator('.ps-content-menu-slot .popup a').first());
      await outside();
      await expect(blur(page)).toHaveCount(0);
    } else {
      const docs = page
        .locator('.desktop-menu')
        .getByRole('link', { name: 'Documentation', exact: true });
      await docs.hover();
      await expect(blur(page)).toHaveCount(1);
      const option = page.locator('.ps-submenu:popover-open a').first();
      await option.hover();
      await topmost(option);
      await expect(docs).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape');
      await expect(blur(page)).toHaveCount(0);
    }
  });

test('dark theme popup follows tab and accent colors', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto(route);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.locator('.settings > summary').click();
  const dark = page.locator('.settings-panel').getByRole('button', { name: 'Dark', exact: true });
  await dark.click();
  await expect(dark).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  const search = page.getByRole('button', { name: 'Open search', exact: true });
  await search.click();
  const expected = await search.evaluate((node) => {
    const sample = document.createElement('span');
    sample.style.cssText = 'color:var(--ps-accent);background:var(--ps-selection)';
    node.append(sample);
    const css = getComputedStyle(sample);
    const result = { color: css.color, background: css.backgroundColor };
    sample.remove();
    return result;
  });
  await expect(search).toHaveCSS('color', expected.color);
  await expect(search).toHaveCSS('background-color', expected.background);
  await expect(blur(page)).toHaveCSS('transition-duration', '0s');
  await page.screenshot({ path: test.info().outputPath('search-dark.png') });
  await search.click();
  await expect(blur(page)).toHaveCount(0);
});

test('header stays on one line across search and navigation breakpoints', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'gpu', { value: undefined }));
  await page.goto(route);
  await expect(page.locator('.mobile-search')).toBeAttached();
  for (const width of [
    320, 390, 600, 800, 1199, 1200, 1250, 1399, 1400, 1599, 1600, 1700, 1920, 2456
  ]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    if (width < 1200) continue;
    const rects = await page
      .locator('.desktop-menu .ps-main-menu > li > a')
      .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().toJSON()));
    expect(new Set(rects.map((rect) => Math.round(rect.y))).size).toBe(1);
    const tools = (await page.locator('.ps-navigation .tools').boundingBox())!;
    expect(Math.max(...rects.map((rect) => rect.right))).toBeLessThanOrEqual(tools.x);
  }
});

for (const width of [390, 1000, 1920]) {
  test('uniform popup surfaces and borderless header controls at ' + width, async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'gpu', { value: undefined }));
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/docs/');
    await expect(page.locator('.mobile-search')).toBeAttached();
    const header = page.locator('.website-header .header');
    const headerBox = (await header.boundingBox())!;
    let appearance: unknown;
    async function surface(selector: string, anchorBottom = headerBox.y + headerBox.height, gap = 0) {
      const popup = page.locator(selector + ':popover-open');
      await expect(popup).toBeVisible();
      const box = (await popup.boundingBox())!;
      expect(Math.abs(box.y - anchorBottom - gap)).toBeLessThan(1);
      expect(box.x).toBeGreaterThanOrEqual(12);
      expect(box.x + box.width).toBeLessThanOrEqual(width - 12);
      const css = await popup.evaluate(el => {
        const s = getComputedStyle(el);
        return { border: s.borderRightWidth, radius: s.borderRadius, color: s.borderColor, background: s.backgroundColor, shadow: s.boxShadow };
      });
      expect(css.border).toBe('1px');
      await expect(popup).toHaveCSS('border-top-width', gap === 0 ? '0px' : '1px');
      expect(css.radius).toBe('12px');
      if (appearance) expect(css).toEqual(appearance);
      else appearance = css;
      return popup;
    }
    for (const control of await header.locator('.mobile-menu > summary, .settings > summary, .github-link, .mobile-search').filter({ visible: true }).all()) {
      await expect(control).toHaveCSS('outline-style', 'none');
      await expect(control).toHaveCSS('border-top-width', '0px');
    }
    if (width < 1200) {
      await header.locator('.mobile-menu > summary').click();
      const popup = await surface('.mobile-panel');
      const box = (await popup.boundingBox())!;
      expect(box.x).toBe(headerBox.x + 12);
      expect(box.width).toBe(headerBox.width - 24);
      await page.keyboard.press('Escape');
    } else {
      await header.locator('.desktop-menu').getByRole('link', { name: 'Documentation', exact: true }).hover();
      const submenu = await surface('.ps-submenu');
      const menuBox = (await submenu.boundingBox())!;
      await page.mouse.move(menuBox.x + menuBox.width / 2, menuBox.y + 2, { steps: 15 });
      await page.waitForTimeout(250);
      await expect(submenu).toBeVisible();
      await page.mouse.move(5, 800);
      await expect(page.locator('.ps-submenu:popover-open')).toHaveCount(0);
    }
    if (width < 1600) {
      await header.locator('.settings > summary').click();
      await surface('.settings-panel');
      await expect(page.locator('.settings-panel').getByRole('heading', { name: 'Appearance' })).toBeVisible();
      const hierarchy = await page.locator('.settings-panel').evaluate(panel => {
        const title = getComputedStyle(panel.querySelector('strong')!);
        const label = getComputedStyle(panel.querySelector('h3')!);
        return { titleSize: parseFloat(title.fontSize), labelSize: parseFloat(label.fontSize), titleWeight: Number(title.fontWeight), labelWeight: Number(label.fontWeight) };
      });
      expect(hierarchy.titleSize).toBeGreaterThan(hierarchy.labelSize);
      expect(hierarchy.titleWeight).toBeGreaterThan(hierarchy.labelWeight);
      await expect(page.locator('.settings-panel').getByRole('button', { name: 'Light', exact: true })).toHaveText('Light');
      await expect(page.locator('.settings-panel').getByRole('button', { name: 'Dark', exact: true })).toHaveText('Dark');
      await page.keyboard.press('Escape');
    }
    if (width < 800) await header.getByRole('button', { name: 'Open search', exact: true }).click();
    else await header.getByRole('combobox').click();
    await surface(width < 800 ? '.search-surface' : '.search-panel');
    await page.keyboard.press('Escape');
    if (width < 1600) {
      const trigger = page.locator('.ps-content-menu-slot summary');
      const box = (await trigger.boundingBox())!;
      await trigger.click();
      const popup = await surface('.ps-content-menu-slot .popup', box.y + box.height, 8);
      await expect(popup.getByRole('button', { name: 'Close content menu' })).toHaveCount(0);
      await trigger.click();
      await expect(popup).toBeHidden();
    }
  });
}
