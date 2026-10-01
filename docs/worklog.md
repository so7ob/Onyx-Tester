# سجل بناء أداة اختبارات ترقية ONYX

المصدر المعتمد: FIL-2026-001333، خطة اختبار العمليات الأساسية بحسب الشاشات V2.1. معرّف المصدر: libfile_657b0978b6548191b431edafb51ac3c8. حُفظ SHA-256 في app/data/plan.json. روجعت أيضاً نماذج الشاشات السابقة، واعتمد نص الخطة الكامل بدلاً من النصوص المقتضبة في بعض نماذج Word.

المخرجات: 18 نظاماً، 180 نموذج شاشة مستقل، 245 اختباراً تنفيذياً موثقاً. أسماء الشاشات ونصوص الإجراءات والنتائج والمتطلبات نُقلت من الخطة، مع ربط كل اختبار بالورقة والصف. استُبعدت صفوف الملخص المكررة، ولم تُنشأ شاشات لحالات إدارة المعلومات الثلاث التي لم يوثق اسم شاشتها.

النتائج والملاحظات وروابط الأدلة محفوظة في قاعدة بيانات. ملفات الأدلة محفوظة بشكل مستقل وترتبط برقم الاختبار. منع حفظ نتيجة ناجحة أو فاشلة أو متعذرة دون نتيجة فعلية. حماية التعديلات غير المحفوظة، ومنع الكتابة فوق نتيجة حُدّثت في نافذة أخرى بواسطة رقم النسخة. النشر خاص ويفرض وصول المالك فقط.

التحقق: فحص TypeScript، والتحقق من فرادة الاختبارات وربط كل اختبار بشاشة واحدة مطابقة للمصدر، واختبارات التحقق من المدخلات وروابط الأدلة وحساب الملخص والبحث. في المعاينة الداخلية: اختيار الأستاذ العام، فتح طلبات قيود اليومية وحدها، تسجيل نتيجة فاشلة تجريبية وملاحظات، حفظها واسترجاعها بعد إعادة تحميل الصفحة، ظهورها في قائمة المتعثرة، البحث بمعرفها، اختبار البحث دون نتيجة، التصفية للحالات الناجحة، ورفع ملف دليل تجريبي وربطه بالاختبار. ظهر تنبيه التعديلات غير المحفوظة ونجح الانتقال بعد التأكيد.

بيانات اختبار الأداة تخص المعاينة المحلية فقط ولا تُنسخ إلى قاعدة الإنتاج. اختبارات الأداة لا تمثل اختبار نظام ONYX نفسه أو إعلان اجتيازه. دعم WebMCP مُضاف بشرط توفره؛ لم تسمح المعاينة بتشغيله لأن document.modelContext غير متاح.

تاريخ التنفيذ: 2026-10-01، توقيت اليمن. النشر يحافظ على وصول خاص بالمالك، دون إضافة مستخدمين أو مجموعات أو دعوات.

## تطوير المستخدمين ونماذج الاختبارات والتهيئة

أضيفت واجهات إدارة المستخدمين والصلاحيات، ومحرر حقول مستقل لكل شاشة، وتهيئة بيانات مستقلة لكل اختبار. الأدوار: مدير النظام، مصمم النماذج، مسؤول تهيئة البيانات، منفذ اختبارات، مشاهد. يمكن تخصيص الإجراءات والأنظمة، وإيقاف الحساب دون حذف تاريخه. تُفرض الصلاحيات على جميع واجهات الخادم، بما فيها تنزيل الأدلة. الهوية من ترويسات Sites الموثقة، ويُربط الحساب بالمعرف الثابت عند أول دخول. يُهيأ المالك بالبريد الذي تحقق منه سجل الموقع ويُربط بمعرفه الثابت، وتظل صلاحياته ثابتة. إضافة سجل مستخدم لا تغير مشاركة الموقع أو تدعو أحداً.

