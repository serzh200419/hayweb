import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4330';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const paths=[...readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).concat('/404.html');
const results=[];let posts=0;
const fit=async(page,label)=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' horizontal overflow');
try{
 for(const lang of ['hy','en','ru']){
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
  await page.route('**/api/project-request',r=>{posts++;return r.abort();});
  for(const width of [320,360,390,430,768]){
   await page.setViewportSize({width,height:844});await page.goto(`${base}/${lang}/`);
   const summary=page.locator('.mobile-menu summary');const menu=page.locator('.mobile-menu');
   await summary.focus();await page.keyboard.press('Enter');assert(await menu.evaluate(e=>e.open));
   assert.equal(await page.locator('.mobile-menu nav a:visible').count(),7);
   await fit(page,`${lang} menu ${width}`);
   assert(await summary.evaluate(e=>e.getBoundingClientRect().height>=44));
   await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').getAttribute('href'),`/${lang}/services/`);
   await page.keyboard.press('Escape');assert(!await menu.evaluate(e=>e.open));assert(await summary.evaluate(e=>e===document.activeElement));
   await summary.click();await page.locator('.header-top').click({position:{x:190,y:3}});assert(!await menu.evaluate(e=>e.open));
   await summary.click();await page.locator('.mobile-menu nav a').first().click();await page.waitForURL(`${base}/${lang}/services/`);
   results.push(`${lang} ${width}: menu Enter/Tab/Escape/outside/navigation`);
  }
  await page.setViewportSize({width:390,height:844});await page.goto(`${base}/${lang}/contact/`);
  await page.locator('[name=name]').fill('LAYOUT TEST ONLY');await page.locator('[name=name]').focus();await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').getAttribute('name'),'business');
  await page.locator('button[type=submit]').click();assert(await page.locator('.error-summary').isVisible());assert(await page.locator('.error-summary').evaluate(e=>e===document.activeElement));assert.equal(await page.locator('[name=name]').inputValue(),'LAYOUT TEST ONLY');
  for(const width of [320,844,390]){await page.setViewportSize({width,height:width===844?390:844});assert.equal(await page.locator('[name=name]').inputValue(),'LAYOUT TEST ONLY');await fit(page,`${lang} form resize`);}
  assert.equal(await page.locator('[name=email]').getAttribute('inputmode'),'email');assert.equal(await page.locator('[name=phone]').getAttribute('inputmode'),'tel');assert.equal(await page.locator('[name=pages]').getAttribute('inputmode'),'numeric');
  assert(await page.locator('[name=name]').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16));
  const table=page.locator('.estimate-table-wrap');assert(await table.evaluate(e=>e.scrollWidth>e.clientWidth));await table.focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(100);assert(await table.evaluate(e=>e.scrollLeft>0));
  await page.goto(`${base}/${lang}/`);await page.locator('.mobile-menu summary').click();await page.locator('.mobile-menu nav a').first().focus();await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(100);assert(await page.locator('.desktop-navigation a').first().evaluate(e=>e===document.activeElement));assert(!await page.locator('.mobile-menu').evaluate(e=>e.open));
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:900});await page.goto(`${base}/${lang}/`);await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:`artifacts/mobile-${lang}-home-${width}.png`});
   await page.locator('.hero').screenshot({path:`artifacts/mobile-${lang}-hero-${width}.png`});
   await page.locator('#pricing').screenshot({path:`artifacts/mobile-${lang}-pricing-${width}.png`});
   await page.locator('.studio-footer').screenshot({path:`artifacts/mobile-${lang}-footer-${width}.png`});
   if(width===390){await page.evaluate(()=>scrollTo(0,0));await page.locator('.mobile-menu summary').click();await page.screenshot({path:`artifacts/mobile-${lang}-menu.png`});}
   await page.goto(`${base}/${lang}/contact/`);await page.screenshot({path:`artifacts/mobile-${lang}-contact-${width}.png`,fullPage:true});await page.locator('.form-grid').screenshot({path:`artifacts/mobile-${lang}-form-${width}.png`});await page.locator('.live-summary').screenshot({path:`artifacts/mobile-${lang}-estimate-${width}.png`});
   const article={hy:'biznes-kayqi-arjeq',en:'business-website-cost',ru:'stoimost-saita-dlya-biznesa'}[lang];await page.goto(`${base}/${lang}/blog/${article}/`);await page.screenshot({path:`artifacts/mobile-${lang}-article-${width}.png`});await page.locator('.article-body').screenshot({path:`artifacts/mobile-${lang}-article-body-${width}.png`});
  }
  await page.close();
  const nojs=await browser.newPage({viewport:{width:320,height:844},javaScriptEnabled:false});for(const route of ['','services/','services/business-websites/','services/multilingual-websites/','about/','contact/','blog/']){await nojs.goto(`${base}/${lang}/${route}`);await nojs.locator('.mobile-menu summary').click();assert.equal(await nojs.locator('.mobile-menu nav a:visible').count(),7);await fit(nojs,`${lang} no JS ${route}`);if(route===''){await nojs.locator('.faq summary').first().click();assert(await nojs.locator('.faq details').first().evaluate(e=>e.open));}if(route==='contact/'){assert(await nojs.locator('form').isHidden());assert(await nojs.locator('a[href^="mailto:"]:visible').count()>0);}}await nojs.close();
 }
 for(const width of [320,390,768,844]){
  const page=await browser.newPage({viewport:{width,height:width===844?390:900},hasTouch:true,reducedMotion:'reduce'});
  for(const path of paths){await page.goto(base+path);if(width!==844)await page.addStyleTag({content:'html{font-size:200% !important}'});await fit(page,`${width===844?'landscape':'200% text'} ${width} ${path}`);
   const offscreen=await page.evaluate(()=>[...document.querySelectorAll('main button,main input:not([tabindex="-1"]),main select,main textarea')].filter(e=>e.getBoundingClientRect().width&&(e.getBoundingClientRect().right>innerWidth+1||e.getBoundingClientRect().left< -1)).map(e=>e.outerHTML.slice(0,100)));assert.deepEqual(offscreen,[],`${path} enlarged/landscape controls`);
   assert.equal(await page.locator('.cursor-accent:visible').count(),0);
  }await page.close();results.push(`${width}: all 29 pages ${width===844?'landscape 844x390':'200% root text'}, controls in viewport, no touch cursor`);
 }
 assert.equal(posts,0);writeFileSync('artifacts/mobile-interactions.json',JSON.stringify({results,posts},null,2));console.log('PASS: '+results.join('\n')+'\nNo project requests sent.');
}finally{await browser.close();}
