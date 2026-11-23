import { expect, test, type Locator } from '@playwright/test';

test('control and panel edges are independent and preserve header geometry', async ({ page }) => {
  await page.goto('/docs/');
  await page.addStyleTag({ content: ':root, .ps-shell { --ps-border: rgb(200, 50, 30) !important; --ps-panel-border: rgb(30, 60, 200) !important; }' });
  const header = page.locator('.website-header .header');
  for (const width of [390, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const edge = await header.evaluate(el => {
      const css = getComputedStyle(el, '::after');
      return { color: css.borderBottomColor, top: css.borderTopWidth, bottom: css.borderBottomWidth };
    });
    expect(edge).toEqual({ color: 'rgb(30, 60, 200)', top: width < 1600 ? '0px' : '1px', bottom: '1px' });
    const before = await header.boundingBox();
    await page.addStyleTag({ content: ':root, .ps-shell { --ps-panel-border: transparent !important; }' });
    expect(await header.boundingBox()).toEqual(before);
    await page.addStyleTag({ content: ':root, .ps-shell { --ps-panel-border: rgb(30, 60, 200) !important; }' });
  }
  await expect(page.locator('.satellite .ps-button-group').first()).toHaveCSS('outline-color', 'rgb(200, 50, 30)');
});

test('breadcrumbs follow the responsive content inset', async ({ page }) => {
  await page.goto('/docs/foundations/installation/');
  const breadcrumbs = page.locator('.breadcrumbs');
  const content = page.locator('.ps-page-content .ps-section-content').first();
  for (const [width, inset] of [[390, 12], [599, 12], [600, 16], [839, 16], [840, 16], [1199, 16], [1200, 24], [1599, 24]]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(breadcrumbs).toHaveCSS('padding-left', `${inset}px`);
    await expect(breadcrumbs).toHaveCSS('padding-right', `${inset}px`);
    const breadcrumbStart = await breadcrumbs.locator('nav').evaluate(el => el.getBoundingClientRect().left);
    const contentStart = await content.evaluate(el => el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft));
    expect(Math.abs(breadcrumbStart - contentStart)).toBeLessThan(1);
  }
});

for (const width of [390, 1599]) {
  for (const javaScriptEnabled of [false, true]) {
    test(`compact content menu docks and reflects its open state at ${width}px, JS=${javaScriptEnabled}`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ baseURL, javaScriptEnabled, viewport: { width, height: 900 } });
      const page = await context.newPage();
      await page.goto('/docs/design-system/responsive-layout/');
      const content = page.locator('main').first();
      const button = content.getByRole('button', { name: 'On this page', exact: true });
      const popup = content.locator('.ps-content-menu-slot .popup');
      const initial = (await button.boundingBox())!;
      const section = (await content.locator('[data-ps-section]').first().boundingBox())!;
      expect(initial.y - section.y).toBe(12);
      expect(section.x + section.width - initial.x - initial.width).toBe(12);
      for (const y of [16, 32, 64, 200, 600, 0]) {
        await page.evaluate(y => window.scrollTo(0, y), y);
        await expect.poll(() => page.evaluate(() => scrollY)).toBe(y);
        await expect.poll(async () => (await button.boundingBox())!.y).toBe(Math.max(12, initial.y - y));
        if (width === 390 && javaScriptEnabled && y === 200) await page.screenshot({ path: test.info().outputPath('content-menu-docked.png') });
      }
      // A genuinely fixed header still needs room above the docked control.
      const header = page.locator('.website-header');
      await header.evaluate(node => node.setAttribute('data-scroll', 'fixed'));
      await page.evaluate(() => window.scrollTo(0, 200));
      await expect.poll(async () => (await button.boundingBox())!.y).toBe(78);
      await header.evaluate(node => node.setAttribute('data-scroll', 'static'));
      await expect.poll(async () => (await button.boundingBox())!.y).toBe(12);
      await header.evaluate(node => node.setAttribute('data-scroll', 'delayed'));
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect.poll(async () => (await button.boundingBox())!.y).toBe(initial.y);
      // Use custom tokens to verify the same theming contract as ButtonGroup.
      await content.evaluate(node => {
        node.style.setProperty('--ps-accent', 'rgb(4, 180, 120)');
        node.style.setProperty('--ps-selection', 'rgb(50, 60, 70)');
      });
      const normal = await button.evaluate(node => ({ color: getComputedStyle(node).color, background: getComputedStyle(node).backgroundColor }));
      for (const dismissal of javaScriptEnabled ? ['toggle', 'escape', 'outside'] : ['toggle']) {
        await button.click();
        await expect(popup).toBeVisible();
        await expect(button).toHaveCSS('color', 'rgb(4, 180, 120)');
        await expect(button.locator('svg')).toHaveCSS('stroke', 'rgb(4, 180, 120)');
        await expect(button).toHaveCSS('background-color', 'rgb(50, 60, 70)');
        if (dismissal === 'escape') await page.keyboard.press('Escape');
        else if (dismissal === 'outside') await content.locator('h1').click();
        else await button.click();
        await expect(popup).toBeHidden();
        await expect(button).toHaveCSS('color', normal.color);
        await expect(button).toHaveCSS('background-color', normal.background);
      }
      await context.close();
    });
  }
}

for (const width of [390, 1920]) {
  for (const javaScriptEnabled of [false, true]) {
    test(`header and satellites share the 32px scroll delay at ${width}px, JS=${javaScriptEnabled}`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ baseURL, javaScriptEnabled, viewport: { width, height: 900 } });
      const page = await context.newPage();
      await page.goto('/docs/design-system/responsive-layout/');
      const header = page.locator('.website-header');
      await expect(header).toHaveAttribute('data-scroll', 'delayed');
      const surfaces = width >= 1600 ? header.locator('.header, .satellite') : header.locator('.header');
      const initialTops = await surfaces.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top));
      const content = page.locator('main').first();
      const contentTop = (await content.boundingBox())!.y;
      for (const y of [0, 16, 32, 48, 160, 16, 0]) {
        await page.evaluate(y => window.scrollTo(0, y), y);
        await expect.poll(() => surfaces.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top)))
          .toEqual(initialTops.map(top => top + Math.min(0, 32 - y)));
        expect((await content.boundingBox())!.y + y).toBeCloseTo(contentTop, 1);
      }
      // Customizing the CSS token changes the hold distance without adding page spacing.
      await header.evaluate(node => node.style.setProperty('--ps-sticky-range', '64px'));
      await page.evaluate(() => window.scrollTo(0, 48));
      await expect.poll(() => surfaces.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top))).toEqual(initialTops);
      expect((await content.boundingBox())!.y + 48).toBeCloseTo(contentTop, 1);
      await context.close();
    });
  }
}

