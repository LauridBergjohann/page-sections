import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/timeline/');
  await expect(page.locator('.ps-timeline')).toHaveAttribute('data-enhanced', 'true');
});

test('filters release columns, close active details and recover from all off', async ({ page }) => {
  const timeline = page.locator('.ps-timeline');
  const chartTop = await timeline.locator('.chart').evaluate(el => el.getBoundingClientRect().top + scrollY);
  const headerHeight = await timeline.locator('.timeline-header').evaluate(el => el.getBoundingClientRect().height);
  await timeline.locator('[data-event="bachelor"] .label').click();
  await expect(timeline.locator('details[open]')).toHaveCount(1);
  await timeline.getByRole('button', { name: 'Education' }).click();
  await expect(timeline.locator('details[open]')).toHaveCount(0);
  await expect(timeline.getByRole('group', { name: 'Education', exact: true })).toHaveCount(0);
  await expect(timeline.getByRole('button', { name: 'Education' })).toHaveAttribute('aria-pressed', 'false');
  expect(await timeline.locator('.chart').evaluate(el => el.getBoundingClientRect().top + scrollY)).toBeCloseTo(chartTop, 0);
  expect(await timeline.locator('.timeline-header').evaluate(el => el.getBoundingClientRect().height)).toBe(headerHeight);
  await timeline.getByRole('button', { name: 'Work', exact: true }).click();
  await timeline.getByRole('button', { name: 'Hobby', exact: true }).click();
  await expect(timeline.getByRole('status')).toContainText('No events');
  await timeline.getByRole('button', { name: 'Education' }).click();
  await expect(timeline.locator('[data-event="bachelor"]')).toBeVisible();
});

