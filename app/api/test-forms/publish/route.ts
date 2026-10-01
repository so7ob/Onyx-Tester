import {authorize,testSystem,getTestForm,conflict} from '../../../../lib/server/auth';
import {db} from '../../../../lib/server/db';
import {checkOrigin,unavailable,ApiError,checked} from '../../../../lib/server/errors';
import {validateTestForm} from '../../../../lib/domain/editor-model';
export async function POST(request:Request){const rejected=checkOrigin(request);if(rejected)return rejected;try{
 const body=await request.json() as {testId:string;version:number};const actor=await authorize(request,'publish',testSystem(body.testId));
 const current=await getTestForm(body.testId);if(!current.version)throw new ApiError('احفظ مسودة النموذج أولاً.');if(current.version!==body.version)conflict();checked(()=>validateTestForm(current));
 const snapshot=JSON.stringify({...current,publishedVersion:current.version});
 const row=await db().prepare('INSERT INTO published_forms (test_id,version,snapshot,published_at,actor_id) SELECT test_id,version,?,?,? FROM test_forms WHERE test_id=? AND version=? ON CONFLICT(test_id) DO UPDATE SET version=excluded.version,snapshot=excluded.snapshot,published_at=excluded.published_at,actor_id=excluded.actor_id RETURNING version').bind(snapshot,new Date().toISOString(),actor.identityId||actor.id,body.testId,body.version).first();if(!row)conflict();
 return Response.json({form:JSON.parse(snapshot)},{headers:{'Cache-Control':'private, no-store'}});
 }catch(e){return unavailable(e);}}
