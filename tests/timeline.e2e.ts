import { expect, test, type Page } from '@playwright/test';

const timeline = (page: Page) => page.locator('.ps-timeline').first();
const publicationCluster = (page: Page) => timeline(page).locator('.cluster[data-category="publications"]').filter({ hasText: '7' }).first();
async function ready(page: Page, path = '/timeline/') {
  await page.goto(path);
  await expect(timeline(page)).toHaveAttribute('data-enhanced', 'true');
  await expect.poll(() => timeline(page).locator('.timeline-frame').evaluate(el => el.clientWidth)).toBeGreaterThan(100);
}
async function openCluster(page: Page) {
  const cluster = publicationCluster(page);
  await cluster.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  return cluster;
}

test('filters retain domain, scale and viewpoint, and recover from all off', async ({ page }) => {
  await ready(page);
  const root = timeline(page), frame = root.locator('.timeline-frame');
  await frame.evaluate(el => el.scrollLeft = 200);
  await expect.poll(() => frame.evaluate(el => el.scrollLeft)).toBe(200);
  const before = await frame.evaluate(el => ({ width: el.scrollWidth, scroll: el.scrollLeft }));
  const scale = await root.getAttribute('data-scale');
  for (const button of await root.locator('.legend button').all()) await button.click();
  await expect(root.locator('.empty')).toContainText('Select at least one category');
  expect(await frame.evaluate(el => ({ width: el.scrollWidth, scroll: el.scrollLeft }))).toEqual(before);
  expect(await root.getAttribute('data-scale')).toBe(scale);
  await root.getByRole('button', { name: 'Programme & operations', exact: true }).click();
  await expect(root.locator('[data-event="mh-programme-open-access"]')).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('timeline-filter.png') });
});

test('cluster-window-interaction: list to detail to list preserves scroll, focus and one active layer', async ({ page }) => {
  await ready(page);
  const cluster = await openCluster(page);
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('.cluster-row')).toHaveCount(7);
  await expect(dialog.locator('.cluster-row .row-date').first()).toContainText('17 Oct 2024');
  await expect(page.locator('[data-ps-popup-backdrop]')).toHaveCount(1);
  const list = dialog.locator('.cluster-list');
  await list.evaluate(el => el.scrollTop = 100);
  const position = await list.evaluate(el => el.scrollTop);
  await expect(dialog).toBeVisible();
  const row = dialog.locator('.cluster-row').nth(4);
  const key = await row.getAttribute('data-key');
  await row.scrollIntoViewIfNeeded();
  const afterClickPosition = await list.evaluate(el => el.scrollTop);
  await row.click();
  await expect(dialog.getByRole('button', { name: 'Back to events' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => (document.activeElement as HTMLElement)?.dataset.key)).toBe(key);
  expect(await list.evaluate(el => el.scrollTop)).toBe(afterClickPosition);
  await page.keyboard.press('Tab');
  expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.screenshot({ path: test.info().outputPath('timeline-cluster-list.png') });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(cluster).toBeFocused();
  expect(position).toBeGreaterThanOrEqual(0);
});

test('morph changes shape and position without scaling readable text; reduced motion skips it', async ({ page }) => {
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    (window as any).__morphFrames = [];
    Element.prototype.animate = function(frames, options) {
      if (this.hasAttribute('data-ps-popup-morph')) (window as any).__morphFrames.push(...(frames as Keyframe[]));
      return original.call(this, frames, options);
    };
  });
  await ready(page);
  await openCluster(page);
  const animations = await page.evaluate(() => (window as any).__morphFrames.map((f: Keyframe) => ({ width: f.width, radius: f.borderRadius })));
  expect(animations.some(frame => frame.radius === '50%')).toBe(true);
  await page.keyboard.press('Escape');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openCluster(page);
  expect(await page.getByRole('dialog').evaluate(el => el.getAnimations().length)).toBe(0);
});

test('a removed cluster closes its dialog and focuses a surviving control', async ({ page }) => {
  await ready(page); await openCluster(page);
  await page.evaluate(() => window.dispatchEvent(new Event('remove-publications')));
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(timeline(page).getByRole('slider')).toBeFocused();
});

