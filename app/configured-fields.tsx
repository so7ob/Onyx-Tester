"use client";
import {useState,type ReactNode,type CSSProperties} from 'react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {states} from '../lib/domain/model';
import type {FieldValue,Values} from '../lib/domain/admin-model';
import type {FormField,FormGroup,TestForm} from '../lib/domain/editor-model';
import {computedValues,effectiveField} from '../lib/domain/advanced-model';
import {Choice,Tick,newFieldId} from './form-fields';
type Row={id:string;cells:Record<string,FieldValue>};
function EditableTable({field:f,value,onChange,disabled}:{field:FormField;value:FieldValue;onChange:(v:FieldValue)=>void;disabled:boolean}){
 let rows:Row[]=[];try{rows=JSON.parse(String(value)||'[]');if(!Array.isArray(rows))rows=[];}catch{}
 const columns=f.columns??[];function change(next:Row[]){onChange(JSON.stringify(next));}
 return <div className="dynamic-table"><table><thead><tr>{columns.map(c=><th key={c.id} style={{minWidth:c.width}}>{c.label}{c.required?' *':''}</th>)}<th className="no-print">العمليات</th></tr></thead><tbody>{rows.map((r,i)=><tr key={r.id}>{columns.map(c=><td key={c.id}>{c.type==='boolean'?<Tick checked={r.cells[c.id]===true} disabled={disabled} onChange={v=>change(rows.map(x=>x.id===r.id?{...x,cells:{...x.cells,[c.id]:v}}:x))}>{c.label}</Tick>:<Input aria-label={c.label+' صف '+(i+1)} type={c.type==='number'?'number':c.type==='date'?'date':'text'} disabled={disabled} value={String(r.cells[c.id]??'')} onChange={e=>change(rows.map(x=>x.id===r.id?{...x,cells:{...x.cells,[c.id]:e.target.value}}:x))}/>}</td>)}<td className="no-print"><div className="action-cluster"><Button type="button" variant="outline" size="sm" disabled={disabled||i===0} aria-label="نقل الصف لأعلى" onClick={()=>{const next=[...rows];[next[i-1],next[i]]=[next[i],next[i-1]];change(next);}}>↑</Button><Button type="button" variant="outline" size="sm" disabled={disabled} onClick={()=>change([...rows.slice(0,i+1),{id:newFieldId(),cells:{...r.cells}},...rows.slice(i+1)])}>نسخ</Button><Button type="button" variant="outline" size="sm" disabled={disabled} onClick={()=>change(rows.filter(x=>x.id!==r.id))}>حذف</Button></div></td></tr>)}</tbody></table><Button className="no-print" type="button" variant="outline" disabled={disabled||rows.length>=200||!columns.length} onClick={()=>change([...rows,{id:newFieldId(),cells:{}}])}>إضافة صف</Button></div>;
}
function SearchChoice({f,value,onChange,disabled}:{f:FormField;value:FieldValue;onChange:(v:FieldValue)=>void;disabled:boolean}){const [search,setSearch]=useState('');return <div><Input aria-label={'بحث '+f.label} placeholder="بحث في الخيارات…" value={search} onChange={e=>setSearch(e.target.value)} disabled={disabled}/><Choice label={f.label} value={String(value)||'__empty'} onChange={v=>onChange(v==='__empty'?'':v)} options={[["__empty","اختر قيمة"],...f.options.filter(o=>o.includes(search)||o===value).map(o=>[o,f.optionItems?.find(x=>x.value===o)?.label??o] as [string,string])]} disabled={disabled}/></div>;}
export function ConfiguredFields({form,group,values:inputValues,onChange,required=false,disabled=false,preview=false,fileContent,onSelect,selected}:{form:TestForm;group:FormGroup;values:Values;onChange:(field:FormField,value:FieldValue)=>void;required?:boolean;disabled?:boolean;preview?:boolean;fileContent?:ReactNode;onSelect?:(id:string)=>void;selected?:string}){
 const computed=computedValues(form,inputValues),values=computed.values;
 const items=form.fields.filter(f=>f.group===group).map(f=>effectiveField(f,values)).filter(f=>f.active);
 function render(f:FormField){
 const value=Object.hasOwn(values,f.id)?values[f.id]:(f.kind==='custom'||group==='instructions'?f.defaultValue:['boolean','consent'].includes(f.type)?false:'');const id=(preview?'preview-':'input-')+f.id,req=required&&f.required;const locked=disabled||!!f.disabled||!!f.readOnly;
 const l=f.layout,a=f.appearance;const style={'--field-desktop':l?.desktop??(f.wide?12:6),'--field-tablet':l?.tablet??(f.wide?12:6),'--field-mobile':l?.mobile??12,'--field-height':l?.height?l.height+'px':'auto','--field-rows':l?.rows??3,'--field-gap':(l?.gap??0)+'px','--field-font':(a?.fontSize??16)+'px','--field-radius':(a?.radius??6)+'px','--field-background':a?.background??'#ffffff','--field-color':a?.color??'#183e30'} as CSSProperties;
 let control:ReactNode;
 if(['content','heading','note','alert','section'].includes(f.type))control=<div className="configured-content"><h4>{f.label}</h4>{f.type!=='heading'&&f.defaultValue!==''&&<p>{String(f.defaultValue)}</p>}</div>;
 else if(f.type==='separator')control=<hr/>;
 else if(f.type==='space')control=<div style={{height:l?.height||30}}/>;
 else if(f.type==='file')control=<>{fileContent??<Input aria-label={f.label} type="file" disabled/>}</>;
 else if(['boolean','consent'].includes(f.type))control=<Tick checked={value===true} onChange={v=>onChange(f,v)} disabled={locked}>{f.label}{f.required&&' *'}</Tick>;
 else if(f.type==='status')control=<Choice label={f.label} value={String(value)||'planned'} onChange={v=>onChange(f,v)} options={Object.entries(states)} disabled={locked}/>;
 else if(f.type==='select')control=<Choice label={f.label} value={String(value)||'__empty'} onChange={v=>onChange(f,v==='__empty'?'':v)} options={[["__empty","اختر قيمة"],...f.options.filter(o=>!f.optionItems?.find(x=>x.value===o)?.disabled||o===value).map(o=>[o,f.optionItems?.find(x=>x.value===o)?.label??o] as [string,string])]} disabled={locked}/>;
 else if(f.type==='searchselect')control=<SearchChoice f={f} value={value} onChange={v=>onChange(f,v)} disabled={locked}/>;
 else if(f.type==='radio')control=<div role="radiogroup" aria-label={f.label}>{f.options.map(o=><label className="tick" key={o}><input type="radio" name={id} checked={o===value} disabled={locked||f.optionItems?.find(x=>x.value===o)?.disabled} onChange={()=>onChange(f,o)}/>{f.optionItems?.find(x=>x.value===o)?.label??o}</label>)}</div>;
 else if(f.type==='multiselect'){let selected:string[]=[];try{selected=JSON.parse(String(value)||'[]');}catch{}control=<div>{f.options.map(o=><Tick key={o} checked={selected.includes(o)} disabled={locked||f.optionItems?.find(x=>x.value===o)?.disabled} onChange={v=>onChange(f,JSON.stringify(v?[...selected,o]:selected.filter(x=>x!==o)))}>{f.optionItems?.find(x=>x.value===o)?.label??o}</Tick>)}</div>;}
 else if(f.type==='table')control=<EditableTable field={f} value={value} onChange={v=>onChange(f,v)} disabled={locked}/>;
 else if(['textarea','json'].includes(f.type))control=<Textarea id={id} value={String(value)} placeholder={f.placeholder} onChange={e=>onChange(f,e.target.value)} required={req} disabled={locked} maxLength={10000} rows={l?.rows??(f.id==='execution.actual'?4:3)} dir={f.type==='json'?'ltr':undefined}/>;
 else if(f.type==='calculated')control=<><Input id={id} value={String(value)} readOnly aria-label={f.label}/>{computed.errors[f.id]&&<span role="alert" className="form-error">{computed.errors[f.id]}</span>}</>;
 else {const numeric=['number','amount','integer','percent','rating','duration'];const type=f.type==='date'?'date':f.type==='time'?'time':f.type==='datetime'?'datetime-local':f.type==='url'?'url':f.type==='email'?'email':f.type==='phone'?'tel':f.type==='range'?'range':numeric.includes(f.type)?'number':'text';control=<><Input id={id} value={String(value)} placeholder={f.placeholder} readOnly={f.type==='user'||f.readOnly} onChange={e=>onChange(f,e.target.value)} required={req&&f.type!=='user'} disabled={locked} type={type} step={f.type==='integer'?'1':numeric.includes(f.type)?'any':undefined} min={f.min||undefined} max={f.max||undefined} maxLength={10000} dir={numeric.includes(f.type)||['url','code'].includes(f.type)?'ltr':undefined}/>{f.type==='range'&&<output>{String(value)}</output>}</>;}
 return <div key={f.id} data-field-id={f.id} className={'dynamic-field custom-field '+(f.printVisible===false?'no-print ':'')+(selected===f.id?'design-selected ':'')} style={style} onClick={onSelect?()=>onSelect(f.id):undefined}>
 {!['boolean','consent','content','heading','note','alert','separator','space','section'].includes(f.type)&&<label htmlFor={id}>{f.label}{f.required&&<span className="required"> *</span>}</label>}{control}{f.help&&<small>{f.help}</small>}</div>;
 }
 const groups:({name:string;fields:FormField[]}|FormField)[]=[];
 for(const f of items){if(!f.section){groups.push(f);continue;}const last=groups.at(-1);if(last&&'name' in last&&last.name===f.section)last.fields.push(f);else groups.push({name:f.section,fields:[f]});}
 return <div className="configured-fields">{groups.map((item,i)=>'name' in item?<details className="dynamic-section" key={'section-'+i} open><summary>{item.name}</summary><div className="configured-fields">{item.fields.map(render)}</div></details>:render(item))}</div>;
}