test('site footer exposes its documentation, legal links and responsive theme', async ({ page }) => {
  test.setTimeout(90000); // Capture and check the footer at sixteen viewport boundaries.
  await page.goto('/docs/page-layout/footer/');
  const footer = page.locator('.site-footer');
  const socialLinks = footer.locator('.ps-footer-social a');
  await expect(socialLinks).toHaveText(['GitHub', 'NPM', 'Vercel', 'Bergjohann', 'LinkedIn', 'Svelte']);
  await expect(footer.getByRole('link', { name: 'NPM', exact: true })).toHaveAttribute('href', 'https://www.npmjs.com/package/@page-sections/svelte');
  await expect(footer.getByRole('link', { name: 'Vercel', exact: true })).toHaveAttribute('href', 'https://vercel.com/');
  await expect(footer.getByRole('link', { name: 'Svelte', exact: true })).toHaveAttribute('href', 'https://svelte.dev/');
  await expect(socialLinks.locator('svg')).toHaveCount(6);
  await expect(page.locator('main h1')).toHaveText('Footer');
  await expect(page.getByRole('banner')).toHaveCount(1);
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('contentinfo')).toHaveCount(1);
  await expect(page.locator('.footer-preview .ps-footer-main')).toHaveCount(0);
  for (const width of [320, 359, 360, 390, 599, 600, 839, 840, 1199, 1200, 1599, 1600, 1808, 1809, 1920, 2300]) {
    await page.setViewportSize({ width, height: 1000 });
    const navigation = page.getByRole('navigation', { name: 'Main navigation', exact: true });
    await expect(navigation).toHaveCount(1);
    await expect(navigation.getByRole('link', { name: 'Page Sections home' })).toHaveCount(0);
    await expect(navigation.locator('.tools, .settings, .satellite')).toHaveCount(0);
    await expect(footer.getByRole('link', { name: 'GitHub', exact: true })).toBeVisible();
    const linkedin = footer.getByRole('link', { name: 'LinkedIn', exact: true });
    await expect(linkedin).toBeVisible();
    await expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/laurid-bergjohann');
    await expect(linkedin.locator('svg')).toBeVisible();
    const website = footer.getByRole('link', { name: 'Bergjohann', exact: true });
    await expect(website).toBeVisible();
    await expect(website).toHaveAttribute('href', 'https://bergjohann.com/');
    await expect(website.locator('svg')).toHaveClass(/lucide-globe/);
    const text = website.locator('span').last();
    await expect(footer.locator('.ps-footer-social ul')).toHaveCSS('column-gap', '0px');
    expect(await text.evaluate(element => element.getBoundingClientRect().height)).toBeLessThanOrEqual(await text.evaluate(element => parseFloat(getComputedStyle(element).lineHeight)));
    const rectangles = await socialLinks.evaluateAll(links => links.map(link => {
      const icon = link.firstElementChild!.getBoundingClientRect();
      const label = link.lastElementChild!.getBoundingClientRect();
      return { left: Math.min(icon.left, label.left), right: Math.max(icon.right, label.right), top: icon.top };
    }));
    for (const first of rectangles) for (const second of rectangles) {
      if (first.left < second.left && Math.abs(first.top - second.top) < 2) expect(first.right).toBeLessThanOrEqual(second.left);
    }
    await expect(footer.getByRole('link', { name: 'Privacy', exact: true })).toHaveAttribute('href', '/about/#datenschutz');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const shell = page.locator('.ps-shell');
    await expect(shell).toHaveCSS('background-color', await themeColor(shell, '--ps-background'));
    await expect(footer.locator('.ps-footer-main')).toHaveCSS('background-color', await themeColor(shell, '--ps-footer-background'));
    await expect(footer.locator('.ps-footer-main')).toHaveCSS('color', await themeColor(shell, '--ps-footer-ink'));
    await expect(footer.locator('.ps-footer-bar')).toHaveCSS('background-color', await themeColor(shell, '--ps-footer-bar-background'));
    await expect(footer.locator('.ps-footer-links a').first()).toHaveCSS('color', await themeColor(shell, '--ps-footer-bar-ink'));
    if (width === 1200) {
      const social = (await footer.locator('.ps-footer-social').boundingBox())!;
      const label = (await footer.getByRole('link', { name: 'GitHub', exact: true }).locator('span').last().boundingBox())!;
      expect(label.x + label.width).toBeCloseTo(social.x + social.width, 0);
    }
    await footer.screenshot({ path: test.info().outputPath(`site-footer-${width}.png`) });
  }
  await expect(footer.getByRole('link', { name: 'Footer', exact: true })).toHaveAttribute('href', '/docs/page-layout/footer/');
  await page.locator('.satellite.right').getByRole('button', { name: 'Dark', exact: true }).click();
  await expect(page.locator('.ps-shell')).toHaveCSS('background-color', await themeColor(page.locator('.ps-shell'), '--ps-background'));
  await expect(footer.locator('.ps-footer-main')).toHaveCSS('background-color', await themeColor(page.locator('.ps-shell'), '--ps-footer-background'));
  await expect(footer.locator('.ps-footer-main')).toHaveCSS('color', await themeColor(page.locator('.ps-shell'), '--ps-footer-ink'));
  await expect(footer.locator('.ps-footer-links a').first()).toHaveCSS('color', await themeColor(page.locator('.ps-shell'), '--ps-footer-bar-ink'));
  await expect(footer.locator('.ps-footer-bar')).toHaveCSS('background-color', await themeColor(page.locator('.ps-shell'), '--ps-footer-bar-background'));
  await footer.screenshot({ path: test.info().outputPath('site-footer-dark.png') });
});

