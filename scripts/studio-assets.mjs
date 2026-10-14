import {chromium} from '@playwright/test';
import {readFileSync,writeFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
const phase=process.argv[2]||'after';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const result={};
try{for(const [name,path] of [['home','/hy/'],['contact','/hy/contact/']]){
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 await page.goto((process.env.PREVIEW_URL||'http://127.0.0.1:4330')+path);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(500);
 const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>({url:new URL(r.name).pathname,encoded:r.encodedBodySize,decoded:r.decodedBodySize,transfer:r.transferSize})));
 const kind=url=>url.endsWith('.js')?'js':url.endsWith('.css')?'css':/\.woff2?$/.test(url)?'font':/\.(svg|png|webp|jpg)$/.test(url)?'image':'other';
 const inlineModules=await page.evaluate(()=>[...document.querySelectorAll('script[type=module]:not([src])')].map(el=>el.textContent));
 const html=await page.evaluate(()=>performance.getEntriesByType('navigation')[0].encodedBodySize);
 result[name]={resources,html,inlineJs:{raw:inlineModules.reduce((n,s)=>n+Buffer.byteLength(s),0),gzip:inlineModules.reduce((n,s)=>n+gzipSync(s).length,0)},bytes:Object.fromEntries(['js','css','font','image'].map(k=>[k,resources.filter(r=>kind(r.url)===k).reduce((n,r)=>n+r.encoded,0)])),gzip:Object.fromEntries(['js','css'].map(k=>[k,resources.filter(r=>kind(r.url)===k).reduce((n,r)=>n+gzipSync(readFileSync('dist'+r.url)).length,0)]))};await page.close();
}}finally{await browser.close();}
writeFileSync(`artifacts/studio-${phase}-assets.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
