import { expect, test } from '@playwright/test';

test('top-level icons precede labels at every layout size and open parents stay highlighted', async ({page}) => {
  await page.goto('/');
  for (const width of [390, 700, 1000, 1280, 1700, 1920, 2560]) {
    await page.setViewportSize({width, height: 900});
    const mobile = width < 1200;
    if (mobile) await page.locator('.website-header .mobile-menu > summary').click();
    const menu = page.locator(mobile ? '.website-header .mobile-panel' : '.website-header .desktop-menu');
    for (const [name, icon] of [['Getting Started','rocket'],['Sections','layout-template'],['Documentation','book-text'],['About','info']]) {
      const link = menu.getByRole('link',{name,exact:true});
      await expect(link).toBeVisible();
      await expect(link.locator(`svg.lucide-${icon}`)).toBeVisible();
      expect(await link.evaluate(el => el.firstElementChild?.classList.contains('icon'))).toBe(true);
    }
    if (mobile) await page.keyboard.press('Escape');
  }
  const parent = page.locator('.desktop-menu [data-menu-id="sections"]');
  await parent.hover();
  const color = await parent.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(color).not.toBe('rgba(0, 0, 0, 0)');
  await page.locator('.desktop-menu .ps-submenu:not([hidden]) a').first().hover();
  await expect(parent).toHaveAttribute('aria-expanded','true');
  await expect(parent).toHaveCSS('background-color',color);
  await page.keyboard.press('Escape');
  await expect(parent).toHaveAttribute('aria-expanded','false');
  await expect(parent).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
});

test('page layout examples use independent viewports and real component controls', async ({page}) => {
  test.setTimeout(60000); // Exercise five isolated pages and their responsive controls.
  await page.setViewportSize({width:1920,height:1080});
  for (const kind of ['header','breadcrumbs','content-page','headings-and-anchors','footer']) {
    await page.goto(`/docs/page-layout/${kind}/`);
    await expect(page.getByRole('figure',{name:'Page anatomy'})).toBeVisible();
    const preview = page.frameLocator('iframe');
    await expect(preview.getByRole('heading',{name:'Planting',exact:true})).toBeVisible();
    await page.getByLabel('Preview viewport').selectOption('1920');
    await expect(page.locator('iframe')).toHaveCSS('width','1920px');
    await expect(preview.getByRole('banner')).toHaveCount(1);
    await expect(preview.getByRole('main')).toHaveCount(1);
    const toggle = page.locator('#live-example input[type="checkbox"]');
    if (kind === 'header') {
      await expect(preview.locator('.satellite.left')).toBeVisible();
      await toggle.uncheck();
      await expect(preview.locator('.satellite.left')).toHaveCount(0);
    } else if (kind === 'breadcrumbs') {
      await expect(preview.getByRole('navigation',{name:'Breadcrumb',exact:true})).toBeVisible();
      await toggle.uncheck();
      await expect(preview.getByRole('navigation',{name:'Breadcrumb',exact:true})).toHaveCount(0);
    } else if (kind === 'content-page') {
      await expect(preview.locator('.ps-content-menu-slot')).toBeVisible();
      await toggle.uncheck();
      await expect(preview.locator('.ps-content-menu-slot')).toHaveCount(0);
    } else if (kind === 'headings-and-anchors') {
      await expect(preview.locator('h3')).toHaveText('Choose a spot');
      await toggle.uncheck();
      await expect(preview.locator('h3')).toHaveCount(0);
    } else {
      await expect(preview.locator('.ps-footer-group')).toHaveCount(2);
      await toggle.uncheck();
      await expect(preview.locator('.ps-footer-group')).toHaveCount(0);
    }
    await page.getByLabel('Preview viewport').selectOption('390');
    await expect(preview.locator('.mobile-menu > summary')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('Card and Image playgrounds update their rendered component and source', async ({page}) => {
  await page.goto('/docs/building-blocks/card/');
  await page.getByLabel('Card title').fill('A new story');
  await page.getByRole('combobox',{name:'Variant',exact:true}).selectOption('editorial');
  await expect(page.locator('.component-preview .ps-card')).toHaveAttribute('data-card-variant','editorial');
  await expect(page.locator('.component-preview .description')).toBeVisible();
  await expect(page.locator('.component-preview .title')).toHaveText('A new story');
  await expect(page.locator('#playground pre')).toContainText('A new story');
  await page.getByRole('button',{name:'Reset',exact:true}).click();
  await expect(page.getByLabel('Card title')).toHaveValue('Notes from the coast');
  await page.goto('/docs/building-blocks/image/');
  await page.getByLabel('Image aspect').selectOption('square');
  await page.getByLabel('Image fit').selectOption('cover');
  await page.getByLabel('Preview color mode').selectOption('dark');
  const img = page.locator('.component-preview img');
  await expect(img).toHaveCSS('object-fit','cover');
  await expect.poll(()=>img.evaluate((el:HTMLImageElement)=>el.currentSrc)).toContain('hero-dark.webp');
  await expect(page.locator('#playground pre')).toContainText('"aspect": "square"');
  await page.getByRole('button',{name:'Reset',exact:true}).click();
  await expect(page.getByLabel('Image aspect')).toHaveValue('16/9');
});

test('background playground paints full viewport and explains gradient fallback', async ({page}) => {
  await page.setViewportSize({width:1920,height:1080});
  await page.goto('/docs/design-system/backgrounds/');
  const section = page.locator('#surface-first');
  const paint = section.locator(':scope > .ps-section-surface');
  await expect(section).toHaveAttribute('data-background-size','full');
  await expect(paint).toHaveCSS('background-image',/linear-gradient/);
  const box=(await paint.boundingBox())!;
  expect(box.x).toBeLessThanOrEqual(0);
  expect(box.x+box.width).toBeGreaterThanOrEqual(1920);
  await page.getByRole('combobox',{name:'Background size',exact:true}).selectOption('standard');
  await expect(section).toHaveAttribute('data-background-color','standard');
  await expect(page.locator('#surface-controls [role="status"]')).toContainText('Gradients require full size');
  await expect(paint).toHaveCSS('background-image','none');
  expect((await paint.boundingBox())!.width).toBeLessThan(1920);
  await page.getByRole('combobox',{name:'Background size',exact:true}).selectOption('full');
  for (const color of ['transparentToStandard','standardToMuted','mutedToTransparent']) {
    await page.getByRole('combobox',{name:'Background',exact:true}).selectOption(color);
    await expect(paint).toHaveCSS('background-image',/linear-gradient/);
    await expect(page.locator('#surface-source pre')).toContainText(color);
  }
  for (const width of [390,1280,2560]) {
    await page.setViewportSize({width,height:900});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('visual guides and ready-made catalog remain useful without JavaScript', async ({browser, baseURL}) => {
  const context = await browser.newContext({javaScriptEnabled:false,baseURL});
  const page=await context.newPage();
  await page.goto('/docs/design-system/responsive-layout/');
  await expect(page.getByRole('figure',{name:'Seven viewport sizes from phone to ultrawide'})).toContainText('Ultrawide');
  await expect(page.locator('#every-screen svg')).toHaveCount(7);
  await page.goto('/docs/building-blocks/section/');
  await expect(page.locator('#section-catalog .ps-card')).toHaveCount(9);
  await page.goto('/docs/page-layout/header/');
  await expect(page.getByRole('figure',{name:'Page anatomy'})).toBeVisible();
  await expect(page.getByLabel('Preview viewport')).toBeDisabled();
  await expect(page.frameLocator('iframe').getByRole('heading',{name:'Planting',exact:true})).toBeVisible();
  await context.close();
});
