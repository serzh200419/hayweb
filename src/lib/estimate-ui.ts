import {calculate,optionKeys,type Selection} from './pricing';
export function readSelection(form:HTMLFormElement):Selection{const data=new FormData(form);return {...Object.fromEntries(optionKeys.map(key=>[key,data.has(key)])),pages:Number(data.get('pages')||0),maintenance:data.has('maintenance')} as Selection;}
export function setSelection(form:HTMLFormElement,selection:Selection){for(const key of [...optionKeys,'maintenance'] as const){form.querySelector<HTMLInputElement>(`[name=${key}]`)!.checked=selection[key];}form.querySelector<HTMLInputElement>('[name=pages]')!.value=String(selection.pages);}
interface Copy{labels:Record<string,string>;month:string}
export function updateSummary(root:HTMLElement,selection:Selection,copy:Copy,lang:string,currency:string){
 const q=calculate(selection);const money=(n:number)=>`${n.toLocaleString(lang)} ${currency}`;const tbody=root.querySelector('[data-summary-rows]')!;tbody.replaceChildren();
 for(const row of q.rows){const tr=document.createElement('tr');const th=document.createElement('th');th.scope='row';th.textContent=`${copy.labels[row.key]} × ${row.quantity}`;const regular=document.createElement('td');const strike=document.createElement('s');strike.textContent=money(row.regular);regular.append(strike);const offer=document.createElement('td');offer.textContent=money(row.offer);tr.append(th,regular,offer);tbody.append(tr);}
 for(const [key,value] of Object.entries({regular:q.regular,offer:q.offer,savings:q.savings})){root.querySelector(`[data-total-${key}]`)!.textContent=money(value);}root.querySelector('[data-total-monthly]')!.textContent=q.monthly?`${q.monthly.toLocaleString(lang)} ${copy.month}`:'—';return q;
}
