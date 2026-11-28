import { expect, test, type Locator, type Page } from '@playwright/test';

function addStyle(page: Page, content: string) {
  // Do not wait for a load handler: page-authored handlers are disabled in no-JS contexts.
  return page.evaluateHandle(css => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
    return style;
  }, content);
}

async function material(panel: Locator, alpha: number, blur: number) {
  const actual = await panel.evaluate(node => {
    const style = getComputedStyle(node);
    // Resolve CSS Color 4 output through canvas instead of asserting serialization.
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = style.backgroundColor;
    ctx.fillRect(0, 0, 1, 1);
    return { alpha: ctx.getImageData(0, 0, 1, 1).data[3] / 255,
      blur: style.backdropFilter, opacity: style.opacity };
  });
  expect(actual.alpha).toBeCloseTo(alpha, 2);
  expect(actual.blur === 'none' ? 'blur(0px)' : actual.blur).toBe(`blur(${blur}px)`);
  expect(actual.opacity).toBe('1');
}

for (const javaScriptEnabled of [true, false]) test(`panel materials inherit and override locally, JS=${javaScriptEnabled}`, async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled, viewport: { width: 1920, height: 1000 } });
  const page = await context.newPage();
  await page.goto('/header-scroll/');
  const header = page.locator('.header');
  const panels = page.locator('.header, .satellite, .sidebar-panel, .ps-content-menu-slot .desktop');
  for (const panel of await panels.all()) await material(panel, 1, 0);
  const before = await header.boundingBox();
  const custom = await addStyle(page, '.ps-shell { --ps-panel-tint-opacity: .65; --ps-panel-backdrop-blur: 8px; }');
  for (const panel of await panels.all()) await material(panel, .65, 8);
  expect(await header.boundingBox()).toEqual(before);
  await expect(page.locator('.header a').first()).toHaveCSS('opacity', '1');
  await expect(page.locator('.ps-section-surface').first()).toHaveCSS('backdrop-filter', 'none');
  // The shared tokens also apply to a native disclosure before hydration.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.settings > summary').click();
  const popup = page.locator('.settings-panel');
  await expect(popup).toBeVisible();
  if (javaScriptEnabled) await popup.evaluate(node => Promise.allSettled(node.getAnimations().map(animation => animation.finished)));
  await material(popup, .65, 8);
  const local = await addStyle(page, '.settings-panel { --ps-panel-tint-opacity: 0; --ps-panel-backdrop-blur: 0px; }');
  await material(popup, 0, 0);
  await material(header, .65, 8);
  await local.evaluate(node => node.remove());
  await addStyle(page, '.settings-panel { --ps-panel-tint-opacity: 2; --ps-panel-backdrop-blur: -4px; }');
  await material(popup, 1, 0);
  await custom.evaluate(node => node.remove());
  await material(header, 1, 0);
  await context.close();
});