test('long bar labels stay inside the visible segment, pan keeps tracks stable and closes details', async ({ page }) => {
  await ready(page);
  const root = timeline(page), frame = root.locator('.timeline-frame');
  const bar = root.locator('[data-event="mh-programme-open-access"]');
  const snapshot = () => root.locator('[data-lane]').evaluateAll(nodes => nodes.map(el => [el.getAttribute('data-event') ?? el.getAttribute('data-cluster'), el.getAttribute('data-lane')]));
  const before = await snapshot();
  const height = await root.locator('.chart').evaluate(el => el.clientHeight);
  await frame.evaluate(el => el.scrollLeft = 500);
  await expect.poll(() => bar.locator('.bar-label').evaluate(el => parseFloat((el as HTMLElement).style.left))).toBeGreaterThan(100);
  const b = (await bar.boundingBox())!, f = (await frame.boundingBox())!, label = (await bar.locator('.bar-label').boundingBox())!;
  expect(label.x).toBeGreaterThanOrEqual(Math.max(b.x, f.x));
  expect(label.x + label.width).toBeLessThanOrEqual(Math.min(b.x + b.width, f.x + f.width));
  expect(await snapshot()).toEqual(before);
  expect(await root.locator('.chart').evaluate(el => el.clientHeight)).toBe(height);
  await page.screenshot({ path: test.info().outputPath('timeline-scrolled-bar.png') });
  await bar.click({ position: { x: 520, y: 16 } });
  await expect(page.getByRole('dialog')).toBeVisible();
  await frame.evaluate(el => el.scrollLeft += 50);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const x = await bar.evaluate(el => parseFloat((el as HTMLElement).style.left) + parseFloat((el as HTMLElement).style.width) - 10);
  await frame.evaluate((el, x) => el.scrollLeft = x, x);
  await expect.poll(() => bar.locator('.event-icon').count()).toBe(0);
});

