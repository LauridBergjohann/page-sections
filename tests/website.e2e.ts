import { expect, test } from '@playwright/test';

test('navigation surfaces, hover geometry and sidebar state stay consistent across pages', async ({ page }) => {
  await page.setViewportSize({ width: 1809, height: 1000 });
  await page.goto('/docs/hero/');
  const docs = page.locator('.desktop-menu').getByRole('link', { name: 'Documentation', exact: true });
  const palette = await docs.evaluate(el => {
    const css = getComputedStyle(el);
    return { muted: css.getPropertyValue('--ps-section-muted').trim(), standard: css.getPropertyValue('--ps-section-standard').trim(), accent: css.getPropertyValue('--ps-accent').trim() };
  });
  // Resolve theme tokens through CSS, independent of the palette's color notation.
  const colors = await page.evaluate(palette => {
    const node = document.createElement('span'); document.body.append(node);
    const result: Record<string, string> = {};
    for (const [key, color] of Object.entries(palette)) { node.style.color = color; result[key] = getComputedStyle(node).color; }
    node.remove(); return result;
  }, palette);
  await expect(docs).toHaveCSS('background-color', colors.muted);
  await expect(docs).toHaveCSS('font-weight', '400');
  await expect(docs).toHaveCSS('border-radius', '0px');
  const headerBox = (await page.locator('.website-header .header').boundingBox())!;
  expect((await docs.boundingBox())!.height).toBe(headerBox.height - 2);
  await expect(page.locator('.satellite.right [aria-pressed="true"]')).toHaveCSS('color', colors.accent);
  await docs.hover();
  const overlay = page.locator('.ps-submenu:visible');
  const linkBox = (await docs.boundingBox())!;
  const overlayBox = (await overlay.boundingBox())!;
  expect(Math.abs(overlayBox.x + overlayBox.width / 2 - linkBox.x - linkBox.width / 2)).toBeLessThan(1);
  expect(Math.abs(overlayBox.y - linkBox.y - linkBox.height)).toBeLessThan(1);
  await page.mouse.move(linkBox.x + linkBox.width / 2, overlayBox.y + 2, { steps: 8 });
  await page.waitForTimeout(250); // Longer than the pointer-leave dismissal delay.
  await expect(overlay).toBeVisible();
  await page.keyboard.press('Escape');
  await page.mouse.move(0, 500);
  await expect(docs).toHaveCSS('background-color', colors.muted);
  const sidebar = page.locator('.ps-left-sidebar');
  const initialTop = (await sidebar.boundingBox())!.y;
  await expect(sidebar.locator('[aria-current="page"]')).toHaveCSS('background-color', colors.muted);
  await expect(sidebar.locator('[aria-current="page"]')).toHaveCSS('font-weight', '650');
  await expect(sidebar.getByRole('link', { name: 'Sections', exact: true })).toHaveCSS('background-color', colors.muted);
  await expect(sidebar.getByRole('link', { name: 'Sections', exact: true })).toHaveCSS('font-weight', '400');
  await sidebar.getByRole('button', { name: 'Show pages in Sections', exact: true }).click();
  await expect(sidebar.getByRole('link', { name: 'Hero', exact: true })).toBeHidden();
  await page.locator('.reading-path [rel="next"]').click();
  await expect(page).toHaveURL(/\/docs\/rich-text\/$/);
  await expect(sidebar.getByRole('link', { name: 'Rich text', exact: true })).toBeVisible();
  await expect(sidebar.locator('[aria-current="page"]')).toHaveText('Rich text');
  await expect(page.locator('.ps-content-menu-slot .desktop')).toHaveCSS('background-color', colors.standard);
  const sections = page.locator('.sections > [data-ps-section]');
  expect(await sections.count()).toBeGreaterThan(0);
  for (const section of await sections.all()) {
    await expect(section).toHaveAttribute('data-background-color', 'standard');
    await expect(section).toHaveAttribute('data-background-size', 'standard');
  }
  await docs.click();
  await expect(page).toHaveURL(/\/docs\/$/);
  await expect(docs).toHaveCSS('font-weight', '650');
  await expect(page.getByRole('navigation', { name: 'Breadcrumb', exact: true })).toHaveCount(0);
  expect((await sidebar.boundingBox())!.y).toBe(initialTop);
});

