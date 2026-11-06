import { expect, test, type Page } from '@playwright/test';

async function openSettings(page: Page) {
  const settings = page.locator('.ps-navigation .settings');
  if (await settings.isVisible() && await settings.getAttribute('open') === null) {
    await settings.locator('summary').click();
  }
}

const routes = [
  { path: '/', title: 'Page Sections — A place for your content', heading: 'Space for your ideas.', menu: 'Home' },
  { path: '/components/', title: 'Components — Page Sections', heading: 'The building blocks.', menu: 'Components' },
  { path: '/backgrounds/', title: 'Backgrounds — Page Sections', heading: 'A sense of continuity.', menu: 'Backgrounds' }
];

for (const width of [375, 840, 1600]) {
  test(`all routes and native interactions without JavaScript at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const route of routes) {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(route.title);
      await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: route.menu, exact: true })).toHaveAttribute('aria-current', 'page');
      await openSettings(page);
      await expect(page.getByRole('button', { name: 'Dark', exact: true })).toBeDisabled();
      if (width < 1600) await page.locator('.settings summary').click();
      if (route.path !== '/') {
        await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Home' })).toBeVisible();
        await expect(page.getByRole('navigation', { name: 'On this page' })).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: `.artifacts/demo-${route.menu.toLowerCase()}-no-js-${width}.png`, fullPage: true });
    }
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Components', exact: true }).click();
    await expect(page).toHaveURL(/\/components\/$/);
    await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Responsive grid', exact: true }).click();
    await expect(page).toHaveURL(/#layout$/);
    const primary = await page.getByTestId('primary-block').boundingBox();
    const secondary = await page.getByTestId('secondary-block').boundingBox();
    if (width === 375) expect(secondary!.y).toBeGreaterThan(primary!.y);
    else expect(Math.abs(primary!.y - secondary!.y)).toBeLessThan(1);
    const grid = page.locator('#layout .ps-content-grid');
    expect(await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(width === 375 ? 4 : width === 840 ? 8 : 12);
    await page.locator('#narrow').evaluate(el => el.style.width = '590px');
    expect(await page.locator('#narrow .ps-content-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(4);
    await expect(page.locator('#carousel a')).toHaveCount(5);
    const track = page.locator('#carousel-track');
    await expect(track).toHaveCSS('scroll-snap-type', 'x mandatory');
    await expect(page.getByRole('button', { name: 'Next cards' })).toHaveCount(0);
    await track.focus(); await page.keyboard.press('ArrowRight');
    await expect.poll(() => track.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
    await expect(page.locator('#data-story strong')).toHaveText('plain data');
    await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Home' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Space for your ideas.');
    await context.close();
  });
}

test('client routing preserves the layout and theme, including browser history', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text());
  });
  await page.addInitScript(() => Object.defineProperty(navigator, 'gpu', { value: undefined }));
  await page.goto('/');
  await openSettings(page);
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  const shell = page.locator('[data-ps-theme]');
  await expect(shell).toHaveAttribute('data-ps-theme', 'dark');
  await shell.evaluate(el => el.setAttribute('data-persistence-probe', 'retained'));
  const menu = page.getByRole('navigation', { name: 'Main navigation' });
  for (const route of routes.slice(1)) {
    await menu.getByRole('link', { name: route.menu, exact: true }).click();
    await expect(page).toHaveTitle(route.title);
    await expect(shell).toHaveAttribute('data-ps-theme', 'dark');
    await expect(shell).toHaveAttribute('data-persistence-probe', 'retained');
    await expect(menu.locator('[aria-current="page"]')).toHaveText(route.menu);
  }
  await page.goBack();
  await expect(menu.locator('[aria-current="page"]')).toHaveText('Components');
  await expect(shell).toHaveAttribute('data-ps-theme', 'dark');
  await page.getByRole('button', { name: 'Next cards' }).click();
  await expect.poll(() => page.locator('#carousel-track').evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  await openSettings(page);
  await page.getByRole('button', { name: 'Light', exact: true }).click();
  await expect(shell).toHaveAttribute('data-ps-theme', 'light');
  await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Responsive grid', exact: true }).click();
  await expect(page).toHaveURL(/#layout$/);
  expect(errors.filter(error => !error.includes('Failed to load resource') && !error.includes('ERR_'))).toEqual([]);
});

test('all gradients and automatic group corners work in both themes', async ({ page }) => {
  await page.goto('/backgrounds/');
  for (const mode of ['Light', 'Dark']) {
    await openSettings(page);
    await page.getByRole('button', { name: mode, exact: true }).click();
    await page.keyboard.press('Escape');
    for (const id of ['transparentToStandard', 'transparentToMuted', 'standardToTransparent', 'standardToMuted', 'mutedToTransparent', 'mutedToStandard']) {
      await expect(page.locator(`#${id.toLowerCase()}`)).toHaveAttribute('data-background-size', 'full');
      await expect(page.locator(`#${id.toLowerCase()} > .ps-section-surface`)).toHaveCSS('background-image', /linear-gradient/);
    }
    for (const [id, top, bottom] of [['first', '18px', '0px'], ['middle', '0px', '0px'], ['last', '0px', '18px'], ['change', '18px', '18px']]) {
      await expect(page.locator(`#group-${id} > .ps-section-surface`)).toHaveCSS('border-top-left-radius', top);
      await expect(page.locator(`#group-${id} > .ps-section-surface`)).toHaveCSS('border-bottom-left-radius', bottom);
    }
    const surface = await page.locator('#standard-standard > .ps-section-surface').evaluate(el => getComputedStyle(el).backgroundColor);
    expect(surface).toBe(mode === 'Light' ? 'rgb(255, 255, 255)' : 'rgb(32, 45, 59)');
    await page.screenshot({ path: `.artifacts/demo-backgrounds-${mode.toLowerCase()}.png`, fullPage: true });
  }
});

