import {chromium} from '@playwright/test';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const phase=process.argv[2]||'after';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4330';
const paths=[...readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).concat('/404.html');
mkdirSync('artifacts',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[];let posts=0;
try{for(const width of [320,360,390,430,768,1440]){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 await context.route('**/api/project-request',r=>{posts++;return r.abort();});
 const page=await context.newPage();
 for(const path of paths){const errors=[];const onError=e=>errors.push(e.message);page.on('pageerror',onError);
 const response=await page.goto(base+path);await page.evaluate(()=>document.fonts.ready);
 const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,offscreen:[...document.querySelectorAll('main a,main button,main input:not([tabindex="-1"]),main select,main textarea')].filter(e=>e.getBoundingClientRect().width&& (e.getBoundingClientRect().right>innerWidth+1||e.getBoundingClientRect().left< -1)).map(e=>e.outerHTML.slice(0,120)),header:document.querySelector('.site-header')?.getBoundingClientRect().height}));
 results.push({path,width,status:response.status(),...result,errors});page.off('pageerror',onError);
 if([390,1440].includes(width)&&['/hy/','/en/','/ru/','/hy/contact/','/ru/services/','/en/blog/business-website-cost/','/','/404.html'].includes(path))await page.screenshot({path:`artifacts/mobile-${phase}-${path.replaceAll('/','_')||'root'}-${width}.png`,fullPage:true});
 }
 await context.close();
}const issues=results.filter(r=>r.overflow>1||r.offscreen.length||r.errors.length||r.status!==200);writeFileSync(`artifacts/mobile-${phase}-audit.json`,JSON.stringify({results,posts},null,2));console.log(JSON.stringify({phase,pages:paths.length,cases:results.length,posts,issues}));if(issues.length||posts)throw Error('Mobile layout audit failed; see the JSON report.');
}finally{await browser.close();}
