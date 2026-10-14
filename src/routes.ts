import {locales, type Locale} from './config';
export const pageIds = ['home','services','about','contact','blog'] as const;
export type PageId = typeof pageIds[number];
export const route = (lang:Locale, page:PageId='home') => `/${lang}/${page==='home'?'':page+'/'}`;
export const articleRoute = (lang:Locale,slug:string) => `${route(lang,'blog')}${slug}/`;
export const navigation = (lang:Locale) => [route(lang,'services'),`${route(lang)}#process`,`${route(lang)}#pricing`,route(lang,'about'),`${route(lang)}#faq`,route(lang,'contact'),route(lang,'blog')];
export const pageAlternates = (page:PageId) => Object.fromEntries(locales.map(l=>[l,route(l,page)])) as Record<Locale,string>;
