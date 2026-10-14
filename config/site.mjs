import {existsSync} from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');

// Shared by Astro, the hosting header generator and output verification.
export function siteConfiguration(env = process.env) {
  const target = env.HAYWEB_BUILD_TARGET || (env.CF_PAGES === '1' ? '' : 'local');
  if (!['local', 'production', 'preview'].includes(target) || (env.CF_PAGES === '1' && target === 'local')) {
    throw new Error('Set HAYWEB_BUILD_TARGET to production or preview in the corresponding Cloudflare Pages environment. Local builds may use local.');
  }
  const strict = target !== 'local';
  if (strict && !env.PUBLIC_SITE_URL?.trim()) throw new Error('PUBLIC_SITE_URL is required for production and preview builds. Set it to the confirmed HTTPS production origin, then rebuild.');
  let url;
  try { url = new URL(env.PUBLIC_SITE_URL || 'http://localhost:4321'); }
  catch { throw new Error('PUBLIC_SITE_URL must be a valid absolute site origin.'); }
  if (url.pathname !== '/' || url.search || url.hash || url.username || url.password || !['https:', 'http:'].includes(url.protocol)) {
    throw new Error('PUBLIC_SITE_URL must be an origin without a path, credentials, query or fragment.');
  }
  if (strict) {
    const host = url.hostname.toLowerCase();
    const reserved = /(^|\.)(localhost|example\.(com|net|org))$|\.(invalid|example|test|localhost|local)$/i.test(host);
    const ip = /^\d+(\.\d+){3}$/.test(host) || host.includes(':');
    const pagesPreview = host.endsWith('.pages.dev') && host.split('.').length !== 3;
    if (url.protocol !== 'https:' || url.port || reserved || ip || pagesPreview || host.endsWith('.') || !host.includes('.')) {
      throw new Error('PUBLIC_SITE_URL must be the confirmed public HTTPS production origin, with no port. Localhost, IP addresses and reserved example/test domains are not allowed for hosted builds.');
    }
  }
  return {origin:url.origin, target, verification:env.GOOGLE_SITE_VERIFICATION?.trim() || ''};
}
