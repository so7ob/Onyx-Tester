import {env} from 'cloudflare:workers';
export function db(){if(!env.DB)throw new Error('تعذر الاتصال بسجل الاختبارات.');return env.DB;}
export function bucket(){if(!env.BUCKET)throw new Error('تعذر الاتصال بمرفقات الأدلة.');return env.BUCKET;}
export class ApiError extends Error{constructor(message:string,public status=400){super(message);}}
export function checked<T>(fn:()=>T):T{try{return fn();}catch(e){throw new ApiError(e instanceof Error?e.message:'بيانات غير صحيحة.');}}
export function checkOrigin(request:Request){const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'الطلب غير مسموح.'},{status:403});return null;}
export function unavailable(error:unknown){if(error instanceof ApiError)return Response.json({error:error.message},{status:error.status,headers:{'Cache-Control':'private, no-store'}});console.error('ONYX storage operation failed',error);return Response.json({error:'تعذر تحميل أو حفظ البيانات. بقيت المدخلات في النموذج؛ أعد المحاولة.'},{status:503});}