test('zoom anchors the center, resize preserves scale and axis position only mirrors tracks', async ({ page }) => {
  await ready(page);
  await page.setViewportSize({ width: 1440, height: 1100 });
  const root = timeline(page), frame = root.locator('.timeline-frame');
  await frame.evaluate(el => el.scrollLeft = 1800);
  const before = await frame.evaluate(el => ({ center: el.scrollLeft + el.clientWidth / 2 - 28, width: el.clientWidth }));
  const scale = Number(await root.getAttribute('data-scale'));
  await root.getByRole('slider').fill('50');
  const afterScale = Number(await root.getAttribute('data-scale'));
  await expect.poll(() => frame.evaluate(el => el.scrollLeft + el.clientWidth / 2 - 28)).toBeCloseTo(before.center / scale * afterScale, 0);
  await page.setViewportSize({ width: 2560, height: 1100 });
  await expect(root).toHaveAttribute('data-scale', String(afterScale));
  await expect.poll(() => frame.evaluate(el => el.clientWidth)).toBeGreaterThan(1536);
  const entries = () => root.locator('[data-lane]').evaluateAll(nodes => nodes.map(el => [el.getAttribute('data-event') ?? el.getAttribute('data-cluster'), (el as HTMLElement).style.left, el.getAttribute('data-lane')]));
  const old = await entries();
  await page.getByRole('button', { name: 'Axis above', exact: true }).click();
  expect(await entries()).toEqual(old);
  await expect(root).toHaveAttribute('data-axis', 'top');
  const axis = (await root.locator('.axis').boundingBox())!, legend = (await root.locator('.legend').boundingBox())!;
  expect(legend.y).toBeGreaterThan(axis.y);
  await root.getByRole('button', { name: 'Fit entire timeline' }).click();
  await expect(root).toHaveAttribute('data-fit', 'true');
  await expect.poll(() => frame.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
});

for (const width of [320, 390, 768, 1440, 1536, 2560, 3440]) for (const colorScheme of ['light', 'dark'] as const) {
  test(`responsive-stage-and-long-labels: ${width}px ${colorScheme}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (/hydration/i.test(message.text())) errors.push(message.text()); });
    await ready(page);
    await page.locator('.ps-shell').evaluate((node, theme) => node.setAttribute('data-ps-theme', theme), colorScheme);
    const root = timeline(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    expect(await root.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
    const heading = page.locator('#morgenhafen-timeline > .ps-section-content');
    expect((await heading.boundingBox())!.width).toBeLessThanOrEqual(1600);
    if (width > 2000) expect((await root.boundingBox())!.width).toBeGreaterThan(1536);
    await openCluster(page);
    const rect = (await page.getByRole('dialog').boundingBox())!;
    expect(rect.x).toBeGreaterThanOrEqual(11);
    expect(rect.x + rect.width).toBeLessThanOrEqual(width - 11);
    expect(rect.y).toBeGreaterThanOrEqual(11);
    expect(rect.y + rect.height).toBeLessThanOrEqual(989);
    await page.keyboard.press('Escape');
    expect(errors).toEqual([]);
    await page.screenshot({ path: test.info().outputPath(`timeline-${width}-${colorScheme}.png`) });
  });
}

test('truncated labels expose focus tooltips and retain full detail titles', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await ready(page);
  const bar = timeline(page).locator('[data-event="mh-programme-open-access"]');
  await bar.focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(bar).toBeFocused();
});

test('no JavaScript retains all events, rich details, media and internal actions', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage(); await page.goto('/timeline/');
  const root = timeline(page);
  await expect(root.locator('details')).toHaveCount(56);
  await expect(root.getByRole('button')).toHaveCount(0);
  const hall = root.locator('[data-event="mh-programme-hall-opening"]');
  await hall.locator('summary').click(); await expect(hall.locator('img')).toBeVisible();
  const platform = root.locator('[data-event="mh-projects-data-platform"]');
  await platform.locator('summary').click();
  await expect(platform.getByRole('link', { name: 'Back to the timeline' })).toHaveAttribute('href', '#morgenhafen-timeline');
  await expect(platform.locator('.tags')).toBeVisible();
  await context.close();
});

test('touch opens details without hover and shared SSR clock survives a different browser day', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.clock.setFixedTime(new Date('2040-06-01T12:00:00Z'));
  await ready(page, '/timeline-clock/');
  expect(await timeline(page).getAttribute('data-reference-date')).not.toBe('2040-06-01');
  const bar = timeline(page).locator('[data-event="mh-programme-open-access"]');
  await bar.tap({ position: { x: 100, y: 16 } });
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close details', exact: true }).tap();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await context.close();
});

test('long parallel bars stay individual and the page scrolls vertically', async ({ page }) => {
  await ready(page, '/timeline-dense/');
  await expect(timeline(page).locator('[data-event]')).toHaveCount(48);
  await expect(timeline(page).locator('.cluster')).toHaveCount(0);
  const height = await timeline(page).locator('.chart').evaluate(el => el.clientHeight);
  expect(height).toBeGreaterThan(2000);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
});

test('custom icons and multiple instances retain independent state, IDs and action links', async ({ page }) => {
  await page.goto('/timeline-instances/');
  const first = page.locator('#first-timeline'), second = page.locator('#second-timeline');
  await expect(first.locator('.ps-timeline')).toHaveAttribute('data-enhanced', 'true');
  await expect(second.locator('.ps-timeline')).toHaveAttribute('data-enhanced', 'true');
  expect(await first.locator('.ps-timeline').getAttribute('id')).not.toBe(await second.locator('.ps-timeline').getAttribute('id'));
  await expect(first.locator('[data-custom-icon]').first()).toBeVisible();
  for (const instance of [first, second]) {
    const bar = instance.locator('[data-event="mh-projects-data-platform"]');
    await bar.focus(); await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('img')).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'Back to the timeline' })).toHaveAttribute('href', '#' + await instance.getAttribute('id'));
    await expect(dialog.locator('.tags')).toBeVisible();
    await page.keyboard.press('Escape');
  }
  await first.getByRole('button', { name: 'Programme & operations', exact: true }).click();
  await expect(second.getByRole('button', { name: 'Programme & operations', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('dark detail media uses its alternate image', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1100 });
  await ready(page);
  await page.getByRole('button', { name: 'Dark', exact: true }).first().click();
  const hall = timeline(page).locator('[data-event="mh-programme-hall-opening"]');
  await hall.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog').locator('source')).toHaveAttribute('media', 'all');
  await expect(page.getByRole('dialog').locator('img')).toHaveAttribute('alt', /.+/);
  await page.keyboard.press('Escape');
});

test('an open detail updates when its source event changes without changing identity', async ({ page }) => {
  await ready(page);
  const bar = timeline(page).locator('[data-event="mh-projects-data-platform"]');
  await bar.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('rename-platform')));
  await expect(page.getByRole('dialog').locator('.ps-popup-title')).toHaveText('Updated platform details');
  await page.keyboard.press('Escape'); await expect(bar).toBeFocused();
});

test('a horizontal touch pan does not select its starting event', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage(); await ready(page);
  const root = timeline(page), frame = root.locator('.timeline-frame');
  await frame.scrollIntoViewIfNeeded();
  const bar = root.locator('[data-event="mh-programme-open-access"]');
  await bar.scrollIntoViewIfNeeded();
  const rect = (await bar.boundingBox())!;
  const before = await frame.evaluate(el => el.scrollLeft);
  const session = await context.newCDPSession(page);
  const y = Math.min(800, Math.max(20, rect.y + 16));
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 230, y }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 180, y }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 100, y }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => frame.evaluate(el => el.scrollLeft)).toBeGreaterThan(before);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await context.close();
});