test('locally anchors one popup, switches, toggles, and restores keyboard focus', async ({ page }) => {
  const timeline = page.locator('.ps-timeline');
  const bachelor = timeline.locator('[data-event="bachelor"]');
  await bachelor.locator('.label').click();
  await expect(bachelor.locator('.ps-popup')).toHaveAttribute('popover', 'manual');
  await expect(bachelor.locator('img')).toBeVisible();
  const label = await bachelor.locator('.label').boundingBox();
  const popup = await bachelor.locator('.ps-popup').boundingBox();
  expect(popup!.x).toBeGreaterThanOrEqual(label!.x + label!.width);
  await bachelor.locator('summary').focus();
  await page.keyboard.press('Escape');
  await expect(bachelor).not.toHaveAttribute('open', '');
  await expect(bachelor.locator('summary')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(bachelor).toHaveAttribute('open', '');
  await bachelor.locator('.label').click();
  await expect(bachelor).not.toHaveAttribute('open', '');
  await bachelor.locator('.label').click();
  const student = timeline.locator('[data-event="student"]');
  await student.locator('.label').click();
  await expect(timeline.locator('details[open]')).toHaveCount(1);
  await expect(student).toHaveAttribute('open', '');
  await page.getByRole('heading', { name: 'My Journey', exact: true }).click();
  await expect(timeline.locator('details[open]')).toHaveCount(0);
});

test('natural page flow, sticky headers, scroll dismissal, optional links and dark media', async ({ page }) => {
  const timeline = page.locator('.ps-timeline');
  const header = timeline.locator('.timeline-header');
  await page.evaluate(() => window.scrollBy(0, 350));
  await expect.poll(async () => (await header.boundingBox())!.y).toBeCloseTo(0, 0);
  expect(await timeline.evaluate(el => getComputedStyle(el).overflowY)).toBe('visible');
  expect(await timeline.evaluate(el => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(1);
  const cloud = timeline.locator('[data-event="cloud"]');
  await cloud.locator('.label').click();
  await expect(cloud.getByRole('link', { name: 'View certificate' })).toHaveAttribute('href', 'https://example.com/certificate');
  await expect(cloud.getByRole('list', { name: 'Tags' })).toBeVisible();
  await page.evaluate(() => window.scrollBy(0, -60));
  await expect(timeline.locator('details[open]')).toHaveCount(0);
  await page.setViewportSize({ width: 1920, height: 1100 });
  await page.getByRole('button', { name: 'Dark', exact: true }).first().click();
  const bachelor = timeline.locator('[data-event="bachelor"]');
  await bachelor.locator('.label').click();
  await expect(bachelor.locator('source')).toHaveAttribute('media', 'all');
});

test('mobile keeps shared scale and confines popups; no hydration errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (/hydration/i.test(message.text())) errors.push(message.text()); });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const timeline = page.locator('.ps-timeline');
  await expect(timeline).toHaveAttribute('data-enhanced', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  expect(await timeline.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
  await expect(timeline.locator('.label:visible')).toHaveCount(0);
  const student = timeline.locator('[data-event="student"]');
  await student.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(student).toHaveAttribute('open', '');
  const rect = await student.locator('.ps-popup').boundingBox();
  expect(rect!.x).toBeGreaterThanOrEqual(11);
  expect(rect!.x + rect!.width).toBeLessThanOrEqual(379);
  expect(rect!.y).toBeGreaterThanOrEqual(11);
  expect(rect!.y + rect!.height).toBeLessThanOrEqual(833);
  expect(errors).toEqual([]);
  await student.getByRole('button', { name: 'Close details' }).click();
  await expect(student.locator('summary')).toBeFocused();
  await page.screenshot({ path: test.info().outputPath('timeline-mobile.png') });
});

test('reuses the server date even when the browser clock differs and respects reduced motion', async ({ page }) => {
  const warnings: string[] = [];
  page.on('console', message => { if (/hydration/i.test(message.text())) warnings.push(message.text()); });
  await page.clock.setFixedTime(new Date('2040-06-01T12:00:00Z'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/timeline-clock/');
  const timeline = page.locator('.ps-timeline');
  await expect(timeline).toHaveAttribute('data-enhanced', 'true');
  expect(await timeline.getAttribute('data-reference-date')).not.toBe('2040-06-01');
  const bachelor = timeline.locator('[data-event="bachelor"]');
  await bachelor.locator('.label').click();
  await expect(bachelor.locator('.ps-popup')).toHaveAttribute('popover', 'manual');
  expect(await bachelor.locator('.ps-popup').evaluate(el => el.getAnimations().length)).toBe(0);
  expect(warnings).toEqual([]);
});

test('a long bar opens beside the clicked point, and labels never overlap', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1100 });
  const timeline = page.locator('.ps-timeline');
  const labels = await timeline.locator('.label').evaluateAll(elements => elements.map(el => {
    const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
  }));
  for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
    const a = labels[i], b = labels[j];
    expect(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top).toBe(true);
  }
  const bachelor = timeline.locator('[data-event="bachelor"]');
  await bachelor.locator('.marker').click({ position: { x: 10, y: 160 } });
  await expect(bachelor.locator('.ps-popup')).toHaveAttribute('popover', 'manual');
  const marker = await bachelor.locator('.marker').boundingBox();
  const popup = await bachelor.locator('.ps-popup').boundingBox();
  expect(Math.abs(popup!.y - (marker!.y + 160))).toBeLessThan(2);
  await page.keyboard.press('Escape');
  await page.screenshot({ path: test.info().outputPath('timeline-desktop.png') });
});

test('without JavaScript native disclosures expose image, description and actions', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/timeline/');
  const timeline = page.locator('.ps-timeline');
  await expect(timeline.getByRole('button')).toHaveCount(0);
  const bachelor = timeline.locator('[data-event="bachelor"]');
  await bachelor.locator('summary').click();
  await expect(bachelor.locator('img')).toBeVisible();
  await expect(bachelor).toContainText('Northbridge Institute');
  const cloud = timeline.locator('[data-event="cloud"]');
  await cloud.locator('summary').click();
  await expect(cloud.getByRole('link', { name: 'View certificate' })).toBeVisible();
  await context.close();
});

test('touch controls and enlarged text remain usable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/timeline/');
  const timeline = page.locator('.ps-timeline');
  await expect(timeline).toHaveAttribute('data-enhanced', 'true');
  const bachelor = timeline.locator('[data-event="bachelor"]');
  await bachelor.locator('.marker').tap({ position: { x: 8, y: 30 } });
  await expect(bachelor.getByRole('button', { name: 'Close details' })).toBeVisible();
  await bachelor.getByRole('button', { name: 'Close details' }).tap();
  await expect(bachelor).not.toHaveAttribute('open', '');
  await page.addStyleTag({ content: 'html { font-size: 24px !important; }' });
  await expect.poll(() => timeline.locator('.label').evaluateAll(elements => {
    const rects = elements.map(el => el.getBoundingClientRect());
    return rects.every((a, i) => rects.slice(i + 1).every(b => a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top));
  })).toBe(true);
  await context.close();
});

