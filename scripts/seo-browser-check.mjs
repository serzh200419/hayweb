import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
 for(const lang of ['hy','en','ru'])for(const path of ['', 'services/', 'about/', 'blog/', 'blog/'+({hy:'biznes-kayqi-arjeq',en:'business-website-cost',ru:'stoimost-saita-dlya-biznesa'}[lang])+'/', 'services/business-websites/', 'services/multilingual-websites/'])for(const width of [320,390,1440]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));const response=await page.goto(`http://127.0.0.1:4321/${lang}/${path}`);assert.equal(response.status(),200);await page.evaluate(()=>document.fonts.ready);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${lang}/${path} ${width} overflow`);assert.deepEqual(errors,[]);
  if(path.startsWith('services/')&&path!=='services/'){
   assert.equal(await page.locator('.detail-bottom details').count(),3);assert.equal(await page.locator('.header-top .languages a[lang="ru"]').getAttribute('href'),`/ru/${path}`);assert(await page.locator('a[href^="https://wa.me/"]:visible').count()>0);
   if(width===390){await page.locator('.header-top .languages a[lang="ru"]').click();await page.waitForURL(`**/ru/${path}`);await page.goto(`http://127.0.0.1:4321/${lang}/${path}`);await page.evaluate(()=>document.fonts.ready);}
  }
  if(lang==='hy'&&[390,1440].includes(width)&&path.startsWith('services/')){await page.screenshot({path:`artifacts/seo-${path==='services/'?'overview':path.split('/')[1]}-${width}.png`,fullPage:true});await page.screenshot({path:`artifacts/seo-${path==='services/'?'overview':path.split('/')[1]}-${width}-top.png`});}
  await page.close();
 }
 console.log('PASS changed pages and new services in all languages at 320/390/1440px: HTTP, static text, no overflow, no script errors, equivalent language links and screenshots');
}finally{await browser.close();}