أرقام الوثيقة المنشأة والمرتبطة حقول تنفيذ ثابتة. يدعم المحرر نصاً قصيراً أو طويلاً، أرقاماً ومبالغ، تواريخ، قوائم، مربعات اختيار، عناوين ونصوصاً إرشادية. تشمل الخصائص الإلزامية، القيمة الافتراضية، الحدود الرقمية، التعليمات، العرض، والترتيب والإخفاء، مع معاينة. هوية ونوع وموضع الحقل المحفوظ ثابتة؛ يُخفى للحفاظ على القيم السابقة. الحقول المطلوبة تُراجع عند حسم النتيجة أو إعلان جاهزية التهيئة. الحد 50 حقلاً إضافياً للشاشة. جميع أسماء شاشات ONYX وبيانات الخطة الأصلية بقيت كما وردت في المصدر.

تشمل التهيئة الطرف والمبلغ والعملة والوثيقة المرجعية والتاريخ والفرع والتعليمات والحقول الإضافية. يمكن حفظ مسودة أو إعلان جاهزية؛ الجاهزية تتطلب الطرف والمبلغ والعملة والحقول المطلوبة. تظهر البيانات المجهزة بجانب نموذج التنفيذ. لا ينشئ هذا الحفظ أي وثيقة في ONYX.

أضيفت ترحيلات قاعدة البيانات دون تعديل الترحيل الأصلي، مع الاحتفاظ بالنتائج السابقة. التخزين الدائم ونسخ التعديل تمنع الكتابة فوق تحديث متزامن. الهوية المحلية التجريبية مقيدة ببناء التطوير ومضيف المعاينة، وتُستبعد من بناء الإنتاج. المتغير ONYX_OWNER_EMAIL سري على الخادم ولا يظهر في حزمة المتصفح. لا تُنسخ قاعدة المعاينة أو حساباتها التجريبية إلى الإنتاج.

التحقق: TypeScript وبناء الإنتاج، اختبارات المصدر الأصلية، واختبارات تكامل SQL للترحيل والحفظ والاسترجاع وأرقام الوثائق والحدود والإلزامية والتواريخ والصفر وfalse وإخفاء الحقول وتعارض النسخ، ورفض المجهول والموقوف والصلاحيات المخالفة والنظام غير المسموح وطلب الموقع الآخر. جرى اختبار هذه القيود في واجهات النتائج والأدلة والتهيئة والمحرر والمستخدمين. اختبار الواجهة: إضافة حقل تنفيذ مطلوب وحقل تهيئة، حفظهما، حفظ طرف ومبلغ وعملة ومرجع، عرضها داخل التنفيذ، منع الحفظ دون الحقل المطلوب، حفظ النتيجة مع أرقام الوثائق، الاسترجاع بعد التحميل، البحث برقم الوثيقة، استقلال شاشة أخرى، والتحذير من التعديلات غير المحفوظة. أضيف حساب محلي موقوف بنظام واحد وصلاحيات مقيدة وتأكد بقاؤه بعد التحميل. روجعت الواجهة العربية RTL دون تجاوز أفقي في نافذة الاختبار.

## المحرر الشامل على مستوى الاختبار — 2026-10-01

أصبح اسم المختبر هو المستخدم الموثق، غير قابل للإدخال اليدوي؛ يفرض الخادم الاسم ويسجل معرف المستخدم الثابت وبريده في كل حفظ جديد. تُحفظ الأسماء القديمة كما هي إلى حين إعادة تنفيذ الاختبار. اسم المالك من ترويسة الاسم الموثقة مع فك UTF-8 عند وجود تعريف الترميز، ثم الاسم السابق أو البريد عند غيابها. لا تتغير حدود الوصول.

اختيار صريح للنظام ثم الشاشة ثم الاختبار في المحرر والتهيئة، وروابط مباشرة من التنفيذ والتهيئة إلى محرر الاختبار نفسه. يحرر النموذج جميع حقول التعليمات والتنفيذ والتهيئة: العناوين والمحتوى والتعليمات والأنواع المتوافقة والقيم الافتراضية والقوائم والحدود والإلزامية والعرض والترتيب والظهور. هوية الحقول الأساسية ثابتة؛ اسم المستخدم وقيم المرفقات ومرجع المصدر تُشتق من مصادرها. استعادة الأصل للحقول الأساسية، ونسخ الحقول المخصصة، والتراجع والإعادة، والترتيب بالسحب أو الأزرار، والبحث عن حقل. معاينة تستخدم المكوّن ذاته الذي يعرض التنفيذ والتهيئة.

