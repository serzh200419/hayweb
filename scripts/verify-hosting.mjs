import {readFileSync,readdirSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {siteConfiguration} from '../config/site.mjs';
const {origin,target,verification}=siteConfiguration();
const base={HAYWEB_BUILD_TARGET:'production'};
for(const value of ['', 'http://hayweb-check.pages.dev', 'https://localhost', 'https://127.0.0.1', 'https://example.com', 'https://sub.example.org', 'https://site.invalid', 'https://site.test', 'https://site.example', 'https://hash.site.pages.dev', 'https://site.pages.dev/path/', 'https://user:password@site.pages.dev', 'https://site.pages.dev:444', 'bad-url']){
 assert.throws(()=>siteConfiguration({...base,PUBLIC_SITE_URL:value}),undefined,`Accepted ${value}`);
}
assert.throws(()=>siteConfiguration({CF_PAGES:'1'}));
assert.throws(()=>siteConfiguration({CF_PAGES:'1',HAYWEB_BUILD_TARGET:'local'}));
assert.equal(siteConfiguration({}).origin,'http://localhost:4321');
assert.equal(siteConfiguration({...base,PUBLIC_SITE_URL:'https://origin-validation.pages.dev'}).origin,'https://origin-validation.pages.dev');
console.log('PASS production/preview origin guards and convenient local default');
const headers=readFileSync('dist/_headers','utf8');
assert(headers.includes('X-Content-Type-Options: nosniff'));
assert(headers.includes('X-Frame-Options: DENY'));
assert(headers.includes('Cache-Control: public, max-age=31536000, immutable'));
assert.equal(headers.includes('X-Robots-Tag: noindex'),target==='preview');
assert(!headers.includes('Content-Security-Policy:'));
const notFound=readFileSync('dist/404.html','utf8');
assert(notFound.includes('content="noindex"'));
assert(!notFound.includes('hreflang='));
for(const l of ['hy','en','ru']) assert(notFound.includes(`href="/${l}/"`));
assert(!readFileSync('dist/sitemap.xml','utf8').includes('404'));
const files=[];const walk=dir=>{for(const item of readdirSync(dir,{withFileTypes:true})){const path=`${dir}/${item.name}`;if(item.isDirectory())walk(path);else files.push(path);}};walk('dist');
for(const file of files.filter(p=>/\.(html|xml|txt|js|css)$/.test(p))){const text=readFileSync(file,'utf8');assert(!/[A-Z]:[\\/](?:Users|Program Files)|file:\/\/|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:sk-proj-|ghp_)[A-Za-z0-9]{20,}/i.test(text),`Secret or local path pattern in ${file}`);if(file.endsWith('.html')&&!file.endsWith('/404.html')){assert(!text.includes('name="robots" content="noindex"'));assert(!text.includes('data-draft'));if(verification)assert(text.includes(`name="google-site-verification" content="${verification}"`));else assert(!text.includes('name="google-site-verification"'));}if(target!=='local')assert(!/(?:https?:\/\/(?:localhost|127\.0\.0\.1|[^\s"<>]+\.(?:invalid|example|test)))/i.test(text),`Invalid hosted origin in ${file}`);}
assert(existsSync('dist/social.png'));
assert(readFileSync('dist/robots.txt','utf8').includes(`${origin}/sitemap.xml`));
console.log(`PASS ${target}: headers, preview indexing distinction, 404 output, sitemap, sharing asset, optional verification and output hygiene`);
