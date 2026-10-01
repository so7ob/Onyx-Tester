import { env } from "cloudflare:workers";

// D1 + R2 binding access. These are the only places that touch the Worker
// storage bindings directly; route handlers and auth go through here.

export function db() {
  if (!env.DB) throw new Error("تعذر الاتصال بسجل الاختبارات.");
  return env.DB;
}

export function bucket() {
  if (!env.BUCKET) throw new Error("تعذر الاتصال بمرفقات الأدلة.");
  return env.BUCKET;
}
