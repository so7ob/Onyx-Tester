import {db,checkOrigin,unavailable,checked,ApiError} from '../storage';
import {authorize,getForm,conflict} from '../auth';
import {validateForm} from '../../../lib/domain/admin-model';
import {plan} from '../../../lib/domain/model';
import type {ScreenFormRow} from '../types';
export async function PUT(request:Request){const rejected=checkOrigin(request);if(rejected)return rejected;try{await authorize(request,'design');const body=await request.json();const value=checked(()=>validateForm(body));const screen=plan.screens.find(s=>s.id===value.screenId)!;await authorize(request,'design',screen.system);
 const old=await getForm(screen.id);
 // Field identities and value types remain stable; hide a field to retain historical inputs.
 for(const f of old.fields){const next=value.fields.find(n=>n.id===f.id);if(!next)throw new ApiError('أخفِ الحقول المحفوظة بدلاً من حذفها للحفاظ على مدخلاتها.');if(next.type!==f.type||next.group!==f.group)throw new ApiError('نوع وموضع الحقل المحفوظ ثابتان. أخفه ثم أضف حقلاً جديداً.');}
 const row=await db().prepare('INSERT INTO screen_forms (screen_id,fields,version,updated_at) SELECT ?,?,1,? WHERE ?=0 OR EXISTS (SELECT 1 FROM screen_forms WHERE screen_id=?) ON CONFLICT(screen_id) DO UPDATE SET fields=excluded.fields,version=screen_forms.version+1,updated_at=excluded.updated_at WHERE screen_forms.version=? RETURNING screen_id AS screenId,fields,version,updated_at AS updatedAt').bind(value.screenId,JSON.stringify(value.fields),new Date().toISOString(),value.version,value.screenId,value.version).first<ScreenFormRow>();if(!row)conflict();return Response.json({form:{...row,fields:JSON.parse(row.fields)}},{headers:{'Cache-Control':'private, no-store'}});
 }catch(e){return unavailable(e);}}