الحقول القديمة للشاشة موروثة وتظل ظاهرة ومحفوظة إلى أن يُخصّص نموذج الاختبار. لكل اختبار إعداد مستقل، حتى عند وجود اختبارين في الشاشة نفسها. يخزن النموذج وسجل إصداراته معاً في معاملة D1؛ استعادة إصدار تضعه في المحرر للمراجعة والحفظ، وتبقي الحقول الأحدث مخفية لحماية مدخلاتها. يحتفظ الخادم بالمدخلات التاريخية للحقول المخفية. الحد الجديد 100 حقل مخصص للاختبار. يوضح الملخص أن التهيئة السابقة تحتاج مراجعة إذا أضيفت حقول مطلوبة ناقصة. خُفّف ملخص التقدم في واجهات الإدارة لتقريب أدوات التحرير.

التحقق الآلي: صحة تغطية المصدر، ترحيل البيانات القديمة، الوراثة، تخصيص التعليمات والحقول الأساسية والمخصصة، استقلال اختبارين في شاشة واحدة، منع انتحال اسم المختبر وحفظ هويته، إسناد التنفيذ إلى مستخدم آخر ذي صلاحية، قيم الصفر وfalse، الإلزامية والأنواع والقوائم، الملفات المطلوبة، إخفاء الحقول مع حفظ قيمها، مراجعة جاهزية التهيئة، تعارض النسخ، حماية المصدر، نطاق الأنظمة والصلاحيات، وسجل الإصدارات واستعادته والتراجع الذري عند فشل إضافة السجل. فحص TypeScript وبناء الإنتاج واستبعاد هوية المعاينة منه.

التحقق بالمتصفح الداخلي: ظهور اختيار الاختبار، تغيير عنوان رقم الوثيقة الأساسي، إضافة حقول التنفيذ والتهيئة وظهورها في مواضعها، تحرير نص الإجراء، قيم افتراضية ومعاينة، تراجع وإعادة، ترتيب حقل، حفظ النموذج وسجل إصدارين واستعادة إصدار للمراجعة والحفظ، اسم المختبر للقراءة فقط ومطابق للمستخدم، حفظ أرقام الوثائق والقيم المضافة والتهيئة ثم استرجاعها بعد إعادة التحميل، تنبيه التعديلات غير المحفوظة، وفصل حقول اختبارين ضمن الإقفال الشهري / الفتري. الواجهة RTL دون تجاوز أفقي في نافذة الاختبار. بيانات هذه الاختبارات محلية ولا تُنشر.

النشر على الموقع نفسه مع إبقاء الوصول الخاص بالمالك؛ لا حسابات جديدة في الإنتاج ولا دعوات أو توسيع للمشاركة.


## إصلاح بقاء الحقول والقيم السابقة

شُخّص البلاغ من سجل الموقع وقراءة تعريفات النماذج والتهيئة دون تعديل بيانات الإنتاج: طلبات حفظ المحرر وصلت بنجاح إلى النسخة الثالثة؛ لذلك لم يُفترض أن المشكلة مجرد نسخة متصفح قديمة. أُعيد إنتاج الخلل في المعاينة: تحديد سند القبض / ONYX-OPS-0008-S02 في المحرر ثم فتح التهيئة عبر القائمة كان يعود إلى ONYX-OPS-0001-S01 بسبب ثلاث حالات اختيار مستقلة. كذلك كانت تهيئة السجل المحفوظ تتجاوز القيم الافتراضية الجديدة بالكامل، وكانت مدخلات المعاينة التجريبية تحجب تغيير القيمة الافتراضية.

