import {validateRequest,type ProjectRequest} from '../../src/lib/project-request.ts';
import {calculate} from '../../src/lib/pricing.ts';
interface KV {get(key:string):Promise<string|null>;put(key:string,value:string,options?:{expirationTtl:number}):Promise<void>;delete(key:string):Promise<void>}
export interface Env {TELEGRAM_BOT_TOKEN?:string;TELEGRAM_CHAT_ID?:string;PROJECT_REQUESTS_KV?:KV}
interface Context{request:Request;env:Env}
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'};
const response=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
const digest=async(value:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(byte=>byte.toString(16).padStart(2,'0')).join('');
export function notification(p:ProjectRequest,reference:string,submittedAt:string){
 const estimate=calculate(p.selection);const lines=['HayWeb — PROJECT REQUEST',`Reference: ${reference}`,`Submitted: ${submittedAt}`,`Name: ${p.name}`,`Business: ${p.business||'—'}`,`Email: ${p.email||'—'}`,`Phone / WhatsApp: ${p.phone||'—'}`,`Preferred contact: ${p.preferred}`,`Preferred language: ${p.language}`,`Website/profile: ${p.url||'—'}`,'','Selected items (regular → form offer, AMD):',...estimate.rows.map(row=>`${row.key} × ${row.quantity}: ${row.regular} → ${row.offer}`),`One-time starting total: ${estimate.regular} → ${estimate.offer} AMD`,`Maintenance: ${estimate.monthly?estimate.monthly+' AMD/month, separate':'Not selected'}`,'','Project description:',p.description,'','Quote request only; scope and external charges agreed separately.'];
 return lines.join('\n'); // Plain text, with no Telegram parse_mode: user text is never interpreted as markup.
}
export async function handleProjectRequest({request,env}:Context,deliver:typeof fetch=fetch):Promise<Response>{
 if(request.method!=='POST')return response({error:'invalid'},405);
 const origin=request.headers.get('Origin');if(!origin||origin!==new URL(request.url).origin)return response({error:'invalid'},403);
 if(!request.headers.get('Content-Type')?.includes('application/json'))return response({error:'invalid'},415);
 if(Number(request.headers.get('Content-Length')||0)>16000)return response({error:'length'},413);
 let raw:string;try{raw=await request.text();}catch{return response({error:'invalid'},400);}if(new TextEncoder().encode(raw).length>16000)return response({error:'length'},413);
 let input:unknown;try{input=JSON.parse(raw);}catch{return response({error:'invalid'},400);}const parsed=validateRequest(input);if(!parsed.value)return response({error:'invalid',fields:parsed.errors},422);
 const p=parsed.value;const kv=env.PROJECT_REQUESTS_KV;if(!kv||!env.TELEGRAM_BOT_TOKEN||!env.TELEGRAM_CHAT_ID)return response({error:'unconfigured'},503);
 const key=`request:${p.requestId}`;const pendingKey=`pending:${p.requestId}`;const fingerprint=await digest(JSON.stringify(p));
 try{
  const previous=await kv.get(key);if(previous){const record=JSON.parse(previous);if(record.fingerprint!==fingerprint)return response({error:'invalid'},409);return response(record.result);}
  const pending=await kv.get(pendingKey);if(pending)return response({error:'pending'},409);
  const ipHash=await digest((request.headers.get('CF-Connecting-IP')||'local')+env.TELEGRAM_BOT_TOKEN);const rateKey=`rate:${ipHash}:${Math.floor(Date.now()/60000)}`;const attempts=Number(await kv.get(rateKey)||0);if(attempts>=5)return response({error:'rate'},429);await kv.put(rateKey,String(attempts+1),{expirationTtl:120});
  await kv.put(pendingKey,JSON.stringify({fingerprint}),{expirationTtl:60});
 }catch{return response({error:'unconfigured'},503);}
 const submittedAt=new Date().toISOString();const reference=`HW-${p.requestId.toUpperCase()}`;
 let delivered=false;try{const provider=await deliver(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:env.TELEGRAM_CHAT_ID,text:notification(p,reference,submittedAt),link_preview_options:{is_disabled:true}}),signal:AbortSignal.timeout(12000)});const data=await provider.json() as {ok?:boolean};delivered=provider.ok&&data.ok===true;}catch{/* Never log provider URLs, credentials or personal data. */}
 if(!delivered){try{await kv.delete(pendingKey);}catch{}return response({error:'delivery'},502);}
 const result={ok:true,reference,submittedAt,estimate:calculate(p.selection)};try{await kv.put(key,JSON.stringify({fingerprint,result}),{expirationTtl:86400});await kv.delete(pendingKey);}catch{/* Delivery is confirmed even if best-effort dedup storage fails. */}
 return response(result);
}
export const onRequestPost=(context:Context)=>handleProjectRequest(context);
export const onRequestGet=()=>response({error:'invalid'},405);
