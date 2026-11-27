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
      await link.hover();
      await expect(link).toHaveCSS('text-decoration-line','none');
    }
    if (mobile) await page.keyboard.press('Escape');
  }
  const parent = page.locator('.desktop-menu [data-menu-id="sections"]');
  await parent.hover();
  await expect(parent).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await parent.evaluate(node => Promise.all(node.getAnimations().map(animation => animation.finished)));
  const color = await parent.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(color).not.toBe('rgba(0, 0, 0, 0)');
  await page.locator('.desktop-menu .ps-submenu:not([hidden]) a').first().hover();
  await expect(page.locator('.desktop-menu .ps-submenu:not([hidden]) a').first()).toHaveCSS('text-decoration-line','none');
  await expect(parent).toHaveAttribute('aria-expanded','true');
  await expect(parent).toHaveCSS('background-color',color);
  await page.keyboard.press('Escape');
  await expect(parent).toHaveAttribute('aria-expanded','false');
  await expect(parent).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
});

test('header package links and footer social links open separate tabs', async ({page}) => {
  await page.goto('/');
  const links = page.locator('.website-header .github-link, .ps-footer-social a');
  expect(await links.count()).toBeGreaterThan(2);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target','_blank');
    await expect(link).toHaveAttribute('rel','noopener noreferrer');
  }
});

test('cards animate optional shadows and restore their original border on mouse leave', async ({page}) => {
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/sections/card-grid/');
  const card = page.locator('[data-preview] .ps-card').first();
  const surface = card.locator('.surface');
  const toggle = page.getByRole('checkbox',{name:'Card shadow',exact:true});
  const border = await surface.evaluate(el=>getComputedStyle(el).borderColor);
  const accent = await card.locator('.eyebrow').evaluate(el=>getComputedStyle(el).color);
  await expect(surface).toHaveCSS('box-shadow','none');
  await expect(surface).toHaveCSS('transition-duration','0.28s, 0.28s');
  await card.hover();
  await expect(surface).toHaveCSS('border-color',accent);
  await expect(surface).not.toHaveCSS('box-shadow','none');
  const light = await surface.evaluate(el=>getComputedStyle(el).boxShadow);
  await page.mouse.move(0,0);
  await expect(surface).toHaveCSS('border-color',border);
  await expect(surface).toHaveCSS('box-shadow','none');
  await toggle.check();
  await expect(surface).toHaveCSS('box-shadow',light);
  await card.hover();
  // color-mix may serialize as color(srgb ...) instead of rgba(...).
  await expect(surface).toHaveCSS('box-shadow', /(?:rgba\(0, 0, 0, 0\.2\)|color\(srgb 0 0 0 \/ 0\.2\)) 0px 8px 20px 0px/);
  await expect(surface).toHaveCSS('border-color',accent);
  await page.mouse.move(0,0);
  await expect(surface).toHaveCSS('box-shadow',light);
  await expect(surface).toHaveCSS('border-color',border);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(surface).toHaveCSS('transition-duration','0s');
});

