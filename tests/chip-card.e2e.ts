import { expect, test } from '@playwright/test';

test('chip retains padded icon/label geometry and native keyboard selection', async ({ page }) => {
  await page.goto('/chip-card/');
  const chip = page.getByRole('button', { name: 'Work', exact: true });
  const geometry = () => chip.evaluate(el => {
    const root = el.getBoundingClientRect(), icon = el.querySelector('.ps-chip-icon')!.getBoundingClientRect(), label = el.querySelector('.ps-chip-label')!.getBoundingClientRect();
    return { height: root.height, inset: icon.left - root.left, gap: label.left - icon.right, labelTop: label.top, iconTop: icon.top };
  });
  await expect(chip).toHaveAttribute('aria-pressed', 'false');
  const before = await geometry();
  expect(before.height).toBe(44); expect(before.inset).toBe(13); expect(before.gap).toBe(8);
  await chip.focus(); await page.keyboard.press('Space');
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  expect(await geometry()).toEqual(before);
  await page.keyboard.press('Enter');
  await expect(chip).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
});

test('card hover expands only images, keeping surface and text geometry stable', async ({ page }) => {
  await page.goto('/chip-card/');
  for (const fit of ['contain', 'cover']) {
    const card = page.locator('.ps-card[data-media-fit="' + fit + '"]');
    await page.mouse.move(0, 0);
    const copy = await card.locator('.text').boundingBox();
    const title = await card.locator('.title').boundingBox();
    const frame = await card.locator('.media-frame').boundingBox();
    const surface = await card.locator('.surface').boundingBox();
    const image = await card.locator('img').boundingBox();
    if (fit === 'contain') {
      const media = (await card.locator('.media').boundingBox())!;
      const padding = await card.locator('.text').evaluate(el => parseFloat(getComputedStyle(el).paddingLeft));
      expect(media.x - frame!.x).toBeCloseTo(padding, 1);
    }
    await card.hover();
    await expect(card.locator('.surface')).toHaveCSS('top', '0px');
    await expect(card.locator('.media-viewport')).toHaveCSS('top', '0px');
    if (fit === 'contain') await expect(card.locator('.media')).toHaveCSS('top', '0px');
    else await expect(card.locator('.media')).toHaveCSS('transform', 'matrix(1.06, 0, 0, 1.06, 0, 0)');
    await expect(card).toHaveCSS('transform', 'none');
    expect(await card.locator('.text').boundingBox()).toEqual(copy);
    expect(await card.locator('.title').boundingBox()).toEqual(title);
    expect(await card.locator('.media-frame').boundingBox()).toEqual(frame);
    expect(await card.locator('.surface').boundingBox()).toEqual(surface);
    expect((await card.locator('img').boundingBox())!.width).toBeGreaterThan(image!.width);
    await expect(card.locator('.media-viewport')).toHaveCSS('overflow', 'hidden');
    expect(await card.evaluate(el => {
      const outline = getComputedStyle(el, '::after');
      return { border: outline.borderTopColor, width: outline.borderTopWidth, layer: outline.zIndex, pointerEvents: outline.pointerEvents };
    })).toEqual({ border: await card.locator('.surface').evaluate(el => getComputedStyle(el).borderTopColor), width: '1px', layer: '3', pointerEvents: 'none' });
    await expect(card.locator('img')).toHaveCSS('object-fit', fit);
    expect(frame!.y + frame!.height).toBeLessThanOrEqual(copy!.y);
    if (fit === 'contain') expect((await card.locator('.media').boundingBox())!.width).toBeCloseTo(frame!.width, 1);
  }
});

test('reduced motion keeps image and surface sizes unchanged', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/chip-card/');
  for (const card of await page.locator('.ps-card').all()) {
    const media = await card.locator('.media').boundingBox();
    const surface = await card.locator('.surface').boundingBox();
    await card.hover();
    expect(await card.locator('.media').boundingBox()).toEqual(media);
    expect(await card.locator('.surface').boundingBox()).toEqual(surface);
    await expect(card.locator('.media')).toHaveCSS('transition-duration', '0s');
  }
});

test('oversized custom media is clipped before and during hover without hiding the card outline', async ({ page }) => {
  await page.goto('/chip-card/');
  const card = page.locator('.ps-card[data-media-fit="contain"]');
  await card.locator('.media').evaluate(el => {
    const probe = document.createElement('div');
    probe.id = 'oversized-media';
    probe.style.cssText = 'position:absolute;inset:-80px;background:red;pointer-events:auto;z-index:10';
    el.replaceChildren(probe);
  });
  for (const hover of [false, true]) {
    if (hover) await card.hover();
    const frame = (await card.locator('.media-frame').boundingBox())!;
    for (const [x, y] of [[frame.x - 4, frame.y + frame.height / 2], [frame.x + frame.width + 4, frame.y + frame.height / 2], [frame.x + frame.width / 2, frame.y - 4], [frame.x + frame.width / 2, frame.y + frame.height + 4]]) {
      expect(await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.id, { x, y })).not.toBe('oversized-media');
    }
    await expect(card.locator('.media-viewport')).toHaveCSS('overflow', 'hidden');
    await expect(card.locator('.media-viewport')).toHaveCSS('isolation', 'isolate');
  }
});
