"use client";
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Checkbox} from '@/components/ui/checkbox';
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/components/ui/select';
import type {CustomField,Values,FieldValue} from '../lib/domain/admin-model';
export function newFieldId(){if(typeof crypto.randomUUID==='function')return crypto.randomUUID();const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;const hex=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');return [hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20)].join('-');}
export function Choice({value,onChange,label,options,disabled=false}:{value:string;onChange:(v:string)=>void;label:string;options:[string,string][];disabled?:boolean}){
 return <Select dir="rtl" value={value} onValueChange={onChange} disabled={disabled}><SelectTrigger aria-label={label} className="choice"><SelectValue/></SelectTrigger><SelectContent position="popper">{options.map(([v,l])=><SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select>;
}
export function Tick({checked,onChange,children,disabled=false}:{checked:boolean;onChange:(v:boolean)=>void;children:React.ReactNode;disabled?:boolean}){return <label className="tick"><Checkbox checked={checked} onCheckedChange={v=>onChange(v===true)} disabled={disabled}/><span>{children}</span></label>;}
export async function readResponse<T>(response:Response):Promise<T>{const data:unknown=await response.json();if(!response.ok)throw new Error((data as {error?:string}|null)?.error??'تعذر إتمام الطلب.');return data as T;}
export async function put<T>(url:string,value:unknown){return readResponse<T>(await fetch(url,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)}));}
export function CustomFields({fields,group,values,onChange,required=false,disabled=false,preview=false}:{fields:CustomField[];group:CustomField['group'];values:Values;onChange:(id:string,v:FieldValue)=>void;required?:boolean;disabled?:boolean;preview?:boolean}){
 return <div className="custom-fields">{fields.filter(f=>f.active&&f.group===group).map(f=>{const value=values[f.id]??f.defaultValue;const id=(preview?'preview-':'field-')+f.id;const req=required&&f.required;
 if(f.type==='heading')return <h4 key={f.id} className="custom-heading">{f.label}</h4>;
 if(f.type==='note')return <div key={f.id} className="custom-note"><b>{f.label}</b>{f.help&&<p>{f.help}</p>}</div>;
 const input=f.type==='boolean'?<Tick checked={value===true} onChange={v=>onChange(f.id,v)} disabled={disabled}>{f.label}{f.required&&<span className="required"> *</span>}</Tick>:f.type==='select'?<Select dir="rtl" value={String(value)||'__empty'} onValueChange={v=>onChange(f.id,v==='__empty'?'':v)} disabled={disabled}><SelectTrigger id={id} aria-label={f.label} className="choice"><SelectValue placeholder="اختر قيمة"/></SelectTrigger><SelectContent><SelectItem value="__empty">اختر قيمة</SelectItem>{f.options.map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>:f.type==='textarea'?<Textarea id={id} value={String(value)} onChange={e=>onChange(f.id,e.target.value)} placeholder={f.placeholder} disabled={disabled} required={req} maxLength={10000}/>:<Input id={id} value={String(value)} onChange={e=>onChange(f.id,e.target.value)} placeholder={f.placeholder} disabled={disabled} required={req} type={f.type==='date'?'date':f.type==='number'||f.type==='amount'?'number':'text'} step={f.type==='number'||f.type==='amount'?'any':undefined} min={f.min||undefined} max={f.max||undefined} maxLength={10000}/>;
 return <div key={f.id} className={'custom-field '+(f.wide?'wide':'')}>{f.type!=='boolean'&&<label htmlFor={id}>{f.label}{f.required&&<span className="required"> *</span>}</label>}{input}{f.help&&<small>{f.help}</small>}</div>;
 })}</div>;
}
