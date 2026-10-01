// Results-specific row mapping + SQL select alias map. Extracted from
// app/api/results/route.ts so that route handlers stay thin delegators and the
// shared helpers can be imported by sibling routes (e.g. lifecycle) without a
// route file doubling as a shared module.

import type { Result, Status } from "../domain/model";
import type { ResultRow } from "./rows";

/** Map a raw D1 results row (string columns) into a Result (parsed JSON fields). */
export function resultRow(row: ResultRow): Result {
  return {
    ...row,
    status: row.status as Status,
    customValues: JSON.parse(row.customValues),
    formSnapshot: row.formSnapshot ? JSON.parse(row.formSnapshot) : undefined,
  };
}

/** Shared SQL select alias map for the `results` table (used by GET/PUT/lifecycle). */
export const select =
  "run_id AS runId,started_at AS startedAt,approved_at AS approvedAt,approved_by AS approvedBy,form_snapshot AS formSnapshot,id,status,actual,notes,tester,tester_id AS testerId,tester_email AS testerEmail,evidence_url AS evidenceUrl,document_number AS documentNumber,linked_document_number AS linkedDocumentNumber,custom_values AS customValues,version,updated_at AS updatedAt";
