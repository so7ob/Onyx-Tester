// Typed shapes for D1 query results. These mirror the column aliases used by the
// SELECT statements in the API routes and the Drizzle schema in db/schema.ts.
// Replacing `any` row access with these interfaces gives compile-time safety over
// storage reads without changing any runtime behavior or SQL.

/** Row from `results` using the shared `select` alias map (see results/route.ts). */
export interface ResultRow {
  runId: string;
  startedAt: string;
  approvedAt: string;
  approvedBy: string;
  formSnapshot: string;
  id: string;
  status: string;
  actual: string;
  notes: string;
  tester: string;
  testerId: string;
  testerEmail: string;
  evidenceUrl: string;
  documentNumber: string;
  linkedDocumentNumber: string;
  customValues: string;
  version: number;
  updatedAt: string;
}

/** Row from `evidence` as selected by the results GET and evidence routes. */
export interface EvidenceRow {
  id: string;
  testId: string;
  runId: string;
  name: string;
  size: number;
  createdAt?: string;
}

/** Row from `screen_forms`. */
export interface ScreenFormRow {
  screenId: string;
  fields: string;
  version: number;
  updatedAt: string;
}

/** Row from `test_data` (full, including version/updatedAt). */
export interface TestDataRow {
  testId: string;
  party: string;
  amount: string;
  currency: string;
  documentNumber: string;
  date: string;
  branch: string;
  notes: string;
  customValues: string;
  ready: number;
  version: number;
  updatedAt: string;
}

/** Partial `test_data` row used for the pre-write protection read. */
export type TestDataRowData = Pick<
  TestDataRow,
  'party' | 'amount' | 'currency' | 'documentNumber' | 'date' | 'branch' | 'notes' | 'customValues' | 'ready'
>;

/** Row from `published_forms`. */
export interface PublishedFormRow {
  testId: string;
  snapshot: string;
}

/** Row from `app_users` (SELECT *). `user_id` is nullable until first binding. */
export interface AppUserRow {
  id: string;
  email: string;
  user_id: string | null;
  name: string;
  role: string;
  permissions: string;
  systems: string;
  active: number;
  version: number;
  updated_at: string;
}

/** Row from `test_form_versions`. */
export interface TestFormVersionRow {
  version: number;
  createdAt: string;
  actorName: string;
  snapshot: string;
}

/** Row from `test_forms` using the shared `formSelect` alias map. */
export interface TestFormRow {
  testId: string;
  screenId: string;
  fields: string;
  version: number;
  baseVersion: number;
  updatedAt: string;
  updatedBy: string;
}

/** Single-column COUNT result. */
export interface CountRow {
  total: number;
}

/** Minimal email-only lookup row. */
export interface EmailRow {
  email: string;
}
