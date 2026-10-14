import {readFileSync, existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {siteConfiguration} from '../config/site.mjs';
const {origin} = siteConfiguration();
const read = p => readFileSync(`dist/${p}`, 'utf8');
const titles = new Set();
for (const lang of ['hy','en','ru']) {
 const html = read(`${lang}/index.html`);
 assert(html.includes(`<html lang="${lang}">`));
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 assert.equal((html.match(/<details>/g)||[]).length,8);
 assert(html.includes(`rel="canonical" href="${origin}/${lang}/"`));
 for (const l of ['hy','en','ru']) assert(html.includes(`hreflang="${l}" href="${origin}/${l}/"`));
 assert(html.includes(`hreflang="x-default" href="${origin}/"`));
 titles.add(html.match(/<title>(.*?)<\/title>/)[1]);
 const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 for (const [,href] of html.matchAll(/href="([^"]+)"/g)) {
  if(href.startsWith('#')) assert(ids.has(href.slice(1)),href);
  if(href.startsWith('/') && !href.startsWith('//')) {const target=href.split('#')[0];assert(existsSync(`dist${target.endsWith('/')?target+'index.html':target}`),href);}
  if(href.startsWith('https://wa.me/')) {
   const url=new URL(href.replaceAll('&amp;','&'));
   const message=url.searchParams.get('text');
   assert(message && !message.includes('%'));
   if(lang==='hy') assert(/[\u0530-\u058f]/.test(message));
   if(lang==='ru') assert(/[\u0400-\u04ff]/.test(message));
  }
 }
 const promotional = [...html.matchAll(/href="(https:\/\/wa.me\/[^\"]+)"/g)].some(([,u])=>new URL(u).searchParams.get('text').includes('WEBSERVICE'));
 assert(promotional);
 for(const price of [80000,20000,64000,16000,120000,96000]) {
  const formatted = new Intl.NumberFormat({hy:'hy-AM',en:'en-US',ru:'ru-RU'}[lang]).format(price);
  assert(html.includes(formatted),`${lang}: ${price}`);
 }
 for(const [,data] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(data);
 assert(!/<script[^>]+src=/.test(html),'Unexpected browser JavaScript');
 console.log(`PASS ${lang}: static content, 8 FAQs, links, metadata, prices, encoded messages, no browser JS`);
}
assert.equal(titles.size,3);
assert(read('index.html').includes('<html lang="hy">'));
assert(!read('index.html').includes('http-equiv="refresh"'));
assert(read('robots.txt').includes(`Sitemap: ${origin}/sitemap.xml`));
assert.equal((read('sitemap.xml').match(/<loc>/g)||[]).length,28);
console.log('PASS root entry, reciprocal language alternatives, sitemap and robots');
const rgb = h=>h.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
const luminance=h=>rgb(h).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
for(const [fg,bg] of [['142238','ffffff'],['536174','f6f9fc'],['007f83','ffffff'],['007f83','f6f9fc'],['0b1730','2dd4bf'],['c6cfdb','0b1730'],['9fb4cd','0b1730'],['2dd4bf','0b1730']]) {
 const values=[luminance(fg),luminance(bg)].sort((a,b)=>b-a);const contrast=(values[0]+.05)/(values[1]+.05);
 assert(contrast>=4.5,`${fg} on ${bg}: ${contrast}`);console.log(`PASS contrast #${fg} on #${bg}: ${contrast.toFixed(2)}:1`);
}
