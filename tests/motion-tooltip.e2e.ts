import { expect, test } from '@playwright/test';

test('tooltips preserve descriptions, support keyboard and hover, and clean up', async ({ page }) => {
  await page.goto('/navigation-controls/');
  await expect(page.getByRole('group', { name: 'Choose an option' })).toHaveAttribute('data-ps-selection-ready', '');
  const trigger = page.getByRole('button', { name: 'Tooltip example', exact: true });
  await trigger.focus();
  const tip = page.getByRole('tooltip');
  await expect(tip).toHaveText('Helpful context without a browser title');
  await expect(trigger).toHaveAttribute('aria-describedby', /existing-description ps-tooltip-/);
  await expect(trigger).not.toHaveAttribute('title');
  await page.keyboard.press('Escape');
  await expect(tip).toHaveCount(0);
  await expect(trigger).toHaveAttribute('aria-describedby', 'existing-description');
  await trigger.blur();
  await trigger.hover();
  await expect(tip).toBeVisible();
  await tip.hover();
  await expect(tip).toBeVisible();
  await page.mouse.move(1, 1);
  await expect(tip).toHaveCount(0);
  await page.setViewportSize({ width: 320, height: 400 });
  await trigger.focus();
  await expect(tip).toBeVisible();
  const bounds = await tip.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(8);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(312);
  await page.evaluate(() => scrollBy(0, scrollY > 0 ? -50 : 50));
  await expect(tip).toHaveCount(0);
});

test('popup animation keeps placement, exits inertly and survives rapid reopening', async ({ page }) => {
  await page.goto('/navigation-controls/');
  await expect(page.getByRole('group', { name: 'Choose an option' })).toHaveAttribute('data-ps-selection-ready', '');
  const trigger = page.getByRole('button', { name: 'Motion example' });
  const panel = page.locator('#motion-popup');
  await trigger.click();
  await expect(panel).toBeVisible();
  await panel.evaluate(node => Promise.all(node.getAnimations().map(animation => animation.finished)));
  const before = await panel.boundingBox();
  expect(await panel.evaluate(node => getComputedStyle(node).transformOrigin)).not.toBe('50% 50%');
  const exit = await trigger.evaluate(node => {
    (node as HTMLElement).click();
    return new Promise<boolean>(resolve => requestAnimationFrame(() => {
      const panel = document.querySelector<HTMLElement>('#motion-popup')!;
      resolve(panel.inert && panel.getAnimations().length > 0);
    }));
  });
  expect(exit).toBe(true);
  await trigger.evaluate(node => (node as HTMLElement).click());
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toHaveJSProperty('inert', false);
  await panel.evaluate(node => Promise.all(node.getAnimations().map(animation => animation.finished)));
  expect(await panel.boundingBox()).toEqual(before);
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(page.locator('[data-ps-popup-backdrop]')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('reduced motion skips popup and tooltip animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/navigation-controls/');
  await expect(page.getByRole('group', { name: 'Choose an option' })).toHaveAttribute('data-ps-selection-ready', '');
  await page.getByRole('button', { name: 'Motion example' }).click();
  const panel = page.locator('#motion-popup');
  await expect(panel).toBeVisible();
  expect(await panel.evaluate(node => node.getAnimations().length)).toBe(0);
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await page.getByRole('button', { name: 'Tooltip example', exact: true }).focus();
  await expect(page.getByRole('tooltip')).toHaveCSS('animation-name', 'none');
});
