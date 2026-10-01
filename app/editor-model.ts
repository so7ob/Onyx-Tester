import {validateExtras,assertDependencies,computedValues,effectiveField,type ExtraProperties} from './advanced-model';
import {plan,states,priorityLabels,testMap,validateResult,type TestCase,type Result} from './model';
import {fieldTypes,validateFieldValue,validateValues,validateTestData,version,type CustomField,type FieldValue,type ScreenForm,type TestData,type AppUser} from './admin-model';
export const groupLabels={instructions:'تعليمات الاختبار',execution:'نموذج التنفيذ',preparation:'بيانات التهيئة'} as const;
export type FormGroup=keyof typeof groupLabels;
export const editorTypes={...fieldTypes,content:'محتوى الاختبار',status:'حالة التنفيذ',user:'المستخدم المسجل',file:'مرفقات الأدلة'} as const;
export type FormField=ExtraProperties & Omit<CustomField,'type'|'group'> & {kind:'builtin'|'custom';key?:string;type:keyof typeof editorTypes;group:FormGroup};
export type TestForm={testId:string;screenId:string;fields:FormField[];publishedVersion?:number;version:number;updatedAt:string;updatedBy:string;baseVersion:number;origin:'test'|'screen'|'default'};
export type FormRevision={version:number;createdAt:string;actorName:string;snapshot:TestForm};
const locked=['execution.status','execution.actual','preparation.ready'];
export const isLockedVisible=(f:FormField)=>locked.includes(f.id);
export const isReadOnlyValue=(f:FormField)=>['execution.tester','execution.file','instructions.reference'].includes(f.id);
function field(group:FormGroup,key:string,label:string,type:FormField['type'],value:FieldValue='',props:Partial<FormField>={}):FormField{return {id:group+'.'+key,kind:'builtin',key,label,type,group,help:'',placeholder:'',required:false,wide:false,active:true,options:[],defaultValue:value,min:'',max:'',...props};}
export function baseFields(t:TestCase):FormField[]{return [
 field('instructions','scenario','سيناريو الاختبار','content',t.scenario,{wide:true}),
 field('instructions','operation','العملية','content',t.operation,{active:false}),
 field('instructions','procedure','المطلوب تنفيذه','content',t.procedure,{wide:true}),
 field('instructions','expected','النتيجة المتوقعة','content',t.expected,{wide:true}),
 field('instructions','prerequisites','المتطلبات السابقة','content',t.prerequisites,{wide:true}),
 field('instructions','impact','الأثر المالي أو المحاسبي','content',t.impact,{wide:true,active:false}),
 field('instructions','related','الأنظمة المرتبطة','content',t.related,{wide:true,active:false}),
 field('instructions','priority','الأولوية','content',priorityLabels[t.priority]??t.priority,{active:false}),
 field('instructions','order','ترتيب التنفيذ','content',t.order,{active:false}),
 field('instructions','reference','مرجع الاختبار','content',t.source.file+'\nالورقة: '+t.source.sheet+' · الصف: '+t.source.row,{wide:true,active:false}),
 field('execution','status','حالة التنفيذ','status','planned',{required:true}),
 field('execution','tester','اسم المختبر','user','',{help:'يُسجّل تلقائياً من المستخدم المسجل دخوله عند حفظ النتيجة.'}),
 field('execution','actual','النتيجة الفعلية','textarea','',{required:true,wide:true,placeholder:'دوّن ما حدث فعلياً والقيم أو المراجع التي تحققت منها…'}),
 field('execution','notes','الملاحظات','textarea','',{wide:true,placeholder:'تفاصيل الاختلاف أو سبب التعثر وما يلزم لإعادة الاختبار'}),
 field('execution','documentNumber','رقم الوثيقة المنشأة','text','',{placeholder:'رقم الوثيقة الناتجة عن التنفيذ'}),
 field('execution','linkedDocumentNumber','رقم الوثيقة المرتبطة','text','',{placeholder:'رقم الوثيقة التي يرتبط بها التنفيذ'}),
 field('execution','evidenceUrl','رابط الدليل','url','',{wide:true,placeholder:'https://…'}),
 field('execution','file','إرفاق الأدلة','file','',{wide:true,help:'حتى ١٠ ميجابايت للملف · يُحفظ عند اختياره'}),
 field('preparation','party','الطرف','text','',{required:true,wide:true,placeholder:'اسم أو رقم الطرف الذي سيُستخدم في الاختبار'}),
 field('preparation','amount','المبلغ','amount','',{required:true,min:'0',placeholder:'0.00'}),
 field('preparation','currency','العملة','text','',{required:true,placeholder:'اسم أو رمز العملة المعتمدة في النظام'}),
 field('preparation','documentNumber','رقم الوثيقة المرجعية','text','',{placeholder:'وثيقة موجودة سيعتمد عليها الاختبار'}),
 field('preparation','date','تاريخ التنفيذ أو الوثيقة','date'),
 field('preparation','branch','الفرع أو الموقع','text'),
 field('preparation','notes','تعليمات وملاحظات التهيئة','textarea','',{wide:true}),
 field('preparation','ready','البيانات جاهزة لتنفيذ الاختبار','boolean',false,{wide:true,help:'يمكن حفظ المسودة أولاً. إعلان الجاهزية يتطلب استكمال الحقول الظاهرة المطلوبة.'})
 ];}
