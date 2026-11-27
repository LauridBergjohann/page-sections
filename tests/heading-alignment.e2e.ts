import { expect, test } from '@playwright/test';

for (const javaScriptEnabled of [false, true]) {
  test(`section headings align without changing content or heroes, JavaScript ${javaScriptEnabled}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled });
    const page = await context.newPage();
    for (const width of [390, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/heading-alignment/');
      for (const align of ['default', 'left', 'center', 'right']) {
        const expected = align === 'default' ? 'left' : align;
        for (const prefix of ['section', 'features']) {
          const heading = page.locator(`#${prefix}-${align} > .ps-section-content > .section-heading .ps-heading`);
          await expect(heading).toHaveCSS('text-align', expected);
          await expect(heading.locator('.introduction')).toHaveCSS('text-align', expected);
          const box = (await heading.boundingBox())!;
          const intro = (await heading.locator('.introduction').boundingBox())!;
          const offset = expected === 'left' ? intro.x - box.x : expected === 'right'
            ? intro.x + intro.width - box.x - box.width
            : intro.x + intro.width / 2 - box.x - box.width / 2;
          expect(Math.abs(offset)).toBeLessThan(1);
          if (width === 1920) expect(intro.width).toBeLessThan(box.width);
        }
        await expect(page.locator(`#section-${align} .eyebrow`)).toHaveCSS('text-align', expected);
        await expect(page.locator(`#section-${align} .body-copy`)).toHaveCSS('text-align', 'start');
        await expect(page.locator(`#nested-${align} .ps-heading`)).toHaveCSS('text-align', 'left');
        await expect(page.locator(`#hero-${align} .ps-heading`)).toHaveCSS('text-align', 'left');
        await expect(page.locator(`#panel-${align} .ps-heading`)).toHaveCSS('text-align', expected);
        await expect(page.locator(`#panel-${align} .ps-prose > p`)).toHaveCSS('text-align', 'start');
        await expect(page.locator(`#panel-${align}`).getByRole('heading', { name: 'Nested panel', exact: true })).toHaveJSProperty('tagName', 'H3');
        await expect(page.locator(`#features-${align} .ps-feature`)).toHaveCSS('text-align', 'center');
      }
    }
    await context.close();
  });
}
