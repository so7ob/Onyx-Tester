import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
const hosting=JSON.parse(readFileSync('.openai/hosting.json','utf8'));
assert.equal(hosting.project_id,'appgprj_6abd87c86b04819183fa71a0a95de282');
assert.equal(hosting.d1,'DB'); assert.equal(hosting.r2,'BUCKET');
const pkg=JSON.parse(readFileSync('package.json','utf8')); assert.equal(pkg.packageManager,'pnpm@11.25.0');
assert.ok(readdirSync('drizzle').includes('0005_flaky_raza.sql'));
const auth=readFileSync('lib/server/auth.ts','utf8'); assert.ok(auth.includes('ONYX_OWNER_EMAIL'));
// Domain models live in lib/domain, not in app/ (ADR 0003). The pure domain
// modules must not import React, Workers, or the app/ routes.
for(const f of ['model','admin-model','editor-model','advanced-model','navigation-model','form-export']){
 assert.ok(existsSync('lib/domain/'+f+'.ts'), 'lib/domain/'+f+'.ts missing');
 assert.ok(!existsSync('app/'+f+'.ts'), 'app/'+f+'.ts should have moved to lib/domain/');
}
// Server layer (D1/R2 access, errors, auth, rows, results) lives in lib/server,
// not in app/api (ADR 0003 step 3). Route files import from lib/server, not from
// sibling app/api helpers.
for(const f of ['db','errors','rows','results','auth']){
 assert.ok(existsSync('lib/server/'+f+'.ts'), 'lib/server/'+f+'.ts missing');
 assert.ok(!existsSync('app/api/'+f+'.ts'), 'app/api/'+f+'.ts should have moved to lib/server/');
}
const planData=readFileSync('lib/domain/model.ts','utf8');
assert.ok(!/from ['"]react['"]/.test(planData), 'lib/domain must not import react');
assert.ok(!/cloudflare:workers/.test(planData), 'lib/domain must not import cloudflare:workers');
assert.ok(auth.includes('/domain/'), 'lib/server/auth.ts must import domain types from lib/domain');
const workflow=readFileSync('.github/workflows/verify.yml','utf8'); for(const s of ['pnpm test','pnpm run lint','pnpm run typecheck','pnpm run build']) assert.ok(workflow.includes(s));
assert.ok(!workflow.includes('deploy'));
// Methodology and architecture documentation are present and binding.
const architecture=readFileSync('docs/architecture.md','utf8');
for(const term of ['lib/domain','lib/server','dependency direction','client']) assert.ok(architecture.includes(term), 'architecture.md missing '+term);
const adrs=readdirSync('docs/adr').filter(f=>/^00\d\d-.*\.md$/.test(f));
assert.ok(adrs.length>=4, 'expected at least 4 ADRs, found '+adrs.length);
const agents=readFileSync('AGENTS.md','utf8');
for(const s of ['pnpm test','pnpm run typecheck','pnpm run lint','pnpm run build','0 errors']) assert.ok(agents.includes(s), 'AGENTS.md missing '+s);
const contributing=readFileSync('CONTRIBUTING.md','utf8');
assert.ok(contributing.toLowerCase().includes('branch protection'), 'CONTRIBUTING.md missing branch-protection note');
console.log('Architecture contracts passed');
