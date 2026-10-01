// API error type + response helpers. Separated from data access (db.ts) so the
// error surface is reusable independently of the D1/R2 bindings.

export class ApiError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

/** Run a validator; rethrow its first error as a localized ApiError. */
export function checked<T>(fn: () => T): T {
  try {
    return fn();
  } catch (e) {
    throw new ApiError(e instanceof Error ? e.message : "بيانات غير صحيحة.");
  }
}

/** Reject cross-origin mutating requests. Returns a 403 response or null. */
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json({ error: "الطلب غير مسموح." }, { status: 403 });
  return null;
}

/** Normalize a caught error into a JSON 503/4xx response with private caching. */
export function unavailable(error: unknown) {
  if (error instanceof ApiError)
    return Response.json(
      { error: error.message },
      { status: error.status, headers: { "Cache-Control": "private, no-store" } },
    );
  console.error("ONYX storage operation failed", error);
  return Response.json(
    { error: "تعذر تحميل أو حفظ البيانات. بقيت المدخلات في النموذج؛ أعد المحاولة." },
    { status: 503 },
  );
}
