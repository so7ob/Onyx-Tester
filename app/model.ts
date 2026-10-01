import type {TestForm} from './editor-model';
import raw from './data/plan.json';
import type {AppUser,ScreenForm,TestData,Values} from './admin-model';
export const plan = raw;
export type TestCase = typeof raw.tests[number];
export type Screen = typeof raw.screens[number];
export const states = {planned:'لم ينفذ',in_progress:'قيد التنفيذ',passed:'ناجح',failed:'فاشل',blocked:'متعذر'} as const;
export type Status = keyof typeof states;
export type Result = {formSnapshot?:TestForm;runId?:string;startedAt?:string;approvedAt?:string;approvedBy?:string;id:string;status:Status;actual:string;notes:string;tester:string;testerId?:string;testerEmail?:string;evidenceUrl:string;documentNumber:string;linkedDocumentNumber:string;customValues:Values;version:number;updatedAt:string};
export type Evidence = {runId?:string;id:string;testId:string;name:string;size:number};
export type SavedState = {results:Record<string,Result>;evidence:Evidence[];forms:Record<string,ScreenForm>;testData:Record<string,TestData>;testForms:Record<string,TestForm>;user?:AppUser};
export const priorityLabels:Record<string,string> = {Critical:'حرجة',High:'عالية',Medium:'متوسطة'};
export const testMap = new Map(plan.tests.map(t=>[t.id,t]));
export function summarize(tests:TestCase[],results:Record<string,Result>){
 const counts={planned:0,in_progress:0,passed:0,failed:0,blocked:0};
 for(const t of tests) counts[results[t.id]?.status ?? 'planned']++;
 return {...counts,total:tests.length,completed:counts.passed+counts.failed,stalled:counts.failed+counts.blocked,percent:tests.length?Math.round((counts.passed+counts.failed)*1000/tests.length)/10:0};
}
export function screenStatus(tests:TestCase[],results:Record<string,Result>):Status{
 const s=summarize(tests,results);if(s.failed)return 'failed';if(s.blocked)return 'blocked';if(s.passed===s.total&&s.total)return 'passed';if(s.in_progress||s.passed)return 'in_progress';return 'planned';
}
export function matches(t:TestCase,query:string,result?:Result){
 const normalize=(s:string)=>s.normalize('NFKC').replace(/[\u064B-\u065F]/g,'').toLowerCase();
 return normalize([t.id,t.system,t.screen,t.operation,t.scenario,result?.notes,result?.actual,result?.documentNumber,result?.linkedDocumentNumber].join(' ')).includes(normalize(query.trim()));
}
export function validateResult(value:unknown):Omit<Result,'updatedAt'|'version'> & {version:number}{
 if(!value||typeof value!=='object')throw new Error('بيانات النتيجة غير صحيحة.');
 const v=value as Record<string,unknown>;
 if(typeof v.id!=='string'||!testMap.has(v.id))throw new Error('الاختبار غير موجود في الخطة الموثقة.');
 if(typeof v.status!=='string'||!Object.hasOwn(states,v.status))throw new Error('اختر حالة صحيحة.');
 const result={id:v.id,status:v.status as Status,actual:'',notes:'',tester:'',evidenceUrl:'',documentNumber:'',linkedDocumentNumber:'',customValues:{} as Values,version:0};
 for(const key of ['actual','notes','tester','evidenceUrl'] as const){if(typeof v[key]!=='string'||(v[key] as string).length>10000)throw new Error('راجع النص المدخل.'); result[key]=(v[key] as string).trim();}
 for(const key of ['documentNumber','linkedDocumentNumber'] as const){if(v[key]!==undefined&&(typeof v[key]!=='string'||(v[key] as string).length>300))throw new Error('راجع رقم الوثيقة.');result[key]=((v[key]??'') as string).trim();}
 if(v.customValues!==undefined){if(!v.customValues||typeof v.customValues!=='object'||Array.isArray(v.customValues))throw new Error('قيم الحقول غير صحيحة.');result.customValues=v.customValues as Values;}
 if(!Number.isInteger(v.version)||Number(v.version)<0)throw new Error('نسخة النتيجة غير صحيحة.');result.version=Number(v.version);
 if(['passed','failed','blocked'].includes(result.status)&&!result.actual)throw new Error('دوّن النتيجة الفعلية أو سبب التعذر قبل حفظ هذه الحالة.');
 if(result.evidenceUrl){let u:URL;try{u=new URL(result.evidenceUrl);}catch{throw new Error('أدخل رابط دليل صحيحاً.');}if(!['https:','http:'].includes(u.protocol))throw new Error('يجب أن يبدأ رابط الدليل بـ https أو http.');}
 return result;
}
