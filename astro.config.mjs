import { defineConfig } from 'astro/config';
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {siteConfiguration} from './config/site.mjs';
const {origin,target} = siteConfiguration();
export default defineConfig({
  site:origin, output:'static', trailingSlash:'always',
  integrations:[{name:'hayweb-hosting-headers',hooks:{'astro:build:done':({dir})=>{
    const headerPath = new URL('_headers',dir);
    const base = readFileSync(new URL('./public/_headers',import.meta.url),'utf8');
    const headers = target === 'preview' ? base.replace('/*\n','/*\n  X-Robots-Tag: noindex\n') : base;
    writeFileSync(fileURLToPath(headerPath),headers);
  }}}],
});
