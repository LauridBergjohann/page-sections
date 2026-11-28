import { expect, test, type Locator } from '@playwright/test';

const route = '/docs/design-system/responsive-layout/';

test('native scrollbars and idle search follow the selected theme, independent of the OS', async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 900 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto(route);
  const search = page.getByRole('button', { name: 'Open search', exact: true });
  for (const mode of ['light', 'dark', 'light']) {
    // Deliberately choose the opposite OS preference.
    await page.emulateMedia({ colorScheme: mode === 'light' ? 'dark' : 'light' });
    await page.locator('.settings > summary').click();
    await page.locator('.settings-panel').getByRole('button', { name: mode === 'light' ? 'Light' : 'Dark', exact: true }).click();
    await page.mouse.move(0, 0);
    await expect(page.locator('html')).toHaveCSS('color-scheme', mode);
    await expect(search).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await page.locator('.mobile-menu > summary').click();
    const panel = page.locator('.mobile-panel:popover-open');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveCSS('color-scheme', mode);
    for (const label of ['Show pages in Sections', 'Show pages in Documentation']) {
      const disclosure = panel.getByRole('button', { name: label, exact: true });
      if (!await disclosure.evaluate(node => node.closest('details')?.open)) await disclosure.click();
    }
    await expect.poll(() => panel.evaluate(node => node.scrollHeight > node.clientHeight)).toBe(true);
    await page.screenshot({ path: test.info().outputPath(`navigation-${mode}.png`) });
    await page.keyboard.press('Escape');
    await search.click();
    await expect(page.locator('.search-surface:popover-open')).toHaveCSS('color-scheme', mode);
    await expect(page.getByRole('combobox', { name: 'Search documentation' })).toHaveCSS('color-scheme', mode);
    await page.keyboard.press('Escape');
    await page.mouse.move(0, 0);
    await expect(search).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  }
});

test('text ButtonGroup selection meets its divider after popup entrance', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);
  await expect(page.locator('.mobile-search')).toBeAttached();
  for (let opening = 0; opening < 2; opening++) {
    await page.locator('.settings > summary').click();
    const panel = page.locator('.settings-panel:popover-open');
    await panel.evaluate(node => Promise.all(node.getAnimations().map(animation => animation.finished)));
    const group = panel.getByRole('group', { name: 'Appearance' });
    await expect(group).toHaveAttribute('data-ps-selection-animated', '');
    await expect.poll(() => group.evaluate(node => {
      const selected = node.querySelector('[aria-pressed="true"]')!;
      const box = selected.getBoundingClientRect();
      const host = node.getBoundingClientRect();
      const style = getComputedStyle(node, '::before');
      const matrix = new DOMMatrixReadOnly(style.transform);
      return Math.max(Math.abs(host.left + matrix.m41 - box.left),
        Math.abs(parseFloat(style.width) - box.width), Math.abs(parseFloat(style.height) - box.height));
    })).toBeLessThan(0.1);
    await page.keyboard.press('Escape');
    await expect(panel).toHaveCount(0);
  }
});

for (const native of [true, false]) test(`mobile search survives keyboard viewport changes, native popover=${native}`, async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  if (!native) await context.addInitScript(() => { Reflect.deleteProperty(HTMLElement.prototype, 'showPopover'); });
  const page = await context.newPage();
  await page.goto(route);
  const trigger = page.getByRole('button', { name: 'Open search', exact: true });
  const input = page.getByRole('combobox', { name: 'Search documentation' });
  await trigger.tap();
  await expect(input).toBeFocused();
  // Android configurations can resize the layout viewport when the keyboard opens.
  await page.setViewportSize({ width: 390, height: 470 });
  await expect(input).toBeFocused();
  await input.pressSequentially('theme');
  await expect(input).toHaveValue('theme');
  await expect(page.getByRole('listbox', { name: 'Search results' })).toBeVisible();
  if (native) {
    // Other configurations shrink only the visual viewport. Verify that the
    // top-layer surface fits the available space and retains the focused editor.
    await page.evaluate(() => {
      Object.defineProperty(visualViewport, 'height', { configurable: true, value: 330 });
      visualViewport!.dispatchEvent(new Event('resize'));
    });
    await expect(input).toBeFocused();
    await expect.poll(() => page.locator('.search-surface').evaluate(node => node.getBoundingClientRect().bottom)).toBeLessThanOrEqual(318);
    await page.evaluate(() => {
      Reflect.deleteProperty(visualViewport!, 'height');
      visualViewport!.dispatchEvent(new Event('resize'));
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(input).toBeFocused();
  await input.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.tap();
  await expect(input).toBeFocused();
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator('.mobile-search')).toHaveAttribute('aria-expanded', 'false');
  await context.close();
});

test('popup close controls dismiss website panels and preserve hover menus', async ({ page }) => {
  for (const width of [390, 1250, 1700]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route);
    await expect(page.locator('.mobile-search')).toBeAttached();
    const triggers = width < 1200 ? ['.settings > summary', '.ps-content-menu-slot .mobile > summary'] : width < 1600 ? ['.settings > summary', '.ps-content-menu-slot .mobile > summary'] : [];
    for (const selector of triggers) {
      const trigger = page.locator(selector);
      await trigger.click();
      const panel = page.locator('.ps-popup:popover-open');
      await panel.evaluate(node => Promise.all(node.getAnimations().map(animation => animation.finished)));
      const title = (await panel.locator('.ps-popup-title').boundingBox())!;
      const close = (await panel.locator('.ps-popup-close').boundingBox())!;
      expect(Math.abs(title.y + title.height / 2 - close.y - close.height / 2)).toBeLessThan(1);
      await panel.locator('.ps-popup-close').click();
      await expect(page.locator('[data-ps-popup-backdrop]:popover-open')).toHaveCount(0);
      await expect(trigger).toBeFocused();
    }
    if (width < 1200) {
      await page.locator('.mobile-menu > summary').click();
      await expect(page.locator('.mobile-panel:popover-open')).toBeVisible();
      await expect(page.locator('.mobile-panel .ps-popup-close')).toHaveCount(0);
      await expect(page.locator('.mobile-panel')).toHaveCSS('padding-top', '12px');
      await page.keyboard.press('Escape');
    }
    const input = page.getByRole('combobox', { name: 'Search documentation' });
    if (width < 1600) await page.getByRole('button', { name: 'Open search', exact: true }).click();
    else await input.click();
    await input.fill('theme');
    await expect(page.locator('.search-surface .ps-popup-close, .search-panel .ps-popup-close')).toHaveCount(0);
    await expect(page.locator('.search-surface')).toHaveCSS('padding-top', '0px');
    await expect(page.locator('.search-panel')).toHaveCSS('padding-top', '0px');
    await input.press('Escape');
    await expect(input).toHaveValue('theme');
    await expect(page.locator('[data-ps-popup-backdrop]:popover-open')).toHaveCount(0);
    if (width >= 1600) await expect(input).toBeFocused();
  }
  await page.locator('.desktop-menu a[aria-expanded]').first().hover();
  await expect(page.locator('.ps-submenu:popover-open')).toBeVisible();
  await expect(page.locator('.ps-submenu .ps-popup-close')).toHaveCount(0);
});
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
        await expect(page.locator(`.${kind} > .ps-popup:popover-open`)).toBeVisible();
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
  await expect(page.locator('.settings')).not.toHaveAttribute('open');
  await expect(page.locator('.settings > summary')).toBeFocused();
  await page.locator('.settings > summary').click();
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
      await popup.evaluate(node => Promise.all(node.getAnimations().map(animation => animation.finished)));
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
      await popup.evaluate(node => Promise.all(node.getAnimations().map(animation => animation.finished)));
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
        const title = getComputedStyle(panel.querySelector('.ps-popup-title')!);
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


