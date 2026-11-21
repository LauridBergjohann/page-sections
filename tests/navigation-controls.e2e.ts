import { expect, test, type Locator } from '@playwright/test';

async function aligned(track: Locator, selected: string) {
  await expect.poll(() => track.evaluate((node, selector) => {
    const target = node.querySelector(selector)!.getBoundingClientRect();
    const root = node.getBoundingClientRect();
    const style = getComputedStyle(node, '::before');
    const matrix = new DOMMatrixReadOnly(style.transform);
    return Math.max(Math.abs(root.x + matrix.m41 - target.x), Math.abs(root.y + matrix.m42 - target.y),
      Math.abs(parseFloat(style.width) - target.width), Math.abs(parseFloat(style.height) - target.height));
  }, selected)).toBeLessThan(1);
}

test('ButtonGroup slides between outer and square middle corners and animates color', async ({ page }) => {
  await page.goto('/navigation-controls/');
  const group = page.getByRole('group', { name: 'Choose an option' });
  await expect(group).toHaveAttribute('data-ps-selection-animated', '');
  const radius = await group.evaluate(node => getComputedStyle(node).borderTopLeftRadius);
  const samples = await group.evaluate(async node => {
    const target = node.querySelectorAll('button')[2];
    target.click();
    const frames: { x: number; color: string }[] = [];
    const start = performance.now();
    while (performance.now() - start < 400) {
      await new Promise(requestAnimationFrame);
      frames.push({x: new DOMMatrixReadOnly(getComputedStyle(node, '::before').transform).m41,
        color: getComputedStyle(target).color});
    }
    return frames;
  });
  expect(new Set(samples.map(frame => frame.x.toFixed(1))).size).toBeGreaterThan(3);
  expect(new Set(samples.map(frame => frame.color)).size).toBeGreaterThan(3);
  await aligned(group, '[aria-pressed="true"]');
  await expect(group.getByRole('button', {name: 'Last', exact: true})).toHaveCSS('border-top-left-radius', '0px');
  await expect(group.getByRole('button', {name: 'Last', exact: true})).toHaveCSS('border-top-right-radius', radius);
  await group.getByRole('button', {name: 'Middle option'}).click();
  await aligned(group, '[aria-pressed="true"]');
  await expect(group.getByRole('button', {name: 'Middle option'})).toHaveCSS('border-radius', '0px');
  await page.getByLabel('Longer labels').check();
  await aligned(group, '[aria-pressed="true"]');
  await page.getByLabel('Direction').selectOption('rtl');
  await group.getByRole('button', {name: 'The first, longer option'}).click();
  await aligned(group, '[aria-pressed="true"]');
  await expect(group.getByRole('button', {name: 'The first, longer option'})).toHaveCSS('border-top-right-radius', radius);
  await expect(group.getByRole('button', {name: 'The first, longer option'})).toHaveCSS('border-top-left-radius', '0px');
  await page.setViewportSize({width: 390, height: 844});
  await aligned(group, '[aria-pressed="true"]');
  await expect(page.getByRole('button', {name: 'Unavailable'})).toBeDisabled();
  await page.getByRole('group', {name: 'Native links'}).getByRole('link', {name: 'Components'}).click();
  await expect(page).toHaveURL(/\/components\/$/);
});

test('main-menu highlight and accent line travel together on real route changes', async ({ page }) => {
  await page.setViewportSize({width: 1920, height: 1000});
  await page.goto('/components/');
  const menu = page.locator('.desktop-menu .ps-main-menu');
  await expect(menu).toHaveAttribute('data-ps-selection-animated', '');
  const frames = await menu.evaluate(async node => {
    (node.querySelector('[data-menu-id="backgrounds"]') as HTMLAnchorElement).click();
    const result: {x: number; width: number; line: number}[] = [];
    const start = performance.now();
    while (performance.now() - start < 1200) {
      await new Promise(requestAnimationFrame);
      const background = getComputedStyle(node, '::before');
      const line = getComputedStyle(node, '::after');
      result.push({x: new DOMMatrixReadOnly(background.transform).m41, width: parseFloat(background.width),
        line: new DOMMatrixReadOnly(line.transform).m41});
    }
    return result;
  });
  await expect(page).toHaveURL(/\/backgrounds\/$/);
  expect(new Set(frames.map(frame => frame.x.toFixed(1))).size).toBeGreaterThan(3);
  for (const frame of frames) expect(Math.abs(frame.line - frame.x - (frame.width - 40) / 2)).toBeLessThan(1);
  await aligned(menu, ':scope > li > a.active');
  await page.setViewportSize({width: 1200, height: 900});
  await aligned(menu, ':scope > li > a.active');
});

test('reduced motion keeps selected controls immediate', async ({ page }) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.setViewportSize({width: 1920, height: 1000});
  await page.goto('/navigation-controls/');
  const group = page.getByRole('group', {name: 'Choose an option'});
  await group.getByRole('button', {name: 'Last', exact: true}).click();
  await aligned(group, '[aria-pressed="true"]');
  expect(await group.evaluate(node => getComputedStyle(node, '::before').transitionDuration)).toBe('0s');
  await expect(group.getByRole('button', {name: 'Last', exact: true})).toHaveCSS('transition-duration', '0s');
  await page.goto('/components/');
  const menu = page.locator('.desktop-menu .ps-main-menu');
  await aligned(menu, ':scope > li > a.active');
  expect(await menu.evaluate(node => getComputedStyle(node, '::before').transitionDuration)).toBe('0s');
  expect(await menu.evaluate(node => getComputedStyle(node, '::after').transitionDuration)).toBe('0s');
});

test('breadcrumbs and selections remain usable without JavaScript', async ({browser, baseURL}) => {
  const context = await browser.newContext({baseURL, javaScriptEnabled: false, viewport: {width: 320, height: 844}});
  const page = await context.newPage();
  await page.goto('/navigation-controls/');
  const trail = page.getByRole('navigation', {name: 'Breadcrumb', exact: true});
  const rects = await trail.locator('li').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top));
  expect(new Set(rects).size).toBe(1);
  await expect(trail.locator('[aria-current="page"]')).toHaveCSS('text-overflow', 'ellipsis');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  const group = page.getByRole('group', {name: 'Native links'});
  await expect(group.getByRole('link', {name: 'Current', exact: true})).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await group.getByRole('link', {name: 'Components'}).click();
  await expect(page).toHaveURL(/\/components\/$/);
  await context.close();
});
