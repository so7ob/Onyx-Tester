"use client";
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter} from '@/components/ui/dialog';
import {Table,TableHeader,TableBody,TableRow,TableHead,TableCell} from '@/components/ui/table';
import type {FieldValue} from '../lib/domain/admin-model';
import {defaultChanges,type DefaultChange,type TestForm} from '../lib/domain/editor-model';
const display=(v:FieldValue|undefined)=>v===undefined||v===''?'فارغ':typeof v==='boolean'?v?'نعم':'لا':v;
export function FormVersion({form}:{form:TestForm}){return <p className="form-version">{form.version?'إصدار النموذج '+form.version:form.origin==='screen'?'إعدادات الشاشة السابقة':'النموذج الأساسي'}{form.updatedAt?' · '+new Date(form.updatedAt).toLocaleString('ar-YE',{timeZone:'Asia/Aden'}):''}</p>;}
export function ApplyFormDefaults({form,group,values,onApply,disabled}:{form:TestForm;group:'execution'|'preparation';values:Record<string,FieldValue>;onApply:(changes:DefaultChange[])=>void;disabled:boolean}){
 const [open,setOpen]=useState(false),changes=defaultChanges(form,group,values);
 return <div className="defaults-action"><Button type="button" variant="outline" disabled={disabled||!changes.length} onClick={()=>setOpen(true)}>تطبيق قيم النموذج</Button><span className="muted">القيم المحفوظة تبقى حتى تطبّق القيم الجديدة وتحفظها.</span><Dialog open={open} onOpenChange={setOpen}><DialogContent dir="rtl" className="form-history"><DialogHeader><DialogTitle>مراجعة قيم النموذج</DialogTitle><DialogDescription>{form.testId} · ستُطبّق القيم التالية على المسودة. احفظ {group==='preparation'?'بيانات التهيئة':'نتيجة الاختبار'} لتثبيتها.</DialogDescription></DialogHeader><div className="defaults-review"><Table><TableHeader><TableRow><TableHead>الحقل</TableHead><TableHead>القيمة الحالية</TableHead><TableHead>القيمة الجديدة</TableHead></TableRow></TableHeader><TableBody>{changes.map(c=><TableRow key={c.field.id}><TableCell>{c.field.label}</TableCell><TableCell>{display(c.before)}</TableCell><TableCell>{display(c.after)}</TableCell></TableRow>)}</TableBody></Table></div><DialogFooter><Button type="button" variant="outline" onClick={()=>setOpen(false)}>إلغاء</Button><Button type="button" onClick={()=>{onApply(changes);setOpen(false);}}>تطبيق على المسودة</Button></DialogFooter></DialogContent></Dialog></div>;
}
