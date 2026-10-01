import {advancedTypes,validateAdvancedValue} from './advanced-model';
import {plan,testMap} from './model';
export const permissionLabels={view:'عرض النتائج والأدلة',execute:'تنفيذ الاختبارات وإرفاق الأدلة',design:'تعديل نماذج الاختبارات',publish:'نشر نماذج الاختبارات',review:'مراجعة النتائج واعتمادها',prepare:'تهيئة بيانات الاختبارات',manageUsers:'إدارة المستخدمين والصلاحيات'} as const;
export type Permission=keyof typeof permissionLabels;
export type Permissions=Record<Permission,boolean>;
export const roleLabels={admin:'مدير النظام',designer:'مصمم النماذج',preparer:'مسؤول تهيئة البيانات',tester:'منفذ اختبارات',viewer:'مشاهد'} as const;
export type Role=keyof typeof roleLabels;
export function rolePermissions(role:Role):Permissions{return {view:true,execute:role==='admin'||role==='tester',design:role==='admin'||role==='designer',publish:role==='admin',review:role==='admin',prepare:role==='admin'||role==='preparer',manageUsers:role==='admin'};}
export type AppUser={id:string;email:string;name:string;role:Role;permissions:Permissions;systems:string[];active:boolean;version:number;updatedAt:string;bound?:boolean;owner?:boolean;identityId?:string};
export function can(user:AppUser,p:Permission,system?:string){return user.active&&user.permissions[p]&&(!system||user.systems.includes(system));}
const text=(v:unknown,label:string,max=1000)=>{if(typeof v!=='string'||v.length>max)throw new Error('راجع '+label+'.');return v.trim();};
export function version(v:unknown){if(!Number.isInteger(v)||Number(v)<0)throw new Error('نسخة البيانات غير صحيحة.');return Number(v);}
export function validateUser(value:unknown,ownerEmail:string):AppUser {
 const v=value as AppUser;if(!v||typeof v!=='object')throw new Error('بيانات المستخدم غير صحيحة.');
 const email=text(v.email,'البريد الإلكتروني',254).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('أدخل بريداً إلكترونياً صحيحاً.');if(email===ownerEmail.toLowerCase())throw new Error('صلاحيات مالك الموقع ثابتة ولا يمكن تعديلها.');
 const name=text(v.name,'اسم المستخدم',200);if(!name)throw new Error('اسم المستخدم مطلوب.');
 if(!Object.hasOwn(roleLabels,v.role))throw new Error('اختر دوراً صحيحاً.');
 const permissions={} as Permissions;for(const p of Object.keys(permissionLabels) as Permission[]){if(typeof v.permissions?.[p]!=='boolean')throw new Error('راجع الصلاحيات.');permissions[p]=v.permissions[p];}if(!permissions.view)throw new Error('صلاحية العرض مطلوبة لكل مستخدم.');
 if(!Array.isArray(v.systems)||!v.systems.length||v.systems.length>plan.systems.length||v.systems.some(s=>!plan.systems.includes(s)))throw new Error('حدد أنظمة صحيحة للمستخدم.');const systems=[...new Set(v.systems)];
 if(permissions.manageUsers&&(v.role!=='admin'||systems.length!==plan.systems.length))throw new Error('إدارة المستخدمين تتطلب دور مدير النظام والوصول إلى جميع الأنظمة.');
 if(typeof v.active!=='boolean')throw new Error('حالة المستخدم غير صحيحة.');
 const id=text(v.id??'','معرف المستخدم',60);if(id&&!uuid.test(id))throw new Error('معرف المستخدم غير صحيح.');
 return {id,email,name,role:v.role,permissions,systems,active:v.active,version:version(v.version),updatedAt:''};
}
export const fieldTypes={...advancedTypes,text:'نص قصير',textarea:'نص متعدد الأسطر',number:'رقم',amount:'مبلغ عشري',date:'تاريخ',select:'قائمة خيارات',boolean:'مربع اختيار',heading:'عنوان قسم',note:'نص إرشادي',url:'رابط'} as const;
export type FieldType=keyof typeof fieldTypes;
export type FieldValue=string|boolean;
export type Values=Record<string,FieldValue>;
export type CustomField={id:string;label:string;type:FieldType;group:'execution'|'preparation';help:string;placeholder:string;required:boolean;wide:boolean;active:boolean;options:string[];defaultValue:FieldValue;min:string;max:string};
export type ScreenForm={screenId:string;fields:CustomField[];version:number;updatedAt:string};
export type TestData={testId:string;party:string;amount:string;currency:string;documentNumber:string;date:string;branch:string;notes:string;customValues:Values;ready:boolean;version:number;updatedAt:string};
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const decimal=/^-?\d{1,18}(?:\.\d{1,8})?$/;
export function validateForm(value:unknown):ScreenForm {
 const v=value as ScreenForm;if(!v||!plan.screens.some(s=>s.id===v.screenId))throw new Error('اختر شاشة موثقة من الخطة.');
 if(!Array.isArray(v.fields)||v.fields.length>50)throw new Error('الحد الأقصى ٥٠ حقلاً لكل شاشة.');
 const seen=new Set<string>();const fields=v.fields.map(f=>{
  if(!f||!uuid.test(f.id)||seen.has(f.id))throw new Error('معرفات الحقول غير صحيحة أو مكررة.');seen.add(f.id);
  if(!Object.hasOwn(fieldTypes,f.type)||!['execution','preparation'].includes(f.group))throw new Error('نوع الحقل أو موضعه غير صحيح.');
  const label=text(f.label,'عنوان الحقل',120);if(!label)throw new Error('عنوان كل حقل مطلوب.');
  for(const key of ['required','wide','active'] as const)if(typeof f[key]!=='boolean')throw new Error('خصائص الحقل غير صحيحة.');
  if(!Array.isArray(f.options)||f.options.length>50)throw new Error('الحد الأقصى ٥٠ خياراً.');const options=f.options.map(o=>text(o,'خيار القائمة',150));if(new Set(options).size!==options.length||options.some(o=>!o||o==='__empty'))throw new Error('أدخل خيارات غير فارغة وغير مكررة.');if(f.type==='select'&&!options.length)throw new Error('أضف خيارات إلى حقل القائمة.');
  const min=text(f.min,'الحد الأدنى',40),max=text(f.max,'الحد الأعلى',40);if([min,max].some(n=>n&&!decimal.test(n)))throw new Error('حدود الأرقام غير صحيحة.');if(min&&max&&Number(min)>Number(max))throw new Error('الحد الأدنى أكبر من الحد الأعلى.');
  const result:CustomField={id:f.id,label,type:f.type,group:f.group,help:text(f.help,'وصف الحقل',1000),placeholder:text(f.placeholder,'النص التوضيحي',200),required:f.required,wide:f.wide,active:f.active,options,defaultValue:f.type==='boolean'?f.defaultValue===true:text(f.defaultValue,'القيمة الافتراضية',2000),min,max};
  validateFieldValue(result,result.defaultValue,false);return result;
 });return {screenId:v.screenId,fields,version:version(v.version),updatedAt:''};
}
export function validateFieldValue(f:CustomField,value:FieldValue,required:boolean){
 if(Object.hasOwn(advancedTypes,f.type)){validateAdvancedValue(f,value,required);return;}
 if(['heading','note'].includes(f.type))return;
 const empty=value==='';if(required&&f.required&&empty)throw new Error('الحقل «'+f.label+'» مطلوب.');
 if(f.type==='boolean'){if(typeof value!=='boolean')throw new Error('قيمة «'+f.label+'» غير صحيحة.');return;}
 if(typeof value!=='string'||value.length>10000)throw new Error('راجع قيمة «'+f.label+'».');if(value==='')return;
 if(f.type==='number'||f.type==='amount'){if(!decimal.test(value)||!Number.isFinite(Number(value)))throw new Error('أدخل رقماً صحيحاً في «'+f.label+'».');if(f.min&&Number(value)<Number(f.min)||f.max&&Number(value)>Number(f.max))throw new Error('قيمة «'+f.label+'» خارج الحدود المحددة.');}
 if(f.type==='url'&&value){let u:URL;try{u=new URL(value);}catch{throw new Error('أدخل رابطاً صحيحاً في «'+f.label+'».');}if(!['http:','https:'].includes(u.protocol))throw new Error('رابط الحقل غير مسموح.');}
 if(f.type==='date'&&!validDate(value))throw new Error('أدخل تاريخاً صحيحاً في «'+f.label+'».');
 if(['select','radio','searchselect'].includes(f.type)&&!f.options.includes(value))throw new Error('اختر قيمة صحيحة في «'+f.label+'».');
}
function validDate(value:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const date=new Date(value+'T00:00:00Z');return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;}
export function validateValues(input:unknown,fields:CustomField[],group:CustomField['group'],required:boolean):Values {
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('قيم الحقول غير صحيحة.');const values:Values={};
 const entries=Object.entries(input);if(entries.length>200)throw new Error('عدد قيم الحقول يتجاوز الحد.');
 for(const [id,value] of entries){if(!uuid.test(id)||(typeof value!=='string'&&typeof value!=='boolean')||typeof value==='string'&&value.length>10000)throw new Error('قيم الحقول غير صحيحة.');values[id]=typeof value==='string'?value.trim():value;}
 // Unknown/hidden field values are retained as historical data. Active fields are validated.
 for(const f of fields.filter(f=>f.active&&f.group===group&&!['heading','note'].includes(f.type))){const value=values[f.id]??f.defaultValue;validateFieldValue(f,value,required);values[f.id]=value;}
 return values;
}
export function emptyTestData(testId:string):TestData{return {testId,party:'',amount:'',currency:'',documentNumber:'',date:'',branch:'',notes:'',customValues:{},ready:false,version:0,updatedAt:''};}
export function validateTestData(value:unknown,fields:CustomField[]):TestData {
 const v=value as TestData;if(!v||!testMap.has(v.testId))throw new Error('اختر اختباراً موثقاً.');const result=emptyTestData(v.testId);
 for(const key of ['party','amount','currency','documentNumber','date','branch','notes'] as const)result[key]=text(v[key],key==='notes'?'ملاحظات التهيئة':'البيانات الأساسية',key==='notes'?10000:300);
 if(result.amount&&(!decimal.test(result.amount)||Number(result.amount)<0))throw new Error('أدخل مبلغاً غير سالب بصيغة رقمية.');if(result.date&&!validDate(result.date))throw new Error('تاريخ البيانات غير صحيح.');
 if(typeof v.ready!=='boolean')throw new Error('حالة جاهزية البيانات غير صحيحة.');result.ready=v.ready;
 if(v.ready&&(!result.party||result.amount===''||!result.currency))throw new Error('لإعلان الجاهزية أدخل الطرف والمبلغ والعملة.');
 result.customValues=validateValues(v.customValues,fields,'preparation',v.ready);result.version=version(v.version);return result;
}
