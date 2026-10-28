import {baseFields,isReadOnlyValue,validateTestForm,type FormField,type TestForm} from './editor-model';
import {testMap} from './model';

// Templates carry definitions only. The destination owns its identity, revision
// guards and source reference; every custom field becomes an independent copy.
export function instantiateTemplate(input:unknown,target:TestForm,newId:()=>string=()=>crypto.randomUUID()):TestForm{
 if(!input||typeof input!=='object'||!('schemaVersion' in input)||input.schemaVersion!==1||!('fields' in input)||!Array.isArray(input.fields))throw new Error('صيغة القالب غير صحيحة.');
 const sourceIds=new Set<string>();
 for(const field of input.fields){
  if(!field||typeof field!=='object'||typeof field.id!=='string'||sourceIds.has(field.id))throw new Error('معرفات حقول القالب غير صحيحة أو مكررة.');
  sourceIds.add(field.id);
 }
 const test=testMap.get(target.testId);
 if(!test)throw new Error('اختر اختباراً موثقاً من الخطة.');
 const defaults=baseFields(test);
 // Validate source IDs and definitions before remapping, so malformed custom
 // identities cannot become valid just by receiving a newly generated UUID.
 const fields=input.fields.map((field:FormField)=>{
  const builtin=defaults.find(f=>f.id===field.id);
  return builtin&&isReadOnlyValue(builtin)?{...field,defaultValue:builtin.defaultValue}:field;
 });
 const validated=validateTestForm({...target,fields});
 const ids=new Map(validated.fields.filter(f=>f.kind==='custom').map(f=>[f.id,newId()]));
 const remap=(id:string)=>ids.get(id)??id;
 return validateTestForm({...target,fields:validated.fields.map(f=>({...f,
  id:remap(f.id),
  ...(f.condition?{condition:{...f.condition,fieldId:remap(f.condition.fieldId)}}:{}),
  ...(f.formula!==undefined?{formula:f.formula.replace(/\[([^\]]+)\]/g,(_,id:string)=>'['+remap(id)+']')}:{}),
  ...(f.preparationSource?{preparationSource:remap(f.preparationSource)}:{}),
 }))});
}
