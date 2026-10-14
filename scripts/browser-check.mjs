import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 for(const lang of ['hy','en','ru']) for(const width of [390,1440]) {
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(`${process.env.PREVIEW_URL||'http://127.0.0.1:4321'}/${lang}/`);assert.equal(response.status(),200);
  await page.evaluate(()=>document.fonts.ready);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${lang} ${width} overflow`);
  assert.deepEqual(errors,[]);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').getAttribute('class'),'skip-link');
  await page.keyboard.press('Enter');
  const faq=page.locator('summary').first();await faq.focus();await page.keyboard.press('Enter');assert(await page.locator('details').first().getAttribute('open')!==null);
  await page.keyboard.press('Enter');
  await page.locator(':focus').evaluate(el=>el.blur());
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`artifacts/${lang}-${width===390?'mobile':'desktop'}.png`,fullPage:true});
  await page.screenshot({path:`artifacts/${lang}-${width===390?'mobile':'desktop'}-hero.png`});
  const next=lang==='en'?'ru':'en';
  await page.locator(`.header-top .languages a[lang="${next}"]`).click();await page.waitForURL(`**/${next}/`);
  assert.equal(await page.locator('html').getAttribute('lang'),next);
  console.log(`PASS ${lang} ${width}px: HTTP, fonts, overflow, skip link, keyboard FAQ, language switching, screenshot`);
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:320,height:800}});
 for(const lang of ['hy','en','ru']){await page.goto(`${process.env.PREVIEW_URL||'http://127.0.0.1:4321'}/${lang}/`);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${lang} 320px overflow`);}
 console.log('PASS all locales at 320px');
} finally {await browser.close();}
