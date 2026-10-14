import {locales,type Locale} from '../config.ts';
import {optionKeys,calculate,type Selection} from './pricing.ts';
export interface ProjectRequest {requestId:string;lang:Locale;language:Locale;name:string;business:string;email:string;phone:string;preferred:'email'|'phone'|'whatsapp';url:string;description:string;consent:true;selection:Selection;website_note:string}
export const limits={name:100,business:120,email:254,phone:40,url:400,description:2000} as const;
export const validEmail=(value:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
export const validPhone=(value:string)=>/^[+\d () .-]+$/.test(value)&&value.replace(/\D/g,'').length>=7&&value.replace(/\D/g,'').length<=15;
export function validateRequest(input:unknown):{value?:ProjectRequest;errors:Record<string,string>}{
 const errors:Record<string,string>={};if(!input||typeof input!=='object'||Array.isArray(input))return{errors:{form:'invalid'}};const data=input as Record<string,unknown>;
 const strings={} as Record<keyof typeof limits,string>;
 for(const [key,max] of Object.entries(limits)){const value=data[key];const trimmed=typeof value==='string'?value.trim():'';strings[key as keyof typeof limits]=key==='description'?trimmed:trimmed.replace(/[\r\n\t]/g,' ');if(value!==undefined&&typeof value!=='string'||strings[key as keyof typeof limits].length>max)errors[key]='length';}
 if(!strings.name)errors.name='name';if(!strings.description)errors.description='description';
 if(strings.email&&!validEmail(strings.email))errors.email='email';if(strings.phone&&!validPhone(strings.phone))errors.phone='phone';if(!validEmail(strings.email)&&!validPhone(strings.phone))errors.email='contact';
 const preferred=data.preferred;if(!['email','phone','whatsapp'].includes(String(preferred))||(preferred==='email'?!validEmail(strings.email):!validPhone(strings.phone)))errors.preferred='preferred';
 if(strings.url){try{const url=new URL(strings.url);if(!['http:','https:'].includes(url.protocol))errors.url='url';}catch{errors.url='url';}}
 if(data.consent!==true)errors.consent='consent';if(!locales.includes(data.lang as Locale)||!locales.includes(data.language as Locale))errors.language='invalid';if(typeof data.requestId!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(data.requestId))errors.form='invalid';
 const selection=data.selection as Selection|undefined;
 if(!selection||typeof selection!=='object'||optionKeys.some(key=>typeof selection[key]!=='boolean')||typeof selection.maintenance!=='boolean')errors.selection='options';
 else {if(!Number.isInteger(selection.pages)||selection.pages<0||selection.pages>100)errors.pages='pages';if(!calculate(selection).rows.length&&!selection.maintenance)errors.selection='options';}
 if(typeof data.website_note==='string'&&data.website_note)errors.form='invalid';
 if(Object.keys(errors).length)return{errors};
 return {errors,value:{...strings,requestId:data.requestId as string,lang:data.lang as Locale,language:data.language as Locale,preferred:preferred as ProjectRequest['preferred'],consent:true,selection:{...Object.fromEntries(optionKeys.map(key=>[key,selection![key]])),pages:selection!.pages,maintenance:selection!.maintenance} as Selection,website_note:''}};
}