// Resolve the website's theme tokens through CSS rather than pinning its palette.
async function themeColor(shell: Locator, token: `--ps-${string}`) {
  return shell.evaluate((element, token) => {
    const probe = document.createElement('span');
    probe.style.color = `var(${token})`;
    element.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, token);
}

test('headings, compact code tools and nested routes use the website design system', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto('/docs/foundations/installation/');
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb', exact: true });
  await expect(breadcrumb.getByRole('link').nth(0)).toHaveAttribute('href', '/docs/');
  await expect(breadcrumb.getByRole('link').nth(1)).toHaveAttribute('href', '/docs/foundations/');
  await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText('Installation');
  await expect(page.locator('main h1')).toHaveCSS('font-size', '32px');
  await expect(page.locator('.ps-left-sidebar summary svg').first()).toHaveClass(/lucide/);
  const disclosure = page.locator('.ps-left-sidebar summary').first();
  await expect(disclosure.locator('svg')).toHaveClass(/lucide-chevron-down/);
  await expect(disclosure.locator('span')).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');
  await disclosure.click();
  await expect(disclosure.locator('span')).toHaveCSS('transform', 'none');
  await disclosure.click();
  const copy = page.locator('.ps-code-block').first();
  expect((await copy.boundingBox())!.height).toBeLessThan(80);
  const tools = (await copy.locator('.tools').boundingBox())!;
  const source = (await copy.locator('pre').boundingBox())!;
  expect(source.x + source.width).toBeLessThanOrEqual(tools.x + 1);
  expect(Math.abs(tools.y - source.y)).toBeLessThan(1);
  const shell = page.locator('.ps-shell');
  await expect(shell).toHaveAttribute('data-ps-theme', 'light');
  const lightAccent = await themeColor(shell, '--ps-accent');
  await expect.poll(() => page.locator('.desktop-menu .ps-main-menu').evaluate(node => getComputedStyle(node, '::before').backgroundColor)).toBe(await themeColor(shell, '--ps-selection'));
  await expect(page.locator('.site-footer .ps-footer-links a').last()).toHaveCSS('color', await themeColor(shell, '--ps-footer-bar-ink'));
  await page.goto('/sections/headings/');
  const preview = page.locator('#heading-preview');
  await page.getByRole('combobox', { name: 'Heading size', exact: true }).selectOption('xl');
  await page.getByRole('combobox', { name: 'Heading level', exact: true }).selectOption('3');
  await expect(preview.locator('h3')).toHaveText('A new perspective');
  const contentMenu = page.locator('.ps-content-menu-slot .desktop');
  await expect(contentMenu.locator('a[href="#page-heading"]')).toHaveCount(0);
  await expect(contentMenu.locator('li[data-heading-level="3"]')).toHaveCSS('margin-inline-start', '16px');
  await page.getByRole('combobox', { name: 'Heading level', exact: true }).selectOption('1');
  await expect(contentMenu.locator('a[href="#heading-preview"]')).toHaveCount(0);
  await page.getByRole('combobox', { name: 'Heading level', exact: true }).selectOption('2');
  await expect(contentMenu.locator('a[href="#heading-preview"]')).toBeVisible();
  await expect(preview.locator('.ps-heading')).toHaveAttribute('data-size', 'xl');
  await page.getByRole('combobox', { name: 'Surface', exact: true }).selectOption('standard');
  await expect(preview).toHaveAttribute('data-background-color', 'standard');
  await page.locator('.satellite.right').getByRole('button', { name: 'Dark', exact: true }).click();
  await expect(shell).toHaveAttribute('data-ps-theme', 'dark');
  const darkAccent = await themeColor(shell, '--ps-accent');
  expect(darkAccent).not.toBe(lightAccent);
  await expect(page.locator('.site-footer .ps-footer-links a').last()).toHaveCSS('color', await themeColor(shell, '--ps-footer-bar-ink'));
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/getting-started/');
  const burger = (await page.locator('.mobile-menu > summary').boundingBox())!;
  const brand = (await page.locator('.website-header .brand').boundingBox())!;
  expect(burger.x + burger.width).toBeLessThanOrEqual(brand.x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  const mobileCode = page.locator('.ps-code-block').first();
  expect((await mobileCode.boundingBox())!.height).toBeLessThan(80);
});

test('navigation surfaces, hover geometry and sidebar state stay consistent across pages', async ({ page }) => {
  await page.setViewportSize({ width: 1809, height: 1000 });
  await page.goto('/docs/foundations/installation/');
  const docs = page.locator('.desktop-menu').getByRole('link', { name: 'Documentation', exact: true });
  const palette = await docs.evaluate(el => {
    const css = getComputedStyle(el);
    return { muted: css.getPropertyValue('--ps-selection').trim() || css.getPropertyValue('--ps-section-muted').trim(), standard: css.getPropertyValue('--ps-section-standard').trim(), accent: css.getPropertyValue('--ps-accent').trim() };
  });
  // Resolve theme tokens through CSS, independent of the palette's color notation.
  const colors = await page.evaluate(palette => {
    const node = document.createElement('span'); document.body.append(node);
    const result: Record<string, string> = {};
    for (const [key, color] of Object.entries(palette)) { node.style.color = color; result[key] = getComputedStyle(node).color; }
    node.remove(); return result;
  }, palette);
  await expect.poll(() => page.locator('.desktop-menu .ps-main-menu').evaluate(node => getComputedStyle(node, '::before').backgroundColor)).toBe(colors.muted);
  await expect(docs).toHaveCSS('font-weight', '400');
  await expect(docs).toHaveCSS('border-radius', '0px');
  const headerBox = (await page.locator('.website-header .header').boundingBox())!;
  expect((await docs.boundingBox())!.height).toBe(headerBox.height);
  await expect(page.locator('.satellite.right [aria-pressed="true"]:visible')).toHaveCSS('color', colors.accent);
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
  await expect.poll(() => page.locator('.desktop-menu .ps-main-menu').evaluate(node => getComputedStyle(node, '::before').backgroundColor)).toBe(colors.muted);
  const sidebar = page.locator('.ps-left-sidebar');
  const initialTop = (await sidebar.boundingBox())!.y;
  await expect(sidebar.locator('[aria-current="page"]')).toHaveCSS('background-color', colors.muted);
  await expect(sidebar.locator('[aria-current="page"]')).toHaveCSS('font-weight', '650');
  await expect(sidebar.getByRole('link', { name: 'Foundations', exact: true })).toHaveCSS('background-color', colors.muted);
  await expect(sidebar.getByRole('link', { name: 'Foundations', exact: true })).toHaveCSS('font-weight', '400');
  const parentText = (await sidebar.getByRole('link', { name: 'Foundations', exact: true }).locator('span').last().boundingBox())!;
  const childLink = sidebar.getByRole('link', { name: 'Installation', exact: true });
  const childText = (await childLink.locator('span').last().boundingBox())!;
  expect(Math.abs(childText.x - parentText.x)).toBeLessThan(3);
  await expect(childLink).toHaveCSS('font-size', '15px');
  await sidebar.getByRole('button', { name: 'Show pages in Foundations', exact: true }).click();
  await expect(sidebar.getByRole('link', { name: 'Installation', exact: true })).toBeHidden();
  await page.locator('.reading-path [rel="next"]').click();
  await expect(page).toHaveURL(/\/docs\/foundations\/pages-and-sections\/$/);
  await page.locator('.reading-path [rel="next"]').click();
  await expect(page).toHaveURL(/\/docs\/foundations\/first-page\/$/);
  await expect(sidebar.getByRole('link', { name: 'Using sections', exact: true })).toBeVisible();
  await expect(sidebar.locator('[aria-current="page"]')).toHaveText('Using sections');
  await sidebar.getByRole('button', { name: 'Show pages in Page layout', exact: true }).click();
  await sidebar.getByRole('link', { name: 'ContentPage and sidebars', exact: true }).click();
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
  const start = menu.getByRole('link', { name: 'Getting Started', exact: true });
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
  await page.goto('/sections/hero/');
  const menu = page.locator('.website-header .desktop-menu');
  const docs = menu.getByRole('link', { name: 'Sections', exact: true });
  await docs.hover();
  await expect(menu.locator('.ps-submenu:visible > ul > li')).toHaveCount(9);
  await expect(menu.locator('.ps-submenu:visible svg')).toHaveCount(9);
  await expect(menu.locator('.ps-submenu .ps-submenu')).toHaveCount(0);
  await expect(page.locator('[data-ps-popup-backdrop]:popover-open')).toBeVisible();
  await expect(page.locator('[data-ps-popup-backdrop]:popover-open')).toHaveCSS('backdrop-filter', 'blur(3px)');
  await expect(page.locator('[data-ps-popup-backdrop]:popover-open')).toHaveCSS('transition-duration', '0s');
  await page.mouse.move(0, 500);
  await expect(page.locator('[data-ps-popup-backdrop]:popover-open')).toHaveCount(0);
  await docs.hover();
  await expect(page.locator('[data-ps-popup-backdrop]:popover-open')).toHaveCSS('backdrop-filter', 'blur(3px)');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-ps-popup-backdrop]:popover-open')).toHaveCount(0);
  await menu.getByRole('link', { name: 'About', exact: true }).focus();
  await docs.focus();
  await expect(menu.getByRole('link', { name: 'Hero', exact: true })).toBeVisible();
  await menu.getByRole('link', { name: 'Hero', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(docs).toBeFocused();
  await expect(page.locator('[data-ps-popup-backdrop]:popover-open')).toHaveCount(0);
  const opened = page.context().waitForEvent('page');
  await docs.click({ modifiers: ['Control'] });
  const newTab = await opened;
  await newTab.waitForURL(/\/sections\/$/);
  await newTab.close();
  await docs.click();
  await expect(page).toHaveURL(/\/sections\/$/);
  await expect(page.getByRole('navigation', { name: 'Breadcrumb', exact: true })).toHaveCount(0);
  await page.locator('#section-catalog').getByRole('link', { name: 'Hero', exact: true }).click();
  await expect(page).toHaveURL(/\/sections\/hero\/$/);
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb', exact: true });
  await expect(breadcrumb.locator('li')).toHaveCount(2);
  await expect(breadcrumb).not.toContainText('Home');
  await expect(page.locator('.ps-left-sidebar [aria-current="page"]')).toHaveText('Hero');
  await expect(page.locator('.reading-path [rel="next"]')).toContainText('Image');
});

test('mobile menus allocate the page blur only while open and restore it on every dismissal path', async ({ page }) => {
  await page.goto('/docs/foundations/installation/');
  const backdrop = page.locator('[data-ps-popup-backdrop]:popover-open');
  const burger = page.locator('.website-header .mobile-menu > summary');
  for (const width of [320, 600, 840]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole('navigation', { name: 'Breadcrumb', exact: true }).locator('ol')).toHaveCSS('font-size', '12px');
    await expect(backdrop).toHaveCount(0);
    await burger.click();
    await expect(backdrop).toHaveCSS('backdrop-filter', 'blur(3px)');
    await burger.click();
    await expect(backdrop).toHaveCount(0);
    await burger.click();
    await expect(backdrop).toHaveCSS('backdrop-filter', 'blur(3px)');
    await page.keyboard.press('Escape');
    await expect(backdrop).toHaveCount(0);
  }
  await burger.click();
  await expect(backdrop).toHaveCSS('backdrop-filter', 'blur(3px)');
  await page.locator('.site-footer').click({ position: { x: 5, y: 5 } });
  await expect(backdrop).toHaveCount(0);
  await burger.click();
  await page.setViewportSize({ width: 1600, height: 900 });
  await expect(backdrop).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await burger.click();
  await expect(backdrop).toHaveCSS('backdrop-filter', 'blur(3px)');
  await page.locator('.mobile-panel').getByRole('link', { name: 'Documentation', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/$/);
  await expect(backdrop).toHaveCount(0);
});

test('touch and mobile users can reach deep pages through real parent pages', async ({ browser }) => {
  for (const width of [390, 1200]) {
    const context = await browser.newContext({ hasTouch: true, viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto(test.info().project.use.baseURL! + '/');
    if (width < 1200) {
      await page.locator('.mobile-menu > summary').tap();
      const mobile = page.locator('.mobile-panel');
      await mobile.getByRole('button', { name: 'Show pages in Sections', exact: true }).tap();
      await mobile.getByRole('link', { name: 'Hero', exact: true }).tap();
    } else {
      await page.locator('.desktop-menu').getByRole('link', { name: 'Sections', exact: true }).tap();
      await page.locator('#section-catalog').getByRole('link', { name: 'Hero', exact: true }).tap();
    }
    await expect(page).toHaveURL(/\/sections\/hero\/$/);
    await expect(page.locator('.ps-left-sidebar')).toBeHidden();
    await context.close();
  }
});

for (const width of [390, 1600]) {
  test(`documentation is readable and linked without JavaScript at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const route of ['/sections/card-grid/', '/sections/code/', '/docs/reference/core-api/', '/docs/foundations/installation/']) {
      const response = await page.goto(test.info().project.use.baseURL! + route);
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
    if (width < 1200) {
      const burger = page.locator('.mobile-menu > summary');
      await burger.click();
      await expect(page.locator('.menu-backdrop')).toHaveCSS('backdrop-filter', 'blur(3px)');
      await burger.click();
      await expect(page.locator('.menu-backdrop')).toBeHidden();
    }
    await page.screenshot({ path: `.artifacts/website-no-js-${width}.png`, fullPage: true });
    await context.close();
  });
}

test('card settings update the preview and the copyable source together', async ({ page, context }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/sections/card-grid/');
  await page.getByRole('checkbox', { name: 'Card shadow', exact: true }).check();
  await page.getByRole('combobox', { name: 'Card tone', exact: true }).selectOption('standard');
  await page.getByRole('combobox', { name: 'Card size', exact: true }).selectOption('l');
  await page.getByRole('combobox', { name: 'Media aspect', exact: true }).selectOption('1/1');
  const preview = page.locator('[data-preview]');
  await expect(preview.locator('.ps-card[data-shadow="true"]')).toHaveCount(4);
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
  await page.goto('/sections/code/');
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
  await page.setViewportSize({ width: 1600, height: 900 });
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
  await expect(page).toHaveURL(/\/sections\/code\/$/);
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
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Sections', exact: true }).click();
  await expect(page.locator('#section-catalog .ps-card')).toHaveCount(9);
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
  expect(titles).not.toContain('Sections');
  expect(titles).not.toContain('Hero');
  expect(titles.indexOf('What are sections?')).toBeLessThan(titles.indexOf('Using sections'));
  expect(titles.indexOf('ContentPage and sidebars')).toBeLessThan(titles.indexOf('Card'));
  expect(titles).toEqual(expect.arrayContaining(['Page layout', 'Components', 'Design system', 'Create your own section', 'Data types']));
});

test('home uses themed hero artwork, illustrated next steps and local technology icons', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto('/');
  const hero = page.locator('#welcome img');
  await expect.poll(() => hero.evaluate(img => img.currentSrc)).toContain('/hero-light.webp');
  const story = page.locator('#what-is-page-sections .ps-media-pair');
  await expect(story).toHaveAttribute('data-side', 'right');
  await expect(story.locator('img')).toHaveAttribute('src', /(?:^|\/)hero\.png$/);
  const imageBox = (await story.locator('img').boundingBox())!;
  const textBox = (await story.locator('.prose').boundingBox())!;
  expect(textBox.x + textBox.width).toBeLessThanOrEqual(imageBox.x);
  await expect(page.locator('#features-title')).toHaveText('Features');
  await expect(page.locator('#features .ps-card img')).toHaveCount(6);
  await expect(page.locator('#explore .title a')).toHaveText([
    'Install it or try it in the playground', 'Explore available sections', 'Make it yours — create a custom theme'
  ]);
  expect(await page.locator('#explore .title a').evaluateAll(links => links.map(link => new URL(link.href).pathname)))
    .toEqual(['/getting-started/', '/sections/', '/docs/foundations/themes/']);
  const technologies = page.locator('#built-with .ps-card');
  await expect(technologies).toHaveCount(8);
  await expect(technologies.locator('.title')).toHaveText([
    'Made with Page Sections', 'Available on NPM', 'Source available on GitHub', 'Hosted on Vercel',
    'Made for Svelte', 'Developed by Laurid Bergjohann', 'Created in VS Code', 'Supported by Codex'
  ]);
  expect(await technologies.evaluateAll(cards => cards.map(card => card.querySelector('.primary-link')?.getAttribute('href')))).toEqual([
    'https://page-sections.bergjohann.com/', 'https://www.npmjs.com/package/@page-sections/svelte',
    'https://github.com/LauridBergjohann/page-sections', 'https://vercel.com/', 'https://svelte.dev/',
    'https://bergjohann.com/', 'https://code.visualstudio.com/', 'https://chatgpt.com/codex'
  ]);
  for (const image of await page.locator('main img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  await page.screenshot({ path: test.info().outputPath('home-light.png'), fullPage: true });
  await page.locator('.satellite.right').getByRole('button', { name: 'Dark', exact: true }).click();
  await expect.poll(() => hero.evaluate(img => img.currentSrc)).toContain('/hero-dark.webp');
  for (const id of ['github', 'vercel', 'codex']) {
    const icon = page.locator(`#built-with [data-card-id="${id}"] img`);
    await icon.scrollIntoViewIfNeeded();
    await expect.poll(() => icon.evaluate(img => img.currentSrc)).toContain(`/technology/${id}-dark.svg`);
    await expect.poll(() => icon.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  await page.screenshot({ path: test.info().outputPath('home-dark.png'), fullPage: true });
  for (const width of [320, 600, 840, 1200]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: test.info().outputPath('home-mobile.png'), fullPage: true });
});

for (const javaScriptEnabled of [false, true]) {
  test(`section examples keep one outer surface run and highlighted source with JavaScript ${javaScriptEnabled}`, async ({ browser }) => {
    const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, javaScriptEnabled, viewport: { width: 1920, height: 1000 } });
    const page = await context.newPage();
    await page.goto('/sections/');
    const corners = page.locator('#examples-heading > .ps-section-surface');
    const radius = await page.locator('.ps-shell').evaluate(element => getComputedStyle(element).getPropertyValue('--ps-radius').trim());
    await expect(corners).toHaveCSS('border-top-left-radius', radius);
    await expect(corners).toHaveCSS('border-bottom-left-radius', '0px');
    await expect(corners).toHaveCSS('border-top-width', '1px');
    await expect(corners).toHaveCSS('border-bottom-width', '0px');
    for (const [index, slug] of sectionSlugs.entries()) {
      await expect(page.locator(`#${slug}`)).toHaveAttribute('data-background-color', index % 2 ? 'standard' : 'muted');
      const surface = page.locator(`#${slug} > .ps-section-surface`);
      await expect(surface).toHaveCSS('border-top-left-radius', '0px');
      await expect(surface).toHaveCSS('border-top-width', '0px');
      await expect(surface).toHaveCSS('border-bottom-width', index === sectionSlugs.length - 1 ? '1px' : '0px');
      await expect(surface).toHaveCSS('border-left-width', '1px');
      await expect(surface).toHaveCSS('border-right-width', '1px');
      await expect(surface).toHaveCSS('border-bottom-left-radius', index === sectionSlugs.length - 1 ? radius : '0px');
    }
    const tokens = page.locator('#code-example .code-line > span[style*="--ps-code-light"]');
    expect(await tokens.count()).toBeGreaterThan(5);
    const colors = await tokens.evaluateAll(tokens => [...new Set(tokens.map(token => getComputedStyle(token).color))]);
    expect(colors.length).toBeGreaterThan(2);
    if (javaScriptEnabled) {
      await page.locator('.satellite.right').getByRole('button', { name: 'Dark', exact: true }).click();
      await expect(page.locator('#code-example .ps-code-block')).toHaveAttribute('data-code-mode', 'dark');
      expect(await tokens.evaluateAll(tokens => [...new Set(tokens.map(token => getComputedStyle(token).color))])).not.toEqual(colors);
    }
    await context.close();
  });
}

test('each section detail introduces its purpose directly below the page title', async ({ page }) => {
  for (const slug of sectionSlugs) {
    await page.goto(`/sections/${slug}/`);
    const introduction = page.locator('#page-heading .ps-heading > h1 + .introduction');
    await expect(introduction).toBeVisible();
    expect((await introduction.innerText()).length).toBeGreaterThan(60);
  }
});

for (const width of [320, 600, 840, 1200, 1400, 1600, 1700, 2300]) {
  test(`header search and GitHub link fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const github = page.getByRole('link', { name: 'Page Sections on GitHub', includeHidden: true });
    if (width < 600) await expect(github).toBeHidden();
    else await expect(github).toBeVisible();
    await expect(github).toHaveAttribute('href', 'https://github.com/LauridBergjohann/page-sections');
    const npm = page.getByRole('link', { name: 'Page Sections on NPM', includeHidden: true });
    if (width < 600) await expect(npm).toBeHidden();
    else await expect(npm).toBeVisible();
    await expect(npm).toHaveAttribute('href', 'https://www.npmjs.com/package/@page-sections/svelte');
    const header = await page.locator('.website-header .header').boundingBox();
    expect(header!.height).toBe(width < 1600 ? 66 : 64);
    const input = page.getByRole('combobox', { name: 'Search documentation' });
    if (width < 800 || (width >= 1200 && width < 1600)) {
      await page.getByRole('button', { name: 'Open search', exact: true }).click();
    } else await input.click();
    await expect(input).toBeFocused();
    await input.fill('card grid');
    await expect(page.getByRole('option').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await input.press('Escape');
    await expect(page.getByRole('listbox')).toHaveCount(0);
    if (width < 800 || (width >= 1200 && width < 1600)) await expect(page.getByRole('button', { name: 'Open search', exact: true })).toBeFocused();
    await page.keyboard.press('Control+k');
    await expect(input).toBeFocused();
    await input.fill('CodeBlock');
    await input.press('Enter');
    await expect(page).toHaveURL(/\/sections\/code\/$/);
    if (width >= 1200) {
      const brand = await page.getByRole('link', { name: 'Page Sections home', exact: true }).boundingBox();
      const showcase = await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Sections', exact: true }).boundingBox();
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

const sectionSlugs = ['card-grid', 'carousel', 'code', 'headings', 'hero', 'image', 'panel', 'rich-text', 'video'];
const sectionTitles = ['CardGrid', 'Carousel', 'Code', 'Heading', 'Hero', 'Image', 'Panel', 'RichText', 'Video'];

test('documentation teaches concepts in order and chapter landing pages explain their scope', async ({ page }) => {
  await page.goto('/docs/');
  for (const [slug, title, purpose] of [
    ['foundations', 'Foundations', 'A section groups related content'],
    ['page-layout', 'Page layout', 'The body contains the visible document'],
    ['design-system', 'Design system', 'A design system is a shared set'],
    ['components', 'Components', 'complete component catalog'],
    ['advanced', 'Advanced', 'These guides assume'],
    ['reference', 'Reference', 'A type describes the values']
  ]) {
    await page.goto(`/docs/${slug}/`);
    await expect(page.locator('main h1')).toHaveText(title);
    await expect(page.locator('main .prose p').first()).toBeVisible();
    await expect(page.locator('main .prose p').first()).toContainText(purpose);
    await expect(page.getByRole('navigation', { name: `Pages in ${title}`, exact: true })).toBeVisible();
    for (const width of [390, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.screenshot({ path: test.info().outputPath(`docs-${slug}-${width}.png`) });
    }
  }
  await page.goto('/docs/foundations/installation/');
  for (const heading of ['What are sections?', 'Using sections', 'Themes and styling', 'Page layout', 'Header and satellites']) {
    await page.locator('.reading-path [rel=next]').click();
    await expect(page.locator('main h1')).toHaveText(heading);
  }
  await page.goto('/docs/advanced/create-your-own-section/');
  await expect(page.locator('pre').first()).toContainText('SectionDefinition');
  await expect(page.locator('pre').nth(1)).toContainText('QuoteSection');
});

for (const javaScriptEnabled of [false, true]) {
  test(`object properties link to complete type fields with JavaScript ${javaScriptEnabled}`, async ({ browser }) => {
    const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, javaScriptEnabled });
    const page = await context.newPage();
    if (javaScriptEnabled) {
      await page.goto('/docs/');
      const search = page.getByRole('combobox', { name: 'Search documentation' });
      await page.getByRole('button', { name: 'Open search', exact: true }).click();
      await search.fill('ContentAction');
      await search.press('Enter');
      await expect(page).toHaveURL(/\/docs\/reference\/types\/#content-action$/);
    }
    await page.goto('/sections/hero/');
    await page.locator('#props-and-configuration').getByRole('link', { name: 'ContentAction', exact: true }).click();
    await expect(page).toHaveURL(/\/docs\/reference\/types\/#content-action$/);
    const action = page.locator('#content-action');
    await expect(action.getByRole('heading', { name: 'ContentAction', exact: true })).toBeVisible();
    await expect(action.locator('tbody tr > td:first-child')).toHaveText(['label', 'href', 'variant']);
    await expect(action.locator('tbody tr > td:nth-child(3)')).toHaveText(['Required', 'Required', 'Optional']);
    await action.screenshot({ path: test.info().outputPath(`content-action-${javaScriptEnabled}.png`) });
    await page.goto('/docs/reference/types/#hero-section-data');
    await page.locator('#hero-section-data table').getByRole('link', { name: 'ImageData', exact: true }).click();
    await expect(page).toHaveURL(/#image-data$/);
    await expect(page.locator('#image-data table')).toContainText('srcDark');
    await page.goto('/docs/reference/types/#section-definition');
    await page.locator('#section-definition table').getByRole('link', { name: 'SectionBackground', exact: true }).click();
    await expect(page).toHaveURL(/#section-background$/);
    await expect(page.locator('#section-background table')).toContainText('color');
    for (const width of [390, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    await context.close();
  });
}

test('previous documentation URLs retain permanent redirects to their new chapters', async ({ request }) => {
  for (const [oldPath, destination] of [
    ['foundation', 'foundations'],
    ['foundations/page-shell', 'page-layout/content-page'],
    ['building-blocks/navigation', 'page-layout/header'],
    ['building-blocks/breadcrumbs', 'page-layout/breadcrumbs'],
    ['building-blocks/footer', 'page-layout/footer'],
    ['building-blocks/card-and-image', 'components/card'],
    ['foundations/content-grid', 'components/grids'],
    ['foundations/responsive-layout', 'design-system/responsive-layout'],
    ['foundations/backgrounds', 'design-system/backgrounds']
  ]) {
    const response = await request.get(`/docs/${oldPath}/`, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(`content="0;url=/docs/${destination}/"`);
  }
});

test('sections have a complete illustrated catalog, examples and a dedicated sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto('/sections/');
  await expect(page.locator('.desktop-menu .ps-main-menu > li > a')).toHaveText(['Getting Started', 'Sections', 'Documentation', 'About']);
  const sidebar = page.getByRole('navigation', { name: 'Sections', exact: true });
  await expect(sidebar.getByRole('link')).toHaveText(sectionTitles);
  await expect(sidebar.locator('a svg')).toHaveCount(9);
  await expect(page.locator('#section-catalog .ps-card')).toHaveCount(9);
  for (const [index, slug] of sectionSlugs.entries()) {
    const card = page.locator('#section-catalog .ps-card').nth(index);
    await expect(card.locator('.primary-link')).toHaveAttribute('href', `/sections/${slug}/`);
    const image = card.locator('img');
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect(page.locator(`#${slug}-example`)).toBeAttached();
    await expect(page.locator(`#${slug} .detail-link a`)).toHaveAttribute('href', `/sections/${slug}/`);
  }
  await page.locator('#page-heading').scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath('sections-desktop.png') });
  for (const width of [320, 840, 1200]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: test.info().outputPath('sections-mobile.png') });
});

