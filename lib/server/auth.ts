import {env} from 'cloudflare:workers';
import {plan,testMap} from '../domain/model';
import {can,rolePermissions,type AppUser,type Permission,type Role,type ScreenForm} from '../domain/admin-model';
import {resolveTestForm,type TestForm} from '../domain/editor-model';
import {ApiError} from './errors';
import {db} from './db';
import type {AppUserRow,ScreenFormRow,TestFormRow} from './rows';
export function ownerEmail(){return env.ONYX_OWNER_EMAIL?.trim().toLowerCase()||(__ONYX_LOCAL_PREVIEW__?'preview-owner@sites.test':'');}
export function ownerProfile(email:string,name=email,identityId?:string):AppUser{return {id:'owner',email,name,identityId,role:'admin',permissions:rolePermissions('admin'),systems:plan.systems,active:true,version:0,updatedAt:'',bound:true,owner:true};}
export function userRow(row:AppUserRow):AppUser{return {id:row.id,email:row.email,name:row.name,role:row.role as Role,permissions:{publish:false,review:false,...JSON.parse(row.permissions)},systems:JSON.parse(row.systems),active:!!row.active,version:row.version,updatedAt:row.updated_at,bound:!!row.user_id,identityId:row.user_id??undefined};}
export async function authorize(request:Request,permission:Permission='view',system?:string):Promise<AppUser>{
 // Dispatch authenticates and replaces these headers. Preview identity is compiled out of production builds.
 let userId=request.headers.get('oai-authenticated-user-id'),email=request.headers.get('oai-authenticated-user-email')?.toLowerCase();
 if(__ONYX_LOCAL_PREVIEW__&&!userId&&['terminal.local','localhost','127.0.0.1'].includes(new URL(request.url).hostname)){userId='local-preview-owner';email=ownerEmail();}
 if(!userId||!email)throw new ApiError('سجّل الدخول بحسابك للوصول إلى الأداة.',401);
 const owner=ownerEmail();if(!owner)throw new ApiError('لم تكتمل تهيئة مالك الموقع.',503);
 let profile:AppUser;
 if(email===owner){
  await db().prepare("INSERT OR IGNORE INTO site_owner (id,user_id,email,created_at) VALUES ('owner',?,?,?)").bind(userId,owner,new Date().toISOString()).run();
  const binding=await db().prepare("SELECT user_id,name FROM site_owner WHERE id='owner'").first<{user_id:string;name:string}>();
  if(binding?.user_id!==userId)throw new ApiError('هوية الحساب لا تطابق مالك الموقع المسجل.',403);let name='';if(request.headers.get('oai-authenticated-user-full-name-encoding')==='percent-encoded-utf-8')try{name=decodeURIComponent(request.headers.get('oai-authenticated-user-full-name')??'');}catch{}name=name.trim().slice(0,200);if(__ONYX_LOCAL_PREVIEW__&&userId==='local-preview-owner')name='مستخدم المعاينة';if(name&&name!==binding.name)await db().prepare("UPDATE site_owner SET name=? WHERE id='owner'").bind(name).run();profile=ownerProfile(owner,name||binding.name||owner,userId);
 }else{
  let row=await db().prepare('SELECT * FROM app_users WHERE email=?').bind(email).first<AppUserRow>();
  if(!row||!row.active||row.user_id&&row.user_id!==userId)throw new ApiError('لا توجد صلاحيات فعالة لهذا الحساب.',403);
  if(!row.user_id){await db().prepare('UPDATE app_users SET user_id=? WHERE id=? AND user_id IS NULL').bind(userId,row.id).run();row=await db().prepare('SELECT * FROM app_users WHERE id=?').bind(row.id).first<AppUserRow>();}
  if(!row||row.user_id!==userId||!row.active)throw new ApiError('لا توجد صلاحيات فعالة لهذا الحساب.',403);profile=userRow(row);
 }
 if(profile.role==='admin'){profile.permissions.publish??=true;profile.permissions.review??=true;}if(!can(profile,permission,system))throw new ApiError('لا تملك صلاحية تنفيذ هذا الإجراء ضمن هذا النظام.',403);return profile;
}
export function testSystem(id:string){const test=testMap.get(id);if(!test)throw new ApiError('الاختبار غير موجود.',404);return test.system;}
export function screenForTest(id:string){const screen=plan.screens.find(s=>s.testIds.includes(id));if(!screen)throw new ApiError('الاختبار غير موجود.',404);return screen;}
export async function getForm(screenId:string):Promise<ScreenForm>{const row=await db().prepare('SELECT screen_id AS screenId,fields,version,updated_at AS updatedAt FROM screen_forms WHERE screen_id=?').bind(screenId).first<ScreenFormRow>();return row?{...row,fields:JSON.parse(row.fields)}:{screenId,fields:[],version:0,updatedAt:''};}
export function conflict():never{throw new ApiError('حُدّثت هذه البيانات في نافذة أخرى. أعد تحميلها وراجع تعديلاتك قبل الحفظ.',409);}

export function testFormRow(row:TestFormRow):TestForm{return {...row,fields:JSON.parse(row.fields),origin:'test'};}
export const formSelect='test_id AS testId,screen_id AS screenId,fields,version,base_version AS baseVersion,updated_at AS updatedAt,updated_by AS updatedBy';
export async function getTestForm(testId:string):Promise<TestForm>{const row=await db().prepare('SELECT '+formSelect+' FROM test_forms WHERE test_id=?').bind(testId).first<TestFormRow>();return row?testFormRow(row):resolveTestForm(testId,await getForm(screenForTest(testId).id));}

export async function getPublishedForm(testId:string):Promise<TestForm>{
 const row=await db().prepare('SELECT snapshot FROM published_forms WHERE test_id=?').bind(testId).first<{snapshot:string}>();
 return row?JSON.parse(row.snapshot):resolveTestForm(testId,await getForm(screenForTest(testId).id));
}
