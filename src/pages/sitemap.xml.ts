import type { APIRoute } from 'astro';
import {locales} from '../config';
import {pageIds,route,articleRoute} from '../routes';
import {publishedArticles} from '../articles';
export const GET: APIRoute = ({site}) => new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/',...locales.flatMap(l=>pageIds.map(page=>route(l,page))),...publishedArticles.map(a=>articleRoute(a.lang,a.slug))].map(path=>`<url><loc>${new URL(path,site).href}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