test('card images and descriptions follow the primary link while actions remain independent', async ({page}) => {
  await page.goto('/docs/building-blocks/card/');
  const card = page.locator('.component-preview .ps-card');
  const primary = card.locator('.primary-link');
  const ink = await card.evaluate(el=>getComputedStyle(el).color);
  await expect(primary).toHaveCSS('color',ink);
  await expect(card.locator('a a')).toHaveCount(0);
  // Click actual image and text positions: the native overlay link receives the pointer.
  for (const child of ['img','.description']) {
    await card.scrollIntoViewIfNeeded();
    const box = (await card.locator(child).boundingBox())!;
    await page.mouse.click(box.x+box.width/2,box.y+box.height/2);
    await expect(page).toHaveURL(/#playground$/);
    await card.getByRole('link',{name:'Accessibility notes'}).click();
    await expect(page).toHaveURL(/#accessibility-and-ssr$/);
  }
  await primary.focus();
  await page.keyboard.press('Tab');
  await expect(card.getByRole('link',{name:'Accessibility notes'})).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(primary).toBeFocused();
  expect(await primary.evaluate(el=>getComputedStyle(el,'::after').outlineWidth)).toBe('3px');
});

test('all card sizes keep descriptions close, scale their text and fill each grid row', async ({page}) => {
  await page.goto('/sections/card-grid/');
  const sizes: Record<string, number> = {};
  for (const width of [390,900,1440]) {
    await page.setViewportSize({width,height:1000});
    for (const size of ['s','m','l']) {
      await page.getByRole('combobox',{name:'Card size',exact:true}).selectOption(size);
      const cards = page.locator('[data-preview] .ps-card');
      await expect(cards.first()).toHaveAttribute('data-ps-card-size',size);
      const metrics = await cards.evaluateAll(elements => elements.map(card => {
        const box=card.getBoundingClientRect();
        const title=card.querySelector('.title-label')!;
        const description=card.querySelector('.description')!;
        return {top:box.top,height:box.height,gap:description.getBoundingClientRect().top-title.getBoundingClientRect().bottom,
          titleSize:parseFloat(getComputedStyle(title).fontSize),descriptionSize:parseFloat(getComputedStyle(description).fontSize),
          fits:description.scrollHeight <= description.clientHeight+1};
      }));
      for (const metric of metrics) {
        expect(metric.descriptionSize).toBeLessThanOrEqual(metric.titleSize);
        expect(metric.gap).toBeGreaterThanOrEqual(4);
        expect(metric.gap).toBeLessThanOrEqual(8);
        expect(metric.fits).toBe(true);
        for (const peer of metrics.filter(other=>Math.abs(other.top-metric.top)<1)) {
          expect(Math.abs(peer.height-metric.height)).toBeLessThan(1);
        }
      }
      if (width === 1440) {
        sizes[size]=metrics[0].descriptionSize;
        expect(metrics.filter(metric=>Math.abs(metric.top-metrics[0].top)<1).length).toBeGreaterThan(1);
        await page.locator('[data-preview]').screenshot({path:`.artifacts/card-content-${size}.png`});
      }
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  expect(sizes.s).toBeLessThan(sizes.m);
  expect(sizes.m).toBeLessThan(sizes.l);
});

test('section and homepage illustrations use tightly cropped art without application windows', async ({page,request}) => {
  await page.goto('/sections/');
  const sources = await page.locator('#section-catalog img').evaluateAll(images => images.map(image => image.getAttribute('src')!));
  await page.goto('/');
  sources.push(...await page.locator('#features img, #explore img').evaluateAll(images => images.map(image => image.getAttribute('src')!)));
  expect(sources.length).toBe(19);
  for (const src of sources) {
    const response=await request.get(src);
    const svg=await response.text();
    expect(svg).not.toContain('id="window-shadow"');
    expect(svg).not.toContain('id="window"');
    expect(svg).not.toMatch(/<rect[^>]*(?:width="800"|height="500")/);
    const margins = await page.evaluate(source => {
      const host = document.createElement('div');
      host.style.cssText = 'position:fixed;left:-10000px;top:0';
      host.innerHTML = source;
      document.body.append(host);
      const root = host.querySelector('svg')!;
      // Nested photo viewports clip their own art before it reaches the illustration.
      for (const nested of root.querySelectorAll('svg')) {
        const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        for (const attribute of ['x', 'y', 'width', 'height']) rectangle.setAttribute(attribute, nested.getAttribute(attribute)!);
        nested.replaceWith(rectangle);
      }
      const bounds = root.getBBox(), view = root.viewBox.baseVal;
      const result = [bounds.x - view.x, bounds.y - view.y, view.x + view.width - bounds.x - bounds.width, view.y + view.height - bounds.y - bounds.height];
      host.remove();
      return result;
    }, svg);
    for (const margin of margins) expect(Math.abs(margin), src).toBeLessThanOrEqual(1);
  }
  await page.goto('/sections/');
  for (const width of [390,1440]) {
    await page.setViewportSize({width,height:1000});
    await page.locator('#section-catalog').screenshot({path:`.artifacts/cards-transparent-${width}.png`});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test('default and explicit card spans stretch with descriptions before hydration', async ({browser,baseURL}) => {
  const context=await browser.newContext({javaScriptEnabled:false,baseURL,viewport:{width:1440,height:1000}});
  const page=await context.newPage();
  for (const [url,selector] of [['/sections/card-grid/','[data-preview] .ps-card'],['/showcase/portfolio/','#projects .ps-card']]) {
    await page.goto(url);
    const boxes=await page.locator(selector).evaluateAll(cards=>cards.map(card=>{
      const {top,height}=card.getBoundingClientRect(); return {top,height};
    }));
    expect(boxes.length).toBeGreaterThan(1);
    expect(boxes.filter(box=>Math.abs(box.top-boxes[0].top)<1).length).toBeGreaterThan(1);
    for (const box of boxes) for (const peer of boxes.filter(other=>Math.abs(other.top-box.top)<1)) {
      expect(Math.abs(peer.height-box.height)).toBeLessThan(1);
    }
  }
  await context.close();
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
  await page.getByRole('checkbox',{name:'Card shadow',exact:true}).check();
  await expect(page.locator('.component-preview .ps-card')).toHaveAttribute('data-shadow','true');
  await expect(page.locator('.component-preview .description')).toBeVisible();
  await page.getByLabel('Show description',{exact:true}).uncheck();
  await expect(page.locator('.component-preview .description')).toHaveCount(0);
  await page.getByLabel('Show description',{exact:true}).check();
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
  await expect(page.getByRole('figure',{name:'Seven viewport sizes from phone to wide desktop'})).toContainText('Wide desktop');
  await expect(page.locator('#every-screen svg')).toHaveCount(7);
  await page.goto('/docs/building-blocks/section/');
  await expect(page.locator('#section-catalog .ps-card')).toHaveCount(10);
  await page.goto('/docs/page-layout/header/');
  await expect(page.getByRole('figure',{name:'Page anatomy'})).toBeVisible();
  await expect(page.getByLabel('Preview viewport')).toBeDisabled();
  await expect(page.frameLocator('iframe').getByRole('heading',{name:'Planting',exact:true})).toBeVisible();
  await context.close();
});
