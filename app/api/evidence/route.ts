import {db,bucket,checkOrigin,unavailable,ApiError} from '../storage';
import {testMap} from '../../../lib/domain/model';
import {authorize,testSystem} from '../auth';
export async function POST(request:Request){const rejected=checkOrigin(request);if(rejected)return rejected;
 try{await authorize(request,'execute');const form=await request.formData();const testId=String(form.get('testId')??'');const file=form.get('file');await authorize(request,'execute',testSystem(testId));
 if(!testMap.has(testId)||!(file instanceof File)||!file.size||file.size>10*1024*1024)return Response.json({error:'اختر ملفاً غير فارغ لا يتجاوز 10 ميجابايت لاختبار موثق.'},{status:400});
 const current=await db().prepare('SELECT run_id AS runId,approved_at AS approvedAt FROM results WHERE id=?').bind(testId).first<{runId:string;approvedAt:string}>();if(current?.approvedAt)throw new ApiError('النتيجة معتمدة ولا تقبل مرفقات جديدة.');const runId=current?.runId??'';
 const id=crypto.randomUUID();const name=file.name.replace(/[\x00-\x1f]/g,'').slice(0,200)||'دليل';
 await bucket().put(id,await file.arrayBuffer(),{httpMetadata:{contentType:'application/octet-stream'}});
 try{await db().prepare('INSERT INTO evidence (id,test_id,run_id,name,size,created_at) VALUES (?,?,?,?,?,?)').bind(id,testId,runId,name,file.size,new Date().toISOString()).run();}catch(e){await bucket().delete(id);throw e;}
 return Response.json({evidence:{id,testId,runId,name,size:file.size}},{status:201});
 }catch(e){return unavailable(e);}}