test('single-page entry points and legal footer links lead to actual project content', async ({ page }) => {
  await page.setViewportSize({ width: 1809, height: 1000 });
  await page.goto('/getting-started/');
  const menu = page.locator('.desktop-menu');
  await expect(menu.locator('.ps-main-menu > li')).toHaveCount(4);
  const start = menu.getByRole('link', { name: 'Getting started', exact: true });
  await expect(start).not.toHaveAttribute('aria-expanded');
  await expect(page.locator('.child-pages')).toHaveCount(0);
  await expect(page.locator('#first-page')).toContainText('ContentPage');
  await page.locator('.site-footer').getByRole('link', { name: 'Imprint', exact: true }).click();
  await expect(page).toHaveURL(/\/about\/#impressum$/);
  await expect(page.locator('#impressum')).toContainText('Laurid Bergjohann');
  await expect(menu.getByRole('link', { name: 'About', exact: true })).not.toHaveAttribute('aria-expanded');
  await page.locator('.site-footer').getByRole('link', { name: 'Privacy', exact: true }).click();
  await expect(page).toHaveURL(/\/about\/#datenschutz$/);
  await expect(page.locator('#datenschutz')).toContainText('page-sections-theme');
  await page.goto('/showcase/');
  await expect(page.locator('a[href*="/showcase/legal/"]')).toHaveCount(0);
  await page.goto('/showcase/components/');
  for (const name of ['HeroSection', 'RichTextSection', 'ImageSection', 'VideoSection', 'CardGridSection', 'CarouselSection', 'ContentGrid']) {
    await expect(page.getByRole('heading', { name: new RegExp(name) }).first()).toBeVisible();
  }
});

test('desktop page links reveal only the second level and retain native navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1809, height: 1000 });
  await page.goto('/docs/hero/');
  const menu = page.locator('.website-header .desktop-menu');
  const docs = menu.getByRole('link', { name: 'Documentation', exact: true });
  await docs.hover();
  await expect(menu.locator('.ps-submenu:visible > ul > li')).toHaveCount(5);
  await expect(menu.locator('.ps-submenu:visible svg')).toHaveCount(5);
  await expect(menu.getByRole('link', { name: 'Hero', exact: true })).toHaveCount(0);
  await expect(page.locator('.menu-backdrop')).toBeVisible();
  await expect(page.locator('.menu-backdrop')).toHaveCSS('backdrop-filter', 'blur(3px)');
  await page.keyboard.press('Escape');
  await expect(page.locator('.menu-backdrop')).toHaveCount(0);
  await menu.getByRole('link', { name: 'Showcase', exact: true }).focus();
  await docs.focus();
  await expect(menu.getByRole('link', { name: 'Sections', exact: true })).toBeVisible();
  await menu.getByRole('link', { name: 'Sections', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(docs).toBeFocused();
  await expect(page.locator('.menu-backdrop')).toHaveCount(0);
  const opened = page.context().waitForEvent('page');
  await docs.click({ modifiers: ['Control'] });
  const newTab = await opened;
  await newTab.waitForURL(/\/docs\/$/);
  await newTab.close();
  await docs.click();
  await expect(page).toHaveURL(/\/docs\/$/);
  await expect(page.getByRole('navigation', { name: 'Breadcrumb', exact: true })).toHaveCount(0);
  await page.locator('.child-pages').getByRole('link', { name: 'Sections' }).click();
  await page.locator('.child-pages').getByRole('link', { name: 'Hero' }).click();
  await expect(page).toHaveURL(/\/docs\/hero\/$/);
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb', exact: true });
  await expect(breadcrumb.locator('li')).toHaveCount(3);
  await expect(breadcrumb).not.toContainText('Home');
  await expect(page.locator('.ps-left-sidebar [aria-current="page"]')).toHaveText('Hero');
  await expect(page.locator('.reading-path [rel="next"]')).toContainText('Rich text');
});

test('touch and mobile users can reach deep pages through real parent pages', async ({ browser }) => {
  for (const width of [390, 1200]) {
    const context = await browser.newContext({ hasTouch: true, viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4174/');
    if (width < 1200) {
      await page.locator('.mobile-menu > summary').tap();
      const mobile = page.locator('.mobile-panel');
      await mobile.getByRole('button', { name: 'Show pages in Documentation', exact: true }).tap();
      await mobile.getByRole('button', { name: 'Show pages in Sections', exact: true }).tap();
      await mobile.getByRole('link', { name: 'Hero', exact: true }).tap();
    } else {
      await page.locator('.desktop-menu').getByRole('link', { name: 'Documentation', exact: true }).tap();
      await page.locator('.child-pages').getByRole('link', { name: 'Sections' }).tap();
      await page.locator('.child-pages').getByRole('link', { name: 'Hero' }).tap();
    }
    await expect(page).toHaveURL(/\/docs\/hero\/$/);
    await expect(page.locator('.ps-left-sidebar')).toBeHidden();
    await context.close();
  }
});

for (const width of [390, 1600]) {
  test(`documentation is readable and linked without JavaScript at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const route of ['/docs/card-grid/', '/docs/code/', '/docs/core-api/', '/docs/installation/']) {
      const response = await page.goto('http://127.0.0.1:4174' + route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('main h1')).toHaveCount(1);
      const chapters = page.getByRole('navigation', { name: 'Documentation chapters' });
      if (route.startsWith('/docs/')) { if (width >= 1600) await expect(chapters).toBeVisible(); else await expect(chapters).toBeHidden(); }
      else await expect(chapters).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const code = page.locator('.ps-code-block');
      expect(await code.count()).toBeGreaterThan(0);
      await expect(code.first().getByRole('button', { name: 'Copy code' })).toBeDisabled();
      await expect(page.locator('[style*="--ps-code-light"]').first()).toBeAttached();
    }
    await page.screenshot({ path: `.artifacts/website-no-js-${width}.png`, fullPage: true });
    await context.close();
  });
}

test('card settings update the preview and the copyable source together', async ({ page, context }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/docs/card-grid/');
  await page.getByRole('combobox', { name: 'Card variant', exact: true }).selectOption('catalog');
  await page.getByRole('combobox', { name: 'Card tone', exact: true }).selectOption('standard');
  await page.getByRole('combobox', { name: 'Card size', exact: true }).selectOption('l');
  await page.getByRole('combobox', { name: 'Media aspect', exact: true }).selectOption('1/1');
  const preview = page.locator('[data-preview]');
  await expect(preview.locator('[data-card-variant="catalog"]')).toHaveCount(4);
  await expect(preview.locator('.ps-card').first()).toHaveAttribute('data-tone', 'standard');
  await expect(preview.locator('.ps-card').first()).toHaveAttribute('data-ps-card-size', 'l');
  const code = page.locator('#playground .ps-code-block').first();
  await expect(code).toContainText('cardTone="standard"');
  await expect(code).toContainText('cardSize="l"');
  await expect(code).toContainText('mediaAspect="1/1"');
  await code.getByRole('button', { name: 'Copy code' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('mediaAspect="1/1"');
  await page.getByRole('button', { name: 'Reset example' }).click();
  await expect(code).toContainText('cardTone="muted"');
  await page.screenshot({ path: '.artifacts/website-card-grid.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('code composition supports languages, side order, wrapping and dark mode', async ({ page }) => {
  await page.goto('/docs/code/');
  await page.getByRole('combobox', { name: 'Language', exact: true }).selectOption('json');
  await page.getByRole('combobox', { name: 'Code position', exact: true }).selectOption('left');
  await page.getByLabel('Wrap long lines', { exact: true }).check();
  const preview = page.locator('[data-code-preview]');
  await expect(preview.locator('.ps-code-block')).toHaveAttribute('data-wrap', 'true');
  await expect(preview.locator('.ps-content-block').first()).toContainText('"type": "code"');
  await expect(preview.locator('[style*="--ps-code-light"]').first()).toBeAttached();
  await page.setViewportSize({ width: 1700, height: 1000 });
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  await expect(preview.locator('.ps-code-block')).toHaveAttribute('data-code-mode', 'dark');
  await page.screenshot({ path: '.artifacts/website-code-dark.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  const blocks = preview.locator('.ps-content-block');
  const first = await blocks.nth(0).boundingBox(), second = await blocks.nth(1).boundingBox();
  expect(second!.y).toBeGreaterThanOrEqual(first!.y + first!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('global search supports shortcuts, keyboard navigation and empty results', async ({ page }) => {
  await page.goto('/docs/');
  const input = page.getByRole('combobox', { name: 'Search documentation' });
  await expect(input).toBeVisible();
  await page.keyboard.press('Control+k');
  await expect(input).toBeFocused();
  await input.fill('CodeBlock');
  await expect(page.getByRole('option')).toHaveCount(1);
  await input.press('ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'site-search-result-0');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/docs\/code\/$/);
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await page.keyboard.press('Meta+k');
  await expect(input).toBeFocused();
  await input.fill('no-matching-topic-123');
  await expect(page.getByText('No matching topics.', { exact: false })).toBeVisible();
  await input.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await input.fill('portfolio');
  await page.getByRole('listbox', { name: 'Search results' }).getByRole('option').click();
  await expect(page).toHaveURL(/\/showcase\/portfolio\/$/);
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Showcase', exact: true }).click();
  await expect(page.getByRole('link', { name: 'A personal portfolio', exact: true })).toBeVisible();
});

test('home explains the library and getting started stays focused', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#what-is-page-sections')).toContainText('Svelte and HTML');
  await expect(page.locator('#features .ps-card')).toHaveCount(6);
  await page.goto('/getting-started/');
  await expect(page.getByRole('navigation', { name: 'Documentation chapters' })).toHaveCount(0);
  await expect(page.locator('#install')).toContainText('npm install @page-sections/svelte');
  await expect(page.locator('#first-page')).toContainText('ContentPage');
  await page.getByRole('navigation', { name: 'Reading order' }).locator('[rel=next]').click();
  await expect(page).toHaveURL(/\/docs\/$/);
  await page.setViewportSize({ width: 1809, height: 900 });
  await page.goto('/docs/');
  const chapters = page.getByRole('navigation', { name: 'Documentation chapters' });
  await expect(chapters.getByRole('link').first()).toHaveText('Foundations');
  for (const summary of await chapters.locator('summary').all()) await summary.click();
  await expect(chapters.getByRole('searchbox')).toHaveCount(0);
  const titles = (await chapters.getByRole('link').allTextContents()).map(title => title.trim());
  expect(titles.indexOf('Page shell')).toBeLessThan(titles.indexOf('Hero'));
  expect(titles.indexOf('Hero')).toBeLessThan(titles.indexOf('Code'));
  expect(titles.indexOf('Code')).toBeLessThan(titles.indexOf('Card and Image'));
});

for (const width of [320, 600, 840, 1200, 1700]) {
  test(`header search and GitHub link fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const github = page.getByRole('link', { name: 'Page Sections on GitHub' });
    await expect(github).toBeVisible();
    await expect(github).toHaveAttribute('href', 'https://github.com/LauridBergjohann/page-sections');
    const header = await page.locator('.website-header .header').boundingBox();
    expect(header!.height).toBe(width < 1600 ? 66 : 64);
    const input = page.getByRole('combobox', { name: 'Search documentation' });
    if (width < 800) {
      await page.getByRole('button', { name: 'Open search', exact: true }).click();
    } else await input.click();
    await expect(input).toBeFocused();
    await input.fill('card grid');
    await expect(page.getByRole('option').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await input.press('Escape');
    await expect(page.getByRole('listbox')).toHaveCount(0);
    if (width < 800) await expect(page.getByRole('button', { name: 'Open search', exact: true })).toBeFocused();
    await page.keyboard.press('Control+k');
    await expect(input).toBeFocused();
    await input.fill('CodeBlock');
    await input.press('Enter');
    await expect(page).toHaveURL(/\/docs\/code\/$/);
    if (width >= 1200) {
      const brand = await page.getByRole('link', { name: 'Page Sections home', exact: true }).boundingBox();
      const showcase = await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Showcase', exact: true }).boundingBox();
      expect(showcase!.x - brand!.x - brand!.width).toBeGreaterThan(24);
    }
  });
}

test('minimal demo renders a complete page without documentation infrastructure', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.getByRole('heading', { name: 'Field notes', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'A community garden', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Documentation chapters' })).toHaveCount(0);
  await context.close();
});