export function resolveTestForm(testId:string,screenForm?:ScreenForm,stored?:TestForm):TestForm{if(stored)return stored;const t=testMap.get(testId);if(!t)throw new Error('الاختبار غير موجود.');const s=plan.screens.find(s=>s.testIds.includes(testId))!;return {testId,screenId:s.id,fields:[...baseFields(t),...(screenForm?.fields??[]).map(f=>({...f,kind:'custom' as const}))],version:0,updatedAt:screenForm?.updatedAt??'',updatedBy:'',baseVersion:screenForm?.version??0,origin:screenForm?.fields.length?'screen':'default'};}
export function allowedTypes(f:FormField):[string,string][]{
 let keys:string[];
 if(f.kind==='custom')keys=f.group==='instructions'?['heading','note','separator','space','alert','section']:Object.keys(fieldTypes);
 else if(f.group==='instructions')keys=['content'];
 else if(f.id==='execution.actual'||f.id==='execution.notes'||f.id==='preparation.notes')keys=['textarea','text'];
 else if(['preparation.party','preparation.currency','preparation.branch','preparation.documentNumber','execution.documentNumber','execution.linkedDocumentNumber'].includes(f.id))keys=['text','select'];
 else if(f.id==='preparation.amount')keys=['amount','number'];
 else keys=[f.type];
 return keys.map(k=>[k,editorTypes[k as keyof typeof editorTypes]]);
}
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
function str(value:unknown,max:number,label:string){if(typeof value!=='string'||value.length>max)throw new Error('راجع '+label+'.');return value.trim();}
export function validateTestForm(input:unknown):TestForm {
 const v=input as TestForm,t=v&&testMap.get(v.testId);if(!t)throw new Error('اختر اختباراً موثقاً من الخطة.');const s=plan.screens.find(s=>s.testIds.includes(t.id))!;if(v.screenId!==s.id)throw new Error('الاختبار لا يتبع الشاشة المحددة.');
 if(!Array.isArray(v.fields)||v.fields.length>140)throw new Error('الحد الأقصى ١٠٠ حقل مخصص لكل اختبار.');
 const defs=baseFields(t),seen=new Set<string>(),ids=new Set(v.fields.map(f=>f.id));let customCount=0;
 const fields=v.fields.map(f=>{
  if(!f||typeof f.id!=='string'||seen.has(f.id))throw new Error('معرفات الحقول غير صحيحة أو مكررة.');seen.add(f.id);
  const def=defs.find(d=>d.id===f.id);if(def){if(f.kind!=='builtin'||f.key!==def.key||f.group!==def.group)throw new Error('هوية الحقل الأساسي وموضعه ثابتان.');if(!allowedTypes(def).some(([key])=>key===f.type))throw new Error('نوع الحقل «'+def.label+'» غير متوافق مع وظيفته.');if(isLockedVisible(f)&&(!f.active||f.id==='execution.actual'&&!f.required))throw new Error('لا يمكن إخفاء حقل الحالة أو النتيجة الفعلية أو الجاهزية، والنتيجة الفعلية مطلوبة عند حسم الاختبار.');}
  else{if(f.kind!=='custom'||!uuid.test(f.id)||!Object.hasOwn(groupLabels,f.group)||!Object.hasOwn(fieldTypes,f.type)||f.group==='instructions'&&!['heading','note','separator','space','alert','section'].includes(f.type))throw new Error('الحقل المخصص غير صحيح.');customCount++;}
  const label=str(f.label,120,'عنوان الحقل');if(!label)throw new Error('عنوان كل حقل مطلوب.');
  for(const key of ['required','wide','active'] as const)if(typeof f[key]!=='boolean')throw new Error('خصائص الحقل غير صحيحة.');
  if(!Array.isArray(f.options)||f.options.length>100)throw new Error('راجع خيارات القائمة.');const options=f.options.map(o=>str(o,150,'الخيار'));if(options.some(o=>!o||o==='__empty')||new Set(options).size!==options.length)throw new Error('خيارات القائمة فارغة أو مكررة.');if(['select','radio','searchselect','multiselect'].includes(f.type)&&!options.length)throw new Error('أضف خيارات للقائمة «'+label+'».');
  const min=str(f.min,40,'الحد الأدنى'),max=str(f.max,40,'الحد الأعلى');if([min,max].some(n=>n&&!/^-?\d{1,18}(?:\.\d{1,8})?$/.test(n))||min&&max&&Number(min)>Number(max))throw new Error('حدود الأرقام غير صحيحة.');
  if(['boolean','consent'].includes(f.type)&&typeof f.defaultValue!=='boolean')throw new Error('القيمة الافتراضية لمربع الاختيار غير صحيحة.');const defaultValue=['boolean','consent'].includes(f.type)?f.defaultValue===true:str(f.defaultValue,10000,'القيمة الافتراضية');
  if(isReadOnlyValue(f)&&defaultValue!==def?.defaultValue)throw new Error('المستخدم والمرفقات ومرجع المصدر لا تُستبدل بقيمة افتراضية.');
  if(f.type==='status'&&!Object.hasOwn(states,String(defaultValue)))throw new Error('حالة التنفيذ الافتراضية غير صحيحة.');
  const item:FormField={id:f.id,kind:f.kind,...(def?{key:def.key}:{}),group:f.group,type:f.type,label,help:str(f.help,1000,'تعليمات الحقل'),placeholder:str(f.placeholder,300,'النص التوضيحي'),required:f.required,wide:f.wide,active:f.active,options,defaultValue,min,max,...validateExtras(f,ids)};
  if(!['content','status','user','file','heading','note'].includes(item.type))validateFieldValue(item as CustomField,defaultValue,false);
  if(def&&!['content','textarea','status','user','file'].includes(item.type)&&typeof defaultValue==='string'&&defaultValue.length>300)throw new Error('القيمة الافتراضية للحقل «'+label+'» طويلة.');
  return item;
 });if(customCount>100||defs.filter(isLockedVisible).some(d=>!seen.has(d.id)))throw new Error('احتفظ بالحقول الأساسية؛ يمكن إخفاء الحقول غير المطلوبة. الحد الأقصى ١٠٠ حقل مخصص.');
 assertDependencies({...v,fields});
 return {testId:t.id,screenId:s.id,fields,version:version(v.version),baseVersion:version(v.baseVersion??0),updatedAt:'',updatedBy:'',origin:'test'};
}
export function inputCustomFields(form:TestForm):CustomField[]{return form.fields.filter(f=>f.kind==='custom'&&f.group!=='instructions').map(f=>({...f,group:f.group as CustomField['group'],type:f.type as CustomField['type']}));}
export function validateConfiguredResult(input:unknown,form:TestForm):ReturnType<typeof validateResult>{
 const result=validateResult(input);const computed=computedValues(form,resultValues({...result,updatedAt:''},''));if(Object.keys(computed.errors).length)throw new Error(Object.values(computed.errors)[0]);for(const f of form.fields.filter(f=>f.type==='calculated'&&f.group==='execution'))result.customValues[f.id]=computed.values[f.id];form={...form,fields:form.fields.map(f=>effectiveField(f,computed.values))};const required=['passed','failed','blocked'].includes(result.status);result.customValues=validateValues(result.customValues,inputCustomFields(form),'execution',required);
 for(const f of form.fields.filter(f=>f.kind==='builtin'&&f.active&&f.group==='execution'&&!['status','user','file'].includes(f.type)))validateFieldValue(f as CustomField,result[f.key as keyof typeof result] as FieldValue,required);
 return result;
}
export function validateConfiguredData(input:unknown,form:TestForm):TestData {
 const v=input as TestData;if(!v||typeof v!=='object')throw new Error('بيانات التهيئة غير صحيحة.');const computed=computedValues(form,dataValues(v));if(Object.keys(computed.errors).length)throw new Error(Object.values(computed.errors)[0]);const customValues={...v.customValues};for(const f of form.fields.filter(f=>f.type==='calculated'&&f.group==='preparation'))customValues[f.id]=computed.values[f.id];input={...v,customValues};form={...form,fields:form.fields.map(f=>effectiveField(f,computed.values))};if(!v||typeof v.ready!=='boolean')throw new Error('حالة جاهزية البيانات غير صحيحة.');const value=validateTestData({...v,customValues,ready:false},inputCustomFields(form));value.ready=v.ready;value.customValues=validateValues(customValues,inputCustomFields(form),'preparation',v.ready);
 for(const f of form.fields.filter(f=>f.kind==='builtin'&&f.active&&f.group==='preparation'&&f.key!=='ready'))validateFieldValue(f as CustomField,value[f.key as keyof TestData] as FieldValue,v.ready);
 return value;
}
export function initialResult(t:TestCase,user:AppUser,form:TestForm,data?:TestData):Result{const r:Result={id:t.id,status:'planned',actual:'',notes:'',tester:user.name,evidenceUrl:'',documentNumber:'',linkedDocumentNumber:'',customValues:{},version:0,updatedAt:''};for(const f of form.fields.filter(f=>f.group==='execution'&&f.active)){if(f.kind==='custom'&&!['heading','note'].includes(f.type))r.customValues[f.id]=f.preparationSource&&data&&Object.hasOwn(dataValues(data),f.preparationSource)?dataValues(data)[f.preparationSource]:f.defaultValue;else if(f.key&&f.key in r&&f.key!=='tester')(r as unknown as Record<string,FieldValue>)[f.key]=f.preparationSource&&data&&Object.hasOwn(dataValues(data),f.preparationSource)?dataValues(data)[f.preparationSource]:f.defaultValue;}return r;}
export function initialData(testId:string,form:TestForm):TestData{const value:TestData={testId,party:'',amount:'',currency:'',documentNumber:'',date:'',branch:'',notes:'',customValues:{},ready:false,version:0,updatedAt:''};for(const f of form.fields.filter(f=>f.group==='preparation'&&f.active)){if(f.kind==='custom'&&!['heading','note'].includes(f.type))value.customValues[f.id]=f.defaultValue;else if(f.key&&f.key in value)(value as unknown as Record<string,FieldValue>)[f.key]=f.defaultValue;}return value;}
export function resultValues(r:Result,tester:string){return {...r.customValues,...Object.fromEntries(['status','actual','notes','documentNumber','linkedDocumentNumber','evidenceUrl'].map(key=>['execution.'+key,r[key as keyof Result] as FieldValue])),'execution.tester':tester};}
export function dataValues(d:TestData){return {...d.customValues,...Object.fromEntries(['party','amount','currency','documentNumber','date','branch','notes','ready'].map(key=>['preparation.'+key,d[key as keyof TestData] as FieldValue]))};}
export function getContent(form:TestForm,key:string){return form.fields.find(f=>f.id==='instructions.'+key);}
export function restoreRevision(revision:TestForm,current:TestForm):TestForm{const fields=[...revision.fields,...current.fields.filter(f=>!revision.fields.some(r=>r.id===f.id)).map(f=>({...f,active:false}))];return {...current,fields};}

