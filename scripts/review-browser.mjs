import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
  const fontReport=[];
  for(const lang of ['hy','ru']) {
    const page=await browser.newPage();await page.goto(`http://127.0.0.1:4321/${lang}/`);await page.evaluate(()=>document.fonts.ready);
    const session=await page.context().newCDPSession(page);
    await session.send('DOM.enable');await session.send('CSS.enable');
    const document=await session.send('DOM.getDocument');
    const {nodeId}=await session.send('DOM.querySelector',{nodeId:document.root.nodeId,selector:'h1'});
    const {fonts}=await session.send('CSS.getPlatformFontsForNode',{nodeId});
    assert(fonts.some(f=>f.isCustomFont&&f.glyphCount>0&&f.familyName.includes(lang==='hy'?'Armenian':'Noto Sans')));
    fontReport.push({lang,fonts});await page.close();
  }
  await writeFile('artifacts/font-review.json',JSON.stringify(fontReport,null,2));
  for(const width of [390,1440]){
    const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
    await page.goto('http://127.0.0.1:4321/hy/');await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:`artifacts/prelaunch-hy-${width}.png`,fullPage:true});
    await page.screenshot({path:`artifacts/prelaunch-hy-${width}-top.png`});
    if(width===390)assert(await page.locator('.header-cta').isVisible());
    await page.goto('http://127.0.0.1:4321/');await page.evaluate(()=>document.fonts.ready);
    assert(await page.locator('h1').isVisible());assert(await page.locator('a[href="/hy/"]').last().isVisible());
    assert(await page.locator('a[lang="en"]').isVisible());assert(await page.locator('a[lang="ru"]').isVisible());
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:`artifacts/prelaunch-root-${width}.png`,fullPage:true});
    const response=await page.goto('http://127.0.0.1:4321/does-not-exist/deep-page/');
    assert.equal(response.status(),404);assert(await page.locator('main').innerText().then(t=>t.includes('404')));
    assert(await page.locator('a[href="/en/"]').isVisible());
    await page.close();
  }
  console.log('PASS custom Armenian/Cyrillic glyph fonts, visible mobile contact CTA, branded entry, local deep 404 and fresh screenshots');
} finally {await browser.close();}
