import {chromium} from '@playwright/test';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const phase=process.argv[2]||'after';const base=process.env.PREVIEW_URL||'http://127.0.0.1:4330';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});const results=[];
const selectors={body:'body',headline:'.hero h1',lead:'.hero .lead',nav:'.desktop-navigation .main-nav a',menu:'.mobile-menu summary',button:'.hero .button',offer:'.hero-offer',note:'.hero-note',question:'.faq summary',answer:'.faq [data-faq-answer]',label:'.field label',input:'.field input',article:'.article-body p',metadata:'.article-date'};
try{for(const lang of ['hy','en','ru'])for(const width of [320,390,768,1440]){
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});let posts=0;await page.route('**/api/project-request',r=>{posts++;return r.abort();});
 const fonts=[];page.on('response',r=>{if(r.url().includes('.woff2'))fonts.push({file:r.url().split('/').pop(),status:r.status()});});
 const styles={};let platformFonts;for(const path of ['', 'contact/',`blog/${{hy:'biznes-kayqi-arjeq',en:'business-website-cost',ru:'stoimost-saita-dlya-biznesa'}[lang]}/`]){
 await page.goto(`${base}/${lang}/${path}`);await page.evaluate(()=>document.fonts.ready);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${lang} ${width} ${path} overflow`);
 for(const [key,selector] of Object.entries(selectors)){const el=page.locator(selector).first();if(await el.count())styles[key]=await el.evaluate(e=>{const s=getComputedStyle(e);return{size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,spacing:s.letterSpacing,family:s.fontFamily,height:e.getBoundingClientRect().height};});}
 if(path===''&&width===1440){const session=await page.context().newCDPSession(page);await session.send('DOM.enable');await session.send('CSS.enable');const {root}=await session.send('DOM.getDocument');const {nodeId}=await session.send('DOM.querySelector',{nodeId:root.nodeId,selector:'.hero .lead'});platformFonts=(await session.send('CSS.getPlatformFontsForNode',{nodeId})).fonts;assert(platformFonts.length&&platformFonts.every(f=>f.isCustomFont&&f.familyName.startsWith('Noto Sans')));await session.detach();}
 if(path===''&&[390,1440].includes(width)){await page.locator('.hero').screenshot({path:`artifacts/type-${phase}-${lang}-hero-${width}.png`});for(const el of (await page.locator('.faq summary').all()).slice(0,3))await el.click();await page.locator('#faq').screenshot({path:`artifacts/type-${phase}-${lang}-faq-${width}.png`});}
 if(phase==='after'){await page.addStyleTag({content:'html{font-size:200% !important}'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${lang} ${width} ${path} 200% overflow`);}
 }
 assert.equal(posts,0);assert(fonts.every(f=>f.status===200));if(phase==='after'){for(const key of ['nav','menu','button','label','input'])assert(parseFloat(styles[key].size)>=16,key);assert(parseFloat(styles.answer.size)>=17);assert(styles.button.height>=48);}results.push({lang,width,styles,fonts,platformFonts});await page.close();
}writeFileSync(`artifacts/type-${phase}-styles.json`,JSON.stringify(results,null,2));console.log(`PASS ${phase}: computed styles, fonts, hero/FAQ screenshots, three locales at four widths${phase==='after'?', including 200% text':''}`);
}finally{await browser.close();}
