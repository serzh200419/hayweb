import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
 for(const width of [320,390,768,1440])for(const lang of ['hy','en','ru']){
  const page=await browser.newPage({viewport:{width,height:1000}});
  await page.goto(`http://127.0.0.1:4321/${lang}/`);await page.evaluate(()=>document.fonts.ready);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${lang}/${width} overflow`);
  const links=page.locator('.wordmark');
  assert.equal(await links.count(),2);
  for(const logo of await links.all()){
   assert.equal(await logo.getAttribute('aria-label'),'HayWeb');assert.equal(await logo.getAttribute('href'),`/${lang}/`);
   const img=logo.locator('img');assert.equal(await img.getAttribute('alt'),'');assert.equal(await img.getAttribute('aria-hidden'),'true');
   assert(await img.evaluate(el=>el.complete&&el.naturalWidth>0));
   const box=await img.boundingBox();assert(Math.abs(box.width/box.height-1007/270)<.01,'Stretched logo');
  }
  if(lang==='hy'&&[390,1440].includes(width)){
   await page.locator('header.site-header').screenshot({path:`artifacts/branding-header-${width}.png`});
   await page.locator('footer.container').screenshot({path:`artifacts/branding-footer-${width}.png`});
  }
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:700,height:280}});
 await page.setContent('<main style="padding:35px;background:#0B1730"><a aria-label="HayWeb" style="display:inline-block;padding:15px;background:#F6F9FC;border-radius:5px"><img alt="" width="1007" height="270" style="display:block;width:500px;height:auto" src="http://127.0.0.1:4321/branding/hayweb-logo.svg"></a></main>');
 await page.locator('img').evaluate(img=>img.decode());await page.screenshot({path:'artifacts/branding-navy-panel.png'});
 for(const [file,size] of [['favicon-32.png',32],['apple-touch-icon.png',180]]){const png=readFileSync(`public/${file}`);assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size);}
 console.log('PASS official logo proportions, image loading, accessible links, all locales at four widths, favicon PNG sizes and fresh header/footer screenshots');
}finally{await browser.close();}