export function preparationIssue(data:TestData|undefined,form:TestForm){if(!data?.ready)return '';try{validateConfiguredData(data,form);return '';}catch(e){return (e as Error).message;}}

export type DefaultChange={field:FormField;before:FieldValue|undefined;after:FieldValue};
// Existing recorded values win. Missing/blank inputs may inherit the current form;
// overwriting nonempty inputs requires a reviewed, explicit draft action.
export function defaultChanges(form:TestForm,group:'execution'|'preparation',values:Record<string,FieldValue>,onlyEmpty=false):DefaultChange[]{
 return form.fields.filter(f=>f.active&&!f.readOnly&&!f.disabled&&f.group===group&&!['content','heading','note','user','file','status','calculated'].includes(f.type)&&f.id!=='preparation.ready').flatMap(field=>{
  const before=values[field.id],after=field.defaultValue;
  if(after===''&&before===undefined||before===after||onlyEmpty&&before!==undefined)return [];
  return [{field,before,after}];
 });
}
export function applyDefaultChanges<T extends Result|TestData>(value:T,changes:DefaultChange[]):T{
 const next={...value,customValues:{...value.customValues}};
 for(const {field,after} of changes){if(field.kind==='custom')next.customValues[field.id]=after;else if(field.key)(next as unknown as Record<string,FieldValue>)[field.key]=after;}
 return next;
}
export function hydrateResult(t:TestCase,user:AppUser,form:TestForm,saved?:Result,data?:TestData):Result{return saved?applyDefaultChanges(saved,defaultChanges(form,'execution',resultValues(saved,user.name),true)):initialResult(t,user,form,data);}
export function hydrateData(testId:string,form:TestForm,saved?:TestData):TestData{return saved?applyDefaultChanges(saved,defaultChanges(form,'preparation',dataValues(saved),true)):initialData(testId,form);}
export function rebasePreview(values:Record<string,FieldValue>,previous:TestForm,next:TestForm){return Object.fromEntries(Object.entries(values).filter(([id])=>{
 const a=previous.fields.find(f=>f.id===id),b=next.fields.find(f=>f.id===id);
 return a&&b&&a.defaultValue===b.defaultValue&&a.type===b.type&&a.group===b.group&&a.active===b.active&&JSON.stringify(a.options)===JSON.stringify(b.options);
}));}