test('atomic popup headings, compact alignment and standalone dismissal stay consistent', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/docs/components/popup/');
  const centered = await page.locator('.header').evaluate(header => {
    const a = header.querySelector('.mobile-menu > summary')!.getBoundingClientRect();
    const b = header.querySelector('.brand')!.getBoundingClientRect();
    return Math.abs(a.y + a.height / 2 - b.y - b.height / 2);
  });
  expect(centered).toBeLessThanOrEqual(1);
  await page.locator('.settings > summary').click();
  const settingsTypography = await page.locator('.settings-panel .ps-popup-title').evaluate(node => {
    const style = getComputedStyle(node); return [style.fontSize, style.fontWeight, style.lineHeight];
  });
  await page.keyboard.press('Escape');
  await page.locator('.ps-content-menu-slot summary').click();
  const tocTypography = await page.locator('.ps-content-menu-slot .popup .ps-popup-title').evaluate(node => {
    const style = getComputedStyle(node); return [style.fontSize, style.fontWeight, style.lineHeight];
  });
  expect(tocTypography).toEqual(settingsTypography);
  await page.keyboard.press('Escape');
  const trigger = page.getByRole('button', { name: 'Example settings', exact: true });
  await trigger.scrollIntoViewIfNeeded();
  for (const dismissal of ['escape', 'outside', 'toggle']) {
    await trigger.click();
    await expect(page.locator('#example-settings:popover-open')).toBeVisible();
    await expect(blur(page)).toHaveCount(1);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.locator('#example-settings').getByRole('button', { name: 'Dark', exact: true }).click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(page.locator('#example-settings').getByRole('button', { name: 'Dark', exact: true })).toHaveAttribute('aria-pressed', 'true');
    if (dismissal === 'escape') { await page.keyboard.press('Escape'); await expect(trigger).toBeFocused(); }
    else if (dismissal === 'toggle') await trigger.click();
    else await page.mouse.click(3, 850);
    await expect(blur(page)).toHaveCount(0);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
});

test('atomic documentation has a progressive path and preserves legacy links', async ({ page }) => {
  await page.goto('/docs/building-blocks/card/');
  await expect(page).toHaveURL(/\/docs\/components\/card\//);
  await page.goto('/docs/components/buttons/');
  await page.getByRole('button', { name: 'Primary action', exact: true }).click();
  await expect(page.locator('[data-atomic-preview=buttons]').getByRole('status')).toContainText('1 times');
  await page.getByRole('button', { name: 'Reset count', exact: true }).click();
  await expect(page.locator('[data-atomic-preview=buttons]').getByRole('status')).toContainText('0 times');
  await expect(page.getByRole('button', { name: 'Disabled', exact: true })).toBeDisabled();
  await page.goto('/docs/');
  const path = await page.locator('#learning-path ol a').allTextContents();
  expect(path.indexOf('Design system')).toBeLessThan(path.indexOf('Components'));
  await page.goto('/docs/components/');
  for (const name of ['PrimaryButton', 'SecondaryButton', 'IconButton', 'Popup', 'Card', 'ButtonGroup', 'Header', 'Footer', 'Sections']) {
    await expect(page.locator('main').getByRole('link', { name, exact: true })).toBeVisible();
  }
});


test('atomic property tables stay inside a small viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  for (const route of ['buttons', 'popup']) {
    await page.goto('/docs/components/' + route + '/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('.table-scroll')).toHaveAttribute('tabindex', '0');
  }
});