test('many categories fit the page and a long timeline extends the document', async ({ page }) => {
  await page.goto('/timeline-dense/');
  const timeline = page.locator('.ps-timeline');
  await expect(timeline).toHaveAttribute('data-enhanced', 'true');
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect(timeline.locator('.label:visible')).toHaveCount(0);
    expect(await timeline.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
    expect((await timeline.boundingBox())!.height).toBeGreaterThan(6000);
    await expect(timeline.locator('summary')).toHaveCount(48);
  }
  const last = timeline.getByRole('group', { name: 'Category 12', exact: true }).locator('summary').last();
  await last.focus();
  await page.keyboard.press('Enter');
  await expect(timeline.locator('details[open] .ps-popup-title')).toHaveText('Event 12.4');
});

test('reverses the date axis, keeps icons and lays out newest-first labels without collisions', async ({ page }) => {
  const timeline = page.locator('.ps-timeline');
  await page.getByRole('button', { name: 'Newest first', exact: true }).click();
  await expect(timeline.locator('.axis span').first()).toHaveText('2026');
  await expect(timeline.locator('.axis span').last()).toHaveText('2014');
  await expect(timeline.getByRole('group', { name: 'Education', exact: true }).locator('details').first()).toHaveAttribute('data-event', 'systems');
  await expect(timeline.locator('[data-event="systems"] .event-icon svg')).toBeVisible();
  await expect.poll(() => timeline.locator('.label:visible').evaluateAll(elements => {
    const rects = elements.map(el => el.getBoundingClientRect());
    return rects.every((a, i) => rects.slice(i + 1).every(b => a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top));
  })).toBe(true);
  await timeline.locator('[data-event="systems"] summary').focus();
  await page.keyboard.press('Enter');
  await expect(timeline.locator('[data-event="systems"] .ps-popup-title')).toHaveText('Systems Certification');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-ps-popup-backdrop]')).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath('timeline-descending.png'), fullPage: true });
});

test('marker and label share hover, keyboard and open states without overlapping halos', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const timeline = page.locator('.ps-timeline');
  for (const id of ['student', 'cloud']) {
    const event = timeline.locator('[data-event="' + id + '"]');
    const marker = event.locator('.marker'), label = event.locator('.label');
    await page.mouse.move(0, 0);
    const original = await marker.evaluate(el => getComputedStyle(el).backgroundColor);
    await marker.hover({ position: { x: 10, y: 5 } });
    await expect(marker).not.toHaveCSS('background-color', original);
    const highlighted = await marker.evaluate(el => getComputedStyle(el).backgroundColor);
    await label.hover();
    await expect(marker).toHaveCSS('background-color', highlighted);
    await label.click();
    await page.mouse.move(0, 0);
    await expect(marker).toHaveCSS('background-color', highlighted);
    await page.keyboard.press('Escape');
    await expect(event.locator('summary')).toBeFocused();
    await expect(marker).toHaveCSS('background-color', highlighted);
    await event.locator('summary').blur();
    await expect(marker).toHaveCSS('background-color', original);
  }
  const markers = timeline.getByRole('group', { name: 'Work', exact: true }).locator('.marker');
  const student = timeline.locator('[data-event="student"] .marker');
  const engineer = timeline.locator('[data-event="engineer"] .marker');
  const first = await student.boundingBox(), second = await engineer.boundingBox();
  expect(first!.y + first!.height).toBeCloseTo(second!.y, 1);
  await expect(markers.first()).toHaveCSS('box-shadow', 'none');
  await expect(timeline.locator('.marker-halo')).toHaveCount(0);
});