أصبح الاختبار المختار مشتركاً بين المحرر والتهيئة والتنفيذ ويُحفظ في رابط الصفحة لإعادة التحميل. عند فتح الرابط الأساسي لأول مرة، يختار المحرر والتهيئة أحدث نموذج معدل ضمن صلاحيات المستخدم. تُقرأ أحدث تعريفات الاختبار عند فتحه، ويُمنع عرض النموذج السابق أثناء التحميل أو فشل القراءة، ويتحقق الحفظ من التعريف المقروء من الخادم. يظهر رقم إصدار النموذج في التنفيذ والتهيئة. تُملأ المدخلات الفارغة والجديدة بالقيم الافتراضية دون تغيير القيم المسجلة غير الفارغة أو الصفر أو false أو مدخلات الحقول المخفية. لاستبدال مدخلات محفوظة، أضيف زر تطبيق قيم النموذج مع جدول القيم الحالية والجديدة ثم تطبيق على المسودة والحفظ. لا يغير هذا الإجراء هوية المختبر أو حالة التنفيذ أو الجاهزية. أُصلحت معاينة الحقول عند تعديل قيمها ونوعها وموضعها، وأصبح محتوى النص الإرشادي قابلاً للتحرير والعرض.

التحقق الآلي: تطابق الاختبار في رابط الصفحة واستبعاد المعرفات غير المسموحة، قراءة آخر تعريف بعد الحفظ، ملء الفارغ والجديد، حفظ القيم غير الفارغة والتاريخية والصفر وfalse، تطبيق القيم الجديدة وحفظها واسترجاعها، تحديث المعاينة، وجميع اختبارات الهوية والصلاحيات والنسخ وسجل النماذج السابقة.

التحقق بالمتصفح الداخلي: سند القبض / ONYX-OPS-0008-S02، تسجيل مبلغ سابق 500000 ثم تحرير عنوانه وقيمته الافتراضية إلى 700000 وإضافة حقل تهيئة، ظهور الحقل والعنوان الجديدين من القائمة، مراجعة المبلغ الجديد وتطبيقه وحفظه وظهوره في ملخص التنفيذ بعد التحديث. تحرير نموذج الاختبار من نافذة أخرى وظهور حقول التنفيذ الجديدة عند إعادة فتح الاختبار، حفظها واسترجاعها، عدم ظهورها في الاختبار التالي ضمن الشاشة نفسها، تحديث المعاينة من قيمة تجريبية قديمة إلى الافتراضية الجديدة، وتحرير محتوى نص إرشادي وظهوره. اتجاه RTL وعرض الصفحة دون تجاوز أفقي. بيانات التحقق محلية فقط، ولم تُكتب في الإنتاج. لم يتغير نطاق الوصول أو أي مستخدم أو دعوة أو صلاحية.

## 2026-10-01 — Visual editor and frozen execution definitions

Implemented responsive per-field properties, searchable element palette, dynamic field selection, deletion from new revisions, bulk hide/delete, flat sections, typed editable tables, conditional presentation/validation, safe arithmetic formulas with server recomputation, independently saved drafts and explicit publications, immutable execution form snapshots, new-run archival with evidence references, approvals and separate publishing/review permissions, JSON independent template import/export, DOCX/XLSX logical content exports and print styles. Legacy definitions and evidence receive non-destructive migrations 0004 and 0005. Deliberately cleared values are preserved on reopening.

Validation and remaining unimplemented requirements are recorded honestly in `docs/form-builder-guide.md`. This is a substantial implemented extension, not full completion of the attached 19-section specification.

