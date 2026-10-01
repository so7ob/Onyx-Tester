declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    ONYX_OWNER_EMAIL?: string;
  }
}
declare const __ONYX_LOCAL_PREVIEW__: boolean;