test('uses the section surface, connects rails to buttons and retains restore labels', async ({ page }) => {
  const timeline = page.locator('.ps-timeline');
  await expect(page.locator('#journey')).toHaveAttribute('data-background-color', 'standard');
  for (const selector of ['.timeline-header', '.axis', '.chart']) {
    await expect(timeline.locator(selector)).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  }
  const button = timeline.getByRole('button', { name: 'Education', exact: true });
  const rail = timeline.getByRole('group', { name: 'Education', exact: true }).locator('.rail');
  const buttonRect = await button.boundingBox(), railRect = await rail.boundingBox();
  expect(railRect!.y).toBeCloseTo(buttonRect!.y + buttonRect!.height, 0);
  for (const name of ['Education', 'Work']) {
    const toggle = timeline.getByRole('button', { name, exact: true });
    await toggle.click();
    await expect(toggle.locator('.ps-chip-label')).toBeVisible();
    expect(await toggle.locator('.ps-chip-label').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await expect(toggle).toHaveCSS('font-weight', '400');
    const icon = await toggle.locator('.ps-chip-icon').boundingBox();
    const label = await toggle.locator('.ps-chip-label').boundingBox();
    const bounds = await toggle.boundingBox();
    expect(icon!.x - bounds!.x).toBeGreaterThanOrEqual(12);
    expect(label!.x - (icon!.x + icon!.width)).toBeCloseTo(8, 0);
    expect(bounds!.height).toBe(44);
  }
  await page.evaluate(() => window.scrollBy(0, 500));
  await expect.poll(async () => (await timeline.locator('.timeline-header').boundingBox())!.y).toBeCloseTo(0, 0);
  expect((await timeline.locator('.axis-caption').boundingBox())!.y).toBeLessThan(0);
  await page.screenshot({ path: test.info().outputPath('timeline-transparent-sticky.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const name of ['Education', 'Work']) {
    await expect(timeline.getByRole('button', { name, exact: true }).locator('.ps-chip-label')).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});


test('rails align with category icons and chips dock flush with square upper corners', async ({ page }) => {
  const timeline = page.locator('.ps-timeline');
  const header = timeline.locator('.timeline-header');
  const work = timeline.getByRole('button', { name: 'Work', exact: true });
  await expect(header).not.toHaveAttribute('data-docked');
  await expect(work).toHaveCSS('border-top-left-radius', '999px');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const name of ['Education', 'Work', 'Hobby']) {
      const category = timeline.getByRole('group', { name, exact: true });
      const icon = timeline.getByRole('button', { name, exact: true }).locator('.ps-chip-icon');
      await expect(icon).toBeVisible();
      await expect.poll(async () => {
        const a = (await icon.boundingBox())!, b = (await category.locator('.rail').boundingBox())!;
        return Math.abs(a.x + a.width / 2 - b.x - b.width / 2);
      }).toBeLessThan(.6);
      const rail = (await category.locator('.rail').boundingBox())!;
      const marker = (await category.locator('details').filter({ has: page.locator('.marker') }).first().locator('.marker').boundingBox())!;
      // The first chronological event starts in the first interval lane.
      expect(marker.x + marker.width / 2).toBeCloseTo(rail.x + rail.width / 2, 0);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await work.click();
  await page.evaluate(() => scrollTo(0, 500));
  await expect(header).toHaveAttribute('data-docked', '');
  for (const chip of await header.locator('.ps-chip').all()) {
    expect((await chip.boundingBox())!.y).toBeCloseTo(0, 1);
    await expect(chip).toHaveCSS('border-top-left-radius', '0px');
    await expect(chip).toHaveCSS('border-top-right-radius', '0px');
    await expect(chip).toHaveCSS('border-bottom-left-radius', '22px');
  }
  await timeline.evaluate(el => (el as HTMLElement).style.setProperty('--ps-timeline-sticky-offset', '32px'));
  await page.evaluate(() => scrollBy(0, 10));
  await expect.poll(async () => (await work.boundingBox())!.y).toBeCloseTo(32, 1);
  await page.evaluate(() => scrollTo(0, 0));
  await expect(header).not.toHaveAttribute('data-docked');
  await expect(work).toHaveCSS('border-top-left-radius', '999px');
});
