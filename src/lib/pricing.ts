import {business} from '../config.ts';
export const optionKeys=['website','languages','blog','commerce','logo'] as const;
export type OptionKey=typeof optionKeys[number];
export type PriceKey=OptionKey|'page';
export interface Selection {website:boolean;languages:boolean;blog:boolean;commerce:boolean;logo:boolean;pages:number;maintenance:boolean}
export const defaultSelection:Selection={website:true,languages:false,blog:false,commerce:false,logo:false,pages:0,maintenance:false};
export const offerPrice=(key:PriceKey)=>key==='languages'?0:Math.round(business.pricing[key]*(1-business.promotion.discount));
export function calculate(selection:Selection){
 const rows=[...optionKeys.filter(key=>selection[key]).map(key=>({key,quantity:1,regular:business.pricing[key],offer:offerPrice(key)})),...(selection.pages>0?[{key:'page' as const,quantity:selection.pages,regular:business.pricing.page*selection.pages,offer:offerPrice('page')*selection.pages}]:[])];
 const regular=rows.reduce((sum,row)=>sum+row.regular,0);const offer=rows.reduce((sum,row)=>sum+row.offer,0);
 return {rows,regular,offer,savings:regular-offer,monthly:selection.maintenance?business.maintenance:0};
}
export const requestPath=(lang:string)=>`/${lang}/contact/#project-request`;
export function selectionURL(lang:string,s:Selection){const params=new URLSearchParams();for(const key of optionKeys)params.set(key,s[key]?'1':'0');params.set('pages',String(s.pages));params.set('maintenance',s.maintenance?'1':'0');return `/${lang}/contact/?${params}#project-request`;}
export function selectionFromURL(search:string):Selection{const params=new URLSearchParams(search);const result={...defaultSelection};for(const key of optionKeys)if(params.has(key))result[key]=params.get(key)==='1';const pages=Number(params.get('pages')||0);result.pages=Number.isInteger(pages)&&pages>=0&&pages<=100?pages:0;result.maintenance=params.get('maintenance')==='1';return result;}
