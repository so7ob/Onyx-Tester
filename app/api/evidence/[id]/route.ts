import {db,bucket} from '../../../../lib/server/db';
import {unavailable} from '../../../../lib/server/errors';
import {authorize,testSystem} from '../../../../lib/server/auth';
export async function GET(request:Request,context:{params:Promise<{id:string}>}){try{await authorize(request);const {id}=await context.params;
 const meta=await db().prepare('SELECT name,test_id AS testId FROM evidence WHERE id=?').bind(id).first<{name:string;testId:string}>();if(!meta)return new Response('الدليل غير موجود',{status:404});await authorize(request,'view',testSystem(meta.testId));
 const obj=await bucket().get(id);if(!obj)return new Response('الدليل غير متاح',{status:404});
 return new Response(obj.body,{headers:{'Content-Type':'application/octet-stream','Content-Disposition':"attachment; filename*=UTF-8''"+encodeURIComponent(meta.name),'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
 }catch(e){return unavailable(e);}}
