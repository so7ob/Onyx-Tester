export type WorkspaceLocation={view:string;testId:string;execute:boolean};
export function readWorkspaceLocation(search:string,allowedIds:string[]):WorkspaceLocation{
 const params=new URLSearchParams(search),id=params.get('test')??'',view=params.get('view')??'plan';
 return {view:['plan','builder','prepare','users'].includes(view)?view:'plan',testId:allowedIds.includes(id)?id:allowedIds[0]??'',execute:allowedIds.includes(id)&&params.get('mode')==='execute'};
}
export function writeWorkspaceLocation(location:WorkspaceLocation){const params=new URLSearchParams();params.set('view',location.view);if(location.testId)params.set('test',location.testId);if(location.execute)params.set('mode','execute');return '?'+params.toString();}