test('skip link and navigation are keyboard accessible', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  const components = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Components', exact: true });
  await components.focus(); await page.keyboard.press('Enter');
  await expect(page).toHaveTitle('Components — Page Sections');
});

test('compact navigation fits wider font metrics on every route at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const route of routes) {
    await page.goto(route.path);
    // Verdana reproduces the wrap on Windows; the generic fallback also runs on Linux.
    // Letter spacing adds a deterministic width stress even when Verdana is unavailable.
    await page.addStyleTag({ content: '.ps-navigation { font-family: Verdana, sans-serif !important; letter-spacing: .1px; }' });
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    const header = (await nav.locator('.header').boundingBox())!;
    expect(header.height).toBe(66);
    const links = await nav.locator('.menu a').evaluateAll(elements => elements.map(element => {
      const { x, y, right, bottom } = element.getBoundingClientRect();
      return { x, y, right, bottom };
    }));
    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link.y).toBe(links[0].y);
      expect(link.x).toBeGreaterThanOrEqual(header.x);
      expect(link.right).toBeLessThanOrEqual(header.x + header.width);
      expect(link.bottom).toBeLessThanOrEqual(header.y + header.height);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

for (const width of [320, 600, 840, 1200, 1599, 1600, 1809, 2300]) {
  test('navigation follows the reference at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav.getByRole('link', { name: 'Page Sections home' })).toBeVisible();
    const header = await nav.locator('.header').boundingBox();
    expect(header!.height).toBe(width < 1600 ? 66 : 64);
    if (width < 1600) {
      await expect(nav.locator('.satellite.left')).toBeHidden();
      await expect(nav.locator('.satellite.right')).toBeHidden();
      await expect(page.getByRole('button', { name: 'Dark', exact: true })).toHaveCount(0);
      await nav.locator('summary').focus(); await page.keyboard.press('Enter');
      await page.getByRole('button', { name: 'Dark', exact: true }).click();
      await expect(page.locator('[data-ps-theme]')).toHaveAttribute('data-ps-theme', 'dark');
      await expect(page.getByRole('link', { name: 'Documentation', exact: true })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(nav.locator('summary')).toBeFocused();
      await expect(nav.locator('details')).not.toHaveAttribute('open');
      await nav.locator('summary').click();
      await page.screenshot({ path: '.artifacts/navigation-settings-' + width + '.png' });
      await page.locator('.demo-footer').click();
      await expect(nav.locator('details')).not.toHaveAttribute('open');
    } else {
      await expect(nav.locator('.settings')).toBeHidden();
      await expect(page.getByRole('button', { name: 'Dark', exact: true })).toBeVisible();
      const left = await nav.locator('.left').boundingBox();
      const right = await nav.locator('.right').boundingBox();
      expect(left!.x + left!.width).toBeLessThan(header!.x);
      expect(right!.x).toBeGreaterThan(header!.x + header!.width);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await nav.screenshot({ path: '.artifacts/navigation-' + width + '.png' });
  });
}