test('getting started links to the playground and offers four illustrated next steps', async ({ page }) => {
  await page.goto('/getting-started/');
  await expect(page.locator('#first-page').getByRole('link', { name: 'Svelte Playground' })).toHaveAttribute('href', 'https://svelte.dev/playground/f110f1e79b614ab7984adb25eef69c5b');
  const cards = page.locator('#next .ps-card');
  await expect(cards).toHaveCount(4);
  await expect(cards.locator('.title')).toHaveText(['Add Sections', 'Configure your page layout', 'Adapt the theme', 'Explore the minimal demo']);
  await page.locator('#next').scrollIntoViewIfNeeded();
  for (const image of await cards.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  await page.locator('#next').screenshot({ path: test.info().outputPath('getting-started-cards.png') });
});

for (const kind of ['hero', 'image', 'panel', 'rich-text', 'video']) {
  test(`${kind} starts with a working interactive example and copyable source`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/sections/${kind}/`);
    const demo = page.locator(`[data-section-playground="${kind}"]`);
    const preview = demo.locator('[data-live-preview]');
    await demo.getByRole('textbox', { name: 'Headline', exact: true }).fill('My own example');
    await expect(preview.getByRole('heading', { name: 'My own example', exact: true })).toBeVisible();
    if (kind === 'hero') {
      await demo.getByRole('combobox', { name: 'Composition', exact: true }).selectOption('overlay');
      await expect(preview.locator('.hero')).toHaveAttribute('data-composition', 'overlay');
      await demo.getByLabel('Show image', { exact: true }).uncheck();
      await expect(preview.locator('img')).toHaveCount(0);
    } else if (kind === 'image') {
      await demo.getByLabel('Image alternative text').fill('An accessible landscape');
      await expect(preview.locator('img')).toHaveAttribute('alt', 'An accessible landscape');
      await demo.getByRole('combobox', { name: 'Image fit', exact: true }).selectOption('contain');
      await expect(preview.locator('img')).toHaveCSS('object-fit', 'contain');
      await demo.getByLabel('Show description', { exact: true }).uncheck();
    } else if (kind === 'panel') {
      await demo.getByRole('combobox', { name: 'Block type', exact: true }).selectOption('list');
      await expect(preview.getByRole('listitem')).toHaveCount(3);
      await demo.getByLabel('Show action', { exact: true }).uncheck();
      await expect(preview.getByRole('link')).toHaveCount(0);
    } else if (kind === 'rich-text') {
      await demo.getByRole('combobox', { name: 'Content format', exact: true }).selectOption('text');
      await demo.getByRole('textbox', { name: 'Content', exact: true }).fill('**Plain text**');
      await expect(preview).toContainText('**Plain text**');
      await demo.getByRole('combobox', { name: 'Content format', exact: true }).selectOption('blocks');
      await demo.getByRole('combobox', { name: 'Block type', exact: true }).selectOption('address');
      await expect(preview.locator('address')).toContainText('Example Studio');
    } else {
      const video = preview.locator('video');
      await expect.poll(() => video.evaluate(video => video.readyState)).toBeGreaterThanOrEqual(1);
      expect(await video.evaluate(video => video.duration)).toBeGreaterThan(3);
      await video.evaluate(video => video.play());
      await expect.poll(() => video.evaluate(video => video.currentTime)).toBeGreaterThan(0);
      await video.evaluate(video => video.pause());
      await demo.getByLabel('Include captions', { exact: true }).uncheck();
      await expect(video.locator('track')).toHaveCount(0);
    }
    await demo.locator('summary').click();
    await expect(demo.locator('.source pre')).toContainText('My own example');
    await demo.getByRole('button', { name: 'Reset example', exact: true }).click();
    await expect(preview.getByRole('heading', { name: 'A new perspective', exact: true })).toBeVisible();
    await expect(page.locator('#anatomy img')).toHaveAttribute('src', `/illustrations/${kind}.svg`);
    for (const width of [320, 840, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    await page.locator('#playground').screenshot({ path: test.info().outputPath(`${kind}-demo.png`) });
    expect(errors).toEqual([]);
  });
}

test('old section routes provide static redirects to the new canonical pages', async ({ request, browser }) => {
  for (const [oldSlug, newSlug] of [['', ''], ...sectionSlugs.map(slug => [slug === 'image' ? 'images' : slug === 'panel' ? 'panels' : slug, slug])]) {
    const response = await request.get(`/docs/sections/${oldSlug ? oldSlug + '/' : ''}`, { maxRedirects: 0 });
    // adapter-static emits a meta refresh; Vercel applies permanent HTTP redirects at deployment.
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(`content="0;url=/sections/${newSlug ? newSlug + '/' : ''}"`);
  }
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: test.info().project.use.baseURL });
  const page = await context.newPage();
  await page.goto('/docs/sections/images/');
  await expect(page).toHaveURL(/\/sections\/image\/$/);
  await expect(page.locator('main h1')).toHaveText('Image');
  await context.close();
});

test('carousel details start with a configurable, scrollable collection', async ({ page }) => {
  await page.goto('/sections/carousel/');
  await page.getByRole('combobox', { name: 'Card size', exact: true }).selectOption('l');
  await page.getByRole('combobox', { name: 'Card tone', exact: true }).selectOption('muted');
  const cards = page.locator('[data-preview] .ps-card');
  await expect(cards.first()).toHaveAttribute('data-ps-card-size', 'l');
  await expect(cards.first()).toHaveAttribute('data-tone', 'muted');
  const track = page.locator('#collection-track');
  await expect(track).toHaveCSS('scroll-snap-type', 'x mandatory');
  await page.getByRole('button', { name: 'Next cards', exact: true }).click();
  await expect.poll(() => track.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  await expect(page.locator('#playground pre')).toContainText('CarouselSection');
  await expect(page.locator('#playground pre')).toContainText('cardSize="l"');
  await page.getByRole('button', { name: 'Reset example', exact: true }).click();
  await expect(cards.first()).toHaveAttribute('data-ps-card-size', 'm');
});

test('compact header keeps the brand and prioritizes search and settings', async ({page}) => {
  test.setTimeout(60000);
  await page.goto('/docs/design-system/responsive-layout/');
  const header = page.locator('.website-header .header');
  for (const width of [320, 390, 599, 600, 840, 1200, 1399, 1600, 1920]) {
    await page.setViewportSize({width, height: 900});
    const brand = header.getByRole('link', {name: 'Page Sections home'});
    await expect(brand.locator('span')).toBeVisible();
    await expect(brand.locator('img')).toBeVisible();
    const github = header.getByRole('link', {name: 'Page Sections on GitHub'});
    const npm = header.getByRole('link', {name: 'Page Sections on NPM'});
    if (width < 600) {
      await expect(github).toBeHidden(); await expect(npm).toBeHidden();
      await expect(header.getByRole('button', {name: 'Open search'})).toBeVisible();
      await expect(header.locator('.settings > summary')).toBeVisible();
    } else { await expect(github).toBeVisible(); await expect(npm).toBeVisible(); }
    expect((await header.boundingBox())!.height).toBe(width < 1600 ? 66 : 64);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const boxes = await header.locator('.brand, .tools, .settings, .mobile-navigation, .desktop-menu').evaluateAll(nodes => nodes.filter(node => node.getClientRects().length).map(node => node.getBoundingClientRect().toJSON()));
    for (const a of boxes) for (const b of boxes) if (a.x < b.x) expect(a.right).toBeLessThanOrEqual(b.x + 1);
    const trail = page.getByRole('navigation', {name: 'Breadcrumb', exact: true});
    const tops = await trail.locator('li').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top));
    expect(new Set(tops).size).toBe(1);
    if (width < 600) {
      const button = (await page.locator('.ps-content-menu-slot summary').boundingBox())!;
      const section = (await page.locator('.ps-page-content [data-ps-section]').first().boundingBox())!;
      expect(button.y - section.y).toBeCloseTo(12, 0);
      expect(section.x + section.width - button.x - button.width).toBeCloseTo(12, 0);
    }
    await expect(header).toHaveCSS('border-top-width', '0px');
    await expect(header).toHaveCSS('border-bottom-width', '0px');
    if (width >= 1600) await expect(page.locator('.satellite.right')).toHaveCSS('outline-style', 'none');
    if ([320, 390, 1200, 1920].includes(width)) await page.screenshot({path: test.info().outputPath(`navigation-${width}.png`)});
  }
  await page.locator('.satellite.right').getByRole('button', {name: 'Dark', exact: true}).click();
  await expect(header).toHaveCSS('border-width', '0px');
  await expect(page.locator('.satellite.right')).toHaveCSS('outline-style', 'none');
  await page.screenshot({path: test.info().outputPath('navigation-dark.png')});
});


test('content menu omits only its docked edge and transparent sections stay unframed', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto('/docs/foundations/installation/');
  const menu = page.locator('.ps-content-menu-slot .desktop');
  await expect(menu).toHaveCSS('border-left-width', '0px');
  await expect(menu).toHaveCSS('border-right-width', '1px');
  const surface = page.locator('#page-heading > .ps-section-surface');
  await expect(surface).toHaveCSS('border-right-width', '1px');
  await expect(surface).not.toHaveCSS('box-shadow', 'none');
  await expect(page.locator('.ps-content-menu-slot')).toHaveCSS('z-index', '0');
  const sectionBox = (await surface.boundingBox())!;
  const menuBox = (await menu.boundingBox())!;
  expect(Math.abs(sectionBox.x + sectionBox.width - menuBox.x)).toBeLessThan(0.1);
  const sidebar = page.locator('.sidebar-panel');
  await expect(sidebar).toHaveCSS('border-left-width', '1px');
  const sidebarBox = (await sidebar.boundingBox())!;
  for (const active of await sidebar.locator('a.active').all()) {
    const activeBox = (await active.boundingBox())!;
    expect(activeBox.x).toBeGreaterThanOrEqual(sidebarBox.x + 1);
    expect(activeBox.x + activeBox.width).toBeLessThanOrEqual(sidebarBox.x + sidebarBox.width - 1);
  }
  expect(await menu.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return el.contains(document.elementFromPoint(rect.left + 0.5, rect.top + 24));
  })).toBe(true);
  for (const width of [390, 1000]) {
    await page.setViewportSize({ width, height: 900 });
    const surface = page.locator('#page-heading > .ps-section-surface');
    await expect(surface).toHaveCSS('border-left-width', '0px');
    await expect(surface).toHaveCSS('border-right-width', '0px');
  }
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto('/docs/design-system/backgrounds/');
  await expect(menu).toHaveCSS('border-left-width', '1px');
  for (const surface of await page.locator('.ps-section:is([data-background-color="transparent"], [data-background-size="full"]) > .ps-section-surface').all()) {
    await expect(surface).toHaveCSS('border-left-width', '0px');
    await expect(surface).toHaveCSS('border-top-width', '0px');
  }
});


test('shared shadow controls inherit locally and complete role overrides take precedence', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.goto('/docs/foundations/installation/');
  const header = page.locator('.website-header .header');
  const surface = page.locator('#page-heading > .ps-section-surface');
  await expect(header).toHaveCSS('box-shadow', /0px 4px 8px 0px/);
  await expect(surface).toHaveCSS('box-shadow', /0px 3px 8px 0px/);
  await page.locator('.ps-shell').evaluate(el => {
    (el as HTMLElement).style.setProperty('--ps-shadow-color', '#ff0000');
    (el as HTMLElement).style.setProperty('--ps-shadow-size', '2');
    (el as HTMLElement).style.setProperty('--ps-shadow-intensity', '2');
  });
  await expect(header).toHaveCSS('box-shadow', /0px 8px 16px 0px/);
  await expect(header).toHaveCSS('box-shadow', /color\(srgb 1 0 0 \/ 0.24\)/);
  await expect(surface).toHaveCSS('box-shadow', /0px 6px 16px 0px/);
  await expect(surface).toHaveCSS('clip-path', /-24px/);
  await header.locator('.settings > summary').click();
  const popup = page.locator('.settings-panel:popover-open');
  await expect(popup).toHaveCSS('box-shadow', await header.evaluate(el => getComputedStyle(el).boxShadow));
  await popup.evaluate(el => (el as HTMLElement).style.setProperty('--ps-shadow-color', '#00ff00'));
  await expect(popup).toHaveCSS('box-shadow', /color\(srgb 0 1 0 \/ 0.24\)/);
  await page.locator('.ps-shell').evaluate(el => {
    (el as HTMLElement).style.setProperty('--ps-navigation-shadow', '1px 2px 3px blue');
    (el as HTMLElement).style.setProperty('--ps-popup-shadow', 'none');
    (el as HTMLElement).style.setProperty('--ps-shadow-intensity', '0');
  });
  await expect(header).toHaveCSS('box-shadow', 'rgb(0, 0, 255) 1px 2px 3px 0px');
  await expect(popup).toHaveCSS('box-shadow', 'none');
  await expect(surface).toHaveCSS('box-shadow', /\/ 0\)/);
});

test('card hover shadows follow shared controls and their own override', async ({ page }) => {
  await page.goto('/sections/card-grid/');
  await page.getByRole('checkbox', { name: 'Card shadow', exact: true }).check();
  const card = page.locator('.playground .ps-card').first();
  await page.locator('.ps-shell').evaluate(el => {
    (el as HTMLElement).style.setProperty('--ps-shadow-size', '2');
    (el as HTMLElement).style.setProperty('--ps-shadow-intensity', '0.5');
  });
  await card.hover();
  await expect(card.locator('.surface')).toHaveCSS('box-shadow', /0px 16px 40px 0px/);
  await expect(card.locator('.surface')).toHaveCSS('box-shadow', /0.1\)/);
  await page.locator('.ps-shell').evaluate(el => (el as HTMLElement).style.setProperty('--ps-card-hover-shadow', 'none'));
  await expect(card.locator('.surface')).toHaveCSS('box-shadow', 'none');
});
