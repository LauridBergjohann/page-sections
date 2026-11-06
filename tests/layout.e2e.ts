import { expect, test } from '@playwright/test';
import { resolveCardLayout, resolveMenuOffset } from '../packages/core/src/index.js';

for (const width of [320, 600, 720, 840, 1200, 1536, 1600, 1920]) {
  test(`catalog cards agree with core measurements at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/examples/cards/');
    for (const size of ['s', 'm', 'l'] as const) {
      const section = page.locator(`#catalog-${size}`);
      const box = (await section.boundingBox())!;
      const expected = resolveCardLayout(box.width, size);
      const card = section.locator('.ps-card').first();
      const measured = (await card.boundingBox())!;
      expect(measured.width).toBeCloseTo(expected.width, 1);
      expect(measured.height).toBeCloseTo(expected.height, 1);
      expect((await card.locator('[data-ps-card-part="copy"]').boundingBox())!.height).toBeCloseTo(expected.textHeight, 1);
      const media = (await card.locator('[data-ps-card-part="media"]').boundingBox())!;
      expect(media.width).toBeCloseTo(expected.media.width, 1);
      expect(media.height).toBeCloseTo(expected.media.height, 1);
      await expect(card.locator('[data-ps-card-part="title"]')).toHaveCSS('font-size', `${expected.titleSize}px`);
      await expect(card.locator('[data-ps-card-part="eyebrow"]')).toHaveCount(size === 's' ? 0 : 1);
      await expect(card).toHaveAttribute('href', '#catalog-m');
    }
    const nested = page.locator('#nested-cards');
    const expected = resolveCardLayout((await nested.boundingBox())!.width, 'm');
    expect((await nested.locator('.ps-card').first().boundingBox())!.width).toBeCloseTo(expected.width, 1);
    const carousel = page.locator('#catalog-carousel');
    const slide = (await carousel.locator('.ps-card').first().boundingBox())!;
    expect(slide.width).toBeCloseTo(resolveCardLayout((await carousel.boundingBox())!.width, 'm').width, 1);
    expect(slide.height).toBeCloseTo(slide.width, 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.screenshot({ path: `.artifacts/catalog-${width}.png`, fullPage: true });
  });
}

for (const width of [320, 840, 1920]) {
  for (const javaScriptEnabled of [false, true]) {
    test(`data-only website pages at ${width}px, JS=${javaScriptEnabled}`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled, viewport: { width, height: 1000 } });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('/examples/');
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('#profile h3')).toHaveText('At a glance');
      for (const text of await page.locator('[data-card-variant="editorial"] .text').all()) {
        expect(await text.evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
      }
      await expect(page.getByRole('link', { name: 'Get in touch' })).toBeVisible();
      if (width === 1920) {
        const heights = await page.locator('#projects .ps-card').evaluateAll(cards => cards.map(card => card.getBoundingClientRect().height));
        expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.screenshot({ path: `.artifacts/portfolio-${width}-js-${javaScriptEnabled}.png`, fullPage: true });
      await page.getByRole('link', { name: 'Legal example' }).click();
      await expect(page).toHaveURL(/\/examples\/legal\/$/);
      await expect(page.locator('address')).toContainText('Example Studio');
      await expect(page.getByRole('link', { name: 'hello@example.com', exact: true })).toHaveAttribute('href', 'mailto:hello@example.com');
      expect((await page.locator('.sections').boundingBox())!.width).toBeLessThanOrEqual(780);
      await expect(page.getByRole('heading', { level: 3, name: 'Document note' })).toBeVisible();
      if (javaScriptEnabled) {
        await page.evaluate(() => window.scrollTo(0, 0));
        if (width < 1600) await page.locator('.settings > summary').click();
        await page.getByRole('button', { name: 'Dark', exact: true }).click();
        await page.keyboard.press('Escape');
        await expect(page.locator('[data-ps-theme]')).toHaveAttribute('data-ps-theme', 'dark');
      }
      await page.screenshot({ path: `.artifacts/legal-${width}-js-${javaScriptEnabled}.png`, fullPage: true });
      expect(errors).toEqual([]);
      await context.close();
    });
  }
}

test('native navigation follows delayed scrolling and closes mobile menus on navigation', async ({ page }) => {
  await page.setViewportSize({ width: 840, height: 900 });
  await page.goto('/examples/cards/');
  const header = page.locator('.ps-navigation .header');
  for (const y of [0, 80, 112, 160]) {
    await page.evaluate(y => window.scrollTo(0, y), y);
    await expect.poll(async () => (await header.boundingBox())!.y).toBe(resolveMenuOffset(y));
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  const menu = page.locator('.mobile-menu');
  await menu.locator('summary').click();
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open');
  await expect(menu.locator('summary')).toBeFocused();
  await menu.locator('summary').click();
  await menu.getByRole('link', { name: 'Components', exact: true }).click();
  await expect(page).toHaveURL(/\/components\/$/);
  await expect(menu).not.toHaveAttribute('open');
});

test('surface corners follow viewport size', async ({ page }) => {
  await page.goto('/backgrounds/');
  for (const width of [840, 1599, 1600, 2300]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator('#group-first > .ps-section-surface')).toHaveCSS('border-top-left-radius', width < 1600 ? '0px' : '18px');
  }
});

test('card adapters attach once per occurrence and clean up removed elements', async ({ page }) => {
  await page.goto('/examples/integration/');
  await expect(page.getByTestId('attached')).toHaveText('3');
  await expect(page.getByTestId('diagnostics')).toHaveText('1');
  await expect(page.getByTestId('selected')).toHaveText('occurrence-2');
  const cards = page.locator('#adapter-cards .ps-card');
  await expect(cards.first()).toHaveAttribute('data-adapter', 'occurrence-0');
  await expect(cards.locator('[data-custom-media]')).toHaveCount(3);
  await expect(cards.locator('[data-custom-surface]')).toHaveCount(3);
  await page.getByRole('button', { name: 'Reverse items' }).click();
  await expect(cards.first()).toHaveAttribute('data-adapter', 'occurrence-2');
  await expect(page.getByTestId('attached')).toHaveText('3');
  await expect(page.getByTestId('detached')).toHaveText('0');
  await page.getByRole('button', { name: 'Remove item' }).click();
  await expect(cards).toHaveCount(2);
  await expect(page.getByTestId('detached')).toHaveText('1');
  await page.getByRole('button', { name: 'Next cards' }).click();
  await expect(page.getByTestId('selected')).not.toHaveText('occurrence-2');
  for (const width of [1920, 2300]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(page.locator('#detail-context')).toHaveAttribute('data-background-size', 'standard');
    await expect(page.locator('#detail-context > .ps-section-surface')).toHaveCSS('border-top-left-radius', width < 2300 ? '18px' : '0px');
  }
});

test('desktop submenus open without changing the header height', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto('/examples/integration/');
  const nav = page.getByRole('navigation', { name: 'Nested menu example' });
  await nav.locator('.desktop-menu summary').click();
  await expect(nav.getByRole('link', { name: 'Legal example' })).toBeVisible();
  expect((await nav.locator('.header').boundingBox())!.height).toBe(64);
  await page.keyboard.press('Escape');
  await expect(nav.locator('.desktop-menu details')).not.toHaveAttribute('open');
  await nav.locator('.desktop-menu summary').click();
  await page.getByRole('heading', { name: 'Integration contracts', exact: true }).click();
  await expect(nav.locator('.desktop-menu details')).not.toHaveAttribute('open');
});