## GitHub source import — 2026-10-01 — Issue #1
Source: original Sites project appgprj_6abd87c86b04819183fa71a0a95de282; source Git commit 82248817a5cd74a127726ef030324001c8889159, clean working tree at extraction. This is the source previously published in deployment appgdep_6abe876386a481918227f9c22e529403 (2026-10-01T16:17:07Z), version appgprj_6abd87c86b04819183fa71a0a95de282~appgver_0ba3afce37dc8191bee938a5a07b3bc1. No later uncommitted application edits were present. Original history is not fabricated/imported as historical commits; source is one new import commit.
Destination: private organization repository so7ob/Onyx-Tester; bootstrap main, develop, chore/1-import-site. Original source checkout and Site configuration remain untouched; independent working copy used. No publish, audience change or service/data migration.
Excluded generated tsconfig.tsbuildinfo, local dependencies, .wrangler databases, .sites-runtime state, actual secrets and build outputs. Original .env.example retained with placeholder; source plan and migration seeds retained as application definitions, not live user records.
Added governance, CI, test/typecheck scripts, architecture contracts and service setup documentation. Full original lint baseline reports 45 errors and 14 warnings; not disabled or represented as passing. PR remains draft pending lint repair, successful CI and independent review.
Remote branch protections NOT enabled: connector exposes no ruleset/protection mutation and browser has no authenticated session. Administrator must apply rules documented in CONTRIBUTING.md. GitHub is intended development authority; this remains a draft import until accepted. No automatic Sites publishing bridge was added.
Validation in separate import checkout: model and enhancement behavior suites PASS; architecture contracts PASS; TypeScript --noEmit PASS; portable Vinext production build PASS; staged git diff --check PASS after trimming one original trailing blank line in tests/model.mjs. Existing complete lint: 45 errors / 14 warnings (code baseline, not external failure). CI has not yet been observed. Build/test reused existing installed dependencies; clean network dependency installation is deferred to GitHub Actions.

## 2026-10-01 — Lint blocker repair (Issue #4)

The import worklog recorded that the existing lint reported 45 errors / 14 warnings
and that this blocked merging until repaired. `develop` carried that failing lint
baseline, so CI (`pnpm run lint`) was red. This change repairs the lint blocker so
all standard gates pass on `develop`.

Baseline recorded on `develop` before the change: `pnpm test` PASS, `pnpm run
typecheck` PASS, `pnpm run lint` FAIL (45 errors / 14 warnings), `pnpm run build`
PASS. Breakdown: 36 `@typescript-eslint/no-explicit-any`, 7
`react-hooks/set-state-in-effect`, 1 `react-hooks/refs`, 1
`@typescript-eslint/no-unsafe-function-type`; 7 `@typescript-eslint/no-unused-vars`,
7 `react-hooks/exhaustive-deps`.

Approach (behavior-preserving, no rule weakening, no file exclusion):
- Added `app/api/types.ts` with typed D1 row interfaces (`ResultRow`, `EvidenceRow`,
  `ScreenFormRow`, `TestDataRow`/`TestDataRowData`, `PublishedFormRow`,
  `AppUserRow`, `TestFormVersionRow`, `TestFormRow`, `CountRow`, `EmailRow`).
  Replaced `.first<any>()` / `.all<any>()` / `(x:any)=>` across all API routes.
- Made `readResponse`/`put` generic; call sites pass explicit response shapes.
- Request bodies cast to their domain types (`Result`, `TestData`) before the
  existing `unknown`-accepting validators run; pre-validation string access uses
  null-safe `?? ''` so the server still rejects unknown tests.
- `resultRow` now returns `Result` with `status` cast to `Status`; `conflict()`
  annotated `:never` so null-guards narrow.
- Replaced the `Function` tool-registration type with a typed signature.
- Refactored the 7 `set-state-in-effect` effects to verified-acceptable patterns:
  render-phase state adjustment for prop-sync (no effect), async-IIFE with
  `setState` after `await` for data load, `Promise.resolve().then(...)` deferral for
  the one-shot route sync, and an effect for ref sync. The `react-hooks/refs`
  write-during-render moved to an effect.
- Removed unused imports (`Evidence`, `nonInputs`, `getTestForm`/`formSelect`/
  `testFormRow`, `second`/`screen`) and resolved `exhaustive-deps` warnings by
  adding missing deps or using a ref for the unstable callback.

Result: `pnpm test` PASS, `pnpm run typecheck` PASS, `pnpm run lint` PASS (0 errors
/ 0 warnings), `pnpm run build` PASS, `git diff --check` clean. No API contract,
page title, data id, schema, storage, Arabic RTL/Tajawal, draft-vs-published
separation, result↔form version binding, server-side tester identity/permissions,
or evidence integrity changed. No DB migration, no production data touched.
